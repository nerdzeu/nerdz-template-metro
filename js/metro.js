var METRO_WEEK_START = 0, METRO_DIALOGS = [];
$.browser = {msie:false};

/**
 * @name dateFormat
 * @function
 * @description Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 * @param {date} date - The date to format
 * @param {object} mask - The format of the output date
 * @param {bool} utc - Using local or utc time
 */
var dateFormat = function () {
    var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };
    return function (date, mask, utc) {
        var dF = dateFormat;
        if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }
        date = date ? new Date(date) : new Date();
        
        mask = String(dF.masks[mask] || mask || dF.masks["default"]);
        if (mask.slice(0, 4) === "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }
        locale = $.Metro.currentLocale;

        var	_ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  $.Metro.Locale[locale].days[D],
                dddd: $.Metro.Locale[locale].days[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm: $.Metro.Locale[locale].months[m],
                mmmm: $.Metro.Locale[locale].months[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

var hasTouch = 'ontouchend' in window, eventTimer;
var moveDirection = 'undefined', startX, startY, deltaX, deltaY, mouseDown = false;
function addTouchEvents(element){
    if (hasTouch) {
        element.addEventListener("touchstart", touch2Mouse, true);
        element.addEventListener("touchmove", touch2Mouse, true);
        element.addEventListener("touchend", touch2Mouse, true);
    }
}
/** 
 * @name touch2mouse
 * @function
 * @description Transform touch events in mouse-like events
 * @param {MouseEvent} - original event
 */
function touch2Mouse(e) {
    var theTouch = e.changedTouches[0];
    var mouseEv;

    switch(e.type)
    {
        case "touchstart": mouseEv="mousedown"; break;
        case "touchend":   mouseEv="mouseup"; break;
        case "touchmove":  mouseEv="mousemove"; break;
        default: return;
    }


    if (mouseEv === "mousedown") {
        eventTimer = (new Date()).getTime();
        startX = theTouch.clientX;
        startY = theTouch.clientY;
        mouseDown = true;
    }

    if (mouseEv === "mouseup") {
        if ((new Date()).getTime() - eventTimer <= 500) {
            mouseEv = "click";
        } else if ((new Date()).getTime() - eventTimer > 1000) {
            mouseEv = "longclick";
        }
        eventTimer = 0;
        mouseDown = false;
    }

    if (mouseEv === "mousemove") {
        if (mouseDown) {
            deltaX = theTouch.clientX - startX;
            deltaY = theTouch.clientY - startY;
            moveDirection = deltaX > deltaY ? 'horizontal' : 'vertical';
        }
    }

    var mouseEvent = document.createEvent("MouseEvent");
    mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
    theTouch.target.dispatchEvent(mouseEvent);

    e.preventDefault();
}

(function( $ ){
	/**
	 * @namespace metro
	 * @description Is a container for further components
	 * @param {object} - objects and functions to be attached
	 */ 
    $.Metro = function(params){
        params = $.extend({
        }, params);
    };
	/**
	 * @name metro#getDeviceSize
	 * @function
	 * @description Returns the size of the screen
	 */
    $.Metro.getDeviceSize = function(){
        var device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var device_height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        return {
            width: device_width,
            height: device_height
        };
    };
    
   /**
    * @name metro.currentLocale
    * @type {string}
    * @description Rapresents the current Locale 
    */
    $.Metro.currentLocale = "en";
   /**
    * @name metro.Locale
    * @type {object}
    * @description It's an object containing all locales supported
    */
    $.Metro.Locale = {
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
      it: {
        months: 'Gennaio;Febbraio;Marzo;Aprile;Maggio;Giugno;Luglio;Agosto;Settembre;Ottobre;Novembre;Dicembre;Gen;Feb;Mar;Apr;Mag;Giu;Lug;Ago;Set;Ott;Nov;Dic'.split(';'),
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
   /**
    * @name metro#setLocale
    * @function
    * @description Adds or overwrite a locale in $.Metro.Locale
    * @param {string} index - Two letter rapresentation of the locale
    * @param {object} local - Object containing localizated names
    */
    $.Metro.setLocale = function(a, b) {
      $.Metro.Locale[a] = b;
    };
    
   /**
    * @name metro#initCalendars
    * @function
    * @description Inits the calendar compontents on the selected area
    * @param {HTMLElement} area - The area on which initialize - Default HtmlDocument
    */
    $.Metro.initCalendars = function(area){
        if (area !== undefined) {
            $(area).find('[data-role=calendar]').calendar();
        } else {
            $('[data-role=calendar]').calendar();
        }
    };

   /**
    * @name metro#initDatepickers
    * @function
    * @description Inits the datepicker compontents on the selected area
    * @param {HTMLElement} area - The area on which initialize - Default HtmlDocument
    */
    $.Metro.initDatepickers = function(area){
        if (area !== undefined) {
            $(area).find('[data-role=datepicker]').datepicker();
        } else {
            $('[data-role=datepicker]').datepicker();
        }
    };

   /**
    * @name metro#initDropdowns
    * @function
    * @description Inits the dropdown compontents on the selected area
    * @param {HTMLElement} area - The area on which initialize - Default HtmlDocument
    */
    $.Metro.initDropdowns = function(area){
      if (area !== undefined) {
        $(area).find('[data-role=dropdown]').dropdown();
      } else {
        $('[data-role=dropdown]').dropdown();
      }
      $('html').on('click', function(c) {
        $('.dropdown-menu').each(function(a, b) {
          if(!$(b).hasClass('keep-open') && 'block' === $(b).css('display')) $(b).hide();
        });
      });
    };

   /**
    * @name metro#initInputs
    * @function
    * @description Inits the input compontents on the selected area
    * @param {HTMLElement} area - The area on which initialize - Default HtmlDocument
    */
    $.Metro.initInputs = function(area){
        if (area !== undefined) {
            $(area).find('[data-role=input-control], .input-control').inputControl();
        } else {
            $('[data-role=input-control], .input-control').inputControl();
        }
    };

   /**
    * @name metro#transformInputs
    * @function
    * @description Inits the input-transform compontents on the selected area
    * @param {HTMLElement} area - The area on which initialize - Default HtmlDocument
    */
    $.Metro.transformInputs = function(area){
        if (area !== undefined) {
            $(area).find('[data-transform=input-control]').inputTransform();
        } else {
            $('[data-transform=input-control]').inputTransform();
        }
    };
    
   /**
    * @name metro#initDialog
    * @function
    * @description Inits the dialog resize on $(window).resize
    */
    $.Metro.initDialog = function() {
      $(window).on("resize", $.Dialog.autoResize);
    };
    
    $.Metro.initAll = function(area) {
        $.Metro.initCalendars(area);
        $.Metro.initDatepickers(area);
        $.Metro.initDropdowns(area);
        $.Metro.initInputs(area);
        $.Metro.transformInputs(area);
        $.Metro.initDialog(area);
    };
})(jQuery);

(function( $ ) {
	/** 
	 * @namespace metro.calendar
	 * @description Renders a Calendar
	 * @param {object} options - Overwrite default options
	 */
   $.widget("metro.calendar", {
        version: "1.0.0",
			
			/**
			 * @name metro.calendar#options
			 * @description Calendar's options - Note: they are overwritten by data-* properties of the target element
			 * @type {object}
			 * @prop {String} format - The format in which dates will be rendered (Default: "yyyy-mm-dd")
			 * @prop {String} startMode - The default view in the calendar (year, month, day) (Default: "day")
			 * @prop {int} weekStart - The first day of the week (0 - Sunday, 1 - Monday) (Default: 1);
			 * @prop {bool} otherDays - Show days of previous/next month (Default: false)
			 * @prop {Date} date - The date set as "Today" (Default: new Date())
			 * @prop {bool} buttons - show or not to show navigation buttons? (Default: true)
			 * @prop {String} locale - 2 letters rapresentation of the locale in which show the calendar. It must be an index in the {@link metro.Locale} object (Default: {@link metro.currentLocale})
			 * @prop {function} getDates - something to do with stored dates in the calendar (Default: function(d){})
			 * @prop {function} click - something to do when clicking on a day
			 */
        options: {
            format: "yyyy-mm-dd",
            startMode: 'day',
            weekStart: 1, // 0 - Sunday, 1 - Monday
            otherDays: false,
            date: new Date(),
            buttons: true,
            locale: $.Metro.currentLocale,
            getDates: function(d){},
            click: function(d, d0){},
            _storage: []
        },
			/**
			 * @name metro.calendar._year
			 * @private
			 */
        _year: 0,
			/**
			 * @name metro.calendar._month
			 * @private
			 */
        _month: 0,
			/**
			 * @name metro.calendar._day
			 * @private
			 */
        _day: 0,
			/**
			 * @name metro.calendar._today
			 * @private
			 */
        _today: new Date(),
			/**
			 * @name metro.calendar._event
			 * @private
			 */
        _event: '',
			/**
			 * @name metro.calendar._mode
			 * @private
			 */
        _mode: 'day',
			/**
			 * @name metro.calendar._distance
			 * @private
			 */
        _distance: 0,
			/**
			 * @name metro.calendar._events
			 * @private
			 */
        _events: [],
			/**
			 * @name metro.calendar#_create
			 * @function
			 * @private
			 */
        _create: function(){
            var element = this.element;

            if (element.data('format') !== undefined) this.options.format = element.data("format");
            if (element.data('date') !== undefined) this.options.date = new Date(element.data("date"));
            if (element.data('locale') !== undefined) this.options.locale = element.data("locale");
            if (element.data('startMode') !== undefined) this.options.startMode = element.data('startMode');
            if (element.data('weekStart') !== undefined) this.options.weekStart = element.data('weekStart');
            if (element.data('otherDays') !== undefined) this.options.otherDays = element.data('otherDays');

            this._year = this.options.date.getFullYear();
            this._distance = parseInt(this.options.date.getFullYear())-4;
            this._month = this.options.date.getMonth();
            this._day = this.options.date.getDate();
            this._mode = this.options.startMode;

            element.data("_storage", []);

            this._renderCalendar();
        },

			/**
			 * @name metro.calendar#_renderMonth
			 * @function
			 * @private
			 */
        _renderMonth: function(){
            var year = this._year,
                month = this._month,
                day = this._day,
                event = this._event,
                feb = ((year%100!==0) && (year%4===0) || (year%400===0)) ? 29 : 28;

            var totalDays = ["31", feb.toString(),"31","30","31","30","31","31","30","31","30","31"];
            var daysInMonth = totalDays[month];
            var first_week_day = new Date(year, month, 1).getDay();

            var table, tr, td, i;

            this.element.html("");

            table = $("<div/>").addClass("calendar");

            // Add calendar header
            tr = $("<div/>").addClass("calendar-header");
            $("<div/>").addClass("cell").html("<a class='btn-previous-year' href='#'><i class='icon-previous'></i></a>").appendTo(tr);
            $("<div/>").addClass("cell").html("<a class='btn-previous-month' href='#'><i class='icon-arrow-left-4'></i></a>").appendTo(tr);
            $("<div/>").addClass("cell cols3").html("<a class='btn-select-month' href='#'>"+ $.Metro.Locale[this.options.locale].months[month]+' '+year+"</a>").appendTo(tr);
            $("<div/>").addClass("cell").html("<a class='btn-next-month' href='#'><i class='icon-arrow-right-4'></i></a>").appendTo(tr);
            $("<div/>").addClass("cell").html("<a class='btn-next-year' href='#'><i class='icon-next'></i></a>").appendTo(tr);
            tr.appendTo(table);

            // Add day names
            var j = this.options.weekStart ? 6 : 7;
            tr = $("<div/>").addClass("tr");
            for(i = 0; i < 7; i++) 
                td = $("<div/>").addClass("day-of-week").html($.Metro.Locale[this.options.locale].days[i+7]).appendTo(tr);
                
            tr.addClass("calendar-subheader").appendTo(table);

            // Add empty days for previos month
            var prevMonth = this._month - 1; if (prevMonth < 0) prevMonth = 11; var daysInPrevMonth = totalDays[prevMonth];
            var _first_week_day = (j + first_week_day)%7;
            var htmlPrevDay = "";
            tr = $("<div/>").addClass("tr");
            for(i = 0; i < _first_week_day; i++) {
                if (this.options.otherDays) htmlPrevDay = daysInPrevMonth - (_first_week_day - i - 1);
                td = $("<div/>").addClass("empty").addClass("day").html("<small class='other-day'>"+htmlPrevDay+"</small>").appendTo(tr);
            }
            var week_day = (j + first_week_day)%7;
            for (i = 1; i <= daysInMonth; i++) {
                week_day %= 7;
                if (week_day === 0) {
                    tr.appendTo(table);
                    tr = $("<div/>").addClass("tr");
                }

                td = $("<div/>").addClass("day").html("<a href='#'>"+i+"</a>");
                if (year === this._today.getFullYear() && month === this._today.getMonth() && this._today.getDate() === i) {
                    td.addClass("today");
                }

                var d = (new Date(this._year, this._month, i)).format('yyyy-mm-dd');
                if (this.element.data('_storage').indexOf(d)>=0) {
                    td.find("a").addClass("selected");
                }
                td.appendTo(tr);
                week_day++;
            }
            
            // next month other days
            var htmlOtherDays = "";
            for (i = week_day+1; i<=7; i++){
                if (this.options.otherDays) htmlOtherDays = i - week_day;
                td = $("<td/>").addClass("empty").html("<small class='other-day'>"+htmlOtherDays+"</small>").appendTo(tr);
            }
            
            tr.appendTo(table);

            if (this.options.buttons) {
                tr = $("<div/>").addClass("tr calendar-actions");
                $("<div/>").addClass("cell").html("<button class='button calendar-btn-today small success'>"+$.Metro.Locale[this.options.locale].buttons[0]+"</button>").appendTo(tr);
                for(i = 0; i< 5; i++)
                  $("<div/>").addClass("cell").html("&nbsp;").appendTo(tr);
                $("<div/>").addClass("cell").html("<button class='button calendar-btn-clear small warning'>"+$.Metro.Locale[this.options.locale].buttons[1]+"</button>").appendTo(tr);
                tr.appendTo(table);
            }

            table.appendTo(this.element);
            this.options.getDates(this.element.data('_storage'));
        },
			/**
			 * @name metro.calendar#_renderMonths
			 * @function
			 * @private
			 */
        _renderMonths: function(){
            var table, tr, td, i, j;

            this.element.html("");

            table = $("<div/>").addClass("calendar");

            // Add calendar header
            tr = $("<div/>").addClass("calendar-header");

            $("<div/>").addClass("cell").html("<a class='btn-previous-year' href='#'><i class='icon-arrow-left-4'></i></a>").appendTo(tr);
            $("<div/>").addClass("cell cols5").html("<a class='btn-select-year' href='#'>"+this._year+"</a>").appendTo(tr);
            $("<div/>").addClass("cell").html("<a class='btn-next-year' href='#'><i class='icon-arrow-right-4'></i></a>").appendTo(tr);

            tr.appendTo(table);

            tr = $("<div/>").addClass("tr");
            j = 0;
            for (i=0;i<12;i++) {

                td = $("<div/>").addClass("month").html("<a href='#' data-month='"+i+"'>"+$.Metro.Locale[this.options.locale].months[i+12]+"</a>");

                if (this._month === i && (new Date()).getFullYear() === this._year) {
                    td.addClass("today");
                }

                td.appendTo(tr);
                if ((j+1) % 4 === 0) {
                    tr.appendTo(table);
                    tr = $("<div/>").addClass("tr");
                }
                j+=1;
            }

            table.appendTo(this.element);
        },

			/**
			 * @name metro.calendar#_renderYears
			 * @function
			 * @private
			 */
        _renderYears: function(){
            var table, tr, td, i, j;

            this.element.html("");

            table = $("<div/>").addClass("calendar");

            // Add calendar header
            tr = $("<div/>").addClass("calendar-header");
            $("<div/>").addClass("cell").html("<a class='btn-previous-year' href='#'><i class='icon-arrow-left-4'></i></a>").appendTo(tr);
            $("<div/>").addClass("cell cols5").html( (this._distance)+"-"+(this._distance+11) ).appendTo(tr);
            $("<div/>").addClass("cell").html("<a class='btn-next-year' href='#'><i class='icon-arrow-right-4'></i></a>").appendTo(tr);

            tr.addClass("calendar-header").appendTo(table);

            tr = $("<div/>").addClass("tr");

            j = 0;
            for (i=this._distance;i<this._distance+12;i++) {
                td = $("<div/>").addClass("year").html("<a href='#' data-year='"+i+"'>"+i+"</a>");
                if ((new Date()).getFullYear() === i) {
                    td.addClass("today");
                }
                td.appendTo(tr);
                if ((j+1) % 4 === 0) {
                    tr.appendTo(table);
                    tr = $("<div/>").addClass("tr");
                }
                j+=1;
            }

            table.appendTo(this.element);
        },

        _renderCalendar: function(){
            switch (this._mode) {
                case 'year': this._renderYears(); break;
                case 'month': this._renderMonths(); break;
                default: this._renderMonth();
            }
            this._initButtons();
        },

			/**
			 * @name metro.calendar#_initButtons
			 * @function
			 * @private
			 */
        _initButtons: function(){
            // Add actions
            var that = this, table = this.element;

            if (this._mode === 'day') {
                table.find('.btn-select-month').on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    that._mode = 'month';
                    that._renderCalendar();
                });
                table.find('.btn-previous-month').on('click', function(e){
                    that._event = 'eventPrevious';
                    e.preventDefault();
                    e.stopPropagation();
                    that._month -= 1;
                    if (that._month < 0) {
                        that._year -= 1;
                        that._month = 11;
                    }
                    that._renderCalendar();
                });
                table.find('.btn-next-month').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that._month += 1;
                    if (that._month === 12) {
                        that._year += 1;
                        that._month = 0;
                    }
                    that._renderCalendar();
                });
                table.find('.btn-previous-year').on('click', function(e){
                    that._event = 'eventPrevious';
                    e.preventDefault();
                    e.stopPropagation();
                    that._year -= 1;
                    that._renderCalendar();
                });
                table.find('.btn-next-year').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that._year += 1;
                    that._renderCalendar();
                });
                table.find('.calendar-btn-today').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that.options.date = new Date();
                    that._year = that.options.date.getFullYear();
                    that._month = that.options.date.getMonth();
                    that._day = that.options.date.getDate();
                    that._renderCalendar();
                });
                table.find('.calendar-btn-clear').on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    that.options.date = new Date();
                    that._year = that.options.date.getFullYear();
                    that._month = that.options.date.getMonth();
                    that._day = that.options.date.getDate();
                    that.element.data('_storage', []);
                    that._renderCalendar();
                });
                table.find('.day a').on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var d = (new Date(that._year, that._month, parseInt($(this).html()))).format(that.options.format,null);
                    var d0 = (new Date(that._year, that._month, parseInt($(this).html())));

                    if (e.ctrlKey) {
                        $(this).toggleClass("selected");

                        if ($(this).hasClass("selected")) {
                            that._addDate(d);
                        } else {
                            that._removeDate(d);
                        }
                    } else {
                        table.find('.day a').removeClass('selected');
                        $(this).addClass("selected");
                        that.element.data('_storage', []);
                        that._addDate(d);
                    }
                    that.options.getDates(that.element.data('_storage'));
                    that.options.click(d, d0);
                });
            } else if (this._mode === 'month') {
                table.find('.month a').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that._month = parseInt($(this).data('month'));
                    that._mode = 'day';
                    that._renderCalendar();
                });
                table.find('.btn-previous-year').on('click', function(e){
                    that._event = 'eventPrevious';
                    e.preventDefault();
                    e.stopPropagation();
                    that._year -= 1;
                    that._renderCalendar();
                });
                table.find('.btn-next-year').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that._year += 1;
                    that._renderCalendar();
                });
                table.find('.btn-select-year').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that._mode = 'year';
                    that._renderCalendar();
                });
            } else {
                table.find('.year a').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that._year = parseInt($(this).data('year'));
                    that._mode = 'month';
                    that._renderCalendar();
                });
                table.find('.btn-previous-year').on('click', function(e){
                    that._event = 'eventPrevious';
                    e.preventDefault();
                    e.stopPropagation();
                    that._distance -= 10;
                    that._renderCalendar();
                });
                table.find('.btn-next-year').on('click', function(e){
                    that._event = 'eventNext';
                    e.preventDefault();
                    e.stopPropagation();
                    that._distance += 10;
                    that._renderCalendar();
                });
            }
        },

			/**
			 * @name metro.calendar#_addDate
			 * @function
			 * @private
			 */
        _addDate: function(d){
            var index = this.element.data('_storage').indexOf(d);
            if (index < 0) this.element.data('_storage').push(d);
        },

			/**
			 * @name metro.calendar#_removeDate
			 * @function
			 * @private
			 */
        _removeDate: function(d){
            var index = this.element.data('_storage').indexOf(d);
            this.element.data('_storage').splice(index, 1);
        },

			/**
			 * @name metro.calendar#_setDate
			 * @function
			 * @private
			 */
        setDate: function(d){
            var r;
            d = new Date(d);
            r = (new Date(d.getFullYear()+"/"+ (d.getMonth()+1)+"/"+ d.getDate())).format('yyyy-mm-dd');
            this._addDate(r);
            this._renderCalendar();
        },

			/**
			 * @name metro.calendar#_getDate
			 * @function
			 * @private
			 */
        getDate: function(index){
            return new Date(index !== undefined ? this.element.data('_storage')[index] : this.element.data('_storage')[0]).format(this.options.format);
        },

			/**
			 * @name metro.calendar#_getDates
			 * @function
			 * @private
			 */
        getDates: function(){
            return this.element.data('_storage');
        },

			/**
			 * @name metro.calendar#_unsetDate
			 * @function
			 * @private
			 */
        unsetDate: function(d){
            var r;
            d = new Date(d);
            r = (new Date(d.getFullYear()+"-"+ (d.getMonth()+1)+"-"+ d.getDate())).format('yyyy-mm-dd');
            this._removeDate(r);
            this._renderCalendar();
        },

			/**
			 * @name metro.calendar#_destroy
			 * @function
			 * @private
			 */
        _destroy: function(){},

			/**
			 * @name metro.calendar#_setOption
			 * @function
			 * @private
			 */
        _setOption: function(key, value){
            this._super('_setOption', key, value);
        }
    });
})( jQuery );

