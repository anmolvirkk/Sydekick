const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const playwright = require('playwright')
const browserType = 'chromium'

const main = async (req) => {
  const browser = await playwright[browserType].launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    await page.goto(req.body.site)
    await page.waitForLoadState('load')
      
    await page.waitForSelector('#text-input-what')
    const whatInput = await page.$('#text-input-what')
    await whatInput.type(req.body.what)

    await page.waitForSelector('#text-input-where')
    const whereInput = await page.$('#text-input-where')
    await whereInput.type(req.body.where)
    
    await page.keyboard.press('Enter')

    await page.waitForSelector('#mosaic-provider-jobcards > ul > li')
    
    const links = await page.locator('#mosaic-provider-jobcards > ul > li').count()
    const promises = []

    for(let i = 0; i<links; i++){
      const clickLink = async () => {
        await page.waitForSelector(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`)
        await page.click(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`)
      }
      const clickApply = async () => {
        const applyBtn = await page.waitForSelector('#indeedApplyButton')
        console.log(applyBtn)
        if(applyBtn){
          await page.click(applyBtn, {modifiers: ['Control']})
        }
      }
      promises.push(
        new Promise(res=>{
          clickLink().then(()=>{
            setTimeout(()=>{
              clickApply().then(()=>{
                res(null)
              })
            }, 10000)
          })
        })
      )
    }

    Promise.all(promises)
  } catch (error) {
    console.log('error')
  }

  // await browser.close()
}

app.post('/', (req, res) => {
  main(req).then(()=>{
    res.send(null)
  })
})

app.listen(5000, () => {
  console.log(`Running on port 5000.`)
})