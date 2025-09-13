import * as crypto from "node:crypto"
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

type HashPair = {
    file: string,
    hash: string
}

export type FilesInfo = {
    newFiles: HashPair[],
    changeFiles: HashPair[],
    deleteFiles: HashPair[],
    renameFiles: HashPair[]
}


type BackupOptions = {
    useJson?: boolean,
    useOurHash?: boolean
}

class Backup {
    rootPath: string;
    backupPath: string;
    headJsonPath: string
    currentFilesHash: Map<string, string>
    useJson: boolean
    useOurHash: boolean

    constructor(rootPath: string, backupPath: string, options?: BackupOptions) {
        this.rootPath = rootPath;
        this.backupPath = backupPath;

        this.headJsonPath = path.resolve(backupPath, "head.json")
        this.currentFilesHash = new Map<string, string>()

        this.useJson = options?.useJson ?? true
        this.useOurHash = options?.useOurHash ?? false
    }

    private getHash(filename: string, content: string) {
        const hash = crypto.createHash("sha1").setEncoding("hex")
        hash.write(content)
        hash.end()
        let prefix = ''
        if (this.useOurHash) {
            prefix = `${filename}-`
        }
        return prefix + hash.read()
    }

    private reverseMap(map: Map<string, string>) {
        return new Map<string, string>(Array.from(map.entries()).map(([k, v]) => [v, k]))
    }

    async fileExist(file: string) {
        try {
            await fs.access(file)
            return true
        } catch {
            return false
        }
    }

    async init() {
        if (!(await this.fileExist(this.rootPath))) {
            await fs.mkdir(this.rootPath, { recursive: true })
        }
        if (!(await this.fileExist(this.backupPath))) {
            await fs.mkdir(this.backupPath, { recursive: true })
        }
        if (!(await this.fileExist(this.headJsonPath))) {
            await fs.writeFile(this.headJsonPath, '[]', { encoding: 'utf-8' })
        }
    }

    async removeAllBackFile() {
        const files = await fs.readdir(this.backupPath)
        for (const file of files) {
            const filePath = path.resolve(this.backupPath, file)
            await fs.unlink(filePath)
        }
    }

    async getCurrentFilesHash() {
        const files = await fs.readdir(this.rootPath)
        for (const file of files) {
            const filePath = path.resolve(this.rootPath, file)
            const stat = await fs.stat(filePath)
            if (stat.isFile()) {
                const content = await fs.readFile(filePath, { encoding: "utf-8" })
                this.currentFilesHash.set(filePath, this.getHash(file, content))
            }
        }
    }

    async readHeadJson() {
        const content = await fs.readFile(this.headJsonPath, { encoding: 'utf-8' })
        return JSON.parse(content)
    }

    async writeHeadJson(arr: string[]) {
        await fs.writeFile(this.headJsonPath, JSON.stringify(arr), { encoding: 'utf-8' })
    }

    async readBackupFilesHash(file?: string) {
        let filePath = ''
        if (file) {
            if (await this.fileExist(path.resolve(this.backupPath, file))) {
                throw new Error(`cannot find ${file} in backup folder`);
            }
            filePath = path.resolve(this.backupPath, file)
        } else {
            const headJson = await this.readHeadJson()
            if (headJson.length === 0) {
                throw new Error('no backup file');
            }
            filePath = path.resolve(this.backupPath, headJson.at(-1))
        }

        if (filePath.endsWith('.json')) {
            return await this.readFileHashFromJson(filePath)
        }
        return await this.readFileHashFromCsv(filePath)
    }

    private async readFileHashFromJson(filePath: string) {
        const content = await fs.readFile(filePath, { encoding: 'utf-8' })
        const data = JSON.parse(content)
        return new Map<string, string>(Object.entries(data))
    }

    private async readFileHashFromCsv(filePath: string) {
        const content = await fs.readFile(filePath, { encoding: 'utf-8' })
        const lines = content.split('\n').filter(e => e)
        const map = new Map<string, string>()
        for (const line of lines) {
            const [key, value] = line.split(',').map(e => e.trim())
            if (key && map) {
                map.set(key, value)
            }
        }
        return map
    }

    async storeFiles(hook?: (...args: any[]) => boolean) {
        try {
            if (hook && !hook()) {
                return
            }
        } catch {
            return
        }

        await this.getCurrentFilesHash()

        for (const [filePath, fileHash] of this.currentFilesHash) {
            const filename = fileHash + '.bck'
            const backupFilePath = path.resolve(this.backupPath, filename)
            if (!(await this.fileExist(backupFilePath))) {
                await fs.copyFile(filePath, backupFilePath)
            }
        }

        const fileType = this.useJson ? ".json" : ".csv"
        const filename = await this.getUniqueFilename(fileType)
        await this.storeFileHash(this.currentFilesHash, filename, fileType)

        const head = await this.readHeadJson()
        head.push(filename)
        await this.writeHeadJson(head)
    }

    private async getUniqueFilename(fileType: string) {
        const date = new Date()
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        let file = path.resolve(this.backupPath, `${dateStr}`)
        let n = 1
        while (await this.fileExist(file + fileType)) {
            file = path.resolve(this.backupPath, `${dateStr}(${n})`)
            n++
        }

        file += fileType
        return file
    }

