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

    await page.goto('https://secure.indeed.com/auth')
    await page.waitForLoadState('load')

    await page.waitForTimeout(120000)

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

    let currentPage = 0

    const nextPage = async () => {
      currentPage = currentPage + 2
      try {
        let pages = context.pages()
        for(const newPage of pages){
          console.log(newPage)
          newPage.waitForLoadState('load')
          newPage.waitForSelector('#applyButtonLinkContainer > div > div.icl-u-xs-hide.icl-u-lg-block.icl-u-lg-textCenter > a')
          newPage.click('#applyButtonLinkContainer > div > div.icl-u-xs-hide.icl-u-lg-block.icl-u-lg-textCenter > a')
        }
        await page.waitForSelector(`#resultsCol > nav > div > ul > li:nth-child(${currentPage}) > a`)
        await page.click(`#resultsCol > nav > div > ul > li:nth-child(${currentPage}) > a`)
      } catch (error) {
        console.log(error)
        // await browser.close()
      }
    }

    const openJobs = async () => {
      for(let i = 1; i <= links; i++){
        const openJobs = async (res) => {
          try {
            await page.waitForSelector(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`)
            await page.click(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`, {modifiers: ['Control']})
          } catch (error) {
            console.log(error)
            // await browser.close()
          }
        }
        promises.push(
          new Promise(res=>{
            openJobs(res).then(()=>{
              res(null)
            })
          })
        )
      }
      await Promise.all(promises)
      nextPage().then(()=>{
        openJobs()
      })
    }

    openJobs()

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