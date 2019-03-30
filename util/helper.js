/**
 * 格式化时间，月、日加前导 0
 * @param {String} dateStr 
 * @return {String}
 */
function formateDate(dateStr) {
  let [year, month, day] = dateStr.split('.')
  return [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('.')
}

/**
 * 将数据根据日期升序或者降序排列
 * @param {Array} ret 
 * @param {String} sorting 
 */
function reorder(ret, sorting) {
  if (!sorting) {
    return ret
  } else if (sorting === 'asc') { // 升序
    ret.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year 
      else if (a.month !== b.month) return a.month - b.month 
      else return a.day - b.day
    })
  } else if (sorting === 'desc') { // 降序
    ret.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year 
      else if (a.month !== b.month) return b.month - a.month 
      else return b.day - a.day
    })
  } else {
    throw new Error('参数错误')
  }

  return ret
}

module.exports = {
  formateDate,
  reorder,
}