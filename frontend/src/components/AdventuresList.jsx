import styles from './AdventuresList.module.css'

const MAX_TAGS_PER_ARTICLE = 5

const AdventuresList = ({ adventures, goToAdventureDetail }) => {
  return (
    <div className={styles.adventureContainer}>
      {adventures.map((adventure) => {
        const tags = adventure.tags.filter((tag) => !tag.isPerson)
        const people = adventure.tags.filter((tag) => tag.isPerson)

        return (
          <article
            key={adventure.id}
            className={styles.adventureCard}
            onClick={() => goToAdventureDetail(adventure.id)}
          >
            <h3>{adventure.title}</h3>
            <span>{adventure.updatedAt}</span>

            <div className={styles.tagContainer}>
              {tags.slice(0, MAX_TAGS_PER_ARTICLE).map((tag) => (
                <span key={tag.label}>{`#${tag.label}`}</span>
              ))}

              {people.slice(0, MAX_TAGS_PER_ARTICLE).map((people) => (
                <span key={people.label}>{`@${people.label}`}</span>
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default AdventuresList
