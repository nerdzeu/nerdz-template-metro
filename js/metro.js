var METRO_AUTO_REINIT, METRO_LOCALE, METRO_WEEK_START, METRO_DIALOG = false;
(function(c) {
  c.Metro = function(a) {
    c.extend({}, a);
  };
  c.Metro.getDeviceSize = function() {
    return {
      width: 0 < window.innerWidth ? window.innerWidth : screen.width,
      height: 0 < window.innerHeight ? window.innerHeight : screen.height
    };
  };
}(jQuery));
$(function() {
  $('html').on('click', function(c) {
    $('.dropdown-menu').each(function(a, b) {
      $(b).hasClass('keep-open') || 'block' != $(b).css('display') || $(b).hide();
    });
  });
});
$(function() {
  $(window).on('resize', function() {
    if (METRO_DIALOG) {
      var c = ($(window).height() - METRO_DIALOG.outerHeight()) / 2,
        a = ($(window).width() - METRO_DIALOG.outerWidth()) / 2;
      METRO_DIALOG.css({
        top: c,
        left: a
      });
    }
  });
});
(function(c) {
  c.Metro.currentLocale = 'en';
  c.Metro.currentLocale = void 0 != METRO_LOCALE ? METRO_LOCALE : 'en';
  c.Metro.Locale = {
    en: {
      months: 'January February March April May June July August September October November December Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
      days: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Su Mo Tu We Th Fr Sa'.split(' '),
      buttons: 'Today Clear Cancel Help Prior Next Finish'.split(' ')
    },
    fr: {
      months: 'Janvier F\xe9vrier Mars Avril Peut Juin Juillet Ao\xfbt Septembre Octobre Novembre D\xe9cembre Jan F\xe9v Mar Avr Peu Jun Jul Ao\xfb Sep Oct Nov D\xe9c'.split(' '),
      days: 'Sunday Lundi Mardi Mercredi Jeudi Vendredi Samedi Sn Ln Md Mc Ju Vn Sm'.split(' '),
      buttons: 'Aujourd Effacer Cancel Help Prior Next Finish'.split(' ')
    },
    ua: {
      months: '\u0421\u0456\u0447\u0435\u043d\u044c \u041b\u044e\u0442\u0438\u0439 \u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c \u041a\u0432\u0456\u0442\u0435\u043d\u044c \u0422\u0440\u0430\u0432\u0435\u043d\u044c \u0427\u0435\u0440\u0432\u0435\u043d\u044c \u041b\u0438\u043f\u0435\u043d\u044c \u0421\u0435\u0440\u043f\u0435\u043d\u044c \u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c \u0416\u043e\u0432\u0442\u0435\u043d\u044c \u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434 \u0413\u0440\u0443\u0434\u0435\u043d\u044c \u0421\u0456\u0447 \u041b\u044e\u0442 \u0411\u0435\u0440 \u041a\u0432\u0456 \u0422\u0440\u0430 \u0427\u0435\u0440 \u041b\u0438\u043f \u0421\u0435\u0440 \u0412\u0435\u0440 \u0416\u043e\u0432 \u041b\u0438\u0441 \u0413\u0440\u0443'.split(' '),
      days: '\u041d\u0435\u0434\u0456\u043b\u044f \u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0421\u0435\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440 \u041f\u2019\u044f\u0442\u043d\u0438\u0446\u044f \u0421\u0443\u0431\u043e\u0442\u0430 \u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431'.split(' '),
      buttons: '\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456 \u041e\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438 \u0414\u043e\u043f\u043e\u043c\u043e\u0433\u0430 \u041d\u0430\u0437\u0430\u0434 \u0412\u043f\u0435\u0440\u0435\u0434 \u0413\u043e\u0442\u043e\u0432\u043e'.split(' ')
    },
    ru: {
      months: '\u042f\u043d\u0432\u0430\u0440\u044c \u0424\u0435\u0432\u0440\u0430\u043b\u044c \u041c\u0430\u0440\u0442 \u0410\u043f\u0440\u0435\u043b\u044c \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433\u0443\u0441\u0442 \u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u041e\u043a\u0442\u044f\u0431\u0440\u044c \u041d\u043e\u044f\u0431\u0440\u044c \u0414\u0435\u043a\u0430\u0431\u0440\u044c \u042f\u043d\u0432 \u0424\u0435\u0432 \u041c\u0430\u0440 \u0410\u043f\u0440 \u041c\u0430\u0439 \u0418\u044e\u043d \u0418\u044e\u043b \u0410\u0432\u0433 \u0421\u0435\u043d \u041e\u043a\u0442 \u041d\u043e\u044f \u0414\u0435\u043a'.split(' '),
      days: '\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0412\u0442\u043e\u0440\u043d\u0438\u043a \u0421\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440\u0433 \u041f\u044f\u0442\u043d\u0438\u0446\u0430 \u0421\u0443\u0431\u0431\u043e\u0442\u0430 \u0412\u0441 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431'.split(' '),
      buttons: '\u0421\u0435\u0433\u043e\u0434\u043d\u044f \u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u041f\u043e\u043c\u043e\u0449\u044c \u041d\u0430\u0437\u0430\u0434 \u0412\u043f\u0435\u0440\u0435\u0434 \u0413\u043e\u0442\u043e\u0432\u043e'.split(' ')
    },
    zhCN: {
      months: '\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708 \u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708'.split(' '),
      days: '\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d \u65e5 \u4e00 \u4e8c \u4e09 \u56db \u4e94 \u516d'.split(' '),
      buttons: '\u4eca\u65e5 \u6e05\u9664 Cancel Help Prior Next Finish'.split(' ')
    },
    it: {
      months: 'Gennaio;Febbraio;Marzo;Aprile;Maggio;Giugno;Luglio;Agosto;Settembre;Ottobre;Novembre;Dicembre;Gen; Feb;Mar;Apr;Mag;Giu;Lug;Ago;Set;Ott;Nov;Dic'.split(';'),
      days: 'Luned\xec Marted\xec Mercoled\xec Gioved\xec Venerd\xec Sabato Domenica Lun Mar Mer Gio Ven Sab Dom'.split(' '),
      buttons: 'Oggi Cancella Cancel Help Prior Next Finish'.split(' ')
    },
    de: {
      months: 'Januar Februar M\xe4rz April Mai Juni Juli August September Oktober November Dezember Jan Feb Mrz Apr Mai Jun Jul Aug Sep Okt Nov Dez'.split(' '),
      days: 'Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag So Mo Di Mi Do Fr Sa'.split(' '),
      buttons: 'Heute Zur\xfccksetzen Abbrechen Hilfe Fr\xfcher Sp\xe4ter Fertig'.split(' ')
    },
    es: {
      months: 'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre Ene Feb Mar Abr May Jun Jul Ago Sept Oct Nov Dic'.split(' '),
      days: 'Domingo Lunes Martes Mi\xe9rcoles Jueves Viernes S\xe1bado Do Lu Mar Mi\xe9 Jue Vi S\xe1b'.split(' '),
      buttons: 'Hoy Limpiar Cancel Help Prior Next Finish'.split(' ')
    }
  };
  c.Metro.setLocale = function(a, b) {
    c.Metro.Locale[a] = b;
  };
}(jQuery));
var hasTouch = 'ontouchend' in window,
  eventTimer, moveDirection = 'undefined',
  startX, startY, deltaX, deltaY, mouseDown = false;

