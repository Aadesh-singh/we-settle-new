const cross = document.querySelector('.side-menu');
const select = document.querySelector('select');

cross.addEventListener('click', function () {
  cross?.classList?.add('right');
  select?.classList?.remove('z-index');
});
const bars = document.getElementById('bars');
console.log(bars);
bars.addEventListener('click', function () {
  cross?.classList?.remove('right');
  select?.classList?.add('z-index');
});

// review

var revItem = 0;
const review = document.querySelectorAll('.rev-parent');
console.log(review.length);
const down = document.querySelector('.down');

down.addEventListener('click', function () {
  console.log(revItem);
  if (revItem > review.length - 1) revItem = 0;
  for (let i = 0; i < review.length; i++) {
    review[i].classList.add('none');
  }
  review[revItem].classList.remove('none');
  revItem++;
});

setInterval(function () {
  if (revItem > review.length - 1) revItem = 0;
  for (let i = 0; i < review.length; i++) {
    review[i].classList.add('none');
  }
  review[revItem].classList.remove('none');
  revItem++;
}, 1700);

let rit = document.querySelector('.rit');
let left = document.querySelector('.let');

let trp = document.getElementsByClassName('trp-child');
rit?.addEventListener('click', function () {
  for (i of trp) {
    i.classList.toggle('none');
  }
});
left?.addEventListener('click', function () {
  for (i of trp) {
    i.classList.toggle('none');
  }
});

const trendingContainer = document.querySelector('.trp-parent');
const trendingTemp = document.querySelector('.trendingTemp');

const showTrending = (trending) => {
  if (!trending || !trending?.length) return;

  trending.forEach((property, idx) => {
    const clone = trendingTemp.content.cloneNode(true);
    idx > 2 && clone.querySelector('.trp-child').classList.add('none');
    clone.querySelector('.area').textContent =
      property?.area?.name || property?.name || '';
    clone.querySelector('.gender').textContent = property?.gender;
    clone.querySelector('img').src = property?.images[0]?.url;
    clone.querySelector('a').href = `/property/${
      property?.city?.cityName || 'in'
    }?city=${property?.city?._id || 'in'}&placeId=${property?.area?._id || ''}`;
    trendingContainer.appendChild(clone);
  });
};

const fetchTrending = async () => {
  try {
    const res = await fetch(
      `/api/v1/residence?trending=true&sort=trendingOrder`
    );
    const data = await res.json();
    if (data.status === 'fail' || data.status === 'error') {
      throw new Error(data?.message);
    }
    showTrending(data?.residencies);
  } catch (error) {
    console.log(error);
  }
};

fetchTrending();