(function( $ ) {
	/** 
	 * @namespace metro.datepicker
	 * @description Renders a datepicker, based on {@link metro.calendar}
	 */
    $.widget("metro.datepicker", {
        version: "1.0.0",
      /** 
       * @name metro.datepicker#options 
			 * @description Calendar's options - Note: they are overwritten by data-* properties of the target element
			 * @type {object} 
			 * @prop {string} format - Same as in {@link metro.calendar#options} (Default: dd.mm.yyyy)
			 * @prop {date} date - Today (Default: undefined)
			 * @prop {string} effect - Spawning effect of the datepicker (slide, fade, none) (Default: "slide")
			 * @prop {string} locale - 2 letters rapresentation of the locale in which show the calendar. It must be an index in the {@link metro.Locale} object (Default: {@link metro.currentLocale})
			 * @prop {int} weekStart - The first day of the week (0 - Sunday, 1 - Monday) (Default: 1);
			 * @prop {bool} otherDays - Show days of previous/next month (Default: false)
			 * @prop {function} selected - Triggered on date selection (Default: function(d, d0) {})
			 * @prop {HTMLElement} calendar - HTMLElement in which render calendar
			 */
        options: {
            format: "dd.mm.yyyy",
            date: undefined,
            effect: 'slide',
            position: 'bottom',
            locale: $.Metro.currentLocale,
            weekStart: 1,
            otherDays: false,
            selected: function(d, d0){},
            _calendar: undefined
        },


        _create: function(){
            var that = this,
                element = this.element,
                input = element.children("input"),
                button = element.children("button.btn-date");

            if (element.data('date') !== undefined) this.options.date = element.data('date');
            if (element.data('format') !== undefined) this.options.format = element.data('format');
            if (element.data('effect') !== undefined) this.options.effect = element.data('effect');
            if (element.data('position') !== undefined) this.options.position = element.data('position');
            if (element.data('locale') !== undefined) this.options.locale = element.data('locale');
            if (element.data('weekStart') !== undefined) this.options.weekStart = element.data('weekStart');
            if (element.data('otherDays') !== undefined) this.options.otherDays = element.data('otherDays');
            
            this._createCalendar(element, this.options.date);

            input.attr('readonly', true);

            button.on('click', function(e){
                e.stopPropagation();
                if (that.options._calendar.css('display') === 'none') {
                    that._show();
                } else {
                    that._hide();
                }
            });

            element.on('click', function(e){
                e.stopPropagation();
                if (that.options._calendar.css('display') === 'none') {
                    that._show();
                } else {
                    that._hide();
                }
            });

            $('html').on('click', function(e){
                $(".calendar-dropdown").hide();
            });
        },

        _createCalendar: function(to, curDate){
            var _calendar, that = this;

            _calendar = $("<div/>").css({
                position: 'absolute',
                display: 'none',
                'max-width': 260,
                'z-index': 1000
            }).addClass('calendar calendar-dropdown').appendTo(to);

            if (that.options.date !== undefined) {
                _calendar.data('date', that.options.date);
            }

            _calendar.calendar({
                multiSelect: false,
                format: that.options.format,
                buttons: false,
                locale: that.options.locale,
                otherDays: that.options.otherDays,
                weekStart: that.options.weekStart,
                click: function(d, d0){
                    _calendar.calendar('setDate', d0);
                    to.children("input[type=text]").val(d);
                    that.options.selected(d, d0);
                    that._hide();
                }
            });

            if (curDate !== undefined) {
                _calendar.calendar('setDate', curDate);
                to.children("input[type=text]").val(_calendar.calendar('getDate'));
            }

            // Set position
            switch (this.options.position) {
                case 'top': _calendar.css({top: (0-_calendar.height()), left: 0}); break;
                default: _calendar.css({top: '100%', left: 0});
            }

            this.options._calendar = _calendar;
        },

        _show: function(){
            if (this.options.effect === 'slide') {
                $(".calendar-dropdown").slideUp('fast');
                this.options._calendar.slideDown('fast');
            } else if (this.options.effect === 'fade') {
                $(".calendar-dropdown").fadeOut('fast');
                this.options._calendar.fadeIn('fast');
            } else {
                $(".calendar-dropdown").hide();
                this.options._calendar.show();
            }
        },
        _hide: function(){
            if (this.options.effect === 'slide') {
                this.options._calendar.slideUp('fast');
            } else if (this.options.effect === 'fade') {
                this.options._calendar.fadeOut('fast');
            } else {
                this.options._calendar.hide();
            }
        },

        _destroy: function(){
        },

        _setOption: function(key, value){
            this._super('_setOption', key, value);
        }
    });
})( jQuery );

