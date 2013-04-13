$(function() {
    var actCls = 'dark-item_active';

    $( '.dark' ).each( function() {
        setMenu( $( this ) );
    });

    function setMenu( el ) {
        var active = el.find( '.' + actCls ), item;
        el.on( 'click', '.dark-item', function() {
            item = $( this );
            if ( item.hasClass( actCls ) ) {
                item.removeClass( actCls );
                active = null;
            } else {
                active && active.removeClass( actCls );
                active = item.addClass( actCls );
            }
        });
    }
});