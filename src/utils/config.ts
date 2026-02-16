export type MoveResult = {
	nextTilesArray: number[]
	nextEmptyTileIndex: number
}

export const EMPTY = 0

// Board construction (initial state & representation)
export function createSolvedTilesArray(
	rows: number,
	columns: number,
): number[] {
	const totalTiles = rows * columns
	const tilesArray = Array.from({ length: totalTiles }, (_, i) => i + 1)
	tilesArray[totalTiles - 1] = EMPTY
	return tilesArray
}

export function toMatrix(tilesArray: number[], columns: number): number[][] {
	const matrix: number[][] = []
	for (let i = 0; i < tilesArray.length; i += columns) {
		matrix.push(tilesArray.slice(i, i + columns))
	}
	return matrix
}

// Index helpers (convert between 1D and 2D indices)
export function toIndex(row: number, column: number, columns: number): number {
	return row * columns + column
}

export function rowFromIndex(index: number, columns: number): number {
	return Math.floor(index / columns)
}

export function columnFromIndex(index: number, columns: number): number {
	return index % columns
}

// Move logic (apply moves to tilesArray)
export function swapWithEmpty(
	tilesArray: number[],
	clickedTileIndex: number,
	emptyTileIndex: number,
): MoveResult {
	const nextTilesArray = [...tilesArray]
	nextTilesArray[emptyTileIndex] = nextTilesArray[clickedTileIndex]
	nextTilesArray[clickedTileIndex] = EMPTY
	return {
		nextTilesArray,
		nextEmptyTileIndex: clickedTileIndex,
	}
}

// Multi-slide moves (shift a row/column towards the empty tile)
export function moveInRowTowardsEmpty(
	tilesArray: number[],
	clickedTileIndex: number,
	emptyTileIndex: number,
	columns: number,
): MoveResult | null {
	const clickedRow = rowFromIndex(clickedTileIndex, columns)
	const emptyRow = rowFromIndex(emptyTileIndex, columns)

	if (clickedRow !== emptyRow) return null

	// If clicked is left of the empty tile (smaller index): shift the row right
	// towards the empty tile.
	//
	// Row example: [A B _] → click A → [_ A B]
	if (clickedTileIndex < emptyTileIndex) {
		const nextTilesArray = [...tilesArray]

		for (let i = emptyTileIndex; i > clickedTileIndex; i--) {
			nextTilesArray[i] = nextTilesArray[i - 1]
		}

		nextTilesArray[clickedTileIndex] = EMPTY

		return {
			nextTilesArray,
			nextEmptyTileIndex: clickedTileIndex,
		}
	}

	// If clicked is right of the empty tile (larger index): shift the row left
	// towards the empty tile.
	//
	// Row example: [_ A B] → click B → [A B _]
	if (clickedTileIndex > emptyTileIndex) {
		const nextTilesArray = [...tilesArray]

		for (let i = emptyTileIndex; i < clickedTileIndex; i++) {
			nextTilesArray[i] = nextTilesArray[i + 1]
		}

		nextTilesArray[clickedTileIndex] = EMPTY

		return {
			nextTilesArray,
			nextEmptyTileIndex: clickedTileIndex,
		}
	}

	return null
}

export function moveInColumnTowardsEmpty(
	tilesArray: number[],
	clickedTileIndex: number,
	emptyTileIndex: number,
	columns: number,
): MoveResult | null {
	const clickedColumn = columnFromIndex(clickedTileIndex, columns)
	const emptyColumn = columnFromIndex(emptyTileIndex, columns)

	if (clickedColumn !== emptyColumn) return null

	// If clicked is above the empty tile (smaller index): shift the column down
	// towards the empty tile.
	//
	// Example (before → click → after):
	// [1 2 5]             [1 2 _]
	// [8 3 4] → click 5 → [8 3 5]
	// [6 7 _]             [6 7 4]
	if (clickedTileIndex < emptyTileIndex) {
		const nextTilesArray = [...tilesArray]

		for (let i = emptyTileIndex; i > clickedTileIndex; i -= columns) {
			nextTilesArray[i] = nextTilesArray[i - columns]
		}

		nextTilesArray[clickedTileIndex] = EMPTY

		return {
			nextTilesArray,
			nextEmptyTileIndex: clickedTileIndex,
		}
	}

	// If clicked is below the empty tile (larger index): shift the column up
	// towards the empty tile.
	//
	// Example (before → click → after):
	// [1 _ 3]             [1 2 3]
	// [4 2 6] → click 5 → [4 5 6]
	// [7 5 8]             [7 _ 8]
	if (clickedTileIndex > emptyTileIndex) {
		const nextTilesArray = [...tilesArray]

		for (let i = emptyTileIndex; i < clickedTileIndex; i += columns) {
			nextTilesArray[i] = nextTilesArray[i + columns]
		}

		nextTilesArray[clickedTileIndex] = EMPTY

		return {
			nextTilesArray,
			nextEmptyTileIndex: clickedTileIndex,
		}
	}

	return null
}

