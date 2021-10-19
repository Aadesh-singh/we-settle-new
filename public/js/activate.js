(() => {
  const success = document.querySelector('.success');
  const failure = document.querySelector('.failure');

  const timeout = (time, location) => {
    setTimeout(() => {
      window.location.href = location;
    }, time);
  };

  const activate = async () => {
    loader('Activating email');
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) window.location.href = '/register';
    try {
      const res = await fetch(`/api/v1/auth/activate/${token}`);
      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }

      success.classList.toggle('none');
      timeout(3000, '/');
    } catch (error) {
      console.log(error);
      failure.innerHTML = `Token Expired <a href="/register" style="color: blue; text-decoration: underline">Please register again</a>`;
      failure.classList.toggle('none');
      timeout(3000, '/register');
    }
    loader();
  };

  activate();
})();
