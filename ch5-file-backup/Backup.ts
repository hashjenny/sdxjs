import * as crypto from "node:crypto"
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

class Backup {
    rootPath: string;
    fileType: string;
    backupPath: string;
    curentFilesHash: Map<string, string>

    constructor(rootPath: string, fileType: string, backupPath: string) {
        this.rootPath = rootPath;
        this.fileType = fileType;
        this.backupPath = backupPath;
        this.curentFilesHash = new Map<string, string>()
    }

    private getHash(content: string) {
        const hash = crypto.createHash("sha1").setEncoding("hex")
        hash.write(content)
        hash.end()
        return hash.read()
    }

    async getCurrentFilesHash() {
        const files = await fs.readdir(this.rootPath)
        for (const file of files) {
            const filePath = path.resolve(this.rootPath, file)
            const stat = await fs.stat(filePath)
            if (stat.isFile()) {
                const content = await fs.readFile(filePath, { encoding: "utf-8" })
                this.curentFilesHash.set(filePath, this.getHash(content))
            }
        }
    }

    private async fileExist(file: string) {
        try {
            await fs.access(file)
            return true
        } catch {
            return false
        }
    }

    async readBackupFilesHash(file: string = 'head.json') {
        const filePath = path.resolve(this.backupPath, file)
        const content = await fs.readFile(filePath, { encoding: 'utf-8' })
        const data = JSON.parse(content)
        return new Map<string, string>(Object.entries(data))
    }

    async storeBackupFiles() {
        for (const [filePath, fileHash] of this.curentFilesHash) {
            const filename = fileHash + '.json'
            const backupFilePath = path.resolve(this.backupPath, filename)
            if (!this.fileExist(backupFilePath)) {
                await fs.copyFile(filePath, backupFilePath)
            }
        }
        const jsonContent = JSON.stringify(Object.fromEntries(this.curentFilesHash))
        const jsonFile = new Date().getTime()
        // await fs.writeFile()
    }
}

// 这里的 rootPath 传入的是 './'，它的含义取决于运行时的当前工作目录（cwd）
export default new Backup('./ch5-file-backup', '.ts', './ch5-file-backup/backup')