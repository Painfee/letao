$(function(){

  var currentPage = 1;
  var pageSize = 5;

  function render(){
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(info){
        console.log( info );
        $("tbody").html(template("user-tpl", info));


        // 要使用分页插件就要先想到要用2个参数 pageSize和currentPage
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function(a,b,c,page){
            currentPage = page;
            render();
          }
        })

      }
    })
  }

  render();


  // 给禁用启用按钮注册事件
  $("tbody").on("click", ".btn", function(){
    // 显示模态框
    $("#userModal").modal("show");

    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

    // 在点击事件里面注册点击事件，需要加上off()，即先移出事件，防止多次注册
    $(".btn_confirm").off().on("click", function(){
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete,
        },
        success: function(info){
          if(info.success){
            $("#userModal").modal("hide")
            render()
          }
        }
      })
    })




  })



})