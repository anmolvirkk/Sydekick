import styles from './_app.module.sass'
import FeatherIcon from 'feather-icons-react'

const App = () => {

  const Header = () => {
    return (
      <div className={styles.header}>
        <img src='/logo.png' />
        <div className={styles.dropdown}>
          <p>Indeed</p>
          <FeatherIcon icon='chevron-down' />
        </div>
      </div>
    )
  }

  const Form = () => {
    return (
      <div className={styles.form}>
        <input type='text' placeholder='email' />
        <input type='text' placeholder='password' />
        <input type='text' placeholder='search keywords' />
        <input type='text' placeholder='location' />
        <label>Resume</label>
        <input type='file' />
        <label>Cover Letter</label>
        <input type='file' />
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Header />
      <Form />
      <button>Start</button>
    </div>
  )
}

export default App