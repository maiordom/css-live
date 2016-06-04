(function() {
    var activeClass = 'dark__item_active';

    $('.dark').each(function() {
        setMenu($(this));
    });

    function setMenu(el) {
        var active = el.find('.' + activeClass);

        el.on('click', '.dark__item', function() {
            var item = $(this);

            if (item.hasClass(activeClass)) {
                item.removeClass(activeClass);
                active = null;
            } else {
                active && active.removeClass(activeClass);
                active = item.addClass(activeClass);
            }

            return false;
        });
    }
})();
