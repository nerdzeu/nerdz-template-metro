$(document).ready(function() {
    
  $('#main').on('click', ".preview", function() {
    var txtarea = $($(this).data('refto'));
    txtarea.val(txtarea.val() + ' ');
    var txt = txtarea.val().tag().autoLink();
    txtarea.val($.trim(txtarea.val()));
    if (undefined !== txt && $.trim(txt) !== '') {
      if(METRO_DIALOG) return window.open('/preview.php?message=' + encodeURIComponent(txt));
       $.Dialog({
        shadow: true,
        overlay: true,
        flat: true,
        icon: '<span class="icon-checkmark"></span>',
        title: 'Preview',
        width: "60%",
        padding: 10,
        content: '',
        onShow: function(_dialog){
          var content = _dialog.css("background-color",$("body").css("background-color")).children('.content').css({maxHeight:$(window).height()-60, overflow: "auto"});
          content.loading().load('/preview.php?message=' + encodeURIComponent(txt) + ' #center_col', function() {
            $.Dialog.autoResize();
          });
        }
      });
    }
  });
  
  $('#notifycounter').on('click', function(e) {
    e.preventDefault();
    var list = $('#notify_list'),
      old = $(this).html();
    var nold = parseInt(old);
    list.toggle(200).loading();
    N.html.getNotifications(function(d) {
      list.html(d);
    });
    $(this).html(isNaN(nold) ? old : '0');
  });
  $('#gotopm').on('click', function(e) {
    e.preventDefault();
    var pmc = $('#pmcounter');
    if(e.ctrlKey && location.pathname !== "/pm.php") return location.href = "/pm.php"+(pmc.html() !== '0'?"#new":"");
    if(location.pathname === "/pm.php") {
      if(pmc.html() !== '0') location.hash = "#new";
      return location.reload();
    }
    if(METRO_DIALOG!==false)
      if(METRO_DIALOG.hasClass("pmwindow")) 
        return $.Dialog.close();
      else 
        return false;
    $.Dialog({
      title: pmc.attr("title"),
      position: { top: "45px", right:"0px" },
      flat: true,
      overlay: false,
      width: $.Nerdz.mobile?"100%":"60%",
      height: "auto",
      content: '<div style="float:left;"></div><div style="float:right;"></div>',
      onShow: function(_dialog) {
        _dialog.addClass("pmwindow");
        var content = _dialog.children(".content");
            msbox = content.children().eq(0).css("background-color",$("body").css("background-color")).css("padding", "0px 5px");
            inbox = content.children().eq(1);
        inbox.css("width",content.width()*0.25).css("margin",content.width()*0.01);
        msbox.css("width",content.width()*0.70).css("margin",content.width()*0.01).css("color",$("body").css("color"));
        var cb = function() {
          if(pmc.html() !== '0')
            METRO_DIALOG.find(".conversation").eq(0).click();
          METRO_DIALOG.children(".content").children("div").eq(1).append('<br><a href="pm.php"> Open in full window <i class="icon-new-tab-2"></i></a>');
        };
        $.Nerdz.pm.loadInbox(inbox, msbox, cb);
      }
    });
    return;
  });
  var curnot = sessionStorage.getItem('curnot') ? parseInt(sessionStorage.getItem('curnot')) : 0;
  var curpm = sessionStorage.getItem('curpm') ? parseInt(sessionStorage.getItem('curpm')) : 0;
  setInterval(function() {
    var $color = $("#color-switcher .selected .icon-record").css("color");
    var nc = $('#notifycounter'),
      val = parseInt(nc.html());
    nc.css('color', val === 0 || isNaN(val) ? $color : '#FF0000');
    if (!isNaN(val) && val !== curnot && $.Nerdz.metroOptions.getOption('notify')) {
      nw = val - curnot;
      if (nw > 0) {
        N.html.getNotifications(function(d) {
          nn = $('<div>').html(d).children().length;
          if (nn === 1)
            $.Notify.show(d, function() {
              N.html.getNotifications($.noop(), false);
            });
          else
            $.Notify.show('<a href="#" onclick="">' + N.getLangData().NEW_NOTIFICATIONS.format(nn) + '</a>', function() {
              $('#notifycounter').click();
            });
          $('#notifyaudio')[0].play();
        }, true);
      }
      curnot = val;
      sessionStorage.setItem('curnot', curnot);
    }
    var pc = $('#pmcounter');
    val = parseInt(pc.html());
    if (!isNaN(val) && val !== curpm && $.Nerdz.metroOptions.getOption('notify')) {
      nw = val - curpm;
      if (nw > 0) {
        $.Notify.show('<a style="cursor:pointer">' + (nw === 1 ? N.getLangData().NEW_MESSAGE : N.getLangData().NEW_MESSAGES.format(nw)) + '!</a>', function() {
          $('#gotopm').click();
        });
        $('#notifyaudio')[0].play();
      }
      curpm = val;
      sessionStorage.setItem('curpm', val);
    }
    pc.css('color', val === 0 || isNaN(val) ? $color : '#FF0000');
  }, 200);
  
  /** back to top **/
  $("#totop").click(function(e) {
    e.preventDefault();
    $.Nerdz.scrollTo(0, 1000);
    $(this).fadeOut(500);
  });
});

var scroll_timer, displayed=false;
$(window).on("scroll", function() {
  window.clearTimeout(scroll_timer);
  window.setTimeout(function() {
      if ($(window).scrollTop() <= 700) {
        displayed = false;
        $('#totop').fadeOut(500);
      } else if (displayed === false) {
        displayed = true;
        $('#totop').stop(true, true).fadeIn();
      }
    }, 100);
});
