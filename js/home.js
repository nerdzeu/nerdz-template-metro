$(document).ready(function() {
    var plist = $("#postlist");
    var loading = $("#loadtxt").data('loading'); 
    var lang = null; 
    var load = false; 
    plist.html('<h1>'+loading+'...</h1>');

    var fixHeights = function() {
        plist.find(".nerdz_message").each (function() {
            var el = $(this).find('div:first');
            if ((el.height() >= 200 || el.find ('.gistLoad').length > 0) && !el.attr('data-parsed'))
            {
                el.addClass("compressed");
                var n = el.next();
                n.prepend ('<p class="more">&gt;&gt;' + n.data ('expand') + '&lt;&lt;</p>');
            }
            el.attr('data-parsed','1');
        });
    };

    var hideHidden = function() {
        var hidden = localStorage.getItem('hid');
        html="";
        if(hidden != null)
        {
          var pids = hidden.split("|");
          for(var i in pids)
          {
            var el = plist.find("#"+pids[i]);
            if(el.length) {
              el.hide();
              lnk = eval("lnk"+pids[i].replace("post","")).replace("/","");
              html += "<li><a style='float:left' target='_blank' href='"+lnk+"'>"+decodeURIComponent(lnk)+"</a>"+
                      "<a style='float:right;cursor:pointer' class='show' data-id='#"+pids[i]+"' data-i='"+i+"'>x</a></li>";
            }
          }
          if(html=="") return;
          $("#hptable").html(html)
        }
        fixHeights();
    };
    
    $("#profilePostList").on("click",function(){
      N.html.profile.getHomePostList(0,function(data) {
        plist.html('<h1>'+loading+'...</h1>');
        $("#fast_nerdz").show();
        if($("#profilePostArrow").hasClass("icon-arrow-up-2")) $("#profilePostArrow").click();
        $(".selectlang").css('color','');
        localStorage.removeItem("autolang");
        load = false;
        plist.html(data);
        plist.data('type','profile');
        plist.data('mode','std');
        hideHidden();
        load = true;
      });
    })
    
    $("#projectPostList").on('click',function() {
        plist.html('<h1>'+loading+'...</h1>');
        $("#fast_nerdz").hide();
        if($("#projectPostArrow").hasClass("icon-arrow-up-2")) $("#projectPostArrow").click();
        $(".projlang").css('color','');
        load = false;
        N.html.project.getHomePostList(0,function(data) {
            plist.html(data);
            plist.data('type','project');
            plist.data('mode','std');
            hideHidden();
            load = true;
        });
    });
    
    $("#profilePostArrow").click(function() {
      $("#nerdzlist").toggle(400,function(){$("#profilePostArrow").toggleClass("icon-arrow-down-2").toggleClass("icon-arrow-up-2")});
    })
    
    $("#projectPostArrow").click(function() {
      $("#projlist").toggle(400,function(){$("#projectPostArrow").toggleClass("icon-arrow-down-2").toggleClass("icon-arrow-up-2")});
    })
    
    plist.on('click', ".yt_frame", function(e) {
      e.preventDefault();
      var vid = $(this).data("vid");
      $.Dialog({
        overlay: false,
        shadow: true,
        sysButtons: {btnClose:true,btnMax:true,btnMin:true},
        icon: '<i class="icon-youtube">',
        title: 'Youtube Video',
        content: '',
        overlayClickClose: false,
        onShow: function(_dialog){
          $(_dialog).appendTo($("body"));
          $(".window-overlay").remove();
          var html = [
              '<iframe style="width:100%; min-width:640px; min-height:480px;" src="//www.youtube.com/embed/',vid,'" frameborder="0"></iframe>'
          ].join("");
          $.Dialog.content(html);
          w = _dialog;
          c = w.children(".content").eq(0);
          w.data("old",[w.css("top"),w.css("left")].join("|"));
          $(".btn-close").click(function(e){e.preventDefault();w.remove()});
          $(".btn-min").click(function(e) {
            e.preventDefault();
            if(!w.hasClass("minimized"))
            {
              c.hide();
              w.css({minHeight:"30px",height:"40px",width:"100px",top:"",bottom:"30px",left:"0px"}).addClass("minimized");
              if(w.hasClass("maximized")) w.removeClass("maximized").addClass("maximize")
            } else {
              c.show();
              ss = w.data("old").split("|");
              w.hasClass("maximize") ? 
                w.css({width:$(window).width(),height:$(window).height()-30,top:0,left:0,bottom:""}).removeClass("minimized") : 
                w.css({width:624,height:517,top:ss[0],left:ss[1],bottom:""}).removeClass("minimized");
            }
          })
          $(".btn-max").click(function(e) {
            e.preventDefault();
            c.show();
            if(!w.hasClass("maximized"))
            {
              w.css({height:$(window).height()-30,width:"100%",top:"0px",left:"0px"}).addClass("maximized").removeClass("minimized").removeClass("maximize");
              c.children().css("height",$(window).height()-70);
            } else {
              ss = w.data("old").split("|");
              w.css({width:624,height:517,top:ss[0],left:ss[1]}).removeClass("maximized");
              c.children().css("height",480);
            }
          });
        }
      });
    });
    
    $("#hptable").on("click",".show",function(){
      var pids = localStorage.getItem('hid').split("|").sort();
      pids.splice( $(this).data("i"), 1 );
      hid = "";
      for(key in pids)
        hid += pids[key]+"|";
      hid = hid.substr(0,hid.length-1);
      $($(this).data("id")).show(0,function(){ 
        $.each($(this).find(".img_frame>img"),function(){$(this).css("margin-top", (117-$(this).height())/2)})
      });
      localStorage.setItem("hid",hid);
      if(hid=="") 
        localStorage.removeItem("hid");
      $(this).parent().remove();
    })
                
    plist.on('click',".spoiler",function(){
      if($(this).data("parsed")) return;
      $.each($(this).find("img"),function(){
        m = (117-$(this).height())/2;
        if (m>1)
          $(this).css("margin-top", m)
      })
      $(this).data("parsed","1");
    });
    
    plist.on('click','.more',function() {
        var me = $(this), par = me.parent(), jenk = par.prev();
        jenk.removeClass("compressed")
        me.slideUp ('slow', function() {
            me.remove();
        });
    });

    plist.on('click',".icon-cancel-2",function() {
        var pid = $(this).data('postid');
        $("#"+pid).hide();
        var hidden = localStorage.getItem('hid');
        if(hidden == null) {
            localStorage.setItem('hid',pid);
        }
        else
        {
            hidden += "|"+pid;
            localStorage.setItem('hid',hidden);
        }
        //auto lock
        var lock = $("#post"+pid).find('img.imgunlocked');
        if(lock.length)
        {
            lock.eq(0).click();
        }
        hideHidden();
    });

    $(".selectlang").on('click',function() {
        plist.html('<h1>'+loading+'...</h1>');
        lang = $(this).data('lang');
        localStorage.setItem("autolang",lang);
        $(".selectlang").css('color','');
        $(this).css('color',$color);
        load = false;
        if(lang == 'usersifollow')
        {
            $("#fast_nerdz").show();
            N.html.profile.getFollowedHomePostList(0,function(data) {
                plist.html(data);
                plist.data('type','profile');
                plist.data('mode','followed');
                hideHidden();
                load = true;
            });
        }
        else
        {
            if(lang == '*') {
                $("#fast_nerdz").show();
            }
            else {
                $("#fast_nerdz").hide();
            }

            load = false;
            N.html.profile.getByLangHomePostList(0,lang,function(data) {
                plist.html(data);
                plist.data('mode','language');
                plist.data('type','profile');
                hideHidden();
                load = true;
            });
        }
        hideHidden();
    });

    $(".projlang").on('click',function() {
        $("#fast_nerdz").hide();
        plist.html('<h1>'+loading+'...</h1>');
        lang = $(this).data('lang');
        $(".projlang").css('color','');
        $(this).css('color',$color);
        load = false;
        if(lang == 'usersifollow')
        {
                N.html.project.getFollowedHomePostList(0,function(data) {
                plist.html(data);
                plist.data('type','project');
                plist.data('mode','followed');
                hideHidden();
                load = true;
            });
        }
        else
        {
            N.html.project.getByLangHomePostList(0,lang,function(data) {
                plist.html(data);
                plist.data('type','project');
                plist.data('mode','language');
                hideHidden();
                load = true;
            });
        }
        hideHidden();
    });
    
    $("#stdfrm").on('submit',function(e) {
        e.preventDefault();
        $("#pmessage").html(loading+'...');
        N.json.profile.newPost({message: $("#frmtxt").val(), to: 0 },function(data) {
            if(data.status == 'ok') {
                $("#frmtxt").val('');
                load = false;
                if(lang == '*') {
                    N.html.profile.getByLangHomePostList(0,lang,function(data) {
                        plist.html(data);
                        plist.data('type','profile');
                        plist.data('mode','language');
                        hideHidden();
                        load = true;
                    });
                }
                else if(lang == 'usersifollow') {
                    N.html.profile.getFollowedHomePostList(0,function(data) {
                        plist.html(data);
                        plist.data('type','profile');
                        plist.data('mode','followed');
                        hideHidden();
                        load = true;
                    });
                }
                else {
                    $("#profilePostList").click();
                }
            }
            
            $("#pmessage").html(data.message);

            setTimeout(function() {
                        $("#pmessage").html('');
                        },5000);
        });
    });

    if(localStorage.getItem("autolang"))
    {
      $("#nerdzlist").find("[data-lang='"+localStorage.getItem("autolang")+"']").click().css('color',$color);
      $("#profilePostArrow").click()
    }
    else
    {
        plist.data('location','home');
        load = false;
        N.html.profile.getHomePostList(0,function(data) {
            plist.html(data);
            hideHidden();
            plist.data('type','profile');
            plist.data('mode','std');
            load = true;
        });
    }

    var sl = 'searchLoad';
    sessionStorage.setItem(sl,"0");
    var tmpDivId = "scrtxt";
    var manageScrollResponse = function(data) {
        $("#"+tmpDivId).remove();
        if(data.length > 0) {
            plist.append(data);
            hideHidden();
            load = true;
            sessionStorage.setItem(sl, "0");
        }
    };

    var manageScrollSearchResponse = function(data) {
        $("#"+tmpDivId).remove();
        if(data.length > 0) {
            plist.append(data);
            hideHidden();
            sessionStorage.setItem(sl, "1");
            load = false; 
        }
    };

    $(window).scroll(function() {
        if($(this).scrollTop()+200 >= ( $(document).height() - $(this).height() ))
        {
            var num = 10;
            var hpid = plist.find("div[id^='post']").last().data('hpid');
            var mode = plist.data('mode');
            var type = plist.data('type');
            var append = '<h3 id="'+tmpDivId+'">'+loading+'...</h3>';

            if((load || ("1" == sessionStorage.getItem(sl))) && !$("#"+tmpDivId).length)
            {
                plist.append(append);
            }

            if(load)
            {
                load = false;
                if(mode == 'std') {
                    N.html[type].getHomePostListBeforeHpid(num,hpid,manageScrollResponse);
                }
                else if(mode == 'followed') {
                    N.html[type].getFollowedHomePostListBeforeHpid(num,hpid,manageScrollResponse);
                }
                else if(mode == 'language') {
                    N.html[type].getByLangHomePostListBeforeHpid(num,lang,hpid, manageScrollResponse);
                }
            }
            if(sessionStorage.getItem(sl) == "1")
            {
                sessionStorage.setItem(sl, "0");
                if(type == 'project' && mode == 'search')
                {
                    N.html.search.globalProjectPostsBeforeHpid(num,$("#footersearch input[name=q]").val(), hpid, manageScrollSearchResponse);
                }
                else if(type == 'profile' && mode == 'search')
                {
                    N.html.search.globalProfilePostsBeforeHpid(num, $("#footersearch input[name=q]").val(), hpid, manageScrollSearchResponse);
                }
            }
        }
    });
});
