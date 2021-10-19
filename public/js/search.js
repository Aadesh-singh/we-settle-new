(() => {
  const searchInput = document.querySelector('.search-input');
  const searchContainer = document.querySelector('.search-results');
  const searchResults = document.querySelector('.searchTemp');

  const createSearchResultsNode = (data) => {
    const clone = searchResults.content.cloneNode(true);
    clone
      .querySelector('a')
      .setAttribute(
        'href',
        `/property/${data?.city?.cityName || data?.cityName || 'in'}?city=${
          data?.city?._id || data?._id || 'in'
        }&placeId=${data?._id}`
      );
    clone.querySelector('h1').textContent = `${data?.name || ''}${
      data?.name ? '-' : ''
    }${data?.city?.cityName ? `${data?.city?.cityName}` : data?.cityName}`;
    clone.querySelector('.type').textContent = data?.placeType || 'city';

    searchContainer.appendChild(clone);
  };

  const showSearchResult = (data) => {
    if (!data || !data?.length) return (searchContainer.style.display = 'none');
    searchContainer.style.display = 'flex';
    searchContainer.innerHTML = '';
    data?.forEach((e) => createSearchResultsNode(e));
  };
  const search = async (args) => {
    console.log('fired', args);
    try {
      const res = await fetch('/api/v1/residence/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: args }),
      });

      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }

      showSearchResult(data?.results);
    } catch (error) {
      console.log(error);
    }
  };

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

  searchInput?.addEventListener(
    'keyup',
    debounce((e) => {
      if (!e.target.value) return (searchContainer.style.display = 'none');
      return search(e.target.value);
    }, 300)
  );

  const reqForm = document.querySelector('.request');
  function validate(phone) {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(phone);
  }
  reqForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      console.log('Submit');
      const element = reqForm.elements;
      const firstName = element['Fname'].value;
      const lastName = element['Lname'].value;
      const phoneNo = parseInt(element['phone'].value);
      const email = element['email'].value;
      const area = element['area'].value;
      const whatsappUpdate = element['whatsappUpdate'].checked;

      if (!firstName || !lastName || !phoneNo || !email || !area) {
        return tempAlert('Please fill all fields', 3000, true);
      }
      if (!validate(phoneNo)) {
        return tempAlert('Invalid Phone no', 3000, true);
      }
      console.log(whatsappUpdate);
      console.log(firstName, lastName, email, phoneNo, area, whatsappUpdate);
      const res = await fetch('/api/v1/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNo,
          area,
          whatsappUpdate,
          url: window.location.href,
        }),
      });

      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      tempAlert('Call back requested', 5000, false);
    } catch (error) {
      tempAlert(error?.message, 5000, true);
    }
  });
})();
