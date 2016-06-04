'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Counter = function () {
    function Counter() {
        _classCallCheck(this, Counter);

        var led = $('.energy-meter__item_led');
        var lum = $('.energy-meter__item_lum');
        var numberHeight = 29;
        var numbersCount = 10;
        var ledTimePerOne = 3600;
        var lumTimePerOne = 1600;

        this.reelAnimation(led, ledTimePerOne * numbersCount, numberHeight * numbersCount);
        this.reelAnimation(lum, lumTimePerOne * numbersCount, numberHeight * numbersCount);

        this.trackerAnimation(led, ledTimePerOne)();
        this.trackerAnimation(lum, lumTimePerOne)();
    }

    Counter.prototype.reelAnimation = function reelAnimation(el, time, value) {
        var numbers = el.find('.energy-reel__numbers');
        var k = 1;

        for (var i = numbers.length - 1; i >= 0; i += -1) {
            var animationObject = this.reelNumberAnimation(numbers.eq(i), time * k, value);
            animationObject.play();
            k *= 10;
        }
    };

    Counter.prototype.reelNumberAnimation = function reelNumberAnimation(el, dur, value) {
        var entity = void 0;
        var that = this;

        function callback() {
            entity = that.animateBg.apply(null, args);
            entity.play();
        }

        var args = [el, dur, value, callback];

        return {
            stop: function stop() {
                entity.stop();
            },
            play: function play() {
                entity = that.animateBg.apply(null, args);
                entity.play();
            }
        };
    };

    Counter.prototype.trackerAnimation = function trackerAnimation(el, time) {
        var elTracker = el.find('.energy-meter__tracker');
        var elTrackerWidth = elTracker.width();
        var elTrackWidth = el.find('.energy-meter__track').width();

        return function animate() {
            return elTracker.stop().css('left', -elTrackerWidth).animate({ left: elTrackWidth + elTrackerWidth }, time, animate);
        };
    };

    Counter.prototype.animateBg = function animateBg(el, duration, value, callback) {
        var backgroundPosition = el.css('backgroundPosition').split(' ');
        var x = parseInt(backgroundPosition[0]);
        var y = parseInt(backgroundPosition[1]);
        var startValue = y;
        var startTime = new Date().getTime();
        var interval = void 0;
        var prevValue = void 0;
        var currentValue = void 0;

        var tick = function tick() {
            var prevValue = currentValue;
            var currentTime = new Date().getTime();
            var remaining = Math.max(0, startTime + duration - currentTime);
            var temp = remaining / duration || 0;
            var percent = 1 - temp;
            var currentValue = (startValue + value * percent).toFixed(1);
            currentValue = parseFloat(currentValue);

            if (currentValue != prevValue) {
                el[0].style.backgroundPosition = x + 'px ' + currentValue + 'px';
            }

            if (percent < 1) {
                return;
            } else {
                clearInterval(interval);
                callback && callback();
            }
        };

        return {
            play: function play() {
                interval = setInterval(tick, 13);
            },
            stop: function stop() {
                clearInterval(interval);
            }
        };
    };

    return Counter;
}();

$(document).ready(function () {
    new Counter();
});