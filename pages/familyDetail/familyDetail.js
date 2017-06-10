// pages/familyDetail/familyDetail.js
//familyDeatil根据传过来的 经纬度显示当前该人在什么地方
var app = getApp()
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
    console.log(options)

    wx.request({
      url: 'https://icsuft.com/test/pulseLocation.php',
      data:{
        "getLocation":true,
        "nickName" : options.username
      },
      success: function(res) {
        console.log(res);
        var latitude = prase(res.data.latitude);
        var longitude = prase(res.data.longitude);
        var avatarUrl = prase(res.data.avatarUrl);
        console.log(avatarUrl);
        wx.getLocation({
          type: "gcj02",
          success: function (res) {
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: that.createMarkers(0, latitude, longitude, avatarUrl)
            })
            console.log(that.data.markers)
          }
        })
      }
    })

  },
  createMarkers: function(_id, _latitude, _longitude, _iconpath) {
     var _markers = [{
       iconPath: _iconpath,
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
function prase(str) {
  var strs = str.split(":")
  var content = ""
  for (var i = 1; i < strs.length; ++i) {
    if (i != strs.length - 1) {
      content = content + strs[i] + ":";
    } else {
      content = content + strs[i] + "";
    }
  }
  return content;
}