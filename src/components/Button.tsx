export interface ButtonProps {
	ariaLabel: string
	className: string
	label: string
	onClick: () => void
}

function Button({ ariaLabel, className, label, onClick }: ButtonProps) {
	return (
		<button
			className={className}
			type="button"
			aria-label={ariaLabel}
			onClick={onClick}
		>
			{label}
		</button>
	)
}

export default Button
