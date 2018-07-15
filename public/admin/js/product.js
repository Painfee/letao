$(function () {

  var page = 1;
  var pageSize = 2;
  var imgs = [] //用于存放上传图片返回来的结果
  render();

  // 点击添加商品，模态框显示，并且渲染二级分类
  $(".btn_add").on("click", function () {
    $("#productModal").modal("show");

    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100,
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html(template("product-tpl2", info))

      }
    })
  })

  // 二级分类选择功能
  $(".dropdown-menu").on("click", "a", function () {
    var id = $(this).data("id");
    var str = $(this).text();
    $(".dropdown-text").text(str);
    $("[name='brandId']").val(id);

    // 手动让brandId校验成功
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID")

  });


  // 图片上传成功
  $("#fileupload").fileupload({
    done: function (e, data) {
      if (imgs.length == 3) {
        return;
      }

      imgs.push(data.result)
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100">');

      if (imgs.length === 3) {
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID")
      } else {
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "INVALID")
      }
    }
  })


  // 表单校验功能
  $("form").bootstrapValidator({
    //配置小图标的规则
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    },
    excluded: [],
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品的名称'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品的描述'
          }
        }
      },
      num: {
        validators: {
          // 数量 大于0，  99999  1-5  [1-9]4位  1  111
          notEmpty: {
            message: '请输入商品的库存'
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入正确的库存(1-99999)'
          }
        }
      },
      size: {
        validators: {
          // 数量 大于0，  99999  1-5  [1-9]4位  1  111
          notEmpty: {
            message: '请输入商品的尺码'
          },
          //正则校验  xx-xx
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入正确的尺码(xx-xx)'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品的原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品的价格'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传三种图片'
          }
        }
      }
    }
  });


  // 添加商品，给表单注册校验成功的事件
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();

    var param = $("form").serialize();
    param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: param,
      success: function (info) {
        if (info.success) {
          $("#productModal").modal("hide");
          page = 1;
          render();
          //重置表单的样式和内容
          $("form").data("bootstrapValidator").resetForm(true);

          //手动
          $(".dropdown-text").text("请选择二级分类");
          $(".img_box img").remove();

          //清空imgs
          imgs = [];
        }
      }

    })


  })


  // 页面渲染
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (info) {
        // console.log( info );
        $("tbody").html(template("product-tpl", info))
        // render()
        // 分页渲染
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large

          // itemTexts控制每个按钮显示的文字，通过返回值来控制
          // 每个按钮都会执行一次itemText函数，返回值就是这个按钮的内容
          itemTexts: function (type, page, current) {
            switch (type) {
              case "first":
                return "第一页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "最后一页";
              case "page":
                return page + "页"
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "第一页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "最后一页";
              case "page":
                return page + "页";
            }
          },
          useBootstrapTooltip: true,
          bootstrapTooltipOptions: {
            placement: "bottom"
          },

          onPageClicked: function (event, originalEvent, type, p) {
            //为按钮绑定点击事件 p:当前点击的按钮值
            page = p;
            render();
          }
        });
      }


    })
  }

})