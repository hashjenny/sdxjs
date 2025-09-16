import { buildColTable, buildRowTable, rowFilter, rowSelect, colFilter, colSelect } from './Table.ts'
import assert from 'node:assert'
import yaml from 'js-yaml'

type MemoryResult<T> = [T, number, number]

const memory = <T>(func: (...args: any[]) => T, ...params: any[]): MemoryResult<T> => {
    const before = process.memoryUsage()
    const result = func(...params)
    const after = process.memoryUsage()
    const heap = after.heapUsed - before.heapUsed
    const size = sizeof(result)
    return [result, size, heap]
}

const time = (func: (...args: any[]) => any, ...params: any[]) => {
    const before = process.hrtime.bigint()
    func(...params)
    const after = process.hrtime.bigint()
    return after - before
}

const calculateRatio = (f2S: number, rFilterT: bigint, rSelectT: bigint, cFilterT: bigint, cSelectT: bigint) => {
    return Number((f2S * Number(rFilterT)) + Number(rSelectT)) / (Number(f2S * Number(cFilterT)) + Number(cSelectT))
}

const sizeof = (obj: any): number => {
    return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}

const RANGE = 3

export const main = () => {
    const nRows = 100 // parseInt(process.argv[2])
    const nCols = 3 //parseInt(process.argv[3])
    const filterPerSelect = 3 //parseFloat(process.argv[4])

    const labels = [...Array(nCols).keys()].map(i => `label_${i + 1}`)
    const someLabels = labels.slice(0, Math.floor(labels.length / 2))
    assert(someLabels.length > 0,
        'Must have some labels for select (array too short)')

    const [rowTable, rowSize, rowHeap] = memory(buildRowTable, nRows, labels)
    const [colTable, colSize, colHeap] = memory(buildColTable, nRows, labels)

    const rowFilterTime =
        time(rowFilter, rowTable,
            row => ((row.label_1 % RANGE) === 0))
    const rowSelectTime =
        time(rowSelect, rowTable, someLabels)
    const colFilterTime =
        time(colFilter, colTable,
            (table, iR) => ((table.label_1[iR] % RANGE) === 0))
    const colSelectTime =
        time(colSelect, colTable, someLabels)

    const ratio = calculateRatio(filterPerSelect,
        rowFilterTime, rowSelectTime,
        colFilterTime, colSelectTime)

    const result = {
        nRows,
        nCols,
        filterPerSelect,
        rowSize,
        rowHeap,
        colSize,
        colHeap,
        rowFilterTime,
        rowSelectTime,
        colFilterTime,
        colSelectTime,
        ratio
    }
    console.log(yaml.dump(result))
}