$(document).ready(function() {
    var loading = N.getLangData().LOADING;

    $("#stdfrm").on('submit',function(event) {
      event.preventDefault();
      var s = $(this).find("input[type=submit]").eq(0);
      if(s.attr("disabled")=="disabled") return;
      w = s.width();
      s.width(s.parent().width()*.9).val(loading+'...').attr("disabled","disabled").next().hide();
      if( $("#img_ul_file").val() != "" && $("#img_ul_file").is(":visible") )
        if( !confirm(N.getLangData().IMG_UPLOADING) )
          return s.val(N.getLangData().NERDZ_IT).attr("disabled",false).width(w).next().show();
      var message = $("#frmtxt").val().tag();
      if(undefined==localStorage.getItem("no-autolink")) message = message.autoLink();
      N.json.profile.newPost({message: message, to: $(this).data('to') },function(data) {
          if(data.status == 'ok') {
              $("#showpostlist").click();
              $("#frmtxt").val('');
          }
          
          s.val(data.message);

          setTimeout(function() {
            s.val(N.getLangData().NERDZ_IT).attr("disabled",false).width(w).next().show();
          },1000);
      });
    });

    var oldPlist = "";
    $("#follow").click(function() {
        var me = $(this);
        me.html('...');
        N.json.profile.follow({id: $(this).data('id')},function(d) {
            me.html(d.message);
            me.off('click');
        });
    });

    $("#unfollow").click(function() {
        var me = $(this);
        me.html('...');
        N.json.profile.unfollow({id: $(this).data('id')},function(d) {
            me.html(d.message);
            me.off('click');
        });
    });

    $("#blacklist").click(function() {
        var me = $(this);
        var plist = $("#postlist");
        oldPlist = plist.html();
        plist.html('<form id="blfrm">'+N.getLangData().MOTIVATION+': <textarea style="width:100%; height:60px" id="blmot"></textarea><br /><input type="submit" value="Blacklist" /></form>');
        plist.on('submit','#blfrm',function(event) {
            event.preventDefault();
            me.html('...');
            N.json.profile.blacklist({
                    id: me.data('id'),
                    motivation: $("#blmot").val()
                },function(d) {
                    me.html(d.message);
                    plist.html(oldPlist);
                    me.off('click');
            });
        });
    });

    $("#unblacklist").click(function() {
        var me = $(this);
        me.html('...');
        N.json.profile.unblacklist({id: $(this).data('id')},function(d) {
            me.html(d.message);
            me.off('click');
        });
    });

    $("#profilepm").on('click',function() {
        var me = $(this), txt = N.getLangData().PM;
        if(oldPlist == "") {
            me.html('...');
            N.html.pm.getForm(function(data) {
                oldPlist = $("#fast_nerdz").html();
                $("#fast_nerdz").lenght ? $("#fast_nerdz").html(data) : $("#center_col").prepend($("<div>").attr("id","fast_pm").html(data));
                $("#to").val($("#username").html());
                $("#postlist").hide();
                TPLoad();
            });
        }
        else
        {
            me.html(txt);
            $("#fast_nerdz").lenght ? $("#fast_nerdz").html(oldPlist) : $("#fast_pm").remove();
            $("#postlist").show();
            oldPlist = "";
        }
    });

    $("#center_col").on('submit',"#convfrm",function(e) { //per i pm
        e.preventDefault();
        N.json.pm.send({
            tok: $(this).data('tok'),
            to: $("#to").val(),
            message: $("#frmtxt").val().tag().autoLink(),
            },function(d) {
                if(d.status == 'ok') {
                    setTimeout(function() {
                        $("#fast_nerdz").html(oldPlist);
                        $("#postlist").show();
                    },500);
                }
        });
    });
});
