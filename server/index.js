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

    await page.waitForSelector('#app-root > div > div.settings-NavMenuContainer', {state: 'visible', timeout: 2147483647})
    await page.waitForSelector('#indeed-globalnav-logo')
    await page.click('#indeed-globalnav-logo')
    await page.waitForLoadState('load')

    await page.waitForSelector('#text-input-what')
    const whatInput = await page.$('#text-input-what')
    await whatInput.type(req.body.what)

    await page.waitForSelector('#text-input-where')
    const whereInput = await page.$('#text-input-where')
    await whereInput.type(req.body.where)
    
    await page.keyboard.press('Enter')
    await page.waitForLoadState('load')

    try {
      await page.waitForSelector('#resultsCol > div.no_results > div > p > a')
      await page.click('#resultsCol > div.no_results > div > p > a')
      await page.waitForLoadState('load')
    } catch (error) {
      console.log('no result error')
    }

    let currentPage = 0

    const openAllLinks = async () => {
      for(let i = 0; i < context.pages().length; i++){
        let page = context.pages()[i]
        try {
          await page.waitForSelector('#mosaic-provider-jobcards > ul > li',)
          const links = await page.locator('#mosaic-provider-jobcards > ul > li').count()
          const promises = []
          const closeModal = async () => {
            try {
              await page.waitForSelector('#popover-x > button')
              await page.click('#popover-x > button')
            } catch (error) {
              console.log('modal error')
            }
          }
          for(let i = 1; i <= links; i++){
            const openLink = async () => {
              try {
                await page.waitForSelector(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`)
                await page.click(`#mosaic-provider-jobcards > ul > li:nth-child(${i})`, {modifiers: ['Control']})
              } catch (error) {
                console.log('open jobs error')
              }
            }
            promises.push(
              new Promise(res=>{
                closeModal().then(()=>{
                  openLink().then(()=>{
                    res(null)
                  })
                })
              })
            )
          }
          Promise.all(promises).then(()=>{
            currentPage = currentPage + 2
            let pages = context.pages()
            const promises = []
            const apply = async (newPage) => {
              await newPage.waitForLoadState('load')
              const applyOut = await newPage.locator(`a:has-text('Apply on company site')`).count()
              if(applyOut > 0){
                try {
                  await newPage.click(`a:has-text('Apply on company site')`)
                  await newPage.close()
                } catch (error) {
                  console.log('company site click error')
                  console.log(applyOut)
                  console.log(await newPage.locator(`a:has-text('Apply on company site')`))
                }
              }else{
                try {
                  await newPage.waitForSelector('#indeedApplyButton')
                  await newPage.click('#indeedApplyButton')
                } catch (error) {
                  console.log('indeed apply error')
                }
              }
            }
            for(const newPage of pages){
              promises.push(
                new Promise(res=>{
                  apply(newPage).then(()=>{
                    res(null)
                  })
                })
              )
            }
            const nextPage = async () => {
              console.log('go to next page')
              console.log(currentPage)
              try {
                await page.waitForSelector(`#resultsCol > nav > div > ul > li:nth-child(${currentPage}) > a`)
                await page.click(`#resultsCol > nav > div > ul > li:nth-child(${currentPage}) > a`, {modifiers: ['Control']})
                await page.close()
              } catch (error) {
                console.log('nextPage error')
              }
            }
            Promise.all(promises).then(() => {
              nextPage().then(()=>{
                openAllLinks()
              })
            })
          })
        } catch (error) {
          console.log('no page')
          let newPage = context.pages()[0]
          await newPage.waitForLoadState('load')
          try {
            await newPage.click('label:has-text("First Name")')
            await newPage.keyboard.type('Anmol')
            await newPage.click('label:has-text("Last Name")')
            await newPage.keyboard.type('Virk')
            await newPage.click('label:has-text("Email")')
            await newPage.keyboard.type('virkanmol7@gmail.com')
            await newPage.click('label:has-text("Phone")')
            await newPage.keyboard.type('+919779464857')
          } catch (error) {
            console.log('no form')
            try {
              await newPage.click(`a:has-text('Apply Now')`)
            } catch (error) {
              console.log('no apply button')
              try {
                await newPage.click(`a:has-text('Apply now')`)
              } catch (error) {
                console.log('no apply button')
                try {
                  await newPage.click(`a:has-text('I'm interested')`)
                } catch (error) {
                  console.log('no apply button')
                  try {
                    await newPage.click(`a:has-text('Apply To Position')`)
                  } catch (error) {
                    console.log('no apply button')
                    try {
                      await newPage.click(`a:has-text('Apply')`)
                    } catch (error) {
                      console.log('no apply button')
                      try {
                        await newPage.click(`a:has-text('Apply for job')`)
                      } catch (error) {
                        console.log('no apply button')
                        try {
                          await newPage.click(`a:has-text('I'm interested')`)
                        } catch (error) {
                          console.log('no apply button')
                          await newPage.close()
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    openAllLinks()

  } catch {
    await browser.close()
  }

}

app.post('/', (req, res) => {
  main(req).then(()=>{
    // res.send(null)
  })
})

app.listen(5000, () => {
  console.log('Running on port 5000.')
})