import Board from '../components/Board'

const EMPTY = 0
const rows = 3
const columns = 3

// Board construction (initial state & representation)
function createSolvedTilesArray(rows: number, columns: number): number[] {
	const totalTiles = rows * columns
	const tilesArray = Array.from({ length: totalTiles }, (_, i) => i + 1)
	tilesArray[totalTiles - 1] = EMPTY
	return tilesArray
}

function toMatrix(tiles: number[], columns: number): number[][] {
	const matrix: number[][] = []
	for (let i = 0; i < tiles.length; i += columns) {
		matrix.push(tiles.slice(i, i + columns))
	}
	return matrix
}

function Puzzle() {
	const tilesArray = createSolvedTilesArray(rows, columns)
	const tilesMatrix = toMatrix(tilesArray, columns)

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
