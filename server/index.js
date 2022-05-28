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
  await page.goto(req.body.site)
  await page.waitForLoadState('load')
    
  await page.waitForSelector('#text-input-what')
  const whatInput = await page.$('#text-input-what')
  await whatInput.type(req.body.what)

  await page.waitForSelector('#text-input-where')
  const whereInput = await page.$('#text-input-where')
  await whereInput.type(req.body.where)
  
  await page.keyboard.press('Enter')
  // await browser.close()
}

app.post('/', (req, res) => {
  main(req).then(()=>{
    res.send('test')
  })
})

app.listen(5000, () => {
  console.log(`Running on port 5000.`)
})