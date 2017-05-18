// pages/familyshare/familyshare.js
Page({
  data:{
    shareUser: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      shareUser: options.shareUser
    })
    console.log(options)
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

    /*
      1. 数据不能为空，如果为空，弹窗提示
    */
    if (e.detail.value.input_relation == "" 
            || e.detail.value.input_phone == "") {
              //不能为空
              wx.showToast({
                  title: '信息不能为空',
                  image: '../img/error.png',
                  duration: 1000
              })
    } else {
          //提交了表单之后，那么post到服务器上，存到redis中
              wx.reLaunch({
               url: '/pages/index/index'
            })
    }
  },
  formReset: function() {
    console.log('form发生了reset事件')
  }
})