(function( $ ) {
	/** 
	 * @namespace metro.dropdown
	 * @description Creates a dropdown menu
	 */
    $.widget("metro.dropdown", {
        version: "1.0.0",
      /** 
       * @name metro.datepicker#options 
			 * @description Calendar's options - Note: they are overwritten by data-* properties of the target element
			 * @type {object} 
			 * @prop {string} effect - Spawning effect of the dropdown (slide, fade, none) (Default: "slide")
			 * @prop {HTMLElement} toggleElement - element that will trigger the dropdown (Default: element.parent(".dropdown-toggle")
			 * @prop {bool} keepOpen - if true, the dropdown will be close only by clicking on the trigger (Default: false)
			 */
        options: {
            effect: 'slide',
            toggleElement: false,
            keepOpen: false
        },

        _create: function(){
            var  that = this,
                 menu = this.element,
                 name = this.name,
                 parent = this.element.parent(),
                 toggle = this.options.toggleElement || parent.children('.dropdown-toggle');

            if (menu.data('effect') !== undefined) {
                this.options.effect = menu.data('effect');
            }
            
            if(this.options.keepOpen) this.element.addClass("keep-open");

            toggle.on('click.'+name, function(e){
                e.preventDefault();
                e.stopPropagation();

                if (menu.css('display') === 'block' && !menu.hasClass('keep-open')) {
                    that._close(menu);
                } else {
                    $('.dropdown-menu').each(function(i, el){
                        if (!menu.parents('.dropdown-menu').is(el) && !$(el).hasClass('keep-open') && $(el).css('display')=='block') {
                            that._close(el);
                        }
                    });
                    that._open(menu);
                }
            });

            $(menu).find('li.disabled a').on('click', function(e){
                e.preventDefault();
            });

        },

        _open: function(el){
            switch (this.options.effect) {
                case 'fade': $(el).fadeIn('fast'); break;
                case 'slide': $(el).slideDown('fast'); break;
                default: $(el).hide();
            }
            this._trigger("onOpen", null, el);
        },

        _close: function(el){
            switch (this.options.effect) {
                case 'fade': $(el).fadeOut('fast'); break;
                case 'slide': $(el).slideUp('fast'); break;
                default: $(el).hide();
            }
            this._trigger("onClose", null, el);
        },

        _destroy: function(){
        },

        _setOption: function(key, value){
            this._super('_setOption', key, value);
        }
    });
})( jQuery );

