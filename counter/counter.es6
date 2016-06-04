'use strict';

class Counter {
    constructor() {
        let led = $('.energy-meter__item_led');
        let lum = $('.energy-meter__item_lum');
        let numberHeight = 29;
        let numbersCount = 10;
        let ledTimePerOne = 3600;
        let lumTimePerOne = 1600;

        this.reelAnimation(led, ledTimePerOne * numbersCount, numberHeight * numbersCount);
        this.reelAnimation(lum, lumTimePerOne * numbersCount, numberHeight * numbersCount);
        
        this.trackerAnimation(led, ledTimePerOne)();
        this.trackerAnimation(lum, lumTimePerOne)();
    }

    reelAnimation(el, time, value) {
        let numbers = el.find('.energy-reel__numbers');
        let k = 1;

        for (let i = numbers.length - 1; i >= 0; i += -1) {
            let animationObject = this.reelNumberAnimation(numbers.eq(i), time * k, value);
            animationObject.play();
            k *= 10;
        }
    }

    reelNumberAnimation(el, dur, value) {
        let entity;
        let that = this;

        function callback() {
            entity = that.animateBg.apply(null, args);
            entity.play();
        }

        let args = [el, dur, value, callback];

        return {
            stop() {
                entity.stop();
            },

            play() {
                entity = that.animateBg.apply(null, args);
                entity.play();
            }
        };
    }

    trackerAnimation(el, time) {
        let elTracker = el.find('.energy-meter__tracker')
        let elTrackerWidth = elTracker.width()
        let elTrackWidth = el.find('.energy-meter__track').width()        

        return function animate() {
            return elTracker.stop()
                .css('left', - elTrackerWidth)
                .animate({left: elTrackWidth + elTrackerWidth}, time, animate);
        }
    }

    animateBg(el, duration, value, callback) {
        let backgroundPosition = el.css('backgroundPosition').split(' ');
        let x = parseInt(backgroundPosition[0]);
        let y = parseInt(backgroundPosition[1]);
        let startValue = y;
        let startTime = (new Date()).getTime();
        let interval;
        let prevValue;
        let currentValue;

        let tick = () => {
            let prevValue = currentValue;
            let currentTime = (new Date()).getTime();
            let remaining = Math.max(0, startTime + duration - currentTime);
            let temp = remaining / duration || 0;
            let percent = 1 - temp;
            let currentValue = (startValue + value * percent).toFixed(1);
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
        }

        return {
            play() {
                interval = setInterval(tick, 13);
            },

            stop() {
                clearInterval(interval);
            }
        }
    }
}

$(document).ready(() => {
    new Counter();
});