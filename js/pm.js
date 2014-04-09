$(window).load(function() {
  if($.Nerdz.mobile) {
    $("<div>").attr("id", "center_col").addClass("mobile").append($("#content").attr("class", "span10 offset1")).prependTo($("#main"));
    $("#right").prependTo($("#right_col"));
  }
  var cb = function () {
    if (location.hash === '#new')
      $('.conversation').eq(0).click();
  };
  $.Nerdz.pm.loadInbox($("#right"),$("#content"), cb);
});
