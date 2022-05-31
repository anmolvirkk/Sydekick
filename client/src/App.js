import styles from './_app.module.sass'
import FeatherIcon from 'feather-icons-react'
import Lottie from 'react-lottie-player'
import * as data from './robot.json'
import { useRef, useState } from 'react'

const App = () => {

  const [site, setSite] = useState('https://www.indeed.com/')
  const sites = useRef([
    'https://www.indeed.com/',
    'https://www.glassdoor.com/',
    'https://www.linkedin.com/jobs/'
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
                    return <li key={key} onMouseDown={()=>setSite(item)}><p>{item}</p></li>
                  }else{
                    return null
                  }
                })}
              </ul>
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
    setLoading(true)
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