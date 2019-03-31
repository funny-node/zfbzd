/**
 * 改变账单起始以及截止日期
 * @param {Page} page 
 * @param {String} startDate 账单起始日期
 * @param {String} endDate 账单结束日期
 * @param {Number} clickDatePickerDelay 模拟点击时间选择器的间隔时间，单位毫秒
 */
function setIntervalDate(page, startDate, endDate, clickDatePickerDelay) {
  return new Promise(async resolve => {
    /** 
    * 支付宝账单页默认删选区间是最近一个月
    * 比如今天是 2019-02-16
    * 那么默认显示的删选日期是 2019-01-16 ~ 2019-02-16
    * 我们需要手动将其置为 [startDate, endDate]
    */
    
    // 改变开始日期
    // 通过计算获取默认的开始时间
    let cur_date = new Date()
    let start_year = cur_date.getFullYear()
    let start_month = cur_date.getMonth()
    // 目标时间
    let target_start_year = +startDate.split('.')[0]
    let target_start_month = +startDate.split('.')[1]
    // 相隔的月数，也是需要点击点一个月按钮的次数
    let times = (start_year * 12 + start_month) - (target_start_year * 12 + target_start_month)

    await page.waitFor(clickDatePickerDelay)
    await page.click('#beginDate')
    await page.waitFor(clickDatePickerDelay)

    // 这里有个特殊情况，可能会是 -1，需要特判
    if (times === -1) {
      await page.click('body > div.jui-calendar > div.jui-calendar-pannel > span.jui-calendar-control.jui-calendar-next-month')
      await page.waitFor(clickDatePickerDelay)
    } else {
      while (times --) {
        await page.click('body > div.jui-calendar > div.jui-calendar-pannel > span.jui-calendar-control.jui-calendar-prev-month')
        await page.waitFor(clickDatePickerDelay)
      }
    }
    
    await page.click(`body > div.jui-calendar > div.jui-calendar-container > table.jui-calendar-date > tbody [data-value="${startDate}"]`)
    
    // 改变结束日期
    // 默认的结束日期就是今天
    let end_date = new Date()
    let end_year = end_date.getFullYear()
    let end_month = end_date.getMonth() + 1
    // 目标时间
    let target_end_year = +endDate.split('.')[0]
    let target_end_month = +endDate.split('.')[1]
    times = (end_year * 12 + end_month) - (target_end_year * 12 + target_end_month)
    
    await page.waitFor(clickDatePickerDelay)
    await page.click('#endDate')
    await page.waitFor(clickDatePickerDelay)

    while(times --) {
      await page.click('body > div.jui-calendar > div.jui-calendar-pannel > span.jui-calendar-control.jui-calendar-prev-month')
      await page.waitFor(clickDatePickerDelay)
    }

    await page.click(`body > div.jui-calendar > div.jui-calendar-container > table.jui-calendar-date > tbody [data-value="${endDate}"]`)
    
    resolve()
  })
}

module.exports = setIntervalDate
