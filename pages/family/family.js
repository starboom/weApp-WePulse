// pages/family/family.js
var app = getApp()
Page({
  /*
    该页面呈现家庭成员的体征信息相关，
    体征信息包括
      1. 关系
      2. 姓名
      3. 近期健康指数 百分比 --- 低于70会报警 
      4. 是否可以打电话 联系
  */
  data:{
    familyAvatar: "../img/avatar.png",
    familyName: "爷爷",
    familyPulse: "88",
    familyPhone: "18390934608"

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.showShareMenu()
    console.log(app)

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
  },
  onShareAppMessage: function() {
    var shareUser = app.globalData.userInfo.nickName
    return {
      title: "邀请家人使用小程序", //确定是否成为xxx的家人，这样就可以通过一个人管理多个人了。
      path: '/pages/familyshare/familyshare?shareUser=' + shareUser,
      success: function(res) {
        console.log("share this page success")
      },
      fail: function(res) {
        console.log("share this page fail")
      }
    }
  },
/*
  一个家人的详细数据，请求
  家人最多三个 ---- 会员 五个 hhh
  点击家人栏，进入之后会有家人的定位信息
  定位信息一定要在使用设备进行体征监测的时候才可以查看到，
  如果没有在使用，那么就提示未在使用
  点击家人头像的时候，进入定位的界面，传递参数经纬度

  这个页面应该是可以分享出去的，一个人分享，然后其他家属可以通过他分享的情况，
  可以实现互通
*/
  familyDeatil: function() {
    wx.navigateTo({
      url: "../familyDetail/familyDetail"
    })

  },
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '15080615599',
      success: function(res) {
        // success
        console.log("makePhoneCall success")
      }
    })
  }

})