$(window).load(function() {
  var cb = function () {
    if (location.hash === '#new')
      $('.conversation').eq(0).click();
  };
  
  $.Nerdz.pm.loadInbox($("#right"),$("#content"), cb);
});
