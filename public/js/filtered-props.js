(() => {
  const aside = document.querySelector('aside');
  const none = document.querySelector('.none');

  const crs = document.querySelector('.crs');

  none.addEventListener('click', function () {
    aside.classList.add('aside-left');
  });

  crs.addEventListener('click', function () {
    aside.classList.remove('aside-left');
  });

  // slider

  var inputLeft = document.getElementById('input-left');
  var inputRight = document.getElementById('input-right');

  var thumbLeft = document.querySelector('.slider > .thumb.left');
  var thumbRight = document.querySelector('.slider > .thumb.pright');
  var range = document.querySelector('.slider > .range');

  function setLeftValue() {
    var _this = inputLeft,
      min = parseInt(_this.min),
      max = parseInt(_this.max);

    _this.value = Math.min(
      parseInt(_this.value),
      parseInt(inputRight.value) - 1
    );

    var percent = ((_this.value - min) / (max - min)) * 100;

    thumbLeft.style.left = percent + '%';
    range.style.left = percent + '%';
  }
  // setLeftValue();

  function setRightValue() {
    var _this = inputRight,
      min = parseInt(_this.min),
      max = parseInt(_this.max);

    _this.value = Math.max(
      parseInt(_this.value),
      parseInt(inputLeft.value) + 1
    );

    var percent = ((_this.value - min) / (max - min)) * 100;

    thumbRight.style.right = 100 - percent + '%';
    range.style.right = 100 - percent + '%';
  }
  // setRightValue();

  inputLeft.addEventListener('input', setLeftValue);
  inputRight.addEventListener('input', setRightValue);

  inputLeft.addEventListener('mouseover', function () {
    thumbLeft.classList.add('hover');
  });
  inputLeft.addEventListener('mouseout', function () {
    thumbLeft.classList.remove('hover');
  });
  inputLeft.addEventListener('mousedown', function () {
    thumbLeft.classList.add('active');
  });
  inputLeft.addEventListener('mouseup', function () {
    thumbLeft.classList.remove('active');
  });

  inputRight.addEventListener('mouseover', function () {
    thumbRight.classList.add('hover');
  });
  inputRight.addEventListener('mouseout', function () {
    thumbRight.classList.remove('hover');
  });
  inputRight.addEventListener('mousedown', function () {
    thumbRight.classList.add('active');
  });
  inputRight.addEventListener('mouseup', function () {
    thumbRight.classList.remove('active');
  });

  const GLOBAL__FILTER = {
    loading: true,
    placeId: '',
    cityId: '',
    minPrice: 0,
    maxPrice: 0,
    query: `/api/v1/residence?or=${this.placeId}`,
    baseQuery: '',
    filter: {
      sort: '',
      or: '',
      price: {
        lte: '',
        gte: '',
      },
      gender: [],
    },
  };

  const residenceTemplate = document.querySelector('.residence');
  const residenceContainer = document.querySelector('.filtered-props');
  const price = document.querySelector('.price');
  const slider = document.querySelector('.middle');
  const localityContainer = document.querySelector('.locality-container');
  const localityTemplate = document.querySelector('.locality-template');
  const sortPrice = document.querySelectorAll('.sortPrice');
  const genderFilter = document.querySelectorAll('.gender-filter');

  const createResidenceNode = (data) => {
    const clone = residenceTemplate.content.cloneNode(true);
    clone
      .querySelector('.fil-img-con img')
      .setAttribute('src', data?.images?.length && data?.images[0]?.url);

    clone.querySelector('.fil-loc').textContent = `${data?.name || ''}${
      data?.name ? ',' : ''
    }${data?.area?.name || ''}-${data?.location?.name || ''}`;

    clone.querySelector('.rent-price').textContent = `₹${
      data?.price?.single || data?.price?.double
    }`;

    clone.querySelector('.gender').textContent = data?.gender;
    clone.querySelector('.code').textContent = data?.code || '';
    const amenities = clone.querySelector('.fes-icons');
    data?.amenity?.length &&
      data?.amenity.forEach((item, idx) => {
        if (idx >= 3) return;
        const span = document.createElement('span');
        span.classList.add('fas-icon');
        const img = document.createElement('img');
        img.src = item?.image?.url;
        img.style = 'width:30px;height:30px;margin-right:5px;';
        span.appendChild(img);

        amenities.prepend(span);
      });
    clone.querySelector('.vm-btn').addEventListener('click', () => {
      window.location.href = `/property-detail/${
        data?.city?.cityName || 'in'
      }/${data?.area?.name || data?.location?.name}?code=${data?.code}`;
    });
    clone.querySelector('.icon-count').textContent =
      data?.amenity?.length >= 3 ? `+${data?.amenity?.length - 3}` : '';

    residenceContainer.appendChild(clone);
  };

  const setRange = (input, value, min = true) => {
    input.setAttribute(min ? 'min' : 'max', value);
  };
  const setPrice = (data) => {
    // if (!data || !data?.length) {
    //   slider.style.display = 'none';
    //   return;
    // }

    // if (data.length === 1) {
    //   slider.style.display = 'none';
    // }
    if (!data) return;
    // const min = data[0].price.single;
    // const max = data[data.length - 1].price.single;

    const min = data?.min;
    const max = data?.max;

    const minPrice = min < max ? min : max;
    const maxPrice = max > min ? max : min;
    price.textContent = `₹${minPrice} - ₹${maxPrice}`;
    setRange(inputLeft, minPrice);
    setRange(inputLeft, maxPrice, false);
    setRange(inputRight, minPrice);
    setRange(inputRight, maxPrice, false);

    document.querySelector('#input-left').value = minPrice;
    document.querySelector('#input-right').value = maxPrice;
    setLeftValue();
    setRightValue();

    GLOBAL__FILTER.minPrice = minPrice;
    GLOBAL__FILTER.maxPrice = maxPrice;

    GLOBAL__FILTER.filter.price.lte = maxPrice;
    GLOBAL__FILTER.filter.price.gte = minPrice;
  };

  const displayResidence = (data) => {
    console.log(data);
    if (!data || !data?.length) {
      window.location.href = '/404';
      residenceContainer.innerHTML = '';
      return;
    }
    residenceContainer.innerHTML = '';
    return data.forEach((residence) => createResidenceNode(residence));
  };
  const getResidence = async (query, filter = false) => {
    try {
      const res = await fetch(query);
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      console.log('done');
      displayResidence(data?.residencies);
      if (!filter) fetchLocality();

      loader();
      // setPrice(data?.residencies);
      return data?.residencies;
    } catch (error) {}
  };

  const setLocalStorage = (key, value) => localStorage.setItem(key, value);
  const componentDidMount = async () => {
    loader();
    console.log('hi');
    const params = new URLSearchParams(window.location.search);
    let cityId = params.get('city');
    let placeId = params.get('placeId');
    if (!cityId || !placeId) {
      const metaCity = localStorage.getItem('metaCity');
      const metaPlace = localStorage.getItem('metaPlace');
      if (metaCity && metaPlace) {
        cityId = metaCity;
        placeId = metaPlace;
      }
    }
    setLocalStorage('metaCity', cityId);
    setLocalStorage('metaPlace', placeId);
    GLOBAL__FILTER.placeId = placeId;
    GLOBAL__FILTER.cityId = cityId;
    // GLOBAL__FILTER.filter.or = placeId;
    GLOBAL__FILTER.baseQuery = `/api/v1/residence`;
    await getResidence(GLOBAL__FILTER.baseQuery + `?or=${placeId}`);

    try {
      const res = await fetch('/api/v1/residence/price');
      const data = await res.json();
      if (data.status === 'error' || data.status === 'fail') {
        throw new Error(data?.message);
      }
      setPrice(data?.result);
    } catch (error) {}
    // setPrice(data);
    GLOBAL__FILTER.loading = false;
  };

  componentDidMount();

  const debounce = function (fn, d) {
    let timer;
    return function () {
      let context = this,
        args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, d);
    };
  };

  inputLeft.addEventListener(
    'change',
    debounce((e) => {
      console.log('Fired ', e.target.value);
      price.textContent = `₹${e.target.value}-₹${inputRight.value}`;
      GLOBAL__FILTER.filter.price.gte = e.target.value;
      buildQuery();
    })
  );

  inputRight.addEventListener(
    'change',
    debounce((e) => {
      console.log('Fired ', e.target.value);
      price.textContent = `₹${inputLeft.value}-₹${e.target.value}`;

      GLOBAL__FILTER.filter.price.lte = e.target.value;
      buildQuery();
    })
  );
  const createLocalityNode = (data) => {
    const clone = localityTemplate.content.cloneNode(true);
    const input = clone.querySelector('input');
    input.value = data?._id || '';
    input.setAttribute('id', data?._id);

    input.addEventListener('click', (e) => {
      console.log(e.target.value, e.target.checked, GLOBAL__FILTER.filter.or);
      if (e.target.checked) {
        GLOBAL__FILTER.filter.or =
          GLOBAL__FILTER.filter.or += `${e.target.value},`;
      } else {
        const filtered = GLOBAL__FILTER.filter.or
          .split(',')
          .filter((item) => item !== e.target.value);
        console.log(filtered, 22);
        GLOBAL__FILTER.filter.or = filtered.join(',');
      }
      buildQuery();
    });
    const label = clone.querySelector('label');
    label.textContent = data?.name;
    label.setAttribute('for', data?._id);
    localityContainer.appendChild(clone);
  };

  const showLocality = (data) => {
    console.log(data);
    if (!data || !data?.length) return;

    data.forEach((locality) => createLocalityNode(locality));
  };

  async function fetchLocality() {
    try {
      const res = await fetch(
        `/api/v1/area?city=${GLOBAL__FILTER.cityId}&placeType=locality`
      );
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      showLocality(data?.areas);
      console.log(GLOBAL__FILTER.query);
    } catch (error) {}
  }

  function buildQuery() {
    console.log('building', GLOBAL__FILTER);
    if (GLOBAL__FILTER.loading) return;
    let query =
      GLOBAL__FILTER.baseQuery +
      `?or=${GLOBAL__FILTER.filter.or || GLOBAL__FILTER.placeId}${
        GLOBAL__FILTER.filter.or ? '&orField=location' : ''
      }`;

    // if (!GLOBAL__FILTER.filter.or) {
    //   getResidence(query, true);
    //   return;
    // }
    Object.entries(GLOBAL__FILTER.filter).forEach(([key, value]) => {
      if (Array.isArray(value) && value?.length) {
        value.forEach((item) => (query += `&${key}=${item}`));
        return;
      }
      if (key === 'price') {
        console.log(value);
        if (value?.lte) query += `&${key}[lte]=${value.lte}`;
        if (value?.gte) query += `&${key}[gte]=${value.gte}`;
        return;
      }
      if (key === 'or') return;
      if (value && !Array.isArray(value)) query += `&${key}=${value}`;
    });
    console.log(query);
    GLOBAL__FILTER.query = query;
    getResidence(query, true);
  }

  sortPrice.forEach((input, idx) => {
    input.addEventListener('click', (e) => {
      GLOBAL__FILTER.filter.sort = `price.single${idx ? '&order=-1' : ''}`;
      buildQuery();
    });
  });

  genderFilter.forEach((input) => {
    input.addEventListener('click', (e) => {
      if (e.target.checked) {
        GLOBAL__FILTER.filter.gender.push(e.target.value);
      } else {
        const filteredGender = GLOBAL__FILTER.filter.gender.filter(
          (item) => item !== e.target.value
        );
        GLOBAL__FILTER.filter.gender = filteredGender;
      }
      buildQuery();
    });
  });

  document.querySelector('.clear').addEventListener('click', () => {
    window.location.reload();
  });
})();
