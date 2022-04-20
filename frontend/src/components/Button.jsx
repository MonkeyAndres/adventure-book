import styles from './Button.module.css'

const Button = ({
  className,
  text,
  type = 'button',
  isLoading,
  onClick = (x) => x,
}) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? 'Loading...' : text}
    </button>
  )
}

export default Button
