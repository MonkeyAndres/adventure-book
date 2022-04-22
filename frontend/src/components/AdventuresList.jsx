import styles from './AdventuresList.module.css'

const MAX_TAGS_PER_ARTICLE = 5

const SECONDS_IN_MINUTE = 60,
  SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60,
  SECONDS_IN_DAY = SECONDS_IN_HOUR * 24,
  SECONDS_IN_WEEK = SECONDS_IN_DAY * 7,
  SECONDS_IN_MONTH = SECONDS_IN_DAY * 30,
  SECONDS_IN_YEAR = SECONDS_IN_DAY * 365

function getTimeAgo(date) {
  const dateCloned = new Date(date)
  const now = new Date()

  const secondsAgo = Math.round((+now - dateCloned) / 1000)

  const rft = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

  switch (true) {
    case secondsAgo < SECONDS_IN_MINUTE: {
      return rft.format(-secondsAgo, 'second')
    }

    case secondsAgo < SECONDS_IN_HOUR: {
      return rft.format(-Math.floor(secondsAgo / SECONDS_IN_MINUTE), 'minute')
    }

    case secondsAgo < SECONDS_IN_DAY: {
      return rft.format(-Math.floor(secondsAgo / SECONDS_IN_HOUR), 'hour')
    }

    case secondsAgo < SECONDS_IN_WEEK: {
      return rft.format(-Math.floor(secondsAgo / SECONDS_IN_DAY), 'day')
    }

    case secondsAgo < SECONDS_IN_MONTH: {
      return rft.format(-Math.floor(secondsAgo / SECONDS_IN_WEEK), 'week')
    }

    case secondsAgo < SECONDS_IN_YEAR: {
      return rft.format(-Math.floor(secondsAgo / SECONDS_IN_MONTH), 'month')
    }

    case secondsAgo > SECONDS_IN_YEAR: {
      return rft.format(-Math.floor(secondsAgo / SECONDS_IN_YEAR), 'month')
    }

    default: {
      return 'hace mucho tiempo'
    }
  }
}

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
            <span>Modificado: {getTimeAgo(adventure.updatedAt)}</span>

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
