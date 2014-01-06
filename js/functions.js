rgb2hsl = function(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  var h, s, l,
      max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      d =  max - min;
  if(max==r) 
      h = ((g-b)/d)%6;
  else if(max==g)
      h = ((b-r)/d)+2;
  else
    h = ((r-g)/d)+2;
  h *= 60;
  if(!d) h = 0;
  l = (max + min) / 2;
  s = d ? d/(1-Math.abs(2*l-1)) : 0;
  return [h, s, l];
}

new function($) {
  $.fn.setCursorPosition = function(pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
}(jQuery);

(function ($, undefined) {
  $.fn.getCursorPosition = function () {
    var el = $(this).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
      pos = el.selectionStart;
    } else if ('selection' in document) {
      el.focus();
      var Sel = document.selection.createRange();
      var SelLength = document.selection.createRange().text.length;
      Sel.moveStart('character', -el.value.length);
      pos = Sel.text.length - SelLength;
    }
    return pos;
  }
})(jQuery);

(function ($) {
  $.fn.selectedText = function () {
    var s, e, sel, el = $(this).get(0);
    if('selectionStart' in el) {
      s = el.selectionStart;
      e = el.selectionEnd;
      sel = el.value.substring(s,e);
    } else if ('selection' in document) {
      el.focus();
      sel = document.selection.createRange().text;
    }
    return sel;
  }
})(jQuery);

(function ($) {
  $.fn.insertAtCaret = function (text) {
    var el = $($(this).get(0));
    if(!(el.is("textarea")||el.is("input"))) return false;
    var content = el.val();
		var position = el.getCursorPosition();
    var sel = el.selectedText();
    if(sel!="") {
      content = content.substr(0,position) + content.substr(position+sel.length);
    }
    var newContent = content.substr(0, position) + text + content.substr(position);
		el.val(newContent);
		el.setCursorPosition(position+text.length); 
  }
})(jQuery);

if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace (/{(\d+)}/g, function (match, number) {
			return typeof args[number] != "undefined" ? args[number] : match;
		});
	};
}

if (!String.prototype.tag) {
  String.prototype.tag = function() {
    return this.replace(/(?!\[(?:img|url|code|gist|yt|youtube|noparse)[^\]]*?\])(^|\s+)@@(?:\s+)?([\S ]+)@(?![^\[]*?\[\/(img|url|code|gist|yt|youtube|noparse)\])/g,"$1[user]$2[/user]")
               .replace(/(?!\[(?:img|url|code|gist|yt|youtube|noparse)[^\]]*?\])(^|\s+)@([\S]+)(?![^\[]*?\[\/(img|url|code|gist|yt|youtube|noparse)\])/g,"$1[user]$2[/user]")
  };
};

