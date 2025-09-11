import * as fs from 'node:fs';

export const createTmpFile = async () => {
    fs.writeFileSync('tmp', 'tmp', { encoding: "utf-8" });
    console.log('tmp file created');

}

export const removeTmpFile = async () => {
    fs.unlinkSync('tmp');
    console.log('tmp file removed');

}