function getNeighborIndices(
	emptyTileIndex: number,
	rows: number,
	columns: number,
): number[] {
	// Collect all in-bounds neighbors (no diagonals), expressed as 1D indices.
	const emptyTileRow = rowFromIndex(emptyTileIndex, columns)
	const emptyTileColumn = columnFromIndex(emptyTileIndex, columns)

	const neighbors: number[] = []

	// up
	if (emptyTileRow > 0)
		neighbors.push(toIndex(emptyTileRow - 1, emptyTileColumn, columns))
	// down
	if (emptyTileRow < rows - 1)
		neighbors.push(toIndex(emptyTileRow + 1, emptyTileColumn, columns))
	// left
	if (emptyTileColumn > 0)
		neighbors.push(toIndex(emptyTileRow, emptyTileColumn - 1, columns))
	// right
	if (emptyTileColumn < columns - 1)
		neighbors.push(toIndex(emptyTileRow, emptyTileColumn + 1, columns))

	return neighbors
}

// Shuffle helpers (generate solvable board states)
export function shuffleByRandomMoves(
	tilesArray: number[],
	rows: number,
	columns: number,
	moveCount: number = rows * columns * 40,
): number[] {
	let nextTilesArray = [...tilesArray]
	let emptyTileIndex = nextTilesArray.indexOf(EMPTY)

	for (let i = 0; i < moveCount; i++) {
		const neighbors = getNeighborIndices(emptyTileIndex, rows, columns)
		const randomNeighbor =
			neighbors[Math.floor(Math.random() * neighbors.length)]

		// After the move, the empty tile ends up at the chosen neighbor index
		const result = swapWithEmpty(nextTilesArray, randomNeighbor, emptyTileIndex)
		nextTilesArray = result.nextTilesArray
		emptyTileIndex = result.nextEmptyTileIndex
	}

	return nextTilesArray
}

export function createShuffledTilesArray(
	rows: number,
	columns: number,
): number[] {
	const solvedTilesArray = createSolvedTilesArray(rows, columns)
	return shuffleByRandomMoves(solvedTilesArray, rows, columns)
}

// Game rules (win condition)
export function isPuzzleSolved(tiles: number[]): boolean {
	for (let i = 0; i < tiles.length - 1; i++) {
		if (tiles[i] !== i + 1) return false
	}
	return tiles[tiles.length - 1] === EMPTY
}

// Time helpers (digital and readable time formats)
export function formatTimeHHMMSS(totalSeconds: number): string {
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	const pad2 = (n: number) => String(n).padStart(2, '0')
	return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
}

export function formatReadableTime(totalSeconds: number): string {
	const seconds = totalSeconds % 60
	const minutes = Math.floor((totalSeconds / 60) % 60)
	const hours = Math.floor(totalSeconds / 3600)

	const parts: string[] = []

	if (hours > 0) {
		parts.push(`${hours} ${hours === 1 ? 'timme' : 'timmar'}`)
	}

	if (minutes > 0) {
		parts.push(`${minutes} ${minutes === 1 ? 'minut' : 'minuter'}`)
	}

	if (seconds > 0 || parts.length === 0) {
		parts.push(`${seconds} ${seconds === 1 ? 'sekund' : 'sekunder'}`)
	}

	if (parts.length === 1) return parts[0]
	if (parts.length === 2) return `${parts[0]} och ${parts[1]}`

	return `${parts.slice(0, -1).join(', ')} och ${parts[parts.length - 1]}`
}
