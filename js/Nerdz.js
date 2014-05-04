/**
 * @class Nerdz
 * @description A class made to handle ordinary NERDZ's actions
 */
var Nerdz = function() {
	/**
	 * @class Nerdz#home
	 * @memberof Nerdz
	 * @description Handles home's events
	 */
  var home = function() {
		/**
		 * @description Hides posts from localStorage["hid"]
		 * @memberof Nerdz#home
		 * @function
		 */
    var hideHidden = this.hideHidden = function() {
      plist = $("#postlist");
      if(!plist.length || plist.data("location") !== "home")
        return;
      compressPosts();
      var hidden = localStorage.getItem('hid');
      if(hidden === null) return;
      html = '';
      var pids = hidden.split('|');
      for (var i in pids) {
        var el = plist.find('#' + pids[i]);
        if (el.length) {
          el.hide();
          var link = el.find("a.post").attr("href");
          if(link)
            html += '<li><a style="float:left" class="post" href="' + link + '">' + decodeURIComponent(link) + '</a>' + '<a style="float:right;cursor:pointer" class="show" data-id="#' + pids[i] + '" data-i="' + i + '" onclick="$.Nerdz.home.show(this);">x</a></li>';
        }
      }
      if (html === '' || !$("#hptable").length)
        return pids;
      $('#hptable').hide().html(html).show(500);
      return pids;
    };
    /**
     * @description Hides a post from home, adding it to localStorage["hid"]
		 * @memberof Nerdz#home
     * @function
     * @param {HTMLElement} post - The post to hide
     */
    this.hide = function(post) {
      var pid = $(post).data('postid');
      $('#' + pid).hide(500);
      var hidden = localStorage.getItem('hid');
      if (hidden === null) {
        localStorage.setItem('hid', pid);
      } else {
        hidden += '|' + pid;
        localStorage.setItem('hid', hidden);
      }
      var lock = $(post).find('.icon-unlocked');
      if (lock.length) {
        lock.eq(0).click();
      }
      hideHidden();
    };
    /**
     * @description Shows a previously hidden post
		 * @memberof Nerdz#home
     * @function
     * @param {HTMLElement} me - Post to show again 
     */
    this.show = function(me) {
      var pids = localStorage.getItem('hid').split('|').sort();
      pids.splice($(me).data('i'), 1);
      hid = '';
      for (var key in pids)
        hid += pids[key] + '|';
      hid = hid.substr(0, hid.length - 1);
      $($(me).data('id')).show(500, function() {
        $.each($(this).find('.img_frame>img'), function() {
          $(this).css('margin-top', (117 - $(this).height()) / 2);
        });
      });
      localStorage.setItem('hid', hid);
      if (hid === '')
        localStorage.removeItem('hid');
      $(me).parent().hide(500, function() {
        $(this).remove();
      });
    };
    /** 
     * @description Fix the height of posts in home
		 * @memberof Nerdz#home
     * @function
     */
    var compressPosts = this.compressPosts = function() {
      plist = $("#postlist");
      if(!plist.length)
        return;
      plist.find('.nerdz_message:not(".parsed")').each(function() {
        var el = $(this).find('div:first');
        var orh = el.height();
        if ((el.height() >= 200 || el.find('.gistLoad').length > 0)) {
          el.height(200).css('overflow', 'hidden');
          var n = el.next();
          n.prepend('<p class="more">&gt;&gt;' + N.getLangData().EXPAND + '&lt;&lt;</p>');
        }
        $(this).addClass("parsed");
      });
    };
		/**
		 * @description Loads home posts
		 * @function
		 * @param {{type:string, lang: string}} object - An object containing type(profile, project) and language of the home
		 * @param {function} callback - A function that will be triggered after posts' load
		 */
    this.loadPosts = function(object, callback) {
      plist = $("#postlist");
      if(!plist.length || !object || !object.type)
        return false;
      var type = object.type;
      if(type==="project") 
        $('#fast_nerdz').slideUp(400);
      $('.selectlang, .projlang').removeClass('active');
      var list = $(type==="project"?"#projlist":'#nerdzlist');
      var btn  = $(type==="project"?"#projectPostArrow":"#profilePostArrow");
      if(object.lang) {
        var lang = object.lang;
        if(list.is(":hidden")) setTimeout(function(){btn.click();},10); 
        list.find('[data-lang="'+lang+'"]').addClass("active");
        if(lang === "usersifollow") {
          $('#fast_nerdz').hide();
          N.html[type].getFollowedHomePostList(0, function(data) {
            plist.html(data).data('type', type).data('mode', 'followed');
            hideHidden();
            if(type === "profile") localStorage.setItem("autolang", lang);
          });
        } else {
          if (lang === '*' && type === "profile") 
            $('#fast_nerdz').show();
          else
            $('#fast_nerdz').hide();
          N.html[type].getByLangHomePostList(0, lang, function(r) {
            plist.html(r).data('mode', 'language').data('type', type);
            hideHidden();
            if(type === "profile") localStorage.setItem("autolang", lang);
          });
        }
      } else {
        N.html[type].getHomePostList(0, function(data) {
          plist.html(data).data('mode', 'std').data('type', type);
          if(type === "profile") {
            $('#fast_nerdz').slideDown(400);
            localStorage.removeItem("autolang");
          }
          if(!list.is(":hidden")) btn.click();
          $('.selectlang, .projlang').removeClass('active');
          hideHidden();
        });
      }
    };
  };
  home = this.home = new home();
  /**
   * @class Nerdz#profile
   * @description Handles events on profiles' page
   */
  var profile = function() {
		/**
     * @description Loads profiles' posts
		 * @memberof Nerdz#profile
		 * @function
		 * @param {{id:int}} object - An object containing the id of the board
		 * @param {function} callback - A function that will be triggered after posts' load
		 */
    this.loadPosts = function(object, callback) {
      N.html.profile.getPostList(10, object.id,function(r) {
        $("#postlist").html(r);
        if($.isFunction(callback)) callback();
      });
    };
		/**
     * @description Shares a post
		 * @memberof Nerdz#profile
		 * @function
		 * @todo
		 */
    this.share = function(el) {
      N.json.profile.share($(el).serialize(), function(d) {
        if (d.status === 'ok') {
          $(el).html('<h1>' + d.message + '</h1>');
        } else {
          $('#errore').html(d.message);
        }
      });
    };
  };
  profile = this.profile = new profile();
  /**
   * @class Nerdz#project
   * @description Handles events on projects' page
   */
  var project = function() {
		/**
     * @description Loads projects' posts
		 * @memberof Nerdz#project
		 * @function
		 * @param {{id:int}} object - An object containing the id of the board
		 * @param {function} callback - A function that will be triggered after posts' load
		 */
    this.loadPosts = function(object, callback) {
      N.html.project.getPostList(10, object.id, function(r) {
        $("#postlist").html(r);
        if($.isFunction(callback)) callback();
      });
    };
  };
  project = this.project = new project();
  /**
   * @class Nerdz#pm
   * @description Handles pms' events
   */
  var pm = function() {
		/**
     * @description Load pms' dialog
		 * @memberof Nerdz#pm
		 * @function
		 * @param {bool} reopenifalreadyopened - Looks clever, isn't in?
		 * @param {function} callback - Callback called after window load
		 */
    this.loadWindow = function(reopenifalreadyopened, callback) {
      if(METRO_DIALOGS!==0 && $(".window").hasClass("pmwindow")) {
        $.Dialog.close($(".window").data("uuid"));
        if(!reopenifalreadyopened) return;
      }
      var pmc = $('#pcounter');
      $.Dialog({
        title: pmc.attr("title"),
        position: { top: "45px", right:"0px" },
        flat: true,
        effect: "slide",
        overlay: false,
        width: $.Nerdz.mobile?"100%":"60%",
        height: "auto",
        content: '<div style="float:left;"></div><div style="float:right;"></div>',
        onShow: function(_dialog) {
          _dialog.addClass("pmwindow").outerWidth($(window).innerWidth);
          var content = _dialog.children(".content"),
              msbox = content.children().eq(0).css("background-color",$("body").css("background-color")).css("padding", "0px 5px"),
              inbox = content.children().eq(1);
					inbox.css("width",content.width()*0.25).css("margin",content.width()*0.01);
					msbox.css("width",content.width()*0.70).css("margin",content.width()*0.01);
          var cb = function() {
            if(pmc.html() !== '0') {
              _dialog.find(".conversation").eq(0).click();
              pmc.html( parseInt(pmc.html())-1 );
            }
            _dialog.children(".content").children("div").eq(1).append('<br><a href="pm.php"> Open in full window <i class="icon-new-tab-2"></i></a>');
            if($.isFunction(callback)) callback(_dialog);
          };
          $.Nerdz.pm.loadInbox(inbox, msbox, cb);
        }
      });
    };
    /**
     * @description Load inbox on specified selectors
		 * @memberof Nerdz#pm
     * @function
     * @param {HTMLElement} r - The element that will contain the conversations' list
     * @param {HTMLElement} c - The element that will contain the conversation
     * @param {function} callback - Callback called after inbox load
     */
    this.loadInbox = function(r, c, callback) {
      var loadtxt = N.getLangData().LOADING;
      var newpm = false;
      N.html.pm.getInbox(function(data) {
        $(document).on("click.pm",function(e) {
          var el = $(e.target);
          if(/conversation/.test(el.attr("class")) || el.attr("id")==="delconvs") return;
          r.find(".conversation.active").removeClass("active");
        }).on("keyup.pm",function(e) {
          if(e.which===46) r.find("#delconvs").click();
          if(e.which===27) r.find(".conversation.active").removeClass("active");
        });
        c.on('keydown', 'textarea', function(e) {
          if (e.ctrlKey && (e.keyCode === 10 || e.keyCode === 13)) {
            $(this).parent().trigger('submit');
          }
        });
        r.html(data).on("click",".conversation",function(e) {
          if(e.ctrlKey) {
            $(this).toggleClass("active");
            if(r.find(".conversation.active").length) 
              r.find("#delconvs").show(200); 
            else
              r.find("#delconvs").hide(200);
          } else {
            if($(this).hasClass("marked")) return;
            r.find(".conversation.active").removeClass("active");
            r.find(".conversation.marked").removeClass("marked");
            $(this).addClass("marked");
            var from = $(this).data("from"),
                to = $(this).data("to");
            c.loading();
            N.html.pm.getConversation({
              from: from,
              to: to,
              start: 0,
              num: 10
            }, function(data) {
              c.html(data);
              c.find("#convfrm textarea").focus();
              c.find("#pmlist").on("scroll", function(e) {
                var plist = $(this);
                if(!plist.children(".loading").length && plist.scrollTop()<100) {
                  var ph = $("<div>").addClass("loading").loading().prependTo(plist),
                      num = $(this).children(".pm").length;
                  if(num<10) return ph.html("<hr>");
                  N.html.pm.getConversation({
                    from: plist.data("from"),
                    to: plist.data("to"),
                    start: parseInt(num/10),
                    num: 10
                  }, function(data) {
                    if(!data) {
                      return ph.html("<hr>");
                    }
                    e.preventDefault();
                    plist.prepend(data);
                    plist.scrollTo(ph);
                    ph.remove();
                  });
                }
              });
              c.find("#convfrm").on("submit",function(e) {
                e.preventDefault();
                var m = $(this).find('#frmtxt').val().autoLink();
                if($.trim(m)==="") return;
                var s = $(this).find('input[type=submit]').eq(0);
                if (s.attr('disabled') === 'disabled')
                  return false;
                var w = s.width();
                s.width(s.parent().width() * 0.9).val(loadtxt).attr('disabled', 'disabled').next().hide();
                if (c.find('#img_ul_file').val() !== '' && c.find('#img_ul_file').is(':visible'))
                  if (!confirm(N.getLangData().IMG_UPLOADING))
                    return s.val(N.getLangData().NERDZ_IT).attr('disabled', false).width(w).next().show();
                var plist = c.find("#pmlist"),
                    pms = plist.children(".pm"),
                    last = pms.length>1 ? pms.eq(pms.length-1) : pms.eq(pms.length-1),
                    pmid = last.data("pmid");
                N.json.pm.send({
                  to: $(this).find('#to').val(),
                  message: m
                }, function(d) {
                  if(d.status === 'ok') {
                    c.find('#frmtxt').val('');
                    N.html.pm.getConversationAfterPmid({
                      from: plist.data("from"),
                      to: plist.data("to"),
                      pmid: pmid
                    }, function(d) {
                      plist.html(plist.html()+d);
                      plist.scrollTo("bottom", 500);
                      s.val(d.message);
                      setTimeout(function() {
                        s.val(N.getLangData().NERDZ_IT).attr('disabled', false).width(w).next().show();
                      }, 100);
                    });
                  }
                });
              });
              c.find("#pmlist").data("from", from).data("to", to).scrollTo("bottom");
              $.Nerdz.tagPanel.load(c.find(".tagpanel"));
            });
          }
        }).on("click",".new",function() {
          var n = $(this);
          c.loading();
          r.find(".conversation.marked").removeClass("marked");
          N.html.pm.getForm(function(data) {
            c.html(data).find("#convfrm").on("submit", function(e){
              e.preventDefault();
              var s = $(this).find('input[type=submit]').eq(0);
              if (s.attr('disabled') === 'disabled')
                return false;
              var w = s.width();
              s.width(s.parent().width() * 0.9).val(loadtxt).attr('disabled', 'disabled').next().hide();
              if (c.find('#img_ul_file').val() !== '' && c.find('#img_ul_file').is(':visible'))
                if (!confirm(N.getLangData().IMG_UPLOADING))
                  return s.val(N.getLangData().NERDZ_IT).attr('disabled', false).width(w).next().show();
              var m = $(this).find('#frmtxt').val().autoLink();
              N.json.pm.send({
                to: $(this).find('#to').val(),
                message: m
              }, function(d) {
                if(d.status==="ok") {
                  N.html.pm.getInbox(function(data) {
                    r.html(data).find(".conversation").eq(0).click();
                  });
                } else return s.val(N.getLangData().NERDZ_IT).attr('disabled', false).width(w).next().show(); 
              });
            });
            c.find("#convfrm input").on('keydown', function(e) {
							if (e.which===13) {
								e.preventDefault();
								c.find("textarea").focus();
							}
						});
            if(undefined!==n.data("username")) {
              c.find("#convfrm input").eq(0).val(n.data("username")).attr("disabled", true);
              c.find("textarea").focus();
              n.removeData("username");
            }
            $.Nerdz.tagPanel.load(c.find(".tagpanel"));
          });
        }).on("click","#delconvs", function() {
          var btn = $(this);
          $.Confirm(N.getLangData().ARE_YOU_SURE, function() {
            c.find(".conversation.active").each(function() {
              var el = $(this);
              N.json.pm.delConversation({
                from: $(this).data('from'),
                to: $(this).data('to'),
                time: $(this).data('time')
              }, function(data) {
                if (data.status === 'ok') {
                  el.slideUp(function(){el.remove();});
                } else {
                  el.html(data.message);
                }
                btn.hide(200);
              });
            });
          });
        });
        if($.isFunction(callback)) callback();
      });
    };
  };
  pm = this.pm = new pm();
  /**
   * @description Calls the right loadpost, depending on (object.)location
   * @function
   * @param {object} object - Contains location, type and eventually lang or id of the postlist
   * @param {function} callback - Callback called after posts load
   */
  var loadPosts = this.loadPosts = function(object, callback) {
    var plist = $("#postlist");
    if(!plist.length) return;
    if(plist.hasClass("singlepost")) {
      $(window).load(function() {
        setTimeout(function(){
          $(".showcomments").click();
        },10);
      });
      return;
    }
    window.location.hash = "";
    plist.loading();
    if(!object) object = { location: plist.data("location"), type: plist.data("type"), lang: null!==localStorage.getItem("autolang")?localStorage.getItem("autolang"):false, id: plist.data("id") };
    var loc = object.location;
    if(!loc)
      return false;
    $.Nerdz[loc].loadPosts(object,callback);
  };
  /**
   * @description Load older posts, depending on location
   * @function
   * @param {function} callback - Callback called after posts load
   */
  var loadOlderPosts = this.loadOlderPosts = function(callback) {
    var plist = $("#postlist");
    var num = 10;
    var hpid = plist.find('div.post').last().data('hpid');
    var mode = plist.data('mode');
    var type = plist.data('type');
    if(plist.hasClass("singlepost") && mode!=="search")
      return;
    var append = $("<div>").attr("id","scrtxt").loading();
    if (!plist || !hpid || $('#scrtxt').length) 
      return;
    plist.append(append);
    var manageResponse = function(data) {
      $('#scrtxt').remove();
      if (data.length > 0) {
        plist.append(data);
        home.hideHidden();
      }
      if($.isFunction(callback)) callback();
    };
    var id;
    switch(plist.data("location")) {
      case "home":
        switch(plist.data("mode")) {
          case "std":
            N.html[type].getHomePostListBeforeHpid(num, hpid, manageResponse);
          break;
          case "followed":
            N.html[type].getFollowedHomePostListBeforeHpid(num, hpid, manageResponse);
          break;
          case "language":
            N.html[type].getByLangHomePostListBeforeHpid(num, lang, hpid, manageResponse);
          break;
          case "search":
            N.html.search["global"+type.capitalize()+"PostsBeforeHpid"](num, $('#footersearch input[name=q]').val(), hpid, manageResponse);
          break;
          default:
            return;
        }
      break;
      case "profile":
        id = plist.data("id");
        if(!id) return;
        if(mode==="search")
          N.html.search.specificProfilePostsBeforeHpid(num, $("#footersearch input[name=q]").val(), id, hpid, manageResponse);
        else
          N.html.profile.getPostListBeforeHpid(num, id, hpid, manageResponse);
      break;
      case "project":
        id = plist.data("id");
        if(!id) return;
        if(mode==="search")
          N.html.search.specificPrjectPostsBeforeHpid(num, $("#footersearch input[name=q]").val(), id, hpid, manageResponse);
        else
          N.html.project.getPostListBeforeHpid(num, id, hpid, manageResponse);
      break;
      default: 
        return false;
    }
  };
  /**
   * @description Currently is used only on postlist, projectlist and bookmarks to order posts. Could be extended to order any type of post
   * @function
   * @param {string} order - The key on which order posts
   * @param {string} url - The url to format
   * @param {bool} returnUrl - If true the function will return the formatted url, else user will be redirect on it
   */
  var orderBy = this.orderBy = function(order, url, returnUrl) {
		if(!url) url = window.location.href;
		if (url.search(/orderby=[a-z]+/i) !== -1) {
			url = url.replace(/orderby=[a-z]+/i, 'orderby=' + order);
		} else {
			url += (location.search === '' ? '?' : '&') + 'orderby=' + order;
		}
		var re, str;
		if(/userslist/.test(url)) {
			re = new RegExp(/desc=[0-1]/i);
			str = "desc=";
		}else{
			re = new RegExp(/asc=[0-1]/i);
			str = "asc=";
		}
		if (url.search(re) !== -1) {
			url = url.replace(re, str + (url.match(re)[1] === '1' ? '0' : '1'));
		} else {
			url += '&'+str+'0';
		}
		if(!returnUrl)
			location.replace(url);
		else
			return url;
	};
	/**
	 * @description Handles researches on all needed pages
	 * @function
	 * @param {function} callback - Callback called after search
	 */
  var Search = this.Search = function(callback) {
    var plist = $('#postlist');
    var qs = $.trim($('#footersearch input[name=q]').val());
    var num = 10;
    if (qs === '') {
      return false;
    }
    var manageResponse = function(d) {
      plist.html(d?d:"<center>No results Found</center>");
      if($.isFunction(callback)) callback(); 
    };
    var type = plist.data("type"),
				location = plist.data("location");
		if(/(home|profile|project)/.test(location))
			N.html.search[((location==="home")?"global":"specific")+type.capitalize()+"Posts"](num, qs, manageResponse);
		else {
			var url = window.location.href,
					order;
			url.replace(/orderby=([a-z]+)/i, function(match, str) {
				order = str;
			});
			if(!order) order = $(".pointer.default").eq(0).attr("id");
			url = $.Nerdz.orderBy(order, url, true);
			if (url.search(/q=[a-z]+/i) !== -1) {
				url = url.replace(/q=[a-z]+/i, 'q=' + qs);
			} else {
				url = url + '&q=' + qs;
			}
			return window.location.replace(url);
		}
		plist.data('mode', 'search').loading();
  };
  /**
   * @description Sends a new NERDZ
   * @function
   * @param {object} object - Contains informations on type, location and id of the current board
   */
  var Post = this.Post = function(object) {
    var loading = N.getLangData().LOADING;
    var s = $("#stdfrm").find('input[type=submit]').eq(0);
    if (s.attr('disabled') === 'disabled')
      return;
    var w = s.width();
    s.width(s.parent().width() * 0.9).val(loading + '...').attr('disabled', 'disabled').next().hide();
    if ($('#img_ul_file').val() !== '' && $('#img_ul_file').is(':visible'))
      if (!confirm('The image you selected was not uploaded still. Do you want to send the message anyway?'))
        return s.val(N.getLangData().NERDZ_IT).width(w).next().show();
    var message = $('#frmtxt').val().tag().autoLink();
    var jObj = {
      message: message,
      to: $("#postlist").data("id")?$("#postlist").data("id"):0
    };
    if($("#postlist").data("type")==="project") {
      var news = $('#sendnews');
      if (news.length) {
        news = news.is(':checked') ? '1' : '0';
      } else {
        news = '0';
      }
      $.extend(jObj, { news: news });
    }
    N.json[$("#postlist").data("type")].newPost(jObj, function(data) {
      if (data.status === 'ok') {
        $('#frmtxt').val('').height(0);
        loadPosts();
      }
      s.val(data.message);
      setTimeout(function() {
        s.val(N.getLangData().NERDZ_IT).attr('disabled', false).width(w).next().show();
      }, 1250);
    });
  };
	/**
	 * @class nerdz#metroOption
	 * @description Handles options of MetroNerdz
	 */
  var __metroOptions = function() {
    var options = {
      codeLight: false,
      color: 'default',
      theme: 'dark',
      tagPanel: '1111111111111111111111',
      notify: true,
      desktopNotify: false,
      fixedHeader: false,
      footer: true
    };
    var colors = {
      'default': '#4390DF',
      'lime': '#a4c400',
      'amber': '#F0A30A',
      'red': '#e51400',
      'steel': '#555555'
    };
   /**
    * @description Returns current Metro Options
    * @memberof Nerdz#metroOption
    * @function
    */
    this.getOptions = function() {
      return options;
    };
   /**
    * @description Restores options from localstorage
    * @memberof Nerdz#metroOption
    * @function
    */
    this.restoreOptions = function() {
      var obj = JSON.parse(localStorage.getItem('metro-options')),
					aKeys = Object.keys(obj).sort(),
					bKeys = Object.keys(options).sort();
      if (undefined !== obj)
				if(JSON.stringify(aKeys) === JSON.stringify(bKeys))
					options = obj;
				else {
					$.extend(options, obj);
					this.setOption();
				}
      return this;
    };
   /**
    * @description Returns current value of the specified option
    * @memberof Nerdz#metroOption
    * @function
    * @param {string} options - The key of the option
    */
    this.getOption = function(option) {
      return options[option];
    };
    var getOption = this. getOption;
   /**
    * @description Set an options
    * @memberof Nerdz#metroOption
    * @function
    * @param {string} option - The key of the option
    * @param {*} value - Value to be set
    */
    this.setOption = function(option, value) {
      if(option && value!==undefined) options[option] = value;
      return localStorage.setItem('metro-options', JSON.stringify(options));
    };
    var setOption = this.setOption;
   /**
    * @description (Re)Initialize UI with current options
    * @memberof Nerdz#metroOption
    * @function
    */
    this.initOptions = function() {
      var div = $("#pref-metro");
      if(!div.length) return false;
      div.click(function(e){e.stopPropagation();});
      $("#theme-switcher").on("click",".tile:not(.selected)", function(e) {
        var theme = getOption("theme");
        $(this).parent().children(".selected").removeClass("selected");
        setOption("theme",$(this).addClass("selected").attr('id'));
        $("body").removeClass(theme).addClass($(this).attr('id'));
      }).children("#"+options.theme).addClass("selected");
      $("#theme-code-switcher").attr("checked",options.codeLight).on("change", function() {
        setOption("codeLight",$(this).is(":checked"));
        location.reload();
      });
      for (var col in colors)
        $('<div>').attr('class', 'tile tiny')
          .html('<div class="tile-content icon"><i class="icon-record" style="color:' + colors[col] + ';"></i></div>')
          .attr('title', col).addClass(options.color === col ? 'selected' : '').appendTo($('#color-switcher'));
      $("#color-switcher").on("click", ".tile:not(.selected)", function(){
        var color = getOption("color");
        $(this).parent().children(".selected").removeClass("selected");
        setOption("color",$(this).addClass("selected").attr("title"));
        $("body").removeClass(color).addClass($(this).attr("title"));
      });
      $("#metro-header").attr("checked",options.fixedHeader).on("change",function(){
        setOption("fixedHeader", $(this).is(":checked"));
        $("body").toggleClass("fixedHeader");
      });
      $("#metro-notify").attr("checked",options.notify).on("change",function(){
				if($(this).is(":checked") && "Notification" in window) 
					Notification.requestPermission(function(e){
						if(e==="granted") setOption("desktopNotify", true);
						else if(e==="denied") setOption("desktopNotify", false);
					});
				else
					setOption("desktopNotify", false);
        setOption("notify", $(this).is(":checked"));
      });
      $("#metro-footer").attr("checked",options.footer).on("change",function(){
        setOption("footer", $(this).is(":checked"));
        location.reload();
      });
      var tp = options.tagPanel;
      if(typeof tp === "boolean" || typeof tp === "undefined") {
				tp =  '1111111111111111111111';
				setOption("tagpanel", tp);
			}
      $("#metro-tagpanel").attr("checked",tp.charAt(0)==="1").on("change",function() {
        tp = tp.replaceAt(0, $(this).is(":checked")?"1":"0");
        setOption("tagPanel",tp);
        tagPanel.update();
      });
      $('#tagpanel-custom').on('click', tagPanel.showOptions);
      $("body").addClass(options.theme).addClass(options.color);
      if(options.fixedHeader && !$.Nerdz.mobile) $("body").addClass("fixedHeader");
			if(!options.footer && !$.Nerdz.mobile) {
				$("#ncounter").appendTo($("<a>").attr("id","gotono").addClass("element place-right").css({paddingLeft: 30, paddingRight:30, cursor: "pointer"}).insertBefore("#gotopm"));
				$("<style>").html("#notify_list { top: 45px; bottom: auto; }").appendTo("head");
				$("#footersearch").appendTo($("<span>").attr("id","search").addClass("element place-right").css({paddingLeft: 30, paddingRight:30, cursor: "pointer"}).appendTo($("header").children().eq(0)));
				$("footer").remove();
			}
      $('#metro-info').on('click', function() {
        $.Dialog({
          shadow: true,
          overlay: false,
          icon: '<span class="icon-rocket"></span>',
          title: 'Nerdz Metro Template',
          width: 500,
          padding: 10,
          onShow: function(_dialog) {
            $.ajax({
              url: '/tpl/2/VERSION'
            }).done(function(d) {
              _dialog.children('.content').html('<a href=\'https://github.com/nerdzeu/nerdz.eu/commit/{1}\' target=\'_blank\'> Nerdz, Last Commit {1} </a> <br />NerdzMetro Theme by Dr.Jest. Version {0} <br /> Barely based on work made by<a href=\'https://github.com/olton/Metro-UI-CSS/blob/master/LICENSE\' target=\'_blank\'> Sergey Pimenov </a>'.format(d, Nversion));
              $.Dialog.autoResize();
            });
          }
        });
      });
    };
    
    var __construct = function(t) {
      if (null === localStorage.getItem('metro-options'))
        localStorage.setItem('metro-options', JSON.stringify(t.getOptions()));
      else
        t.restoreOptions();
      $(document).ready(t.initOptions);
    }(this);
  };
  var metroOptions = this.metroOptions = new __metroOptions();
  /**
   * @class Nerdz#tagPanel
   * @description Renders the MetroTagPanel
   */
  var __tagPanel = function() {
    var buttons = [
      { ak: "a", tag: "url", html: "i.icon-link" },
      { ak: "c", tag: "code", html: "i.icon-code" },
      { ak: "q", tag: "quote", html: "i.icon-right-quote" },
      { ak: "n", tag: "spoiler", html: "(Spoiler)" },
      { ak: "w", tag: "wiki", html: "i.icon-wiki" },
      { ak: "l", tag: "list", html: "i.icon-list" },
      { ak: "j", tag: "img", html: "i.icon-pictures" },
      { ak: "v", tag: "video", html: "i.icon-youtube" },
      { ak: "b", tag: "b", html: "b(B)" },
      { ak: "i", tag: "cur", html: "i(I)" },
      { ak: "u", tag: "u", html: "u(U)" },
      { ak: "d", tag: "del", html: "del(del)" },
      { ak: "s", tag: "small", html: "small(small)" },
      { ak: "t", tag: "big", html: "big(big)" },
      { ak: "p", tag: "project", html: "(Project)" },
      { ak: "g", tag: "gist", html: "i.icon-github-2" },
      { ak: "m", tag: "m", html: "(∫)" },
      { ak: "r", tag: "hr", html: "(hr)" },
      { ak: "y", tag: "spotify", html: "i.icon-music" },
      { ak: "w", tag: "twitter", html: "i.icon-twitter" }
    ];
    
    var render = function(obj) {
      var el = $("<a>").addClass("button");
      var h = obj.html,
          i = h.match(/\((.*)\)/),
          t = h.match(/([\w]+)(\.|\()+/),
          c = h.match(/\.([\d\w\-]+)/);
      if(t!==null) {
        $("<"+t[1]+">").addClass(c!==null?c[1]:"").text(i!==null?i[1]:"").appendTo(el); 
      } else el.text(i!==null?i[1]:"");
      el.attr("accesskey", obj.ak).data("tag",obj.tag);
      return el;
    };
   /**
    * @description Reloads the tag
    * @memberof Nerdz#tagPanel
    * @function
    * @param {HTMLElement} tp - The tagpanel to reload (Default: $(".tagpanel").eq(0))
    */
    this.update = function(tp) {
			if(!tp || !tp.length)
				tp = $(".tagpanel");
      var div = tp.children("div").eq(0);
      opt = metroOptions.getOption("tagPanel").toString();
      console.log(opt.length);
      if(!tp.length)
        return;
      if(opt.charAt(0)==="0")
        return div.hide().prev().show();
      div.show().prev().hide();
      if(opt.charAt(1)==="0")
        $("#img_ul").hide();
      else 
        $("#img_ul").show();
      for(var i=2, j=0; i<opt.length; i++) {
        div.children(".button").eq(j++).css("display",opt.charAt(i)==="1"?"inline":"none");
      }
    };
   /**
    * @description Loads the tag
    * @memberof Nerdz#tagPanel
    * @function
    * @param {HTMLElement} tp - The tagpanel to reload (Default: $(".tagpanel").eq(0))
    */    
    this.load = function(tp) {
      if(!tp || !tp.length)
        tp = $(".tagpanel").eq(0);
      var div = $("<div>").css({float: "left", paddingRight: "30px"});
      var opt = metroOptions.getOption("tagPanel").toString();
      if(!opt || !/^[01]{22}$/.test(opt))
          opt = "1111111111111111111111";
      if(!tp.length)
        return;
      if(opt.charAt(0)==="0") 
        div.hide();
      else
        tp.children().eq(0).hide();
      if(opt.charAt(1)==="1") {
        var frm = $("<form>").attr("id","img_ul"),
            btn = $("<button>").attr("id","img_ul_btn").html('<i class="icon-upload">').attr("title","Image Upload"),
            img = $("<input>").attr("id","img_ul_file").attr("type","file").attr("accept","image/*").attr("name","image").css("display","none");
        btn.on("click",function(e) {
          e.preventDefault();
          if (img.is(':hidden')) {
            img.show(200);
          } else {
            if (img.val())
              img.trigger('upload');
            else
              img.hide(200);
          }
        });
        img.on('upload', function(e) {
          e.preventDefault();
          if (this.files && this.files[0]) {
            var FR = new FileReader();
            FR.onload = function(event) {
              tagPanel.imgupload(event, $('#frmtxt'));
            };
            FR.readAsDataURL(this.files[0]);
          }
        });
        frm.append(btn).append(img).appendTo(div);
      }
      for(var i=2, j=0; i<opt.length; i++) {
        render(buttons[j++]).css("display", opt.charAt(i)==="1"?"inline":"none").appendTo(div);
      }
      div.appendTo(tp);
      $("<span>").text(">>").attr("class","seeall").css("display",div.width()>tp.width()?"block":"none").on('click', function() {
        var e = $(this);
        if (!e.hasClass('l')) {
          tp.animate({
            scrollLeft: tp.width()
          }, function() {
            e.css('right', -tp.scrollLeft());
          });
          e.addClass('l').text('<<');
        } else {
          tp.animate({
            scrollLeft: 0
          }, function() {
            e.css('right', 0);
          });
          e.removeClass('l').text('>>');
        }
      }).appendTo(div);
      return tp.on("click",".button", tagPanel.trigger);
    };
   /**
    * @description Triggered when clicking on a button
    * @memberof Nerdz#tagPanel
    * @function
    * @param {MouseEvent} e - MouseEvent, used to detect the key
    */
    this.trigger = function(e) {
      e.preventDefault();
      var tg = $(e.target),
          btn = tg.hasClass("button")? tg : tg.parents(".button").eq(0),
          tag = btn.data("tag"),
          el =  $(document.activeElement).is("textarea")?$(document.activeElement):$("#frmtxt"),
          pos = el.getCursorPosition(),
          content = el.selectedText(),
          fg, l;
      switch(tag) {
        case 'url':
          var link, title;
          if (content.isUrl())
            link = content;
          else
            title = content;
          if (!link)
            link = prompt('URL:', '');
          if (link === null)
            return false;
          if (!link.isUrl()) {
            alert('Invalid Link!');
            return false;
          }
          if (!/^(ftp|https?)/.test(link))
            link = 'http://' + link;
          if (!title)
            title = prompt('Link\'s Title:', '');
          if (title !== null && title !== '')
            el.insertAtCaret('[url="{0}"]{1}[/url]'.format(link, title));
          else
            el.insertAtCaret('[url]{0}[/url]'.format(link));
          break;
        case 'code':
          fg = prompt('Language:', '');
          l = 0;
          if (fg !== null && fg !== '') {
            el.insertAtCaret('[code={0}][/code]'.format(fg));
            l = fg.length;
          }
          el.setCursorPosition(pos + 7 + l);
        break;
        case 'quote':
          fg = prompt('Quote by:', '');
          l = 0;
          if (fg !== null && fg !== '') {
            el.insertAtCaret('[quote={0}]{1}[/quote]'.format(fg, content));
            l = fg.length;
          } else {
            el.insertAtCaret('[quote]{0}[/quote]'.format(content));
            l = -1;
          }
          if (!content)
            el.setCursorPosition(pos + 8 + l);
        break;
        case 'spoiler':
          fg = prompt('Argument:', '');
          l = 0;
          if (fg !== null && fg !== '') {
            el.insertAtCaret('[spoiler={0}]{1}[/spoiler]'.format(fg, content));
            l = fg.length;
          } else {
            el.insertAtCaret('[spoiler]{0}[/spoiler]'.format(content));
            l = -1;
          }
          if (!content)
            el.setCursorPosition(pos + 10 + l);
        break;
        case 'wiki':
          el.insertAtCaret('[wiki={0}][/wiki]'.format($('html').attr('lang')));
          el.setCursorPosition(pos + 9);
        break;
        case 'list':
          fg = prompt('List Type: a|A|i|I|1', '');
          var list = [];
          while (1) {
            li = prompt('List Item:', '');
            if (li === null || li === '')
              break;
            else
              list.push(li);
          }
          if (!list.length)
            return;
          var code;
          if (fg === null || fg === '')
            code = '[list]';
          else
            code = '[list type="' + fg + '"]' + '\n';
          for (var i in list) {
            tmp = '[*] ' + list[i] + '\n';
            code += tmp;
          }
          code += '[/list]\n';
          el.insertAtCaret(code);
        break;
        case "hr":
          el.insertAtCaret("[hr]");
        break;
        default:
          tag = "["+tag+"]{0}[/"+tag+"]";
          tag = tag.format(content);
          el.insertAtCaret(tag);
          if (content === '')
            el.setCursorPosition(pos + Math.floor(tag.length / 2));
        break;
      }
    };
   /**
    * @description Show a {@link metro.Dialog} containing panel options
    * @memberof Nerdz#tagPanel
    * @function
    */
    this.showOptions = function() {
      if (!$('.tagpanel').length)
        return false;
      $.Dialog({
        shadow: true,
        overlay: false,
        icon: '<span class="icon-tools"></span>',
        title: 'Metro Tagpanel Options',
        width: 500,
        draggable: true,
        padding: 10,
        onShow: function(_dialog) {
          _dialog.css({width:'450px', color: "#111"});
          var tp = $('.tagpanel'),
            ch = tp.children("div").eq(0).children('a');
          var html = '<label class="input-control switch">TagPanel: &nbsp;&nbsp;<input type="checkbox" id="w-metro-tagpanel" checked /><span class="check"></span></label><br /><br /><div id="checkboxes">';
          $l = metroOptions.getOption('tagPanel');
          var label = function(name, index, checked) {
            return '<label style="width: 200px; height: 30px" data-i="' + index + '" class="input-control switch">' + name + ': &nbsp;&nbsp;<input type="checkbox" ' + (checked ? 'checked' : '') + ' /><span class="check"></span></label>&nbsp;&nbsp;';
          };
          
          html += label('Image Upload', 1, $l.charAt(1) === '0' ? false : true) + '<br />';
          for (var i = 0, j = 2; j < ch.length; ++j) 
            html += label(ch.eq(i++).html(), j, $l.charAt(j) === '0' ? false : true);
          html += '</div>';
          
          _dialog.children('.content').html(html);
          _dialog.on('change', '#w-metro-tagpanel', function() {
            $('#metro-tagpanel').click();
            cb = $('#checkboxes').find('input[type=checkbox]');
            var on = metroOptions.getOption("tagPanel").charAt(0) === "0";
            $.each(cb, function() {
              $(this).attr('disabled', on);
            });
          }).on('change', '#checkboxes label', function() {
            i = $(this).data('i');
            $l = metroOptions.getOption("tagPanel");
            b = +$(this).children('input').eq(0).is(':checked');
            $n = $l.replaceAt(i, b);
            metroOptions.setOption('tagPanel', $n);
            tagPanel.update();
          });
        }
      });
    };
   /**
    * @description Reload the tag
    * @memberof Nerdz#metroOption
    * @function
    * @param {Event} e - Default Event
    * @param {HTMLEvent} textarea - Textarea that will contain the link to the uploaded image
    */
    this.imgupload = function(e, t) {
      var btn = $('#img_ul_btn');
      if(!btn.length) return;
      btn.html(N.getLangData().LOADING);
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
          t.insertAtCaret('[img]' + result.data.link.replace('http:', 'https:') + '[/img]');
          btn.html('<i class="icon-upload"></i>');
          $('#img_ul_file').val('').hide(200);
        },
        error: function(result) {
          $('#img_ul_btn').html(result);
        }
      });
    };
  };
  
  var tagPanel = this.tagPanel = new __tagPanel();
	/**
	 * @function
	 * @returns bool
	 * @description Returns true if the browser is mobile
	 */
  this.mobile = function(a){
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
  }(navigator.userAgent || navigator.vendor || window.opera);
  /**
   * @description Generates preview's Dialog
   * @function
   */
	this.Preview = function(a) {
		var me=$(a),
				preview=me.val(),
				refto = me.data("refto"),
				txtarea = $(refto);
		txtarea.val(txtarea.val() + ' ');
		var txt = txtarea.val().tag().autoLink();
		txtarea.val($.trim(txtarea.val()));
		if (undefined !== txt && $.trim(txt) !== '') {
			me.attr("disabled",true).val(N.getLangData().LOADING);
			$.Dialog({
				shadow: true,
				overlay: true,
				flat: true,
				icon: '<span class="icon-checkmark"></span>',
				title: 'Preview',
				width: "60%",
				padding: 10,
				content: '',
				onShow: function(_dialog){
					var content = _dialog.children('.content').css({maxHeight:$(window).height()-60, overflow: "auto"});
					content.loading().load('/preview.php?message=' + encodeURIComponent(txt) + ' #center_col', function() {
						$.Dialog.autoResize();
					});
				},
				onClose: function() {
					me.val(preview).attr("disabled", false);
				}
			});
		}
	};
	/**
	 * @description Correctly formats comments' permalinks	
	 * @function
	 * @param {HTMLElement} a - The Comment
	 */
  this.Permalink = function(a) {
    var me = $(a),
        postid = me.data("refto"),
        refto = $("#"+postid);
    if(!refto.length) 
      return;
    var href = refto.find("a.post").attr("href") || location.pathname;
      href += me.attr("href");
    me.attr("href", href);
    return false;
  };
  /**
   * @description Handles logout
   * @function
   * @param {MouseEvent} e - Original Event
   */
  this.logout = function(e) {
    e.preventDefault();
    var t = $('#welcome');
    N.json.logout({
      tok: $(this).data('tok')
    }, function(r) {
      var tmp = t.html();
      if (r.status === 'ok') {
        t.html(r.message);
        setTimeout(function() {
          document.location.href = '/';
        }, 1500);
      } else {
        t.html('<h2>' + r.message + '</h2>');
        setTimeout(function() {
          t.html(tmp);
        }, 1500);
      }
    });
  };
  /**
   * @description Initialize (un)follow, (un)blacklist and profilepm buttons on a selected area
   * @function
   * @param {HTMLElement} obj - The area to initialize
   */
  this.initButtons = function(obj) {
    if(obj.hasClass("parsed")) return;
    var plist = obj.find("#postlist").length?obj.find("#postlist"):obj.children("div").last();
    return obj.addClass("parsed").on("click","#follow", function() {
      var me = $(this).html("...");
      N.json[plist.data("type")].follow({
        id: $(this).data('id')
      }, function(d) {
        me.html(N.getLangData().UNFOLLOW).attr("id","unfollow");
      });
    }).on("click","#unfollow", function() {
      var me = $(this).html('...');
      N.json[plist.data("type")].unfollow({
        id: $(this).data('id')
      }, function(d) {
        me.html(N.getLangData().FOLLOW).attr("id","follow");
      });
    }).on("click","#blacklist",function() {
      var me = $(this),
          oldPlist = plist.html();
      plist.html("");
      obj.find("#fast_nerdz").hide();
      $("<form>").html(N.getLangData().MOTIVATION + ': <textarea style="width:100%; height:60px" id="blmot"></textarea><br /><input type="submit" class="place-right" value="Blacklist" /><input type="button" class="cancel" value="' + N.getLangData().CANCEL + '" />')
                  .on("submit", function(e) {
                    e.preventDefault();
                    N.json.profile.blacklist({
                      id: me.data('id'),
                      motivation: $('#blmot').val()
                    }, function(d) {
                      me.html(d.message);
                      plist.html(d.message);
                      me.html("Unblacklist").attr("id","unblacklist");
                    });
                  }).on('click', '.cancel', function() {
                    me.html('Blacklist');
                    plist.html(oldPlist);
                    obj.find('#fast_nerdz').show();
                  }).appendTo(plist);
    }).on("click","#unblacklist",function() {
      var me = $(this).html('...');
      N.json.profile.unblacklist({
        id: me.data('id')
      }, function(d) {
        me.html("Blacklist").attr("id","blacklist");
        $.Nerdz.loadPosts({type:"profile",id:me.data("id"),location:"profile"});
      });
    }).on("click", "#profilepm", function() {
      var btn = $(this);
      var selConv =  function(_dialog) {
        var id = btn.data("id"),
            conv = _dialog.find(".conversation[data-from="+id+"]");
        if(conv.length) return conv.click();
        _dialog.find(".new").data("username",btn.data("username")).click();
      };
      
      if($(".window.pmwindow").length) {
        return selConv($(".window.pmwindow"));
      }
      $.Nerdz.pm.loadWindow(true, selConv);
    });
  }
  /**
   * @description Handles notifications
   */
  var Notify = this.notify = function(options) {
		if(metroOptions.getOption("desktopNotify")) {
			var n = new Notification($("<span>").html(options.content).text(), { icon: options.icon });
			n.onshow = function() {
				self = this;
				setTimeout(function() {self.close();}, options.timeout);
			}
			n.onclick = function() {
				if($.isFunction(options.onClick))
					 options.onClick();
					 this.close();
			}
		}
		else
			$.Notify({
				content: options.content,
				icon: options.icon,
				onClick: function() {
					options.onClick();
					this.close();
				}
			});
		$('#notifyaudio')[0].play();
	}
  var __construct = function(t) {
    $(document).ready(function() {
      if(t.mobile) {
        $('<link>').attr('rel', 'stylesheet').attr('href', '/tpl/2/css/mobile.css').appendTo($('head'));
        $('<script>').attr('type', 'text/javascript').attr('src', '/tpl/2/js/mobile.js').appendTo($('head'));
      } else {
        t.tagPanel.load();
        $("#frmtxt").autogrow();
      }
      $("<br/>").appendTo($("body"));
      $('iframe').attr('scrolling', 'no');
      var append_theme = '';
      if (!t.metroOptions.getOption('codeLight')) {
        append_theme = '?skin=sons-of-obsidian';
        $('body').addClass('has-dark-theme');
      }
      $('<script>').attr('type', 'text/javascript').attr('src', 'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/run_prettify.js' + append_theme).appendTo($("head"));
      if ($.inArray(location.pathname, [
        '/bbcode.php',
        '/terms.php',
        '/faq.php',
        '/stats.php',
        '/rank.php',
        '/preferences.php',
        '/informations.php',
        '/preview.php'
      ]) !== -1) $('#footersearch').remove();
      else 
				$('#footersearch').on('submit', function(e) {
					e.preventDefault();
					t.Search();
				});
      $("#logout").click(t.logout);
      t.title = document.title;
			var $color = $("#color-switcher .selected .icon-record").css("color");
			$('#main').on('click', ".preview", function() {
				t.Preview(this);
			}).children().append("<br/><br/>");
			
			$('#ncounter').on('click', function(e) {
				e.preventDefault();
				var list = $('#notify_list'),
					old = $(this).html();
				var nold = parseInt(old);
				list.toggle(200).html(N.getLangData().LOADING);
				N.html.getNotifications(function(d) {
					list.html(d);
					updateTitle();
				});
				$(this).html(isNaN(nold) ? old : '0').css("color",$color);
			});
			$('#gotopm').on('click', function(e) {
				e.preventDefault();
				var pmc = $('#pcounter');
				if($.Nerdz.mobile || (e.ctrlKey && location.pathname !== "/pm.php")) {
					location.href = "/pm.php"+(pmc.html() !== '0'?"#new":"");
					return;
				}
				if(location.pathname === "/pm.php") {
					if(pmc.html() !== '0') location.hash = "#new";
					return location.reload();
				}
				return t.pm.loadWindow(false, function() { 
					updateTitle(); 
					if(pmc.html()==="0")
						pmc.css("color",$color);
				});
			});
			
			if("Notification" in window && Notification.permission!=="granted" && t.metroOptions.getOption("notify") && t.metroOptions.getOption("desktopNotifyNotify")) {
				$.Dialog({
					icon: '<i class="icon-warning"></i>',
					title: 'Desktop Notifications Permissions',
					content: "look out! it seems you have activated desktop notifications, but i don't actually have permissions to access them. please reset your browser's permissions, then click the \"{0}\" button and grant permissions. If you don't want to receive Desktop Notifications click the \"{1}\" button".format("Ask for Permissions","Don't show again"), //N.getLangData().WRONGDNPERMS.format(N.getLangData().ASKDNPERMS, N.getLangData().DENYDNPERMS
					padding: 10,
					onShow: function(_dialog) {
						var content = _dialog.width(500).find(".content").eq(0).append("<br/><br/>");
						$("<button>").html("Ask for Permissions").click(function() {
							if(Notification.permission!=="default") 
								return alert("You should reset notifications' preferences first!");
							Notification.requestPermission(function(e){
								if(e==="granted") t.metroOptions.setOption("desktopNotify", true);
								else if(e==="denied") t.metroOptions.setOption("desktopNotify", false);
							});
							$.Dialog.close(_dialog.data("_uuid"));
						}).appendTo(content);
						$("<button>").css("margin-left",10).html("Don't show again").click(function() {
							t.metroOptions.setOption("desktopNotify", false);
							$.Dialog.close(_dialog.data("_uuid")); 
						}).appendTo(content);
					}
				});
			}
			
			var curnot = sessionStorage.getItem('curnot') ? parseInt(sessionStorage.getItem('curnot')) : 0,
					curpms = sessionStorage.getItem('curpms') ? parseInt(sessionStorage.getItem('curpms')) : 0;
			var notify = function() {
				var nc = $('#ncounter'), pc = $("#pcounter");
				N.json.post('/pages/profile/notify.json.php',{}, function(obj) {
					var nw, not = obj.status === 'ok' ? parseInt(obj.message) : 0;
					nc.html(not).css("color", not===0?$color:'#FF0000');
					if (not > curnot && t.metroOptions.getOption('notify')) {
						nw = not-curnot;
						if(nw===1) 
							N.html.getNotifications(function(d) {
								Notify({
									content:'<b class="pointer">'+$("<div/>").html(d).find("li").eq(0).text()+'<b>', 
									icon: "/static/images/droidico.png",
									onClick: function() {
										var url = $("<div/>").html(d).find("a").attr("href");
										$("<a>").addClass("notref").attr("href", url).appendTo($("#main")).click();
									},
									timeout: 5000
								});
							}, true);
						else 
							Notify({
								content: N.getLangData().NEW_NOTIFICATIONS.format(nw), 
								icon: "/static/images/droidico.png", 
								onClick: function() {
									$("#ncounter").click();
								},
								timeout: 5000
							});
					}
					curnot = not;
					sessionStorage.setItem('curnot', not);
					updateTitle();
				});
				N.json.post('/pages/pm/notify.json.php',{}, function(obj) {
					var pms = obj.status === 'ok' ? parseInt(obj.message) : 0;
					pc.html(pms).css("color", pms===0?$color:'#FF0000');
					if (pms > curpms && t.metroOptions.getOption('notify')) {
						nw = pms-curpms;
						Notify({
							content: '<a href="#">' + (nw === 1 ? N.getLangData().NEW_MESSAGE : N.getLangData().NEW_MESSAGES.format(nw)) + '!</a>',
							onClick: function() {
								$('#gotopm').click();
							},
							icon: "/static/images/droidico.png",
							timeout: 5000
						});
					}
					curpms = pms;
					sessionStorage.setItem('curpms', pms);
					updateTitle();
				});
			};
			
			var updateTitle = function() {
				var title = t.title;
				if(parseInt($("#ncounter").text())>0) title = "("+$("#ncounter").text()+") "+title;
				if(parseInt($("#pcounter").text())>0) title = "["+$("#pcounter").text()+"] "+title;
				document.title = title;
			};
			
			notify();
			window.setInterval(notify, 10000);
			
			/** back to top **/
			$("#totop").click(function(e) {
				e.preventDefault();
				$(window).scrollTo(0, 1000);
				$(this).fadeOut(500);
			});

    });
  }(this);
};

$.Nerdz = new Nerdz();
var scroll_timer, displayed=false;
$(window).on("scroll", function() {
  window.clearTimeout(scroll_timer);
  window.setTimeout(function() {
      if ($(window).scrollTop() <= 700) {
        displayed = false;
        $('#totop').fadeOut(500);
      } else if (displayed === false) {
        displayed = true;
        $('#totop').stop(true, true).fadeIn();
      }
    }, 100);
});