function addTouchEvents(c) {
  hasTouch && (c.addEventListener('touchstart', touch2Mouse, true), c.addEventListener('touchmove', touch2Mouse, true), c.addEventListener('touchend', touch2Mouse, true));
}

function touch2Mouse(c) {
  var a = c.changedTouches[0],
    b;
  switch (c.type) {
    case 'touchstart':
      b = 'mousedown';
      break;
    case 'touchend':
      b = 'mouseup';
      break;
    case 'touchmove':
      b = 'mousemove';
      break;
    default:
      return;
  }
  'mousedown' == b && (eventTimer = new Date().getTime(), startX = a.clientX, startY = a.clientY, mouseDown = true);
  'mouseup' == b && (500 >= new Date().getTime() - eventTimer ? b = 'click' : 1000 < new Date().getTime() - eventTimer && (b = 'longclick'), eventTimer = 0, mouseDown = false);
  'mousemove' == b && mouseDown && (deltaX = a.clientX - startX, deltaY = a.clientY - startY, moveDirection = deltaX > deltaY ? 'horizontal' : 'vertical');
  var d = document.createEvent('MouseEvent');
  d.initMouseEvent(b, true, true, window, 1, a.screenX, a.screenY, a.clientX, a.clientY, false, false, false, false, 0, null);
  a.target.dispatchEvent(d);
  c.preventDefault();
}
var dateFormat = function() {
  var c = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    a = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    b = /[^-+\dA-Z]/g,
    d = function(a, b) {
      a = String(a);
      for (b = b || 2; a.length < b;)
        a = '0' + a;
      return a;
    };
  return function(e, f, g) {
    var h = dateFormat;
    1 != arguments.length || ('[object String]' != Object.prototype.toString.call(e) || /\d/.test(e)) || (f = e, e = void 0);
    e = e ? new Date(e) : new Date();
    f = String(h.masks[f] || f || h.masks['default']);
    'UTC:' == f.slice(0, 4) && (f = f.slice(4), g = true);
    locale = $.Metro.currentLocale;
    var k = g ? 'getUTC' : 'get',
      h = e[k + 'Date'](),
      l = e[k + 'Day'](),
      n = e[k + 'Month'](),
      p = e[k + 'FullYear'](),
      m = e[k + 'Hours'](),
      q = e[k + 'Minutes'](),
      u = e[k + 'Seconds'](),
      k = e[k + 'Milliseconds'](),
      r = g ? 0 : e.getTimezoneOffset(),
      s = {
        d: h,
        dd: d(h),
        ddd: $.Metro.Locale[locale].days[l],
        dddd: $.Metro.Locale[locale].days[l + 7],
        m: n + 1,
        mm: d(n + 1),
        mmm: $.Metro.Locale[locale].months[n],
        mmmm: $.Metro.Locale[locale].months[n + 12],
        yy: String(p).slice(2),
        yyyy: p,
        h: m % 12 || 12,
        hh: d(m % 12 || 12),
        H: m,
        HH: d(m),
        M: q,
        MM: d(q),
        s: u,
        ss: d(u),
        l: d(k, 3),
        L: d(99 < k ? Math.round(k / 10) : k),
        t: 12 > m ? 'a' : 'p',
        tt: 12 > m ? 'am' : 'pm',
        T: 12 > m ? 'A' : 'P',
        TT: 12 > m ? 'AM' : 'PM',
        Z: g ? 'UTC' : (String(e).match(a) || ['']).pop().replace(b, ''),
        o: (0 < r ? '-' : '+') + d(100 * Math.floor(Math.abs(r) / 60) + Math.abs(r) % 60, 4),
        S: [
          'th',
          'st',
          'nd',
          'rd'
        ][3 < h % 10 ? 0 : (10 != h % 100 - h % 10) * h % 10]
      };
    return f.replace(c, function(a) {
      return a in s ? s[a] : a.slice(1, a.length - 1);
    });
  };
}();
dateFormat.masks = {
  'default': 'ddd mmm dd yyyy HH:MM:ss',
  shortDate: 'm/d/yy',
  mediumDate: 'mmm d, yyyy',
  longDate: 'mmmm d, yyyy',
  fullDate: 'dddd, mmmm d, yyyy',
  shortTime: 'h:MM TT',
  mediumTime: 'h:MM:ss TT',
  longTime: 'h:MM:ss TT Z',
  isoDate: 'yyyy-mm-dd',
  isoTime: 'HH:MM:ss',
  isoDateTime: 'yyyy-mm-dd\'T\'HH:MM:ss',
  isoUtcDateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\''
};
dateFormat.i18n = {
  dayNames: 'Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
  monthNames: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December'.split(' ')
};
Date.prototype.format = function(c, a) {
  return dateFormat(this, c, a);
};
(function(c) {
  c.widget('metro.calendar', {
    version: '1.0.0',
    options: {
      format: 'yyyy-mm-dd',
      multiSelect: false,
      startMode: 'day',
      weekStart: void 0 != METRO_WEEK_START ? METRO_WEEK_START : 0,
      otherDays: false,
      date: new Date(),
      buttons: true,
      locale: c.Metro.currentLocale,
      getDates: function(a) {},
      click: function(a, b) {},
      _storage: []
    },
    _year: 0,
    _month: 0,
    _day: 0,
    _today: new Date(),
    _event: '',
    _mode: 'day',
    _distance: 0,
    _events: [],
    _create: function() {
      var a = this.element;
      void 0 != a.data('multiSelect') && (this.options.multiSelect = a.data('multiSelect'));
      void 0 != a.data('format') && (this.options.format = a.data('format'));
      void 0 != a.data('date') && (this.options.date = new Date(a.data('date')));
      void 0 != a.data('locale') && (this.options.locale = a.data('locale'));
      void 0 != a.data('startMode') && (this.options.startMode = a.data('startMode'));
      void 0 != a.data('weekStart') && (this.options.weekStart = a.data('weekStart'));
      void 0 != a.data('otherDays') && (this.options.otherDays = a.data('otherDays'));
      this._year = this.options.date.getFullYear();
      this._distance = parseInt(this.options.date.getFullYear()) - 4;
      this._month = this.options.date.getMonth();
      this._day = this.options.date.getDate();
      this._mode = this.options.startMode;
      a.data('_storage', []);
      this._renderCalendar();
    },
    _renderMonth: function() {
      var a = this._year,
        b = this._month,
        d = 28;
      1 == b && (0 != a % 100 && 0 == a % 4 || 0 == a % 400) && (d = 29);
      var e = [
        '31',
        '' + d + '',
        '31',
        '30',
        '31',
        '30',
        '31',
        '31',
        '30',
        '31',
        '30',
        '31'
      ],
        f = e[b],
        g = new Date(a, b, 1).getDay(),
        h, k;
      this.element.html('');
      d = c('<table/>').addClass('bordered');
      h = c('<tr/>');
      c('<td/>').addClass('text-center').html('<a class=\'btn-previous-year\' href=\'#\'><i class=\'icon-previous\'></i></a>').appendTo(h);
      c('<td/>').addClass('text-center').html('<a class=\'btn-previous-month\' href=\'#\'><i class=\'icon-arrow-left-4\'></i></a>').appendTo(h);
      c('<td/>').attr('colspan', 3).addClass('text-center').html('<a class=\'btn-select-month\' href=\'#\'>' + c.Metro.Locale[this.options.locale].months[b] + ' ' + a + '</a>').appendTo(h);
      c('<td/>').addClass('text-center').html('<a class=\'btn-next-month\' href=\'#\'><i class=\'icon-arrow-right-4\'></i></a>').appendTo(h);
      c('<td/>').addClass('text-center').html('<a class=\'btn-next-year\' href=\'#\'><i class=\'icon-next\'></i></a>').appendTo(h);
      h.addClass('calendar-header').appendTo(d);
      var l;
      h = c('<tr/>');
      for (k = 0; 7 > k; k++)
        this.options.weekStart ? (l = k + 1, 7 == l && (l = 0), c('<td/>').addClass('text-center day-of-week').html(c.Metro.Locale[this.options.locale].days[l + 7]).appendTo(h)) : c('<td/>').addClass('text-center day-of-week').html(c.Metro.Locale[this.options.locale].days[k + 7]).appendTo(h);
      h.addClass('calendar-subheader').appendTo(d);
      h = this._month - 1;
      0 > h && (h = 11);
      e = e[h];
      l = (this.options.weekStart ? g + 6 : g) % 7;
      var n = '';
      h = c('<tr/>');
      for (k = 0; k < l; k++)
        this.options.otherDays && (n = e - (l - k - 1)), c('<td/>').addClass('empty').html('<small class=\'other-day\'>' + n + '</small>').appendTo(h);
      g = (this.options.weekStart ? g + 6 : g) % 7;
      for (k = 1; k <= f; k++)
        g %= 7, 0 == g && (h.appendTo(d), h = c('<tr/>')), e = c('<td/>').addClass('text-center day').html('<a href=\'#\'>' + k + '</a>'), a == this._today.getFullYear() && (b == this._today.getMonth() && this._today.getDate() == k) && e.addClass('today'), l = new Date(this._year, this._month, k).format('yyyy-mm-dd'), 0 <= this.element.data('_storage').indexOf(l) && e.find('a').addClass('selected'), e.appendTo(h), g++;
      a = '';
      for (k = g + 1; 7 >= k; k++)
        this.options.otherDays && (a = k - g), c('<td/>').addClass('empty').html('<small class=\'other-day\'>' + a + '</small>').appendTo(h);
      h.appendTo(d);
      this.options.buttons && (h = c('<tr/>').addClass('calendar-actions'), e = c('<td/>').attr('colspan', 7).addClass('text-left').html('<button class=\'button calendar-btn-today small success\'>' + c.Metro.Locale[this.options.locale].buttons[0] + '</button>&nbsp;<button class=\'button calendar-btn-clear small warning\'>' + c.Metro.Locale[this.options.locale].buttons[1] + '</button>'), e.appendTo(h), h.appendTo(d));
      d.appendTo(this.element);
      this.options.getDates(this.element.data('_storage'));
    },
    _renderMonths: function() {
      var a, b, d, e, f;
      this.element.html('');
      a = c('<table/>').addClass('bordered');
      b = c('<tr/>');
      c('<td/>').addClass('text-center').html('<a class=\'btn-previous-year\' href=\'#\'><i class=\'icon-arrow-left-4\'></i></a>').appendTo(b);
      c('<td/>').attr('colspan', 2).addClass('text-center').html('<a class=\'btn-select-year\' href=\'#\'>' + this._year + '</a>').appendTo(b);
      c('<td/>').addClass('text-center').html('<a class=\'btn-next-year\' href=\'#\'><i class=\'icon-arrow-right-4\'></i></a>').appendTo(b);
      b.addClass('calendar-header').appendTo(a);
      b = c('<tr/>');
      for (e = f = 0; 12 > e; e++)
        d = c('<td/>').addClass('text-center month').html('<a href=\'#\' data-month=\'' + e + '\'>' + c.Metro.Locale[this.options.locale].months[e + 12] + '</a>'), this._month == e && new Date().getFullYear() == this._year && d.addClass('today'), d.appendTo(b), 0 == (f + 1) % 4 && (b.appendTo(a), b = c('<tr/>')), f += 1;
      a.appendTo(this.element);
    },
    _renderYears: function() {
      var a, b, d, e, f;
      this.element.html('');
      a = c('<table/>').addClass('bordered');
      b = c('<tr/>');
      c('<td/>').addClass('text-center').html('<a class=\'btn-previous-year\' href=\'#\'><i class=\'icon-arrow-left-4\'></i></a>').appendTo(b);
      c('<td/>').attr('colspan', 2).addClass('text-center').html(this._distance + '-' + (this._distance + 11)).appendTo(b);
      c('<td/>').addClass('text-center').html('<a class=\'btn-next-year\' href=\'#\'><i class=\'icon-arrow-right-4\'></i></a>').appendTo(b);
      b.addClass('calendar-header').appendTo(a);
      b = c('<tr/>');
      f = 0;
      for (e = this._distance; e < this._distance + 12; e++)
        d = c('<td/>').addClass('text-center year').html('<a href=\'#\' data-year=\'' + e + '\'>' + e + '</a>'), new Date().getFullYear() == e && d.addClass('today'), d.appendTo(b), 0 == (f + 1) % 4 && (b.appendTo(a), b = c('<tr/>')), f += 1;
      a.appendTo(this.element);
    },
    _renderCalendar: function() {
      switch (this._mode) {
        case 'year':
          this._renderYears();
          break;
        case 'month':
          this._renderMonths();
          break;
        default:
          this._renderMonth();
      }
      this._initButtons();
    },
    _initButtons: function() {
      var a = this,
        b = this.element.find('table');
      'day' == this._mode ? (b.find('.btn-select-month').on('click', function(b) {
        b.preventDefault();
        b.stopPropagation();
        a._mode = 'month';
        a._renderCalendar();
      }), b.find('.btn-previous-month').on('click', function(b) {
        a._event = 'eventPrevious';
        b.preventDefault();
        b.stopPropagation();
        a._month -= 1;
        0 > a._month && (a._year -= 1, a._month = 11);
        a._renderCalendar();
      }), b.find('.btn-next-month').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a._month += 1;
        12 == a._month && (a._year += 1, a._month = 0);
        a._renderCalendar();
      }), b.find('.btn-previous-year').on('click', function(b) {
        a._event = 'eventPrevious';
        b.preventDefault();
        b.stopPropagation();
        a._year -= 1;
        a._renderCalendar();
      }), b.find('.btn-next-year').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a._year += 1;
        a._renderCalendar();
      }), b.find('.calendar-btn-today').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a.options.date = new Date();
        a._year = a.options.date.getFullYear();
        a._month = a.options.date.getMonth();
        a._day = a.options.date.getDate();
        a._renderCalendar();
      }), b.find('.calendar-btn-clear').on('click', function(b) {
        b.preventDefault();
        b.stopPropagation();
        a.options.date = new Date();
        a._year = a.options.date.getFullYear();
        a._month = a.options.date.getMonth();
        a._day = a.options.date.getDate();
        a.element.data('_storage', []);
        a._renderCalendar();
      }), b.find('.day a').on('click', function(d) {
        d.preventDefault();
        d.stopPropagation();
        d = new Date(a._year, a._month, parseInt(c(this).html())).format(a.options.format, null);
        var e = new Date(a._year, a._month, parseInt(c(this).html()));
        a.options.multiSelect ? (c(this).toggleClass('selected'), c(this).hasClass('selected') ? a._addDate(d) : a._removeDate(d)) : (b.find('.day a').removeClass('selected'), c(this).addClass('selected'), a.element.data('_storage', []), a._addDate(d));
        a.options.getDates(a.element.data('_storage'));
        a.options.click(d, e);
      })) : 'month' == this._mode ? (b.find('.month a').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a._month = parseInt(c(this).data('month'));
        a._mode = 'day';
        a._renderCalendar();
      }), b.find('.btn-previous-year').on('click', function(b) {
        a._event = 'eventPrevious';
        b.preventDefault();
        b.stopPropagation();
        a._year -= 1;
        a._renderCalendar();
      }), b.find('.btn-next-year').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a._year += 1;
        a._renderCalendar();
      }), b.find('.btn-select-year').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a._mode = 'year';
        a._renderCalendar();
      })) : (b.find('.year a').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a._year = parseInt(c(this).data('year'));
        a._mode = 'month';
        a._renderCalendar();
      }), b.find('.btn-previous-year').on('click', function(b) {
        a._event = 'eventPrevious';
        b.preventDefault();
        b.stopPropagation();
        a._distance -= 10;
        a._renderCalendar();
      }), b.find('.btn-next-year').on('click', function(b) {
        a._event = 'eventNext';
        b.preventDefault();
        b.stopPropagation();
        a._distance += 10;
        a._renderCalendar();
      }));
    },
    _addDate: function(a) {
      0 > this.element.data('_storage').indexOf(a) && this.element.data('_storage').push(a);
    },
    _removeDate: function(a) {
      a = this.element.data('_storage').indexOf(a);
      this.element.data('_storage').splice(a, 1);
    },
    setDate: function(a) {
      a = new Date(a);
      a = new Date(a.getFullYear() + '/' + (a.getMonth() + 1) + '/' + a.getDate()).format('yyyy-mm-dd');
      this._addDate(a);
      this._renderCalendar();
    },
    getDate: function(a) {
      return new Date(void 0 != a ? this.element.data('_storage')[a] : this.element.data('_storage')[0]).format(this.options.format);
    },
    getDates: function() {
      return this.element.data('_storage');
    },
    unsetDate: function(a) {
      a = new Date(a);
      a = new Date(a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate()).format('yyyy-mm-dd');
      this._removeDate(a);
      this._renderCalendar();
    },
    _destroy: function() {},
    _setOption: function(a, b) {
      this._super('_setOption', a, b);
    }
  });
}(jQuery));
(function(c) {
  c.widget('metro.datepicker', {
    version: '1.0.0',
    options: {
      format: 'dd.mm.yyyy',
      date: void 0,
      effect: 'none',
      position: 'bottom',
      locale: c.Metro.currentLocale,
      weekStart: void 0 != METRO_WEEK_START ? METRO_WEEK_START : 0,
      otherDays: false,
      selected: function(a, b) {},
      _calendar: void 0
    },
    _create: function() {
      var a = this,
        b = this.element,
        d = b.children('input'),
        e = b.children('button.btn-date');
      void 0 != b.data('date') && (this.options.date = b.data('date'));
      void 0 != b.data('format') && (this.options.format = b.data('format'));
      void 0 != b.data('effect') && (this.options.effect = b.data('effect'));
      void 0 != b.data('position') && (this.options.position = b.data('position'));
      void 0 != b.data('locale') && (this.options.locale = b.data('locale'));
      void 0 != b.data('weekStart') && (this.options.weekStart = b.data('weekStart'));
      void 0 != b.data('otherDays') && (this.options.otherDays = b.data('otherDays'));
      this._createCalendar(b, this.options.date);
      d.attr('readonly', true);
      e.on('click', function(b) {
        b.stopPropagation();
        'none' == a.options._calendar.css('display') ? a._show() : a._hide();
      });
      b.on('click', function(b) {
        b.stopPropagation();
        'none' == a.options._calendar.css('display') ? a._show() : a._hide();
      });
      c('html').on('click', function(a) {
        c('.calendar-dropdown').hide();
      });
    },
    _createCalendar: function(a, b) {
      var d, e = this;
      d = c('<div/>').css({
        position: 'absolute',
        display: 'none',
        'max-width': 260,
        'z-index': 1000
      }).addClass('calendar calendar-dropdown').appendTo(a);
      void 0 != e.options.date && d.data('date', e.options.date);
      d.calendar({
        multiSelect: false,
        format: e.options.format,
        buttons: false,
        locale: e.options.locale,
        otherDays: e.options.otherDays,
        weekStart: e.options.weekStart,
        click: function(b, c) {
          d.calendar('setDate', c);
          a.children('input[type=text]').val(b);
          e.options.selected(b, c);
          e._hide();
        }
      });
      void 0 != b && (d.calendar('setDate', b), a.children('input[type=text]').val(d.calendar('getDate')));
      switch (this.options.position) {
        case 'top':
          d.css({
            top: 0 - d.height(),
            left: 0
          });
          break;
        default:
          d.css({
            top: '100%',
            left: 0
          });
      }
      this.options._calendar = d;
    },
    _show: function() {
      'slide' == this.options.effect ? (c('.calendar-dropdown').slideUp('fast'), this.options._calendar.slideDown('fast')) : 'fade' == this.options.effect ? (c('.calendar-dropdown').fadeOut('fast'), this.options._calendar.fadeIn('fast')) : (c('.calendar-dropdown').hide(), this.options._calendar.show());
    },
    _hide: function() {
      'slide' == this.options.effect ? this.options._calendar.slideUp('fast') : 'fade' == this.options.effect ? this.options._calendar.fadeOut('fast') : this.options._calendar.hide();
    },
    _destroy: function() {},
    _setOption: function(a, b) {
      this._super('_setOption', a, b);
    }
  });
}(jQuery));
(function(c) {
  c.widget('metro.dropdown', {
    version: '1.0.1',
    options: {
      effect: 'slide',
      toggleElement: false
    },
    _create: function() {
      var a = this,
        b = this.element,
        d = this.name,
        e = this.element.parent(),
        e = this.options.toggleElement || e.children('.dropdown-toggle');
      void 0 != b.data('effect') && (this.options.effect = b.data('effect'));
      e.on('click.' + d, function(d) {
        d.preventDefault();
        d.stopPropagation();
        'block' != b.css('display') || b.hasClass('keep-open') ? (c('.dropdown-menu').each(function(d, e) {
          b.parents('.dropdown-menu').is(e) || (c(e).hasClass('keep-open') || 'block' != c(e).css('display')) || a._close(e);
        }), a._open(b)) : a._close(b);
      });
      c(b).find('li.disabled a').on('click', function(a) {
        a.preventDefault();
      });
    },
    _open: function(a) {
      switch (this.options.effect) {
        case 'fade':
          c(a).fadeIn('fast');
          break;
        case 'slide':
          c(a).slideDown('fast');
          break;
        default:
          c(a).hide();
      }
      this._trigger('onOpen', null, a);
    },
    _close: function(a) {
      switch (this.options.effect) {
        case 'fade':
          c(a).fadeOut('fast');
          break;
        case 'slide':
          c(a).slideUp('fast');
          break;
        default:
          c(a).hide();
      }
      this._trigger('onClose', null, a);
    },
    _destroy: function() {},
    _setOption: function(a, b) {
      this._super('_setOption', a, b);
    }
  });
}(jQuery));
(function(c) {
  c.widget('metro.inputControl', {
    version: '1.0.0',
    options: {},
    _create: function() {
      var a = this.element;
      a.hasClass('text') ? this.initTextInput(a, this) : a.hasClass('password') ? this.initPasswordInput(a, this) : a.hasClass('checkbox') || a.hasClass('radio') || a.hasClass('switch') ? this.initCheckboxInput(a, this) : a.hasClass('file') && this.initFileInput(a, this);
    },
    initCheckboxInput: function(a, b) {},
    initFileInput: function(a, b) {
      var d, e, f;
      f = c('<input type=\'text\' id=\'__input_file_wrapper__\' readonly style=\'z-index: 1; cursor: default;\'>');
      d = a.children('.btn-file');
      e = a.children('input[type="file"]');
      e.css('z-index', 0);
      f.insertAfter(e);
      e.attr('tabindex', '-1');
      d.attr('type', 'button');
      e.on('change', function() {
        var a = c(this).val();
        '' != a && f.val(a);
      });
      d.on('click', function() {
        e.trigger('click');
      });
    },
    initTextInput: function(a, b) {
      var d = a.children('.btn-clear'),
        e = a.children('input[type=text]');
      if (0 != d.length && (d.attr('tabindex', '-1'), d.attr('type', 'button'), d.on('click', function() {
        e = a.children('input');
        e.prop('readonly') || (e.val(''), e.focus(), b._trigger('onClear', null, a));
      }), !e.attr('disabled')))
        e.on('click', function() {
          c(this).focus();
        });
    },
    initPasswordInput: function(a, b) {
      var d = a.children('.btn-reveal'),
        e = a.children('input[type=password]');
      if (0 != d.length && (d.attr('tabindex', '-1'), d.attr('type', 'button'), d.on('mousedown', function(a) {
        e.attr('type', 'text');
      }), d.on('mouseup, mouseleave, blur', function(a) {
        e.attr('type', 'password').focus();
      }), !e.attr('disabled')))
        e.on('click', function() {
          c(this).focus();
        });
    },
    _destroy: function() {},
    _setOption: function(a, b) {
      this._super('_setOption', a, b);
    }
  });
}(jQuery));
(function(c) {
  c.widget('metro.inputTransform', {
    version: '1.0.0',
    options: {
      transformType: 'text'
    },
    _create: function() {
      var a = this.element,
        b;
      if (!a.parent().hasClass('input-control')) {
        b = a.get(0).tagName.toLowerCase();
        'textarea' == b ? this.options.transformType = 'textarea' : 'select' == b ? this.options.transformType = 'select' : void 0 != a.data('transformType') ? this.options.transformType = a.data('transformType') : this.options.transformType = a.attr('type');
        a = void 0;
        switch (this.options.transformType) {
          case 'password':
            a = this._createInputPassword();
            break;
          case 'file':
            a = this._createInputFile();
            break;
          case 'checkbox':
            a = this._createInputCheckbox();
            break;
          case 'radio':
            a = this._createInputRadio();
            break;
          case 'switch':
            a = this._createInputSwitch();
            break;
          case 'select':
            a = this._createInputSelect();
            break;
          case 'textarea':
            a = this._createInputTextarea();
            break;
          case 'search':
            a = this._createInputSearch();
            break;
          case 'email':
            a = this._createInputEmail();
            break;
          case 'tel':
            a = this._createInputTel();
            break;
          case 'number':
            a = this._createInputNum();
            break;
          default:
            a = this._createInputText();
        }
        a.inputControl();
      }
    },
    _createInputTextarea: function() {
      var a = this.element,
        b = c('<div/>').addClass('input-control').addClass('textarea'),
        d = a.clone(true);
      a.parent();
      d.appendTo(b);
      b.insertBefore(a);
      a.remove();
      return b;
    },
    _createInputSelect: function() {
      var a = this.element,
        b = c('<div/>').addClass('input-control').addClass('select'),
        d = a.clone(true);
      a.parent();
      d.val(a.val()).appendTo(b);
      b.insertBefore(a);
      a.remove();
      return b;
    },
    _createInputSwitch: function() {
      var a = this.element,
        b = c('<div/>').addClass('input-control').addClass('switch'),
        d = c('<label/>'),
        e = c('<span/>').addClass('check'),
        f = a.clone(true);
      a.parent();
      var g = c('<span/>').addClass('caption').html(void 0 != a.data('caption') ? a.data('caption') : '');
      d.appendTo(b);
      f.appendTo(d);
      e.appendTo(d);
      g.appendTo(d);
      b.insertBefore(a);
      a.remove();
      return b;
    },
    _createInputCheckbox: function() {
      var a = this.element,
        b = c('<div/>').addClass('input-control').addClass('checkbox'),
        d = c('<label/>'),
        e = c('<span/>').addClass('check'),
        f = a.clone(true);
      a.parent();
      var g = c('<span/>').addClass('caption').html(void 0 != a.data('caption') ? a.data('caption') : '');
      d.appendTo(b);
      f.appendTo(d);
      e.appendTo(d);
      g.appendTo(d);
      b.insertBefore(a);
      a.remove();
      return b;
    },
    _createInputRadio: function() {
      var a = this.element,
        b = c('<div/>').addClass('input-control').addClass('radio'),
        d = c('<label/>'),
        e = c('<span/>').addClass('check'),
        f = a.clone(true);
      a.parent();
      var g = c('<span/>').addClass('caption').html(void 0 != a.data('caption') ? a.data('caption') : '');
      d.appendTo(b);
      f.appendTo(d);
      e.appendTo(d);
      g.appendTo(d);
      b.insertBefore(a);
      a.remove();
      return b;
    },
    _createInputSearch: function() {
      return this._createInputVal('text', 'btn-search');
    },
    _createInputNum: function() {
      return this._createInputVal('number', 'btn-clear');
    },
    _createInputTel: function() {
      return this._createInputVal('tel', 'btn-clear');
    },
    _createInputEmail: function() {
      return this._createInputVal('email', 'btn-clear');
    },
    _createInputText: function() {
      return this._createInputVal('text', 'btn-clear');
    },
    _createInputPassword: function() {
      return this._createInputVal('password', 'btn-reveal');
    },
    _createInputFile: function() {
      return this._createInputVal('file', 'btn-file');
    },
    _createInputVal: function(a, b) {
      var d = this.element,
        e = c('<div/>').addClass('input-control').addClass(a),
        f = c('<button/>').addClass(b),
        g = d.clone(true);
      d.parent();
      g.appendTo(e);
      f.appendTo(e);
      e.insertBefore(d);
      d.remove();
      return e;
    },
    _destroy: function() {},
    _setOption: function(a, b) {
      this._super('_setOption', a, b);
    }
  });
}(jQuery));
(function(c) {
  c.Dialog = function(a) {
    if (c.Dialog.opened)
      return METRO_DIALOG;
    c.Dialog.opened = true;
    c.Dialog.settings = a;
    a = c.extend({
      icon: false,
      title: '',
      content: '',
      flat: false,
      shadow: false,
      overlay: false,
      width: 'auto',
      height: 'auto',
      position: 'default',
      padding: false,
      overlayClickClose: true,
      sysButtons: {
        btnClose: true
      },
      onShow: function(a) {},
      onClose: false,
      sysBtnCloseClick: function(a) {},
      sysBtnMinClick: function(a) {},
      sysBtnMaxClick: function(a) {}
    }, a);
    c.Dialog.onClose = a.onClose;
    var b, d, e, f;
    a.overlay && (b = c('<div/>').addClass('metro window-overlay').css({
      backgroundColor: 'rgba(0,0,0,.7)'
    }));
    d = c('<div/>').addClass('window');
    a.flat && d.addClass('flat');
    a.shadow && d.addClass('shadow').css('overflow', 'hidden');
    e = c('<div/>').addClass('caption');
    f = c('<div/>').addClass('content');
    f.css({
      paddingTop: 32 + a.padding,
      paddingLeft: a.padding,
      paddingRight: a.padding,
      paddingBottom: a.padding
    });
    a.sysButtons && (a.sysButtons.btnClose && c('<button/>').addClass('btn-close').on('click', function(b) {
      b.preventDefault();
      b.stopPropagation();
      c.Dialog.close();
      a.sysBtnCloseClick(b);
    }).appendTo(e), a.sysButtons.btnMax && c('<button/>').addClass('btn-max').on('click', function(b) {
      b.preventDefault();
      b.stopPropagation();
      a.sysBtnMaxClick(b);
    }).appendTo(e), a.sysButtons.btnMin && c('<button/>').addClass('btn-min').on('click', function(b) {
      b.preventDefault();
      b.stopPropagation();
      a.sysBtnMinClick(b);
    }).appendTo(e));
    a.icon && c(a.icon).addClass('icon').appendTo(e);
    c('<div/>').addClass('title').html(a.title).appendTo(e);
    f.html(a.content);
    e.appendTo(d);
    f.appendTo(d);
    d.appendTo(b ? b : $('body'));
    'auto' != a.width && d.css('min-width', a.width);
    'auto' != a.height && d.css('min-height', a.height);
    b && b.hide().appendTo('body').fadeIn('fast');
    METRO_DIALOG = d;
    d.css('position', 'fixed').css('z-index', 10000).css('top', (c(window).height() - METRO_DIALOG.outerHeight()) / 2).css('left', (c(window).width() - d.outerWidth()) / 2);
    addTouchEvents(d[0]);
    if (a.draggable)
      e.on('mousedown', function(a) {
        c.Dialog.drag = true;
        e.css('cursor', 'move');
        d.css('z-index');
        var b = d.outerHeight(),
          f = d.outerWidth(),
          l = d.offset().top + b - a.pageY,
          n = d.offset().left + f - a.pageX;
        d.css('z-index', 99999).parents().on('mousemove', function(a) {
          var e = 0 < a.pageY ? a.pageY + l - b : 0;
          a = 0 < a.pageX ? a.pageX + n - f : 0;
          c.Dialog.drag && (0 <= e && e <= window.innerHeight - d.outerHeight() && d.offset({
            top: e
          }), 0 <= a && a <= window.innerWidth - d.outerWidth() && d.offset({
            left: a
          }));
        });
        a.preventDefault();
      }).on('mouseup', function() {
        d.removeClass('draggable');
        c.Dialog.drag = false;
        e.css('cursor', 'default');
      });
    d.on('click', function(a) {
      a.stopPropagation();
    });
    if (a.overlayClickClose && b)
      b.on('click', function(a) {
        a.preventDefault();
        c.Dialog.close();
      });
    a.onShow(METRO_DIALOG);
    c.Dialog.autoResize();
    return METRO_DIALOG;
  };
  c.Dialog.content = function(a) {
    return c.Dialog.opened && void 0 != METRO_DIALOG ? a ? (METRO_DIALOG.children('.content').html(a), c.Dialog.autoResize(), true) : METRO_DIALOG.children('.content').html() : false;
  };
  c.Dialog.title = function(a) {
    if (!c.Dialog.opened || void 0 == METRO_DIALOG)
      return false;
    var b = METRO_DIALOG.children('.caption').children('.title');
    a ? b.html(a) : b.html();
    return true;
  };
  c.Dialog.autoResize = function() {
    if (!c.Dialog.opened || void 0 == METRO_DIALOG)
      return false;
    var a = METRO_DIALOG.children('.content'),
      b = (c(window).height() - METRO_DIALOG.outerHeight()) / 2,
      d = (c(window).width() - METRO_DIALOG.outerWidth()) / 2;
    METRO_DIALOG.css({
      width: a.outerWidth(),
      height: a.outerHeight(),
      top: b,
      left: d
    });
    return true;
  };
  c.Dialog.close = function() {
    c.Dialog.onClose && c.Dialog.onClose();
    if (!c.Dialog.opened || void 0 == METRO_DIALOG)
      return false;
    c.Dialog.opened = false;
    (METRO_DIALOG.parent('.window-overlay').length ? METRO_DIALOG.parent('.window-overlay') : METRO_DIALOG).html('').fadeOut(function() {
      c(this).remove();
    });
    return false;
  };
}(jQuery));
(function(c) {
  c.Confirm = function(me, cb, op) {
    c.Confirm.callback = c.isFunction(cb) ? cb : c.noop;
    op = c.extend({
      icon: false,
      title: me,
      content: me + '<br /><br />',
      flat: true,
      shadow: false,
      overlay: true,
      onShow: function(_d) {
        var cn = _d.children('.content').css('width', '400');
        var cl = $('<button>').css({
          float: 'right',
          marginRight: 5,
          marginTop: -10
        }).appendTo(cn).text('Cancel').on('click', function() {
          $.Dialog.close();
        });
        var cl = $('<button>').css({
          float: 'right',
          marginRight: 10,
          marginTop: -10
        }).appendTo(cn).text('OK').on('click', function() {
          c.Confirm.callback();
          $.Dialog.close();
        }).focus();
        $('<br />').appendTo(cn);
        c.Dialog.autoResize();
      }
    }, op);
    op.overlayClickClose = false;
    op.padding = 5;
    c.Dialog(op);
  };
}(jQuery));
(function(c) {
  var a = false,
    b = [],
    d = {
      _container: null,
      _notify: null,
      _timer: null,
      options: {
        icon: '',
        caption: '',
        content: '',
        shadow: true,
        width: 'auto',
        height: 'auto',
        style: false,
        position: 'right',
        timeout: 3000,
        onclick: c.noop()
      },
      init: function(a) {
        this.options = c.extend({}, this.options, a);
        this._build();
        return this;
      },
      _build: function() {
        a = this._container = a || c('<div/>').addClass('metro notify-container').appendTo('body');
        var d = this.options;
        if ('' == d.content || void 0 == d.content)
          return false;
        this._notify = c('<div/>').addClass('notify').click(d.onclick);
        d.shadow && this._notify.addClass('shadow');
        d.style && void 0 != d.style.background && this._notify.css('background-color', d.style.background);
        d.style && void 0 != d.style.color && this._notify.css('color', d.style.color);
        '' != d.caption && void 0 != d.caption && c('<div/>').addClass('caption').html(d.caption).appendTo(this._notify);
        '' != d.content && void 0 != d.content && c('<div/>').addClass('content').html(d.content).appendTo(this._notify);
        'auto' != d.width && this._notify.css('min-width', d.width);
        'auto' != d.height && this._notify.css('min-height', d.height);
        this._notify.hide().appendTo(this._container).fadeIn('slow');
        b.push(this._notify);
        this.close(d.timeout);
      },
      close: function(a) {
        this.clear();
        if (a == parseInt(a)) {
          var b = this;
          this._timer = setTimeout(function() {
            b._timer = null;
            b._hide();
          }, a);
        } else if (void 0 == a)
          return this._hide();
        return this;
      },
      clear: function() {
        return null != this._timer ? (clearTimeout(this._timer), this._timer = null, this) : false;
      },
      _hide: function() {
        this.clear();
        return void 0 != this._notify ? (this._notify.hide('slow', function() {
          this.remove();
          b.splice(b.indexOf(this._notify), 1);
        }), this) : false;
      },
      closeAll: function() {
        b.forEach(function(a) {
          a.hide('slow', function() {
            a.remove();
            b.splice(b.indexOf(a), 1);
          });
        });
        return this;
      }
    };
  c.Notify = function(a) {
    return Object.create(d).init(a);
  };
  c.Notify.show = function(a, b) {
    return $.isFunction(b) ? c.Notify({
      content: a,
      onclick: b
    }) : c.Notify({
      content: a,
      caption: b
    });
  };
}(jQuery));
(function(c) {
  c.Metro.initCalendars = function(a) {
    void 0 != a ? c(a).find('[data-role=calendar]').calendar() : c('[data-role=calendar]').calendar();
  };
  c.Metro.initDatepickers = function(a) {
    void 0 != a ? c(a).find('[data-role=datepicker]').datepicker() : c('[data-role=datepicker]').datepicker();
  };
  c.Metro.initDropdowns = function(a) {
    void 0 != a ? c(a).find('[data-role=dropdown]').dropdown() : c('[data-role=dropdown]').dropdown();
  };
  c.Metro.initInputs = function(a) {
    void 0 != a ? c(a).find('[data-role=input-control], .input-control').inputControl() : c('[data-role=input-control], .input-control').inputControl();
  };
  c.Metro.transformInputs = function(a) {
    void 0 != a ? c(a).find('[data-transform=input-control]').inputTransform() : c('[data-transform=input-control]').inputTransform();
  };
  c.Metro.initAll = function(a) {
    c.Metro.initCalendars(a);
    c.Metro.initDatepickers(a);
    c.Metro.initDropdowns(a);
    c.Metro.initInputs(a);
    c.Metro.transformInputs(a);
  };
}(jQuery));
$(function() {
  $.Metro.initAll();
});
$(function() {
  if (METRO_AUTO_REINIT) {
    var c = $('.metro').html(),
      a;
    setInterval(function() {
      a = $('.metro').html();
      c !== a && (c = a, $.Metro.initAll());
    }, 500);
  }
});