(function( $ ) {
	/** 
	 * @namespace metro.inputControl
	 * @description Renders a input element
	 */
    $.widget("metro.inputControl", {
        version: "1.0.0",
        options: {
        },
        _create: function(){
            var that = this,
                control = this.element;
            if (control.hasClass('text')) {
                this.initTextInput(control, that);
            } else if (control.hasClass('password')) {
                this.initPasswordInput(control, that);
            } else if (control.hasClass('checkbox') || control.hasClass('radio') || control.hasClass('switch')) {
                this.initCheckboxInput(control, that);
            } else if (control.hasClass('file')) {
                this.initFileInput(control, that);
            }
        },
        initCheckboxInput: function(el, that) {
        },
        initFileInput: function(el, that){
            var button, input, wrapper;
            wrapper = $("<input type='text' id='__input_file_wrapper__' readonly style='z-index: 1; cursor: default;'>");
            button = el.children('.btn-file');
            input = el.children('input[type="file"]');
            input.css('z-index', 0);
            wrapper.insertAfter(input);
            input.attr('tabindex', '-1');
            button.attr('type', 'button');
            input.on('change', function(){
                var val = $(this).val();
                if (val !== '') {
                    wrapper.val(val);
                }
            });
            button.on('click', function(){
                input.trigger('click');
            });
        },
        initTextInput: function(el, that){
            var button = el.children('.btn-clear'),
                input = el.children('input[type=text]');
            if (button.length === 0) return;
            button.attr('tabindex', '-1');
            button.attr('type', 'button');
            button.on('click', function(){
                input = el.children('input');
                if (input.prop('readonly')) return;
                input.val('');
                input.focus();
                that._trigger("onClear", null, el);
            });

            if (!input.attr("disabled")) input.on('click', function(){$(this).focus();});
        },
        initPasswordInput: function(el, that){
            var button = el.children('.btn-reveal'),
                input = el.children('input[type=password]');
            var wrapper;
            if (button.length === 0) return;
            button.attr('tabindex', '-1');
            button.attr('type', 'button');
            button.on('mousedown', function(e){
                input.attr('type', 'text');
            });
            button.on('mouseup, mouseleave, blur', function(e){
                input.attr('type', 'password').focus();
            });
            if (!input.attr("disabled")) input.on('click', function(){$(this).focus();});
        },

        _destroy: function(){
        },

        _setOption: function(key, value){
            this._super('_setOption', key, value);
        }
    });
	/** 
	 * @namespace metro.inputTransform
	 * @description Transform a form's children elements
	 */
    $.widget("metro.inputTransform", {
        version: "1.0.0",
        options: {
            transformType: "text"
        },

        _create: function(){
            var that = this,
                element = this.element,
                inputType;
            var checkTransform = element.parent().hasClass("input-control");
            if (checkTransform) return;
            inputType = element.get(0).tagName.toLowerCase();
            if (inputType === "textarea") {
                this.options.transformType = "textarea";
            } else if (inputType === "select") {
                this.options.transformType = "select";
            } else {
                if (element.data('transformType') !== undefined) {
                    this.options.transformType = element.data('transformType');
                } else {
                    this.options.transformType = element.attr("type");
                }
            }
            var control;
            switch (this.options.transformType) {
                case "password": control = this._createInputPassword(); break;
                case "file": control = this._createInputFile(); break;
                case "checkbox": control = this._createInputCheckbox(); break;
                case "radio": control = this._createInputRadio(); break;
                case "switch": control = this._createInputSwitch(); break;
                case "select": control = this._createInputSelect(); break;
                case "textarea": control = this._createInputTextarea(); break;
                case "search": control = this._createInputSearch(); break;
                case "email": control = this._createInputEmail(); break;
                case "tel": control = this._createInputTel(); break;
                case "number": control = this._createInputNum(); break;
                default: control = this._createInputText();
            }
            control.inputControl();
        },
        _createInputTextarea: function(){
            var element = this.element;
            var wrapper = $("<div/>").addClass("input-control").addClass("textarea");
            var clone = element.clone(true);
            var parent = element.parent();
            clone.appendTo(wrapper);
            wrapper.insertBefore(element);
            element.remove();
            return wrapper;
        },

        _createInputSelect: function(){
            var element = this.element;
            var wrapper = $("<div/>").addClass("input-control").addClass("select");
            var clone = element.clone(true);
            var parent = element.parent();
            clone.val(element.val()).appendTo(wrapper);
            wrapper.insertBefore(element);
            element.remove();
            return wrapper;
        },

        _createInputSwitch: function(){
            var element = this.element;
            var wrapper = $("<div/>").addClass("input-control").addClass("switch");
            var label  = $("<label/>");
            var button = $("<span/>").addClass("check");
            var clone = element.clone(true);
            var parent = element.parent();
            var caption = $("<span/>").addClass("caption").html( element.data('caption') !== undefined ? element.data('caption') : "" );
            label.appendTo(wrapper);
            clone.appendTo(label);
            button.appendTo(label);
            caption.appendTo(label);
            wrapper.insertBefore(element);
            element.remove();
            return wrapper;
        },

        _createInputCheckbox: function(){
            var element = this.element;
            var wrapper = $("<div/>").addClass("input-control").addClass("checkbox");
            var label  = $("<label/>");
            var button = $("<span/>").addClass("check");
            var clone = element.clone(true);
            var parent = element.parent();
            var caption = $("<span/>").addClass("caption").html( element.data('caption') !== undefined ? element.data('caption') : "" );
            label.appendTo(wrapper);
            clone.appendTo(label);
            button.appendTo(label);
            caption.appendTo(label);
            wrapper.insertBefore(element);
            element.remove();
            return wrapper;
        },

        _createInputRadio: function(){
            var element = this.element;
            var wrapper = $("<div/>").addClass("input-control").addClass("radio");
            var label  = $("<label/>");
            var button = $("<span/>").addClass("check");
            var clone = element.clone(true);
            var parent = element.parent();
            var caption = $("<span/>").addClass("caption").html( element.data('caption') !== undefined ? element.data('caption') : "" );
            label.appendTo(wrapper);
            clone.appendTo(label);
            button.appendTo(label);
            caption.appendTo(label);
            wrapper.insertBefore(element);
            element.remove();
            return wrapper;
        },
      _createInputSearch: function(){
        return this._createInputVal("text", "btn-search");
      },
      _createInputNum: function(){
        return this._createInputVal("number", "btn-clear");
      },
      _createInputTel: function(){
        return this._createInputVal("tel", "btn-clear");
      },
      _createInputEmail: function(){
        return this._createInputVal("email", "btn-clear");
      },
      _createInputText: function(){
        return this._createInputVal("text", "btn-clear");
      },
      _createInputPassword: function(){
        return this._createInputVal("password", "btn-reveal");
      },
      _createInputFile: function(){
        return this._createInputVal("file", "btn-file");
      },
      _createInputVal: function(name, buttonName) {
        var element = this.element;
        var wrapper = $("<div/>").addClass("input-control").addClass(name);
        var button = $("<button/>").addClass(buttonName);
        var clone = element.clone(true);
        var parent = element.parent();

        clone.appendTo(wrapper);
        button.appendTo(wrapper);

        wrapper.insertBefore(element);
        element.remove();

        return wrapper;
      },

      _destroy: function(){},

      _setOption: function(key, value){
        this._super('_setOption', key, value);
      }
    });
})( jQuery );

