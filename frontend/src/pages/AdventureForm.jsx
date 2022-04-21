import { useCallback, useContext } from 'react'
import CreatableSelect from 'react-select/creatable'
import styles from './AdventureForm.module.css'
import useControlledForm from '../common/useControlledForm'
import { isRequired } from '../common/validation'
import Button from '../components/Button'
import Layout from '../components/Layout'
import {
  useAdventureCreateMutation,
  useAdventureData,
  useAdventureDeleteMutation,
  useAdventureEditMutation,
} from '../services/adventures'
import { RouterContext } from '../components/RouterProvider'

const identity = (x) => x

const labelToOption = ({ label }) => ({ label, value: label })

const AdventureForm = ({ isEdit = false, adventure }) => {
  const history = useContext(RouterContext)

  const { isCreatingAdventure, createAdventure } =
    useAdventureCreateMutation(history)

  const { isEditingAdventure, editAdventure } = useAdventureEditMutation(
    adventure?.id,
  )

  const { isDeletingAdventure, deleteAdventure } = useAdventureDeleteMutation(
    adventure?.id,
    history,
  )

  const handleDeleteAdventure = useCallback(() => {
    const result = window.confirm('¿Seguro que deseas borrar esta aventura?')

    if (!result) {
      return
    }

    deleteAdventure()
  }, [deleteAdventure])

  const {
    values,
    touched,
    errors,

    handleChange,
    handleBlur,
    handleSubmit,

    setFieldValue,
  } = useControlledForm({
    initialValues: {
      title: adventure?.title ?? '',
      tags:
        adventure?.tags?.filter((tag) => !tag.isPerson).map(labelToOption) ??
        [],
      people:
        adventure?.tags?.filter((tag) => tag.isPerson).map(labelToOption) ?? [],
      content: adventure?.content ?? '',
    },

    validationSchema: {
      title: [isRequired, 'This field is required'],
      tags: [identity],
      people: [identity],
      content: [isRequired, 'This field is required'],
    },

    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        tags: values.tags.map(({ label }) => label),
        people: values.people.map(({ label }) => label),
      }

      if (isEdit) {
        editAdventure(formattedValues)
      } else {
        createAdventure(formattedValues)
      }
    },
  })

  return (
    <Layout.Container>
      <div className={styles.container}>
        <h2 className={styles.header}>
          {isEdit ? 'Editar una aventura' : 'Crear una aventura'}
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Título</label>
            <input
              type="text"
              name="title"
              id="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title ? (
              <span className={styles.errorMessage}>{errors.title}</span>
            ) : null}
          </div>

          <div>
            <label htmlFor="tags">Tags</label>
            <CreatableSelect
              isMulti
              backspaceRemovesValue
              name="tags"
              onChange={(value) => {
                setFieldValue('tags', value)
              }}
              onBlur={handleBlur}
              value={values.tags}
            />
            {touched.tags && errors.tags ? (
              <span className={styles.errorMessage}>{errors.tags}</span>
            ) : null}
          </div>

          <div>
            <label htmlFor="people">Personas</label>
            <CreatableSelect
              isMulti
              backspaceRemovesValue
              name="people"
              onChange={(value) => {
                setFieldValue('people', value)
              }}
              onBlur={handleBlur}
              value={values.people}
            />
            {touched.people && errors.people ? (
              <span className={styles.errorMessage}>{errors.people}</span>
            ) : null}
          </div>

          <div>
            <label htmlFor="content">Contenido</label>
            <textarea
              name="content"
              id="content"
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.content && errors.content ? (
              <span className={styles.errorMessage}>{errors.content}</span>
            ) : null}
          </div>

          <Button
            className={styles.submitButton}
            type="submit"
            text={isEdit ? 'Guardar cambios' : 'Crear aventura'}
            isLoading={isEdit ? isEditingAdventure : isCreatingAdventure}
          />

          {isEdit ? (
            <Button
              className={styles.deleteButton}
              text="Borrar aventura"
              onClick={handleDeleteAdventure}
              isLoading={isDeletingAdventure}
            />
          ) : null}
        </form>
      </div>
    </Layout.Container>
  )
}

const AdventureFormMediator = ({ isEdit = false, params }) => {
  const { isLoading, hasErrored, data } = useAdventureData(params.id, isEdit)

  if (isEdit && isLoading) {
    return <Layout.Container>Loading adventure data...</Layout.Container>
  }

  if (isEdit && hasErrored) {
    return (
      <Layout.Container>Cannot obtain data from the adventure</Layout.Container>
    )
  }

  return <AdventureForm isEdit={isEdit} adventure={data} />
}

export default AdventureFormMediator
