import Board from '../components/Board'

function Puzzle() {
	const tilesMatrix: number[][] = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 0],
	]

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