(function($) {
	/** 
	 * @namespace metro.Dialog
	 * @description Create a dialog window
	 */
    $.Dialog = function(params) {
        if($.isNumeric(params)) return $("#window"+params).eq(0);

        $.Dialog.settings = params;
			/**
			 * @name metro.Dialog#params
			 * @type {object}
			 * @prop {(string|HTMLElement)} icon - The icon of the dialog (Default: false)
			 * @prop {string} title - Title of the dialog (Default: "")
			 * @prop {(string|HTMLElement)} content - Content of the dialog. Can be set later using onShow() or {@link metro.Dialog#Content} (Default: "")
			 * @prop {bool} flat - Sets the style of the dialog (Default: false)
			 * @prop {bool} shadow - If true the dialog will have a shadow (Default: false)
			 * @prop {bool} overlay - If true the space around the dialog will be fill by a semi-transparent color. Clicking on the overlay will close the window if this.overlayClickClose is set to true (Default: false)
			 * @prop {int} width - The width of the dialog [px] (Default: 'auto', meaning same as content)
			 * @prop {int} height - The height of the dialog [px] (Default: 'auto', meaning same as content)
			 * @prop {{top: number, left:number, bottom:number, right: number}} position - The position of the dialog in the window. All the properties can be specified, although top/left property will have priority, if set. (Default: 'auto', the center of the window)
			 * @prop {object} style - The css that will be applied to the dialog's content (Default: same as body)
			 * @prop {int} padding - The padding of the dialog's content (Default: 0)
			 * @prop {bool} overlayClickClose - Specifies if the dialog will be closed by clicking on the overlay. If this.overlay is false this property is quite useless (Default: true)
			 * @prop {{btnClose: bool, btnMin: bool, btnMax: bool}} sysButtons - Specifies which buttons must be shown in the dialog's caption (Default: {btnClose: true})
			 * @prop {string} effect - The effect applied to dialog transitions (slide, fade, none) (Default: fade)
			 * @prop {function} onShow - Triggered when dialog shows up (Default: function(_dialog) {})
			 * @prop {function} onClose - Triggered when dialog vanishes (Default: function(_dialog) {})
			 * @prop {function} sysBtnMinClick - Triggered when minButton is clicked (Note: .minimized css class will also be added, to avoid it alter css) (Default: function(event, _dialog) {})
			 * @prop {function} sysBtnMaxClick - Triggered when maxButton is clicked (Note: .maximized css class will also be added, to avoid it alter css) (Default: function(event, _dialog) {})
			 */
        params = $.extend({
            icon: false,
            title: '',
            content: '',
            flat: false,
            shadow: false,
            overlay: false,
            width: 'auto',
            height: 'auto',
            position: 'default',
            style: {backgroundColor:$("body").css("background-color"), color:$("body").css("color")},
            padding: false,
            overlayClickClose: true,
            sysButtons: {
                btnClose: true
            },
            effect: "fade",
            onShow: function(_dialog){},
            onClose: function(_dialog){},
            sysBtnMinClick: function(event, _dialog){},
            sysBtnMaxClick: function(event, _dialog){}
        }, params);

        var _overlay, _window, _caption, _content, _uuid = METRO_DIALOGS.length, _zindex = 1000+_uuid;

        _window = $("<div/>").addClass("window").attr("id","window"+_uuid).data("uuid",_uuid);
        
        if (params.flat) _window.addClass("flat");
        if (params.shadow) _window.addClass("shadow").css('overflow', 'hidden');
        _caption = $("<div/>").addClass("caption");
        _content = $("<div/>").addClass("content");
        if(params.style) _content.css(params.style);
        _content.css({
            paddingTop: 32 + params.padding,
            paddingLeft: params.padding,
            paddingRight: params.padding,
            paddingBottom: params.padding
        });

        if (params.sysButtons) {
            if (params.sysButtons.btnClose) {
                $("<button/>").addClass("btn-close").on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $.Dialog.close(_uuid);
                }).appendTo(_caption);
            }
            if (params.sysButtons.btnMax) {
                $("<button/>").addClass("btn-max").on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if(_window.hasClass("minimized")) {
                      _window.removeClass("minimized").addClass("maximized");
                    }
                    else
                      _window.toggleClass("maximized");
                    params.sysBtnMaxClick(e, _window);
                }).appendTo(_caption);
            }
            if (params.sysButtons.btnMin) {
                $("<button/>").addClass("btn-min").on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    _window.toggleClass("minimized");
                    params.sysBtnMinClick(e, _window);
                }).appendTo(_caption);
            }
        }

        if (params.icon) $(params.icon).addClass("icon").appendTo(_caption);
        $("<div/>").addClass("title").html(params.title).appendTo(_caption);

        _content.html(params.content);

        _caption.appendTo(_window);
        _content.appendTo(_window);
                      
        if (params.width !== 'auto') _window.css('min-width', params.width);
        if (params.height !== 'auto') _window.css('min-height', params.height);

        var _show = function(obj) {
          obj.hide().appendTo($("body"));
          if (params.effect === 'slide') 
            obj.slideDown('fast');
           else if (params.effect === 'fade') 
            obj.fadeIn('fast');
           else 
            obj.show();
        };
        
        if (params.overlay) {
            _overlay = $("<div/>").addClass("metro window-overlay").attr("z-index",_zindex++);
            _overlay.css({ backgroundColor: 'rgba(0,0,0,.7)' });
          _window.appendTo(_overlay);
          _show(_overlay);
        }
        else
          _show(_window);
          
        _window.css("position", params.position.absolute?"absolute":"fixed").css("z-index", _zindex);
        
        addTouchEvents(_window[0]);

        if(params.draggable) {
            _caption.on("mousedown", function(e) {
                if(_window.hasClass("maximized")||_window.hasClass("minimized")) return false;
                $.Dialog.drag = true;
                _caption.css('cursor', 'move');

                var z_idx = _window.css('z-index'),
                    drg_h = _window.outerHeight(),
                    drg_w = _window.outerWidth(),
                    pos_y = _window.offset().top + drg_h - e.pageY,
                    pos_x = _window.offset().left + drg_w - e.pageX;

                _window.css('z-index', 99999).parents().on("mousemove", function(e) {
                    var t = (e.pageY > 0)?(e.pageY + pos_y - drg_h):(0);
                    var l = (e.pageX > 0)?(e.pageX + pos_x - drg_w):(0);

                    if ($.Dialog.drag) {
                        if(t >= 0 && t <= window.innerHeight - _window.outerHeight()) {
                            _window.offset({top: t});
                        }
                        if(l >= 0 && l <= window.innerWidth - _window.outerWidth()) {
                            _window.offset({left: l});
                        }
                    }
                });
                e.preventDefault();
            }).on("mouseup", function() {
                _window.removeClass('draggable');
                $.Dialog.drag = false;
                _caption.css('cursor', 'default');
            });
        }

        _window.on('click', function(e){
            e.stopPropagation();
        });

        if (params.overlay && params.overlayClickClose) {
            _overlay.on('click', function(e){
                e.preventDefault();
                $.Dialog.close(_uuid);
            });
        }

        METRO_DIALOGS[_uuid] = {
          window: _window[0],
          uuid: _uuid,
          position: params.position,
          onclose: params.onClose,
          effect: params.overlay?false:params.effect,
          draggable: params.draggable
        };
        params.onShow(_window);

        $.Dialog.autoResize(_uuid);
        
        return _window;
    };
	/** 
	 * @name metro.Dialog#content
	 * @description Replaces the content of the specified Dialog
	 * @function
	 * @param {int} _uuid - The id of the window. Stored in $(".window").data("uuid")
	 * @param {(string|HTMLElement)} newContent - The content that will fill the dialog. If undefined, the function will return the current dialog's html 
	 */
    $.Dialog.content = function(_uuid, newContent) {
        if(undefined===_uuid || !$.Dialog(_uuid).length) return false;
        if(newContent!==undefined) {
            $.Dialog(_uuid).children(".content").html(newContent);
            $.Dialog.autoResize(_uuid);
            return true;
        } else {
            return $.Dialog(_uuid).children(".content").html();
        }
    };
	/**
	 * @name metro.Dialog#title
	 * @description Set the title of the specified Dialog
	 * @function
	 * @param {int} _uuid - The id of the window. Stored in $(".window").data("uuid")
	 * @param {(string|HTMLElement)} newTitle - The new title of the Dialog. If undefined, the function will return the current title of the specified Dialog
	 */
    $.Dialog.title = function(_uuid, newTitle) {
        if(undefined===_uuid || !$.Dialog(_uuid).length) return false;
        
        var _title = $.Dialog(_uuid).children('.caption').children('.title');

        if(newTitle!==undefined) {
            return _title.html(newTitle);
        } else {
            return _title.html();
        }
    };
	/** 
	 * @name metro.Dialog#autoResize
	 * @description resize and eventually repositions Dialog(s)
	 * @function
	 * @param {int} _uuid - The id of the Dialog. If undefined ALL Dialogs will be resized [and repositioned]
	 */
    $.Dialog.autoResize = function(_uuid) {
        if(!$.isNumeric(_uuid)) {
          $.each($("div.window"), function(i, el) {
            $.Dialog.autoResize($(el).data("uuid"));
          });
          return false;
        }
        
        if(!$.Dialog(_uuid).length) return false;
        var _window = $.Dialog(_uuid);
        
        var _content = _window.children('.content'), b, d, p = METRO_DIALOGS[_uuid].position;
        var css = {
          innerWidth: _content.outerWidth(),
          innerHeight: _content.outerHeight()
        };
        if(p==="default") 
          $.extend(css, {
            top: ($(window).height() - _window.outerHeight()) / 2,
            left: ($(window).width() - _window.outerWidth()) / 2
          });
        else {
          if(p.top !== undefined)
            css.top = parseInt(p.top)+(p.absolute?$(window).scrollTop():0);
          else if(p.bottom !== undefined)
            css.bottom = p.bottom;
          else 
            css.top = ($(window).height() - _window.outerHeight()) / 2;
          if(p.left !== undefined)
            css.left = p.left;
          else if(p.right !== undefined)
            css.right = p.right;
          else 
            css.left = ($(window).width() - _window.outerWidth()) / 2;
        }
        _window.css(css);
        return true;
    };

	/**
	 * @name metro.Dialog#close
	 * @descriptions Closes the selected Dialog(s)
	 * @param {(int|array)} _uuid - The id (or an array of ids) of the Dialog(s) to remove. If undefined ALL dialogs will be closed
	 */
    $.Dialog.close = function(_uuid) {
        if(undefined===_uuid)
          return $("div.window").each(function() { 
						$.Dialog.close($(this).data("uuid"));
					});
        
        if(Object.prototype.toString.call( _uuid ) === '[object Array]') {
					return $.each(_uuid, function(i, uuid) {
						$.Dialog.close(uuid);
					});
				}
				
        if(!$.Dialog(_uuid).length || METRO_DIALOGS[_uuid]===false) 
					return false;

        var _overlay = $.Dialog(_uuid).parent(".window-overlay");
        if(_overlay.length) 
          _overlay.fadeOut(function(){
              $(this).remove();
          });

        var _hide = function(effect, obj, cb) {
          if (effect === 'slide') 
            obj.slideUp('fast');
           else if (effect === 'fade') 
            obj.fadeOut('fast');
           else 
            obj.hide();
           cb();
        };
        
        _hide(METRO_DIALOGS[_uuid].effect, $.Dialog(_uuid), function(){
            if($.isFunction(METRO_DIALOGS[_uuid].onclose)) METRO_DIALOGS[_uuid].onclose();
            METRO_DIALOGS[_uuid] = false;
            $.Dialog(_uuid).remove();
        });

        return false;
    };
})(jQuery);


