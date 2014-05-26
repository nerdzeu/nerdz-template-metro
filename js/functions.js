//$.setCursorPosition
(function($) {
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
    return $($(this).get(0));
  };
}(jQuery));
//$.getCursorPosition
(function($, undefined) {
  $.fn.getCursorPosition = function() {
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
  };
}(jQuery));
//$.selectedText
(function($) {
  $.fn.selectedText = function() {
    var s, e, sel, el = $(this).get(0);
    if ('selectionStart' in el) {
      s = el.selectionStart;
      e = el.selectionEnd;
      sel = el.value.substring(s, e);
    } else if ('selection' in document) {
      el.focus();
      sel = document.selection.createRange().text;
    }
    return sel;
  };
}(jQuery));
//$.insertAtCaret
(function($) {
  $.fn.insertAtCaret = function(text) {
    var el = $($(this).get(0));
    if (!(el.is('textarea') || el.is('input')))
      return false;
    el.focus();
    var content = el.val();
    var position = el.getCursorPosition();
    var sel = el.selectedText();
    if (sel !== '') {
      content = content.substr(0, position) + content.substr(position + sel.length);
    }
    var newContent = content.substr(0, position) + text + content.substr(position);
    el.val(newContent);
    el.setCursorPosition(position + text.length);
    return el;
  };
}(jQuery));
//$.scrollDown
(function($) {
  $.fn.scrollTo = function(target, speed, callback) {
    var el = $(this).get(0),
        to;
    if(!$(el).length) return $(el);
    if(typeof target === "string" && target.toLowerCase()==="bottom") to = 2*el.scrollHeight; //tanto per stare sicuri
    else to = (target instanceof jQuery) ? (target.length?target.offset().top:0) : parseInt(target);
    if(!speed) {
      speed = 0;
    } else {
      if($.isFunction(speed)) {
        if(!callback) callback = speed;
        speed = 0;
      } else callback = $.noop;
    }
    if(speed!==0) {
      if(el===window||el===document||el===document.body) {
        if (window.opera) {
          $('html').animate({
            scrollTop: to
          }, speed, callback);
        } else {
          $('body').animate({
            scrollTop: to
          }, speed, callback);
        }
      } else {
        $(el).animate({
          scrollTop: to
        }, speed, callback);
      }
    } else {
      $(el).scrollTop(to);
    }
    return $(el);
  };
})(jQuery);
//$.loading
(function($) {
  $.fn.loading = function(callback) {
    $(this).show().html('<div class="windows8"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div></div>');
    if($.isFunction(callback)) callback();
    return $(this);
  };
})(jQuery);
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  };
}
if (!String.prototype.capitalize) {
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };
}
REformat = function(str) {
  var pre = new RegExp(/(?!\[(?:img|url|code|gist|yt|youtube|video|twitter|spotify|noparse)[^\]]*?\])(^|\s+)/),
      pos = new RegExp(/(?![^\[]*?\[\/(img|url|code|gist|yt|youtube|video|twitter|spotify|noparse)\])/);
  return new RegExp(pre.source + str.source + pos.source, 'gi');
};
if (!String.prototype.tag) {
  String.prototype.tag = function() {
    return this.replace(REformat(/@@(?:\s+)?([\S ]+)@/), '$1[user]$2[/user]').replace(REformat(/@([\S]+)/), '$1[user]$2[/user]');
  };
}
if (!String.prototype.autoLink) {
  String.prototype.autoLink = function() {
    str = this;
    var pattern = REformat(/((((ht|f)tps?:\/\/)|(www\.))([\S]+\.)*[\-\w]+(\.[a-z]{2,4})+(\/[+%:\w\_\-\?\=\#&\.\(\)]*)*(?![a-z]))/);
    urls = this.match(pattern);
    for (var i in urls) {
      if (urls[i].match(/\.(png|gif|jpg|jpeg)$/))
        str = str.replace(urls[i], '[img]' + (urls[i].match(/(^|\s+)https?:\/\//) ? '' : 'http://') + urls[i] + '[/img]');
      if (urls[i].match(/youtu\.?be|vimeo\.com|dai\.?ly(motion)?/) && !urls[i].match(/playlist/))
        str = str.replace(urls[i], '[video]' + $.trim(urls[i]) + '[/video]');
    }
    return str.replace(pattern, '$1[url]$2[/url]').replace(/\[(\/)?noparse\]/gi, '').replace(REformat(/<3/), '\u2665');
  };
}
if (!String.prototype.isUrl) {
  String.prototype.isUrl = function() {
    if (!this)
      return false;
    return !!this.match(/^(((ht|f)tps?:\/\/)([a-z\-0-9]+\.)*[\-\w]+(\.[a-z]{2,4})+(\/[\w\_\-\?\=\#&\.]*)*(?![a-z]))$/i);
  };
}
if (!String.prototype.replaceAt) {
  String.prototype.replaceAt = function(index, char) {
    var a = this.split('');
    a[index] = char;
    return a.join('');
  };
}
