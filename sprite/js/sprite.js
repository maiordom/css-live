Sprite.Model.CanvasElement = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        name: null,
        fileEntity: null,
        fileURL: null
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
                    fileURL: this.src
                });    
                $this.trigger( 'onloadFile' );            
            };
            img.src = e.target.result;
        }

        reader.readAsDataURL( this.get( 'fileEntity' ) );    
    }
});

Sprite.Collection.CanvasElements = Backbone.Collection.extend({
    model: Sprite.Model.CanvasElement
});

Sprite.Collection.CanvasElements = new Sprite.Collection.CanvasElements();

Sprite.View.Document = Backbone.View.extend({
    events: {
        'dragover':  'nullfunc',
        'dragenter': 'nullfunc',
        'dragexit':  'nullfunc',
        'drop':      'dropfunc',
    },

    initialize: function() {
        this.InnerCanvas = new Sprite.View.CanvasInner();
        this.OuterCanvas = new Sprite.View.CanvasOuter();

        this.$el       = $( '.canvas-box' );
        this.cssBox    = $( '.css-view-box' );
        this.cssScroll = $( '.css-view-scroll' );
        this.cssInner  = $( '.css-view-inner' );
        this.cssDesc   = $( '.css-description');
        this.wrapper   = $( '.wrapper' );
        this.win       = $( window );
        this.doc       = $( document );
        this.body      = $( 'body' );
        this.sldEl     = $( {} );
        this.dragObj   = {
            mouseOffset: {
                x: null,
                y: null
            },
            elModel: null
        }

        this.$el.append( this.InnerCanvas.el );
        this.$el.append( this.OuterCanvas.el );
        this.InnerCanvas.render();
        this.OuterCanvas.render();

        this.setCSSScrollParams( 350, this.win.height() - this.cssDesc.height() );
        this.setCSSScrollPane();
        this.setElPosition();
        this.bindEvents();
    },

    bindEvents: function() {
        var self = this;

        this.win.on( 'resize', _.bind( this.onWinResize, this ) );

        this.$el.on( 'mousedown', '.canvas-element', function( e ) {
            self.sldEl.removeClass( 'canvas-element-selected' );
            self.sldEl = $( this ).addClass( 'canvas-element-selected' );
            self.dragEngine( self.sldEl, e );
        });

        this.$el.on( 'click', '.canvas-element', function() {
            self.sldEl.removeClass( 'canvas-element-selected' );
            self.sldEl = $( this ).toggleClass( 'canvas-element-selected' );
        });

        this.$el.on( 'mouseenter', '.canvas-element', function() {
            $( this ).addClass( 'canvas-element-hover' );
        });

        this.$el.on( 'mouseleave', '.canvas-element', function() {
            $( this ).removeClass( 'canvas-element-hover' );
        });
    },

    setElPosition: function() {
        var rect = this.$el.offset();
        this.rect = {
            x:    rect.left,
            xmax: rect.left + this.InnerCanvas.options.width,
            y:    rect.top,
            ymax: rect.top + this.InnerCanvas.options.height
        };
    },

    dragEngine: function( el, e ) {
        var modelId = el.data( 'id' );

        this.dragObj.elModel = Sprite.Collection.CanvasElements.get( modelId ),
        this.dragObj.mouseOffset = {
            x: e.pageX - this.rect.x - this.dragObj.elModel.get( 'x' ),
            y: e.pageY - this.rect.y - this.dragObj.elModel.get( 'y' )
        };

        this.onDragStart();
        this.doc.mousemove( _.bind( this.onDragMove, this ) );
        this.doc.mouseup( _.bind( this.onDragEnd, this ) );
    },

    onDragMove: function( e ) {
        this.dragMove( e, this.dragObj.mouseOffset, this.dragObj.elModel );
    },

    dragMove: function( e, mouseOffset, elModel ) {
        var rect = this.rect,
            x = e.pageX - rect.x - mouseOffset.x,
            y = e.pageY - rect.y - mouseOffset.y;

        if ( x < 0 ) x = 0;
        if ( y < 0 ) y = 0;
        if ( x + elModel.get( 'w' ) > this.InnerCanvas.options.width  ) x = this.InnerCanvas.options.width  - elModel.get( 'w' );
        if ( y + elModel.get( 'h' ) > this.InnerCanvas.options.height ) y = this.InnerCanvas.options.height - elModel.get( 'h' );

        elModel.set( 'x', x );
        elModel.set( 'y', y );
        elModel.trigger( 'dragmove' );

        e.preventDefault();
        e.stopPropagation();
    },

    onDragStart: function() {
        this.body[ 0 ].style.cursor = 'move';
        this.body.addClass( 'drag' );
        document.ondragstart = function() { return false };
        document.body.onselectstart = function() { return false };
    },

    onDragEnd: function() {
        this.doc.off( 'mouseup mousemove' );
        this.body.css( 'cursor', 'auto' ).removeClass( 'drag' );
        document.ondragstart = null;
        document.body.onselectstart = null;
    },

    onWinResize: function() {
        this.setCSSScrollParams( 350, this.win.height() - this.cssDesc.height() );
        this.setCSSScrollPane();
    },

    setCSSScrollParams: function( w, h ) {
        this.cssScroll.css({
            width: w,
            height: h
        });        
    },

    setCSSScrollPane: function() {
        this.cssScroll.jScrollPane({
            verticalGutter: 0
        });
    },

    createElement: function( modelParams ) {
        var self = this,
            canvasElModel = new Sprite.Model.CanvasElement( modelParams ),
            canvasElView  = new Sprite.View.CanvasElement( { model: canvasElModel } ),
            cssElView     = new Sprite.View.CSSElement( { model: canvasElModel } );

        Sprite.Collection.CanvasElements.add( canvasElModel );

        canvasElModel.on( 'onloadFile', function() {
            canvasElView.render();
            cssElView.render();

            self.$el.append( canvasElView.el );
            self.cssInner.append( cssElView.el );
            self.setCSSScrollPane();
        });
    },

    nullfunc: function( e ) {
        e.preventDefault();
        e.stopPropagation();
    },

    dropfunc: function( e ) {
        var files = e.originalEvent.dataTransfer.files,
            len = files.length,
            file,
            $target = $( e.target ),
            xPos = Math.floor( e.originalEvent.clientX - $target.offset().left ),
            yPos = Math.floor( e.originalEvent.clientY - $target.offset().top ),
            classname;

        this.nullfunc( e );

        for ( var i = 0; i < len; i++ ) {
            file = files[ i ];
            classname = file.name.split( '.' );
            classname.pop();
            classname = classname.join( '.' ).replace( / /, '-' );

            if ( classname.search( /^\d/ ) !== -1 ){
                classname = 's-' + classname;
            }

            this.createElement({
                name: classname,
                fileEntity: file,
                x: xPos,
                y: yPos
            });
        }
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
        this.el.style.backgroundImage = 'url(' + dta.fileURL + ')';
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
    new Sprite.View.Document();
});