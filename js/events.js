$(document).ready(function(){
  $('#stdfrm').on('submit', function(e) {
    e.preventDefault();
    $.Nerdz.Post({location: plist.data("location"),type:plist.data("type")});
  });

  $.Nerdz.loadPosts();
  
  /* postlist events */
  var main = $("#main"),
      plist = $('#postlist');
  
  /* home only */
  main.on('click', '#postlist .spoiler', function() {
    if ($(this).data('parsed') || plist.data("location")!=="home")
      return;
    $.each($(this).find('img'), function() {
      m = (117 - $(this).height()) / 2;
      if (m > 1)
        $(this).css('margin-top', m);
      else
        $(this).css('margin-top', 0);
    });
    $(this).data('parsed', '1');
  });
  main.on('click', '#postlist .more', function() {
    var me = $(this),
      par = me.parent(),
      jenk = par.prev();
    jenk.animate({
      height: jenk[0].scrollHeight
    }, parseInt(1.2 * jenk[0].scrollHeight), function() {
      $(this).height('auto');
    });
    me.slideUp('slow', function() {
      me.remove();
    });
  });
  main.on('click', '#postlist .icon-cancel-2', function() {
    $.Nerdz.home.hide(this);
  });

  /* COMMON TO ALL PAGES */
  main.on('keydown', 'textarea', function(e) {
    if (e.ctrlKey && (e.keyCode === 10 || e.keyCode === 13)) {
      $(this).parent().trigger('submit');
    }
  });
  main.on('click', '#postlist .vote', function() {
    var curr = $(this),
      cont = curr.parent(),
      tnum = cont.children('.thumbs-counter');
    var obj, func;
    if (cont.hasClass('comment_thumbs')) {
      obj = {
        hcid: cont.data('refto')
      };
      func = 'cthumbs';
    } else {
      obj = {
        hpid: cont.data('refto')
      };
      func = 'thumbs';
    }
    if (curr.hasClass('voted'))
      N.json[plist.data('type')][func]($.extend(obj, {
        thumb: 0
      }), function(r) {
        curr.removeClass('voted');
        var votes = parseInt(r.message);
        tnum.attr('class', 'thumbs-counter').text(votes>0?"+"+votes:votes);
        if (votes !== 0) tnum.addClass(votes > 0 ? 'pos' : 'neg');
      });
    else
      N.json[plist.data('type')][func]($.extend(obj, {
        thumb: curr.hasClass('icon-thumbs-up') ? 1 : -1
      }), function(r) {
        cont.children('.voted').removeClass('voted');
        curr.addClass('voted');
        var votes = parseInt(r.message);
        tnum.attr('class', 'thumbs-counter').text(votes>0?"+"+votes:votes);
        if (votes !== 0) tnum.addClass(votes > 0 ? 'pos' : 'neg');
      });
  });
  main.on('click', '#postlist .spoiler', function(e) {
    $(this).toggleClass('expanded');
  });
  main.on('click', '#postlist .delcomment', function() {
    var refto = $('#' + $(this).data('refto'));
    var $hcid = $(this).data('hcid');
    $.Confirm(N.getLangData().ARE_YOU_SURE, function() {
      sc = refto.parents('div[id^="post"]').eq(0).find('.icon-comments-4');
      refto.loading();
      N.json[plist.data('type')].delComment({
        hcid: $hcid
      }, function(d) {
        if (d.status === 'ok') {
          var clist = refto.parent();
          refto.remove();
          if (!clist.children().length) {
            sc.click();
            setTimeout(function() {
              sc.click();
            }, 600);
          }
          sc.html(parseInt(sc.html()) - 1);
        } else {
          refto.html(d.message);
        }
      });
    });
  });
  main.on('submit', '#postlist .frmcomment', function(e) {
    e.preventDefault();
    var last, hcid, t, form = $(this),
      hpid = $(this).data('hpid'),
      refto = $('#commentlist' + hpid),
      error = $(this).find('.error').eq(0),
      clist = refto.children('.comments').eq(0),
      comments = clist.children();
    if (comments.length) {
      last = comments.length > 1 ? comments.eq(comments.length - 2) : null;
      hcid = last ? last.data('hcid') : 0;
    }
    error.loading();
    var message = $(this).find('textarea').eq(0).val().tag().autoLink();
    N.json[plist.data('type')].addComment({
      hpid: hpid,
      message: message
    }, function(d) {
      if (d.status === 'ok') {
        if (hcid && last) {
          N.html[plist.data('type')].getCommentsAfterHcid({
            hpid: hpid,
            hcid: hcid
          }, function(d) {
            t = $('<div>').html(d);
            var cmnum = t.children('.commentcount').eq(0).remove().html(),
              newComments = t.children('.comments').eq(0).children(),
              lastComment = comments.last();
            lastComment.remove();
            if (cmnum < internalLengthPointer) {
              $('#post' + hpid).find('.icon-comments-4').eq(0).click();
              return;
            }
            var internalLengthPointer = comments.length - 1;
            var n = internalLengthPointer + newComments.length,
              mc = form.parent().find('.more_btn').data('morecount'),
              toshow = (mc ? mc : 0 + 1) * 10;
            if (n > toshow) {
              comments.slice(0, n - toshow).remove();
              refto.children('.comment_btns').eq(0).show();
            }
            if (cmnum > 20)
              refto.find('.all_comments_btn').eq(0).show();
            clist.append(newComments);
            form.find('textarea').val('').height(0);
            error.html('');
            $('#post' + hpid).find('.icon-comments-4').eq(0).text(cmnum);
          });
        } else {
          N.html[plist.data('type')].getComments({
            hpid: hpid,
            start: 0,
            num: 10
          }, function(d) {
            refto.html(d);
            var cmnum = $('<div>').html(d).children('.commentcount').eq(0).remove().html();
            $('#post' + hpid).find('.icon-comments-4').eq(0).text(cmnum);
            error.html('');
          });
        }
      } else {
        error.html(d.message);
      }
    });
  });
  main.on('click', '.yt_frame', function(e) {
    if ($.Nerdz.mobile || e.ctrlKey)
      return window.open('https://m.youtube.com/watch?v=' + $(this).data('vid'));
    if (METRO_DIALOGS.length && $("div.window").hasClass("ytplayer"))
      $.Dialog.close($("div.window.ytplayer").data("uuid"));
    e.preventDefault();
    var vid = $(this).data('vid'), host = $(this).data("host");
    $.Dialog({
      overlay: false,
      shadow: true,
      sysButtons: {
        btnClose: true,
        btnMax: true,
        btnMin: true
      },
      icon: '<i class="icon-youtube"></i>',
      title: host.capitalize()+' Video',
      draggable: true,
      content: '',
      onClose: function() {
        $(document).unbind('keyup.yt');
      },
      onShow: function(_dialog) {
        _dialog.addClass("ytplayer");
        var content = _dialog.find(".content");
        content.data("host",host).data("vid",vid);
        N.yt(content, vid);
        content.children("div").css({width: "auto", height: "auto", margin: "0px", padding: "0px", border: "0px"}).find("br").remove();
        $(document).on('keyup.yt', function(e) {
          var code = e.keyCode ? e.keyCode : e.which;
          if (code === 27)
            $.Dialog.close($("div.window.ytplayer").data("uuid"));
        });
      },
      sysBtnMaxClick: function(e, _dialog) {
        var _caption = _dialog.find(".caption"),
            _content = _dialog.find(".content").show(),
            _iframe = _content.find("iframe");
        if(undefined===_iframe.data("height"))
          _iframe.data("height",_iframe.height());
          
        _iframe.height(_iframe.data("height"));
        if(_dialog.hasClass("maximized"))
          _iframe.height(_dialog.innerHeight()-_caption.outerHeight());
      }
    });
  });
  main.on('click', '#postlist .showcomments', function(e) {
    e.preventDefault();
    var hpid = $(this).data('hpid'),
        refto = $('#commentlist' + hpid),
        count = $(this).children().eq(0);
    if (refto.html() === '') {
      refto.loading().show();
      N.html[plist.data('type')].getComments({
        hpid: hpid,
        start: 0,
        num: 10
      }, function(res) {
        refto.hide().html(res).slideDown('slow', function() {
          ta = refto.find('.frmcomment textarea[name=message]');
          ta.autogrow();
          if (document.location.hash === '#last') {
              $(window).scrollTo(refto.find(".singlecomment").last(), 500);
              ta.focus();
          } else if (document.location.hash)
            if($(document.location.hash).length)
              $(window).scrollTo($(document.location.hash), 500);
            else
              showAllComments($(".all_comments_btn")[0], function(){$(window).scrollTo($(document.location.hash), 500);});
        });
        count.html(refto.children('.commentcount').html());
      });
    } else {
      refto.slideUp('slow', function() {
        refto.html('');
      });
    }
  });
  main.on('click', '#postlist .more_btn', function() {
    var moreBtn = $(this),
      commentList = moreBtn.parents('div[id^="commentlist"]'),
      clist = commentList.children('.comments').eq(0),
      hpid = /^post(\d+)$/.exec(commentList.parents('div[id^="post"]').attr('id'))[1],
      intCounter = moreBtn.data('morecount') || 0;
    if (moreBtn.data('inprogress') === '1')
      return;
    moreBtn.data('inprogress', '1').text(N.getLangData().LOADING + '...');
    N.html[plist.data('type')].getComments({
      hpid: hpid,
      start: intCounter + 1,
      num: 10
    }, function(r) {
      moreBtn.data('inprogress', '0').data('morecount', ++intCounter).html(N.getLangData().MORE_COMMENTS);
      var _ref = $('<div>' + r + '</div>');
      clist.html(_ref.children('.comments').eq(0).html() + clist.html());
      if (intCounter === 1)
        commentList.find('.scroll_bottom_btn').show();
      if ($.trim(r) === '' || _ref.find('.nerdz_from').length < 10 || 10 * (intCounter + 1) === _ref.find('.commentcount:eq(0)').html()) {
        commentList.find('.all_comments_btn').hide();
        moreBtn.hide();
      }
    });
  });
  main.on('click', '#postlist .scroll_bottom_btn', function() {
    var cList = $(this).parents().eq(2);
    $(window).scrollTo(cList.find('.singlecomment:nth-last-child(2)'),500,function() {
      cList.find('.frmcomment textarea').focus();
    });
  });
  var showAllComments = function(el, callback) {
    var btn = $(el),
      commentList = btn.parents('div[id^="commentlist"]'),
      hpid = /^post(\d+)$/.exec(commentList.parents('div[id^="post"]').attr('id'))[1],
      moreBtn = commentList.find('.more_btn');
    if (btn.data('working') === '1' || moreBtn.data('inprogress') === '1')
      return;
    btn.data('working', '1').text(N.getLangData().LOADING + '...');
    moreBtn.data('inprogress', '1');
    N.html[plist.data('type')].getComments({
      hpid: hpid,
      forceNoForm: true
    }, function(res) {
      btn.data('working', '0').text(N.getLangData().EVERY_COMMENT).hide();
      commentList.find('.scroll_bottom_btn').show();
      moreBtn.data('morecount', Math.ceil(parseInt($('<div>').html(res).find('.commentcount').html()) / 10)).hide();
      commentList.children('.comments').eq(0).html(res);
      if($.isFunction(callback)) callback();
    });
  };
  main.on('click', '#postlist .all_comments_btn', function() {showAllComments(this)});
  main.on('click', '#postlist .qu_ico', function() {
    var area = $('#' + $(this).data('refto'));
    area.insertAtCaret('[quote=' + $(this).data('hcid') + '|' + $(this).data('type') + ']');
    area.focus();
  });
  main.on('click', '#postlist .delpost', function(e) {
    e.preventDefault();
    var refto = $('#' + $(this).data('refto'));
    var post = refto.html();
    var hpid = $(this).data('hpid');
    N.json[plist.data('type')].delPostConfirm({
      hpid: hpid
    }, function(m) {
      if (m.status === 'ok') {
        $.Confirm(m.message, function() {
          N.json[plist.data('type')].delPost({
            hpid: hpid
          }, function(j) {
            if (j.status === 'ok') {
              refto.slideUp(function() {
                $(this).remove();
              });
              if (plist.data('singlepost'))
                location.href = '/';
            } else {
              refto.html(j.message);
            }
          });
        });
      }
    });
  });
  main.on('click', '#postlist .icon-pencil', function(e) {
    e.preventDefault();
    var refto = $('#' + $(this).data('refto')),
      hpid = $(this).data('hpid');
    var form = function(fid, hpid, message) {
      return  '<form style="margin-bottom:40px" id="' + fid + '" data-hpid="' + hpid + '">' + 
              '<textarea class="row thin" id="' + fid + 'abc" autofocus style="width:100%; height:125px">' + message + '</textarea>' + 
              '<div class="row thin"><span class="span3" style="float: right">' + '<input type="submit" class="place-right" value="' + N.getLangData().EDIT + '" style="width:45%" />' + '<button type="button" class="preview" data-refto="#' + fid + 'abc">' + N.getLangData().PREVIEW + '</button></span>' +
              '<button type="button" style="margin:0px" class="cancel">' + N.getLangData().CANCEL + '</button>' + '</div></form>';
    };
    N.json[plist.data('type')].getPost({
      hpid: hpid
    }, function(d) {
      var fid = refto.attr('id') + 'editform';
      refto.html(form(fid, hpid, d.message));
      $('#' + fid).on('submit', function(e) {
        e.preventDefault();
        N.json[plist.data('type')].editPost({
          hpid: $(this).data('hpid'),
          message: $(this).children('textarea').val()
        }, function(d) {
          if (d.status === 'ok') {
            refto.slideToggle('slow');
            N.html[plist.data('type')].getPost({
              hpid: hpid
            }, function(o) {
              refto.html(o);
              refto.slideToggle('slow');
              if (refto.data('hide')) {
                $(refto.find('div.small')[0]).prepend('<i title="' + refto.data('hide') + '" class="post_icons hide icon-cancel-2" data-postid="post' + hpid + '"></i>');
              }
            });
          } else {
            alert(d.message);
          }
        });
      }).on('click', '.cancel', function() {
        refto.slideToggle('slow');
        N.html[plist.data('type')].getPost({
          hpid: hpid
        }, function(o) {
          refto.html(o);
          refto.slideToggle('slow');
          if (refto.data('hide')) {
            $(refto.find('div.small')[0]).prepend('<i title="' + refto.data('hide') + '" class="post_icons hide icon-cancel-2" data-postid="post' + hpid + '"></i>');
          }
        });
      });
    });
  });
  main.on('click', '#postlist .icon-locked', function() {
    var me = $(this);
    var tog = function(d) {
      if (d.status === 'ok') {
        me.attr('class', 'post_icons icon-unlocked');
        me.attr('title', d.message);
      }
    };
    if ($(this).data('silent')) {
      N.json[plist.data('type')].reNotifyFromUserInPost({
        hpid: $(this).data('hpid'),
        from: $(this).data('silent')
      }, function(d) {
        tog(d);
      });
    } else {
      N.json[plist.data('type')].reNotifyForThisPost({
        hpid: $(this).data('hpid')
      }, function(d) {
        tog(d);
      });
    }
  });
  main.on('click', '#postlist .icon-unlocked', function() {
    var me = $(this);
    var tog = function(d) {
      if (d.status === 'ok') {
        me.attr('class', 'post_icons icon-locked');
        me.attr('title', d.message);
      }
    };
    if ($(this).data('silent')) {
      N.json[plist.data('type')].noNotifyFromUserInPost({
        hpid: $(this).data('hpid'),
        from: $(this).data('silent')
      }, function(d) {
        tog(d);
      });
    } else {
      N.json[plist.data('type')].noNotifyForThisPost({
        hpid: $(this).data('hpid')
      }, function(d) {
        tog(d);
      });
    }
  });
  main.on('click', '#postlist .icon-eye-2', function() {
    //unlurk
    var me = $(this);
    var tog = function(d) {
      if (d.status === 'ok') {
        me.attr('class', 'post_icons icon-eye');
        me.attr('title', 'Lurk');
      }
    };
    N.json[plist.data('type')].unlurkPost({
      hpid: $(this).data('hpid')
    }, function(d) {
      tog(d);
    });
  });
  main.on('click', '#postlist .icon-eye', function() {
    //lurk
    var me = $(this);
    var tog = function(d) {
      if (d.status === 'ok') {
        me.attr('class', 'post_icons icon-eye-2');
        me.attr('title', 'Unlurk');
      }
    };
    N.json[plist.data('type')].lurkPost({
      hpid: $(this).data('hpid')
    }, function(d) {
      tog(d);
    });
  });
  main.on('click', '#postlist .icon-plus', function() {
    var me = $(this);
    var tog = function(d) {
      if (d.status === 'ok') {
        me.attr('class', 'post_icons icon-minus');
        me.attr('title', 'Unbookmark');
      }
    };
    N.json[plist.data('type')].bookmarkPost({
      hpid: $(this).data('hpid')
    }, function(d) {
      tog(d);
    });
  });
  main.on('click', '#postlist .icon-minus, #postlist .unbookmark', function() {
    var me = $(this);
    var tog = function(d) {
      if (d.status === 'ok') {
        me.attr('class', 'post_icons icon-plus');
        me.attr('title', 'Bookmark');
      }
    };
    if(me.hasClass("unbookmark")) tog = function() {me.parents(".row").eq(0).remove();};
    N.json[plist.data('type')].unbookmarkPost({
      hpid: me.data('hpid')
    }, function(d) {
      tog(d);
    });
  });

  /* left_col events */
  /* home */
  main.on('click','#left_col #profilePostList, #left_col #projectPostList', function(e) {
    e.preventDefault();
    $.Nerdz.loadPosts({location:"home", type:$(this).attr("id").substr(0,7)});
  }).on('click', '#left_col #profilePostArrow, #left_col #projectPostArrow', function() {
    var me = $(this);
    me.next().toggle(400, function() {
      me.toggleClass('icon-arrow-down-2').toggleClass('icon-arrow-up-2');
    });
  }).on('click', '#left_col .selectlang, #left_col .projlang', function(e) {
    e.preventDefault();
    var type = $(this).hasClass("selectlang") ? "profile" : "project";
    $.Nerdz.loadPosts({location: "home", type: type, lang: $(this).data('lang')});
  });
  /* profile & projects */
  $.Nerdz.initButtons($("#main"));
  
  var BOARD, REBOARD, HINT = false;
  main.on("click", function() {
		window.clearTimeout(BOARD);
	}).on("mouseover","a.board",function(e) {
    if($.Nerdz.mobile) return;
    var that = $(this);
    if(HINT) $.Dialog.close(HINT.data("uuid"));
    window.clearTimeout(REBOARD);
    window.clearTimeout(BOARD);
    BOARD = window.setTimeout(function() {
      var POS = {position:"absolute"};
      if(e.clientY+350<$(window).height())
        POS.top = ($("body").hasClass("fixedHeader")?0:$(window).scrollTop())+e.clientY+1;
      else
        POS.bottom = 45;
      if(e.clientX+500<$(window).width())
        POS.left = e.clientX+1;
      else
        POS.right = $(window).width()-e.clientX-1;
      HINT = $.Dialog({
        icon: '<i class="icon-user"></i>',
        title: that.text()+" @ Nerdz",
        overlay: false,
        flat: true,
        shadow: true,
        position: POS,
        padding: 10,
        onShow: function(_dialog) {
          var _content = _dialog.children(".content");
            _dialog.mouseover(function(e) { 
              HINT.stop().show().css("opacity",1); 
              window.clearTimeout(REBOARD);
            }).mouseout(function(e) { 
              REBOARD = window.setTimeout(function() {
                HINT.fadeOut("slow", function() {
                  HINT.remove();
                }); 
              }, 250);
            });
          _content.loading().css({ width: "100%", overflow: "hidden" });
          var tmp = $("<div/>").load(that.attr("href")+" #left_col", function() {
            _content.html('');
            var divl = $("<div/>").css({ float: "left", width: 220, padding: 5 })
                .append(tmp.find("#badge_left").eq(0))
                .appendTo(_content);
            var divr = $("<div/>").css({ float: "left", minWidth: 220, padding: 5, overflow: "auto" });
            var t = tmp.find("#badge_right").eq(0).appendTo(divr)
            t.find("h3").eq(0).remove();
            t.find("#userslist").eq(0).css("max-height",50);
            divr.data("type", divr.find("#stuff").length ? "profile" : "project")
                .appendTo(_content);
            var usr = divr.find("#name");
                usr.html('<a href="'+that.attr("href")+'">'+usr.text()+'<i class="icon-new-tab-2"></i></a>');
            $.Nerdz.initButtons(_content);
            $.Dialog.autoResize(_dialog.data("uuid"));
          });
        }
      });
    }, 500);
  }).on("mouseout","a.board", function(e) {
    window.clearTimeout(BOARD);
    REBOARD = window.setTimeout(function() {if(HINT) { $.Dialog.close(HINT.data("uuid")); HINT = false; }}, 1000);
  });
  
  $('body').on('click', '.notref', function(e) {
    if (e.ctrlKey)
      return;
    e.preventDefault();
    var href = $(this).attr('href');
    if (href === window.location.pathname + window.location.hash) {
      location.reload();
    } else {
      location.href = href;
    }
  });
  
  $(window).on('beforeunload', function() {
    if (!$("#postlist").length)
      return;
    t = $('textarea');
    for (var ta in t) {
      val = $('textarea')[ta].value || '';
      if ($.trim(val) !== '') {
        $('textarea').eq(ta).focus();
        return N.getLangData().POST_NOT_SENT + ': \n' + val + '\n';
      }
    }
    if ($('#img_ul_file').length && $('#img_ul_file').val() !== '')
      return N.getLangData().IMG_UPLOADING_2;
  }).on('load', function() {
    $('body').on('paste', 'textarea', function(event) {
      var t = $(event.currentTarget),
					blob;
      window.items = (event.clipboardData || event.originalEvent.clipboardData).items;
      if (JSON.stringify(items).indexOf('image') === -1)
        return;
      event.preventDefault();
      for (var key in items) {
        if (items[key].hasOwnProperty('type') && items[key].type.indexOf('image') > -1) {
          blob = items[key].getAsFile();
        }
      }
      var reader = new FileReader();
      reader.onload = function(event) {
        $.Nerdz.tagPanel.imgupload(event, t);
      };
      reader.readAsDataURL(blob);
    });
  }).on("scroll",function() {
    if ($(this).scrollTop() + 200 >= $(document).height() - $(window).height()) 
      $.Nerdz.loadOlderPosts();
  });
});
