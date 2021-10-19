(() => {
  const registerForm = document.querySelector('.auth-form');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const element = registerForm.elements;
      const email = element['email'].value;
      const password = element['password'].value;

      if (!email || !password) {
        return tempAlert('Please fill all fields', 3000, true);
      }

      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      window.location.href = '/';
    } catch (error) {
      console.log(error);
      tempAlert(error?.message || 'Something went wrong', 3000, true);
    }
  });
})();
