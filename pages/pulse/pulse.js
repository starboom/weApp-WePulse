// pages/pulse/pulse.js

/*
  关于蓝牙的操作在这个页面中
*/
var bluetooth = require("../../utils/ble.js")
Page({
  data:{
    list: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    console.log(this)

    this.chooseBleToConnect()
    
  },
  //获取到蓝牙信息存入list
  chooseBleToConnect: function() {
    var ble = new bluetooth()
    console.log(ble)
    if (ble.list.length === 0) {//fix: console.log 
      console.log("连接成功")
      wx.redirectTo({
        url: '../pulse/pulse'
      })
    }
    this.setData({list: ble.list})
  },
  onReady:function(){
    // 页面渲染完成
    console.log('onReady')

  },
  cbFunction: function() {
    console.log('cbfunciton call back')
  },
  onShow:function(){
    // 页面显示
    console.log('onshow')
    console.log('onshow2')
  },
  onHide:function(){
    // 页面隐藏
    console.log('hide')
  },
  onUnload:function(){
    // 页面关闭
    console.log('unload,close')
  }
})