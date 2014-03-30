$(document).ready(function() {
  var loading = N.getLangData().LOADING;
  var c = $('#content');
  $('.tile .tile-status').css('top', '0px');
  $('#prefbar').on('click', '.tile', function(event) {
    event.preventDefault();
    c.html(loading);
    $('#prefbar').animate({
      height: '130px'
    }, function() {
      $(this).addClass('compact').height('');
    });
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    location.hash = $(this).attr('id');
    N.html.post('/pages/preferences/' + $(this).attr('id') + '.html.php', {}, function(data) {
      c.hide().html(data).slideDown('slow');
    });
  });
  c.on('submit', '#edaccfrm', function(e) {
    e.preventDefault();
    $('#birth_date').attr('readonly', false);
    $date = $('#birth_date').val().split('/');
    if (!$date.length) {
      $('#error').html('Missing: Birth Date');
      return;
    }
    $('#birth_day').val($date[0]);
    $('#birth_month').val($date[1]);
    $('#birth_year').val($date[2]);
    var c = $('#res');
    c.html('...');
    N.json.post('/pages/preferences/account.html.json.php', $(this).serialize(), function(data) {
      c.html(data.message);
      if (data.status === 'error')
        N.reloadCaptcha();
    });
  }).on('submit', '#edprofrm', function(e) {
    e.preventDefault();
    var r = $('#res');
    r.html(N.getLangData().LOADING);
    N.json.post('/pages/preferences/profile.html.json.php', $(this).serialize(), function(data) {
      r.html(data.message);
    });
  }).on('submit', '#gufrm', function(e) {
    e.preventDefault();
    var check = $('#gufrm input[name=check]:checked').val();
    N.json.post('/pages/preferences/guests.html.json.php?action=' + check, {
      tok: $(this).data('tok')
    }, function(data) {
      $('#res').html(data.message);
    });
  }).on('click', '.manage', function(e) {
    e.preventDefault();
    $('#cont').html(N.getLangData().LOADING);
    N.html.post('/pages/preferences/projects.html.html.php', {
      id: $(this).data('id')
    }, function(data) {
      $('#cont').html(data);
    });
  }).on('submit', '#edprojform', function(e) {
    e.preventDefault();
    var r = $('#res');
    r.html(N.getLangData().LOADING);
    N.json.post('/pages/preferences/projects.html.html.json.php?action=update', $(this).serialize(), function(data) {
      r.html(data.message);
    });
  }).on('submit', '#delprojfrm', function(e) {
    e.preventDefault();
    var r = $('#res2');
    r.html(N.getLangData().LOADING);
    N.json.post('/pages/preferences/projects.html.html.json.php?action=del', $(this).serialize(), function(data) {
      r.html(data.message);
      if (data.status === 'ok') {
        setTimeout(function() {
          location.reload();
        }, 1500);
      }
    });
  }).on('submit', '#langfrm', function(e) {
    e.preventDefault();
    N.json.post('/pages/preferences/language.html.json.php?action=userlang', $(this).serialize(), function(obj) {
      $('#langfrm input[type=submit]').val(obj.message + '...');
      $('#res').html('...');
      if (obj.status === 'ok') {
        setTimeout(function() {
          document.location.reload();
        }, 1500);
      }
    });
  }).on('submit', '#boardfrm', function(e) {
    e.preventDefault();
    N.json.post('/pages/preferences/language.html.json.php?action=boardlang', $(this).serialize(), function(obj) {
      $('#boardfrm input[type=submit]').val(obj.message + '...');
      $('#res').html('...');
      if (obj.status === 'ok') {
        setTimeout(function() {
          document.location.reload();
        }, 1500);
      }
    });
  }).on('submit', '#delfrm', function(e) {
    e.preventDefault();
    N.json.post('/pages/preferences/delete.html.json.php', {
      captcha: $('#frmdelcpt').val()
    }, function(data) {
      if (data.status === 'ok') {
        setTimeout(function() {
          document.location.reload();
        }, 500);
      } else {
        N.reloadCaptcha();
      }
      $('#res').html(data.message);
    });
  }).on('submit', '#themesfrm', function(e) {
    e.preventDefault();
    N.json.post('/pages/preferences/themes.html.json.php', $(this).serialize(), function(obj) {
      $('#themesfrm input[type=submit]').val(obj.message + '...');
      $('#res').html('...');
      if (obj.status === 'ok') {
        setTimeout(function() {
          document.location.reload();
        }, 1500);
      }
    });
  });
  if (location.hash)
    $(location.hash).click();
});
