/**
 * 格式化时间，月、日加前导 0
 * @param {String} dateStr 
 * @return {String}
 */
function formateDate(dateStr) {
  let [year, month, day] = dateStr.split('.')
  return [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')].join('.')
}

module.exports = {
  formateDate,
}