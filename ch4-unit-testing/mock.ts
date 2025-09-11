import * as fs from 'node:fs/promises'

const MOCK_READ_FILE_CONTROL = [false, false, true, false, true]

let count = 0

export const mockReadFile = async (filename: string, encoding: BufferEncoding) => {
    if (count < MOCK_READ_FILE_CONTROL.length && MOCK_READ_FILE_CONTROL[count]) {
        count += 1
        return await fs.readFile(filename, { encoding })
    } else {
        count += 1

        throw new Error(`fail to open ${filename} because of MOCK_READ_FILE_CONTROL`)
    }
}
