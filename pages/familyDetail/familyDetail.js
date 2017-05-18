// pages/familyDetail/familyDetail.js
//familyDeatil根据传过来的 经纬度显示当前该人在什么地方
Page({
  data: {
    markers: [],
    longitude: "",
    latitude: ""
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: that.createMarkers(0, "28.165898", "112.942655")
        })
      }
    })

  },
  createMarkers: function(_id, _latitude, _longitude) {
     var _markers = [{
       iconPath: "../img/avatar.png",
       id: _id,
       latitude: _latitude,
       longitude: _longitude,
       width: 50,
       height: 50
     }]

    return _markers
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})