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
    <main>
      <h1>AdventureBook</h1>

      <form onSubmit={handleSubmit}>
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
          {touched.email && errors.email ? <span>{errors.email}</span> : null}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="text"
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password ? (
            <span>{errors.password}</span>
          ) : null}
        </div>

        <button type="submit" disabled={isPending}>
          Iniciar sesión
        </button>
      </form>

      {hasErrored ? <span>Email o contraseña incorrectos</span> : null}

      <button onClick={goToRegister}>Registrarte</button>
    </main>
  )
}

export default Login
