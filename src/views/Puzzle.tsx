import Board from '../components/Board'
import { rows, columns } from '../config'

const EMPTY = 0

// Board construction (initial state & representation)
function createSolvedTilesArray(rows: number, columns: number): number[] {
	const totalTiles = rows * columns
	const tilesArray = Array.from({ length: totalTiles }, (_, i) => i + 1)
	tilesArray[totalTiles - 1] = EMPTY
	return tilesArray
}

function toMatrix(tilesArray: number[], columns: number): number[][] {
	const matrix: number[][] = []
	for (let i = 0; i < tilesArray.length; i += columns) {
		matrix.push(tilesArray.slice(i, i + columns))
	}
	return matrix
}

// Index helpers (convert between 1D and 2D indices)
function toIndex(row: number, column: number, columns: number): number {
	return row * columns + column
}

function rowFromIndex(index: number, columns: number): number {
	return Math.floor(index / columns)
}

function columnFromIndex(index: number, columns: number): number {
	return index % columns
}

// Move logic (tile swapping and neighbor calculation)
function swapWithEmpty(
	tilesArray: number[],
	clickedTileIndex: number,
	emptyTileIndex: number,
): number[] {
	const nextTilesArray = [...tilesArray]
	nextTilesArray[emptyTileIndex] = nextTilesArray[clickedTileIndex]
	nextTilesArray[clickedTileIndex] = EMPTY
	return nextTilesArray
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
function shuffleByRandomMoves(
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

		// After the swap, the empty tile ends up where the chosen neighbor was
		nextTilesArray = swapWithEmpty(
			nextTilesArray,
			randomNeighbor,
			emptyTileIndex,
		)
		emptyTileIndex = randomNeighbor
	}

	return nextTilesArray
}

function Puzzle() {
	const tilesArray = createSolvedTilesArray(rows, columns)
	const shuffledTilesArray = shuffleByRandomMoves(tilesArray, rows, columns)
	const tilesMatrix = toMatrix(shuffledTilesArray, columns)

	const handleTileClick = (row: number, column: number) => {
		// Temporary: verify click coordinates during scaffolding.
		console.log('tile click', { row, column })
	}

	return (
		<div className="puzzle">
			<header>
				<h1>Puzzle</h1>
			</header>
			<main>
				<Board tiles={tilesMatrix} onTileClick={handleTileClick} />
			</main>
		</div>
	)
}

export default Puzzle
