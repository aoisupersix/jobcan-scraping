import { Page } from 'puppeteer'
import { waitForFileToDownload } from '../utils/download-util'

export enum DownloadFileType {
  Pdf,
  Csv,
}

const attendanceUrl = 'https://ssl.jobcan.jp/employee/attendance'

const minYear = 2009

export const downloadAttendanceByMonth = async (
  page: Page,
  year: number,
  month: number,
  downloadPath: string,
  fileType: DownloadFileType
): Promise<void> => {
  if (year < minYear || !Number.isInteger(year)) {
    Promise.reject(
      `The year given as an argument: ${year} is out of range. Year must be ${minYear} or above.`
    )
  }
  if (month < 1 || month > 12 || !Number.isInteger(month)) {
    Promise.reject(
      `The month given as an argument: ${month} is out of range. Specify an integer between 1 and 12 for the month.`
    )
  }

  await page.goto(attendanceUrl)
  if (page.url() !== attendanceUrl) {
    Promise.reject('jobcan not logged in.')
  }

  const client = await page.target().createCDPSession()
  client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  })
  await page.click('input[value="ダウンロード"]')
  await waitForFileToDownload(downloadPath)
}
