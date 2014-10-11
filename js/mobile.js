var h = $("head");
$('<meta>').attr('name', 'viewport').attr('id', 'viewport').attr('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0').appendTo(h);
$('<meta>').attr('name', 'mobile-web-app-capable').attr('content', 'yes').appendTo(h);
$(document).ready(function() {
  if (!$('#right_col').length)
    $('#body').append($('<div>').attr('id', 'right_col').addClass('sidebar'));
  $('#feeds').parent().parent().remove();
  var ti = $("<div>").addClass("titleicons");
  ti.append($('<div>').addClass('element').append($('#notifycounter').attr('style', '')));
  $('#footersearch').prependTo($('#left_col'));
  $('#footer_main').remove();
  $('#right_col').prepend($('.dropdown-menu').eq(0).removeClass('dropdown-menu'));
  $('#welcome').parent().remove();
  $('h3').eq(0).parent().html('<a href="/"><i class="icon-home"></i></a>').appendTo(ti);
  $("#gotopm").appendTo(ti);
  var moving = 0;
  $("#left_col, #right_col, #center_col").addClass("mobile");
  if($("#left_col").length && $("#left_col").html().length) 
    $('.navigation-bar-content').eq(0).prepend($('<div>').addClass('element').attr('id', 'title_left').html('<<'));
  ti.appendTo($('.navigation-bar-content').eq(0));  
  $('.navigation-bar-content').eq(0).append($('<div>').addClass('element pointer').attr('id', 'title_right').html('>>').css('float', 'right'));
  $('#title_left').click(function() {
      if (moving)
          return;
      moving = 1;
      $('#right_col').removeClass('shown').animate({
          left: '100%'
      }, 500);
      if (!$('#left_col').hasClass('shown'))
          $('#left_col').css('left', '-70%').css("height",$(window).height()-45).show().animate({
              left: '0%'
          }, 500, function() {
              $(this).addClass('shown');
              moving = 0;
          });
      else
          $('#left_col').animate({
              left: '-70%'
          }, 500, function() {
              $(this).removeClass('shown').hide();
              moving = 0;
          });
      return false;
  });
  $('#title_right').click(function() {
      if (moving)
          return;
      moving = 1;
      $('#left_col').removeClass('shown').animate({
          left: '-70%'
      }, 500);
      if (!$('#right_col').hasClass('shown'))
          $('#right_col').css('left', '100%').css("height",$(window).height()-45).show().animate({
              left: '30%'
          }, 500, function() {
              $(this).addClass('shown');
              moving = 0;
          });
      else
          $('#right_col').animate({
              left: '100%'
          }, 500, function() {
              $(this).removeClass('shown').hide();
              moving = 0;
          });
      return false;
  });
  var timin;
  $(window).scroll(function() {
    window.clearTimeout(timin);
    timin = window.setTimeout(function() {
      if ($('#left_col').hasClass('shown'))
        $('body').scrollLeft(0);
    }, 100);
  }).resize(function() {
    $("aside").height($(window).height()-45);
  });
});
