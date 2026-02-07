export interface TileProps {
	value: number
	onClick: () => void
}

function Tile({ value, onClick }: TileProps) {
	const isEmpty = value === 0

	return (
		<button
			type="button"
			className={`tile${isEmpty ? ' tile-empty' : ''}`}
			onClick={onClick}
			disabled={isEmpty}
			aria-label={isEmpty ? 'empty tile' : `tile ${value}`}
		>
			{isEmpty ? '' : value}
		</button>
	)
}

export default Tile
