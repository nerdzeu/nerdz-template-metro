var METRO_LOCALE, METRO_WEEK_START;
(function (c) {
    c.Metro = function (a) {
        c.extend({}, a)
    };
    c.Metro.initAccordions = function () {
        c("[data-role=accordion]").accordion()
    };
    c.Metro.initCalendars = function () {
        c("[data-role=calendar]").calendar()
    };
    c.Metro.initDatepickers = function () {
        c("[data-role=datepicker]").datepicker()
    };
    c.Metro.initDropdowns = function () {
        c("[data-role=dropdown]").dropdown()
    };
    c.Metro.initInputs = function () {
        c("[data-role=input-control], .input-control").inputControl()
    };
    c.Metro.transformInputs = function () {
        c("[data-transform=input-control]").inputTransform()
    };
    c.Metro.initDragTiles = function () {
        c("[data-role=drag-drop]").dragtile()
    }
})(jQuery);
(function (c) {
    c.Metro.currentLocale = "en";
    c.Metro.currentLocale = void 0 != METRO_LOCALE ? METRO_LOCALE : "en";
    c.Metro.Locale = {
        en: {
            months: "January February March April May June July August September October November December Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
            days: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday Su Mo Tu We Th Fr Sa".split(" "),
            buttons: ["Today", "Clear"]
        },
        fr: {
            months: "Janvier F\u00e9vrier Mars Avril Peut Juin Juillet Ao\u00fbt Septembre Octobre Novembre D\u00e9cembre Jan F\u00e9v Mar Avr Peu Jun Jul Ao\u00fb Sep Oct Nov D\u00e9c".split(" "),
            days: "Sunday Lundi Mardi Mercredi Jeudi Vendredi Samedi Sn Ln Md Mc Ju Vn Sm".split(" "),
            buttons: ["Aujourd", "Effacer"]
        },
        ua: {
            months: "\u0421\u0456\u0447\u0435\u043d\u044c \u041b\u044e\u0442\u0438\u0439 \u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c \u041a\u0432\u0456\u0442\u0435\u043d\u044c \u0422\u0440\u0430\u0432\u0435\u043d\u044c \u0427\u0435\u0440\u0432\u0435\u043d\u044c \u041b\u0438\u043f\u0435\u043d\u044c \u0421\u0435\u0440\u043f\u0435\u043d\u044c \u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c \u0416\u043e\u0432\u0442\u0435\u043d\u044c \u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434 \u0413\u0440\u0443\u0434\u0435\u043d\u044c \u0421\u0456\u0447 \u041b\u044e\u0442 \u0411\u0435\u0440 \u041a\u0432\u0456 \u0422\u0440\u0430 \u0427\u0435\u0440 \u041b\u0438\u043f \u0421\u0435\u0440 \u0412\u0435\u0440 \u0416\u043e\u0432 \u041b\u0438\u0441 \u0413\u0440\u0443".split(" "),
            days: "\u041d\u0435\u0434\u0456\u043b\u044f \u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0421\u0435\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440 \u041f\u2019\u044f\u0442\u043d\u0438\u0446\u044f \u0421\u0443\u0431\u043e\u0442\u0430 \u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "),
            buttons: ["\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456", "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u0438"]
        },
        ru: {
            months: "\u042f\u043d\u0432\u0430\u0440\u044c \u0424\u0435\u0432\u0440\u0430\u043b\u044c \u041c\u0430\u0440\u0442 \u0410\u043f\u0440\u0435\u043b\u044c \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433\u0443\u0441\u0442 \u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u041e\u043a\u0442\u044f\u0431\u0440\u044c \u041d\u043e\u044f\u0431\u0440\u044c \u0414\u0435\u043a\u0430\u0431\u0440\u044c \u042f\u043d\u0432 \u0424\u0435\u0432 \u041c\u0430\u0440 \u0410\u043f\u0440 \u041c\u0430\u0439 \u0418\u044e\u043d \u0418\u044e\u043b \u0410\u0432\u0433 \u0421\u0435\u043d \u041e\u043a\u0442 \u041d\u043e\u044f \u0414\u0435\u043a".split(" "),
            days: "\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0412\u0442\u043e\u0440\u043d\u0438\u043a \u0421\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440\u0433 \u041f\u044f\u0442\u043d\u0438\u0446\u0430 \u0421\u0443\u0431\u0431\u043e\u0442\u0430 \u0412\u0441 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "),
            buttons: ["\u0421\u0435\u0433\u043e\u0434\u043d\u044f", "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c"]
        },
        zhCN: {
            months: "\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708 \u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "),
            days: "\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d \u65e5 \u4e00 \u4e8c \u4e09 \u56db \u4e94 \u516d".split(" "),
            buttons: ["\u4eca\u65e5", "\u6e05\u9664"]
        }
    };
    c.Metro.setLocale = function (a, b) {
        c.Metro.Locale[a] = b
    }
})(jQuery);
var hasTouch = "ontouchend" in window,
    eventTimer, moveDirection = "undefined",
    startX, startY, deltaX, deltaY, mouseDown = !1;
