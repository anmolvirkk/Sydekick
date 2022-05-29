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

    let currentPage = 0

    const applyJob = (i) => {
      const clickLink = async () => {
        try {
          await page.waitForSelector(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`, {timeout: 1000})
          await page.click(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`, {timeout: 1000})
          await page.waitForNavigation({timeout: 1000})
        } catch (error) {
          console.log('no link')
        }
      }
      const clickApply = async () => {
        try {
          await page.waitForSelector('#indeedApplyButton', {timeout: 1000})
          await page.click('#indeedApplyButton', {modifiers: ['Control'], timeout: 1000})
          await page.waitForNavigation({timeout: 1000})
        } catch {
          console.log('no apply')
        }
      }
      const navigatePage = async () => {
        try {
          currentPage = currentPage + 2
          await page.waitForSelector(`#resultsCol > nav > div > ul > li:nth-child(${currentPage}) > a`)
          await page.click(`#resultsCol > nav > div > ul > li:nth-child(${currentPage}) > a`)
          await page.waitForNavigation()
          applyJob(1)
        } catch (error) {
          await browser.close()
        }
      }
      clickLink().then(()=>{
        clickApply().then(()=>{
          if(i <= links){
            applyJob(i + 1)
          }else{
            navigatePage()
          }
        })
      })
    }
    applyJob(1)

  } catch {
    await browser.close()
  }

}

app.post('/', (req, res) => {
  main(req).then(()=>{
    res.send(null)
  })
})

app.listen(5000, () => {
  console.log('Running on port 5000.')
})