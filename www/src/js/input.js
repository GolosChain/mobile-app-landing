'use strict';

import 'unfetch';

const DESKTOP_TRANSLATE_VALUE = 314;
const DESKTOP_CAROUSEL_WIDTH = 1570;
const MOBILE_TRANSLATE_VALUE = 100;
const MOBILE_CAROUSEL_PADDINGS_VALUE = 32;
const ESC_KEYCODE = 27;

// localization

const l10n = document.querySelector('.page-header__l10n');
const l10nList = document.querySelector('.page-header__l10n-list');
const l10nActive = document.querySelector('.page-header__l10n-active');
const l10nItems = document.querySelectorAll('.page-header__l10n-locale');

let open = false;

for (let item of l10nItems) {
    item.addEventListener('click', e => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        e.preventDefault();

        document.cookie = `gls.lang=${item.dataset.locale}; expires=${nextYear.toUTCString()}`;

        setTimeout(() => {
            location.assign(item.href);
        });
    });
}

l10n.addEventListener('click', () => {
    if (open) {
        return;
    }

    open = true;

    l10nList.classList.add('page-header__l10n-list--open');
    l10nActive.classList.add('page-header__l10n-active--open');
});

window.addEventListener('click', e => {
    if (!open || l10n.contains(e.target)) {
        return;
    }

    open = false;

    l10nList.classList.remove('page-header__l10n-list--open');
    l10nActive.classList.remove('page-header__l10n-active--open');
});

// reviews-carousel

const nextReviewButtonDesk = document.querySelector('.android-reviews__next-review--desk');
const nextReviewButtonMob = document.querySelector('.android-reviews__next-review--mob');
const carousel = document.querySelector('.android-reviews__reviews-carousel');
const reviews = document.querySelectorAll('.android-reviews__review');
const reviewers = document.querySelectorAll('.android-reviews__carousel-button');
const avatarsContainer = document.querySelector('.android-reviews__ava-container');

let translateDesk = 0;
let translateMob = 0;
let paddings = 0;

const nextReviewDeskHandler = evt => {
    evt.preventDefault();
    translateDesk -= DESKTOP_TRANSLATE_VALUE;
    translateDesk = Math.abs(translateDesk) < DESKTOP_CAROUSEL_WIDTH ? translateDesk : 0;
    carousel.style.transform = `translateX(${translateDesk}px)`;

    for (let i = 0; i < reviewers.length; i++) {
        if (reviewers[i].classList.contains('android-reviews__carousel-button--active')) {
            if (i + 1 < reviewers.length) {
                reviewers[i].classList.remove('android-reviews__carousel-button--active');
                reviewers[i + 1].classList.add('android-reviews__carousel-button--active');
                break;
            }
            reviewers[i].classList.remove('android-reviews__carousel-button--active');
            reviewers[0].classList.add('android-reviews__carousel-button--active');
        }
    }
};
const nextReviewMobHandler = evt => {
    evt.preventDefault();
    translateMob -= MOBILE_TRANSLATE_VALUE;
    paddings += MOBILE_CAROUSEL_PADDINGS_VALUE;

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].classList.contains('android-reviews__review--active')) {
            if (i + 1 < reviews.length) {
                carousel.style.transform = `translateX(calc(${translateMob}vw + ${paddings}px))`;
                reviews[i].classList.remove('android-reviews__review--active');
                reviews[i + 1].classList.add('android-reviews__review--active');
                break;
            }
            translateMob = 0;
            paddings = 0;
            carousel.style.transform = `translateX(${translateMob}vw)`;
            reviews[i].classList.remove('android-reviews__review--active');
            reviews[0].classList.add('android-reviews__review--active');
        }
    }
};

const checkReviewHandler = evt => {
    evt.preventDefault();

    for (let i = 0; i < reviewers.length; i++) {
        if (
            reviewers[i].classList.contains('android-reviews__carousel-button--active') &&
            evt.target !== evt.currentTarget
        ) {
            reviewers[i].classList.remove('android-reviews__carousel-button--active');
        }
        if (reviewers[i] === evt.target) {
            translateDesk = -314 * i;
            reviewers[i].classList.add('android-reviews__carousel-button--active');
            carousel.style.transform = `translateX(${translateDesk}px)`;
        }
    }
};

nextReviewButtonDesk.addEventListener('click', nextReviewDeskHandler);
nextReviewButtonMob.addEventListener('click', nextReviewMobHandler);
avatarsContainer.addEventListener('click', checkReviewHandler);

// screenshots

const slider = document.querySelector('.screenshots__img-container');
const screenshots = document.querySelectorAll('.screenshots__screenshot');
const firstScreenshotButton = document.querySelector('.screenshots__button--first');
const secondScreenshotButton = document.querySelector('.screenshots__button--second');
const screenshotsSection = document.querySelector('.screenshots');
const modalImage = document.querySelector('.modal__image');
const modalImageContainer = document.querySelector('.modal__image-container');

const nextScreenshotHandler = evt => {
    evt.preventDefault();
    for (let i = 0; i < screenshots.length; i++) {
        if (screenshots[i].classList.contains('screenshots__screenshot--active')) {
            if (i + 1 < screenshots.length) {
                slider.style.transform = 'translateX(-328px)';
                screenshots[i].classList.remove('screenshots__screenshot--active');
                screenshots[i + 1].classList.add('screenshots__screenshot--active');
                firstScreenshotButton.removeAttribute('disabled');
                secondScreenshotButton.setAttribute('disabled', true);
                break;
            }
        }
    }
};

