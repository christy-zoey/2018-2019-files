var helper = {
  // 表单验证 --姓名
  testInfo_username: function(username){
    var nameTest = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    if(username==""){
      this.message('姓名不能为空');
      return false;
    }else if(!nameTest.test(username)){
      this.message('请输入正确的姓名格式');
      return false;
    }
    return true;
  },
  //地址验证
  testInfo_address: function (address) {
      if (address == "") {
          this.message('地址不能为空');
          return false;
      }
      return true;
  },
  // 表单验证 --电话
  testInfo_phone: function(phone){
    var phoneTest = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(phone==""){
      this.message('手机号不能为空');
      return false;
    }else if(!phoneTest.test(phone)){
      this.message('请输入正确的手机号');
      return false;
    }
    return true;
  },
  testInfo_wx(wxId) {
    var wx1 = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;//微信号带字母的 6-20
    var wx2 = /^1[34578]\d{9}$/;  //qq号或者手机号 11
    var wx3 =/^\d{5,10}$/;
    var emailverify = /^([a-z0-9A-Z]+[-|.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?.)+[a-zA-Z]{2,}$/;//验证邮箱号
    if (wxId === "") {
      this.message('微信号不能为空');
      return false;
    } else if (!wx1.test(wxId) && !wx2.test(wxId)&&!wx3.test(wxId)&& !emailverify.test(wxId)) {
      this.message('请输入正确的微信号');
      return false;
    }
    return true;
  },
  // 表单验证 --选项
  testInfo_radio: function(calssName){
    var calssNameStr = calssName + '';
    var len = $(calssNameStr).length;
    var answer = [];
    for(var i = 0;i<len;i++){
        answer[i] = $(calssNameStr).eq(i).find('input:radio:checked').val();
        if(answer[i]==undefined){
          this.message('请完成题目再提交');
          return false;
        }
    }
    return true;
  },
  // 获取选中内容 --选项
  getRadio: function(calssName){
    var answer = [];
    var len = $(calssNameStr).length;
    for(var i = 0;i<len;i++){
      answer[i] = $(calssNameStr).eq(i).find('input:radio:checked').val();
    }
    return answer.join("、");
  },
  // 验证码
  codeRest: function(phone,success){
    if(testInfo_phone(phone)){
      var data2=[{"retkey":"smsret","func":"smsget","args":"mobile="+phone}];
      var data3=encodeURIComponent(JSON.stringify(data2));
      $.ajax({
        url:'https://isite.baidu.com/multireqs?reqdata='+data3,
        type:'get',
        data:'',
        dataType:'jsonp',
        crossDomain: true,
        jsonp:'callback',
        jsonpCallback:'callback_method',
        success:function (res) {
          if (res.status == 0) {
            if(success) success();
          }else {
            helper.message(res.statusinfo);
          }
        }
      });
    }
  },
  //获取线索总数
  getFormNum: function(siteid,success){
    var that = this;
    $.ajax({
      url:'https://isite.baidu.com/feedflow/form/getsubmitsum?callback=callback&siteid='+siteid,
      dataType:'jsonp',
      type:'get',
      jsonp:'callback',
      jsonpCallback:'callback_method',
      success:function (res) {
        if (res.status == 0) {
          if(success) success(res);
        }
        else {
          that.message('出错了！');
          console.log('获取表单总数出错了！')
        }
      }
    });
  },
  // 表单接口
  rest: function(parms,success,error){
    var that = this;
    $.ajax({
      url:'https://isite.baidu.com/feedflow/form/submit',
      data:parms,
      dataType:'jsonp',
      jsonp:'callback',
      jsonpCallback:'callback_method',
      success:function (res) {
        if (res.status == 0) {
          if(success) success(res);
        }
        else {
          that.message(res.statusInfo);
          if(error) error(res);
        }
      }
    });
  },
  // 提示语
  message: function() {
    //默认设置
    var options = {
      msg: "提示信息",
      postion: "top",
      time: 3000
    };
    //参数处理
    if (arguments.length > 0) {
      options.msg = arguments[0];
      if (/(top|bottom)/i.test(arguments[1])) {
          options.postion = arguments[1];
      }
      if (parseInt(arguments[2])) {
          options.time = arguments[2];
      }
    }
    if ($('.messageBox').length > 0) {
      $('.messageBox').remove();
    }
    $('<div/>').addClass('messageBox').appendTo($('body'));

    var $toast = $('.messageBox');
    $toast.html(options.msg);
    $toast.show(400);

    setTimeout(function() {
      $toast.remove();
    }, options.time);
  }
}
