//index.js
//home page: 
//展示用户微信头像，微信昵称
//展示脉搏实时折线图
/*
本页面功能：
1.访问服务器，读取脉搏数值
  服务器url : icsuft.com
2.点击头像跳转 /pages/me 页面
*/
var util = require('../../utils/util.js')

var timer = null;//
var interval = 1000;
var websocketFlag = true;//判断是否连接websocket的标志
var pulseFlag = false;
var app = getApp()
Page({
  data: {
    userInfo: {},
    heartimg: "",
    beatvalue: 0,
    pulseInfoArray: ['洗澡后', '运动前', '运动后', '起床后', '睡觉前'],
    pulseInfoIndex: 0,
    index: 0,
    blestat: 0,
    animationData: {},
    start_flag : true,
    choosePulseInfoFlag: false,
    pulseInfoCount: 0,
    ble_stat_icon : "../img/ble_down.png",
    username: "",
    useravatar: "",
    waitFlag: true
  },
  /*
    点击绑定函数:
      跳转页面 /pages/me
  */
  bindViewTap: function() {
    var that = this
    // console.log(that)
    wx.navigateTo({
      url: '../family/family'
    })
  },
  bindTemperature: function () {
    var that = this
    // console.log(that)
    wx.navigateTo({
      url: '../temperature/temperature'
    })
  },
/*
页面加载函数:
  读取用户相关信息，做好准备工作。
*/
  onLoad: function (opt) {
    var that = this
    /**
     * app初始化时建立websocket连接
     */

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      console.log(userInfo)

      wx.request({
        url: 'https://icsuft.com/test/pulseReader.php',
        data:{
          "userInfo" : userInfo
        },

        method: "GET",
        success: function(res) {
          console.log(res);
          wx.getLocation({
            type: "gcj02",
            success: function (res) {
              wx.request({
                url: 'https://icsuft.com/test/pulseLocation.php',
                data: {
                  latitude: res.latitude,
                  longitude: res.longitude,
                  nickName: that.data.userInfo.nickName
                },
                success: function (res) {
                  console.log(res);
                }
              })
            }
          })
        }
      })
    })
  },
  onReady: function() {
    console.log("onReady")
  },
  heartStart: function() {
    var that = this
    var pulseArray = []

    // 一个假加载状态，提示用户正在连接服务器
    wx.showLoading({
      title: '正在检测,请稍后',
    })
    setTimeout(function () {
      wx.hideLoading()

    }, 1400
    )

    wx.connectSocket({
      url: 'wss://icsuft.com:12345',
      success: function(){
        console.log("line 124 success")
      },
      fail: function(){
        console.log("ling 128 fail");
      }
    })
    wx.onSocketOpen(function(res){
      console.log("we send pulseread request");
/*      wx.sendSocketMessage({
        data: ["readpulse"]
      })//读取脉搏信息 todo*/
    })
    wx.onSocketError(function(){
      console.log("line 137 socket error");
    })
    wx.onSocketMessage(function (res) {
      console.log("doing")
      console.log(that.data.waitFlag)
      if (res.data < 90 && res.data > 50) {
        that.setData({
          //beatvalue: res.data,
          beatvalue: "",
          waitFlag: true
        })
        pulseArray.push(res.data)
        pulseFlag = true
      } else {
        that.setData({
          waitFlag: true
        })
        if (pulseFlag) {

          wx.closeSocket()
          console.log(pulseArray)
        }
      }
    })

    wx.onSocketClose(function (res) {
      that.setData({
        waitFlag: false,
        beatvalue: pulseArray.shift()
      })
      console.log("pulse num is ", that.data.beatvalue)
    })
    that.setData({
      start_flag : false,
      choosePulseInfoFlag: false//不显示脉搏采取场景样式
    })
/*
    var that = this
    var phpfile = "pulseReader.php"
    var method = "GET"
    timer = setInterval(function () { 
            sendReq2Server(that, phpfile) }, 1);
*/  },
  heartStop: function() {
    var that = this
    this.setData({
      start_flag : true,
      waitFlag: true
    })
    console.log("stop!!")
    pulseFlag = false
    //clearInterval(timer)
    /*
      断开websocket连接，目的是停止采集脉搏循环请求
    */
    wx.closeSocket();


    
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
          that.setData({
            beatvalue: 0           
          })
        }
      }
    })
  },
  choosePulseInfo: function(res) {
    var that = this

    that.setData({
      pulseInfoIndex: res.detail.value,
      choosePulseInfoFlag: false    
    })
    wx.showToast({
      title: '选择成功 :）',
    })
    setTimeout(function(){
      wx.hideToast()    
    }, 2000);
    console.log("pulseInfoIndex is ", that.data.pulseInfoIndex)
    storePulseInfo(that, that.data.pulseInfoIndex)
  }
})

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
/*  wx.closeSocket();
  wx.onSocketClose(function(res){
    wx.connectSocket({
      url: 'wss://icsuft.com:12345',
      success: function (res) {
        console.log("line 276 success ")
      },
      fail: function (res) {
        console.log("line 279 fail")
      }
    })
    wx.onSocketOpen(function (res) {
      wx.sendSocketMessage({
        data: ["userinfo", that.data.userInfo.nickName, "pulserecent:" + pulseNum] //保存的肯定是最近的一次pulse
      })
    })
    wx.onSocketMessage(function (res) {
      console.log("line 288 on socketmessage: ", res.data)
    })
  })*/
  wx.request({
    url: 'https://icsuft.com/test/pulseStore.php',
    data:{
      "nickName" : that.data.userInfo.nickName,
      "pulserecent" : pulseNum
    },
    success: function(res) {
      console.log(res);
    }
  })

  that.setData({
    beatvalue: 0 
  })
}
