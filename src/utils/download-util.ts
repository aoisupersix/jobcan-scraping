import * as fs from 'fs'

const sleep = (msec: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, msec))

/**
 * headless-chromeでファイルダウンロードした際に完了まで待機します。
 * @param downloadPath ダウンロード先のディレクトリパス
 */
export const waitForFileToDownload = async (
  downloadPath: string
): Promise<string> => {
  console.log('Waiting to download file...')
  let filename: string
  while (!filename || filename.endsWith('.crdownload')) {
    filename = fs.readdirSync(downloadPath)[0]
    await sleep(500)
  }
  return filename
}
