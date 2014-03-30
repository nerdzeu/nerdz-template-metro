$(document).ready(function() {
  var loading = N.getLangData().LOADING;
  $('#stdfrm').on('submit', function(event) {
    event.preventDefault();
    var s = $(this).find('input[type=submit]').eq(0);
    if (s.attr('disabled') === 'disabled')
      return;
    w = s.width();
    s.width(s.parent().width() * 0.9).val(loading + '...').attr('disabled', 'disabled').next().hide();
    if ($('#img_ul_file').val() !== '' && $('#img_ul_file').is(':visible'))
      if (!confirm(N.getLangData().IMG_UPLOADING))
        return s.val(N.getLangData().NERDZ_IT).attr('disabled', false).width(w).next().show();
    var message = $('#frmtxt').val().tag().autoLink();
    N.json.profile.newPost({
      message: message,
      to: $(this).data('to')
    }, function(data) {
      if (data.status === 'ok') {
        $('#showpostlist').click();
        $('#frmtxt').val('').height(0);
      }
      s.val(data.message);
      setTimeout(function() {
        s.val(N.getLangData().NERDZ_IT).attr('disabled', false).width(w).next().show();
      }, 100);
    });
  });
  var oldPlist = '';
  $('#follow').click(function() {
    var me = $(this);
    me.html('...');
    N.json.profile.follow({
      id: $(this).data('id')
    }, function(d) {
      me.html(d.message);
      me.off('click');
    });
  });
  $('#unfollow').click(function() {
    var me = $(this);
    me.html('...');
    N.json.profile.unfollow({
      id: $(this).data('id')
    }, function(d) {
      me.html(d.message);
      me.off('click');
    });
  });
  $('#blacklist').click(function() {
    var me = $(this);
    var plist = $('#postlist');
    oldPlist = plist.html();
    $('#stdfrm').hide();
    plist.html('<form id="blfrm">' + N.getLangData().MOTIVATION + ': <textarea style="width:100%; height:60px" id="blmot"></textarea><br /><input type="submit" class="place-right" value="Blacklist" /><input type="button" class="cancel" value="' + N.getLangData().CANCEL + '" /></form>');
    $('#blfrm').on('submit', function(event) {
      event.preventDefault();
      me.html('...');
      N.json.profile.blacklist({
        id: me.data('id'),
        motivation: $('#blmot').val()
      }, function(d) {
        me.html(d.message);
        plist.html(d.message);
        me.off('click');
      });
    }).on('click', '.cancel', function() {
      me.html('Blacklist');
      plist.html(oldPlist);
      $('#stdfrm').show();
    });
  });
  $('#unblacklist').click(function() {
    var me = $(this);
    me.html('...');
    N.json.profile.unblacklist({
      id: $(this).data('id')
    }, function(d) {
      me.html(d.message);
      me.off('click');
    });
  });
  $('#profilepm').on('click', function() {
    var me = $(this),
      txt = N.getLangData().PM;
    if (!$('#fast_pm').length) {
      me.html('...');
      N.html.pm.getForm(function(data) {
        oldPlist = $('#fast_nerdz').html();
        $('#fast_nerdz').html('');
        $('#postlist').hide();
        $('#center_col').prepend($('<div>').attr('id', 'fast_pm').html(data));
        $('#to').val($('#username').html());
        TPLoad();
      });
    } else {
      me.html(txt);
      $('#fast_nerdz').html(oldPlist);
      $('#postlist').show();
      $('#fast_pm').remove();
      TPLoad();
    }
  });
  $('#center_col').on('submit', '#convfrm', function(e) {
    //per i pm
    e.preventDefault();
    N.json.pm.send({
      tok: $(this).data('tok'),
      to: $('#to').val(),
      message: $('#frmtxt').val().tag().autoLink()
    }, function(d) {
      if (d.status === 'ok') {
        $('#fast_pm').html(d.message);
        setTimeout(function() {
          $('#fast_nerdz').html(oldPlist);
          $('#fast_pm').remove();
          $('#postlist').show();
          $('#profilepm').text(N.getLangData().PM);
        }, 500);
      }
    });
  });
});
