
class RowTable {
    constructor(rowCount, labels) {
        this.rowCount = rowCount
        this.labels = labels
        this.table = []
        for (let index = 0; index < rowCount; index++) {
            const row = {}
            labels.forEach(label => {
                row[label] = index
            })
            this.table.push(row)
        }
    }

    filter(func) {
        return this.table.filter(row => func(row))
    }

    select(selectLabels) {
        return this.table.map(row => {
            const newRow= {}
            selectLabels.forEach(label => {
                newRow[label] = row[label]
            })
            return newRow
        })
    }
}

class ColTable {

    constructor(rowCount, labels) {
        this.rowCount = rowCount
        this.labels = labels
        this.table = {}
        this.labels.forEach(label => {
            const col = []
            for (let i = 0; i < this.rowCount; i++) {
                col.push(i)
            }
            this.table[label] = col
        })
    }

    filter(func) {
        const result = {}
        const labels = Object.keys(this.table)
        labels.forEach(label => {
            result[label] = []
        })
        for (let i = 0; i < this.rowCount; i++) {
            if (func(i)) {
                labels.forEach(label => {
                    result[label].push(this.table[label][i])
                })
            }
        }
        return result
    }


    select(selectLabels) {
        const result = {}
        selectLabels.forEach(label => {
            result[label] = this.table[label]
        })
        return result
    }
}

function time(func) {
    const start = process.hrtime.bigint();
    func();
    const end = process.hrtime.bigint();
    return (end - start) / 1000n;
}


function sizeof(obj){
    return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}

function memory(func) {
    const before = process.memoryUsage()
    const result = func()
    const after = process.memoryUsage()
    const heap = after.heapUsed - before.heapUsed
    const size = sizeof(result)
    return [result, size, heap]
}

function calculateRatio(filterPerSelect, rowFilterTime, rowSelectTime, colFilterTime, colSelectTime) {
    return Number((filterPerSelect * Number(rowFilterTime)) + Number(rowSelectTime)) / (Number(filterPerSelect * Number(colFilterTime)) + Number(colSelectTime))
}

function asPackedJson(table) {
    const keys = Object.keys(table.table[0])
    const values = table.table.map(row => keys.map(k => row[k]))
    const temp = { keys, values }
    return JSON.stringify(temp)
}

function asBinary(colTable) {
    const labels = colTable.labels

    const nCols = labels.length
    const nRows = colTable.rowCount
    const dimensions = new Uint32Array([nCols, nRows])

    const allLabels = labels.join('\n')
    const encoder = new TextEncoder()
    const encodedLabels = encoder.encode(allLabels)

    const dataSize = Float64Array.BYTES_PER_ELEMENT * nCols * nRows
    const totalSize =
        dimensions.byteLength + encodedLabels.byteLength + dataSize

    const buffer = new ArrayBuffer(totalSize)
    const result = new Uint8Array(buffer)
    result.set(dimensions, 0)
    result.set(encodedLabels, dimensions.byteLength)

    let current = dimensions.byteLength + encodedLabels.byteLength
    labels.forEach(label => {
        const temp = new Float64Array(colTable[label])
        result.set(temp, current)
        current += temp.byteLength
    })

    return result
}

export { RowTable, ColTable, time, memory, calculateRatio, asPackedJson }
