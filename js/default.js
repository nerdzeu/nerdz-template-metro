$(document).ready(function() {
  $("#main").children().append("<br/><br/>");
  $('#main').on('click', ".preview", function() {
    var txtarea = $($(this).data('refto'));
    txtarea.val(txtarea.val() + ' ');
    var txt = txtarea.val().tag().autoLink();
    txtarea.val($.trim(txtarea.val()));
    if (undefined !== txt && $.trim(txt) !== '') {
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
    list.toggle(200).html(N.getLangData().LOADING);
    N.html.getNotifications(function(d) {
      list.html(d);
    });
    $(this).html(isNaN(nold) ? old : '0');
  });
  $('#gotopm').on('click', function(e) {
    e.preventDefault();
    var pmc = $('#pmcounter');
    if(e.ctrlKey && location.pathname !== "/pm.php") {
      location.href = "/pm.php"+(pmc.html() !== '0'?"#new":"");
      return;
    }
    if(location.pathname === "/pm.php") {
      if(pmc.html() !== '0') location.hash = "#new";
      return location.reload();
    }
    return $.Nerdz.pm.loadWindow();
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
          var nn = $('<div>').html(d).find("li");
          if (nn.length === 1)
            $.Notify.show(nn.html(), function() {
              N.html.getNotifications($.noop, false);
            });
          else
            $.Notify.show('<a href="#" onclick="">' + N.getLangData().NEW_NOTIFICATIONS.format(nn.length) + '</a>', function(notify) {
              $('#notifycounter').click();
              notify.hide();
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
        $.Notify.show('<a href="#">' + (nw === 1 ? N.getLangData().NEW_MESSAGE : N.getLangData().NEW_MESSAGES.format(nw)) + '!</a>', function(notify) {
          $('#gotopm').click();
          notify.hide();
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
    $(window).scrollTo(0, 1000);
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
