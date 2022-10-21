'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('.section');
const containerNavLinks = document.querySelector('.nav__links');
const containerNav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const containerTabs = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const h1 = document.querySelector('h1');
const header = document.querySelector('.header');
const imgTarget = document.querySelectorAll('img[data-src]');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page navigation
containerNavLinks.addEventListener('click', function (e) {
  e.preventDefault();
  //Maching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//1.Add event listener to comon parent element
//2.Determine what element originated the event

//Tabbed component

containerTabs.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  //remove active tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Active Tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//Passing 'argument' into handler
containerNav.addEventListener('mouseover', handleHover.bind(0.5));
containerNav.addEventListener('mouseout', handleHover.bind(1));

// sticky navigations
// const posSec1 = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > posSec1.top) containerNav.classList.add('sticky');
//   else {
//     containerNav.classList.remove('sticky');
//   }
// });

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//     console.log(entry.isIntersecting);

//     if (!entry.isIntersecting) {
//       containerNav.classList.add('sticky');
//     } else {
//       containerNav.classList.remove('sticky');
//     }
//   });
// };
// //will be called each time when out target element intersects with the root element at the treshold we defined
// const obsOptions = {
//   root: null, // the element we want our target element to intersect
//   //null to observe intersection the entire viewport
//   threshold: [0],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(header);

const navHeight = containerNav.getBoundingClientRect().height;
const obsCallback = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) containerNav.classList.remove('sticky');
  else containerNav.classList.add('sticky');
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //90 is the height of nav
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

//reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const revelOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(revealSection, revelOptions);

sections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//LAZY img
const imgCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; //Guard clause
  const img = entry.target;
  img.src = img.dataset.src; //when javascript replaces an emage it load it first and then when loaded replaces the image
  img.addEventListener('load', function () {
    img.classList.remove('lazy-img');
  });
  imgObserver.unobserve(img);
};
const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};
const imgObserver = new IntersectionObserver(imgCallback, imgOptions);
imgTarget.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeftSlide = document.querySelector('.slider__btn--left');
  const btnRightSlide = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  let maxSlide = slides.length;

  // slider.style.transform = 'scale(0.5) translateX(-150px)';
  // slider.style.overflow = 'visible';

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  //dots__dot--active

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    curSlide == slide;

    activateDot(slide);
  };
  const activateDot = function (slide) {
    dotContainer
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    dotContainer
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    curSlide++;
    if (curSlide === maxSlide) curSlide = 0;
    goToSlide(curSlide);
  };
  const prevSlide = function () {
    curSlide--;
    if (curSlide === -1) curSlide = maxSlide - 1;
    goToSlide(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(curSlide);
  };
  init();
  btnRightSlide.addEventListener('click', nextSlide);
  btnLeftSlide.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  // curSlide = 1; -100% 0% 100% 200%

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
slider();
////////////////////////////////////////////////////////////////////

/*
const h1 = document.querySelector('h1');

//old way
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great you are reading the heading');
// };

//this allows us to add multiple event listeners to the same event
//we can remove an event handler
const alerth1 = function (e) {
  alert('addEventListener: Great you are reading the heading');
};
h1.addEventListener('mouseenter', alerth1);

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000);
*/
//////////////////////////////////////////////////////////
/*
//random color
//rgb(255,255,255)
const randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('link', e.target, e.currentTarget);
  // console.log(this === e.currentTarget);

  //StopPropagation
  // e.stopPropagation();
  //not a good idea
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('container', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('nav', e.target, e.currentTarget);
});
*/

///////////////////////////////////////////////////////
/*
// DOM Traversing

//going downwards: child

console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); //only direct child
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
//Dom Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree Build', e);
});
// we dont need to insert all of our code in this event listener because
//out script is placed at the end of the body and is executed
//after the rest of the html is parsed

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); //some browsers require it
//   console.log(e);
//   e.returnValue = ''; //for historical reasons
// });
