import styles from './Login.module.css'
import useControlledForm from '../common/useControlledForm'
import { isRequired, isValidEmail } from '../common/validation'
import { useLoginMutation } from '../services/user'

const Login = ({ goToRegister }) => {
  const { isPending, hasErrored, execute } = useLoginMutation()

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    useControlledForm({
      initialValues: {
        email: '',
        password: '',
      },

      validationSchema: {
        email: [
          [isRequired, 'This field is required'],
          [isValidEmail, 'Email format is invalid'],
        ],
        password: [isRequired, 'This field is required'],
      },

      onSubmit: execute,
    })

  return (
    <main className={styles.container}>
      <h1 className={styles.header}>AdventureBook</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email ? (
            <span className={styles.errorMessage}>{errors.email}</span>
          ) : null}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password ? (
            <span className={styles.errorMessage}>{errors.password}</span>
          ) : null}
        </div>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Loading...' : 'Iniciar sesión'}
        </button>
      </form>

      {hasErrored ? (
        <span className={styles.errorMessage}>
          Email o contraseña incorrectos
        </span>
      ) : null}

      <p className={styles.helperText} role="button" onClick={goToRegister}>
        ¿No tienes cuenta? Crea una.
      </p>
    </main>
  )
}

export default Login
