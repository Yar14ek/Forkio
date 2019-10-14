$(function () {
    $('.header__burger-menu').click(function () {
        $(this).toggleClass('header__burger-menu--active');
        $('.menu').slideToggle(500);
    });

// carousel slider
    $('.carousel__scroll-right').click(function () {
        let $arrFace = $('.carousel__user-block');
        let $index = $('.carousel__user-block.active').index();
        $arrFace.removeClass('active');
        $index == $arrFace.length - 1 ? $arrFace[0].classList.add('active') : $arrFace[$index + 1].classList.add('active');
    });
    $('.carousel__scroll-left').click(function () {
        let $arrFace = $('.carousel__user-block');
        let $index = $('.carousel__user-block.active').index();
        $arrFace.removeClass('active');
        $index <= 0 ? $arrFace[$arrFace.length - 1].classList.add('active') : $arrFace[$index - 1].classList.add('active');
    });
});