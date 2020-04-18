import { Page } from 'puppeteer'

const loginUrl = 'https://id.jobcan.jp/users/sign_in'

/**
 * ジョブカンにログインします。
 * ログインに失敗した場合はRejectします。
 * @param page ログインを実行するPuppeteerのページ
 * @param email ログインするアカウントのEメールアドレス
 * @param password ログインするアカウントのパスワード
 */
export const login = async (
  page: Page,
  email: string,
  password: string
): Promise<void> => {
  await page.goto(loginUrl)
  await page.type('#user_email', email)
  await page.type('#user_password', password)

  await (await page.$('#user_password')).press('Enter')
  await page.waitForNavigation()

  if (page.url() === loginUrl) {
    // ログイン失敗
    const error = await page.$eval('p.flash__notice', (e) => e.textContent)
    return Promise.reject(error)
  }
}
