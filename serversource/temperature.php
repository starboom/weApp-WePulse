<?php
/*

  /*
    websocket 服务端
      接受 树莓派 与 微信小程序的请求
  */
  function request_from_pi(){
    /*
      树莓派发送过来请求，利用此函数接收
    */
    echo "request_from_pi";
  }

  function request_from_wechat() {
    /*
      微信小程序发送请求 用此接收
    */

    echo "request_from_wechat";
  }
  function readtemperature($redis) {
    $pulse = 0;
    //echo "line 24";
    echo "line 25" . "\n";
    while(1){
      // echo $pulse."\n";
      // $pulse++;
      // echo file_get_contents("../../test/pulse") . "\n";
      //echo $pulse . "\n";
      echo $redis -> get("temperature") . "\n";
      sleep(1);
    }
  }

  function stop() {
    #kill all loops
    echo "stop from server" . "\n";
    echo "the killoop is " . $killloop . "before\n";
    $killloop = true;
    echo "the killloop is " . $killloop . "after" . "\n";
  }
  /*
    初始化redis
    参数 ip 一般为localhost
        port 一般为 6379
    返回值
        成功 返回redis对象
        失败 返回 false
  */
  function redisInit($ip, $port) {
    $redis = new Redis();
    if ($redis -> connect($ip, $port)) {
      //echo "success to redis" . "\n";
      return $redis;
    } else {
      return false;
    }
  }
  /*
    初始化 redis set集合
  */
  function setInit($redis, $ar) {
    $count = count($ar);
    $key = $ar[0];//user name
    /*
      在redis里面查看是否是新用户插入还是老用户
      判断是否有该用户
    */
    $ret = $redis -> sGetmembers($key);
    if (!$ret) {
      echo "this user is first in" . "\n";  
    
      for($i = 1; $i < $count; $i++) {
        $redis -> sAdd($key, $ar[$i]);
      // $redis -> sAdd($key, "avatarUrl:rltest");
      }
  /*    echo "key is $key " . "\n";
      echo "value is " . $ar[1] . "\n";*/
      $userinfo = $redis -> sGetMembers($key);
      /*
          对近期脉搏的一个处理是在于。。。。
          pulserecent 只能存在一个
      */
      $ret = prase_set($userinfo, "avatarUrl");
      echo "found is " . $ret . "\n";
    } else {
      echo "old sport is come" . "\n";
      /*
        老玩家来插脉搏信息
      */
      $oldsport = $ret;
      $pulserecent = prase_set($oldsport, "pulserecent");
      if ($pulserecent) {
        /*
          删除该值
        */
        /*
          ar[1] 可能不是pulserecent
        */
        $ret = strpos($ar[1], "pulserecent");
        if (is_int($ret)) {
          $redis -> sRem($key, $pulserecent);
          echo "line 95" . $ar[1] . "\n";
          $redis -> sAdd($key, $ar[1]);
        } else {
          #do none
        }
      } else {
        /*插入*/
        echo "ar is ", var_dump($ar) . "\n";
        $redis -> sAdd($key, $ar[1]);
      }
    }
  }
  /*
    查找用户set中某一信息：
      目前可以查找：
            avatarUrl
            pulseValue
    返回 set查找的key
  */
  function prase_set($set_ar, $info) {
    /*todo
      info 不能为空
      set_ar 不能为空
      保证参数正确
      找到返回value
      找不到返回 false
    */
    foreach($set_ar as $k) {
      $ret = strpos($k, $info);
      if (is_int($ret)) {
        return $k;
      }
    }
    return false;
  }
  /*
    存储userinfo至redis
  */
  function infostore($redis, $userinfo) {
    /*
      $userinfo 是一个用户信息数组，
             用户信息封装格式：
              1. userinfo： 说明这是一条关于用户信息的请求
              2. nickname： 用户昵称
              3. avatar：   用户头像
       $redis 存入方式 set 集合
    */
    // echo "the user is ", $userinfo[1] . "\n";
    // echo "the user avatar is ", $userinfo[2] . "\n";
    $userinfo_ar[0] = $userinfo[1];
    $userinfo_ar[1] = $userinfo[2]; 
    setInit($redis, $userinfo_ar);
  }
  /*
    checkfamily
    参数： 1. redis
          2. ar 数组是 userfamily,XXX(nickname)
    不能有插入动作：
        是在redis中拿出某位用户亲戚的信息。
  */
  function checkfamily($redis, $nickname) {
    //echo "this user is " . $nickname . "\n";
//  var_dump($redis -> sGetMembers($nickname));
    $userinfo = $redis -> sGetMembers($nickname);
    if (!$userinfo) {
      /*
        无此用户
      */
      //echo "new user no relative";
    } else {
      
      // echo "line 161 " . prase_set($userinfo, "relative") . "\n";
      $relative = prase_set($userinfo, "relative");
      $ret = explode(":", $relative);
      // echo "line 163 " . var_dump($ret) . "\n";
      /*
          ret 格式(array)
              0. relative
              1. 家属.... 以","分割
      */
      //$ret = $ret[1] . ",刘能";
      $relative_ar = explode(",", $ret[1]);//得到家属数组
      //echo $relative_ar[0] . "\n";
      // 以json格式传回小程序
      /*
        {
          "x1":{
            "name" : "xxx",
            "avatarUrl":"xxx",
            "pulserecent":"xxx"
          }
          "x2":{
            "avatarUrl":"xxx",
            "pulserecent":"xxx"
          }
        }
      */
      $relative_detail = array();
      $i = 0;
      foreach($relative_ar as $k) {
        //echo $k;
        $set = $redis -> sGetMembers($k);
        $pulserecent = prase_set($set, "pulserecent");
        $avatarUrl = prase_set($set, "avatarUrl");
        $tmpar = array("nickName" => $k, "pulserecent" => $pulserecent,"avatarUrl" => $avatarUrl);

        $relative_detail[$i] = $tmpar;
        $i ++;
      }
      //urlencode($relative_detail);
      //print_r($relative_detail);
      echo json_encode($relative_detail, JSON_UNESCAPED_UNICODE) . "\n";
      //$redis -> sAdd($nickname, "relative:方振华");
    }
  }
  function main() {
    /*
      主函数
    */
    $redis = redisInit('127.0.0.1', 6379);
    if ($redis == false) {
      return -1;
    } else {
      //echo "success in websocket server main" . "\n";
    }
/*    echo "xxxx" . "\n";
    echo var_dump($_POST) . "\n";
    echo var_dump($_GET) . "\n";*/
    readtemperature($redis);
    $ret = fopen("php://stdin", "r");
    //print_r($req_prase);
    while($req = fgets($ret)) {
      $req = trim($req);
      $req_prase = explode(",", $req);
      print_r($req_prase);
      switch ($req_prase[0]) {
        case 'pi':
          # code...
          break;
        case 'test':
          # code...
          echo "test is ok"."\n";
          //var_dump($redis -> sGetMembers($req_prase));
          break;
        case 'readpulse':
          echo "readpulse is call"."\n";
          readpulse();
          break;
        case 'stop':
          #if stop
          #call stop()
          stop();
          break;
          /*
            查看某一位用户家人的信息
            websocket 处理请求字段为：
              userfamily,XXX(nickname)
          */
        case 'userfamily':
          #call checkfamily
          checkfamily($redis, $req_prase[1]);
          break;
        /*
          功能入口：
            将用户信息注入redis
        */
        case 'userinfo':
          /*
            处理的是数组
            用户信息封装格式：
              1. userinfo： 说明这是一条关于用户信息的请求
              2. nickname： 用户昵称
              3. avatar：   用户头像
              4. pulserecent: 近期的一次脉搏
          */
          #call infostore()
          infostore($redis, $req_prase);
          break;
        default:
          #do none;
          echo "server nothing to do with " . trim($req) . "\n";
          break;
      }
    }
  }

  main();
?>


<!--
          处理 其他地方传来的字符串，微信小程序以数组形式传来之后
          如 ["a","b"] ===> a,b
          解析 a,b
          echo "the response is" . trim($req) . "\n";
          echo "prase data ...." ;
          $str_ar = explode(",", $req);
          echo "first is " . $str_ar[0] . "\n";
          echo "second is " . $str_ar[1] . "\n";  

-->
