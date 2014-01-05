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

var isurl = function(c) { if(!c) return false; return !!c.match(/(((ht|f)tps?:\/\/)?([a-z\-]+\.)*[\-\w]+(\.[a-z]{2,4})+(\/[\w\_\-\?\=\#&\.]*)*(?![a-z]))/i); };

tags = function(btn) {
  var el = $(document.activeElement);
  if(!el.is("textarea"))
    el = $("#"+btn.parent().data("refto"));
  var content = el.selectedText();
  var pos = el.getCursorPosition();
  switch( btn.data("c") ) {
    case "url":
      var link, title;
      isurl(content) ? link = content : title = content;
      if(!link) 
        link = prompt ("URL:", "");
      if(link==null) return false;
      if(!isurl(link)) {
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

$(document).ready(function(){
  if(localStorage.getItem("no-tagpanel")) {
    $("<style>.tagpanel {display:none !important;}</style>").appendTo($("head"));
    return;
  } else {
    $("<style>.notag {display:none !important; }</style>").appendTo($("head"));
  }
  $(".tagpanel").on("click","a",function(e) {
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
      icon: '<i class="icon-info-2"></i>',
      title: 'TagPanel Info',
      content: 'TagPanel allows you to easily insert tag while writing a post or a comment.<br />Tags can be inlaid by clicking on the matching button or by using the related <br />accesskey (see your browser\'s reference to know how). <br />Accesskey are shown while passing the cursor on a button.'
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
});
