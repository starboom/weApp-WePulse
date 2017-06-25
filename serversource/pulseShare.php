<?php
/*
  该文件主要是录取用户手机号的作用
  小程序会将用户填写的表单发送过来。。。
  表单内容主要是 phonenum
               sharefrom //分享人
               newuser //被分享人
      // 更新家属关系             
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
  function main() {
      var_dump($_GET);
  /*
      array(3) {
        ["phonenum"]=>
        string(3) "123"
        ["sharefrom"]=>
        string(27) "刘德华"
        ["newuser"]=>
        string(9) "方振华"
        ["avatarUrl"]=>
        string(123) "http://wx.qlogo.cn/mmopen/vi_32/E72WFDrUxd9N5B3KqlT3DA11EhFN19P8Z5PDDFwwso16ktze3x5sLcDwYYnJic84rficRk9EQaORSoyicx5wuszQw/0"
      }
  */   
      $phonenum = $_GET["phonenum"];
      $sharefrom = $_GET["sharefrom"];
      $newuser = $_GET["newuser"];
      $avarUrl - $_GET["avatarUrl"];

      $redis = redisInit('127.0.0.1', 6379);
      if (!$redis) {
        return "false";
      }

      // 更新家属关系
      #1. 查询是否有这个用户
      #2  有这个用户，说明是又有别人分享给这个用户的。。。。然后这个用户做的只是把家人关系更新，把这个分享人加入家人中
            #看看手机有没有，没有查，有不查
            #更新分享人，把这个用户加入到relative中
      #3  没有这个用户， 那么就创建这个用户。。。。
            #录入信息，头像，手机号码,把这个分享人录入relative
            #更新分享人，把这个用户加入到relative中
            
      

      $ret = $redis -> sGetMembers($newuser);
      if (!$ret) {
        echo "no this person";
        $redis -> sAdd($newuser, "avatarUrl:" . $avarUrl);
        $redis -> sAdd($newuser, "phonenum:" . $phonenum);
        $redis -> sAdd($newuser, "relative:" . $sharefrom);
        $redis -> sAdd($newuser, "pulserecent:" . 0);//脉搏数据初始化为0
        $ret = $redis -> sGetMembers($sharefrom);
        $relative = prase_set($ret, "relative");
        if ($relative) {
          $redis -> sRem($sharefrom, $relative);
          $redis -> sAdd($sharefrom, $relative . "," . $newuser);
        } else {
          $redis -> sAdd($sharefrom, "relative:" . $newuser);
        }
      } else {
        echo "old sport!";
        $oldsport = $ret;
        var_dump($oldsport);
        $phone = prase_set($oldsport, "phonenum");
        if (!$phone) {
          echo "no phone";
          $redis -> sAdd($newuser, "phonenum:" . $phonenum);
        } else {
          #todo
          echo "phone num: " . $phone;
        }

        $relative = prase_set($oldsport, "relative");
        if ($relative) {
          /*
            fix bug 如果分享者重复分享，被分享人的家人关系中已存在分享者，不重复添加
              不存在才添加。
          */
          $dup_relative = strpos($relative, $sharefrom);
          if (!is_int($dup_relative)) {
            $redis -> sRem($newuser, $relative);
            $redis -> sAdd($newuser, $relative . "," . $sharefrom);
          }

        } else {
          $redis -> sAdd($newuser, "relative:" . $sharefrom);
        }

        $sharerelative = prase_set($sharefrom, "relative");
        if ($sharerelative) {
          $dup_relative = strpos($sharerelative, $newuser);
          if (!is_int($dup_relative)) {
            $redis -> sRem($sharefrom, $sharerelative);
            $redis -> sAdd($sharefrom, $sharerelative . "," . $newuser);
          }
        } else {
          $redis -> sAdd($sharefrom, "relative:" . $newuser);
        }
      }
  }
  main();
?>