// pages/familyshare/familyshare.js
var app = getApp()
Page({
  data:{
    shareUser: "",
    newuser: "",
    avatarUrl: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      shareUser: options.shareUser
    })
    console.log(options)
    var that = this
    wx.login({
      success: function(){
        wx.getUserInfo({
          success: function(res){
            console.log(res)
            that.setData({
              newuser: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            })
          },
          fail: function() {
            console.log("getuserinfo fail")
          }
        })
      },
      fail: function() {
        console.log("line 23 login fail")
      },
      complete: function() {
        console.log("line 29 ")
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            that.setData({
              newuser: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            })
          },
          fail: function () {
            console.log("getuserinfo fail")
          }
        })       
      }
    })
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
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var that = this
    var phonenum = e.detail.value.input_phonenum;
    console.log("phonenum is ", phonenum)
    var sharefrom = decodeURI(that.data.shareUser)
    var newuser = decodeURI(that.data.newuser)
    if (e.detail.value.input_phonenum == "") {
      //不能为空
      wx.showToast({
        title: '信息不能为空',
        image: '../img/error.png',
        duration: 1000
      })      
    } else {
      //提交了表单之后，那么post到服务器上，存到redis中

      wx.request({
        url: 'https://icsuft.com/test/pulseShare.php',
        success: function(res){
          console.log(res)
        },
        data: {
          "phonenum": phonenum,
          "sharefrom": sharefrom,
          "newuser": newuser,
          "avatarUrl": that.data.avatarUrl
        }
      })
      wx.reLaunch({
        url: '/pages/index/index'
      })    
    }
  },
  formReset: function() {
    console.log('form发生了reset事件')
  }
})