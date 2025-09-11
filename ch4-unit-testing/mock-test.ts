import { mockReadFile } from './mock.ts'

for (let index = 0; index < 7; index++) {
  try {
    console.log(await mockReadFile('./main.ts', 'utf-8'));
  } catch (error) {
    console.error(error);
  }

}