'use strict';

// localization

const l10n = document.querySelector('.page-header__l10n');
const l10nList = document.querySelector('.page-header__l10n-list');
const l10nActive = document.querySelector('.page-header__l10n-active');

const openL10nHandler = evt => {
    evt.preventDefault();
    l10nList.classList.toggle('page-header__l10n-list--open');
};

l10n.addEventListener('click', openL10nHandler);

// reviews-carousel

const nextReviewButtonDesk = document.querySelector('.android-reviews__next-review--desk');
const nextReviewButtonMob = document.querySelector('.android-reviews__next-review--mob');
const carousel = document.querySelector('.android-reviews__reviews-carousel');
const reviews = document.querySelectorAll('.android-reviews__review');
const reviewers = document.querySelectorAll('.android-reviews__reviewer-ava--desk');
const avatarsContainer = document.querySelector('.android-reviews__ava-container');

let translateDesk = 0;
let translateMob = 0;
let paddings = 0;

const nextReviewDeskHandler = evt => {
    evt.preventDefault();
    translateDesk -= 314;
    translateDesk = Math.abs(translateDesk) < 1570 ? translateDesk : 0;
    carousel.style.transform = `translateX(${translateDesk}px)`;

    for (let i = 0; i < reviewers.length; i++) {
        if (reviewers[i].classList.contains('android-reviews__reviewer-ava--active')) {
            if (i + 1 < reviewers.length) {
                reviewers[i].classList.remove('android-reviews__reviewer-ava--active');
                reviewers[i + 1].classList.add('android-reviews__reviewer-ava--active');
                break;
            }
            reviewers[i].classList.remove('android-reviews__reviewer-ava--active');
            reviewers[0].classList.add('android-reviews__reviewer-ava--active');
        }
    }
};
const nextReviewMobHandler = evt => {
    evt.preventDefault();
    translateMob -= 100;
    paddings += 32;

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
            reviewers[i].classList.contains('android-reviews__reviewer-ava--active') &&
            reviewers[i].parentNode !== evt.target &&
            evt.target !== evt.currentTarget
        ) {
            reviewers[i].classList.remove('android-reviews__reviewer-ava--active');
        }
        if (reviewers[i].parentNode === evt.target) {
            translateDesk = -314 * i;
            reviewers[i].classList.add('android-reviews__reviewer-ava--active');
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
    } else xStart = null;
    screenshotsSection.removeEventListener('touchend', touchEndHandler);
};

firstScreenshotButton.addEventListener('click', prevScreenshotHandler);
secondScreenshotButton.addEventListener('click', nextScreenshotHandler);
screenshotsSection.addEventListener('touchstart', touchStartHandler);

// testers form

const testersForm = document.querySelector('.be-in-touch__form');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const testersFormSubmitHandler = evt => {
    evt.preventDefault();
    // const data = new FormData(testersForm);
    // const fetchConfig = { method: 'POST', body: data };
    // fetch('https://url', fetchConfig)
    //     .then(res => {
    //         if (res.status === 200) {
    //             modal.classList.add('modal--active');
    //             overlay.classList.add('overlay--active');
    //         } else console.log('server unavailable');
    //     })
    //     .catch(err => {
    //         console.log('something went wrong...', err);
    //     });
    modal.classList.add('modal--active');
    overlay.classList.add('overlay--active');
};

testersForm.addEventListener('submit', testersFormSubmitHandler);

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
