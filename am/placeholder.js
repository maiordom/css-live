(function ( $, global ) {

function iHolder( input ) {
    this.input = input;
    this.placeholder = input[ 0 ].placeholder;

    if ( !this.test() ) {
        this.init();
        this.isAvailable = false;
    }
}

iHolder.prototype = {
    isAvailable: true,
    activeFieldCls: 'b-active',

    test: function() {
        var input = document.createElement( 'input' );
        return 'placeholder' in input;
    },

    init: function () {
        this.set();
        this.onFocus();
        this.onBlur();
        this.check();
    },

    check: function() {
        if ( this.input.val() === this.placeholder ) {
            this.input.removeClass( this.activeFieldCls );
        }
    },

    set: function () {
        this.input.val( this.placeholder );
    },

    onFocus: function () {
        var self = this;

        this.input.focus( function () {
            if ( self.input.val() === self.placeholder ) {
                self.input.val( null ).addClass( self.activeFieldCls );
            }
        });
    },

    onBlur: function () {
        var self = this;

        this.input.blur( function () {
            if ( !self.input.val() ) {
                self.input.val( self.placeholder ).removeClass( self.activeFieldCls );
            }
        });
    },

    disable: function() {
        this.input.off( 'focus blur' ).addClass( this.activeFieldCls );
        $.removeData( this.input[ 0 ], 'iHolder' );
    }
};

$.fn.iHolder = function( options ) {
    var item;
    return $( this ).each( function() {
        item = $( this );
        if ( item.data( 'iHolder' ) ) {
            console.log( 'iHolder alredy init', this );
        } else {
            item.data( 'iHolder', new iHolder( item, options ) );
        }
    });
};

})( jQuery, window );