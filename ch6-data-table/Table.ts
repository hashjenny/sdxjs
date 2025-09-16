
export type Row = Record<string, number>
export type RowTable = Row[]
export type ColTable = Record<string, number[]>

export const buildRowTable = (rowCount: number, labels: string[]): RowTable => {
    const result: RowTable = []
    for (let index = 0; index < rowCount; index++) {
        const row: Row = {}
        labels.forEach(label => {
            row[label] = index
        })
        result.push(row)
    }
    return result
}

export const rowFilter = (table: RowTable, func: (row: Row) => boolean) => table.filter(row => func(row))

export const rowSelect = (table: RowTable, labels: string[]) => table.map(row => {
    const newRow: Row = {}
    labels.forEach(label => {
        newRow[label] = row[label]
    })
    return newRow
})

export const buildColTable = (rowCount: number, labels: string[]) => {
    const result: ColTable = {}
    labels.forEach(label => {
        const col: number[] = []
        for (let index = 0; index < rowCount; index++) {
            col.push(index)
        }
        result[label] = col

    })
    return result
}

export const colFilter = (
    table: ColTable,
    func: (table: ColTable, item: number) => boolean) => {
    const result: ColTable = {}
    const labels = Object.keys(table)
    labels.forEach(label => {
        result[label] = []
    })
    for (let index = 0; index < table[0].length; index++) {
        if (func(table, index)) {
            labels.forEach(label => {
                result[label].push(table[label][index])
            })
        }

    }
    return result
}

export const colSelect = (table: ColTable, labels: string[]) => {
    const result: ColTable = {}
    labels.forEach(label => {
        result[label] = table[label]
    })
    return result
}