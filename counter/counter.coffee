$ = jQuery

Counter = ->
    init = ->
        led = $( '.b-energy-meter__item_led' )
        lum = $( '.b-energy-meter__item_lum' )
        elBgPerOneNumber = 29
        numbersCount     = 10
        ledTimePerOne    = 3600
        lumTimePerOne    = 1600

        reelAnimation( led, ledTimePerOne * numbersCount, elBgPerOneNumber * numbersCount )
        reelAnimation( lum, lumTimePerOne * numbersCount, elBgPerOneNumber * numbersCount )
        
        trackerAnimation( led, ledTimePerOne )
        trackerAnimation( lum, lumTimePerOne )

    reelAnimation = ( el, time, value ) ->
        numbers = el.find( '.b-energy-reel__numbers' )
        k = 1

        for i in [ numbers.length - 1..0 ] by -1
            animObj = reelNumberAnimation( numbers.eq( i ), time * k, value )
            animObj.play()
            k *= 10

    reelNumberAnimation = ( el, dur, value ) ->
        entity = undefined

        callback = ->
            entity = animateBg.apply( null, args )
            entity.play()

        args = [ el, dur, value, callback ]

        stop: ->
            entity.stop()
        play: ->
            entity = animateBg.apply( null, args )
            entity.play()

    trackerAnimation = ( el, time ) ->
        elTracker  = el.find( '.b-energy-meter__tracker' )
        elTrackerW = elTracker.width()
        elTrackW   = el.find( '.b-energy-meter__track' ).width()        

        animate = () ->
            elTracker.stop()
                .css( 'left', - elTrackerW )
                .animate( left: elTrackW + elTrackerW, time, animate )

        animate()

    animateBg = ( el, duration, value, callback ) ->
        bgPos = el.css( 'backgroundPosition' ).split( ' ' )
        x = parseInt( bgPos[ 0 ] )
        y = parseInt( bgPos[ 1 ] )
        startValue = y
        startTime  = ( new Date() ).getTime()
        interval = undefined
        prevValue = undefined
        currentValue = undefined

        tick = () ->
            prevValue    = currentValue
            currentTime  = ( new Date() ).getTime()
            remaining    = Math.max( 0, startTime + duration - currentTime )
            temp         = remaining / duration || 0
            percent      = 1 - temp
            currentValue = ( startValue + value * percent ).toFixed( 1 )
            currentValue = parseFloat( currentValue )

            if currentValue != prevValue
                el[ 0 ].style.backgroundPosition = x + 'px ' + currentValue + 'px'

            if percent < 1
                return
            else
                clearInterval( interval )
                callback && callback()

        play: ->
            interval = setInterval( tick, 13 )
        stop: ->
            clearInterval( interval )

    init()

$( document ).ready( Counter )