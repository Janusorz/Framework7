/*===========================
Swiper 3.0.0
===========================*/
window.Swiper = function (container, params) {
    
    var defaults = {
        touchEventsTarget: 'container',
        initialSlide: 0,
        spaceBetween: 0,
        speed: 300,
        // autoplay: 1000,
        autoplay: false,
        autoplayDisableOnInteraction: true,
    
        freeMode: false,
        freeModeMomentum: true,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: true,
        freeModeMomentumBounceRatio: 1,
    
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerColumnFill: 'column',
        slidesPerGroup: 1,
        centeredSlides: false,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        onlyExternal: false,
        direction: 'horizontal',
        pagination: undefined,
        paginationClickable: true,
        paginationHide: false,
        resistance: true,
        resistanceRatio: 0.85,
        touchRatio: 1,
        nextButton: undefined,
        prevButton: undefined,
        allowSwipeToPrev: true,
        allowSwipeToNext: true,
        threshold: 0,
        grabCursor: false,
        watchSlidesProgress: false,
        preventClicks: true,
        preventClicksPropagation: true,
        releaseFormElements: true,
        updateOnImagesReady: true,
        // loop
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
    
        swipeHandler: null, //'.swipe-handler',
        noSwiping: true,
        noSwipingClass: 'swiper-no-swiping',
        slideClass: 'swiper-slide',
        slideActiveClass: 'swiper-slide-active',
        slideVisibleClass: 'swiper-slide-visible',
        slideDuplicateClass: 'swiper-slide-duplicate',
        slideNextClass: 'swiper-slide-next',
        slidePrevClass: 'swiper-slide-prev',
        wrapperClass: 'swiper-wrapper',
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        bulletVisibleClass: 'swiper-pagination-bullet-visible',
        buttonDisabledClass: 'swiper-button-disabled',
        paginationHiddenClass: 'swiper-pagination-hidden',
        onClick: function (swiper, e) {
            // console.log('clicked');
        },
        onTap: function (swiper, e) {
            // console.log('tapped');
        },
        onDoubleTap: function (swiper, e) {
            // console.log('doubletapped');
        },
        onSliderMove: function (swiper, e) {
            // console.log('onslidermove');
        },
        onSlideChangeStart: function (swiper) {
            // console.log('slidechangestart');
        },
        onSlideChangeEnd: function (swiper) {
            // console.log('slidechangeend');
        },
        onTransitionStart: function (swiper) {
            console.log('transitionstart');
        },
        onTransitionEnd: function (swiper) {
            console.log('transitionend');
        },
        
        /*
        onImagesReady: function (swiper) {
            console.log('imagesready');
        },
        onProgress: function (swiper, progress) {
            console.log('progressChanged',);
        },
        onDestroy: function () {
            console.log('destroy');
        },
        onTouchStart: function (swiper, e) {
            console.log('touchstart');
        },
        onTouchMove: function (swiper, e) {
            console.log('touchmove');
        },
        onTouchEnd: function (swiper, e) {
            console.log('touchend');
        },
        onReachBeginning: function (swiper) {
            console.log('reach beginning');
        },
        onReachEnd: function (swiper) {
            console.log('reach end');
        },
        */
        
        observer: false,
        observeParents: false,
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    
    // Swiper
    var s = this;
    
    // Params
    s.params = params;
    /*=========================
      Dom Library and plugins
      ===========================*/
    var $ = Dom7 || window.Dom7 || window.Zepto || window.jQuery;
    if (!$) return;
    if (!('transitionEnd' in $.fn)) {
        $.fn.transitionEnd = function (callback) {
            var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                i, j, dom = this;
            function fireCallBack(e) {
                /*jshint validthis:true */
                if (e.target !== this) return;
                callback.call(this, e);
                for (i = 0; i < events.length; i++) {
                    dom.off(events[i], fireCallBack);
                }
            }
            if (callback) {
                for (i = 0; i < events.length; i++) {
                    dom.on(events[i], fireCallBack);
                }
            }
            return this;
        };
    }
    if (!('transform' in $.fn)) {
        $.fn.transform = function (transform) {
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
            }
            return this;
        };
    }
    if (!('transition' in $.fn)) {
        $.fn.transition = function (duration) {
            if (typeof duration !== 'string') {
                duration = duration + 'ms';
            }
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
            }
            return this;
        };
    }
    
    /*=========================
      Preparation - Define Container, Wrapper and Pagination
      ===========================*/
    s.container = $(container);
    if (s.container.length === 0) return;
    if (s.container.length > 1) {
        s.container.each(function () {
            new Swiper(this, params);
        });
        return;
    }
    
    // Save instance in container HTML Element and in data
    s.container[0].swiper = s;
    s.container.data('swiper', s);
    
    s.container.addClass('swiper-container-' + s.params.direction);
    
    if (s.params.freeMode) {
        s.container.addClass('swiper-container-free-mode');
    }
    
    // Wrapper
    s.wrapper = s.container.children('.' + s.params.wrapperClass);
    
    // Pagination
    if (s.params.pagination) s.paginationContainer = $(s.params.pagination);
    
    // Is Horizontal
    function isH() {
        return s.params.direction === 'horizontal';
    }
    
    // RTL
    s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
    
    // Translate
    s.translate = 0;
    
    // Progress
    s.progress = 0;
    
    // Velocity
    s.velocity = 0;
    
    // Locks, unlocks
    s.lockSwipeToNext = function () {
        s.params.allowSwipeToNext = false;
    };
    s.lockSwipeToPrev = function () {
        s.params.allowSwipeToPrev = false;
    };
    s.lockSwipes = function () {
        s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
    };
    s.unlockSwipeToNext = function () {
        s.params.allowSwipeToNext = true;
    };
    s.unlockSwipeToPrev = function () {
        s.params.allowSwipeToPrev = true;
    };
    s.unlockSwipes = function () {
        s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
    };
    
    // Columns
    if (s.params.slidesPerColumn > 1) {
        s.container.addClass('swiper-container-multirow');
    }
    
    
    /*=========================
      Set grab cursor
      ===========================*/
    if (s.params.grabCursor) {
        s.container[0].style.cursor = 'move';
        s.container[0].style.cursor = '-webkit-grab';
        s.container[0].style.cursor = '-moz-grab';
        s.container[0].style.cursor = 'grab';
    }
    /*=========================
      Update on Images Ready
      ===========================*/
    s.imagesToLoad = [];
    s.imagesLoaded = 0;
    
    function loadImage(img) {
        var image, src;
        var onReady = function () {
            if (typeof s === 'undefined' || s === null) return;
            if (s.imagesLoaded !== undefined) s.imagesLoaded++;
            if (s.imagesLoaded === s.imagesToLoad.length) {
                s.update();
                // if (params.onImagesReady) _this.fireCallback(params.onImagesReady, _this);
                if (s.params.onImagesReady) s.params.onImagesReady(s);
            }
        };
    
        if (!img.complete) {
            src = (img.currentSrc || img.getAttribute('src'));
            if (src) {
                image = new Image();
                image.onload = onReady;
                image.onerror = onReady;
                image.src = src;
            } else {
                onReady();
            }
    
        } else {//image already loaded...
            onReady();
        }
    }
    s.preloadImages = function () {
        s.imagesToLoad = s.container.find('img');
    
        for (var i = 0; i < s.imagesToLoad.length; i++) {
            loadImage(s.imagesToLoad[i]);
        }
    };
    
    /*=========================
      Autoplay
      ===========================*/
    s.autoplayTimeoutId = undefined;
    s.autoplaying = false;
    s.autoplayPaused = false;
    function autoplay() {
        s.autoplayTimeoutId = setTimeout(function () {
            if (s.params.loop) {
                s.fixLoop();
                s._slideNext();
            }
            else {
                if (!s.isEnd) {
                    s._slideNext();
                }
                else {
                    if (!params.autoplayStopOnLast) {
                        s._slideTo(0);
                    }
                    else {
                        s.stopAutoplay();
                    }
                }
            }
        }, s.params.autoplay);
    }
    s.startAutoplay = function () {
        if (typeof s.autoplayTimeoutId !== 'undefined') return false;
        if (!s.params.autoplay) return;
        if (s.autoplaying) return;
        s.autoplaying = true;
        if (s.params.onAutoplayStart) s.params.onAutoplayStart(s);
        autoplay();
    };
    s.stopAutoplay = function (internal) {
        if (!s.autoplayTimeoutId) return;
        if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
        s.autoplaying = false;
        s.autoplayTimeoutId = undefined;
        if (s.params.onAutoplayStop) s.params.onAutoplayStop(s);
    };
    s.pauseAutoplay = function () {
        if (s.autoplayPaused) return;
        if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
        s.autoplayPaused = true;
        s.wrapper.transitionEnd(function () {
            s.autoplayPaused = false;
            autoplay();
        });
    };
    /*=========================
      Slider/slides sizes
      ===========================*/
    s.updateContainerSize = function () {
        s.width = s.container[0].clientWidth;
        s.height = s.container[0].clientHeight;
        s.size = isH() ? s.width : s.height;
    };
    
    s.updateSlidesSize = function () {
        s.slides = s.wrapper.children('.' + s.params.slideClass);
        s.snapGrid = [];
        s.slidesGrid = [];
        s.slidesSizesGrid = [];
        
        var spaceBetween = s.params.spaceBetween,
            slidePosition = 0,
            i,
            prevSlideSize = 0,
            index = 0;
        if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
            spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
        }
    
        s.virtualWidth = -spaceBetween;
        // reset margins
        if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
        else s.slides.css({marginRight: '', marginBottom: ''});
    
        var slidesNumberEvenToRows;
        if (s.params.slidesPerColumn > 1) {
            if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                slidesNumberEvenToRows = s.slides.length;
            }
            else {
                slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
            }
        }
    
        // Calc slides
        var slideSize;
        for (i = 0; i < s.slides.length; i++) {
            slideSize = 0;
            var slide = s.slides.eq(i);
            if (s.params.slidesPerColumn > 1) {
                // Set slides order
                var newSlideOrderIndex;
                var column, row;
                var slidesPerColumn = s.params.slidesPerColumn;
                var slidesPerRow;
                if (s.params.slidesPerColumnFill === 'column') {
                    column = Math.floor(i / slidesPerColumn);
                    row = i - column * slidesPerColumn;
                    newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                    slide
                        .css({
                            '-webkit-box-ordinal-group': newSlideOrderIndex,
                            '-moz-box-ordinal-group': newSlideOrderIndex,
                            '-ms-flex-order': newSlideOrderIndex,
                            '-webkit-order': newSlideOrderIndex,
                            'order': newSlideOrderIndex
                        });
                }
                else {
                    slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
                    row = Math.floor(i / slidesPerRow);
                    column = i - row * slidesPerRow;
                    
                }
                slide
                    .css({
                        'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                    })
                    .attr('data-swiper-column', column)
                    .attr('data-swiper-row', row);
                    
            }
            if (slide.css('display') === 'none') continue;
            if (s.params.slidesPerView === 'auto') {
                slideSize = isH() ? slide.outerWidth(true) : slide.outerHeight(true);
            }
            else {
                slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                if (isH()) {
                    s.slides[i].style.width = slideSize + 'px';
                }
                else {
                    s.slides[i].style.height = slideSize + 'px';
                }
            }
            s.slides[i]._swiperSlideSize = slideSize;
            s.slidesSizesGrid.push(slideSize);
            
            
            if (s.params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                s.slidesGrid.push(slidePosition);
            }
            else {
                if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                s.slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
    
            s.virtualWidth += slideSize + spaceBetween;
    
            prevSlideSize = slideSize;
    
            index ++;
        }
        s.virtualWidth = Math.max(s.virtualWidth, s.size);
    
        var newSlidesGrid;
    
        if (s.params.slidesPerColumn > 1) {
            s.virtualWidth = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
            s.virtualWidth = Math.ceil(s.virtualWidth / s.params.slidesPerColumn) - s.params.spaceBetween;
            s.wrapper.css({width: s.virtualWidth + s.params.spaceBetween + 'px'});
            if (s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] < s.virtualWidth + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                }
                s.snapGrid = newSlidesGrid;
            }
        }
    
        // Remove last grid elements depending on width
        if (!s.params.centeredSlides) {
            newSlidesGrid = [];
            for (i = 0; i < s.snapGrid.length; i++) {
                if (s.snapGrid[i] <= s.virtualWidth - s.size) {
                    newSlidesGrid.push(s.snapGrid[i]);
                }
            }
            s.snapGrid = newSlidesGrid;
            if (Math.floor(s.virtualWidth - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])) {
                s.snapGrid.push(s.virtualWidth - s.size);
            }
        }
        if (s.snapGrid.length === 0) s.snapGrid = [0];
            
        if (s.params.spaceBetween !== 0) {
            if (isH()) {
                if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                else s.slides.css({marginRight: spaceBetween + 'px'});
            }
            else s.slides.css({marginBottom: spaceBetween + 'px'});
        }
        if (s.params.watchSlidesProgress) {
            s.updateSlidesOffset();
        }
    };
    s.updateSlidesOffset = function () {
        for (var i = 0; i < s.slides.length; i++) {
            s.slides[i]._swiperSlideOffset = isH() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
        }
    };
    
    s.update = function () {
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updateProgress();
        s.updatePagination();
        s.updateClasses();
    };
    
    // Min/max translates
    s.minTranslate = function () {
        return (-s.snapGrid[0]);
    };
    s.maxTranslate = function () {
        return (-s.snapGrid[s.snapGrid.length - 1]);
    };
    
    /*=========================
      Slider/slides progress
      ===========================*/
    s.updateSlidesProgress = function (translate) {
        if (typeof translate === 'undefined') {
            translate = s.translate || 0;
        }
        if (s.slides.length === 0) return;
        if (typeof s.slides[0]._swiperSlideOffset === 'undefined') s.updateSlidesOffset();
    
        var offsetCenter = s.params.centeredSlides ? -translate + s.size / 2 : -translate;
    
        // Visible Slides
        var containerBox = s.container[0].getBoundingClientRect();
        var sideBefore = isH() ? 'left' : 'top';
        var sideAfter = isH() ? 'right' : 'bottom';
        s.slides.removeClass(s.params.slideVisibleClass);
        for (var i = 0; i < s.slides.length; i++) {
            var slide = s.slides[i];
            var slideCenterOffset = (s.params.centeredSlides === true) ? slide._swiperSlideSize / 2 : 0;
            var slideProgress = (offsetCenter - slide._swiperSlideOffset - slideCenterOffset) / slide._swiperSlideSize;
    
            var slideBefore = -(offsetCenter - slide._swiperSlideOffset - slideCenterOffset);
            var slideAfter = slideBefore + s.slidesSizesGrid[i];
            var isVisible =
                (slideBefore >= 0 && slideBefore < s.size) ||
                (slideAfter > 0 && slideAfter <= s.size) ||
                (slideBefore <= 0 && slideAfter >= s.size);
            if (isVisible) {
                s.slides.eq(i).addClass(s.params.slideVisibleClass);
            }
            slide.progress = slideProgress;
        }
    };
    s.updateProgress = function (translate) {
        if (typeof translate === 'undefined') {
            translate = s.translate || 0;
        }
        s.progress = (translate - s.minTranslate()) / (s.maxTranslate() - s.minTranslate());
        s.isBeginning = s.isEnd = false;
        
        if (s.progress <= 0) {
            s.isBeginning = true;
            if (s.params.onReachBeginning) s.params.onReachBeginning(s);
        }
        if (s.progress >= 1) {
            s.isEnd = true;
            if (s.params.onReachEnd) s.params.onReachEnd(s);
        }
        if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
        if (s.params.onProgress) s.params.onProgress(s, s.progress);
    };
    s.updateActiveIndex = function () {
        var translate = s.rtl ? s.translate : -s.translate;
        if (translate < s.minTranslate()) translate = s.minTranslate();
        var newActiveIndex, i, snapIndex;
        for (i = 0; i < s.slidesGrid.length; i ++) {
            if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                    newActiveIndex = i;
                }
                else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                    newActiveIndex = i + 1;
                }
            }
            else {
                if (translate >= s.slidesGrid[i]) {
                    newActiveIndex = i;
                }
            }
        }
        
        // Normalize slideIndex
        if (newActiveIndex < 0) newActiveIndex = 0;
        for (i = 0; i < s.slidesGrid.length; i++) {
            if (- translate >= s.slidesGrid[i]) {
                newActiveIndex = i;
            }
        }
        snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
        if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
    
        if (newActiveIndex === s.activeIndex) {
            return;
        }
        s.snapIndex = snapIndex;
        s.previousIndex = s.activeIndex;
        s.activeIndex = newActiveIndex;
        s.updateClasses();
    };
    
    /*=========================
      Resize Handler
      ===========================*/
    s.onResize = function () {
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updateProgress();
        s.updateClasses();
        if (s.params.slidesPerView === 'auto') s.updatePagination();
        if (s.isEnd) {
            s.slideTo(s.slides.length - 1, 0, false);
        }
        else {
            s.slideTo(s.activeIndex, 0, false);
        }
        
    };
    
    /*=========================
      Classes
      ===========================*/
    s.updateClasses = function () {
        s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
        var activeSlide = s.slides.eq(s.activeIndex);
        // Active classes
        activeSlide.addClass(s.params.slideActiveClass);
        activeSlide.next().addClass(s.params.slideNextClass);
        activeSlide.prev().addClass(s.params.slidePrevClass);
    
        // Pagination
        if (s.bullets && s.bullets.length > 0) {
            s.bullets.removeClass(s.params.bulletActiveClass);
            var bulletIndex;
            if (s.params.loop) {
                bulletIndex = s.activeIndex - s.loopedSlides;
                if (bulletIndex > s.slides.length - 1 - s.loopedSlides * 2) {
                    bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2);
                }
            }
            else {
                if (typeof s.snapIndex !== 'undefined') {
                    bulletIndex = s.snapIndex;
                }
                else {
                    bulletIndex = s.activeIndex || 0;
                }
            }
            s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);
        }
    
        // Next/active buttons
        if (s.params.prevButton) {
            if (s.isBeginning) $(s.params.prevButton).addClass(s.params.buttonDisabledClass);
            else $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
        }
        if (s.params.nextButton) {
            if (s.isEnd) $(s.params.nextButton).addClass(s.params.buttonDisabledClass);
            else $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
        }
    
    };
    
    /*=========================
      Pagination
      ===========================*/
    s.updatePagination = function () {
        if (!s.params.pagination) return;
        if (s.paginationContainer && s.paginationContainer.length > 0) {
            var bulletsHTML = '';
            var numberOfBullets = s.params.loop ? s.slides.length - s.loopedSlides * 2 : s.snapGrid.length;
            for (var i = 0; i < numberOfBullets; i++) {
                bulletsHTML += '<span class="' + s.params.bulletClass + '"></span>';
            }
            s.paginationContainer.html(bulletsHTML);
            s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
        }
    };
    
    /*=========================
      Events
      ===========================*/
    
    //Define Touch Events
    var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
    if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
    else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
    
    s.touchEvents = {
        start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
        move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
        end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
    };
    
    // Attach/detach events
    s.events = function (detach) {
        var action = detach ? 'off' : 'on';
        var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container : s.wrapper;
        var target = s.support.touch ? touchEventsTarget : $(document);
    
        var moveCapture = s.params.nested ? true : false;
        // Touch events
        touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
        target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
        target[action](s.touchEvents.end, s.onTouchEnd, false);
        $(window)[action]('resize', s.onResize);
    
        // Next, Prev, Index
        if (s.params.nextButton) $(s.params.nextButton)[action]('click', s.onClickNext);
        if (s.params.prevButton) $(s.params.prevButton)[action]('click', s.onClickPrev);
        if (s.params.pagination && s.params.paginationClickable) {
            $(s.paginationContainer)[action]('click', '.' + s.params.bulletClass, s.onClickIndex);
        }
    
        // Prevent Links Clicks
        if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', 'a', s.preventClicks, true);
    };
    s.attachEvents = function (detach) {
        s.events();
    };
    s.detachEvents = function () {
        s.events(true);
    };
    
    /*=========================
      Handle Clicks
      ===========================*/
    // Prevent Clicks
    s.allowClick = true;
    s.preventClicks = function (e) {
        if (!s.allowClick) {
            if (s.params.preventClicks) e.preventDefault();
            if (s.params.preventClicksPropagation) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    };
    // Clicks
    s.onClickNext = function (e) {
        e.preventDefault();
        s.slideNext();
    };
    s.onClickPrev = function (e) {
        e.preventDefault();
        s.slidePrev();
    };
    s.onClickIndex = function (e) {
        e.preventDefault();
        var index = $(this).index() * s.params.slidesPerGroup;
        if (s.params.loop) index = index + s.loopedSlides;
        s.slideTo(index);
    };
    
    /*=========================
      Handle Touches
      ===========================*/
    function findElementInEvent(e, selector) {
        var el = $(e.target);
        if (!el.is(selector)) {
            if (typeof selector === 'string') {
                el = el.parents(selector);
            }
            else if (selector.nodeType) {
                var found;
                el.parents().each(function (index, _el) {
                    if (_el === selector) found = selector;
                });
                if (!found) return undefined;
                else return selector;
            }
        }
        if (el.length === 0) {
            return undefined;
        }
        return el[0];
    }
    s.updateClickedSlide = function (e) {
        var slide = findElementInEvent(e, '.' + s.params.slideClass);
        if (!slide) {
            s.clickedSlide = s.clickedSlideIndex = undefined;
        }
        else {
            s.clickedSlide = slide;
            s.clickedSlideIndex = $(slide).index();
        }
    };
    
    var isTouched, isMoved, touchesStart = {}, touchesCurrent = {}, touchStartTime, isScrolling, currentTranslate, startTranslate, allowThresholdMove;
    s.animating = false;
    var lastClickTime = Date.now(), clickTimeout;
    var velocities = [], allowMomentumBounce;
    // Form elements to match
    var formElements = 'input, select, textarea, button';
    
    // Touch handlers
    s.onTouchStart = function (e) {
        if (e.type === 'mousedown' && 'which' in e && e.which === 3) return;
        if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) return;
        if (s.params.swipeHandler) {
            if (!findElementInEvent(e, s.params.swipeHandler)) return;
        }
        isTouched = true;
        isMoved = false;
        isScrolling = undefined;
        touchesStart.x = touchesCurrent.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        touchesStart.y = touchesCurrent.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        touchStartTime = Date.now();
        s.allowClick = true;
        s.updateContainerSize();
        s.swipeDirection = undefined;
        if (s.params.threshold > 0) allowThresholdMove = false;
        if (e.type === 'mousedown') {
            var preventDefault = true;
            if ($(e.target).is(formElements)) preventDefault = false;
            if (document.activeElement && $(document.activeElement).is(formElements)) document.activeElement.blur();
        }
        if (s.params.onTouchStart) s.params.onTouchStart(s, e);
    };
    
    s.onTouchMove = function (e) {
        if (e.preventedByNestedSwiper) return;
        if (s.params.onlyExternal) {
            isMoved = true;
            s.allowClick = false;
            return;
        }
        if (s.params.onTouchMove) s.params.onTouchMove(s, e);
        s.allowClick = false;
        if (!isTouched) return;
        if (e.targetTouches && e.targetTouches.length > 1) return;
        
        touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
    
        if (typeof isScrolling === 'undefined') {
            isScrolling = !!(isScrolling || Math.abs(touchesCurrent.y - touchesStart.y) > Math.abs(touchesCurrent.x - touchesStart.x));
        }
        if ((isH() && isScrolling) || (!isH() && !isScrolling))  {
            isTouched = false;
            return;
        }
        if (s.params.onSliderMove) s.params.onSliderMove(s, e);
    
        e.preventDefault();
    
        if (!isMoved) {
            if (params.loop) {
                s.fixLoop();
            }
            startTranslate = s.getWrapperTranslate();
            s.setWrapperTransition(0);
            if (s.animating) {
                s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
            }
            if (s.params.autoplay && s.autoplaying) {
                if (s.params.autoplayDisableOnInteraction) {
                    s.stopAutoplay();
                }
                else {
                    s.pauseAutoplay();
                }
            }
            allowMomentumBounce = false;
            //Grab Cursor
            if (s.params.grabCursor) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grabbing';
                s.container[0].style.cursor = '-moz-grabbin';
                s.container[0].style.cursor = 'grabbing';
            }
        }
        isMoved = true;
    
        var diff = isH() ? touchesCurrent.x - touchesStart.x : touchesCurrent.y - touchesStart.y;
    
        diff = diff * s.params.touchRatio;
        if (s.rtl) diff = -diff;
    
        s.swipeDirection = diff > 0 ? 'prev' : 'next';
        currentTranslate = diff + startTranslate;
    
        var disableParentSwiper = true;
        if ((diff > 0 && currentTranslate > s.minTranslate())) {
            disableParentSwiper = false;
            if (s.params.resistance) currentTranslate = s.minTranslate() + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
        }
        else if (diff < 0 && currentTranslate < s.maxTranslate()) {
            disableParentSwiper = false;
            if (s.params.resistance) currentTranslate = s.maxTranslate() - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
        }
        
        if (disableParentSwiper) {
            e.preventedByNestedSwiper = true;
        }
    
        // Directions locks
        if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
            currentTranslate = startTranslate;
        }
        if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
            currentTranslate = startTranslate;
        }
        
        if (!s.params.followFinger) return;
    
        // Threshold
        if (s.params.threshold > 0) {
            if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                if (!allowThresholdMove) {
                    allowThresholdMove = true;
                    touchesStart.x = touchesCurrent.x;
                    touchesStart.y = touchesCurrent.y;
                    currentTranslate = startTranslate;
                    return;
                }
            }
            else {
                currentTranslate = startTranslate;
                return;
            }
        }
        // Update active index in free mode
        if (s.params.freeMode) {
            s.updateActiveIndex();
    
            //Velocity
            if (velocities.length === 0) {
                velocities.push({
                    position: touchesStart[isH() ? 'x' : 'y'],
                    time: touchStartTime
                });
            }
    
            velocities.push({
                position: touchesCurrent[isH() ? 'x' : 'y'],
                time: (new Date()).getTime()
            });
        }
        // Update progress
        s.updateProgress(currentTranslate);
        // Update translate
        s.setWrapperTranslate(currentTranslate);
    };
    s.onTouchEnd = function (e) {
        if (!isTouched) return;
        if (s.params.onTouchEnd) s.params.onTouchEnd(s, e);
    
        //Return Grab Cursor
        if (s.params.grabCursor && isMoved && isTouched) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }
    
        // Time diff
        var touchEndTime = Date.now();
        var timeDiff = touchEndTime - touchStartTime;
    
        // Tap, doubleTap, Click
        if (s.allowClick) {
            s.updateClickedSlide(e);
            if (s.params.onTap) s.params.onTap(s, e);
            if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                if (clickTimeout) clearTimeout(clickTimeout);
                clickTimeout = setTimeout(function () {
                    if (!s) return;
                    if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                        s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                    }
                    if (s.params.onClick) s.params.onClick(s, e);
                }, 300);
                
            }
            if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                if (clickTimeout) clearTimeout(clickTimeout);
                if (s.params.onDoubleTap) {
                    s.params.onDoubleTap(s, e);
                }
            }
        }
    
        lastClickTime = Date.now();
        setTimeout(function () {
            if (s && s.allowClick) s.allowClick = true;
        }, 0);
    
        var touchesDiff = isH() ? touchesCurrent.x - touchesStart.x : touchesCurrent.y - touchesStart.y;
    
        if (!isTouched || !isMoved || !s.swipeDirection || touchesDiff === 0 || currentTranslate === startTranslate) {
            isTouched = isMoved = false;
            return;
        }
        isTouched = isMoved = false;
    
        var currentPos;
        if (s.params.followFinger) {
            currentPos = s.rtl ? s.translate : -s.translate;
        }
        else {
            currentPos = -currentTranslate;
        }
        if (s.params.freeMode) {
            if (currentPos < -s.minTranslate()) {
                s.slideTo(s.activeIndex);
                return;
            }
            else if (currentPos > -s.maxTranslate()) {
                s.slideTo(s.slides.length - 1);
                return;
            }
            
            if (s.params.freeModeMomentum) {
                if (velocities.length > 1) {
                    var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();
    
                    var distance = lastMoveEvent.position - velocityEvent.position;
                    var time = lastMoveEvent.time - velocityEvent.time;
    
                    s.velocity = distance / time;
                    s.velocity = s.velocity / 2;
                    if (Math.abs(s.velocity) < 0.02) {
                        s.velocity = 0;
                    }
                    // this implies that the user stopped moving a finger then released.
                    // There would be no events with distance zero, so the last event is stale.
                    // if (Math.abs(s.velocity) < 0.1 & time > 150 || timeDiff > 300) {
                    if (time > 150 || timeDiff > 300) {
                        s.velocity = 0;
                    }
                } else {
                    s.velocity = 0;
                }
    
                velocities.length = 0;
    
                var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                var momentumDistance = s.velocity * momentumDuration;
    
                var newPosition = s.translate + momentumDistance;
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                if (newPosition < s.maxTranslate()) {
                    if (s.params.freeModeMomentumBounce) {
                        if (newPosition + s.maxTranslate() < -bounceAmount) newPosition = s.maxTranslate() - bounceAmount;
                        afterBouncePosition = s.maxTranslate();
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = s.maxTranslate();
                }
                if (newPosition > s.minTranslate()) {
                    if (s.params.freeModeMomentumBounce) {
                        if (newPosition - s.minTranslate() > bounceAmount) {
                            newPosition = s.minTranslate() + bounceAmount;
                        }
                        afterBouncePosition = s.minTranslate();
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = s.minTranslate();
                }
                //Fix duration
                if (s.velocity !== 0) {
                    momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                }
    
                if (s.params.freeModeMomentumBounce && doBounce) {
                    s.updateProgress(afterBouncePosition);
                    s.setWrapperTranslate(newPosition);
                    s.setWrapperTransition(momentumDuration);
                    s.onTransitionStart();
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        if (!allowMomentumBounce) return;
                        if (s.params.onMomentumBounce) s.params.onMomentumBounce(s);
    
                        s.setWrapperTranslate(afterBouncePosition);
                        s.setWrapperTransition(s.params.speed);
                        s.wrapper.transitionEnd(function () {
                            s.onTransitionEnd();
                        });
                    });
                } else if (s.velocity) {
                    s.updateProgress(newPosition);
                    s.setWrapperTranslate(newPosition);
                    s.setWrapperTransition(momentumDuration);
                    s.onTransitionStart();
                    if (!s.animating) {
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            s.onTransitionEnd();
                        });
                    }
                        
                } else {
                    s.updateProgress(newPosition);
                }
                
                s.updateActiveIndex();
            }
            if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                s.updateProgress();
                s.updateActiveIndex();
            }
            return;
        }
    
        // Find current slide
        var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
        for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
            if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                    stopIndex = i;
                    groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                }
            }
            else {
                if (currentPos >= s.slidesGrid[i]) {
                    stopIndex = i;
                    groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                }
            }
        }
    
        // Find current slide size
        var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
        
        if (timeDiff > s.params.longSwipesMs) {
            // Long touches
            if (!s.params.longSwipes) {
                s.slideTo(s.activeIndex);
                return;
            }
            if (s.swipeDirection === 'next') {
                if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                else s.slideTo(stopIndex);
    
            }
            if (s.swipeDirection === 'prev') {
                if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                else s.slideTo(stopIndex);
            }
        }
        else {
            // Short swipes
            if (!s.params.shortSwipes) {
                s.slideTo(s.activeIndex);
                return;
            }
            if (s.swipeDirection === 'next') {
                s.slideTo(stopIndex + s.params.slidesPerGroup);
    
            }
            if (s.swipeDirection === 'prev') {
                s.slideTo(stopIndex);
            }
        }
    };
    /*=========================
      Transitions
      ===========================*/
    s._slideTo = function (slideIndex) {
        return s.slideTo(slideIndex, undefined, true, true);
    };
    s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        if (typeof slideIndex === 'undefined') slideIndex = 0;
        if (slideIndex < 0) slideIndex = 0;
        s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
        if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;
        
        var translate = - s.snapGrid[s.snapIndex];
    
        // Stop autoplay
    
        if (s.params.autoplay && s.autoplaying) {
            if (internal || !s.params.autoplayDisableOnInteraction) {
                s.pauseAutoplay();
            }
            else {
                s.stopAutoplay();
            }
        }
        // Update progress
        s.updateProgress(translate);
    
        // Normalize slideIndex
        for (var i = 0; i < s.slidesGrid.length; i++) {
            if (- translate >= s.slidesGrid[i]) {
                slideIndex = i;
            }
        }
    
        if (typeof speed === 'undefined') speed = s.params.speed;
        s.previousIndex = s.activeIndex || 0;
        s.activeIndex = slideIndex;
        
        if (translate === s.translate) {
            s.updateClasses();
            return false;
        }
        if (runCallbacks) s.onTransitionStart();
        var translateX = isH() ? translate : 0, translateY = isH() ? 0 : translate;
        if (speed === 0) {
            s.setWrapperTransition(0);
            s.setWrapperTranslate(translate);
            if (runCallbacks) s.onTransitionEnd();
        }
        else {
            s.setWrapperTransition(speed);
            s.setWrapperTranslate(translate);
            if (!s.animating) {
                s.animating = true;
                s.wrapper.transitionEnd(function () {
                    if (runCallbacks) s.onTransitionEnd();
                });
            }
                
        }
        s.updateClasses();
    };
    
    s.onTransitionStart = function () {
        if (s.params.onTransitionStart) s.params.onTransitionStart(s);
        if (s.params.onSlideChangeStart && s.activeIndex !== s.previousIndex) s.params.onSlideChangeStart(s);
    };
    s.onTransitionEnd = function () {
        s.animating = false;
        s.setWrapperTransition(0);
        if (s.params.onTransitionEnd) s.params.onTransitionEnd(s);
        if (s.params.onSlideChangeEnd && s.activeIndex !== s.previousIndex) s.params.onSlideChangeEnd(s);
    };
    s.slideNext = function (runCallbacks, speed, internal) {
        if (s.params.loop) {
            if (s.animating) return false;
            s.fixLoop();
            setTimeout(function () {
                return s.slideTo(s.activeIndex + 1, speed, runCallbacks, internal);
            }, 0);
        }
        else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
    };
    s._slideNext = function () {
        return s.slideNext(true, undefined, true);
    };
    s.slidePrev = function (runCallbacks, speed, internal) {
        if (s.params.loop) {
            if (s.animating) return false;
            s.fixLoop();
            setTimeout(function () {
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }, 0);
        }
        else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
    };
    s._slidePrev = function () {
        return s.slidePrev(true, undefined, true);
    };
    s.slideReset = function (runCallbacks, speed, internal) {
        return s.slideTo(s.activeIndex, speed, runCallbacks);
    };
    
    /*=========================
      Translate/transition helpers
      ===========================*/
    s.setWrapperTransition = function (duration) {
        s.wrapper.transition(duration);
    };
    s.setWrapperTranslate = function (translate, updateActiveIndex) {
        var x = 0, y = 0, z = 0;
        if (isH()) {
            x = s.rtl ? -translate : translate;
        }
        else {
            y = translate;
        }
        
        if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
        else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
        s.translate = isH() ? x : y;
        if (updateActiveIndex) s.updateActiveIndex();
    };
    
    s.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;
    
        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }
    
        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }
    
        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }
        if (s.rtl && curTransform) curTransform = -curTransform;
        return curTransform || 0;
    };
    s.getWrapperTranslate = function (axis) {
        if (typeof axis === 'undefined') {
            axis = isH() ? 'x' : 'y';
        }
        return s.getTranslate(s.wrapper[0], axis);
    };
    
    /*=========================
      Observer
      ===========================*/
    s.observers = [];
    function initObserver(target, options) {
        options = options || {};
        // create an observer instance
        var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
        var observer = new ObserverFunc(function (mutations) {
            mutations.forEach(function (mutation) {
                s.onResize();
            });
        });
         
        observer.observe(target, {
            attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
            childList: typeof options.childList === 'undefined' ? true : options.childList,
            characterData: typeof options.characterData === 'undefined' ? true : options.characterData
        });
    
        s.observers.push(observer);
    }
    s.initObservers = function () {
        if (s.params.observeParents) {
            var containerParents = s.container.parents();
            for (var i = 0; i < containerParents.length; i++) {
                initObserver(containerParents[i]);
            }
        }
    
        // Observe container
        initObserver(s.container[0], {childList: false});
    
        // Observe wrapper
        initObserver(s.wrapper[0], {attributes: false});
    };
    s.disconnectObservers = function () {
        for (var i = 0; i < s.observers.length; i++) {
            s.observers[i].disconnect();
        }
    };
    /*=========================
      Loop
      ===========================*/
    // Create looped slides
    s.createLoop = function () {
        // Remove duplicated slides
        s.wrapper.children('.' + s.params.slideClass + '.swiper-slide-duplicate').remove();
    
        var slides = s.wrapper.children('.' + s.params.slideClass);
        s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
        s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
        if (s.loopedSlides > slides.length) {
            s.loopedSlides = slides.length;
        }
        console.log(s.loopedSlides);
    
        var prependSlides = [], appendSlides = [], i;
        slides.each(function (index, el) {
            var slide = $(this);
            if (index < s.loopedSlides) appendSlides.push(el);
            if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
            slide.attr('data-swiper-slide-index', index);
        });
        for (i = 0; i < appendSlides.length; i++) {
            s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass('swiper-slide-duplicate'));
        }
        for (i = prependSlides.length - 1; i >= 0; i--) {
            s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass('swiper-slide-duplicate'));
        }
    };
    s.fixLoop = function () {
        var newIndex;
        //Fix For Negative Oversliding
        if (s.activeIndex < s.loopedSlides) {
            newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
            newIndex = newIndex + s.loopedSlides;
            s.slideTo(newIndex, 0, false, true);
        }
        //Fix For Positive Oversliding
        else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
            newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
            newIndex = newIndex + s.loopedSlides;
            s.slideTo(newIndex, 0, false, true);
        }
    };
    
    /*=========================
      Init/Destroy
      ===========================*/
    s.init = function () {
        if (s.params.loop) s.createLoop();
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updatePagination();
        if (s.params.loop) {
            s.slideTo(s.params.initialSlide + s.loopedSlides, 0, false);
        }
        else {
            s.slideTo(s.params.initialSlide, 0, false);
        }
        s.attachEvents();
        if (s.params.observer && s.support.observer) {
            s.initObservers();
        }
        if (s.params.updateOnImagesReady) {
            s.preloadImages();
        }
        if (s.params.autoplay) {
            s.startAutoplay();
        }
    };
    
    // Destroy
    s.destroy = function (deleteInstance) {
        s.detachEvents();
        s.disconnectObservers();
        if (s.params.onDestroy) s.params.onDestroy();
        if (deleteInstance !== false) s = null;
    };
    
    s.init();
    
    
    
    // Return swiper instance
    return s;
};

