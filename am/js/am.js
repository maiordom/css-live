(function( root, $ ) {
    var activeItemCls       = 'ulist-item-active',
        boxHiddenCls        = 'ulist-hidden',
        notFullControlState = 'ulist-icon-control-not-full',
        fullControlState    = 'ulist-icon-control-full',
        ulistItemPrefix     = 'ulist-item-id-',
        id = -1;

    function Ulist( el ) {
        var $el,
            $title,
            $list,
            $control,
            $items,            
            $event,
            elWidth;

        function init() {
            cacheObjects();
            setElWidth( elWidth );
            setItemsId();
            bindEvents();
            setControlState();
        }

        function check() {
            $items.filter( '.' + activeItemCls ).each( function() {
                var item = $( this ),
                    text = item.text(),
                    id   = item.data( 'id' );

                $event.trigger( 'select', [ id, text ] );
            });
        }

        function cacheObjects() {
            $el      = $( el );
            $title   = $el.find( '.ulist-title' );
            $list    = $el.find( '.ulist-list' );
            $control = $el.find( '.ulist-icon-control' );
            $items   = $el.find( '.ulist-item' );
            elWidth  = $el.width();
            $event   = $( {} );    
        }

        function bindEvents() {
            $el
                .on( 'click', '.ulist-item', onItemClick )
                .on( 'click', '.ulist-title', onTitleClick )
                .on( 'click', '.ulist-icon-control', onControlClick );
        }

        function setItemsId() {
            for ( var i = 0, ilen = $items.length; i < ilen; i++ ) {
                $items.eq( i ).addClass( ulistItemPrefix + ++id );
                $items.eq( i ).attr( 'data-id', id );
            }
        }

        function onControlClick( e ) {
            if ( $control.hasClass( notFullControlState ) ) {
                $items.filter( '.' + activeItemCls ).trigger( 'click', [ true ] );
                $control.removeClass( notFullControlState );
            } else if ( $control.hasClass( fullControlState ) ) {
                $items.filter( '.' + activeItemCls ).trigger( 'click', [ true ] );
                $control.removeClass( fullControlState );
            } else {
                $items.filter( ':not(.' + activeItemCls + ')' ).trigger( 'click', [ true ] );
                $control.addClass( fullControlState );
            }

            e && e.stopPropagation();
        }

        function setControlState() {
            var activeItems = $items.filter( '.' + activeItemCls );

            if ( activeItems.length === $items.length ) {
                $control.removeClass( notFullControlState ).addClass( fullControlState ); 
            } else if ( activeItems.length === 0 ) {
                $control.removeClass( notFullControlState );
            } else {    
                $control.removeClass( fullControlState ).addClass( notFullControlState );
            }
        }

        function onItemClick( e, dontSetControlState ) {
            var item = $( this ),
                text = item.text(),
                id   = item.data( 'id' );

            if ( item.hasClass( activeItemCls ) ) {
                item.removeClass( activeItemCls );
                $event.trigger( 'deselect', [ id, text ] );
            } else {
                item.addClass( activeItemCls );
                $event.trigger( 'select', [ id, text ] );
            }

            if ( !dontSetControlState ) {
                setControlState();
            }
        }

        function onTitleClick() {
            if ( $el.hasClass( boxHiddenCls ) ) {
                $title.removeClass( 'ulist-title-psv' );
                $list.slideDown( 300 );
                $el.removeClass( boxHiddenCls );
            } else {
                listSlideUp();
            }
        }

        function listSlideUp() {
            if ( $.support.borderRadius ) {
                $el.addClass( boxHiddenCls );
                $list.slideUp( 300 );
                $title.addClass( 'ulist-title-psv' );
            } else {
                $el.addClass( boxHiddenCls );
                $list.slideUp( 300, function() {
                    $title.addClass( 'ulist-title-psv' );
                });
            }            
        }

        function setElWidth( width ) {
            $el.width( width );
        }

        function destroy() {
            $el.off( 'click' );
        }

        function on( event, callback ) {
            $event.bind( event, callback );
        }

        init();

        return {
            on: on,
            elWidth: elWidth,
            destroy: destroy,
            setElWidth: setElWidth,
            check: check
        }
    }

    function UlistBox( box, options ) {
        var entities = [], entity, temp, maxWidth, 
            selectBox = options.selectBox || $( '<div>' ),
            yabbleTmpl = options.yabbleTmpl;

        function init() {
            box.find( '.ulist' ).each( initEntity );
            selectBox.on( 'click', '.yabble', onRemoveYabble );
            sortBoxItemsByWidth( entities, 'elWidth' );
            maxWidth = entities[ 0 ].elWidth;
            readOptions();
        }

        function onRemoveYabble() {
            var yabble = $( this ),
                id = yabble.data( 'id' );

            box.find( '.' + ulistItemPrefix + id ).trigger( 'click' );
        }

        function initEntity() {
            entity = Ulist( this );
            entities.push( entity );
            bindEntityEvents( entity );
            entity.check();
        }

        function bindEntityEvents( entity ) {
            entity.on( 'select', onSelectEntity );
            entity.on( 'deselect', onDeselectEntity );
        }

        function onSelectEntity( e, id, text ) {
            var yabble = createYabble( id, text );
            selectBox.append( yabble );
        }

        function onDeselectEntity( e, id ) {
            selectBox.find( '.' + ulistItemPrefix + id ).remove();
        }

        function readOptions() {
            if ( options.fixBoxWidth ) {
                box.width( maxWidth );
            }

            if ( options.fixBoxItemsWidth ) {            
                for ( var i = 0, ilen = entities.length; i < ilen; i++ ) {
                    entities[ i ].setElWidth( maxWidth );
                }
            }
        }

        function createYabble( id, text ) {
            return yabbleTmpl.tmpl({
                clsId: ulistItemPrefix + id,
                id: id,
                title: text
            });
        }

        function sortBoxItemsByWidth( arr, propName ) {
            for ( var i = 0, ilen = arr.length; i < ilen; i++ )
            for ( var j = 0, jlen = arr.length; j < jlen; j++ ) {
                if ( arr[ j + 1 ] && arr[ j ][ propName ] < arr[ j + 1 ][ propName ] ) {
                    temp = arr[ j ];
                    arr[ j ] = arr[ j + 1 ];
                    arr[ j + 1 ] = temp;
                }
            }    
        }

        function destroy() {

        }

        function getParams() {
            var items = selectBox.find( '.yabble .yabble-inner' ), params = [];

            for ( var i = 0, ilen = items.length; i < ilen; i++ ) {
                params.push( items.eq( i ).text() );
            }    

            return params;
        }

        init();

        return {
            destroy: destroy,
            getParams: getParams
        }
    }

    $.fn.Ulist = function( options ) {
        var box = $( this ), item, entity;

        return box.each( function() {
            item = $( this );            
            if ( item.data( 'ulist' ) ) {
                console.log( 'ulist already init', this );
            } else {
                entity = UlistBox( item, options || {} );
                item.data( 'ulist', entity );
            }
        });
    };
    
    jQuery.support.borderRadius = false;
    jQuery.each( [ 'borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius' ], function() {
        if ( document.body.style[ this ] !== undefined ) {
            jQuery.support.borderRadius = true;
            return false;
        }
    });

    jQuery.support.borderRadius ?
        $( 'body' ).addClass( 'css3-border-radius' ) :
        $( 'body' ).addClass( 'css3-no-border-radius' );
})( window, jQuery );