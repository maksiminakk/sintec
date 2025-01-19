"use strict";

document.addEventListener("DOMContentLoaded", function () {
    function isWebp() {

        function testWebP(callback) {
            let webP = new Image();
            webP.onload = webP.onerror = function () {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }

        testWebP(function (support) {
            let className = support === true ? 'webp' : 'no-webp';
            document.documentElement.classList.add(className);
        });
    }
    isWebp();

    const header = document.querySelector('.header')
    const menu = document.querySelector('.menu');
    const burgerBtn = document.querySelector('.header__burger-icon');
    const closeMenuBtn = document.querySelector('.menu__close');

    if (menu && burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            toggleActiveClass(menu);
            toggleActiveClass(header);
            toggleActiveClass(burgerBtn);
        });
    }

    const scrollLinks = document.querySelectorAll('[data-goto]');
    if (scrollLinks.length > 0) {
        scrollLinks.forEach(link => {
            link.addEventListener("click", onScrollLinkClick);
        });

        function onScrollLinkClick(e) {
            const link = e.target;
            if (link.dataset.goto && document.querySelector(link.dataset.goto)) {
                const gotoBlock = document.querySelector(link.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: "smooth"
                });
                e.preventDefault();

                if (menu.classList.contains('_active')) {
                    removeActiveClass(menu);
                    removeActiveClass(header);
                    removeActiveClass(burgerBtn);
                }
            }
        }
    }

    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll(".lock-padding");

    let unlock = true;

    const timeout = 500;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                const popupName = popupLink.getAttribute('href').replace('#', '');
                const curentPopup = document.getElementById(popupName);
                popupOpen(curentPopup);
                e.preventDefault();
            });
        }
    }

    const popupCloseIcon = document.querySelectorAll('.close-popup');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.popup'));
                e.preventDefault();
            });
        }
    }

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup.open');
            console.log("test");
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
        }
    }

    function popupClose(popupActive, doUnlock = true) {
        if (unlock) {
            popupActive.classList.remove('open');
            if (doUnlock) {
                bodyUnLock();
            }
        }
    }

    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('_lock');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }
            body.style.paddingRight = '0px';
            body.classList.remove('_lock');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    document.addEventListener('keydown', function (e) {
        if (e.which === 27) {
            const popupActive = document.querySelector('.popup.open');
            popupClose(popupActive);
        }
    });

    const animItems = document.querySelectorAll('._anim-items');

    if (animItems.length > 0) {
        window.addEventListener('scroll', animOnScroll);

        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;

                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }

                if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                    animItem.classList.add('_visible');
                } else {
                    if (!animItem.classList.contains('_anim-no-hide')) {
                        animItem.classList.remove('_visible');
                    }

                }
            }
        }

        function offset(el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }

        setTimeout(() => {
            animOnScroll();
        }, 200);

    }

    const spollersArray = document.querySelectorAll('[data-spollers]');
    if (spollersArray.length > 0) {
        //получение обычных спойлеров
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });
        //инициализация спойлера
        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }
        //получение спойлеров с медиа запросами
        const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
            return item.dataset.spollers.split(",")[0];
        });

        // инициализация спойлеров с медиа запросами
        if (spollersMedia.length > 0) {
            const breakpointsArray = [];
            spollersMedia.forEach(item => {
                const params = item.dataset.spollers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });

            //получение уникальных брейкпоинтов
            let mediaQueries = breakpointsArray.map(function (item) {
                return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            //работа с каждым брейкпоинтом
            mediaQueries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                //обьекты с нужными значениями
                const spollersArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });
                //событие
                matchMedia.addListener(function () {
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
            });
        }
        //инициализация
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add('_init');
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove('_init');
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }

        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
            if (spollerTitles.length > 0) {
                spollerTitles.forEach(spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute('tabindex');
                        if (!spollerTitle.classList.contains('_active')) {
                            spollerTitle.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute('tabindex', '-1');
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
        }

        function setSpollerAction(e) {
            const el = e.target;
            if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
                const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
                const spollersBlock = spollerTitle.closest('[data-spollers]');
                const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
                if (!spollersBlock.querySelectorAll('._slide').length) {
                    if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.parentElement.classList.toggle('_active');
                    spollerTitle.classList.toggle('_active');
                    _slideToggle(spollerTitle.nextElementSibling, 500);
                }
                e.preventDefault();
            }
        }

        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove('_active');
                spollerActiveTitle.parentElement.classList.remove('_active');
                _slideUp(spollerActiveTitle.nextElementSibling, 500);
            }
        }
    }

    let _slideUp = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = true;
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('mragin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    };

    let _slideDown = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (target.hidden) {
                target.hidden = false;
            }
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    };

    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    };

    const spollersMigrationItem = document.querySelectorAll('.technologies-item');

    spollersMigrationItem.forEach(item => {
        const migrText = item.querySelector('.technologies-item__text');
        const migrProduct = item.querySelector('.technologies-item-product');
        const migrImage = item.querySelector('.technologies-item__image');
        const migrBtn = item.querySelector('.technologies-item__button');
        const migrContainerLeft = item.querySelector('.technologies-item__left');
        const migrContainerRight = item.querySelector('.technologies-item__right');
        const migrTopWrapper = item.querySelector('.technologies-item__top');
        if (window.innerWidth < 1024) {
            migrContainerRight.append(migrImage)
            migrContainerRight.append(migrProduct)
            migrContainerLeft.append(migrBtn)
            migrTopWrapper.append(migrText)
        }
    });


    const menuItems = document.querySelectorAll('.tests-menu__item');
