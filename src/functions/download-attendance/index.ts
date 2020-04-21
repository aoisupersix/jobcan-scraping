import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as puppeteer from 'puppeteer'
import { login } from '../../models/login'
import { getQuery } from '../../utils/get-query'
import {
  downloadAttendanceByMonth,
  DownloadFileType,
} from '../../models/attendance-downloader'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('HTTP trigger function download-attendance processed a request.')
  const name = getQuery(req, 'name')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  await login(page, 'dummy@dummy.com', 'dummy').catch((error) =>
    context.log(`login failed: ${error}`)
  )
  await downloadAttendanceByMonth(page, 2020, 4, '', DownloadFileType.Csv)
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
