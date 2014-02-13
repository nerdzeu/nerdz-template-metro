$(document).ready(function() {
    var loading = N.getLangData().LOADING;

    $("#stdfrm").on('submit',function(event) {
      event.preventDefault();
      var s = $(this).find("input[type=submit]").eq(0);  
      if(s.attr("disabled")=="disabled") return false;
      w = s.width();
      s.width(s.parent().width()*.9).val(loading+'...').attr("disabled","disabled").next().hide();
      if( $("#img_ul_file").val() != "" && $("#img_ul_file").is(":visible") )
        if( !confirm(N.getLangData().IMG_UPLOADING) )
          return s.val(N.getLangData().NERDZ_IT).attr("disabled",false).width(w).next().show();
    var news = $("#sendnews");
    if(news.length)
    {
        news = news.is(':checked') ? '1' : '0';
    }
    else
    {
        news = '0';
    }
    var message = $("#frmtxt").val().tag();
    if(undefined==localStorage.getItem("no-autolink")) message = message.autoLink();
    N.json.project.newPost({message: message, to: $(this).data('to'), news: news },function(data) {
      if(data.status == 'ok') {
        $("#showpostlist").click();
        $("#frmtxt").val('').height(0);
      }

      s.val(data.message);

      setTimeout(function() {
        s.val(N.getLangData().NERDZ_IT).attr("disabled",false).width(w).next().show();
      },1000);
    });
  });

    $("#follow").click(function() {
        var me = $(this);
        me.html('...');
        N.json.project.follow({id: $(this).data('id')},function(d) {
            me.html(d.message);
            me.off('click');
        });
    });

    $("#unfollow").click(function() {
        var me = $(this);
        me.html('...');
        N.json.project.unfollow({id: $(this).data('id')},function(d) {
            me.html(d.message);
            me.off('click');
        });
    });
});
