import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as puppeteer from 'puppeteer'
import { login } from '../../models/login'
import { PromiseResult } from '../../models/promise-result'
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
  const email = getQuery(req, 'email')
  const password = getQuery(req, 'password')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ja-JP'],
  })
  const page = await browser.newPage()

  const loginResult: PromiseResult<void> = await login(page, email, password)
    .then((value) => ({ value }))
    .catch((error) => ({ error }))

  if (loginResult.error) {
    context.log(`jobcan login failed. reason: ${loginResult.error}`)
    context.res = {
      status: 403,
      body: `jobcan login failed. reason: ${loginResult.error}`,
    }
    return
  }

  await downloadAttendanceByMonth(page, 2020, 4, '', DownloadFileType.Csv)
  await browser.close()

  context.res = {
    status: 200,
    body: 'TODO: ここで出勤簿を返す予定',
  }
}

export default httpTrigger