function addTouchEvents(c) {
    hasTouch && (c.addEventListener("touchstart", touch2Mouse, !0), c.addEventListener("touchmove", touch2Mouse, !0), c.addEventListener("touchend", touch2Mouse, !0))
}
function touch2Mouse(c) {
    var a = c.changedTouches[0],
        b;
    switch (c.type) {
    case "touchstart":
        b = "mousedown";
        break;
    case "touchend":
        b = "mouseup";
        break;
    case "touchmove":
        b = "mousemove";
        break;
    default:
        return
    }
    "mousedown" == b && (eventTimer = (new Date).getTime(), startX = a.clientX, startY = a.clientY, mouseDown = !0);
    "mouseup" == b && (500 >= (new Date).getTime() - eventTimer ? b = "click" : 1E3 < (new Date).getTime() - eventTimer && (b = "longclick"), eventTimer = 0, mouseDown = !1);
    "mousemove" == b && mouseDown && (deltaX = a.clientX - startX, deltaY = a.clientY - startY,
        moveDirection = deltaX > deltaY ? "horizontal" : "vertical");
    var d = document.createEvent("MouseEvent");
    d.initMouseEvent(b, !0, !0, window, 1, a.screenX, a.screenY, a.clientX, a.clientY, !1, !1, !1, !1, 0, null);
    a.target.dispatchEvent(d);
    c.preventDefault()
};
var dateFormat = function () {
    var c = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        a = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        b = /[^-+\dA-Z]/g,
        d = function (a, b) {
            a = String(a);
            for (b = b || 2; a.length < b;) a = "0" + a;
            return a
        };
    return function (e, f, g) {
        var h = dateFormat;
        1 != arguments.length || ("[object String]" != Object.prototype.toString.call(e) || /\d/.test(e)) || (f = e, e = void 0);
        e = e ? new Date(e) : new Date;
        f = String(h.masks[f] ||
            f || h.masks["default"]);
        "UTC:" == f.slice(0, 4) && (f = f.slice(4), g = !0);
        locale = $.Metro.currentLocale;
        var k = g ? "getUTC" : "get",
            h = e[k + "Date"](),
            l = e[k + "Day"](),
            p = e[k + "Month"](),
            n = e[k + "FullYear"](),
            m = e[k + "Hours"](),
            q = e[k + "Minutes"](),
            u = e[k + "Seconds"](),
            k = e[k + "Milliseconds"](),
            r = g ? 0 : e.getTimezoneOffset(),
            s = {
                d: h,
                dd: d(h),
                ddd: $.Metro.Locale[locale].days[l],
                dddd: $.Metro.Locale[locale].days[l + 7],
                m: p + 1,
                mm: d(p + 1),
                mmm: $.Metro.Locale[locale].months[p],
                mmmm: $.Metro.Locale[locale].months[p + 12],
                yy: String(n).slice(2),
                yyyy: n,
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
                t: 12 > m ? "a" : "p",
                tt: 12 > m ? "am" : "pm",
                T: 12 > m ? "A" : "P",
                TT: 12 > m ? "AM" : "PM",
                Z: g ? "UTC" : (String(e).match(a) || [""]).pop().replace(b, ""),
                o: (0 < r ? "-" : "+") + d(100 * Math.floor(Math.abs(r) / 60) + Math.abs(r) % 60, 4),
                S: ["th", "st", "nd", "rd"][3 < h % 10 ? 0 : (10 != h % 100 - h % 10) * h % 10]
            };
        return f.replace(c, function (a) {
            return a in s ? s[a] : a.slice(1, a.length - 1)
        })
    }
}();
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
dateFormat.i18n = {
    dayNames: "Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    monthNames: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December".split(" ")
};
Date.prototype.format = function (c, a) {
    return dateFormat(this, c, a)
};
(function (c) {
    c.widget("metro.calendar", {
        version: "1.0.0",
        options: {
            format: "yyyy-mm-dd",
            multiSelect: !1,
            startMode: "day",
            weekStart: void 0 != METRO_WEEK_START ? METRO_WEEK_START : 0,
            otherDays: !1,
            date: new Date,
            buttons: !0,
            locale: c.Metro.currentLocale,
            getDates: function (a) {},
            click: function (a, b) {},
            _storage: []
        },
        _year: 0,
        _month: 0,
        _day: 0,
        _today: new Date,
        _event: "",
        _mode: "day",
        _distance: 0,
        _events: [],
        _create: function () {
            var a = this.element;
            void 0 != a.data("multiSelect") && (this.options.multiSelect = a.data("multiSelect"));
            void 0 !=
                a.data("format") && (this.options.format = a.data("format"));
            void 0 != a.data("date") && (this.options.date = new Date(a.data("date")));
            void 0 != a.data("locale") && (this.options.locale = a.data("locale"));
            void 0 != a.data("startMode") && (this.options.startMode = a.data("startMode"));
            void 0 != a.data("weekStart") && (this.options.weekStart = a.data("weekStart"));
            void 0 != a.data("otherDays") && (this.options.otherDays = a.data("otherDays"));
            this._year = this.options.date.getFullYear();
            this._distance = parseInt(this.options.date.getFullYear()) -
                4;
            this._month = this.options.date.getMonth();
            this._day = this.options.date.getDate();
            this._mode = this.options.startMode;
            a.data("_storage", []);
            this._renderCalendar()
        },
        _renderMonth: function () {
            var a = this._year,
                b = this._month,
                d = 28;
            1 == b && (0 != a % 100 && 0 == a % 4 || 0 == a % 400) && (d = 29);
            var e = ["31", "" + d + "", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"],
                f = e[b],
                g = (new Date(a, b, 1)).getDay(),
                h, k;
            this.element.html("");
            d = c("<table/>").addClass("bordered");
            h = c("<tr/>");
            c("<td/>").addClass("text-center").html("<a class='btn-previous-year' href='#'><i class='icon-previous'></i></a>").appendTo(h);
            c("<td/>").addClass("text-center").html("<a class='btn-previous-month' href='#'><i class='icon-arrow-left-4'></i></a>").appendTo(h);
            c("<td/>").attr("colspan", 3).addClass("text-center").html("<a class='btn-select-month' href='#'>" + c.Metro.Locale[this.options.locale].months[b] + " " + a + "</a>").appendTo(h);
            c("<td/>").addClass("text-center").html("<a class='btn-next-month' href='#'><i class='icon-arrow-right-4'></i></a>").appendTo(h);
            c("<td/>").addClass("text-center").html("<a class='btn-next-year' href='#'><i class='icon-next'></i></a>").appendTo(h);
            h.addClass("calendar-header").appendTo(d);
            var l;
            h = c("<tr/>");
            for (k = 0; 7 > k; k++) this.options.weekStart ? (l = k + 1, 7 == l && (l = 0), c("<td/>").addClass("text-center day-of-week").html(c.Metro.Locale[this.options.locale].days[l + 7]).appendTo(h)) : c("<td/>").addClass("text-center day-of-week").html(c.Metro.Locale[this.options.locale].days[k + 7]).appendTo(h);
            h.addClass("calendar-subheader").appendTo(d);
            h = this._month - 1;
            0 > h && (h = 11);
            e = e[h];
            l = (this.options.weekStart ? g + 6 : g) % 7;
            var p = "";
            h = c("<tr/>");
            for (k = 0; k < l; k++) this.options.otherDays &&
                (p = e - (l - k - 1)), c("<td/>").addClass("empty").html("<small class='other-day'>" + p + "</small>").appendTo(h);
            g = (this.options.weekStart ? g + 6 : g) % 7;
            for (k = 1; k <= f; k++) g %= 7, 0 == g && (h.appendTo(d), h = c("<tr/>")), e = c("<td/>").addClass("text-center day").html("<a href='#'>" + k + "</a>"), a == this._today.getFullYear() && (b == this._today.getMonth() && this._today.getDate() == k) && e.addClass("today"), l = (new Date(this._year, this._month, k)).format("yyyy-mm-dd"), 0 <= this.element.data("_storage").indexOf(l) && e.find("a").addClass("selected"),
            e.appendTo(h), g++;
            a = "";
            for (k = g + 1; 7 >= k; k++) this.options.otherDays && (a = k - g), c("<td/>").addClass("empty").html("<small class='other-day'>" + a + "</small>").appendTo(h);
            h.appendTo(d);
            this.options.buttons && (h = c("<tr/>").addClass("calendar-actions"), e = c("<td/>").attr("colspan", 7).addClass("text-left").html("<button class='button calendar-btn-today small success'>" + c.Metro.Locale[this.options.locale].buttons[0] + "</button>&nbsp;<button class='button calendar-btn-clear small warning'>" + c.Metro.Locale[this.options.locale].buttons[1] +
                "</button>"), e.appendTo(h), h.appendTo(d));
            d.appendTo(this.element);
            this.options.getDates(this.element.data("_storage"))
        },
        _renderMonths: function () {
            var a, b, d, e, f;
            this.element.html("");
            a = c("<table/>").addClass("bordered");
            b = c("<tr/>");
            c("<td/>").addClass("text-center").html("<a class='btn-previous-year' href='#'><i class='icon-arrow-left-4'></i></a>").appendTo(b);
            c("<td/>").attr("colspan", 2).addClass("text-center").html("<a class='btn-select-year' href='#'>" + this._year + "</a>").appendTo(b);
            c("<td/>").addClass("text-center").html("<a class='btn-next-year' href='#'><i class='icon-arrow-right-4'></i></a>").appendTo(b);
            b.addClass("calendar-header").appendTo(a);
            b = c("<tr/>");
            for (e = f = 0; 12 > e; e++) d = c("<td/>").addClass("text-center month").html("<a href='#' data-month='" + e + "'>" + c.Metro.Locale[this.options.locale].months[e + 12] + "</a>"), this._month == e && (new Date).getFullYear() == this._year && d.addClass("today"), d.appendTo(b), 0 == (f + 1) % 4 && (b.appendTo(a), b = c("<tr/>")), f += 1;
            a.appendTo(this.element)
        },
        _renderYears: function () {
            var a, b, d, e, f;
            this.element.html("");
            a = c("<table/>").addClass("bordered");
            b = c("<tr/>");
            c("<td/>").addClass("text-center").html("<a class='btn-previous-year' href='#'><i class='icon-arrow-left-4'></i></a>").appendTo(b);
            c("<td/>").attr("colspan", 2).addClass("text-center").html(this._distance + "-" + (this._distance + 11)).appendTo(b);
            c("<td/>").addClass("text-center").html("<a class='btn-next-year' href='#'><i class='icon-arrow-right-4'></i></a>").appendTo(b);
            b.addClass("calendar-header").appendTo(a);
            b = c("<tr/>");
            f = 0;
            for (e = this._distance; e < this._distance + 12; e++) d = c("<td/>").addClass("text-center year").html("<a href='#' data-year='" + e + "'>" + e + "</a>"), (new Date).getFullYear() == e && d.addClass("today"), d.appendTo(b), 0 == (f +
                1) % 4 && (b.appendTo(a), b = c("<tr/>")), f += 1;
            a.appendTo(this.element)
        },
        _renderCalendar: function () {
            switch (this._mode) {
            case "year":
                this._renderYears();
                break;
            case "month":
                this._renderMonths();
                break;
            default:
                this._renderMonth()
            }
            this._initButtons()
        },
        _initButtons: function () {
            var a = this,
                b = this.element.find("table");
            "day" == this._mode ? (b.find(".btn-select-month").on("click", function (b) {
                b.preventDefault();
                b.stopPropagation();
                a._mode = "month";
                a._renderCalendar()
            }), b.find(".btn-previous-month").on("click", function (b) {
                a._event =
                    "eventPrevious";
                b.preventDefault();
                b.stopPropagation();
                a._month -= 1;
                0 > a._month && (a._year -= 1, a._month = 11);
                a._renderCalendar()
            }), b.find(".btn-next-month").on("click", function (b) {
                a._event = "eventNext";
                b.preventDefault();
                b.stopPropagation();
                a._month += 1;
                12 == a._month && (a._year += 1, a._month = 0);
                a._renderCalendar()
            }), b.find(".btn-previous-year").on("click", function (b) {
                a._event = "eventPrevious";
                b.preventDefault();
                b.stopPropagation();
                a._year -= 1;
                a._renderCalendar()
            }), b.find(".btn-next-year").on("click", function (b) {
                a._event =
                    "eventNext";
                b.preventDefault();
                b.stopPropagation();
                a._year += 1;
                a._renderCalendar()
            }), b.find(".calendar-btn-today").on("click", function (b) {
                a._event = "eventNext";
                b.preventDefault();
                b.stopPropagation();
                a.options.date = new Date;
                a._year = a.options.date.getFullYear();
                a._month = a.options.date.getMonth();
                a._day = a.options.date.getDate();
                a._renderCalendar()
            }), b.find(".calendar-btn-clear").on("click", function (b) {
                b.preventDefault();
                b.stopPropagation();
                a.options.date = new Date;
                a._year = a.options.date.getFullYear();
                a._month =
                    a.options.date.getMonth();
                a._day = a.options.date.getDate();
                a.element.data("_storage", []);
                a._renderCalendar()
            }), b.find(".day a").on("click", function (d) {
                d.preventDefault();
                d.stopPropagation();
                d = (new Date(a._year, a._month, parseInt(c(this).html()))).format(a.options.format, null);
                var e = new Date(a._year, a._month, parseInt(c(this).html()));
                a.options.multiSelect ? (c(this).toggleClass("selected"), c(this).hasClass("selected") ? a._addDate(d) : a._removeDate(d)) : (b.find(".day a").removeClass("selected"), c(this).addClass("selected"),
                    a.element.data("_storage", []), a._addDate(d));
                a.options.getDates(a.element.data("_storage"));
                a.options.click(d, e)
            })) : "month" == this._mode ? (b.find(".month a").on("click", function (b) {
                a._event = "eventNext";
                b.preventDefault();
                b.stopPropagation();
                a._month = parseInt(c(this).data("month"));
                a._mode = "day";
                a._renderCalendar()
            }), b.find(".btn-previous-year").on("click", function (b) {
                a._event = "eventPrevious";
                b.preventDefault();
                b.stopPropagation();
                a._year -= 1;
                a._renderCalendar()
            }), b.find(".btn-next-year").on("click",
                function (b) {
                    a._event = "eventNext";
                    b.preventDefault();
                    b.stopPropagation();
                    a._year += 1;
                    a._renderCalendar()
                }), b.find(".btn-select-year").on("click", function (b) {
                a._event = "eventNext";
                b.preventDefault();
                b.stopPropagation();
                a._mode = "year";
                a._renderCalendar()
            })) : (b.find(".year a").on("click", function (b) {
                a._event = "eventNext";
                b.preventDefault();
                b.stopPropagation();
                a._year = parseInt(c(this).data("year"));
                a._mode = "month";
                a._renderCalendar()
            }), b.find(".btn-previous-year").on("click", function (b) {
                a._event = "eventPrevious";
                b.preventDefault();
                b.stopPropagation();
                a._distance -= 10;
                a._renderCalendar()
            }), b.find(".btn-next-year").on("click", function (b) {
                a._event = "eventNext";
                b.preventDefault();
                b.stopPropagation();
                a._distance += 10;
                a._renderCalendar()
            }))
        },
        _addDate: function (a) {
            0 > this.element.data("_storage").indexOf(a) && this.element.data("_storage").push(a)
        },
        _removeDate: function (a) {
            a = this.element.data("_storage").indexOf(a);
            this.element.data("_storage").splice(a, 1)
        },
        setDate: function (a) {
            a = new Date(a);
            a = (new Date(a.getFullYear() +
                "/" + (a.getMonth() + 1) + "/" + a.getDate())).format("yyyy-mm-dd");
            this._addDate(a);
            this._renderCalendar()
        },
        getDate: function (a) {
            return (new Date(void 0 != a ? this.element.data("_storage")[a] : this.element.data("_storage")[0])).format(this.options.format)
        },
        getDates: function () {
            return this.element.data("_storage")
        },
        unsetDate: function (a) {
            a = new Date(a);
            a = (new Date(a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate())).format("yyyy-mm-dd");
            this._removeDate(a);
            this._renderCalendar()
        },
        _destroy: function () {},
        _setOption: function (a,
            b) {
            this._super("_setOption", a, b)
        }
    })
})(jQuery);
(function (c) {
    c.widget("metro.datepicker", {
        version: "1.0.0",
        options: {
            format: "dd.mm.yyyy",
            date: void 0,
            effect: "none",
            position: "bottom",
            locale: c.Metro.currentLocale,
            weekStart: void 0 != METRO_WEEK_START ? METRO_WEEK_START : 0,
            otherDays: !1,
            selected: function (a, b) {},
            _calendar: void 0
        },
        _create: function () {
            var a = this,
                b = this.element,
                d = b.children("input"),
                e = b.children("button.btn-date");
            void 0 != b.data("date") && (this.options.date = b.data("date"));
            void 0 != b.data("format") && (this.options.format = b.data("format"));
            void 0 !=
                b.data("effect") && (this.options.effect = b.data("effect"));
            void 0 != b.data("position") && (this.options.position = b.data("position"));
            void 0 != b.data("locale") && (this.options.locale = b.data("locale"));
            void 0 != b.data("weekStart") && (this.options.weekStart = b.data("weekStart"));
            void 0 != b.data("otherDays") && (this.options.otherDays = b.data("otherDays"));
            this._createCalendar(b, this.options.date);
            d.attr("readonly", !0);
            e.on("click", function (b) {
                b.stopPropagation();
                "none" == a.options._calendar.css("display") ? a._show() :
                    a._hide()
            });
            b.on("click", function (b) {
                b.stopPropagation();
                "none" == a.options._calendar.css("display") ? a._show() : a._hide()
            });
            c("html").on("click", function (a) {
                c(".calendar-dropdown").hide()
            })
        },
        _createCalendar: function (a, b) {
            var d, e = this;
            d = c("<div/>").css({
                position: "absolute",
                display: "none",
                "max-width": 260,
                "z-index": 1E3
            }).addClass("calendar calendar-dropdown").appendTo(a);
            void 0 != e.options.date && d.data("date", e.options.date);
            d.calendar({
                multiSelect: !1,
                format: e.options.format,
                buttons: !1,
                locale: e.options.locale,
                otherDays: e.options.otherDays,
                weekStart: e.options.weekStart,
                click: function (b, c) {
                    d.calendar("setDate", c);
                    a.children("input[type=text]").val(b);
                    e.options.selected(b, c);
                    e._hide()
                }
            });
            void 0 != b && (d.calendar("setDate", b), a.children("input[type=text]").val(d.calendar("getDate")));
            switch (this.options.position) {
            case "top":
                d.css({
                    top: 0 - d.height(),
                    left: 0
                });
                break;
            default:
                d.css({
                    top: "100%",
                    left: 0
                })
            }
            this.options._calendar = d
        },
        _show: function () {
            "slide" == this.options.effect ? (c(".calendar-dropdown").slideUp("fast"),
                this.options._calendar.slideDown("fast")) : "fade" == this.options.effect ? (c(".calendar-dropdown").fadeOut("fast"), this.options._calendar.fadeIn("fast")) : (c(".calendar-dropdown").hide(), this.options._calendar.show())
        },
        _hide: function () {
            "slide" == this.options.effect ? this.options._calendar.slideUp("fast") : "fade" == this.options.effect ? this.options._calendar.fadeOut("fast") : this.options._calendar.hide()
        },
        _destroy: function () {},
        _setOption: function (a, b) {
            this._super("_setOption", a, b)
        }
    })
})(jQuery);
(function (c) {
    c.widget("metro.dropdown", {
        version: "1.0.0",
        options: {
            effect: "slide"
        },
        _create: function () {
            var a = this,
                b = this.element,
                d = this.name,
                e = this.element.parent().children(".dropdown-toggle");
            void 0 != b.data("effect") && (this.options.effect = b.data("effect"));
            e.on("click." + d, function (d) {
                d.preventDefault();
                d.stopPropagation();
                "block" != b.css("display") || b.hasClass("keep-open") ? (c(".dropdown-menu").each(function (d, e) {
                    b.parents(".dropdown-menu").is(e) || (c(e).hasClass("keep-open") || "block" != c(e).css("display")) ||
                        a._close(e)
                }), a._open(b)) : a._close(b)
            });
            c(b).find("li.disabled a").on("click", function (a) {
                a.preventDefault()
            });
            c("html").on("click", function (b) {
                c(".dropdown-menu").each(function (b, d) {
                    c(d).hasClass("keep-open") || "block" != c(d).css("display") || a._close(d)
                })
            })
        },
        _open: function (a) {
            switch (this.options.effect) {
            case "fade":
                c(a).fadeIn("fast");
                break;
            case "slide":
                c(a).slideDown("fast");
                break;
            default:
                c(a).hide()
            }
            this._trigger("onOpen", null, a)
        },
        _close: function (a) {
            switch (this.options.effect) {
            case "fade":
                c(a).fadeOut("fast");
                break;
            case "slide":
                c(a).slideUp("fast");
                break;
            default:
                c(a).hide()
            }
            this._trigger("onClose", null, a)
        },
        _destroy: function () {},
        _setOption: function (a, b) {
            this._super("_setOption", a, b)
        }
    })
})(jQuery);
(function (c) {
    c.widget("metro.inputControl", {
        version: "1.0.0",
        options: {},
        _create: function () {
            var a = this.element;
            a.hasClass("text") ? this.initTextInput(a, this) : a.hasClass("password") ? this.initPasswordInput() : a.hasClass("checkbox") || a.hasClass("radio") || a.hasClass("switch") ? this.initCheckboxInput(a, this) : a.hasClass("file") && this.initFileInput(a, this)
        },
        initCheckboxInput: function (a, b) {},
        initFileInput: function (a, b) {
            var d, e, f;
            f = c("<input type='text' id='__input_file_wrapper__' readonly style='z-index: 1; cursor: default;'>");
            d = a.children(".btn-file");
            e = a.children('input[type="file"]');
            e.css("z-index", 0);
            f.insertAfter(e);
            e.attr("tabindex", "-1");
            d.attr("type", "button");
            e.on("change", function () {
                var a = c(this).val();
                "" != a && f.val(a)
            });
            d.on("click", function () {
                e.trigger("click")
            })
        },
        initTextInput: function (a, b) {
            var d, c;
            d = a.children(".btn-clear");
            0 != d.length && (d.attr("tabindex", "-1"), d.attr("type", "button"), d.on("click", function () {
                c = a.children("input");
                c.prop("readonly") || (c.val(""), c.focus(), b._trigger("onClear", null, a))
            }))
        },
        initPasswordInput: function () {
            var a =
                this.element.children(".btn-reveal"),
                b = this.element.children("input[type=password]");
            0 != a.length && (a.attr("tabindex", "-1"), a.attr("type", "button"), a.on("mousedown", function (a) {
                b.attr("type", "text")
            }), a.on("mouseup, mouseleave", function (a) {
                b.attr("type", "password").focus()
            }))
        },
        _destroy: function () {},
        _setOption: function (a, b) {
            this._super("_setOption", a, b)
        }
    })
})(jQuery);
(function (c) {
    c.widget("metro.inputTransform", {
        version: "1.0.0",
        options: {
            transformType: "text"
        },
        _create: function () {
            var a = this.element,
                b;
            if (!a.parent().hasClass("input-control")) {
                b = a.get(0).tagName.toLowerCase();
                "textarea" == b ? this.options.transformType = "textarea" : "select" == b ? this.options.transformType = "select" : void 0 != a.data("transformType") ? this.options.transformType = a.data("transformType") : this.options.transformType = a.attr("type");
                a = void 0;
                switch (this.options.transformType) {
                case "password":
                    a = this._createInputPassword();
                    break;
                case "file":
                    a = this._createInputFile();
                    break;
                case "checkbox":
                    a = this._createInputCheckbox();
                    break;
                case "radio":
                    a = this._createInputRadio();
                    break;
                case "switch":
                    a = this._createInputSwitch();
                    break;
                case "select":
                    a = this._createInputSelect();
                    break;
                case "textarea":
                    a = this._createInputTextarea();
                    break;
                case "search":
                    a = this._createInputSearch();
                    break;
                case "email":
                    a = this._createInputEmail();
                    break;
                case "tel":
                    a = this._createInputTel();
                    break;
                default:
                    a = this._createInputText()
                }
                a.inputControl()
            }
        },
        _createInputTextarea: function () {
            var a =
                this.element,
                b = c("<div/>").addClass("input-control").addClass("textarea"),
                d = a.clone(!0);
            a.parent();
            d.appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputSelect: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("select"),
                d = a.clone(!0);
            a.parent();
            d.val(a.val()).appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputSwitch: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("switch"),
                d = c("<label/>"),
                e = c("<span/>").addClass("check"),
                f = a.clone(!0);
            a.parent();
            var g = c("<span/>").addClass("caption").html(void 0 != a.data("caption") ? a.data("caption") : "");
            d.appendTo(b);
            f.appendTo(d);
            e.appendTo(d);
            g.appendTo(d);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputCheckbox: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("checkbox"),
                d = c("<label/>"),
                e = c("<span/>").addClass("check"),
                f = a.clone(!0);
            a.parent();
            var g = c("<span/>").addClass("caption").html(void 0 != a.data("caption") ? a.data("caption") : "");
            d.appendTo(b);
            f.appendTo(d);
            e.appendTo(d);
            g.appendTo(d);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputRadio: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("radio"),
                d = c("<label/>"),
                e = c("<span/>").addClass("check"),
                f = a.clone(!0);
            a.parent();
            var g = c("<span/>").addClass("caption").html(void 0 != a.data("caption") ? a.data("caption") : "");
            d.appendTo(b);
            f.appendTo(d);
            e.appendTo(d);
            g.appendTo(d);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputSearch: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("text"),
                d = c("<button/>").addClass("btn-search"),
                e = a.clone(!0);
            a.parent();
            e.appendTo(b);
            d.appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputTel: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("tel"),
                d = c("<button/>").addClass("btn-clear"),
                e = a.clone(!0);
            a.parent();
            e.appendTo(b);
            d.appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputEmail: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("email"),
                d = c("<button/>").addClass("btn-clear"),
                e = a.clone(!0);
            a.parent();
            e.appendTo(b);
            d.appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputText: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("text"),
                d = c("<button/>").addClass("btn-clear"),
                e = a.clone(!0);
            a.parent();
            e.appendTo(b);
            d.appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputPassword: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("password"),
                d = c("<button/>").addClass("btn-reveal"),
                e = a.clone(!0);
            a.parent();
            e.appendTo(b);
            d.appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _createInputFile: function () {
            var a = this.element,
                b = c("<div/>").addClass("input-control").addClass("file"),
                d = c("<button/>").addClass("btn-file"),
                e = a.clone(!0);
            a.parent();
            e.appendTo(b);
            d.appendTo(b);
            b.insertBefore(a);
            a.remove();
            return b
        },
        _destroy: function () {},
        _setOption: function (a, b) {
            this._super("_setOption", a, b)
        }
    })
})(jQuery);
(function (c) {
    c.widget("metro.dragtile", {
        version: "1.0.0",
        options: {},
        _create: function () {
            var a = (tile = this.element).parents(".tile-area");
            a.find(".tile");
            a.find(".tile-group");
            tile.attr("draggable", "true");
            addTouchEvents(tile[0]);
            tile[0].addEventListener("dragstart", this._dragStart, !1);
            tile[0].addEventListener("dragend", this._dragEnd, !1);
            tile.on("mousedown", function (a) {});
            tile.on("mouseup", function (a) {})
        },
        _dragStart: function (a) {
            c(this).css("opacity", 0.4)
        },
        _dragEnd: function (a) {
            c(this).css("opacity", 1)
        },
        _destroy: function () {},
        _setOption: function (a, b) {
            this._super("_setOption", a, b)
        }
    })
})(jQuery);
(function (c) {
    var a = !1;
    c.Dialog = function (b) {
        if (c.Dialog.opened) return a;
        c.Dialog.opened = !0;
        c.Dialog.settings = b;
        b = c.extend({
            icon: !1,
            title: "",
            content: "",
            flat: !1,
            shadow: !1,
            overlay: !1,
            width: "auto",
            height: "auto",
            position: "default",
            padding: !1,
            overlayClickClose: !0,
            sysButtons: {
                btnClose: !0
            },
            onShow: function (a) {},
            onClose: false
        }, b);
        var d, e, f, g;
        
        e = c("<div/>").addClass("window");
        b.flat && e.addClass("flat");
        b.shadow && e.addClass("shadow").css("overflow",
            "hidden");
        f = c("<div/>").addClass("caption");
        g = c("<div/>").addClass("content");
        g.css({
            paddingTop: 32 + b.padding,
            paddingLeft: b.padding,
            paddingRight: b.padding,
            paddingBottom: b.padding
        });
        b.sysButtons && (b.sysButtons.btnClose && c("<button/>").addClass("btn-close").on("click", function (a) {
                a.preventDefault();
                a.stopPropagation();
                c.Dialog.close(b)
            }).appendTo(f), b.sysButtons.btnMax && c("<button/>").addClass("btn-max").on("click", function (a) {
                a.preventDefault();
                a.stopPropagation()
            }).appendTo(f), b.sysButtons.btnMin &&
            c("<button/>").addClass("btn-min").on("click", function (a) {
                a.preventDefault();
                a.stopPropagation()
            }).appendTo(f));
        b.icon && c(b.icon).addClass("icon").appendTo(f);
        c("<div/>").addClass("title").html(b.title).appendTo(f);
        g.html(b.content);
        f.appendTo(e);
        g.appendTo(e);
        "auto" != b.width && e.css("min-width", b.width);
        "auto" != b.height && e.css("min-height", b.height);
        if(b.overlay)
        {
          d = c("<div/>").addClass("metro window-overlay");
          d.css({ backgroundColor: "rgba(0,0,0,.7)" });
          e.appendTo(d);
          d.hide().appendTo("body").fadeIn("fast");
        }
        else 
          e.hide().appendTo("body").fadeIn("fast");
        a = e;
        e.css("position", "fixed").css("top", (c(window).height() - a.outerHeight()) / 2).css("left", (c(window).width() -
            e.outerWidth()) / 2);
        addTouchEvents(e[0]);
        if (b.draggable) f.on("mousedown", function (a) {
            c.Dialog.drag = !0;
            f.css("cursor", "move");
            var b = e.css("z-index"),
                d = e.outerHeight(),
                g = e.outerWidth(),
                n = e.offset().top + d - a.pageY,
                m = e.offset().left + g - a.pageX;
            e.css("z-index", 99999).parents().on("mousemove", function (a) {
                var h = 0 < a.pageY ? a.pageY + n - d : 0;
                a = 0 < a.pageX ? a.pageX + m - g : 0;
                c.Dialog.drag && (0 <= h && h <= window.innerHeight - e.outerHeight() && e.offset({
                    top: h
                }), 0 <= a && a <= window.innerWidth - e.outerWidth() && e.offset({
                    left: a
                }));
                e.on("mouseup",
                    function () {
                        c(this).removeClass("draggable").css("z-index", b);
                        c.Dialog.drag = !1;
                        f.css("cursor", "default")
                    })
            });
            a.preventDefault()
        }).on("mouseup", function () {
            e.removeClass("draggable");
            c.Dialog.drag = !1;
            f.css("cursor", "default")
        });
        e.on("click", function (a) {
            a.stopPropagation()
        });
        if (b.overlay && b.overlayClickClose) d.on("click", function (a) {
            a.preventDefault();
            c.Dialog.close(b)
        });
        b.onShow(a);
        c.Dialog.autoResize();
        return a
    };
    c.Dialog.content = function (b) {
        if (!c.Dialog.opened) return !1;
        if (b) a.children(".content").html(b), c.Dialog.autoResize();
        else return a.children(".content").html()
    };
    c.Dialog.title = function (b) {
        if (!c.Dialog.opened) return !1;
        var d = a.children(".caption").children(".title");
        b ? d.html(b) : d.html()
    };
    c.Dialog.autoResize = function () {
        if (!c.Dialog.opened) return !1;
        var b = a.children(".content");
        var d = (c(window).height() - a.outerHeight()) / 2,
            e = (c(window).width() - a.outerWidth()) / 2;
        a.css({
            width: b.outerWidth(),
            height: b.outerHeight()
        }).css("top", d<0?0:d).css("left", e)
    };
    c.Dialog.close = function (b) {
        if (!c.Dialog.opened || void 0 == a) return !1;
        if (b.onClose && $.isFunction(b.onClose)) 
          b.onClose();
        a.find("div.content").eq(0).html("");
        c.Dialog.opened = !1;
        b.overlay ? a.parent(".window-overlay").fadeOut(function () { c(this).remove() }) : a.fadeOut(function() {a.remove()});
    }
})(jQuery);
(function (c) {
    var a = !1,
        b = [];
    c.Notify = function (d) {
        d = c.extend({
            icon: "",
            caption: "",
            content: "",
            shadow: !0,
            width: "auto",
            height: "auto",
            style: !1,
            position: "right",
            timeout: 5E3,
            click: false
        }, d);
        var e = a || c("<div/>").addClass("metro notify-container").appendTo("body");
        a = e;
        if ("" != d.content && void 0 != d.content) {
            var f;
            f = c("<div/>").addClass("notify");
            d.shadow && f.addClass("shadow");
            d.style && void 0 != d.style.background && f.css("background-color", d.style.background);
            d.style && void 0 != d.style.color && f.css("color", d.style.color);
            "" != d.caption && void 0 != d.caption && c("<div/>").addClass("caption").html(d.caption).appendTo(f);
            "" != d.content && void 0 != d.content && c("<div/>").addClass("content").html(d.content).appendTo(f);
            "auto" != d.width && f.css("min-width", d.width);
            "auto" != d.height && f.css("min-height", d.height);
            d.click && $.isFunction(d.click) && f.click(d.click);
            f.hide().appendTo(e).fadeIn("slow");
            b.push(f);
            setTimeout(function () {
                c.Notify.close(f)
            }, d.timeout)
        }
    };
    c.Notify.show = function (a, b) {
      $.isFunction(b) ?
        c.Notify({
            content: a,
            click: b
        })
      :
        c.Notify({
            content: a,
            caption: b
        })
    };
    c.Notify.close = function (a) {
        if (void 0 == a) return !1;
        a.fadeOut("slow",
            function () {
                c(this).remove();
                b.splice(b.indexOf(a), 1)
            });
        return !0
    }
})(jQuery);
$(function () {
    $.Metro.initCalendars();
    $.Metro.initDatepickers();
    $.Metro.initDropdowns();
    $.Metro.initInputs();
    $.Metro.transformInputs();
    $.Metro.initDragTiles()
});
