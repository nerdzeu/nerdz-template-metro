$(document).ready(function() {
    var loading = $("#loadtxt").data('loading');
    $("body").append($('<br />')); 
    $("iframe").attr("scrolling","no");
    _h = $("head");
    //metro colors
    if(!localStorage.getItem("metro-color")) localStorage.setItem("default");
    $color = "#4390DF";
    $colors = {"default":"#4390DF","lime":"#a4c400","amber":"#F0A30A"};
    var mc = localStorage.getItem("metro-color");
    if (mc!="default")
    {
      $color = $colors[mc];
      var html = ('.%name% .news .nerdz_date, .%name% .news .post_icons, .%name% a, .%name% #profilePostArrow, .%name% #projectPostArrow, .%name% .spoiler span {'+
                        '  color: %color%;'+
                        '}'+
                        '.%name% .news, .%name% .img_frame, .%name% .yt_frame  {'+
                        '  border: 3px solid %color%;'+
                        '}'+
                        '.%name% .img_frame:after, .%name% .yt_frame:after {'+
                        '  border-top: 28px solid %color%;'+
                        '}'+
                        '.%name% .nerdz_message > div.compressed'+
                        '{'+
                        '  box-shadow: inset 0 -30px 30px -30px %color%;'+
                        '}').replace(/\%name\%/g,mc).replace(/\%color\%/g,$color);
      $('<style type="text/css">').html(html).appendTo(_h);
      $("body").addClass( mc );
    }
    for(col in $colors)
      $("<div>").attr("class","tile tiny").html('<div class="tile-content icon"><i class="icon-record" style="color:'+$colors[col]+';"></i></div>')
                .attr("title",mc).data("color",col).addClass( mc==col?"selected":"" ).appendTo($("#color-switcher"));
    $("#color-switcher").on("click",".tile", function(e) {
      e.preventDefault();
      if($(this).hasClass("selected")) return;
      localStorage.setItem("metro-color",$(this).data("color"));
      location.reload();
    });
    //metro theme
    if (localStorage.getItem("metro-light"))
    {
      $(".sidebar").addClass("light")
      $(".navigation-bar").removeClass("dark").addClass("light")
      $("body").addClass("light")
    }
    ts = $("#theme-switcher");
    if(localStorage.getItem("metro-light")) 
      ts.children().eq(1).attr("selected",true);
    ts.on("change", function(){
      if( ts.val() == "dark" )
        localStorage.removeItem("metro-light");
      else {
        localStorage.setItem("metro-light", "1");
      }
      location.reload();
    })
    //prettyprinter for [code]
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

    //begin plist into events (common to: homepage, projects, profiles)
    var plist = $("#postlist");

    plist.on('click', ".spoiler", function(e) {
        $(this).toggleClass("expanded");
    });

    plist.on('click', ".yt_frame", function(e) {
        e.preventDefault();
        N.yt($(this), $(this).data("vid"));
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
        var last, hcid,
            hpid     = $(this).data ('hpid'),
            refto    = $('#commentlist' + hpid),
            error    = $(this).find ('.error').eq (0),
            pattern  = 'div[id^="c"]',
            comments = refto.find (pattern);
        if(comments.length)
        {
            // Uses the second-last element instead of the last one (if available)
            // to fix the append bug reported by nessuno.
            last = comments.length > 1 ? comments.eq (comments.length - 2) : null;
            hcid = last ? last.data('hcid') : 0;
        }
        error.html (loading);
        N.json[plist.data('type')].addComment ({ hpid: hpid, message: $(this).find('textarea').eq(0).val() }, function(d) {
            if(d.status == 'ok')
            {
                if(hcid && last)
                {
                    N.html[plist.data('type')].getCommentsAfterHcid ({ hpid: hpid, hcid: hcid }, function(d) {
                        var form = refto.find ('form.frmcomment').eq (0),
                            pushBefore = form.parent(),
                            newComments = $('<div>' + d + '</div>').find (pattern),
                            internalLengthPointer = comments.length,
                            lastComment = comments.last();
                        // if available, delete the secondlast comment
                        if (comments.length > 1) {
                            comments.eq (comments.length - 1).remove();
                            internalLengthPointer--;
                        }
                        // then, check the hcid of the last comment
                        // delete it if it matches
                        if (lastComment.data ('hcid') == newComments.last().data ('hcid')) {
                            lastComment.remove();
                            internalLengthPointer--;
                        }
                        // wait until we reach 10 comments (except if the user pressed more)
                        // TODO: replace this with comments.slice (0, n).remove()
                        // TODO: add logic to show again the 'more' button if we deleted
                        // enough comments
                        // Fix for issue #9: add a >point<
                        while ((internalLengthPointer + newComments.length) > (((comments.parent().find ('.more_btn').data ('morecount') || 0) + 1) * 10)) {
                            comments.first().remove();
                            // reassign the variable, otherwise .first() won't work
                            // anymore with .remove().
                            comments = refto.find (pattern);
                            internalLengthPointer--;
                        }
                        // append newComments
                        pushBefore.before (d);
                        form.find ('textarea').val ('');
                        error.html('');
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

    plist.on('click',".showcomments",function(e) {
        e.preventDefault();
        var refto = $('#' + $(this).data('refto'));
        if(refto.html() == '')
        {
            refto.html(loading+'...');
            N.html[plist.data ('type')].getComments ({
                hpid: $(this).data ('hpid'),
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
            hpid        = /^post(\d+)$/.exec (commentList.parents ("div[id^=\"post\"]").attr ("id"))[1],
            intCounter  = moreBtn.data ("morecount") || 0;
        if (moreBtn.data ("inprogress") === "1") return;
        moreBtn.data ("inprogress", "1").text (loading + "...");
        N.html[plist.data ('type')].getComments ({ hpid: hpid, start: intCounter + 1, num: 10 }, function (r) {
            moreBtn.data ("inprogress", "0").data ("morecount", ++intCounter).text (moreBtn.data ("localization"));
            var _ref = $("<div>" + r + "</div>");
            // Lesson learned: don't use .parent() after a .hide()
            moreBtn.parent().after (r);
            if (intCounter == 1)
                moreBtn.parent().find (".scroll_bottom_hidden").show();
            if ($.trim (r) == "" || _ref.find (".nerdz_from").length < 10 || (10 * (intCounter + 1)) == _ref.find (".commentcount:eq(0)").html())
            {
                var btnDb = moreBtn.hide().parent();
                btnDb.find (".scroll_bottom_separator").hide();
                btnDb.find (".all_comments_hidden").hide();
            }
        });
    });

    plist.on ('click', '.scroll_bottom_btn', function() {
        var cList = $(this).parents().eq (2);
        $("html, body").animate ({ scrollTop: cList.find (".singlecomment:nth-last-child(2)").offset().top }, function() {
            cList.find (".frmcomment textarea").focus();
        });
    });

    plist.on ('click', '.all_comments_btn', function() {
        var btn         = $(this),
            btnDb       = btn.parent().parent(),
            moreBtn     = btnDb.find (".more_btn"),
            commentList = btn.parents ("div[id^=\"commentlist\"]"),
            hpid        = /^post(\d+)$/.exec (commentList.parents ("div[id^=\"post\"]").attr ("id"))[1];
        if (btn.data ("working") === "1" || moreBtn.data ("inprogress") === "1") return;
        btn.data ("working", "1").text (loading + "...");
        moreBtn.data ("inprogress", "1");
        N.html[plist.data ('type')].getComments ({ hpid: hpid, forceNoForm: true }, function (res) {
            btn.data ("working", "0").text (btn.data ("localization")).parent().hide();
            btnDb.find (".scroll_bottom_hidden").show().find (".scroll_bottom_separator").hide();
            var parsed = $("<div>" + res + "</div>"), push = $("#commentlist" + hpid);
            moreBtn.hide().data ("morecount", Math.ceil (parseInt (parsed.find (".commentcount").html()) / 10));
            push.find ("div[id^=\"c\"]").remove();
            push.find ('form.frmcomment').eq (0).parent().before (res);
        });
    });

    plist.on('click',".qu_ico",function() {
        var area = $("#"+$(this).data('refto'));
        area.val(area.val()+"[quote="+ $(this).data('hcid') +"|"+$(this).data('type')+"]");
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
                    return     '<form style="margin-bottom:40px" id="' +fid+ '" data-hpid="'+hpid+'">' +
                               '<textarea id="'+fid+'abc" autofocus style="width:99%; height:125px">' +message+ '</textarea><br />' +
                               '<input type="submit" value="' + edlang +'" style="float: right; margin-top:5px" />' +
                                '<button type="button" style="float:right; margin-top: 5px" class="preview" data-refto="#'+fid+'abc">'+prev+'</button>'+
                               '<button type="button" style="float:left; margin-top:5px" onclick="window.open(\'/bbcode.php\')">BBCode</button>' +
                           '</form>';
                    };
            N.json[plist.data('type')].getPost({hpid: hpid},function(d) {
                 var fid = refto.attr('id') + 'editform';
                 refto.html(form(fid,hpid,d.message,editlang,$(".preview").html()));

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
                                            if(refto.data("hide").length) {
                                                $(refto.find("div.small")[0]).prepend('<a class="hide" style="float:right; margin-left:3px" data-postid="post'+hpid+'">'+refto.data("hide")+'</a>');
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

    //end plist into events
    setInterval(function() {
        var nc = $("#notifycounter"), val = parseInt(nc.html());
        nc.css('color',val == 0 || isNaN(val) ? $color : '#FF0000');
        var pc = $("#pmcounter");
        val = parseInt(pc.html());
        pc.css('color',val == 0 || isNaN(val) ? $color : '#FF0000');
    },200);

});
