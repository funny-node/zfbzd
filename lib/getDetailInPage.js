/**
 * 解析 DOM, 获取该页面的账单数据 
 * @https://consumeprod.alipay.com/record/standard.htm
 * @param {Object} options 
 * @return {Array<Object>}
 */
function getDetailInPage(options) {
  let {
    billStartTime = '00:00',  // 账单时间区间
    billEndTime = '24:00',
    minAmount = Number.NEGATIVE_INFINITY, // 账单价格区间
    maxAmount = Number.POSITIVE_INFINITY,
    billExcludes = [], // 根据关键字过滤某些账单
  } = options

  const ret = []
  const items = document.querySelectorAll('.J-item')

  items.forEach(item => {
    const date = item.querySelector('.time p').innerHTML.trim()
    const time = item.querySelector('.time .text-muted').innerHTML.trim()
    const amount = +item.querySelector('.amount .amount-pay').innerHTML.trim().replace(/ /g, '')
    const outerHTML = item.outerHTML 

    // 根据账单时间区间进行删选
    // 不在区间内，则放弃这条数据
    if (!isTimeInTheInterval(time, billStartTime, billEndTime)) return 

    // 根据 billExcludes 进行删选
    // 排除一些不必要的账单信息
    if (isIncludeExcludes(outerHTML, billExcludes)) return 

    // 价格不在区间里
    if (amount < minAmount || amount > maxAmount) return 
    
    ret.push({
      date, 
      time, 
      amount,
      outerHTML,
    })
  })

  return ret
  
  /** 
  * 经测试
  * page.evaluateHandle(pageFunction[, ...args])
  * pageFunction 方法里调用的方法不能是在外面的，所以只能写在 getDetailInPage 方法里面 ..
  */ 
  
  /**
   * 账单内容是否包含了需要排除的词
   * @param {String} outerHTML 
   * @param {Array} billExcludes 
   * @return {Boolean}
   */
  function isIncludeExcludes(outerHTML, billExcludes) {
    return billExcludes.some(item => outerHTML.includes(item))
  }

  /**
   * 判断一个时间是否在区间内
   * @param {String} time `hh:ss` 格式
   * @param {String} startTime `hh:ss` 格式
   * @param {String} endTime `hh:ss` 格式
   * @return {Boolean}
   */
  function isTimeInTheInterval(time, startTime, endTime) {
    let times = changeTimeToSeconds(time)
    let startTimes = changeTimeToSeconds(startTime)
    let endTimes = changeTimeToSeconds(endTime)
    
    return times >= startTimes && times <= endTimes
  }

  /**
   * 将 `hh:ss` 格式的时间格式转为秒
   * @param {String} time 
   * @return {Number}
   */
  function changeTimeToSeconds(time) {
    let [hour, second] = time.split(':').map(item => +item)
    return hour * 60 + second
  }
}

module.exports = getDetailInPage
