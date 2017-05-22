<?php
  /*
    websocket 服务端
      接受 树莓派 与 微信小程序的请求
  */
  function request_from_pi(){
    /*
      树莓派发送过来请求，利用此函数接收
    */
  }

  function request_from_wechat() {
    /*
      微信小程序发送请求 用此接收
    */

    echo "hello, i know u are wechat";
  }

  function main() {
    /*
      主函数
    */

    $ret = file_get_contents("php://input", "r");
    while($req = fgets($stdin)) {
      switch (trim($req)) {
        case 'pi':
          # code...
          break;
        
        case 'wechat':
          # code...
          request_from_wechat();
          break;
        default:
          #do none;
          break;
      }
    }
  }
?>
