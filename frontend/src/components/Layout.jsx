import styles from './Layout.module.css'

const Layout = ({ goToAdventures, performLogout, children }) => {
  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h1>AdventureBook</h1>

          <nav>
            <span onClick={goToAdventures}>My adventures</span>
            <button onClick={performLogout}>Sign out</button>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}

const Container = ({ children }) => {
  return (
    <div className={styles.container}>
      <div>{children}</div>
    </div>
  )
}

Layout.Container = Container

export default Layout
