<?php
/*
  录入当前用户定位信息，将其录入redis           
*/
  /*
    初始化redis
    参数 ip 一般为localhost
        port 一般为 6379
    返回值
        成功 返回redis对象
        失败 返回 false
  */
  /*
    重复添加。。。不跳转
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
       // return $k;
       return $k;
      }
    }
    return false;
  }
/*
array(3) {
  ["latitude"]=>
  string(9) "28.228209"
  ["longitude"]=>
  string(10) "112.938814"
  ["nickName"]=>
  string(9) "方振华"
}
*/
  function main() {
    $redis = redisInit('127.0.0.1', 6379);
    if (!$redis) {
      return "false";
    }
	  // var_dump($_GET); 
    $latitude = $_GET["latitude"];
    $longitude = $_GET["longitude"];
    $username = $_GET["nickName"];
    if ($_GET["getLocation"] == "true") {
      // var_dump($_GET);
      //echo "hellp";
      $ret = $redis -> sGetMembers($username);
      if ($ret) {
        $longitude = prase_set($ret, "longitude");
        $latitude = prase_set($ret, "latitude");
        $avatarUrl = prase_set($ret, "avatarUrl");
        // echo $longitude . "," . $latitude;
        $retAr["longitude"] = $longitude;
        $retAr["latitude"] = $latitude;
        $retAr["avatarUrl"] = $avatarUrl;
        echo json_encode($retAr, JSON_UNESCAPED_UNICODE);
        
      }
    }


    $ret = $redis -> sGetMembers($username);
    if ($ret) {
      // echo "old sport";
      // var_dump($ret);
      $longitude_old = prase_set($ret, "longitude");
      $latitude_old = prase_set($ret, "latitude");

      $redis -> sRem($username, $longitude_old);
      $redis -> sRem($username, $latitude_old);

      $redis -> sAdd($username, "longitude:" . $longitude);
      $redis -> sAdd($username, "latitude:" . $latitude);
    }

  }

main();

?>
