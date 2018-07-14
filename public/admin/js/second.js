$(function () {

  var page = 1;
  var pageSize = 5;
  //1. 列表渲染功能+分页功能
  render();


  //2. 点击添加分类按钮
  $(".btn_add").on("click", function () {
    //2.1 显示模态框
    $("#addModal").modal('show');


    //2.2 发送ajax请求，获取到一级分类的数据
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        // console.log(info);
        $(".dropdown-menu").html(template("second-tpl2", info));
      }
    })
  });

  //3. 给dropdown-menu下的a注册点击事件（委托）
  $(".dropdown-menu").on("click", "a", function () {
    //3.1 获取到当前a的文本的内容
    $(".dropdown-text").text($(this).text());

    //3.2 获取到id
    var id = $(this).data("id");
    $("[name='categoryId']").val(id);
    // console.log( $("form").data("bootstrapValidator") );
    //3.3 修改categoryId的校验状态，通过(这里要配置表单校验，要不会报错)
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });


  //4. 图片上传功能
  //4.1 引包
  //4.2 给input:file 指定name属性data-url属性
  //4.3 调用fileupload方法
  $("#fileupload").fileupload({
    done: function (e, data) {
      // console.log(data.result);
      // 显示图片
      $(".img_box img").attr("src", data.result.picAddr)
      // 把图片的地址设置给隐藏的表单，才能发送给后台，通过value设置
      $("[name='brandLogo']").val(data.result.picAddr);
      // 让brandLogo校验通过
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID")  
    }
  });

  // 表单校验
  $("form").bootstrapValidator({
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "二级分类的名字不能为空"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传一张品牌的图片"
          }
        }
      },

    },


    // 配置不做校验的类型
    excluded: [],

    // 配置小图标的类型
    feedbackIcons: {
      // 校验成功、校验失败、校验中
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    }
  })


  // 调用表单校验成功事件，ajax异步渲染数据
  $("form").on("success.form.bv", function(e){
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("form").serialize(),
      success: function(info){
        if(info.success){
          $("#addModal").modal("hide");
          page = 1;
          render();

          // 重置表单的样式
          $("form").data("bootstrapValidator").resetForm(true);
          // 有些需要手动重置
          $(".dropdown-text").text("请选择一级分类")
          $(".img_box img").attr("src", "images/none.png")
        }
      }
    })
  })




  function render() {
    //发送ajax请求
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        $("tbody").html(template("second-tpl", info));

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });

      }
    });
  }

});