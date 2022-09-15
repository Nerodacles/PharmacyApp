/*================
 Template Name: BizBite Corporate Business Template
 Description: All type of corporate business with marketing and agency template.
 Version: 1.0
 Author: https://themeforest.net/user/themetags
=======================*/

// TABLE OF CONTENTS
// 1. preloader
// 2. fixed navbar
// 3. closes the responsive menu on menu item click
// 4. back to top
// 5. magnify popup video
// 6. magnify gallery popup
// 7. client-testimonial one item carousel
// 8. client logo item carousel
// 9. video background
// 10. wow js
// 11. Screenshots slider
// 12. countdown or coming soon

jQuery(function ($) {

  'use strict';

  // 1. preloader
  $(window).ready(function () {
    $('#preloader').delay(200).fadeOut('fade');
  });

  // 2. fixed navbar
  $(window).on('scroll', function () {
    // checks if window is scrolled more than 500px, adds/removes solid class
    if ($(this).scrollTop() > 58) {
      $('.navbar').addClass('affix');
      $('.scroll-to-target').addClass('open');
    } else {
      $('.navbar').removeClass('affix');
      $('.scroll-to-target').removeClass('open');
    }
  });

  // 2. page scrolling feature - requires jQuery Easing plugin
  $(function () {
    $(document).on('click', 'a.page-scroll', function (event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 58
      }, 900, 'easeInOutExpo');
      event.preventDefault();
    });
  });

  // 3. closes the responsive menu on menu item click
  $(".navbar-nav li a").on("click", function(event) {
    if (!$(this).parent().hasClass('dropdown'))
      $(".navbar-collapse").collapse('hide');
  });

  // 4. back to top
  if ($('.scroll-to-target').length) {
    $(".scroll-to-target").on('click', function () {
      var target = $(this).attr('data-target');
      // animate
      $('html, body').animate({
        scrollTop: $(target).offset().top
      }, 500);

    });
  }


  // 5. magnify popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  // 6. magnify gallery popup
  $('.popup-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
      titleSrc: function (item) {
        return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
      }
    }
  });


  // 7. client-testimonial one item carousel
  $('.client-testimonial').owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    dots: false,
    responsiveClass: true,
    autoplay: true,
    autoplayHoverPause: true,
    lazyLoad: true,
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      600: {
        items: 2
      },
      800: {
        items: 2
      },
      1200: {
        items: 3
      }
    }
  });

    // 8. client logo item carousel
  $('.clients-carousel').owlCarousel({
    autoplay: true,
    loop: true,
    margin: 15,
    dots: false,
    slideTransition: 'linear',
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    autoplaySpeed: 4500,
    responsive: {
      0: {
        items: 2
      },
      500: {
        items: 3
      },
      600: {
        items: 4
      },
      800: {
        items: 5
      },
      1200: {
        items: 6
      }

    }
  });

  // 9. video background
  $(document).ready(function () {
    $(".player").YTPlayer();
  });


  // 10. wow js
  function wowAnimation() {
    new WOW({
      offset: 100,
      mobile: true
    }).init()
  }

  wowAnimation()

  // 11. Screenshots slider
  $('.screen-carousel').owlCarousel({
    loop: true,
    margin: 0,
    center: true,
    dots: true,
    nav: false,
    autoplay: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      991: {
        items: 4
      },
      1200: {
        items: 4
      },
      1920: {
        items: 4
      }
    }
  });

  // 12. countdown or coming soon

  $('#clock').countdown('2022/01/30', function(event) {
    $(this).html(event.strftime('' +
      '<div class="row">' +
      '<div class="col">' +
      '<h2 class="mb-1">%-D</h2>' +
      '<h5>Day%!d</h5>' +
      '</div>' +
      '<div class="col">' +
      '<h2 class="mb-1">%H</h2>' +
      '<h5>Hours</h5>' +
      '</div>' +
      '<div class="col">' +
      '<h2 class="mb-1">%M</h2>' +
      '<h5>Minutes</h5>' +
      '</div>' +
      '<div class="col">' +
      '<h2 class="mb-1">%S</h2>' +
      '<h5>Seconds</h5>' +
      '</div>' +
      '</div>'));
  });

}); // JQuery end