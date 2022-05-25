import styles from './_app.module.sass'
import FeatherIcon from 'feather-icons-react'
import Lottie from 'react-lottie-player'
import * as data from './robot.json'

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
        <div className={styles.auth}>
          <input type='text' placeholder='email' />
          <input type='text' placeholder='password' />
        </div>
        <div className={styles.search}>
          <input type='text' placeholder='search query' />
          <input type='text' placeholder='location' />
        </div>
        <div className={styles.buttons}>
          <label>
              <div className={styles.content}>
                  <FeatherIcon icon='upload' />
                  <p>Upload Resume</p>
              </div>
              <input type="file" />
          </label>
          <label>
              <div className={styles.content}>
                  <FeatherIcon icon='upload' />
                  <p>Upload Cover Letter</p>
              </div>
              <input type="file" />
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.hero}>
        <Lottie
          loop
          play
          animationData={data}
          style={{
            width: 220,
            height: 220
          }}
        />
        <h1>Sydekick</h1>
        <p>Automate Job Applications</p>
      </div>
      <Form />
      <button>Start</button>
    </div>
  )
}

export default App