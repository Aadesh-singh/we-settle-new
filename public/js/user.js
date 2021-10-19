(() => {
  const username = document.querySelector('.username');
  const auth = document.querySelectorAll('.auth');
  const logout = document.querySelector('.logout');
  const authenticated = document.querySelectorAll('.authenticated');
  const wishlist = document.querySelector('.wishlist');

  const fetchUser = async () => {
    const myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');
    const res = await fetch(`/api/v1/auth/me`, {
      method: 'GET',
      headers: myHeaders,
    });
    const data = await res.json();
    if (data.status === 'fail' || data.status === 'error') {
      throw new Error(data?.message);
    }
    console.log(data);
    if (data?.user) {
      username.textContent = data?.user?.name || '';
      auth.forEach((item) => (item.style.display = 'none'));
      // logout.style.display = 'block';
      authenticated.forEach((item) => (item.style.display = 'block'));
      if (wishlist) wishlist.style.display = 'inline-block';
    }
  };

  fetchUser();

  logout.addEventListener('click', async () => {
    try {
      const res = await fetch(`/api/v1/auth/logout`);
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      console.log(data);
      window.location.href = '/login';
    } catch (error) {}
  });
})();
