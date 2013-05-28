Sprite.Model.CanvasElement = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        name: null,
        fileEntity: null,
        fileContent: null
    },

    initialize: function() {
        if ( this.get( 'fileEntity' ) + '' === '[object File]' ) {
            this.readFile();    
        }
    },

    sync: function() {
    },

    readFile: function() {
        var reader = new FileReader(), $this = this;
        
        reader.onload = function( e ) {
            var img = document.createElement( 'img' );
            img.onload = function( e ) {
                $this.set({
                    w: e.target.width,
                    h: e.target.height,
                    fileContent: this.src
                });
                $this.trigger( 'onloadFile' );
            };
            img.src = e.target.result;
        }

        reader.readAsDataURL( this.get( 'fileEntity' ) );
    }
});

Sprite.Collection.CanvasElements = Backbone.Collection.extend({
    model: Sprite.Model.CanvasElement,

    createSprite: function( w, h ) {
        var reqData = this.prepareDataToCreateCanvas( w, h );

        $.ajax({
            data: reqData,
            url: 'api/create_sprite',
            method: 'POST',
            dataType: 'json',
            success: function( json ) {
                if ( json.result === 'RESULT_OK' ) {
                    location.href = 'server/cache/' + json.file + '.png'
                }
                console.log( json );
            }
        });
    },

    prepareDataToCreateCanvas: function( canvasWidth, canvasHeight ) {
        var reqData = [], serializedData = [], tmp;

        this.each( function( elModel ) {
            tmp = elModel.toJSON();
            delete tmp.fileEntity;
            reqData.push( tmp );
        });

        serializedData.push( 'width='  + canvasWidth );
        serializedData.push( 'height=' + canvasHeight );

        _.each( reqData, function( reqDataItem, index ) {
            _.each( reqDataItem, function( value, key ) {
                serializedData.push( key + index + '=' + encodeURIComponent( value ) );
            });
        });

        return serializedData.join( '&' );
    }
});

Sprite.View.CanvasElement = Backbone.View.extend({
    tagName: 'div',
    className: 'canvas-element',
    events: {
        'mousedown': 'mousedown'
    },

    initialize: function() {
        var self = this;
        this.model.on( 'dragmove', function() {
            self.$el.css({
                left: self.model.get( 'x' ),
                top:  self.model.get( 'y' )
            });
        });
    },

    render: function() {
        var dta = this.model.toJSON();

        this.el.style.top    = dta.y + 'px';
        this.el.style.left   = dta.x + 'px';
        this.el.style.width  = dta.w + 'px';
        this.el.style.height = dta.h + 'px';
        this.el.style.backgroundImage = 'url(' + dta.fileContent + ')';
        this.el.setAttribute( 'data-id', this.model.cid );
    }
});

Sprite.View.CSSElement = Backbone.View.extend({
    tagName: 'div',
    className: 'css-element',
    template: _.template( $( '#tmpl-css-element' ).html() ),

    initialize: function() {
        var self = this;
        this.model.on( 'dragmove', function() {
            var bgValue = self.model.get( 'x' ) + 'px ' + self.model.get( 'y' ) + 'px';
            self.bgValue.html( bgValue );
        });
    },

    render: function() {
        var dta = this.model.toJSON(),
            params = {};

        params.width  = dta.w + 'px';
        params.height = dta.h + 'px';
        params[ 'background-position' ] = dta.x + 'px ' + dta.y + 'px';
        dta[ 'id' ] = this.model.cid;
        dta[ 'props' ] = params;

        var tmpl = this.template( dta );
        this.el.innerHTML = tmpl;
        this.bgValue = this.$el.find( '.css-element-pair-background-position .css-element-value' );
        this.el.setAttribute( 'data-id', dta[ 'id' ] );
        return this;
    }
});

$( document ).ready( function() {
    new Sprite.View.Document({ model: new Sprite.Collection.CanvasElements() });
});