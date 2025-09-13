import backup from './Backup.ts';
import * as path from 'node:path';
import { test, beforeAll, afterAll, expect } from 'vitest';


beforeAll(async () => {
    // console.log('before all test');
    // await backup.removeAllBackFile()
    await backup.init()
})

afterAll(() => {
    // backup.removeAllBackFile()
})

test('backup folder exist', async () => {
    expect(backup.fileExist(backup.backupPath)).toBeTruthy();
    expect(backup.fileExist(backup.rootPath)).toBeTruthy();
    expect(backup.fileExist(backup.headJsonPath)).toBeTruthy();
})

test('get current files hash', async () => {
    await backup.getCurrentFilesHash()
    // expect(backup.currentFilesHash.size).toBe(4);
    expect(backup.currentFilesHash.get(path.resolve('./ch5-file-backup/Backup.ts'))).toBeTruthy();
    expect(backup.currentFilesHash.get(path.resolve('./ch5-file-backup/Backup.test.ts'))).toBeTruthy();

})

test('store backup files', async () => {

    await backup.getCurrentFilesHash()
    await backup.storeFiles()
    expect(backup.fileExist(path.resolve(backup.backupPath, 'head.json'))).toBeTruthy();
    // const files = await fs.readdir(backup.backupPath)
    // expect(files.length).toBe(6);
})

test('read backup files hash', async () => {
    const map = await backup.readBackupFilesHash()
    // expect(map.size).toBe(4);
    expect(map.get(path.resolve('./ch5-file-backup/Backup.ts'))).toBeTruthy();
    expect(map.get(path.resolve('./ch5-file-backup/Backup.test.ts'))).toBeTruthy();
})

test('restore files', async () => {
    const fileInfo = await backup.compareFiles()
    expect(fileInfo).toBeTruthy();
    expect(fileInfo.changeFiles.length).toBe(0);
    expect(fileInfo.deleteFiles.length).toBe(0);
    expect(fileInfo.newFiles.length).toBe(0);
})

test('csv 2 json', async () => {
    const csvFile = path.resolve(backup.backupPath, '2025-9-13.csv')
    const jsonFile = path.resolve(backup.backupPath, '2025-9-13.json')
    expect(await backup.fileExist(jsonFile)).toBeTruthy()
    expect(await backup.fileExist(csvFile)).toBeFalsy()
    await backup.migrateJsonToCsv('2025-9-13.json')
    expect(await backup.fileExist(csvFile)).toBeTruthy()
    expect(await backup.fileExist(jsonFile)).toBeFalsy()
    await backup.migrateCsvToJson('2025-9-13.csv')
})

test('compare files after change', async () => {
    const { newFiles, changeFiles, deleteFiles, renameFiles } = await backup.compareFiles()
    console.log(newFiles, changeFiles, deleteFiles, renameFiles);
    expect(newFiles.length).toBe(1);
    expect(changeFiles.length).toBe(2);
    expect(deleteFiles.length).toBe(2);
    expect(renameFiles.length).toBe(0);
})