/*==================================================
    Prototype
====================================================*/
Swiper.prototype = {
    plugins: {},
    /*==================================================
        Feature Detection
    ====================================================*/
    support: {
        touch : (window.Modernizr && Modernizr.touch === true) || (function () {
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),
    
        transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
            var div = document.createElement('div').style;
            return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        })(),
    
        flexbox: (function () {
            var div = document.createElement('div').style;
            var styles = ('WebkitBox msFlexbox MsFlexbox WebkitFlex MozBox fles').split(' ');
            for (var i = 0; i < styles.length; i++) {
                if (styles[i] in div) return true;
            }
        })(),
    
        observer: (function () {
            return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
        })()
    },
};

/*===========================
Find and Export Dom library in Swiper
===========================*/
var swiperDomPlugins = ['jQuery', 'Zepto', 'Dom7'];
function addLibraryPlugin(lib) {
    lib.fn.swiper = function (params) {
        var firstInstance;
        lib(this).each(function () {
            var s = new Swiper(this, params);
            if (!firstInstance) firstInstance = s;
        });
        return firstInstance;
    };
}
(function () {
    for (var i = 0; i < swiperDomPlugins.length; i++) {
        if (window[swiperDomPlugins[i]]) {
            addLibraryPlugin(window[swiperDomPlugins[i]]);
        }
    }
})();
/*===========================
Framework7 Swiper Additions
===========================*/
app.swiper = function (container, params) {
    return new Swiper(container, params);
};
app.initSwiper = function (pageContainer) {
    var page = $(pageContainer);
    var swipers = page.find('.swiper-init');
    if (swipers.length === 0) return;
    function destroySwiperOnRemove(slider) {
        function destroySwiper() {
            slider.destroy();
            page.off('pageBeforeRemove', destroySwiper);
        }
        page.on('pageBeforeRemove', destroySwiper);
    }
    for (var i = 0; i < swipers.length; i++) {
        var swiper = swipers.eq(i);
        var params;
        if (swiper.data('swiper')) {
            params = JSON.parse(swiper.data('swiper'));
        }
        else {
            params = {
                initialSlide: parseInt(swiper.data('initialSlide'), 10) || undefined,
                spaceBetween: parseInt(swiper.data('spaceBetween'), 10) || undefined,
                speed: parseInt(swiper.data('speed'), 10) || undefined,
                slidesPerView: parseInt(swiper.data('slidesPerView'), 10) || undefined,
                direction: swiper.data('direction'),
                pagination: swiper.data('pagination'),
                paginationHide: swiper.data('paginationHide') && (swiper.data('paginationHide') === 'true' ? true : false),
                loop: swiper.data('loop') && (swiper.data('loop') === 'true' ? true : false),
                onlyExternal: swiper.data('onlyExternal') && (swiper.data('onlyExternal') === 'true' ? true : false),
                slideClass: swiper.data('slideClass'),
                slideActiveClass: swiper.data('slideActiveClass'),
                slideNextClass: swiper.data('slideNextClass'),
                slidePrevClass: swiper.data('slidePrevClass'),
                wrapperClass: swiper.data('wrapperClass'),
                bulletClass: swiper.data('bulletClass'),
                bulletActiveClass: swiper.data('bulletActiveClass'),
                nextButton: swiper.data('nextButton'),
                prevButton: swiper.data('prevButton'),
                indexButton: swiper.data('indexButton'),
                autoplay: swiper.data('autoplay')
            };
        }
        var _slider = app.swiper(swiper[0], params);
        destroySwiperOnRemove(_slider);
    }
};
app.reinitSwiper = function (pageContainer) {
    var page = $(pageContainer);
    var sliders = page.find('.swiper-init');
    if (sliders.length === 0) return;
    for (var i = 0; i < sliders.length; i++) {
        var sliderInstance = sliders[0].swiper;
        if (sliderInstance) {
            sliderInstance.onResize();
        }
    }
};
