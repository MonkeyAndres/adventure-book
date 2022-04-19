import useControlledForm from '../common/useControlledForm'
import { isRequired, isValidEmail } from '../common/validation'
import { useRegisterMutation } from '../services/user'

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
    <main>
      <h1>AdventureBook</h1>

      <form onSubmit={handleSubmit}>
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
          {touched.name && errors.name ? <span>{errors.name}</span> : null}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
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
            type="password"
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
          Crear cuenta
        </button>
      </form>

      {hasErrored ? <span>Error intentando registrar al usuario</span> : null}

      <button onClick={goToLogin}>Iniciar sesión</button>
    </main>
  )
}

export default Register
