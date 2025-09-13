// 编写一个小程序，使用 fs.createReadStream 和 fs.createWriteStream 将文件逐块复制，而不是将其读入内存然后再写出来

import fs, { createWriteStream } from 'node:fs'


export const main = () => {
    fs.createReadStream('.gitignore').pipe(createWriteStream('git_backup'))
}