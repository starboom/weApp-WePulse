// pages/temperature/temperature.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temperature: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("hello:");

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.connectSocket({
      url: 'wss://icsuft.com:12346',
      success: function () {
        console.log("line 124 success")
      },
      fail: function () {
        console.log("ling 128 fail");
      }
    })
    wx.onSocketOpen(function (res) {
      console.log("we send pulseread request");
      /*      wx.sendSocketMessage({
              data: ["readpulse"]
            })//读取脉搏信息 todo*/
    })
    wx.onSocketError(function () {
      console.log("line 137 socket error");
    })
    wx.onSocketMessage(function (res) {
      console.log(res.data)
      that.setData({
        temperature: res.data
      })
    })    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.closeSocket()
    wx.onSocketClose(function(res){
      console.log("websocket close")
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket()
    wx.onSocketClose(function (res) {
      console.log("websocket close")
    }) 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})