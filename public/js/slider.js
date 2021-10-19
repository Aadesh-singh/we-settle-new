const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

function nextSlide(slide) {
  const sliderImg = document.querySelectorAll('.slider-child-con');

  for (let i = 0; i < sliderImg.length; i++) {
    sliderImg[i].classList.add('sli-none');
  }
  sliderImg[slide].classList.remove('sli-none');
}
var slide = 0;
//   nextSlide(slide);
leftBtn?.addEventListener('click', function () {
  const sliderImg = document.querySelectorAll('.slider-child-con');

  slide--;
  if (slide < 0) {
    slide = sliderImg.length - 1;
  }
  nextSlide(slide);
});
rightBtn?.addEventListener('click', function () {
  const sliderImg = document.querySelectorAll('.slider-child-con');

  slide++;
  if (slide > sliderImg.length - 1) {
    slide = 0;
  }
  nextSlide(slide);
});

// let rit = document.querySelector('.rit');
// let left = document.querySelector('.let');

// let trp = document.getElementsByClassName('trp-child');
// rit.addEventListener('click', function () {
//   for (i of trp) {
//     i.classList.toggle('none');
//   }
// });
// left.addEventListener('click', function () {
//   for (i of trp) {
//     i.classList.toggle('none');
//   }
// });
