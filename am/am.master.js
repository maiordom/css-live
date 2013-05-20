UlistData = [{
    title: '3D-шутеры, «бродилки-стрелялки»',
    childs: [{
        title: 'Шутеры от первого и от третьего лица' }, {
        title: '«Кровавые» шутеры' }, {
        title: 'Тактические шутеры', active: true 
    }]
}, {
    title: 'Файтинги',
    childs: [{
        title: 'Избей их всех', active: true }, {
        title: 'Слэшер', active: true 
    }]
}, {
    title: 'Симуляторы/Менеджеры',
    childs: [{
        title: 'Технические' }, {
        title: 'Аркадные' }, {
        title: 'Спортивные', active: true }, {
        title: 'Спортивный менеджер', active: true }, {
        title: 'Экономические'
    }]
}, {
    title: 'Стратегии по схеме игрового процесса',
    childs: [{
        title: 'Стратегии в реальном времени' }, {
        title: 'Пошаговые стратегии' }, {
        title: 'Карточные стратегии'
    }]
}, {
    title: 'Стратегии по масштабу игрового процесса',
    childs: [{
        title: 'Варгеймы' }, {
        title: 'Глобальные стратегии' }, {
        title: 'Симуляторы бога' }, {
        title: 'Спортивный менеджер' }, {
        title: 'Экономические'
    }]
}];

$( document ).ready( function() {
    var ulist, ulistApi, field, fieldApi, ulistProps, findBtn, tmplFuncs, yabbleTmpl;

    yabbleTmpl = $.support.borderRadius ?
        $( '#yabble-tmpl-border-radius' ) : 
        $( '#yabble-tmpl-no-border-radius' );

    ulistProps = {
        yabbleTmpl: yabbleTmpl,
        fixBoxWidth: true,
        fixBoxItemsWidth: true,
        selectBox: $( '.jform-inner' )
    };

    tmplFuncs = {
        getActiveCls: function ( index ) {
            return this.data.childs[ index ].active ? 'ulist-item-active' : '';
        }
    };

    if ( UlistData ) {
        $.support.borderRadius ?
            $( '#ulist-tmpl-border-radius' ).tmpl( UlistData, tmplFuncs ).appendTo( '.ulist-box' ) :
            $( '#ulist-tmpl-no-border-radius' ).tmpl( UlistData, tmplFuncs ).appendTo( '.ulist-box' );
    }

    ulist    = $( '.ulist-box' ).Ulist( ulistProps );
    field    = $( '.jform-field' ).iHolder();
    findBtn  = $( '.jform-btn');
    ulistApi = ulist.data( 'ulist' );
    fieldApi = field.data( 'iHolder' );

    field.keyup( onFieldKeyup );
    findBtn.click( onFindBtnClick );
    !$.support.borderRadius ? $( '.ulist-corner-right' ).show() : null;

    fieldApi.test() ?
        $( 'body' ).addClass( 'css3-placeholder' ) :
        $( 'body' ).addClass( 'css3-no-placeholder' );

    function onFindBtnClick() {
        trySend();
    }

    function onFieldKeyup( e ) {
        if ( e.keyCode === 13 ) {
            trySend();
        }   
    }

    function trySend() {
        var params = ulistApi.getParams(),
            value = $.trim( field.val() );

        if ( value && value !== fieldApi.placeholder ) {
            sendXhr( value, params );
        }    
    }

    function sendXhr( value, params ) {
        console.log( value, params );
    }
});        
