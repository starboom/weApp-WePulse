var tmpList = new Array()
var wxBle = function wxBle() {
	wx.openBluetoothAdapter({
      success: function(res){
       console.log("openBluetoothAdapter success")
       wx.startBluetoothDevicesDiscovery({
                services: [],
                success: function(res){
                  console.log('startBluetoothDevicesDiscovery success')
                   console.log(res);
                },
                fail: function(res) {
                   console.log("startBluetoothDevicesDiscovery fail");
                }
        })
      },
      fail: function() {
        console.log("openBluetoothAdapter fail")
      }
    })
  var that = this
  wx.getBluetoothDevices({
      success: function(res){
        console.log("getBluetoothDevices success 1")
        console.log("fzh:--------------")
        console.log(res.devices)
        var count = res.devices.length
        tmpList.length = count

        for (var i =0; i < count; ++i) {
          tmpList[i] = new Object()
          tmpList[i].name = res.devices[i].name
          tmpList[i].deviceId = res.devices[i].deviceId
          tmpList[i].advertisServiceUUIDs = res.devices[i].advertisServiceUUIDs
        }
        console.log("fzh:--------------")
      //  console.log(that.list)
      },
      fail: function(res) {
        // fail
        console.log("getBluetoothDevices fail")
      },
      complete: function() {
        console.log("getBluetoothDevices complete")
      }
    })
  console.log("getBluetoothDevices success 2")
}
wxBle.prototype.list = tmpList
function fun1() {
    console.log("fun1 called")
    return 2
}
/*  
  var wxBle = function wxBle(opt) {
    this.list = findBleDevices()
    console.log("fzh: wxBle")
  }
*/
module.exports = wxBle
