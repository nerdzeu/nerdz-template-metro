$(document).ready(function() {
    var loading = $("#loadtxt").data('loading'); //il div è nell'header

    $("#stdfrm").on('submit',function(event) {
        event.preventDefault();
        var s = $(this).find("input[type=submit]").eq(0);
        w = s.width();
        s.width(s.parent().width()*.9).val(loading+'...').attr("disable",true).next().hide();
       var news = $("#sendnews");
       if(news.length)
       {
           news = news.is(':checked') ? '1' : '0';
       }
       else
       {
           news = '0';
       }

       N.json.project.newPost({message: $("#frmtxt").val().tag().autoLink(), to: $(this).data('to'), news: news },function(data) {
          if(data.status == 'ok') {
              $("#showpostlist").click();
              $("#frmtxt").val('');
          }
          
          s.val(data.message).attr("disabled",false);

          setTimeout(function() {
            s.val(s.data("send")).width(w).next().show();
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
