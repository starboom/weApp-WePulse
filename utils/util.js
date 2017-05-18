function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime)
      return;
  }
}
var cloudServer = "https://icsuft.com/test/"

function getApi(phpname, _method="GET", _data) {
  return new Promise( (res,rej) => {
    wx.request({
      url: cloudServer + phpname,
      method: _method,
      data:_data,
      success: res,
      fail: function() {
        console.log("request is fail")
      },
      complete: function() {
        console.log("request is send")
      }
    })
    sleep(500)
  })
}

module.exports = {
  formatTime: formatTime,
  sleep: sleep,
  request(phpname, method, data) {
    return getApi(phpname, method, data).then(res => res.data)
  }
}
