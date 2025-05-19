const googleDocString = 'https://docs.google.com/document/d/e/2PACX-1vSCJGXDu491Y3rRgJPVhtdsY5ivkbQ5FJMDvPyanh2F7HNk2cea9AZIHa1j-RShETAsCxKqqbZ_Vz7J/pub'
let grid = null

class charGrid {
    constructor(rows, columns) {
        this.rows = rows
        this.columns = columns
        this.grid = []
        for (let i = 0; i < rows + 1; i++) {
            this.grid.push(Array(columns + 1).fill("."))
        }
    }

    addChar(row, col, char) {
        this.grid[row][col] = char
    }

    toString() {
        let result = ''
        for (let i = 0; i < this.rows + 1; i++) { 
            result += this.grid[i].join('') + '\n'
        }
        return result
    }
}

async function printMessage(docStr) {
    let rowData = await parseDocument(docStr)
    rowData.forEach((row) => {
        grid.addChar(row.y, row.x, row.char)
    })
    console.log(grid.toString())
}

async function parseDocument(docStr) {
    let rowData = []
    let maxRows = 0
    let maxColumns = 0
    try {
        const res = await fetch(docStr)
        const txt = await res.text()
        const tableStart = txt.indexOf('y-coordinate')
        if (tableStart === -1) {
            throw new Error("Table is not in the correct format!")
        }
        const tableText = txt.substring(tableStart)
        const rows = Array.from(tableText.matchAll(/<span class="c(\d+)">([\s\S]+?)<\/span>/g))
        let rowToAdd = {}
        rows.map((row, index) => {
            switch (index % 3) {
                case 0:
                    rowToAdd['x'] = row[2]
                    if (Number(row[2]) > Number(maxColumns)) {
                        maxColumns = Number(row[2])
                    }
                    break
                case 1:
                    rowToAdd['char'] = row[2]
                    break
                default:
                    rowToAdd['y'] = row[2]
                    if (Number(row[2]) > Number(maxRows)) {
                        maxRows = Number(row[2])
                    }
                    rowData.push({ ...rowToAdd })
            }
        })
        grid = new charGrid(maxRows, maxColumns)
        return rowData
    }
    catch (e) {
        console.log(e)
        throw new Error("Error parsing document: ", e)
    }
}

printMessage(googleDocString)