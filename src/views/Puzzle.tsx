import { useEffect, useState } from 'react'
import Board from '../components/Board'
import Button from '../components/Button'
import { rows, columns } from '../config'
import {
	type MoveResult,
	EMPTY,
	columnFromIndex,
	createShuffledTilesArray,
	formatTimeHHMMSS,
	isPuzzleSolved,
	moveInColumnTowardsEmpty,
	moveInRowTowardsEmpty,
	rowFromIndex,
	swapWithEmpty,
	toIndex,
	toMatrix,
} from '../utils/config'

type GameStatus = 'playing' | 'won'

function Puzzle() {
	const [tilesArray, setTilesArray] = useState<number[]>(() => {
		return createShuffledTilesArray(rows, columns)
	})

	const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
	const [moves, setMoves] = useState<number>(0)
	const [startTimestampMs, setStartTimestampMs] = useState<number | null>(null)
	const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

	const tilesMatrix = toMatrix(tilesArray, columns)
	const emptyTileIndex = tilesArray.indexOf(EMPTY)

	const handleResetClick = () => {
		const nextTilesArray = createShuffledTilesArray(rows, columns)

		setTilesArray(nextTilesArray)
		setGameStatus('playing')
		setMoves(0)
		setStartTimestampMs(null)
		setElapsedSeconds(0)
	}

	const handleTileClick = (row: number, column: number) => {
		if (gameStatus === 'won') return

		const clickedTileIndex = toIndex(row, column, columns)
		if (clickedTileIndex === emptyTileIndex) return

		const emptyTileRow = rowFromIndex(emptyTileIndex, columns)
		const emptyTileColumn = columnFromIndex(emptyTileIndex, columns)

		const isNeighbor =
			Math.abs(row - emptyTileRow) + Math.abs(column - emptyTileColumn) === 1

		let result: MoveResult | null = null

		if (isNeighbor) {
			result = swapWithEmpty(tilesArray, clickedTileIndex, emptyTileIndex)
		} else {
			result = moveInRowTowardsEmpty(
				tilesArray,
				clickedTileIndex,
				emptyTileIndex,
				columns,
			)

			if (!result) {
				result = moveInColumnTowardsEmpty(
					tilesArray,
					clickedTileIndex,
					emptyTileIndex,
					columns,
				)
			}
		}

		if (!result) return

		if (startTimestampMs === null) {
			setStartTimestampMs(Date.now())
		}

		setTilesArray(result.nextTilesArray)
		setMoves((prevMoves) => prevMoves + 1)

		if (isPuzzleSolved(result.nextTilesArray)) {
			setGameStatus('won')
		}
	}

	useEffect(() => {
		if (gameStatus !== 'playing') return
		if (startTimestampMs === null) return

		const intervalId = window.setInterval(() => {
			setElapsedSeconds(Math.floor((Date.now() - startTimestampMs) / 1000))
		}, 1000)

		return () => window.clearInterval(intervalId)
	}, [gameStatus, startTimestampMs])

	return (
		<div className="puzzle">
			<header>
				<h1>Puzzle</h1>
			</header>
			<main>
				<Board tiles={tilesMatrix} onTileClick={handleTileClick} />
			</main>
			<footer>
				{gameStatus === 'won' ? (
					<div className="win-container">
						<p className="win-message" role="status">
							du vann!
						</p>
						<Button
							ariaLabel="spela igen knapp"
							className="play-again"
							label="spela igen"
							onClick={handleResetClick}
						/>
					</div>
				) : (
					<div className="hud-container">
						<p>
							drag: <output>{moves}</output>
						</p>
						<Button
							ariaLabel="slumpa knapp"
							className="shuffle"
							label="slumpa"
							onClick={handleResetClick}
						/>
						<p>
							<output>{formatTimeHHMMSS(elapsedSeconds)}</output>
						</p>
					</div>
				)}
			</footer>
		</div>
	)
}

export default Puzzle