(function($) {
	/** 
	 * @namespace metro.Confirm
	 * @description Create a confirm window, based on {@link metro.Dialog}
	 * @function
	 * @param {string} message - The message shown in the dialog
	 * @param {function} callback - This will triggered when user clicks on OK button (Default: $.noop)
	 * @param {object} options - An object formatted like {@link metro.Dialog} params. Some of these (title, content, flat, overlay, onShow) will be overwritten
	 */
  $.Confirm = function(message, callback, options) {
    $.Confirm.callback = $.isFunction(callback) ? callback   : $.noop;
    options = $.extend({
      title: message,
      content: message + '<br /><br />',
      flat: true,
      overlay: true,
      onShow: function(_d) {
        var cn = _d.children('.content').css('width', '400'),
            id = _d.data("uuid"),
            cl = $('<button>').css({
              float: 'right',
              marginRight: 5,
              marginTop: -10
            }).appendTo(cn).text('Cancel').on('click', function() {
              $.Dialog.close(id);
            }),
            cr = $('<button>').css({
              float: 'right',
              marginRight: 10,
              marginTop: -10
            }).appendTo(cn).text('OK').on('click', function() {
              $.Confirm.callback();
              $.Dialog.close(id);
            }).focus();
        $('<br />').appendTo(cn);
        $.Dialog.autoResize(id);
      }
    }, options);
    options.overlayClickClose = false;
    options.padding = 5;
    $.Dialog(options);
  };
}(jQuery));

