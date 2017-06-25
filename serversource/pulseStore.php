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

  */
  function main(){
    echo "store pulseinfo" . "\n";
    var_dump($_GET);
    /*
        array(2) {
          ["nickName"]=>
          string(9) "方振华"
          ["pulserecent"]=>
          string(1) "0"
        }
    */
    $username = $_GET["nickName"];
    $pulserecent = "pulserecent:" . $_GET["pulserecent"];

    $redis = redisInit('127.0.0.1', 6379);
    if (!$redis) {
      echo "redis init failed" . "\n";
    }
    $userinfo = $redis -> sGetMembers($username);
    $pulserecent_old = prase_set($userinfo, "pulserecent");
    if ($pulserecent_old) {
      $redis -> sRem($username, $pulserecent_old);
      $redis -> sAdd($username, $pulserecent);
    } else {
      $redis -> sAdd($username, $pulserecent);
    }

  }


main();
?>