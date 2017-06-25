<?php 

//echo $_POST['pulse'] . "   " . $_POST['time'] . "\n";

// file_put_contents("./pulse", $_POST['pulse']);
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
  function main(){
    $redis = redisInit('127.0.0.1', 6379);
    
    $pulse = $_POST["pulse"];
    $temperature = $_POST["temperature"];
    
    if ($pulse) {
    	$redis -> set("pulse", $pulse);
    }

    if ($temperature) {
	$redis -> set("temperature", $temperature);
    }

  }
  main();
?>
