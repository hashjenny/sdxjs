import * as crypto from "node:crypto"
import * as fs from "node:fs"
import * as fsp from 'node:fs/promises'

type HashPair = {
    path: string,
    hash: string
}

export const main = async (args: string[]) => {
    const hash = crypto.createHash("sha1").setEncoding("hex")

    const filename = args[1]
    fs.createReadStream(filename).pipe(hash)
    hash.on("finish", () => {
        const sha1sum = hash.read()
        console.log(filename, sha1sum)
    })
}

export const hashExisting = async (dir: string) => {
    const hashMap = new Map<string, string>()
    const files = await fsp.readdir(dir)
    for (const file of files) {
        const path = `${dir}/${file}`
        const stat = await fsp.stat(path)
        if (stat.isFile()) {
            const content = await fsp.readFile(path, { encoding: "utf-8" })
            const hash = crypto.createHash("sha1").setEncoding("hex")
            hash.write(content)
            hash.end()
            hashMap.set(path, hash.read())
        }
    }
    return hashMap
}

export const findNew = async (dir: string, hashMap: Map<string, string>) => {
    const
}
