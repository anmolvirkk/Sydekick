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
  const formData = useRef({})

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

  const [loading, setLoading] = useState(false)

  const Form = () => {
    if(!loading){
      return (
        <div className={styles.form}>
          <div className={styles.search}>
            <input value={formData.current.what} type='text' placeholder='search query' onChange={(e)=>formData.current.what = e.target.value} />
            <input value={formData.current.where} type='text' placeholder='location' onChange={(e)=>formData.current.where = e.target.value} />
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
    }else if(loading === 'login'){
      return (
        <div className={styles.form}>
          <div className={styles.wrapper}>
            <div id='loginCountDown' className={styles.countDown}>Login and go to home screen within 120s</div>
            <div className={styles.loginloader}>
              <div className={styles.progress} id='progress' />
            </div>
          </div>
        </div>
      )
    }else{
      return (
        <div className={styles.form}>
          <div className={styles.wrapper}>
            <div className={styles.loader} />
          </div>
        </div>
      )
    }
  }

  const start = () => {
    fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        site: site,
        email: formData.current.email,
        password: formData.current.password,
        what: formData.current.what,
        where: formData.current.where
      })
    }).then(()=>{
      setLoading(false)
    })
    let countDown = 120
    const interval = setInterval(()=>{
      if(countDown > 0){
        countDown--
        document.getElementById('loginCountDown').innerText = 'Login and go to home screen within '+countDown+'s'
        document.getElementById('progress').style.width = countDown/120*100+'%'
      }else{
        clearInterval(interval)
        setLoading(true)
      }
    }, 1000)
    setLoading('login')
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