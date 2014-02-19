$(document).ready(function() {
    var loading = N.getLangData().LOADING;
    
    $("body").append($('<br />')); 
    $("iframe").attr("scrolling","no");
    _h = $("head");
    if(!localStorage.getItem("metro-color")) 
      localStorage.setItem("metro-color","default");
    $color = "#4390DF";
    $colors = {"default":"#4390DF","lime":"#a4c400","amber":"#F0A30A", "red":"#e51400", "steel":"#555555"};
    var mc = localStorage.getItem("metro-color");
    if (mc!="default")
    {
      $color = $colors[mc];
      var rgb = $("<span>").css("background-color",$color).css("background-color").replace(/[^0-9,]/g,"").split(",");
      var hsl = rgb2hsl(rgb[0],rgb[1],rgb[2]);
      $lighter = ["hsl("+hsl[0], hsl[1]*100+"%", Math.floor(hsl[2]*130)+"%)"].join(",");
      var html = ('.news .nerdz_date, .news .post_icons, a, .spoiler > span, .question, #profilePostArrow, #projectPostArrow {'+
                  '  color: %color%;'+
                  '}'+
                  '.active {'+
                  '  color: %color% !important; '+
                  '}'+
                  '.news, .img_frame, .yt_frame, .window, .caption  {'+
                  '  border-color: %color% !important;'+
                  '}'+
                  '.img_frame:after, .yt_frame:after {'+
                  '  border-top: 28px solid %color%;'+
                  '}'+
                  '.window > .caption {'+
                  '  background-color: %color%;'+
                  '}'+
                  '.sidebar li a:hover {'+
                  '  background-color: %lighter% !important;'+
                  '}'+
                  '.more'+
                  '{'+
                  '  box-shadow: 0px -10px 10px 0px %color%;'+
                  '}'+
                  '.link:hover, a:hover {'+
                  ' color: %lighter%;'+
                  '}').replace(/\%color\%/g,$color).replace(/\%lighter\%/g, $lighter);
      $('<style type="text/css">').html(html).appendTo(_h);
      $("body").addClass( mc );
    }
    for(col in $colors)
      $("<div>").attr("class","tile tiny").html('<div class="tile-content icon"><i class="icon-record" style="color:'+$colors[col]+';"></i></div>')
                .attr("title",col).addClass( mc==col?"selected":"" ).appendTo($("#color-switcher"));

    ts = $("#theme-switcher");               
    if (localStorage.getItem("metro-theme"))
    {
      if(localStorage.getItem("metro-theme")=="light")
      {
        $(".sidebar").addClass("light")
        $(".navigation-bar").removeClass("dark").addClass("light")
      }
      ts.children("#"+localStorage.getItem("metro-theme")).addClass("selected");
      $("body").addClass(localStorage.getItem("metro-theme"))
    }
    else 
      ts.children("#dark").addClass("selected");

    $("#pref-metro").on("click", function(event) {
      event.stopPropagation();
    });
    
    $("#code-theme-switcher").on("change", function(e) {
      if( !$("#code-theme-switcher").is(':checked') ) 
        localStorage.removeItem("code-light-theme") 
      else 
        localStorage.setItem("code-light-theme", "1");
  
      setTimeout(function(){location.reload();},1000);
    });
    var append_theme = "";
    if (undefined == localStorage.getItem("code-light-theme"))
    {
      append_theme = "?skin=sons-of-obsidian";
      $("body").addClass("has-dark-theme");
    }
    else $("#code-theme-switcher").attr("checked",true);
    $("<script>").attr("type","text/javascript").attr("src",'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/run_prettify.js'+append_theme).appendTo(_h)
    
    ts.on("click", ".tile", function(){
      if($(this).hasClass("selected")) return false;
      localStorage.setItem("metro-theme",$(this).attr("id"));
      setTimeout(function(){location.reload();},1000);
    })
    
    $("#color-switcher").on("click",".tile", function() {
      if($(this).hasClass("selected")) return false;
      localStorage.setItem("metro-color",$(this).attr("title"));
      setTimeout(function(){location.reload();},1000);
    });
    
    tp = $("#metro-tagpanel");
    if(localStorage.getItem("no-tagpanel")) 
      tp.attr("checked",false);
    tp.on("change", function(e) {
      if( tp.is(':checked') ) 
        localStorage.removeItem("no-tagpanel") 
      else {
        localStorage.setItem("no-tagpanel", "1");
      }
      TPUpdate();
    });
    tc = $("#tagpanel-custom");
    tc.on("click",function(event) {
      if(!$(".tagpanel").length) return false;
      event.stopPropagation();
      $.Dialog({
        shadow: true,
        overlay: false,
        icon: '<span class="icon-tools"></span>',
        title: 'Metro Tagpanel Options',
        width: 500,
        draggable: true,
        padding: 10,
        onShow: function(_dialog) {
          _dialog.css("width","450px");
            var tp = $(".tagpanel"),
          ch = tp.children("a");
          var html = '<label class="input-control switch">TagPanel: &nbsp;&nbsp;<input type="checkbox" id="w-metro-tagpanel" checked /><span class="check"></span></label><br /><br /><div id="checkbox">'
          ch = $(".tagpanel").children("a");
          $l = localStorage.getItem("tagpanel-custom");
          var label = function(name, index, checked) {
            return '<label style="width: 200px" data-i="'+index+'" class="input-control switch">'+name+': &nbsp;&nbsp;<input type="checkbox" '+(checked?"checked":"")+' /><span class="check"></span></label>&nbsp;&nbsp;';
          }
          
          html += label("Image Upload", 18, $l.charAt(18)=="0"?false:true )+"<br />";
          for (i=0;i<ch.length;++i)
            html += label( ch.eq(i).html(), i, $l.charAt(i)=="0"?false:true );
            
          html += '</div>';

          _dialog.children(".content").html(html);
                    
          _dialog.on("change","#w-metro-tagpanel", function() {
            $("#metro-tagpanel").click();
            cb = $("#checkbox").find("input[type=checkbox]");
            dis=!$(this).is(":checked"); 
            $.each(cb, function() {$(this).attr("disabled",dis)});
          }).on("change","#checkbox label", function() {
            i = $(this).data("i");
            $l = localStorage.getItem("tagpanel-custom");
            b = (+$(this).children("input").eq(0).is(":checked"));
            $n = $l.replaceAt(i, b)
            localStorage.setItem("tagpanel-custom",$n);
            TPUpdate();
          })
        }
      });
    });
    
    ns = $("#metro-notify");
    if(localStorage.getItem("metro-no-notify")) 
      ns.attr("checked",false);
    ns.on("change", function(e) {
      ( ns.is(':checked') ) ? localStorage.removeItem("metro-no-notify") : localStorage.setItem("metro-no-notify", "1");
    });
    $("#metro-info").on('click', function(event){
      event.stopPropagation();
      $.Dialog({
        shadow: true,
        overlay: false,
        icon: '<span class="icon-rocket"></span>',
        title: 'Nerdz Metro Template',
        width: 500,
        padding: 10,
        onShow: function(_dialog) {
          _dialog.css("min-height","150px");
          $.ajax({url:"/tpl/2/VERSION"}).done(function(d){
            _dialog.children(".content").html("<a href='https://github.com/nerdzeu/nerdz.eu/commit/{1}' target='_blank'> Nerdz, Last Commit {1} </a> <br />NerdzMetro Theme by Dr.Jest. Version {0} <br /> Barely based on work made by<a href='https://github.com/olton/Metro-UI-CSS/blob/master/LICENSE' target='_blank'> Sergey Pimenov </a>".format(d, Nversion));
          })
        }
      });
    });

    $("#notifycounter").on('click',function(e) {
      e.preventDefault();
      var list = $("#notify_list"), old = $(this).html();
      var nold = parseInt(old);
      list.toggle(200); 
      list.html(loading);
      N.html.getNotifications(function(d) {
        $("#pr_lo").remove();
        list.html(d);
      });
      $(this).html(isNaN(nold) ? old : '0');
    });

    if($.inArray(location.pathname,[ '/bbcode.php','/terms.php','/faq.php','/stats.php','/rank.php','/preferences.php', '/informations.php', '/preview.php' ]) != -1) {
           $("#footersearch").remove();
       };
      
    $("textarea").autogrow();
    $("body").on("keydown", "textarea", function(e) {
      if( e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13) ) {
        $(this).parent().trigger('submit');
      }
    });
    
    $("#footersearch").on('submit',function(e) {
        e.preventDefault();
        var plist = $("#postlist");
        var qs =  $.trim($("#footersearch input[name=q]").val());
        var num = 10; 
        if(qs == '') {
            return false;
        }
        var manageResponse = function(d)
        {
            plist.html(d);
            sessionStorage.setItem('searchLoad', "1"); 
        };
        if(plist.data('type') == 'project')
        {
            if(plist.data('location') == 'home')
            {
                N.html.search.globalProjectPosts(num, qs, manageResponse);
            }
            else
            {
                if(plist.data('location') == 'project')
                {
                    N.html.search.specificProjectPosts(num, qs, plist.data('projectid'),manageResponse);
                }
            }
        }
        else
        {
            if(plist.data('location') == 'home')
            {
                N.html.search.globalProfilePosts(num, qs, manageResponse);
            }
            else
            {
                if(plist.data('location') == 'profile')
                {
                    N.html.search.specificProfilePosts(num, qs, plist.data('profileid'),manageResponse);
                }
            }
        }
        plist.data('mode','search');
    });

    $("#logout").on('click',function(event) {
        event.preventDefault();
        var t = $("#welcome");
        N.json.logout( { tok: $(this).data('tok') }, function(r) {
            var tmp = t.html();
            if(r.status == 'ok')
            {
                t.html(r.message);
                setTimeout(function() {
                    document.location.href = "/";
                    },1500);
            }
            else
            {
                t.html('<h2>'+ r.message + '</h2>');
                setTimeout(function() {
                    t.html(tmp);
                },1500);
            }
        });
    });

    $("#gotopm").on('click',function(e) {
            e.preventDefault();

            var href = $(this).attr('href');

            if($('#pmcounter').html() != '0') {

                if(href == window.location.pathname ) {
                    location.hash = "new";
                    location.reload();
                }
                else {
                    location.href='/pm.php#new';
                }
            }
            else
            {
                location.href = href;
            }
    });

    $(".preview").on('click',function(){
        var txt = $($(this).data('refto')).val().tag().autoLink();
        if(undefined != txt && txt != '') {
            window.open('/preview.php?message='+encodeURIComponent(txt));
        }
    });

    var plist = $("#postlist");

    plist.on('click', ".spoiler", function(e) {
        $(this).toggleClass("expanded");
    });

    plist.on('click','.preview',function(){
        var txtarea = $($(this).data('refto'));
        txtarea.val(txtarea.val()+' '); //workaround
        var txt = txtarea.val().tag().autoLink();
        txtarea.val($.trim(txtarea.val()));
        if(undefined != txt && $.trim(txt) != '') {
            window.open('/preview.php?message='+encodeURIComponent(txt));
        }
    });

    plist.on('click',".delcomment",function() {
      
      var c = function() {
        var refto = $('#' + $(this).data('refto'));
        sc = refto.parents("div[id^=\"post\"]").eq(0).find(".icon-comments-4");

        refto.html(loading+'...');
          N.json[plist.data('type')].delComment({ hcid: $(this).data('hcid') },function(d) {
            if(d.status == 'ok')
            {
              var clist = refto.parent();
              refto.remove();
              if( !clist.children().length ) {
                sc.click();
                setTimeout(function(){sc.click},600);
              }
              sc.html(parseInt(sc.html())-1);
            }
            else
            {
              refto.html(d.message);
            }
        });
      }
      $.Confirm(N.getLangData().ARE_YOU_SURE, c);
    });

    plist.on('submit','.frmcomment',function(e) {
        e.preventDefault();
        var last, hcid, t,
            form     = $(this),
            hpid     = $(this).data ('hpid'),
            refto    = $('#commentlist' + hpid),
            error    = $(this).find ('.error').eq (0),
            clist    = refto.children(".comments").eq(0),
            comments = clist.children();
        if(comments.length)
        {
          last = comments.length > 1 ? comments.eq (comments.length - 2) : null;
          hcid = last ? last.data('hcid') : 0;
        }
        error.html (loading);
        var message = $(this).find('textarea').eq(0).val().tag().autoLink();
        N.json[plist.data('type')].addComment ({ hpid: hpid, message: message }, function(d) {
            if(d.status == 'ok')
            {
              if(hcid && last)
              {
                  N.html[plist.data('type')].getCommentsAfterHcid ({ hpid: hpid, hcid: hcid }, function(d) {
                    t = $("<div>").html(d);
                    var cmnum = t.children(".commentcount").eq(0).remove().html(),
                        newComments = t.children(".comments").eq(0).children(),
                        lastComment = comments.last();
                    lastComment.remove()
                    if(cmnum<internalLengthPointer) {
                      $("#post"+hpid).find(".icon-comments-4").eq(0).click();
                      return;
                    }
                    var internalLengthPointer = comments.length-1;
                    var n = internalLengthPointer + newComments.length,
                        mc = form.parent().find ('.more_btn').data('morecount'),
                        toshow = (mc?mc:0 + 1) * 10;
                    if(n>toshow) 
                    {
                      comments.slice(0,n-toshow).remove();
                      refto.children(".comment_btns").eq(0).show();
                    }
                    if(cmnum>20) refto.find(".all_comments_btn").eq(0).show();
                    clist.append(newComments);
                    form.find('textarea').val ('').height(0);
                    error.html('');
                    $("#post"+hpid).find(".icon-comments-4").eq(0).text(cmnum);
                  });
              }
              else
              {
                  N.html[plist.data('type')].getComments( { hpid: hpid, start: 0, num: 10 },function(d) {
                      refto.html(d);
                      var cmnum = $("<div>").html(d).children(".commentcount").eq(0).remove().html();
                      $("#post"+hpid).find(".icon-comments-4").eq(0).text(cmnum);
                      error.html('');
                  });
              }
            }
            else
            {
                error.html(d.message);
            }
        });
    });
    
    plist.on('click', ".yt_frame", function(e) {
      if($.browser.mobile) return window.open("https://m.youtube.com/watch?v="+$(this).data("vid"));
      e.preventDefault();
      var vid = $(this).data("vid");
      d = $.Dialog({
        overlay: false,
        shadow: true,
        sysButtons: {btnClose:true,btnMax:true,btnMin:true},
        icon: '<i class="icon-youtube"></i>',
        title: 'Youtube Video',
        draggable: true,
        height:520,
        width: 656,
        content: '',
        overlayClickClose: false,
        onClose: function() { $(document).unbind("keyup.yt"); },
        onShow: function(_dialog){
          $.Dialog.content('<iframe style="min-width:640px; min-height:480px; width: 100%; height:auto" src="//www.youtube.com/embed/'+vid+'" seamless></iframe>');
          $(document).on("keyup.yt",function(e){
             var code = e.keyCode ? e.keyCode : e.which;
             if(code==27) $.Dialog.close(d);
          });
        },
        sysBtnMinClick: function(e) {
          e.preventDefault();
          if(!w.hasClass("minimized"))
          {
            w.addClass("minimized");
            if(w.hasClass("maximized")) w.removeClass("maximized").addClass("maximize")
          } else {
            w.hasClass("maximize") && w.addClass("maximized");
            w.removeClass("maximize").removeClass("minimized");
          }
        },
        sysBtnMaxClick: function(e) {
          e.preventDefault();
          w.removeClass("minimized").removeClass("maximize");
          w.toggleClass("maximized");
          c.children().css("height",w.height()-30);
        }
      });
    });
    
    plist.on('click',".showcomments",function(e) {
        e.preventDefault();
        var hpid = $(this).data ('hpid'),
            refto = $('#' + $(this).data('refto')),
            count = $(this).children().eq(0);
        if(refto.html() == '')
        {
            refto.html(loading+'...').show();
            N.html[plist.data ('type')].getComments ({
                hpid: hpid,
                start: 0,
                num: 10
            }, function (res) {
                refto.hide().html(res).slideDown("slow", function() {
                  ta = refto.find('.frmcomment textarea[name=message]').autogrow();
                  if (document.location.hash == '#last')
                    ta.focus();
                  else if (document.location.hash)
                    $(document).scrollTop ($(document.location.hash).offset().top);  
                });
                count.html( refto.children(".commentcount").html() );
            });
        }
        else
        {
            refto.slideUp("slow", function(){refto.html('')});
        }
    });

    plist.on ('click', '.more_btn', function() {
        var moreBtn     = $(this),
            commentList = moreBtn.parents ("div[id^=\"commentlist\"]"),
            clist       = commentList.children(".comments").eq(0),
            hpid        = /^post(\d+)$/.exec (commentList.parents ("div[id^=\"post\"]").attr ("id"))[1],
            intCounter  = moreBtn.data ("morecount") || 0;
        if (moreBtn.data ("inprogress") === "1") return;
        moreBtn.data ("inprogress", "1").text (loading + "...");
        N.html[plist.data ('type')].getComments ({ hpid: hpid, start: intCounter + 1, num: 10 }, function (r) {
            moreBtn.data ("inprogress", "0").data ("morecount", ++intCounter).html(N.getLangData().MORE_COMMENTS);
            var _ref = $("<div>" + r + "</div>");
            clist.html(_ref.children(".comments").eq(0).html()+clist.html());
            if (intCounter == 1)
              commentList.find (".scroll_bottom_btn").show();
            if ($.trim (r) == "" || _ref.find (".nerdz_from").length < 10 || (10 * (intCounter + 1)) == _ref.find (".commentcount:eq(0)").html())
            {
              commentList.find (".all_comments_btn").hide();
              moreBtn.hide();
            }
        });
    });

    plist.on ('click', '.scroll_bottom_btn', function() {
        var cList = $(this).parents().eq(2);
        $("html").animate ({ scrollTop: cList.find (".singlecomment:nth-last-child(2)").offset().top }, function() {
            cList.find (".frmcomment textarea").focus();
        });
    });

    plist.on ('click', '.all_comments_btn', function() {
        var btn         = $(this),
            commentList = btn.parents ("div[id^=\"commentlist\"]"),
            hpid        = /^post(\d+)$/.exec (commentList.parents ("div[id^=\"post\"]").attr ("id"))[1],
            moreBtn     = commentList.find (".more_btn");
        if (btn.data ("working") === "1" || moreBtn.data ("inprogress") === "1") return;
        btn.data ("working", "1").text (loading + "...");
        moreBtn.data ("inprogress", "1");
        N.html[plist.data ('type')].getComments ({ hpid: hpid, forceNoForm: true }, function (res) {
            btn.data ("working", "0").text(N.getLangData().EVERY_COMMENT).hide();
            commentList.find (".scroll_bottom_btn").show();
            moreBtn.data ("morecount", Math.ceil (parseInt ($("<div>").html(res).find (".commentcount").html()) / 10)).hide();
            commentList.children(".comments").eq(0).html(res);
        });
    });

    plist.on('click',".qu_ico",function() {
      var area = $("#"+$(this).data('refto'));
      area.insertAtCaret("[quote="+ $(this).data('hcid') +"|"+$(this).data('type')+"]");
      area.focus();
    });

    plist.on('click',".icon-remove:not(.delcomment)",function(e) {
      e.preventDefault();
      var refto = $('#' + $(this).data('refto'));
      var post = refto.html();
      var hpid = $(this).data('hpid');

      N.json[plist.data('type')].delPostConfirm({ hpid: hpid },function(m) {
        if(m.status == 'ok') {
          $.Confirm(m.message, function() {
            N.json[plist.data('type')].delPost({ hpid: hpid },function(j) {
             if(j.status == 'ok') {
              refto.slideUp(function(){$(this).remove()});
              if(plist.data("singlepost")) location.href="/";
             }
             else {
              refto.html(j.message);
             }
            });
          });
       }
    });
  });

    plist.on('click',".icon-pencil",function(e) {
        e.preventDefault();
        var refto = $('#' + $(this).data('refto')), hpid = $(this).data('hpid');
        var form = function(fid, hpid, message) {
                    return  '<form style="margin-bottom:40px" id="' +fid+ '" data-hpid="'+hpid+'">' +
                            '<textarea class="row thin" id="'+fid+'abc" autofocus style="width:100%; height:125px">' +message+ '</textarea>' +
                            '<div class="row thin"><span class="span3 place-right">' +
                            '<input type="submit" class="place-right" value="' + N.getLangData().EDIT +'" style="width:45%" />' +
                            '<button type="button" class="preview" data-refto="#'+fid+'abc">'+N.getLangData().PREVIEW+'</button></span>'+                            '<input type="button" class="smallest span1 notag no-margin" onclick="window.open(\'/bbcode.php\')" value="BBCode" style="display: none;">' +
                            '<button type="button no-margin" class="cancel">'+N.getLangData().CANCEL+'</button>' +
                            '</div></form>';
                    };
            N.json[plist.data('type')].getPost({hpid: hpid},function(d) {
                 var fid = refto.attr('id') + 'editform';
                 refto.html(form(fid,hpid,d.message));

                 $('#'+fid).on('submit',function(e) {
                      e.preventDefault();
                      N.json[plist.data('type')].editPost(
                            {
                                 hpid: $(this).data('hpid'),
                                 message: $(this).children('textarea').val()
                            },function(d)
                            {
                                 if(d.status == 'ok')
                                 {
                                      refto.slideToggle("slow");
                                      N.html[plist.data('type')].getPost({hpid: hpid}, function(o) {
                                            refto.html(o);
                                            refto.slideToggle("slow");
                                            if(refto.data("hide")) {
                                              $(refto.find("div.small")[0]).prepend('<i title="'+refto.data("hide")+'" class="post_icons hide icon-cancel-2" data-postid="post'+hpid+'"></i>');
                                            }
                                      });
                                 }
                                 else {
                                      alert(d.message);
                                 }
                      });
                }).on("click",".cancel", function() {
                  refto.slideToggle("slow");
                  N.html[plist.data('type')].getPost({hpid: hpid}, function(o) {
                        refto.html(o);
                        refto.slideToggle("slow");
                        if(refto.data("hide")) {
                          $(refto.find("div.small")[0]).prepend('<i title="'+refto.data("hide")+'" class="post_icons hide icon-cancel-2" data-postid="post'+hpid+'"></i>');
                        }
                  });
                });
            });
    });

    plist.on('click',".icon-locked",function() {
        var me = $(this);
        var tog = function(d) {
            if(d.status == 'ok') {
                me.attr('class','post_icons icon-unlocked');
                me.attr('title',d.message);
            }
        }
          
          if($(this).data('silent')) {
              N.json[plist.data('type')].reNotifyFromUserInPost({ hpid: $(this).data('hpid'), from: $(this).data('silent') },function(d) {tog(d);});
          }
          else {
                 N.json[plist.data('type')].reNotifyForThisPost({hpid: $(this).data('hpid') },function(d) {tog(d);});
          }
    });

    plist.on('click',".icon-unlocked",function() {
        var me = $(this);
        var tog = function(d) {
            if(d.status == 'ok') {
                me.attr('class','post_icons icon-locked');
                me.attr('title',d.message);
            }
        }

        if($(this).data('silent')) {
            N.json[plist.data('type')].noNotifyFromUserInPost({ hpid: $(this).data('hpid'), from: $(this).data('silent') },function(d) {tog(d);});
        }
        else {
            N.json[plist.data('type')].noNotifyForThisPost({hpid: $(this).data('hpid') },function(d) {tog(d);});
        }
    });
    
    plist.on("click",".icon-eye-2", function() { //unlurk
      var me = $(this);
      var tog = function(d) {
          if(d.status == 'ok') {
              me.attr("class","post_icons icon-eye");
              me.attr('title',"Lurk");
          }
      }
      
      N.json[plist.data('type')].unlurkPost({hpid: $(this).data('hpid') },function(d) {tog(d);});
    })
    
    plist.on('click',".icon-eye",function() { //lurk
      var me = $(this);
      var tog = function(d) {
          if(d.status == 'ok') {
              me.attr("class","post_icons icon-eye-2");
              me.attr('title',"Unlurk");
          }
      }
      N.json[plist.data('type')].lurkPost({hpid: $(this).data('hpid') },function(d) {tog(d);});
    });

    plist.on('click',".icon-plus",function() {
        var me = $(this);
        var tog = function(d) {
            if(d.status == 'ok') {
                me.attr('class','post_icons icon-minus');
                me.attr('title',"Unbookmark");
            }
        }
          
          N.json[plist.data('type')].bookmarkPost({hpid: $(this).data('hpid') },function(d) {tog(d);});

    });

    plist.on('click',".icon-minus",function() {
        var me = $(this);
        var tog = function(d) {
            if(d.status == 'ok') {
                me.attr('class','post_icons icon-plus');
                me.attr('title',"Bookmark");
            }
        }
        N.json[plist.data('type')].unbookmarkPost({hpid: $(this).data('hpid') },function(d) {tog(d);});
    });

    $("body").on('click','.notref',function(e) {
        if (e.ctrlKey) return;
        e.preventDefault();
        var href = $(this).attr('href');
        if(href == window.location.pathname + window.location.hash) {
            location.reload();
        }
        else {
            location.href = href;
        }
    });
    
    TPLoad();

    var curnot = sessionStorage.getItem("curnot") ? parseInt(sessionStorage.getItem("curnot")) : 0;
    var curpm = sessionStorage.getItem("curpm") ? parseInt(sessionStorage.getItem("curpm")) : 0;
    setInterval(function() {
        var nc = $("#notifycounter"), val = parseInt(nc.html());
        nc.css('color',val == 0 || isNaN(val) ? $color : '#FF0000');
        if(!isNaN(val) && val != curnot && !localStorage.getItem("metro-no-notify"))
        {
          nw = val - curnot;
          if(nw>0)
          {
            N.html.getNotifications(function(d) {
              nn = $("<div>").html(d).children().length;
              nn==1?
                $.Notify.show(d, function(){N.html.getNotifications($.noop(),false)}) :
                $.Notify.show('<a href="#" onclick="">'+N.getLangData().NEW_NOTIFICATIONS.format(nn)+'</a>', function(){$('#notifycounter').click();});
              $("#notifyaudio")[0].play();
            },true);
          }
          curnot = val;
          sessionStorage.setItem("curnot",curnot);
        }
        var pc = $("#pmcounter");
        val = parseInt(pc.html());
        if(!isNaN(val) && val != curpm && !localStorage.getItem("metro-no-notify")) 
        {
          nw = val-curpm;
          if(nw>0)
          {
            $.Notify.show('<a style="cursor:pointer">'+(nw==1?N.getLangData().NEW_MESSAGE : N.getLangData().NEW_MESSAGES.format(nw) )+'!</a>', function() {$("#gotopm").click()});
            $("#notifyaudio")[0].play();
          }
          curpm = val;
          sessionStorage.setItem("curpm",val);
        }
        pc.css('color',val == 0 || isNaN(val) ? $color : '#FF0000');
    },200);
});

$(window).on('beforeunload', function() {
  if(location.href.match(/(preferences)|(project)\.php/)) return;
  t = $("textarea");
  for (ta in t)
  {
    val = $("textarea")[ta].value || "";
    if ( $.trim(val) != "")
    {
      $("textarea").eq(ta).focus();
      return N.getLangData().POST_NOT_SENT+": \n"+val+"\n";
    }
  }
  if($("#img_ul_file").length && $("#img_ul_file").val() != "" )
    return N.getLangData().IMG_UPLOADING_2;
});

if($.browser.mobile) {
  var h = $("head");
  $("<link>").attr("rel","stylesheet").attr("href","/tpl/2/css/mobile.css").appendTo(h);
  $("<script>").attr("type","text/javascript").attr("src","/tpl/2/js/mobile.js").appendTo(h);
}
