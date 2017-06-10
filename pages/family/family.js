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
    familyPhone: "18390934608",
    familyJson: '{"a":"b"}',
    familyArray: [],
    namecss: 145,
    username:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.showShareMenu()
    console.log(app.globalData.userInfo.nickName)
    wx.request({
      url: 'https://icsuft.com/test/pulseFamily.php',
      data:{
        "userNickname": app.globalData.userInfo.nickName
      },
      success:function(res) {
        console.log(res);
        if (!res.data) {
          console.log("no relative this user");
        } else {
          var relative = res.data
          console.log(relative);
          var tmpArray = Array();
          for (var i = 0; i < relative.length; ++i) {
/*            console.log(prase(relative[i].avatarUrl))
            console.log(prase(relative[i].pulserecent))
            console.log(prase(relative[i].nickName))*/
            var tmpUser = Object(); 
            tmpUser["avatarUrl"] = prase(relative[i].avatarUrl)
            console.log("avatarUrl: ", tmpUser["avatarUrl"])
            tmpUser["nickName"] = decodeURI(relative[i].nickName)
            tmpUser["phonenum"] = prase(relative[i].phonenum)
            tmpUser["pulserecent"] = prase(relative[i].pulserecent)
            tmpUser["namecss"] = 45 + i * 100;
            tmpUser["statuscss"] = 45 + i * 100;
            tmpUser["phonecss"] = 33 + i * 100;
            tmpArray[i] = tmpUser;
          }
/*          console.log(that.data.familyArray)
          console.log(tmpUser)
          console.log(tmpArray)*/
          that.setData({
            familyArray: tmpArray
          })
        }
      }
    })

    /*
      json prase
      ----- var a = '{"a":"b","c":"d"}'
      ----- var b = JSON.parse(a)
      ----- console.log(b)
    */
/*    var a = '{"a":"b","c":"d"}'
    var b = JSON.parse(a)
    console.log(b)*/
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
  familyDeatil: function(e) {
    console.log(e)
    var username = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: "../familyDetail/familyDetail?username="+username
    })

  },
  makePhoneCall: function(e) {
    console.log(e)
    var phonenum = e.currentTarget.dataset.phonenum;   
    wx.makePhoneCall({
      phoneNumber: phonenum,
      success: function(res) {
        // success
        console.log("makePhoneCall success")
      }
    })
  },
  onPullDownRefresh: function () {
    console.log("refresh")
    console.log(app.globalData.userInfo.nickName)
    var that = this
    wx.request({
      url: 'https://icsuft.com/test/pulseFamily.php',
      data: {
        "userNickname": app.globalData.userInfo.nickName
      },
      success: function (res) {
        console.log(res);
        if (!res.data) {
          console.log("no relative this user");
          wx.stopPullDownRefresh()
        } else {
          var relative = res.data
          console.log(relative);
          var tmpArray = Array();
          for (var i = 0; i < relative.length; ++i) {
            /*            console.log(prase(relative[i].avatarUrl))
                        console.log(prase(relative[i].pulserecent))
                        console.log(prase(relative[i].nickName))*/
            var tmpUser = Object();
            tmpUser["avatarUrl"] = prase(relative[i].avatarUrl)
            tmpUser["nickName"] = relative[i].nickName
            tmpUser["pulserecent"] = prase(relative[i].pulserecent)
            tmpUser["phonenum"] = prase(relative[i].phonenum)
            tmpUser["namecss"] = 45 + i * 100;
            tmpUser["statuscss"] = 45 + i * 100;
            tmpUser["phonecss"] = 33 + i * 100;
            tmpArray[i] = tmpUser;
          }
          /*          console.log(that.data.familyArray)
                    console.log(tmpUser)
                    console.log(tmpArray)*/
          that.setData({
            familyArray: tmpArray
          })
          wx.stopPullDownRefresh()
        }
      }
    })

  }
})
function prase(str) {
  var strs = str.split(":")
  var content = ""
  for (var i = 1;i < strs.length; ++i) {
    if (i != strs.length -1 ) {
      content = content + strs[i] + ":";
    } else {
      content = content + strs[i] + "";
    }    
  }
  return content;
}