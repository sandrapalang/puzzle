import { useState } from 'react'
import Board from '../components/Board'
import { rows, columns } from '../config'

type GameStatus = 'playing' | 'won'

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

// Game rules (win condition)
function isPuzzleSolved(tiles: number[]): boolean {
	for (let i = 0; i < tiles.length - 1; i++) {
		if (tiles[i] !== i + 1) return false
	}
	return tiles[tiles.length - 1] === EMPTY
}

function Puzzle() {
	const [tilesArray, setTilesArray] = useState<number[]>(() => {
		const solvedTilesArray = createSolvedTilesArray(rows, columns)
		return shuffleByRandomMoves(solvedTilesArray, rows, columns)
	})
	const [gameStatus, setGameStatus] = useState<GameStatus>('playing')

	const tilesMatrix = toMatrix(tilesArray, columns)
	const emptyTileIndex = tilesArray.indexOf(EMPTY)

	const handleTileClick = (row: number, column: number) => {
		if (gameStatus === 'won') return

		const clickedTileIndex = toIndex(row, column, columns)
		if (clickedTileIndex === emptyTileIndex) return

		const emptyTileRow = rowFromIndex(emptyTileIndex, columns)
		const emptyTileColumn = columnFromIndex(emptyTileIndex, columns)

		const isNeighbor =
			Math.abs(row - emptyTileRow) + Math.abs(column - emptyTileColumn) === 1
		if (!isNeighbor) return

		const nextTilesArray = swapWithEmpty(
			tilesArray,
			clickedTileIndex,
			emptyTileIndex,
		)
		setTilesArray(nextTilesArray)

		if (isPuzzleSolved(nextTilesArray)) {
			setGameStatus('won')
		}
	}

	return (
		<div className="puzzle">
			<header>
				<h1>Puzzle</h1>
			</header>
			<main>
				<Board tiles={tilesMatrix} onTileClick={handleTileClick} />
			</main>
			<footer>
				{gameStatus === 'won' && (
					<p className="puzzle-win" role="status">
						du vann!
					</p>
				)}
			</footer>
		</div>
	)
}

export default Puzzle
