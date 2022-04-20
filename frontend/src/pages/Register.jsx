import styles from './Login.module.css'
import useControlledForm from '../common/useControlledForm'
import { isRequired, isValidEmail } from '../common/validation'
import { useRegisterMutation } from '../services/user'
import Button from '../components/Button'

const Register = ({ goToLogin }) => {
  const { isPending, hasErrored, execute } = useRegisterMutation()

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    useControlledForm({
      initialValues: {
        name: '',
        email: '',
        password: '',
      },

      validationSchema: {
        name: [isRequired, 'This field is required'],
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
          <label htmlFor="name">Nombre completo</label>
          <input
            type="text"
            name="name"
            id="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name ? (
            <span className={styles.errorMessage}>{errors.name}</span>
          ) : null}
        </div>

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

        <Button
          className={styles.submitButton}
          text="Crear cuenta"
          type="submit"
          isLoading={isPending}
        />
      </form>

      {hasErrored ? (
        <span className={styles.errorMessage}>
          Error intentando registrar al usuario
        </span>
      ) : null}

      <p className={styles.helperText} role="button" onClick={goToLogin}>
        ¿Ya tienes cuenta? Inicia sesión.
      </p>
    </main>
  )
}

export default Register
