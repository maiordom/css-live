(function(exports) {
    'use strict';

    function addZeros(num, no) {
        var str = num.toString();
        var zero = '';
        var len = str.length;
        var total = no + 1;

        if (len < total) {
            var zeroTotal = total - len;

            for (var i = 1; i <= zeroTotal; i++) {
                zero += '0';
            }

            str = zero + str;
        }

        return str;
    }

    function Control(el) {
        this.init(el);
    }

    Control.prototype = {
        init: function(el) {
            this.el = el;
            this.states = this.el.find('li');
            this.currentIndex = 0;
        },

        process: function (value) {
            this.toggle();
            this.setValue(value);
        },

        toggle: function() {
            var active = this.states.filter('.active');

            if (active.is(':last-child')) {
                this.states.removeClass('before');
                active.addClass('before').removeClass('active');
                active = this.states.eq(0);
                active.addClass('active');
                this.currentIndex = 0;
            } else {
                this.states.removeClass('before');
                active.addClass('before').removeClass('active');
                this.states.eq(1).addClass('active');
                this.currentIndex = 1;
            }
        },

        setValue: function (value) {
            var formatedValue = addZeros(value, 1);
            var nextState = this.states.eq(this.currentIndex);

            nextState.find('.flip__text').html(formatedValue);
        }
    };

    function HoursControl(el) {
        this.init(el);
    }

    $.extend(HoursControl.prototype, Control.prototype, {
        process: function (value) {
            this.toggle();
            this.setValue(value);
            this.setAM();
        },

        setAM: function (hours) {
            var apm = 'AM';
            if (hours > 12) {
                hours = hours - 12;
                apm = 'PM';
            } else if (hours == 12) {
                apm = 'PM';
            }

            var nextState = this.states.eq(this.curr);
            nextState.find('.flip__apm').html(apm);
        }
    });

    function FlipClock() {
        this.isPaused = false;
        this.flipClock = $('#flip');
    }

    FlipClock.prototype = {
        init: function() {
            this.isPaused = false;
            this.secondsControl = new Control(this.flipClock.find('.flip__second'));
            this.minutesControl = new Control(this.flipClock.find('.flip__minute'));
            this.hoursControl = new HoursControl(this.flipClock.find('.flip__hour'));
        },

        getTime: function() {
            var currentTime = new Date();

            return {
                value: currentTime,
                seconds: currentTime.getSeconds(),
                minutes: currentTime.getMinutes(),
                hours: currentTime.getHours()
            };
        },

        start: function() {
            var time = this.getTime();

            this.currentTime = time;
            this.secondsControl.process(time.seconds);
            this.minutesControl.process(time.minutes);
            this.hoursControl.process(time.hours);

            clearTimeout(this.timeoutCallback);
            this.timeoutCallback = setTimeout(this.engine.bind(this), 1000);
        },

        pause: function() {
            this.isPaused = true;
            clearTimeout(this.timeoutCallback);
        },

        resume: function() {
            this.isPaused = false;
            this.engine();
        },

        engine: function() {
            if (this.isPaused) {
                return;
            }

            clearTimeout(this.timeoutCallback);
            this.timeoutCallback = setTimeout(this.engine.bind(this), 1000);

            var time = this.getTime();

            if (this.currentTime.seconds !== time.seconds) {
                this.currentTime.seconds = time.seconds;
                this.secondsControl.process(time.seconds);
            }

            if (this.currentTime.minutes !== time.minutes) {
                this.currentTime.minutes = time.minutes;
                this.minutesControl.process(time.minutes);
            }

            if (this.currentTime.hours !== time.hours) {
                this.currentTime.hours = time.hours;
                this.hoursControl.process(time.hours);
            }
        }
    };

    exports.FlipClock = FlipClock;
})(window);
