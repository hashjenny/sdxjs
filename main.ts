import { main } from "./ch5-file-backup/ex-2.ts";
import backup from './ch5-file-backup/Backup.ts'

// main()
await backup.migrateCsvToJson('2025-9-13.csv')
