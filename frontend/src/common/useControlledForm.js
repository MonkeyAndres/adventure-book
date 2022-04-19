import { useCallback, useState } from 'react'

const useControlledForm = ({
  initialValues = {},
  validationSchema = {},
  onSubmit = () => {},
}) => {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {},
    ),
  )
  const [errors, setErrors] = useState(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {},
    ),
  )

  const getErrorForField = useCallback(
    (name, value = values[name]) => {
      let schema = validationSchema[name]
      const isMultiSchema = Array.isArray(schema[0])

      if (!isMultiSchema) {
        schema = [schema]
      }

      for (const [predicate, errorMessage] of schema) {
        const isInvalid = !predicate(value)

        if (isInvalid) {
          return errorMessage
        }
      }

      return null
    },
    [validationSchema, values],
  )

  // STATE MUTATIONS

  const setFieldValue = useCallback(
    (name, value) =>
      setValues((prevValues) => ({ ...prevValues, [name]: value })),
    [],
  )

  const setFieldTouched = useCallback(
    (name, touched) =>
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: touched,
      })),
    [],
  )

  const setFieldError = useCallback(
    (name, error) =>
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      })),
    [],
  )

  // EVENT HANDLERS

  const handleChange = useCallback(
    (event) => {
      const name = event.target?.name

      if (!name) {
        return
      }

      const nextValue = event.target.value

      setFieldValue(name, nextValue)
      setFieldTouched(name, true)
      setFieldError(name, getErrorForField(name, nextValue))
    },
    [getErrorForField, setFieldError, setFieldTouched, setFieldValue],
  )

  const handleBlur = useCallback(
    (event) => {
      const name = event.target?.name

      if (!name) {
        return
      }

      setFieldTouched(name, true)
      setFieldError(name, getErrorForField(name))
    },
    [getErrorForField, setFieldError, setFieldTouched],
  )

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      let formHasErrors = false

      for (const name in values) {
        const fieldError = getErrorForField(name)

        if (fieldError) {
          formHasErrors = true

          setFieldTouched(name, true)
          setFieldError(name, fieldError)
        }
      }

      if (formHasErrors) {
        return
      }

      onSubmit(values)
    },
    [getErrorForField, onSubmit, setFieldError, setFieldTouched, values],
  )

  return {
    values,
    touched,
    errors,

    setFieldValue,
    setFieldTouched,
    setFieldError,

    handleChange,
    handleBlur,
    handleSubmit,
  }
}

export default useControlledForm
