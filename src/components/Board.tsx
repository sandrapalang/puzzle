import Tile from './Tile'

export interface BoardProps {
	tiles: number[][]
	onTileClick: (row: number, column: number) => void
}

function Board({ tiles, onTileClick }: BoardProps) {
	return (
		<div className="board-frame">
			<div className="board-surface">
				<div className="board-grid" role="grid" aria-label="puzzle board">
					{tiles.map((row, rowIndex) => (
						<div key={rowIndex} className="board-row">
							{row.map((value, columnIndex) => (
								<Tile
									key={`${rowIndex}-${columnIndex}`}
									value={value}
									onClick={() => onTileClick(rowIndex, columnIndex)}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Board
