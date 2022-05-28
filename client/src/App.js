import styles from './_app.module.sass'
import FeatherIcon from 'feather-icons-react'
import Lottie from 'react-lottie-player'
import * as data from './robot.json'
import { useRef, useState } from 'react'

const App = () => {

  const [site, setSite] = useState('https://www.indeed.com/')
  const sites = useRef([
    'https://www.indeed.com/',
    'https://uk.indeed.com/',
    'https://au.indeed.com/',
    'https://ca.indeed.com/'
  ])

  const Header = () => {
    const [openMenu, setOpenMenu] = useState(false)
    return (
      <div className={styles.header}>
        <img src='/logo.png' alt='' />
        <div className={styles.dropdown}>
          <div className={styles.current} onMouseDown={()=>setOpenMenu(!openMenu)}>
            <p>{site}</p>
            {openMenu?<FeatherIcon icon='chevron-up' />:<FeatherIcon icon='chevron-down' />}
          </div>
          {openMenu?
            <div className={styles.options}>
              <ul>
                {sites.current.map((item, key)=>{
                  if(item !== site){
                    return <li key={key} onMouseDown={()=>setSite(item)}><p>{item}</p><FeatherIcon icon='trash-2' /></li>
                  }else{
                    return null
                  }
                })}
              </ul>
              <button>Add URL</button>
            </div>
            :null
          }
        </div>
      </div>
    )
  }

  const Form = () => {
    return (
      <div className={styles.form}>
        <div className={styles.auth}>
          <input type='text' placeholder='email' id='email' />
          <input type='text' placeholder='password' id='password' />
        </div>
        <div className={styles.search}>
          <input type='text' placeholder='search query' id='what' />
          <input type='text' placeholder='location' id='where' />
        </div>
        <div className={styles.buttons}>
          <div className={styles.btnWrapper}>
            <label>
                <div className={styles.content}>
                    <FeatherIcon icon='upload' />
                    <p>Upload Resume</p>
                </div>
                <input type="file" />
            </label>
          </div>
          <div className={styles.btnWrapper}>
            <label>
                <div className={styles.content}>
                    <FeatherIcon icon='upload' />
                    <p>Upload Cover Letter</p>
                </div>
                <input type="file" />
            </label>
          </div>
        </div>
      </div>
    )
  }

  const start = () => {
    fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        site: site,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        what: document.getElementById('what').value,
        where: document.getElementById('where').value
      })
    }).then((res)=>res.json()).then(data=>{
      console.log(data)
    })
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
            width: 180,
            height: 180
          }}
        />
        <div className={styles.content}>
          <h1>Sydekick</h1>
          <p>Automate Job Applications</p>
        </div>
      </div>
      <Form />
      <button onMouseDown={start}>Start</button>
    </div>
  )
}

export default App