const progressBars = document.querySelectorAll('.tests-menu__progress-bar .progress');
const testsMenu = document.querySelector('.tests-menu');

const swiper = new Swiper('.slider__item', {
    direction: 'vertical',
    loop: true,
    slidesPerView: 1,
    autoHeight: true,
    spaceBetween: 50,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    breakpoints: {
        767: {
            direction: 'vertical',
        },
        0: {
            direction: 'horizontal',
            spaceBetween: 20,
        },
    },
    on: {
        slideChange: function () {
            updateProgressBars(this);
        },
        loopFix: function () {
            updateProgressBars(this, this.realIndex);
        }
    },
});

function updateProgressBars(swiperInstance, clickedIndex = null) {
    let activeIndex = clickedIndex !== null ? clickedIndex : swiperInstance.realIndex;
    const isMobile = window.innerWidth <= 1024;

    // Обрабатываем переход по loop: если перешли с конца на начало или наоборот
    if (swiperInstance.activeIndex >= swiperInstance.slides.length - swiperInstance.loopedSlides) {
        activeIndex = 0;
    } else if (swiperInstance.activeIndex < swiperInstance.loopedSlides) {
        activeIndex = menuItems.length - 1;
    }

    // Сначала сбрасываем все прогресс-бары
    progressBars.forEach((bar) => {
        bar.style.transition = 'none';
        if (isMobile) {
            bar.style.width = '0%';
            bar.style.height = '';
        } else {
            bar.style.height = '0%';
            bar.style.width = '';
        }
    });

    // Теперь заполняем прогресс у пройденных пунктов
    progressBars.forEach((bar, index) => {
        if (index < activeIndex) {
            bar.style.transition = 'none';
            if (isMobile) {
                bar.style.width = '100%';
                bar.style.height = '';
            } else {
                bar.style.height = '100%';
                bar.style.width = '';
            }
            menuItems[index].classList.add('completed');
        } else if (index === activeIndex) {
            setTimeout(() => {
                bar.style.transition = isMobile ? 'width 5s linear' : 'height 5s linear';
                if (isMobile) {
                    bar.style.width = '100%';
                    bar.style.height = '';
                } else {
                    bar.style.height = '100%';
                    bar.style.width = '';
                }
            }, 50);
            menuItems[index].classList.add('completed');
        } else {
            menuItems[index].classList.remove('completed');
        }
    });

    menuItems.forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
        if (index === activeIndex && isMobile) {
            testsMenu.scrollLeft = item.offsetLeft;
        }
    });
}

// Обработка кликов по меню
menuItems.forEach((item) => {
    item.addEventListener('click', function () {
        const index = parseInt(this.dataset.index);
        swiper.slideToLoop(index);
        updateProgressBars(swiper, index);
    });
});

// Исправление бага с loop при возврате назад
swiper.on('loopFix', function () {
    updateProgressBars(swiper, swiper.realIndex);
});

// Запуск начальной анимации
menuItems[0].classList.add('completed');
updateProgressBars(swiper);



    const sections = document.querySelectorAll("section");

    const thirdSection = sections[2];
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const thirdSectionOffset = thirdSection.getBoundingClientRect().top + window.scrollY;

        if (currentScrollY >= thirdSectionOffset) {
            if (currentScrollY > lastScrollY) {
                header.classList.add("_hidden");
            } else {
                header.classList.remove("_hidden");
                header.classList.add("fixed");
            }
        } else {
            header.classList.remove("_hidden");
            header.classList.remove("fixed");
        }

        lastScrollY = currentScrollY;
    });

    function toggleActiveClass(el) {
        el.classList.toggle('_active');
        el.parentElement.classList.toggle('_active');
    }

    function addActiveClass(el) {
        el.classList.add('_active');
        el.parentElement.classList.add('_active');
    }

    function removeActiveClass(el) {
        el.classList.remove('_active');
        el.parentElement.classList.remove('_active');
    }
});