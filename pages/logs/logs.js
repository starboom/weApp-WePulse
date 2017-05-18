//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    pulseNum: 0,    /*脉搏大小*/
    pulseInfo:  "",   /*pulse信息*/
    date: ""
  },
  onLoad: function (opt) {
    console.log("onload")
    console.log(opt.pulseDataArray)
/*    var date = new Date()
    console.log(date.getMonth())*/
    /*根据opt的参数，做一个脉搏信息的详细显示
      1.脉搏的大小
      2.测量的时间
      3.脉搏的类型*/
    var pulseArray = opt.pulseDataArray.split(";")
    this.setData({
      date: pulseArray[0],
      pulseInfo : pulseArray[1],
      pulseNum : pulseArray[2]
    })
    
  },
  onShow: function () {
    console.log("onshow")
  },
  onReady: function () {
    console.log("onready")
  }
})

