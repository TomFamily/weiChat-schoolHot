const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTimeFull(date) {
  //返回示例：2018518162526133
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return year + "" + month + "" + day + "" + hour + "" + minute + "" + second + "" + Math.floor(Math.random() * 1000);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 匹配 body 中的元素，删除 script 标签
 */

var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/
const getBodyHtml = html => {
  let result = REG_BODY.exec(html)
  if (result && result.length === 2) return result[1].replace(/<script.*?>.*?<\/script>/gi, '')
  return content.replace(/<script.*?>.*?<\/script>/gi, '')
}

module.exports = {
  getBodyHtml,
  formatTime,
  formatTime: formatTime,
  formatTimeFull: formatTimeFull,
  timeFomat: timeFomat//添加时间戳转时间

}

//时间戳转换时间  
function timeFomat(time) {
  if (time == null) {
    return '评估中...';
  }
  var date = new Date(time);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes();
  let s = date.getSeconds();
  return Y + M + D + h + m;
}
