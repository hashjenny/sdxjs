import { RowTable, ColTable, time, memory, calculateRatio } from './Table2.js'
import * as assert from 'node:assert'

const RANGE = 9

export const main = () => {
    const nRows = 100 // parseInt(process.argv[2])
    const nCols = 3 //parseInt(process.argv[3])
    const filterPerSelect = 3 //parseFloat(process.argv[4])

    const labels = [...Array(nCols).keys()].map(i => `label_${i + 1}`)
    const someLabels = labels.slice(0, Math.floor(labels.length / 2))
    assert.ok(someLabels.length > 0,
        'Must have some labels for select (array too short)')

    const [rowTable, rowSize, rowHeap] = memory(() => new RowTable(nRows, labels))
    const [colTable, colSize, colHeap] = memory(() => new ColTable(nRows, labels))

    const rowFilterTime =
        time(() => rowTable.filter(row => (row["label_1"] % RANGE) === 0))

    const rowSelectTime =
        time(() => rowTable.select(someLabels))
    const colFilterTime =
        time(() => colTable.filter(i => (colTable.table["label_1"][i] % RANGE) === 0))
    const colSelectTime =
        time(() => colTable.select(someLabels))

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
    console.log(result)
}