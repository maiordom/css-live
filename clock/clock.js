var FlipClock = function () {
    var isPaused = false,
        saveSec, saveMin, saveHou,
        Second, Minute, Hour,
        timeoutCallback,
        flipClock = $( "#flipclock" );

    function addZeros( num, no ) {
        var str   = num.toString(),
            zero  = "",
            len   = str.length,
            total = no + 1;

        if ( len < total ) {
            var zeroTotal = total - len, i;

            for ( i = 1; i <= zeroTotal; i++ ) {
                zero += "0";
            }

            str = zero + str;
        }
        return str;
    }

    function init() {
        isPaused = false;
        Second = new Control( '.flip-second' );
        Minute = new Control( '.flip-minute' );
        Hour   = new Control( '.flip-hour' );

        Hour._setValue = Hour.setValue;
        Hour.setValue = function( hours ) {
            this._setValue( hours );

            var apm = "AM";
            if ( hours > 12 ) {
                hours = hours - 12;
                apm = "PM";
            } else if ( hours == 12 ) {
                apm = "PM";
            }

            var nextli = this.els.eq( this.curr );
            nextli.find( ".flip-apm" ).html( apm );
        };
    }

    function getTime() {
        var currentTime = new Date();

        return {
            value:   currentTime,
            seconds: currentTime.getSeconds(),
            minutes: currentTime.getMinutes(),
            hours:   currentTime.getHours()
        }
    }

    function start() {
        var time = getTime();

        saveSec = time.seconds;
        saveMin = time.minutes;
        saveHou = time.hours;
        Second.process( time.seconds );
        Minute.process( time.minutes );
        Hour.process( time.hours );

        clearTimeout( timeoutCallback );
        timeoutCallback = setTimeout( engine, 1000 );
    }

    function pause() {
        isPaused = true;
        clearTimeout( timeoutCallback );
    }

    function resume() {
        isPaused = false;
        engine();
    }

    function engine() {
        if ( isPaused ) return;
        clearTimeout( timeoutCallback );
        timeoutCallback = setTimeout( engine, 1000 );

        var time = getTime();

        if ( saveSec != time.seconds ) {
            saveSec = time.seconds;
            Second.process( time.seconds );
        }

        if ( saveMin != time.minutes ) {
            saveMin = time.minutes;
            Minute.process( time.minutes );
        }

        if ( saveHou != time.hours ) {
            saveHou = time.hours;
            Hour.process( time.hours );
        }
    }

    function Control( elSelector ) {
        this.el   = flipClock.find( elSelector );
        this.els  = this.el.find( 'li' );
        this.curr = 0;
    }

    Control.prototype = {
        process: function( value ) {
            var curli = this.els.filter( '.active' );

            if ( curli.is( ":last-child" ) ) {
                this.els.removeClass( "before" );
                curli.addClass( "before" ).removeClass( "active" );
                curli = this.els.eq( 0 );
                curli.addClass( "active" );
                this.curr = 0;
            } else {
                this.els.removeClass( "before" );
                curli.addClass( "before" ).removeClass( "active" );
                this.els.eq( 1 ).addClass( "active" );
                this.curr = 1;
            }

            this.setValue( value );
        },

        setValue: function( value ) {
            var formatedValue = addZeros( value, 1 ),
                nextli = this.els.eq( this.curr );

            nextli.find( ".flip-text" ).html( formatedValue );
        }
    };

    return {
        init: init,
        start: start,
        pause: pause,
        resume: resume,
    }
};