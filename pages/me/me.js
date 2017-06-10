// pages/me/me.js
var wxCharts = require('../../utils/wxcharts.js')
var app = getApp()
var areaChart = null

var app = getApp()

Page({
  data:{
    nickName:"",
    avatarUrl:"",
    phoneWidth:"",
    array : [[98, "sport", "1995"],[12,"sleep","1994"]],
    pulseNumArray: [""],
    pulseDataArray: [],
    pulseDataCate: [""],
    chart_block: false
  },
  touchHandler: function (e) {
      console.log("here is :", areaChart.getCurrentDataIndex(e));
      var index = areaChart.getCurrentDataIndex(e)
      console.log(e)
      if (index < 0) {
        index = 0
      }
      wx.navigateTo({
        url : "../logs/logs?pulseDataArray="+this.data.pulseDataArray[index]
      })

    areaChart.showToolTip(e);

  },
  OnChart:function(){
    var that = this
    that.setData({
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      chart_block: true
    })
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      that.setData({
        phoneWidth: windowWidth
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    /*从本地存储中读取出关于脉搏的信息，，，
      1. 根据脉搏的数值大小显示图表
    
    */

    try {
          var pulseDataArray = wx.getStorageSync('pulseDataArray') || false
          if (pulseDataArray) {
            console.log("pulseDataArray is ", pulseDataArray)
            that.setData({
              pulseDataArray: pulseDataArray
            })
            var pulseNumArrayTmp = new Array()
            pulseDataArray.map(function(contents, index, array1) {
                console.log("arr map  split is :", contents.split(";"))

                var pulseNum = contents.split(";").pop()
                console.log("pulse Num is : ", pulseNum)

                pulseNumArrayTmp.push(pulseNum)
            })
            that.setData({
              pulseNumArray: pulseNumArrayTmp
            })
            console.log(that.data.pulseNumArray)

            var pulseDataCate = new Array()
            for (var i = 0; i < this.data.pulseDataArray.length; ++i) {
                pulseDataCate.push(i)
            }
            that.setData({
              pulseDataCate: pulseDataCate
            })
            console.log(that.data.pulseNumArray)
            console.log("pulseDataCate is ", this.data.pulseDataCate)

        } else {
          console.log("pulseDataArray is null")
          that.setData({
            chart_block: false
          })
          return 0
        }
    } catch (e) {
      console.log("get sotre fail", e)
    }

    /*
      脉搏数据获取
      绘制图表
    */
/**************************/
    areaChart = new wxCharts({
        canvasId: 'areaCanvas',
        type: 'line',
        categories: this.data.pulseDataCate,
        animation: true,
        series: [{
            name: 'xxx',
            data: this.data.pulseNumArray,
            format: function (val) {
                return val;
            }
        }
        ],
        yAxis: {
            title: '心率(次／秒)',
            format: function (val) {
                return val;
            },
            min: 0,
            fontColor: '#8085e9', /*字体*/
            gridColor: '#8085e9', /*坐标线*/
            titleFontColor: '#f7a35c' /*标题颜色*/
        },
        xAxis: {
            fontColor: '#7cb5ec',
            gridColor: '#7cb5ec'
        },
        extra: {
            legendTextColor: '#cb2431' /*图例名*/
        },
        width: windowWidth,
        height: 200
    })
/**************************/


  },
  recentpulse: function() {
    //近期脉搏记录，从icsuft上获取

    //在icsuft上获取数据 todo 约束脉搏信息采集格式

    //将近期数据做一个展示
  },
  onReady:function(){
    // 页面渲染完成

  },
  onShow:function(){
    // 页面显示
    console.log("on show");
    this.OnChart();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})

/*

*/