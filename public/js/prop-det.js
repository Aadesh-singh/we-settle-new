(() => {
  const slider = document.querySelector('.fslider');
  const propCode = document.querySelector('.code');
  const area = document.querySelector('.area');
  const price = document.querySelector('.pr');
  const gender = document.querySelector('.gen');
  const genderIcon = document.querySelector('.genderIcon');
  const amenityContainer = document.querySelector('.fes-item-con');
  const amenityTemplate = document.querySelector('.amenity-template');

  GLOBAL_PROPERTY = {
    property: {},
  };

  const showAmenity = (amenities) => {
    if (!amenities || !amenities?.length) return;

    amenities.forEach((amenity) => {
      const clone = amenityTemplate.content.cloneNode(true);
      clone.querySelector('img').src = amenity?.image?.url;
      clone.querySelector('.fes-name').textContent = amenity?.name;
      amenityContainer.appendChild(clone);
    });
  };

  const showImage = (images) => {
    if (!images || !images?.length) return;

    const imageLength = Math.ceil(images.length / 3);

    const sliders = new Array(imageLength).fill(0).map((slider, idx) => {
      const elem = document.createElement('div');
      elem.classList.add(
        'slider-child-con',
        idx === 0 ? 'first-slider' : 'sli-none'
      );
      return elem;
    });

    document.querySelector('.close').addEventListener('click', () => {
      document.querySelector('.image-popup').classList.toggle('toggle');
    });

    images.forEach((image, idx) => {
      const imageCont = document.createElement('div');
      imageCont.classList.add('con-img');
      imageCont.style.cursor = 'zoom-in';
      const img = document.createElement('img');
      img.src = image?.url;
      img.style = 'width: 100%; height: 100%';
      imageCont.addEventListener('click', () => {
        document.querySelector('.image-popup img').src = image?.url;
        document.querySelector('.image-popup').classList.toggle('toggle');
      });
      imageCont.appendChild(img);
      const index = Math.ceil(idx / 2);
      console.log(index - 1, idx, index);
      sliders[index === 0 ? 0 : index - 1].appendChild(imageCont);
    });

    console.log(sliders);
    sliders.forEach((slide) => slider.appendChild(slide));

    // console.log(sliders);
    // const slider1 = document.createElement('div');
    // const slider2 = document.createElement('div');
    // const slider3 = document.createElement('div');
    // slider1.classList.add('slider-child-con', 'first-slider');
    // slider2.classList.add('slider-child-con', 'sli-none');
    // slider3.classList.add('slider-child-con', 'sli-none');

    // images.forEach((image, idx) => {
    //   const imageCont = document.createElement('div');
    //   imageCont.classList.add('con-img');
    //   const img = document.createElement('img');
    //   img.src = image?.url;
    //   img.style = 'width: 100%; height: 100%';
    //   imageCont.appendChild(img);
    //   console.log(imageCont);
    //   if (idx < 3) {
    //     return slider1.appendChild(imageCont);
    //   }
    //   if (idx < 6) return slider2.appendChild(imageCont);
    //   if (idx < 9) return slider3.appendChild(imageCont);
    // });
    // slider.appendChild(slider1);
    // slider.appendChild(slider2);
    // slider.appendChild(slider3);
  };

  const getResidence = async (code) => {
    try {
      const res = await fetch(`/api/v1/residence?code=${code}`);
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      if (!data?.residencies || !data?.residencies?.length)
        return (window.location.href = '/404');

      const property = data?.residencies[0];
      GLOBAL_PROPERTY.property = data?.residencies[0];
      showImage(data?.residencies[0]?.images);
      propCode.textContent = property?.code;

      gender.innerHTML = `<div>${property?.gender}</div>`;
      price.textContent =
        '₹' + property?.price?.single || property?.price?.double + '/mon';
      area.textContent = `${property?.area?.name || ''}-${
        property?.location?.name || ''
      }`;
      genderIcon.classList.add(`fa-${property?.gender}`);
      showAmenity(property?.amenity);
      document.querySelector('.price-single').textContent =
        ` ₹${property?.price?.single}` || '';
      document.querySelector('.price-double').textContent =
        ` ₹${property?.price?.double}` || '';
      document.querySelector('.ff-text').textContent =
        property?.occupancy?.join('/') || 'Prime';
      await relatedProp(property?.area?._id, property?._id);
      await isUserWishlist(property?._id);
      loader();

      console.log(property?.code);
    } catch (error) {}
  };

  const componentDidMount = () => {
    loader();
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) window.location.href = '/404';

    getResidence(code);
  };

  componentDidMount();

  //for automatic movement of screen
  // setInterval(function(){
  //     slide++;
  //     if(slide > sliderImg.length - 1){
  //         slide = 0;
  //     }
  //     nextSlide(slide);
  // }, 2200);

  // const leftBtn = document.querySelector('.left-btn');
  // const rightBtn = document.querySelector('.right-btn');
  // const relatedTemplate = document.querySelector('.related-template');
  // const relatedContainer = document.querySelector('.trp-parent');

  // function nextSlide(slide) {
  //   const sliderImg = document.querySelectorAll('.slider-child-con');

  //   for (let i = 0; i < sliderImg.length; i++) {
  //     sliderImg[i].classList.add('sli-none');
  //   }
  //   sliderImg[slide].classList.remove('sli-none');
  // }
  // var slide = 0;
  // //   nextSlide(slide);
  // leftBtn.addEventListener('click', function () {
  //   const sliderImg = document.querySelectorAll('.slider-child-con');

  //   slide--;
  //   if (slide < 0) {
  //     slide = sliderImg.length - 1;
  //   }
  //   nextSlide(slide);
  // });
  // rightBtn.addEventListener('click', function () {
  //   const sliderImg = document.querySelectorAll('.slider-child-con');

  //   slide++;
  //   if (slide > sliderImg.length - 1) {
  //     slide = 0;
  //   }
  //   nextSlide(slide);
  // });

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

  const propNode = (data, idx) => {
    const clone = relatedTemplate.content.cloneNode(true);
    clone.querySelector('.area').textContent = data?.area?.name || '';
    clone.querySelector('.gender').textContent = data?.gender;
    clone.querySelector('img').src = data?.images[0]
      ? data?.images[0]?.url
      : '';
    clone.querySelector('.view').addEventListener('click', () => {
      window.location.href = `/property-detail/${data?.city?.cityName}/${
        data?.area?.name || data?.location?.name
      }?code=${data?.code}`;
    });
    clone.querySelector('p').textContent = data?.name || '';
    console.log(clone.querySelector('.trp-child')?.classList);
    clone.querySelector('.trp-child').classList.add(idx >= 3 && 'none');
    relatedContainer.appendChild(clone);
  };

  const showRelatedProp = (data) => {
    console.log(data);
    if (!data || !data?.length) {
      document.querySelector('.trending-prop').style.display = 'none';
      return;
    }

    data.forEach((prop, idx) => {
      console.log(prop);
      propNode(prop, idx);
    });
  };

  async function relatedProp(areaId, code) {
    console.log(areaId, code);
    try {
      const res = await fetch(
        `/api/v1/residence?area=${areaId}&_id[ne]=${code}&limit=6`
      );
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      console.log(data);
      showRelatedProp(data?.residencies);
    } catch (error) {}
  }

  document.querySelector('.explore').addEventListener('click', () => {
    const property = GLOBAL_PROPERTY.property;
    window.location.href = `/property/${property?.city?.name || 'in'}?city=${
      property?.city?._id || 'in'
    }&placeId=${property?.area?._id}`;
  });

  const addToWishlist = async (id) => {
    try {
      const res = await fetch(`/api/v1/wishlist/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }

      if (data.status === 'success') {
        if (!data.wishlist || data?.wishlist?.deleted) {
          wishlist.style.color = 'rgb(35, 189, 196)';
          wishlist.innerHTML = "<i class='far fa-star'></i> Add to Wishlist";
        } else {
          wishlist.style.color = 'red';
          wishlist.innerHTML = 'Remove from wishlist';
        }
      }
    } catch (error) {
      tempAlert(error?.message, 3000, true);
    }
    wishlist.disabled = false;
  };
  const wishlist = document.querySelector('.wishlist');
  async function isUserWishlist(id) {
    if (!id) return;
    try {
      const res = await fetch(`/api/v1/wishlist/${id}`);
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      console.log(data);
      if (data?.wishlist) {
        wishlist.textContent = 'Remove from wishlist';
        wishlist.style.color = 'red';
      }
      // showRelatedProp(data?.residencies);
    } catch (error) {
      // tempAlert(error?.message, 3000, true);
    }
  }

  wishlist?.addEventListener('click', () => {
    const id = GLOBAL_PROPERTY.property?._id;
    wishlist.disabled = true;
    if (!id) return;
    addToWishlist(id);
  });

  const toggleModal = (modal) => modal.classList.toggle('toggle');

  const requestModal = document.querySelector('.callback-popup');
  const socialModal = document.querySelector('.social-popup');

  const closeModal = document.querySelector('.close-callback');
  document.querySelector('.enq-name').addEventListener('click', () => {
    toggleModal(requestModal);
  });

  closeModal.addEventListener('click', () => {
    toggleModal(requestModal);
  });

  document.querySelector('.close-social').addEventListener('click', () => {
    toggleModal(socialModal);
  });
  document.querySelector('.share-name').addEventListener('click', () => {
    toggleModal(socialModal);
  });

  function ShareToFaceBook(text, url) {
    let shareUrl = `http://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    window.open(shareUrl, 'NewWindow');
  }

  function ShareToWhatsapp(text, url) {
    let shareUrl = 'https://api.whatsapp.com/send?text=' + text + '%20' + url;
    console.log(shareUrl);
    window.open(shareUrl, 'NewWindow');
  }

  const shareMedia = (args, whatsapp) =>
    whatsapp ? ShareToWhatsapp(...args) : ShareToFaceBook(...args);

  const share = (whatsapp = true) => {
    const property = GLOBAL_PROPERTY.property;
    const text = `${property?.name || property?.code} in ${
      property?.city?.cityName || property?.area?.name
    }`;
    const url = window.location.href;
    const args = [text, url];
    if (navigator?.userAgentData?.mobile || window.innerWidth <= 768) {
      if (navigator.share) {
        navigator
          .share({
            title: 'Wesettle-Property',
            text,
            url,
          })
          .then()
          .catch(() => shareMedia(args, whatsapp));
      }
    }
    shareMedia(args, whatsapp);
  };

  document.querySelector('.fb').addEventListener('click', () => share(false));
  document.querySelector('.wapp').addEventListener('click', share);
})();
