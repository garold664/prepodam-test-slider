(function (d) {
  var d = document;
  var slider = d.querySelector('.slider');
  var sliderWrap = d.querySelector('.slider__wrap');
  var itemClassName = 'slider__slide';
  var items = d.querySelectorAll('.' + itemClassName);
  var totalItems = items.length;
  var slide = 0;
  var index = 0;
  var moving = true;
  var dotsContainer = d.querySelector('.slider__dots');

  var slidesPerView = 1;

  var createDots = function () {
    for (var i = 0; i < totalItems; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('type', 'button');
      dot.classList.add('slider__dot');
      var dotDescr = document.createElement('span');
      dotDescr.classList.add('visually-hidden');
      dotDescr.textContent = i + 1;
      dot.appendChild(dotDescr);
      dotsContainer.appendChild(dot);
    }

    var dots = d.querySelectorAll('.slider__dot');
    dots[0].classList.add('slider__dot--active');
  };

  var disableInteraction = function () {
    moving = true;

    setTimeout(function () {
      moving = false;
    }, 500);
  };

  var moveCarouselTo = function (slide) {
    if (!moving) {
      disableInteraction();

      var newPrevious = slide - 1;
      var newNext = slide + 1;
      var oldPrevious = slide - 2;
      var oldNext = slide + 2;


      if (newPrevious <= 0) {
        oldPrevious = (totalItems - 1);
      } else if (newNext >= (totalItems - 1)) {
        oldNext = 0;
      }

      if (slide === 0) {
        newPrevious = (totalItems - 1);
        oldPrevious = (totalItems - 2);
        oldNext = (slide + 1);
      } else if (slide === (totalItems - 1)) {
        newPrevious = (slide - 1);
        newNext = 0;
        oldNext = 1;
      }

      items[oldPrevious].className = itemClassName;
      items[oldNext].className = itemClassName;

      items[newPrevious].className = itemClassName + ' prev';
      items[slide].className = itemClassName + ' active';
      items[newNext].className  = itemClassName + ' next';

      var activeDot = d.querySelector('.slider__dot--active');
      var dots = d.querySelectorAll('.slider__dot');
      activeDot.classList.remove('slider__dot--active');
      dots[slide].classList.add('slider__dot--active');

      var slideWidth = items[slide].offsetWidth;
      sliderWrap.style = 'transform: translateX(-' + slideWidth*slide*slidesPerView + 'px);';
    }
  };

  var moveNext = function () {
    if (!moving) {
      if (slide === (totalItems - 1)) {
        slide = 0;
      } else {
        slide++;
      }
    }

    moveCarouselTo(slide);
  };

  var movePrev = function () {
    if (!moving) {
      if (slide === 0) {
        slide = (totalItems - 1);
      } else {
        slide--;
      }
    }

    moveCarouselTo(slide);
  };

  var moveTo = function (ev) {
    var target = ev.target;

    if (target.classList.contains('slider__dot')) {    
      index = parseInt(target.children[0].textContent, 10) - 1;
      if (!moving) {
        moveCarouselTo(index);
      }
    }
  };

  var setInitialClasses = function () {
    var initial = d.querySelector('.initial');
    if (initial) {
      initial.classList.remove('initial');
    }
    items[totalItems -1].classList.add('prev');
    items[0].classList.add('active');
    items[1].classList.add('next');
  };


  var down_x = null;
  var up_x = null;

  var doWork = function () {
    if ((down_x - up_x) > 50) {
      moveNext();
    } else if ((up_x - down_x) > 50) {
      movePrev();
    }
  };

  var setEventListeners = function () {
    var next = d.querySelector('.slider__btn--next');
    var prev = d.querySelector('.slider__btn--prev');

    next.addEventListener('click', moveNext);
    prev.addEventListener('click', movePrev);
    dotsContainer.addEventListener('click', moveTo);

    // slider.addEventListener('mousedown', function (evt) {
    //   evt.preventDefault();
    //   down_x = evt.pageX;
    // });

    // slider.addEventListener('mouseup', function (evt) {
    //   evt.preventDefault();
    //   up_x = evt.pageX;
    //   doWork();
    // });

    sliderWrap.addEventListener('touchstart', function (evt) {
      evt.preventDefault();
      down_x = evt.touches[0].pageX;
    });

    sliderWrap.addEventListener('touchmove', function (evt) {
      evt.preventDefault();
      up_x = evt.touches[0].pageX;
    });

    sliderWrap.addEventListener('touchmove', function (evt) {
      evt.preventDefault();
      doWork();
    });
  };


  var initCarousel = function () {
    setInitialClasses();
    setEventListeners();
    createDots();

    moving = false;
  };

  initCarousel();

  var timerId;
  var throttleFunction = function (func, delay) {
    if (timerId) {
      return;
    }

    timerId = setTimeout(function () {
      func();
      timerId = undefined;
    }, delay);
  }

  window.addEventListener('resize', function () {
    throttleFunction(function () {
      moveCarouselTo(index);
    }, 300);
  });


})(document);