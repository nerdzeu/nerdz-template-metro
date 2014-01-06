$(document).ready(function() {
    var loading = $("#loadtxt").data('loading');
    $("body").append($('<br />')); 
    $("iframe").attr("scrolling","no");
    _h = $("head");
    if(!localStorage.getItem("metro-color")) 
      localStorage.setItem("metro-color","default");
    $color = "#4390DF";
    $colors = {"default":"#4390DF","lime":"#a4c400","amber":"#F0A30A"};
    var mc = localStorage.getItem("metro-color");
    if (mc!="default")
    {
      $color = $colors[mc];
      var rgb = $("<span>").css("background-color",$color).css("background-color").replace(/[^0-9,]/g,"").split(",");
      var hsl = rgb2hsl(rgb[0],rgb[1],rgb[2]);
      $lighter = ["hsl("+hsl[0], hsl[1]*100+"%", Math.floor(hsl[2]*150)+"%)"].join(",");
      var html = ('.news .nerdz_date, .news .post_icons, a, #profilePostArrow, #projectPostArrow, .spoiler > span, .question {'+
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
                  '.nerdz_message > div.compressed'+
                  '{'+
                  '  box-shadow: inset 0 -30px 30px -30px %color%;'+
                  '}'+
                  '.link:hover, a:hover {'+
                  ' color: '+$lighter+';'+
                  '}').replace(/\%color\%/g,$color);
      $('<style type="text/css">').html(html).appendTo(_h);
      $("body").addClass( mc );
    }
    for(col in $colors)
      $("<div>").attr("class","tile tiny").html('<div class="tile-content icon"><i class="icon-record" style="color:'+$colors[col]+';"></i></div>')
                .attr("title",col).addClass( mc==col?"selected":"" ).appendTo($("#color-switcher"));
                
    if (localStorage.getItem("metro-light"))
    {
      $(".sidebar").addClass("light")
      $(".navigation-bar").removeClass("dark").addClass("light")
      $("body").addClass("light")
    }
    $("#pref-metro").on("click", function(event) {
      event.stopPropagation();
    });
    ts = $("#theme-switcher");
    if(localStorage.getItem("metro-light")) 
      ts.attr("checked",true);
    ts.parent().on("click", function(){
      if( ts.is(":disabled") ) return false;
      if( ts.is(':checked') ) {
        localStorage.removeItem("metro-light") 
        ts.attr("checked",false);
      } else {
        localStorage.setItem("metro-light", "1");
        ts.attr("checked",true);
      }
      ts.attr("disabled",true);
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
            _dialog.children(".content").html('NerdzMetro Theme by Dr.Jest. Version '+d+'<br>Based on work made by Sergey Pimenov <br />'+
            '<a target="_blank" href="https://github.com/olton/Metro-UI-CSS/blob/master/LICENSE">@https://github.com/olton/Metro-UI-CSS/blob/master/LICENSE</a>');
          })
        }
      });
    });
    var append_theme = "";
    if (localStorage.getItem ("has-dark-theme") == 'yep')
    {
      append_theme = "?skin=sons-of-obsidian";
      $("body").addClass("has-dark-theme");
    }
    var prettify = document.createElement ("script");
    prettify.type = "text/javascript";
    prettify.src  = 'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/run_prettify.js' + append_theme;
    _h.append (prettify);

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
        var txt = $($(this).data('refto')).val();
        if(undefined != txt && txt != '') {
            window.open('/preview.php?message='+encodeURIComponent(txt));
        }
    });
    
    $("textarea").on('keydown', function(e) {
        if( e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13) ) {
            $(this).parent().trigger('submit');
        }
    });

    var plist = $("#postlist");

    plist.on('click', ".spoiler", function(e) {
        $(this).toggleClass("expanded");
    });

    plist.on('click','.preview',function(){
        var txtarea = $($(this).data('refto'));
        txtarea.val(txtarea.val()+' '); //workaround
        var txt = txtarea.val();
        txtarea.val($.trim(txtarea.val()));
        if(undefined != txt && $.trim(txt) != '') {
            window.open('/preview.php?message='+encodeURIComponent(txt));
        }
    });

    plist.on('keydown',"textarea", function(e) {
        if( e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13) ) {
            $(this).parent().trigger('submit');
        }
    });

    plist.on('click',".delcomment",function() {
        var refto = $('#' + $(this).data('refto'));
        sc = refto.parents("div[id^=\"post\"]").eq(0).find(".icon-comments-4");
        sc.html(parseInt(sc.html())-1);
        refto.html(loading+'...');
          N.json[plist.data('type')].delComment({ hcid: $(this).data('hcid') },function(d) {
            if(d.status == 'ok')
            {
                refto.remove();
            }
            else
            {
                refto.html(d.message);
            }
        });
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
        var message = $("#frmtxt").val().tag();
        if(undefined==localStorage.getItem("no-autolink")) message = message.autoLink();
        N.json[plist.data('type')].addComment ({ hpid: hpid, message: message }, function(d) {
            if(d.status == 'ok')
            {
                if(hcid && last)
                {
                    N.html[plist.data('type')].getCommentsAfterHcid ({ hpid: hpid, hcid: hcid }, function(d) {
                        t = $("<div>").html(d);
                        var cmnum = t.children().eq(0).remove().html(),
                            newComments = t.children().eq(0).children();
                            internalLengthPointer = comments.length,
                            lastComment = comments.last();
                        t.remove();
                        if (comments.length > 1) {
                            comments.eq(comments.length - 1).remove();
                            internalLengthPointer--;
                        }
                        if (lastComment.data ('hcid') == newComments.last().data ('hcid')) {
                            lastComment.remove();
                            internalLengthPointer--;
                        }
                        var n = internalLengthPointer + newComments.length,
                            mc = form.parent().find ('.more_btn').data('morecount'),
                            toshow = (mc?mc:0 + 1) * 10;
                        if(n>0) comments.slice(0,n-toshow).remove();
                        if(n>9) refto.find(".more_btn").show();
                        clist.append(newComments);
                        form.find('textarea').val ('');
                        error.html('');
                        $("#post"+hpid).find(".icon-comments-4").eq(0).text(cmnum);
                    });
                }
                else
                {
                    N.html[plist.data('type')].getComments( { hpid: hpid, start: 0, num: 10 },function(d) {
                        refto.html(d);
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
      e.preventDefault();
      var vid = $(this).data("vid");
      $.Dialog({
        overlay: false,
        shadow: true,
        sysButtons: {btnClose:true,btnMax:true,btnMin:true},
        icon: '<i class="icon-youtube"></i>',
        title: 'Youtube Video',
        draggable: true,
        content: '',
        overlayClickClose: false,
        onShow: function(_dialog){
          $(_dialog).appendTo($("body"));
          $(".window-overlay").remove();
          $.Dialog.content('<iframe style="width:100%; min-width:640px; min-height:480px;" src="//www.youtube.com/embed/'+vid+'" frameborder="0"></iframe>');
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
    


    plist.on('click',".showcomments",function(e) {
        e.preventDefault();
        var hpid = $(this).data ('hpid'),
            refto = $('#' + $(this).data('refto'));
        if(refto.html() == '')
        {
            refto.html(loading+'...');
            N.html[plist.data ('type')].getComments ({
                hpid: hpid,
                start: 0,
                num: 10
            }, function (res) {
                refto.html (res);
                if (document.location.hash == '#last')
                    refto.find ('.frmcomment textarea[name=message]').focus();
                else if (document.location.hash)
                    $(document).scrollTop ($(document.location.hash).offset().top);
            });
        }
        else
        {
            refto.html('');
        }
    });

    plist.on ('click', '.more_btn', function() {
        var moreBtn     = $(this),
            commentList = moreBtn.parents ("div[id^=\"commentlist\"]"),
            clist    = commentList.children(".comments").eq(0),
            hpid        = /^post(\d+)$/.exec (commentList.parents ("div[id^=\"post\"]").attr ("id"))[1],
            intCounter  = moreBtn.data ("morecount") || 0;
        if (moreBtn.data ("inprogress") === "1") return;
        moreBtn.data ("inprogress", "1").text (loading + "...");
        N.html[plist.data ('type')].getComments ({ hpid: hpid, start: intCounter + 1, num: 10 }, function (r) {
            moreBtn.data ("inprogress", "0").data ("morecount", ++intCounter).text (moreBtn.data ("localization"));
            var _ref = $("<div>" + r + "</div>");
            clist.html(_ref.children().eq(1).html()+clist.html());
            if (intCounter == 1)
              commentList.find (".scroll_bottom_btn").parent().show();
            if ($.trim (r) == "" || _ref.find (".nerdz_from").length < 10 || (10 * (intCounter + 1)) == _ref.find (".commentcount:eq(0)").html())
            {
              commentList.find (".all_comments_btn").hide();
              moreBtn.parent().hide();
            }
        });
    });

    plist.on ('click', '.scroll_bottom_btn', function() {
        var cList = $(this).parents().eq(2);
        $("html, body").animate ({ scrollTop: cList.find (".singlecomment:nth-last-child(2)").offset().top }, function() {
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
            btn.data ("working", "0").text(btn.data ("localization")).parent().hide();
            commentList.find (".scroll_bottom_btn").show();
            moreBtn.hide().data ("morecount", Math.ceil (parseInt ($("<div>").html(res).find (".commentcount").html()) / 10));
            commentList.children(".comments").eq(0).html(res);
        });
    });

    plist.on('click',".qu_ico",function() {
      var area = $("#"+$(this).data('refto'));
      area.insertAtCaret("[quote="+ $(this).data('hcid') +"|"+$(this).data('type')+"]");
      area.focus();
    });

    plist.on('click',".icon-remove",function(e) {
      e.preventDefault();
      var refto = $('#' + $(this).data('refto'));
      var post = refto.html();
      var hpid = $(this).data('hpid');

      N.json[plist.data('type')].delPostConfirm({ hpid: hpid },function(m) {
        if(m.status == 'ok') {
          refto.html('<div style="text-align:center">' + m.message + '<br /><span id="delPostOk' + hpid +'" style="cursor:pointer">YES</span>|<span id="delPostNo'+hpid+'" style="cursor:pointer">NO</span></div>');
          refto.on('click','#delPostOk'+hpid,function() {
            N.json[plist.data('type')].delPost({ hpid: hpid    },function(j) {
             if(j.status == 'ok') {
              refto.hide();
             }
             else {
              refto.html(j.message);
             }
            });
          });
          refto.on('click','#delPostNo'+hpid,function() {
                refto.html(post);
          });
       }
    });
  });

    plist.on('click',".icon-pencil",function(e) {
        e.preventDefault();
        var refto = $('#' + $(this).data('refto')), hpid = $(this).data('hpid');
        var editlang = $(this).attr("title");
        var form = function(fid,hpid,message,edlang,prev) {
                    return  '<form style="margin-bottom:40px" id="' +fid+ '" data-hpid="'+hpid+'">' +
                            '<textarea id="'+fid+'abc" autofocus style="width:100%; height:125px">' +message+ '</textarea><br />' +
                            '<input type="submit" value="' + edlang +'" style="float: right; margin-top:5px" />' +
                            '<button type="button" style="float:right; margin-top: 5px; margin-right: 10px;" class="preview" data-refto="#'+fid+'abc">'+prev+'</button>'+
                            '<button type="button" style="float:left; margin-top:5px" onclick="window.open(\'/bbcode.php\')">BBCode</button>' +
                            '</form>';
                    };
            N.json[plist.data('type')].getPost({hpid: hpid},function(d) {
                 var fid = refto.attr('id') + 'editform';
                 refto.html(form(fid,hpid,d.message,editlang,$(".preview").val()));

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
          
          if($(this).data('silent')) { //nei commenti
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

    plist.on ('click', '.nerdz-code-title', function() {
        localStorage.setItem ('has-dark-theme', ( localStorage.getItem ('has-dark-theme') == 'yep' ? 'nope' : 'yep' ));
        document.location.reload();
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
    
    var curpm = localStorage.getItem("curpm") ? parseInt(localStorage.getItem("curpm")) : 0;
    setInterval(function() {
        var nc = $("#notifycounter"), val = parseInt(nc.html());
        nc.css('color',val == 0 || isNaN(val) ? $color : '#FF0000');
        var pc = $("#pmcounter");
        val = parseInt(pc.html());
        if(!isNaN(val) && val != curpm && !localStorage.getItem("metro-no-notify")) 
        {
          nw = val-curpm;
          if(nw>0)
          {
            $.Notify.show('<a href="/pm.php#new" class="notref">You have '+nw+' new message'+(nw>1?"s":"")+'!</a>');
            $("#notifyaudio")[0].play();
          }
          curpm = val;
          localStorage.setItem("curpm",curpm);
        }
        pc.css('color',val == 0 || isNaN(val) ? $color : '#FF0000');
    },200);

});
