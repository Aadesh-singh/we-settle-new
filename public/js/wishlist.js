(() => {
  const body = document.querySelector('tbody');
  const table = document.querySelector('table');
  const no = document.querySelector('.no');

  const showWishlists = (wishlists) => {
    if (!wishlists || !wishlists.length) {
      table.innerHTML = '';
      no.textContent = 'No Wishlist added';
      return;
    }

    wishlists.forEach((wishlist, index) => {
      const tr = document.createElement('tr');
      const sno = document.createElement('td');
      sno.textContent = index + 1;
      const name = document.createElement('td');
      name.textContent =
        `${
          (wishlist?.residenceId?.name || '') +
          ' / ' +
          wishlist?.residenceId?.code
        }` || 'No data';
      const city = document.createElement('td');
      city.textContent = wishlist?.residenceId?.city?.cityName || 'No data';
      const area = document.createElement('td');
      area.textContent = wishlist?.residenceId?.area?.name || 'No data';
      const link = document.createElement('td');
      link.innerHTML = `<a href="/property-detail/${
        wishlist?.residenceId?.city?.cityName || 'in'
      }/${wishlist?.residenceId?.area?.name || 'in'}?code=${
        wishlist?.residenceId?.code
      }" style="color:blue;">View Details</a>`;
      tr.appendChild(sno);
      tr.appendChild(name);
      tr.appendChild(city);
      tr.appendChild(area);
      tr.appendChild(link);
      body.appendChild(tr);
    });
  };

  const fetchWishlist = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('pragma', 'no-cache');
      myHeaders.append('cache-control', 'no-cache');
      const res = await fetch(`/api/v1/wishlist/user/all`, {
        method: 'GET',
        headers: myHeaders,
      });
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      showWishlists(data?.wishlist);
    } catch (error) {
      console.log(error);
    }
  };

  fetchWishlist();
})();