(function($) {
	var _notify_container = false;
	var _notifies = [];
/**
 * @class Notify
 * @description Shows notifications
 */
	var Notify = /** @lends Notify */ {
		_container: null,
		_notify: null,
		_timer: null,
	/** 
	 * @type {object}
	 * @prop {string} caption - Caption of the notifications (Default: "")
	 * @prop {string} content - Content of the notifications (Default: "")
	 * @prop {bool} shadow - If true the notification box will have a shadow (Default: true)
	 * @prop {int} width - Width of the notify box (Default: "auto")
	 * @prop {int} height - Height of the notify box (Default: "auto")
	 * @prop {object} style - CSS style of the notify
	 * @prop {string} position - Side on which notifications will appear (left, right) (Default: "right")
	 * @prop {int} timeout - Time after which notification will disappear [ms] (Default: 3000)
	 * @prop {function} onShow - Triggered when notify shows up (Default: function(notify) {})
	 * @prop {function} onClick - Triggered on notify click (Default: function(event, notify) {})
	 */
		options: {
			caption: '',
			content: '',
			shadow: true,
			width: 'auto',
			height: 'auto',
			style: false, // {background: '', color: ''}
			position: 'right', //right, left
			timeout: 3000,
			icon: false,
      onShow: function(notify) {},
      onClick: function(event, notify) {}
		},
		/**
		 * @function
		 * @param {Notify.options} options - Set options for notify box
		 */
		init: function(options) {
			this.options = $.extend({}, this.options, options);
			this._build();
			return this;
		},
		_build: function() {
			this._container = _notify_container || $("<div/>").addClass("metro notify-container").appendTo('body');
			_notify_container = this._container;
			var o = this.options;
			if (o.content === '' || o.content === undefined) return false;
			_notify = this._notify = $("<div/>").addClass("notify").css("float","left");
			if (o.shadow) this._notify.addClass("shadow");
      if (o.style && o.style.background !== undefined) this._notify.css("background-color", o.style.background);
      if (o.style && o.style.color !== undefined) this._notify.css("color", o.style.color);
			// add icon
			if(o.icon) {
				$("<img/>").css({float: "left", width: "30px", margin: "0px 5px"}).attr("src",o.icon).appendTo(this._notify);
			}
			// add title
      if (o.caption !== '' && o.caption !== undefined) {
          $("<div/>").addClass("caption").html(o.caption).css("float","left").appendTo(this._notify);
      }
      // add content
      if (o.content !== '' && o.content !== undefined) {
          $("<div/>").addClass("content").html(o.content).css("float","left").appendTo(this._notify);
      }
      if(o.onClick) {
        this._notify.on("click",function(e) {
          e.stopPropagation();
          o.onClick(e,$(this));
        });
      }
			if (o.width !== 'auto') this._notify.css('min-width', o.width);
      if (o.height !== 'auto') this._notify.css('min-height', o.height);
			this._notify.hide().appendTo(this._container).fadeIn('slow');
      _notifies.push(this._notify);
			if($.isFunction(o.onShow)) o.onShow(this._notify);
			this.close(o.timeout);
			o.close = function() {
				_notify.hide();
			}
		},
		/**
		 * @description set closure of a notification
		 * @function 
		 * @param {int} timeout - Timeout [ms]
		 */
		close: function(timeout) {
			this.clear();
			if(timeout === parseInt(timeout)) {
				var self = this;
				this._timer = setTimeout(function() {
					self._timer = null;
					self._hide();
				}, timeout);
				return this;
			} else if(timeout === undefined) {
				return this._hide();
			}
			return this;
		},
		/**
		 * @description stops a notification's closure
		 * @function
		 */
		clear: function() {
			if(this._timer !== null) {
				clearTimeout(this._timer);
				this._timer = null;
				return this;
			} else {
				return false;
			}
		},
		
		_hide: function() {
			this.clear();
		
			if(this._notify !== undefined) {
          this._notify.hide('slow', function() {
					this.remove();
					_notifies.splice(_notifies.indexOf(this._notify), 1);
				});
				return this;
			} else {
				return false;
			}
		},
		/** 
		 * @description Closes all notifications
		 * @function
		 */
		closeAll: function() {
			_notifies.forEach(function(notEntry) {
				notEntry.hide('slow', function() {
					notEntry.remove();
					_notifies.splice(_notifies.indexOf(notEntry), 1);
				});
			});
			return this;
		}
	};
	/**
	 * @namespace metro.Notify
	 * @description Shows a {@link Notify}
	 */
	$.Notify = function(options) {
		return Object.create(Notify).init(options);
	};
	/**
	 * @name metro.Notify.show
	 * @function
	 * @param {string} message - The message of the notification
	 * @param {(string|function)} title - if is a string rapresents the title of the notify. If is a function rapresents the onClick
	 */
	$.Notify.show = function(message, onclick) {
    if($.isFunction(title))
      return $.Notify({
        content: message,
        onClick: onclick
      });
    else
      return $.Notify({
        content: message
      });
   };
	
})(jQuery);

$(function(){
    $.Metro.initAll();
});
