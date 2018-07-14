$(function () {

  var currentPage = 1;
  var pageSize = 5;

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        // 分页插件中有一个回调函数可以返回currentPage
        page: currentPage,
        pageSize: pageSize,
      },
      success: function (info) {
        console.log(info);
        $("tbody").html(template("first-tpl", info))

        // 分页渲染
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }

  render();

  $(".btn_add").on("click", function () {
    $("#addModal").modal("show")
  })

  // 模态框表单校验
  $("form").bootstrapValidator({
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: '用户名不为空'
          },
        }
      }
    }
  })

  // 校验成功后，调用表单 success.form.bv
  $("form").on('success.form.bv', function (e) {
    // 阻止表单默认submit方式提交，改为ajax处理
    e.preventDefault();

    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('form').serialize(),
      success: function (info) {
        if (info.success) {
          $("#addModal").modal("hide");
          // 细节优化
          currentPage = 1;
          render()

          // 把模态框中的数据重置
          $("form").data("bootstrapValidator").resetForm(true);
          
        }
      }
    })


  })


})