const { loginByScanQR, loginByCookies, loginByPwd } = require('zfbdl')
const { TimeoutError } = require('puppeteer/Errors')
const { formateDate, reorder } = require('./util/helper')
const setIntervalDate = require('./lib/setIntervalDate')
const getDetailInPage = require('./lib/getDetailInPage')

/**
 * 根据时间区间获取账单详情
 * @param {Object} options 必填
 * @return {Array<Object>}
 */
function getBills(options = {}) {
  let {
    startDate, // 必填
    endDate, // 必填
    loginMethod = 'scan', // 默认扫码登录
    username, // 如果 loginMethod === 'pwd' 则必填
    password, // 如果 loginMethod === 'pwd' 则必填
    puppeteerOptions = {},
    turnPageDelay = 8000, // 默认翻页之间停顿 8s
    clickDatePickerDelay = 800, // 默认时间选择器操作之间停顿 0.8s
    sorting,
  } = options

  startDate = formateDate(startDate)
  endDate = formateDate(endDate)

  return new Promise(async resolve => {
    let page 

    // 模拟登录
    if (loginMethod === 'scan') {
      page = await loginByScanQR(puppeteerOptions)
    } else if (loginMethod === 'cookies') {
      page = await loginByCookies(puppeteerOptions)
    } else if (loginMethod === 'pwd') {
      page = await loginByPwd(username, password, puppeteerOptions)
    }

    await page.goto('https://consumeprod.alipay.com/record/standard.htm')

    // 如果操作频繁，可能需要扫码验证
    try {
      await page.waitForSelector('.J-item', { timeout: 0 })
    } catch (e) {
      if (e instanceof TimeoutError) {
        console.log('长时间没有扫描验证码，被当作机器啦！')
      }
    }

    // 设置时间删选区间
    await setIntervalDate(page, startDate, endDate, clickDatePickerDelay)

    await page.waitFor(turnPageDelay)
    
    // 账单数据
    let cost_data = []

    while (true) {
      // 分析页面数据
      let ret = await page.evaluate(getDetailInPage, options)
      cost_data.push(...ret)

      // 已经到了最后一页
      if (!await page.$('#J_home-record-container > div.amount-bottom > div > div.fn-clear.action-other.action-other-show > div.page.fn-right > div > a.page-next.page-trigger')) {
        break
      }
      
      await Promise.all([
        page.click('#J_home-record-container > div.amount-bottom > div > div.fn-clear.action-other.action-other-show > div.page.fn-right > div > a.page-next.page-trigger'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
      ])

      // 如果操作频繁，可能需要扫码验证
      try {
        await page.waitForSelector('.J-item', { timeout: 0 })
      } catch (e) {
        if (e instanceof TimeoutError) {
          console.log('长时间没有扫描验证码，被当作机器啦！')
        }
      }
      
      await page.waitFor(turnPageDelay)
    }

    resolve(reorder(cost_data, sorting))

    // 这样才能关闭 node 进程
    await browser.close() 
  })
}

module.exports = getBills
