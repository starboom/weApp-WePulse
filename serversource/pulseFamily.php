<?php
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
    查找用户set中某一信息：
      目前可以查找：
            avatarUrl
            pulseValue
    返回 set查找的key
        失败返回字符串false
  */
  function prase_set($set_ar, $info) {
    foreach($set_ar as $k) {
      $ret = strpos($k, $info);
      if (is_int($ret)) {
       return $k;
      }
    }
    return "false";
  }
  /*
    checkfamily
    参数： 1. redis
          2. ar 数组是 userfamily,XXX(nickname)
    不能有插入动作：
        是在redis中拿出某位用户亲戚的信息。
  */
  function checkfamily($redis, $nickname) {
    $userinfo = $redis -> sGetMembers($nickname);
    if (!$userinfo) {
      //无此用户
      return "false";
    } else {
      $relative = prase_set($userinfo, "relative");
      $ret = explode(":", $relative);
      /*
          ret 格式(array)
              0. relative
              1. 家属.... 以","分割
      */
      $relative_ar = explode(",", $ret[1]);//得到家属数组
      // 以json格式传回小程序
      $relative_detail = array();
      $i = 0;
      foreach($relative_ar as $k) {
        //echo $k;
        $k_decode = urldecode($k);
        $set = $redis -> sGetMembers($k_decode);
        $pulserecent = prase_set($set, "pulserecent");
        $avatarUrl = prase_set($set, "avatarUrl");
        $phonenum = prase_set($set, "phonenum");
        $tmpar = array("nickName" => $k_decode, "pulserecent" => $pulserecent,"avatarUrl" => $avatarUrl, "phonenum" => $phonenum);

        $relative_detail[$i] = $tmpar;
        $i ++;
      }
      echo json_encode($relative_detail, JSON_UNESCAPED_UNICODE) . "\n";
    }
  }
  function main() {
    $username = $_GET["userNickname"];
    $redis = redisInit('127.0.0.1', 6379);
    checkfamily($redis, $username);
  }

  main();
?>