if(!String.prototype.autoLink) {
    String.prototype.autoLink = function() {
    var pattern = /(?!\[(?:img|url|code|gist|yt|youtube|noparse)[^\]]*?\])(^|\s+)(((ht|f)tps?:\/\/)?([a-z\-]+\.)*[\-\w]+(\.[a-z]{2,4})+(\/[\w\_\-\?\=\#&\.]*)*(?![a-z]))(?![^\[]*?\[\/(img|url|code|gist|yt|youtube|noparse)\])/gi;
    return this.replace(pattern, "$1[url]$2[/url]").replace(/\[(\/)?noparse\]/gi,"");
  };
}

if(!String.prototype.isUrl) {
  String.prototype.isUrl = function() {
    if(!this) return false;
    return !!this.match(/^(((ht|f)tps?:\/\/)?([a-z\-]+\.)*[\-\w]+(\.[a-z]{2,4})+(\/[\w\_\-\?\=\#&\.]*)*(?![a-z]))$/i);
  }
}

if(!String.prototype.replaceAt) {
  String.prototype.replaceAt = function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
  }
}

tags = function(btn) {
  var el = $(document.activeElement);
  if(!el.is("textarea"))
    el = $("#"+btn.parent().data("refto"));
  var content = el.selectedText();
  var pos = el.getCursorPosition();
  switch( btn.data("c") ) {
    case "url":
      var link, title;
      content.isUrl() ? link = content : title = content;
      if(!link) 
        link = prompt ("URL:", "");
      if(link==null) return false;
      if(!link.isUrl()) {
        alert("Invalid Link!"); 
        return false;
      }
      if (!/^(ftp|https?)/.test (link))
        link = "http://" + link;
      if (!title) 
        title = prompt ("Link's Title:", "");
      if (title != null && title != "")
        el.insertAtCaret("[url=\"{0}\"]{1}[/url]".format (link, title));
      else
        el.insertAtCaret("[url]{0}[/url]".format(link));
      break;
    case "code":
      var fg = prompt ("Language:", ""), l = 0;
      if (fg != null && fg != "")
      {
        el.insertAtCaret("[code={0}][/code]".format (fg));
        l = fg.length;
      }
      el.setCursorPosition(pos+7+l);
      break;
    case "quote":
      var fg = prompt ("Quote by:", ""), l = 0;
      if (fg != null && fg != "")
      {
        el.insertAtCaret("[quote={0}]{1}[/quote]".format (fg, content));
        l = fg.length;
      } else {
        el.insertAtCaret("[quote]{0}[/quote]".format (content));
        l=-1;
      }
      if(!content) el.setCursorPosition(pos+8+l);
      break;
    case "spoiler":
      var fg = prompt ("Argument:", ""), l = 0;
      if (fg != null && fg != "")
      {
        el.insertAtCaret("[spoiler={0}]{1}[/spoiler]".format (fg, content));
        l = fg.length;
      } else {
        el.insertAtCaret("[spoiler]{0}[/spoiler]".format (content));
        l=-1;
      }
      if(!content) el.setCursorPosition(pos+10+l);
      break;
    case "wiki":
      el.insertAtCaret("[wiki={0}][/wiki]".format($("html").attr("lang")));
      el.setCursorPosition(pos+9);
      break;
    case "list":
      var fg = prompt ("List Type: a|A|i|I|1 \n Default: 1", "");
      if (fg == null || fg == "") 
        fg="1";
      var list =  new Array();
      while(1) {
      li = prompt ("List Item:", "");
      if (li == null || li == "") break;
      else list.push(li);
      }
      if(!list.length) return;
      var code = '[list type="'+fg+'"]'+"\n";
      for (i in list) {
        tmp = "[*] "+list[i]+"\n";
        code +=tmp;
      }
      code += "[/list]\n";
      el.insertAtCaret(code);
      break;
    default:
      break;
  }
  el.focus();
  return false;
}

TPUpdate = function() {
  var tp = $(".tagpanel"),
      ch = tp.children("a");
  if(!tp.length) return;

  if(!localStorage.getItem("no-tagpanel"))
  {
    $(".notag").hide();
    tp.show();
    $("#tagpanel-custom").show();
    if (undefined == localStorage.getItem("tagpanel-custom")) 
      localStorage.setItem("tagpanel-custom","1111111111111111111");
    $l = localStorage.getItem("tagpanel-custom");
    ($l.charAt(18)=="1") ? $("#img_ul").show() : $("#img_ul").hide();
    for(i=0;i<$l.length;++i)
      ($l.charAt(i)=="1") ? ch.eq(i).show() : ch.eq(i).hide();
    (tp.children("button").position().left > tp.width()-50) ? $(".seeall").show() : $(".seeall").hide()
  }
  else 
  {
    tp.hide();
    $(".notag").show();
    $("#tagpanel-custom").hide();
  }
}

$(document).ready(function(){
  TPUpdate();

  var tp = $(".tagpanel");
  if(!tp.length) return;
  tp.on("click","a",function(e) {
    if(localStorage.getItem("no-tagpanel")) return false;
    btn = $(this);
    if(btn.data("c")) return tags(btn);
    tag = btn.data("tag");
    el = $(document.activeElement);
    if(!el.is("textarea"))
      el = $("#"+$(this).parent().data("refto"));
    content = el.selectedText();
    var n = tag.format(content);
    p = el.getCursorPosition();
    el.insertAtCaret(n); 
    if(content=="" && tag.indexOf("/")>-1) el.setCursorPosition(p+Math.floor(n.length/2));
    return false;
  }).on("click",".info",function() {
    $.Dialog({
      overlay: true,
      shadow: true,
      flat: true,
      padding: 10,
      icon: '<i class="icon-info-2"></i>',
      title: 'TagPanel Info',
      content: 'TagPanel allows you to easily insert tag while writing a post or a comment.<br />Tags can be inlaid by clicking on the matching button or by using the related accesskey (see your browser\'s reference to know how). <br />Accesskeys are shown while passing the cursor on a button. <br /> You can disable TagPanel, or just hide a button in Metro Preferences. <br />Metro TagPanel also provides a method to easily tag a friend in your posts and comments by typing <b>@user</b> or <b>@@user with spaces@</b>. Also automatic links markdown has been implemented.<br/> AutoTag and AutoLink will not parse code included in [img], [url], [code], [gist], [youtube] and [yt]. <br /> If you don\'t want some part of your message to be parsed you can include it between the [noparse][/noparse] tags. This will affect both autoTag and autoLink <br /> <i>Note</i>: AutoLink is an experimental feature, and you can enable or disable by opening your browser\'s javascript console and writing <br /><input type="text" value="localStorage.setItem(\'no-autolink\',\'1\')"> to disable and <br /><input type="text" value="localStorage.removeItem(\'no-autolink\')"> to re-enable it.',
      onShow: function(_dialog) { _dialog.css("max-width","450px"); }
    });
  }).on("click",".seeall",function() {
    var e = $(this),
        t = e.parent();
    if(!e.hasClass("l")) {
      t.animate({scrollLeft:t.width()},function(){e.css("right",-t.scrollLeft())});
      e.addClass("l").text("<<");
    } else {
      t.animate({scrollLeft:0},function(){e.css("right",0)});
      e.removeClass("l").text(">>");
    }
  });
  
  
    $("#img_ul").on("click","#img_ul_btn",function(e) {
      e.preventDefault();
      var f = $("#img_ul_file");
      if(f.is(":hidden"))
      {
        f.show(200);
      } else {
        if(f.val()) f.trigger("upload");
        else f.hide(200);
      }
    }).on("submit",function(e){
      e.preventDefault();
      f = $("#img_ul_file");
    });
    $("#img_ul_file").on("upload",function() {
      if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
          $("#img_ul_btn").html("Uploading...");
          $.ajax({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
              Authorization: 'Client-ID 6839f3040ee175c',
              Accept: 'application/json'
            },
            data: {
              image: e.target.result.replace(/.*,/, ''),
              type: 'base64'
            },
            success: function(result) {
              $("#frmtxt").insertAtCaret( "[img]"+result.data.link+"[/img]" );
              $("#img_ul_btn").html('<i class="icon-upload"></i>');
              $("#img_ul_file").val("").hide(200);
            },
            error: function(result) {
              $("#img_ul_btn").html(result);
            }
          }); 
        };       
        FR.readAsDataURL( this.files[0] );
      }
    })
});
