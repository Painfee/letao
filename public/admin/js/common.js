

//  NProgress 插件用法，引入CSS JS，写下面2段js代码即可
/*
  ajax 有6个事件
  ajaxStart()
  ajaxSend()
  ajaxSuccess()
  ajaxError()
  ajaxComplete()
  ajaxStop()
*/
// 给document注册事件，document一发生ajax请求就会触发该事件
$(document).ajaxStart(function () {
  // ajax请求之前
  NProgress.start();
});

$(document).ajaxStop(function () {
  setTimeout(function () {
    //ajax请求之后
    NProgress.done();
  }, 500);
})




// 切换aside栏分类,注意这里一开始子分类是隐藏的，所以给它兄弟注册事件
$(".second").prev().on('click', function(){
  $(this).next().slideToggle();
})

// 切换aside栏隐藏与显示
$(".icon_menu").on("click", function(){
  $('body').toggleClass('active');
  $('.lt_aside').toggleClass('active');
})


// 登出功能模态框
$(".icon_logout").on('click', function(){
  $('#logoutModal').modal('show');
})

$(".btn_logout").on('click', function(){
  $.ajax({
    type: 'get',
    url: '/employee/employeeLogout',
    success: function(info){
      if(info.success){
        location.href = "login.html"
      }
    }
  })
})