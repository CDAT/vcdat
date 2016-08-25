import $ from 'jquery';

// attach quicktree to jquery
$.fn.quicktree = function() {
    function click(e) {
        var a = $(this);
        a.next('ul').children('li').toggle();
        a.parent().parent().parent().find('.active').removeClass('active');
        a.addClass('active');
        e.preventDefault();
    }

    // Grab the LI's and iterate over them
    $(this).find('li').each(function(ind) {
        var t = $(this);
        t.children('a').off('click').click(click);
        t.children('ul').quicktree();

    });

    return this;

};
