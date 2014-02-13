$("<meta>").attr("name","viewport").attr("id","viewport").attr("content","width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0").appendTo(h);
$("<meta>").attr("name","mobile-web-app-capable").attr("content","yes").appendTo(h);
$(document).ready(function() {
  if(!$("#right_col").length) $("#body").append($('<div>').attr("id","right_col").addClass("sidebar") );
  $("#feeds").parent().remove();
  $(".navigation-bar-content").eq(0).prepend( $("<div>").addClass("element").append($("#notifycounter").attr("style","")) );
  $("#footersearch").prependTo($("#left_col"));
  //$("#left_col, #right_col, #center_col").appendTo($("#body"));
  //$("#center_col").addClass("grid fluid");
  //$("#site_title").next().remove();
  $("#footer_main").remove();
  $("#right_col").prepend($(".dropdown-menu").eq(0).removeClass("dropdown-menu"));
  $("#welcome").parent().remove();
  $("#center_col").height(screen.height-50);
  $("#site_title").css({maxWidth:screen.width,width:"100%"});
  $("h3").eq(0).parent().html('<a href="/"><i class="icon-home"></i></a>');
//impedisce il sovrapporsi degli slide
  var moving = 0;
  if(!!$("#left_col").length) 
  {
    $(".navigation-bar-content").eq(0).prepend( $('<div>').addClass("element").attr("id","title_left").html("<<") )
    $('#title_left').click(function() {
      if(moving)return;
      moving=1;
        if( $("#right_col").hasClass("shown") ) {
            $("#right_col").removeClass("shown").hide();
            $("#center_col").css("left","0");
        }
        if( ! $("#left_col").hasClass("shown") ) {
            $("#left_col").show();
            $(this).html(">>");
            $("#center_col").animate({ left : "70%" }, 500, function() { $("#left_col").addClass("shown"); moving=0; } );
        } else {
          $(this).html("<<");
          $("#center_col").animate({ left: "0px" }, 500 , function() { $("#left_col").removeClass("shown").hide(); moving=0; } );
        }
      return false;
      });
  }

 $(".navigation-bar-content").eq(0).append( $('<div>').addClass("element pointer").attr("id","title_right").html(">>").css("float","right") );
 $('#title_right').click(function() {
   console.log("R");
   if(moving) return;
   moving=1;
     if( $("#left_col").hasClass("shown") ) {
        $("#left_col").removeClass("shown").hide();
        $("#center_col").css("left","0");
     }
     if( ! $("#right_col").hasClass("shown") ) {
        $("#right_col").show();
        $(this).html("<<");
        $("#center_col").animate({ left : "-70%" }, 500, function() { $("#right_col").addClass("shown"); moving=0; } );
     }
     else
     {
       $(this).html(">>");
       $("#center_col").animate({ left: "0px" }, 500 , function() { $("#right_col").removeClass("shown").hide(); moving=0; } );
     }
     return false;
  });
  var center = function() { $(".sidebar").css("height",$("body").innerHeight()-50); $("#notifycounter").parent().css("margin-left",($("#site_title").width()/2-60-($("#title_left").length?46:1)-25)); }
  $(window).resize(center);
  center();
  var timin;
  $(window).scroll(function() {
    window.clearTimeout(timin);
    timin = window.setTimeout(function() { if($("#left_col").hasClass("shown")) $("body").scrollLeft(0);},100)
  });
});
