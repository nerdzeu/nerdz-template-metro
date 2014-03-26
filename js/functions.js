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
    el.focus();
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

REformat = function (str) { 
  return new RegExp("(?!\\[(?:img|url|code|gist|yt|youtube|noparse)[^\\]]*?\\])"+str+"(?![^\\[]*?\\[\\/(img|url|code|gist|yt|youtube|noparse)\\])","gi");
}

if (!String.prototype.tag) {
  String.prototype.tag = function() {
    return this.replace(REformat("(^|\\s+)@@(?:\\s+)?([\\S ]+)@"),"$1[user]$2[/user]")
               .replace(REformat("(^|\\s+)@([\\S]+)"),"$1[user]$2[/user]")
  };
};

if(!String.prototype.autoLink) {
    String.prototype.autoLink = function() {
    if(localStorage.getItem("no-autolink")!=undefined) return this;
    str=this;
    var pattern = REformat("(^|\\s+)((((ht|f)tps?:\\/\\/)|[www])([a-z\\-0-9]+\\.)*[\\-\\w]+(\\.[a-z]{2,4})+(\\/[\+%:\\w\\_\\-\\?\\=\\#&\\.\\(\\)]*)*(?![a-z]))");
    urls = this.match(pattern); 
    for (i in urls)
    {
      if(urls[i].match(/\.(png|gif|jpg|jpeg)$/))
        str = str.replace(urls[i],"[img]"+(urls[i].match(/(^|\s+)https?:\/\//)?"":"http://")+urls[i]+"[/img]");
      if(urls[i].match(/youtube\.com|https?:\/\/youtu\.be/) && !urls[i].match(/playlist/))
        str = str.replace(urls[i],"[yt]"+$.trim(urls[i])+"[/yt]");
    }
    return str.replace(pattern, "$1[url]$2[/url]").replace(/\[(\/)?noparse\]/gi,"").replace(REformat("<3"),"♥");
  };
}

if(!String.prototype.isUrl) {
  String.prototype.isUrl = function() {
    if(!this) return false;
    return !!this.match(/^(((ht|f)tps?:\/\/)?([a-z\-0-9]+\.)*[\-\w]+(\.[a-z]{2,4})+(\/[\w\_\-\?\=\#&\.]*)*(?![a-z]))$/i);
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
      var fg = prompt ("List Type: a|A|i|I|1", "");
      var list =  new Array();
      while(1) {
      li = prompt ("List Item:", "");
      if (li == null || li == "") break;
      else list.push(li);
      }
      if(!list.length) return;
      var code = (fg == null || fg == "") ? "[list]" : '[list type="'+fg+'"]'+"\n";
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
  $("#tagpanel-custom").hide();
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
  }
}

TPLoad = function() {
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
      FR.onload = function(event) { $.imgupload(event, $("#frmtxt")); } 
      FR.readAsDataURL( this.files[0] );
    }
  })
};
$.imgupload = function(e, t) {
  $("#img_ul_btn").html(N.getLangData().LOADING);
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
      t.insertAtCaret( "[img]"+result.data.link.replace("http:","https:")+"[/img]" );
      $("#img_ul_btn").html('<i class="icon-upload"></i>');
      $("#img_ul_file").val("").hide(200);
    },
    error: function(result) {
      $("#img_ul_btn").html(result);
    }
  }); 
};
$(window).on("load",function(){
  $("body").on("paste", "textarea", function(event) {
    t = $(event.currentTarget);
    window.items = (event.clipboardData || event.originalEvent.clipboardData).items;
    if(JSON.stringify(items).indexOf("image")==-1) return;
    event.preventDefault();
    for(var key in items) {
      if(items[key].hasOwnProperty("type") && items[key].type.indexOf("image")>-1) {
        var blob = items[key].getAsFile();
      }
    }
    var reader = new FileReader();
    reader.onload = function(event){
      $.imgupload(event, t)
    }; 
    reader.readAsDataURL(blob);
  });
});

$(function () {
    var scroll_timer;
    var displayed = false;
    var $m = $('#totop');
    var $w = $(window);
    $w.scroll(function () {
        window.clearTimeout(scroll_timer);
        scroll_timer = window.setTimeout(function () {
            if($w.scrollTop() <= 700)
            {
                displayed = false;
                $m.fadeOut(500);
            }
            else if(displayed == false)
            {
                displayed = true;
                $m.stop(true, true).fadeIn().click(function () { $m.fadeOut(500); });
            }
        }, 100);
    });
    $m.click(function(){
     if( window.opera) {
       $("html").animate({scrollTop:0},"slow");
     } else {
       $("html, body").animate({scrollTop:0},1000);
     }
    });
});

(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

(function($){ 
	jQuery.fn.extend({  
		autogrow: function() {
			var attrs = [
				'paddingTop',
				'paddingRight',
				'paddingBottom',
				'paddingLeft',
				'fontSize',
				'lineHeight',
				'fontFamily',
				'width',
				'fontWeight',
				'border-top-width',
				'border-right-width',
				'border-bottom-width',
				'border-left-width',
				'borderTopStyle',
				'borderTopColor',
				'borderRightStyle',
				'borderRightColor',
				'borderBottomStyle',
				'borderBottomColor',
				'borderLeftStyle',
				'borderLeftColor'
      ];
      return this.each( function() {
        if ( this.type !== 'textarea' ) {
					return false;
				}
        var $textarea	= $(this),
				copy		= $('<div />').css({
					'position'		: 'absolute',
					'display'		: 'none',
					'word-wrap'		: 'break-word',
					'white-space'	:'pre-wrap'
				}),
				lineHeight	= parseInt($textarea.css('line-height'),10) || parseInt($textarea.css('font-size'),'10'),
				minheight	= parseInt($textarea.css('height'),10) || lineHeight*3,
				maxheight	= parseInt($textarea.css('max-height'),10) || Number.MAX_VALUE,
				goalheight	= 0;
				if (maxheight < 0) { maxheight = Number.MAX_VALUE; }
				copy.appendTo($textarea.parent());
				var i = attrs.length;
				while(i--){
					copy.css(attrs[i],$textarea.css(attrs[i]));
				}
				var setCopyWidth = function(){
					var cWidth = Math.floor(parseInt($textarea.width(),10));
					if(copy.width() !== cWidth){
						copy.css({'width': cWidth + 'px'});
						update(true);
					}
				}
				var setHeight = function(height, overflow){
					var cHeight = Math.floor(parseInt(height,10));
					if($textarea.height() !== cHeight){
						$textarea.css({'height': cHeight,'overflow':overflow});
					}
				}
				var update = function(forced) {
					var textareaContent = $textarea.val().replace(/&/g,'&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />');
					var twinContent = copy.html().replace(/<br>/ig,'<br />');
					if(forced || textareaContent+'&nbsp;' !== twinContent){
						copy.html(textareaContent+'&nbsp;');
						if(Math.abs(copy.height() + lineHeight - $textarea.height()) > 3){
							var goalheight = copy.height()+lineHeight;
							if(goalheight >= maxheight) {
								setHeight(maxheight,'auto');
							} else if(goalheight <= minheight) {
								setHeight(minheight,'hidden');
							} else {
								setHeight(goalheight,'hidden');
							}
						}
					}
				}
				$textarea.css({overflow:'hidden'});
				$textarea.bind('keyup change cut paste', update);
				$(window).bind('resize', setCopyWidth);
				$textarea.bind('resize', setCopyWidth);
				$textarea.bind('update', update);
				$textarea.bind('blur',function(){
					(copy.height() < maxheight) && $textarea.height((copy.height()>minheight)?copy.height():minheight);
				});
				$textarea.bind('input paste',function(){ setTimeout(update, 250); });				
				update();
			});
    } 
  }); 
})(jQuery);
