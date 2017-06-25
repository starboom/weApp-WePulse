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
    foreach($set_ar as $k) {
      $ret = strpos($k, $info);
      if (is_int($ret)) {
        return $k;
      }
    }
    return false;
  }

  function main() {
    /*
        array(1) {
          ["userInfo"]=>
          string(241) "{"nickName":"方振华","gender":1,"language":"en","city":"Changsha","province":"Hunan","country":"CN","avatarUrl":"http://wx.qlogo.cn/mmopen/vi_32/E72WFDrUxd9N5B3KqlT3DA11EhFN19P8Z5PDDFwwso16ktze3x5sLcDwYYnJic84rficRk9EQaORSoyicx5wuszQw/0"}"
        }
    */
    $userinfo = json_decode($_GET["userInfo"], JSON_UNESCAPED_UNICODE);
    var_dump($userinfo);
    /*
      array(7) {
        ["nickName"]=>
        string(9) "方振华"
        ["gender"]=>
        int(1)
        ["language"]=>
        string(2) "en"
        ["city"]=>
        string(8) "Changsha"
        ["province"]=>
        string(5) "Hunan"
        ["country"]=>
        string(2) "CN"
        ["avatarUrl"]=>
        string(123) "http://wx.qlogo.cn/mmopen/vi_32/E72WFDrUxd9N5B3KqlT3DA11EhFN19P8Z5PDDFwwso16ktze3x5sLcDwYYnJic84rficRk9EQaORSoyicx5wuszQw/0"
      }
    */
    $redis = redisInit('127.0.0.1', 6379);
    if ($redis == false) {
      echo "redis is init failed" . "\n";
    }
    $username = $userinfo["nickName"];
    $useravatar = "avatarUrl:" . $userinfo["avatarUrl"];
    $userprovince = "province:" . $userinfo["province"];
    // 查看用户是否为老用户
    $ret = $redis -> sGetMembers($username);
    if (!$ret) {
      echo "new user" . "\n";
      // new user
      $redis -> sAdd($username, $useravatar);
      $redis -> sAdd($username, $userprovince);
    } else {
      echo "old sport" . "\n";
      $oldsport = $ret;
      $useravatar_old = prase_set($oldsport, "avatarUrl");
      if ($useravatar_old) {
        $redis -> sRem($username, $useravatar_old);
        $redis -> sAdd($username, $useravatar);
      } else {
        $redis -> sAdd($username, $useravatar);
      }
    }
  }
main();
?>
