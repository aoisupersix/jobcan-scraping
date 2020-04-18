import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as puppeteer from 'puppeteer'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('HTTP trigger function download-attendance processed a request.')
  const name = req.query.name || (req.body && req.body.name)
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto('https://id.jobcan.jp/users/sign_in')
  await page.screenshot({ path: 'screenshot.png' })

  await browser.close()

  if (name) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: 'Hello ' + (req.query.name || req.body.name),
    }
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body',
    }
  }
}

export default httpTrigger