    private async storeFileHash(map: Map<string, string>, filename: string, fileType: string) {
        let fileContent = ''
        if (fileType === '.json') {
            fileContent = JSON.stringify(Object.fromEntries(map))
        } else {
            fileContent = [...map.entries()].map(([path, hash]) => `${path},${hash}`).join('\n')
        }

        await fs.writeFile(filename, fileContent, { encoding: 'utf-8' })
    }

    async migrateCsvToJson(csvFile: string) {
        if (!csvFile.endsWith('.csv')) {
            throw new Error('not a csv file')
        }
        const filePath = path.resolve(this.backupPath, csvFile)
        if (!csvFile) {
            throw new Error('File do not exit')
        }
        const map = await this.readFileHashFromCsv(filePath)
        const jsonFile = path.resolve(this.backupPath, path.basename(csvFile, '.csv') + '.json')
        csvFile = path.resolve(this.backupPath, csvFile)
        await this.storeFileHash(map, jsonFile, '.json')

        let head = await this.readHeadJson()
        head = head.map((e: string) => e === csvFile ? jsonFile : e)
        await this.writeHeadJson(head)

        await fs.unlink(csvFile)
    }

    async migrateJsonToCsv(jsonFile: string) {
        if (!jsonFile.endsWith('.json')) {
            throw new Error('not a json file')
        }
        const filePath = path.resolve(this.backupPath, jsonFile)
        if (!jsonFile) {
            throw new Error('File do not exit')
        }
        const map = await this.readFileHashFromJson(filePath)
        const csvFile = path.resolve(this.backupPath, path.basename(jsonFile, '.json') + '.csv')
        jsonFile = path.resolve(this.backupPath, jsonFile)
        await this.storeFileHash(map, csvFile, ".csv")

        let head = await this.readHeadJson()
        head = head.map((e: string) => e === jsonFile ? csvFile : e)
        await this.writeHeadJson(head)

        await fs.unlink(jsonFile)
    }

    async restoreFiles(backupFile?: string) {
        const fileHash = await this.readBackupFilesHash(backupFile)
        // for (const [filePath, hash] of fileHash) {
        //     const filename = path.resolve(this.backupPath, hash)
        //     if (await this.fileExist(filename)) {
        //         await fs.copyFile(filename, filePath)
        //     } else {
        //         console.error(`cannot find ${path.basename(filename)} in backup folder`);
        //     }
        // }
        // 该程序应在需要时才执行文件操作，例如，如果内容未更改，则不应删除文件并重新添加
        const { newFiles, changeFiles, deleteFiles, renameFiles } = await this.compareFiles(backupFile)
        const backupReverseMap = this.reverseMap(fileHash)
        for (const { file, hash } of newFiles) {
            await fs.unlink(file)
        }
        for (const { file, hash } of changeFiles) {
            const backupFile = path.resolve(this.backupPath, hash)
            if (await this.fileExist(backupFile)) {
                await fs.copyFile(backupFile, file)
            } else {
                console.error(`cannot find ${path.basename(backupFile)} in backup folder`);
            }
        }
        for (const { file, hash } of deleteFiles) {
            const backupFile = path.resolve(this.backupPath, hash)
            if (await this.fileExist(backupFile)) {
                await fs.copyFile(backupFile, file)
            } else {
                console.error(`cannot find ${path.basename(backupFile)} in backup folder`);
            }
        }
        for (const { file, hash } of renameFiles) {
            const oldPath = backupReverseMap.get(hash)!
            await fs.rename(oldPath, file)
        }
        await this.getCurrentFilesHash()

    }

    async compareFiles(backupFile?: string) {
        const newFiles: HashPair[] = []
        const changeFiles: HashPair[] = []
        const deleteFiles: HashPair[] = []
        const renameFiles: HashPair[] = []
        await this.getCurrentFilesHash();
        const currentMap = this.currentFilesHash
        const headMap = await this.readBackupFilesHash(backupFile)

        const currentReverseMap = this.reverseMap(currentMap)
        const headReverseMap = this.reverseMap(headMap)
        for (const [hash, path] of currentReverseMap.entries()) {
            if (headReverseMap.has(hash)) {
                const oldPath = headReverseMap.get(hash)!
                if (oldPath !== path) {
                    renameFiles.push({ file: path, hash })
                    headMap.delete(oldPath)
                    currentMap.delete(path)
                }
            }
        }

        for (const [path, hash] of currentMap) {
            if (!headMap.has(path)) {
                newFiles.push({ file: path, hash: hash })
            } else if (headMap.get(path) === hash) {
                headMap.delete(path)
            } else if (headMap.get(path) !== hash) {
                changeFiles.push({ file: path, hash: hash })
                headMap.delete(path)
            }
        }
        for (const [path, hash] of headMap) {
            deleteFiles.push({ file: path, hash: hash })
        }
        return { newFiles, changeFiles, deleteFiles, renameFiles } as FilesInfo
    }

    async getFileHistory(file: string) {
        file = path.isAbsolute(file) ? file : path.resolve(this.rootPath, file)
        const history: string[] = []
        const head = await this.readHeadJson()
        for (const backupFile of head) {
            const map = await this.readBackupFilesHash(backupFile)
            if (map.has(file)) {
                history.push(map.get(file)!)
            }
        }
        return history.join(' -> ')
    }

}

// 这里的 rootPath 传入的是 './'，它的含义取决于运行时的当前工作目录（cwd）
export default new Backup('./ch5-file-backup/', './ch5-file-backup/backup', { useJson: true, useOurHash: false })
