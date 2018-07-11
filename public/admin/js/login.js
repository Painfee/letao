$(function () {
  // 1 使用表单校验插件
  $("form").bootstrapValidator({
    // 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 3,
            max: 6,
            message: '用户名长度必须在3到6之间'
          },
          //callback校验没有规则
          callback: {
            message: "用户名不存在"
          }
        }
      },

      // 校验密码
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户密码长度必须是6-12'
          },
          //callback校验没有规则
          callback: {
            message: "密码错误"
          }
        }
      }
    },

    // 配置字体图标的规则
    feedbackIcons: {
      // 校验成功
      valid: 'glyphicon glyphicon-thumbs-up',
      // 校验失败
      invalid: 'glyphicon glyphicon-thumbs-down',
      // 校验中
      validating: 'glyphicon glyphicon-refresh'
    }
  });




  // 2 给表单注册一个校验成功的事件
  $("form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('form').serialize(),
      success: function (info) {

        // 用户名错误
        if (info.error === 1000) {
          //参数1：修改哪个字段
          //参数2：修改状态  NOT-VALIDATED VALIDATING INVALID VALID
          $("form").data("bootstrapValidator").updateStatus('username', 'INVALID', 'callback')
        }

        // 密码错误
        if (info.error === 1001) {
          $("form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
          // $("form").data("bootstrapValidator").updateStatus('password', 'INVALID', 'callback')
        }

        // 登录成功
        if (info.success) {
          location.href = "index.html"
        }
      }
    })
  });


  // 3 点击重置按钮，需要把内容和样式都清空
  $("[type='reset']").on("click", function () {
    $("form").data("bootstrapValidator").resetForm(true);
  });


})