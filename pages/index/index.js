//index.js
//home page: 
//展示用户微信头像，微信昵称
//展示脉搏实时折线图
/**
 * 1.手机和树莓派通过蓝牙连接，
 * 小程序连接蓝牙成功
 * 在蓝牙中读取脉搏信号
 * 对于树莓派，连接手机蓝牙，
 * 与小程序进行数据传输
 * 小程序实时展示脉搏，
 * 蓝牙断开，脉搏展示为缓存内容
 * 
 */
var bluetooth = require("../../utils/ble.js")
var util = require('../../utils/util.js')
var g_flag = true
var timer = null;//
var interval = 1000;

var app = getApp()
Page({
  data: {
    userInfo: {},
    heartimg: "",
    beatvalue: 0,
    pulseInfoArray: ['请选择','运动时', '起床后', '睡觉前'],
    pulseInfoIndex: 0,
    index: 0,
    blestat: 0,
    animationData: {},
    g_flag : true,
    start_flag : true,
    picker_switch: true,
    choosePulseInfoFlag: false,
    pulseInfoCount: 0,
    ble_stat_icon : "../img/ble_down.png",
/*******************************/
    x : 0,
    y : 0,
    hidden : true
/*******************************/
  },
  //事件处理函数
  bindViewTap: function() {
    var that = this
    console.log(that)
    wx.navigateTo({
      url: '../me/me'
    })
  },
  onLoad: function (opt) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onReady: function() {

  },
  heartStart: function() {

    wx.showLoading({
      title: '连接远端服务器中...',
    })

    setTimeout(function(){
      wx.hideLoading()
    },1400)

    var that = this
    var phpfile = "pulseReader.php"
    var method = "GET"
    that.setData({
      start_flag : false
    })
    if (that.data.g_flag == true) {
      timer = setInterval(function () { 
              sendReq2Server(that, phpfile) }, 1);    
      that.setData({
        g_flag : false
      })
    } else {
      console.log("点击不生效，只可以stop之后再次点击生效")
      return 0
    }
  },
  heartStop: function() {
    var that = this
    this.setData({
      start_flag : true
    })
    console.log("stop!!")
    this.setData({
      stop: true,
      picker_switch : !this.data.picker_switch,
      g_flag : true
    })
    clearInterval(timer)
    wx.showModal({
      title: "是否保存采集的数据",
      content: '保存数据，有助于分析您的体征状态',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log("pulse current is ", that.data.beatvalue)
          that.setData({
            choosePulseInfoFlag: true
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  choosePulseInfo: function(res) {
    var that = this

    that.setData({
      pulseInfoIndex: res.detail.value
    })
    wx.showToast({
      title: '选择成功 :）',
    })
    setTimeout(function(){
      wx.hideToast()
    },2000)
    setTimeout(function() {
      that.setData({
        choosePulseInfoFlag: false
      })     
    }, 2000);
    console.log("pulseInfoIndex is ", that.data.pulseInfoIndex)
    storePulseInfo(that, that.data.pulseInfoIndex)
  },
  onShareAppMessage: function() {
    return {
      title: 'hello world',
      path: '/pages/index/index?id=123',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      }
    }
  }
})
function drawPic() {
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.moveTo(10, 10)
    util.sleep(1000)
    ctx.lineTo(100,10)
    util.sleep(1000)
    util.sleep(1000)
    ctx.lineTo(100,100)
    util.sleep(1000)
    util.sleep(1000)
    ctx.stroke()
    ctx.draw()
}
//读取脉搏数据
//默认get
function sendReq2Server(that, phpfile, method="GET", data="") {
  util.request(phpfile, method, data).then(
          d => that.setData({
              beatvalue : d
  }))
}
/*
  功能： 存储脉搏信息，以数组的形式存储
        会有存储器计数，可以当作脉搏信息数组的访问下标志
  参数： that page页实例对象
        index 脉搏情景数组的下标，表示用户在哪种情境下测试的脉搏信息
*/
function storePulseInfo(that, index) {
  /*当前时间 存储*/
  console.log(Date.now())
  console.log("this is time", util.formatTime(new Date(Date.now())))
  var date = util.formatTime(new Date(Date.now()))
  var pulseInfo = that.data.pulseInfoArray[index]
  var pulseNum = that.data.beatvalue

  var pulseDataArray = date + ";" + pulseInfo + ";" + pulseNum
  console.log("the complete pulseInfo is ", pulseDataArray)

  var dataArray = wx.getStorageSync('pulseDataArray') || []
  dataArray.push(pulseDataArray)
  wx.setStorageSync('pulseDataArray', dataArray)


}