const prevScreenshotHandler = evt => {
    evt.preventDefault();
    for (let i = 0; i < screenshots.length; i++) {
        if (screenshots[i].classList.contains('screenshots__screenshot--active')) {
            if (i - 1 >= 0) {
                slider.style.transform = 'translateX(0px)';
                screenshots[i].classList.remove('screenshots__screenshot--active');
                screenshots[i - 1].classList.add('screenshots__screenshot--active');
                firstScreenshotButton.setAttribute('disabled', true);
                secondScreenshotButton.removeAttribute('disabled');
                break;
            }
        }
    }
};

let xStart = null;
const swipeLeftHandler = evt => {
    evt.preventDefault();
};

const touchStartHandler = evt => {
    if (evt.changedTouches.length !== 1 || xStart !== null) return;
    xStart = evt.changedTouches[0].clientX;
    screenshotsSection.addEventListener('touchend', touchEndHandler);
};

const touchEndHandler = evt => {
    if (xStart === null) return;

    const xEnd = evt.changedTouches[0].clientX;
    const xDiff = xStart - xEnd;
    if (Math.abs(xDiff) > 100) {
        if (xDiff < 0) {
            prevScreenshotHandler(evt);
            xStart = null;
        }
        if (xDiff > 0) {
            nextScreenshotHandler(evt);
            xStart = null;
        }
    } else {
        xStart = null;
    }
    screenshotsSection.removeEventListener('touchend', touchEndHandler);
};

const closePreviewHandler = evt => {
    evt.preventDefault();
    if ((evt.keyCode && evt.keyCode === ESC_KEYCODE) || evt.type === 'click') {
        overlay.classList.remove('overlay--active');
        modalImageContainer.classList.remove('modal__image-container--active');
        modalImage.setAttribute('src', '');
        modalImage.setAttribute('alt', '');
        overlay.removeEventListener('click', closePreviewHandler);
        window.removeEventListener('keydown', closePreviewHandler);
    }
};

const openPreviewHandler = evt => {
    evt.preventDefault();
    if (evt.target.tagName === 'IMG') {
        overlay.classList.add('overlay--active');
        modalImageContainer.classList.add('modal__image-container--active');
        modalImage.setAttribute('src', evt.target.src);
        modalImage.setAttribute('alt', evt.target.alt);
        overlay.addEventListener('click', closePreviewHandler);
        window.addEventListener('keydown', closePreviewHandler);
    }
};

firstScreenshotButton.addEventListener('click', prevScreenshotHandler);
secondScreenshotButton.addEventListener('click', nextScreenshotHandler);
screenshotsSection.addEventListener('touchstart', touchStartHandler, { passive: true });
screenshotsSection.addEventListener('click', openPreviewHandler);

// testers form

const testersForm = document.querySelector('.be-in-touch__form');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalButton = document.querySelector('.modal__close');
const errorModal = document.querySelector('.modal__any-error');
const validationErrorModal = document.querySelector('.modal__validation-error');
let modalDescription;

const openErrorModal = (inactiveModal, activeModal) => {
    if (inactiveModal.classList.contains('modal__error--active')) {
        inactiveModal.classList.remove('modal__error--active');
    }

    activeModal.classList.add('modal__error--active');
    setTimeout(() => {
        activeModal.classList.remove('modal__error--active');
    }, 3000);
};

const testersFormSubmitHandler = evt => {
    evt.preventDefault();

    const { wantTest, wantMessage } = testersForm;
    let message;

    if (!wantTest.checked && !wantMessage.checked) {
        openErrorModal(errorModal, validationErrorModal);
        return;
    }

    if (wantTest.checked && wantMessage.checked) {
        message = 'both';
    } else if (wantTest.checked && !wantMessage.checked) {
        message = 'test';
    } else {
        message = 'message';
    }

    const fetchConfig = {
        method: 'POST',
        body: JSON.stringify({
            email: testersForm.email.value,
            wantTest: wantTest.checked,
            wantMessage: wantMessage.checked,
        }),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    };

    fetch('/subscribe', fetchConfig)
        .then(res => {
            if (res.status === 200) {
                openModal(message);
            } else {
                openErrorModal(validationErrorModal, errorModal);
            }
        })
        .catch(err => {
            openErrorModal(validationErrorModal, errorModal);
        });
};

testersForm.addEventListener('submit', testersFormSubmitHandler);

function openModal(message) {
    modalDescription = document.querySelector(`.modal__description--${message}`);
    modalDescription.classList.add('modal__description--active');
    modal.classList.add('modal--active');
    overlay.classList.add('overlay--active');
    closeModalButton.addEventListener('click', closeModalHandler);
    overlay.addEventListener('click', closeModalHandler);
    window.addEventListener('keydown', closeModalHandler);
}

function closeModalHandler(evt) {
    evt.preventDefault();
    modalDescription.classList.remove('modal__description--active');
    modal.classList.remove('modal--active');
    overlay.classList.remove('overlay--active');
    closeModalButton.removeEventListener('click', closeModalHandler);
    overlay.removeEventListener('click', closeModalHandler);
    window.removeEventListener('keydown', closeModalHandler);
}

const resizeHandler = () => {
    if (translateMob) {
        translateMob = 0;
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].classList.contains('android-reviews__review--active')) {
                reviews[i].classList.remove('android-reviews__review--active');
                reviews[0].classList.add('android-reviews__review--active');
                break;
            }
        }
        carousel.style.transform = 'translateX(0)';
    }

    if (translateDesk) {
        translateDesk = 0;
        carousel.style.transform = 'translateX(0)';
    }

    if (slider.style.transform) {
        slider.style.transform = 'translateX(0px)';
        firstScreenshotButton.setAttribute('disabled', true);
        secondScreenshotButton.removeAttribute('disabled');
    }
};

window.addEventListener('resize', resizeHandler);
