(() => {
  const registerForm = document.querySelector('.auth-form');
  const emailLink = document.querySelector('.emailLink');
  const button = document.querySelector('.auth-button');
  // const cityContainer = document.querySelector('.city');

  // const showCity = (cities) => {
  //   if (!cities || !cities?.length) return;

  //   cities.forEach((city) => {
  //     const option = document.createElement('option');
  //     option.style = 'text-transform:capitalize;';
  //     option.value = city?._id;
  //     option.text = city?.cityName;
  //     cityContainer.appendChild(option);
  //   });
  // };

  // const fetchCity = async () => {
  //   try {
  //     const res = await fetch('/api/v1/city');

  //     const data = await res.json();
  //     if (data.status === 'fail' || data.status === 'error') {
  //       throw new Error(data?.message);
  //     }
  //     console.log(data);
  //     showCity(data?.cities);
  //   } catch (error) {}
  // };

  // fetchCity();

  function validate(phone) {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(phone);
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;
    button.textContent = 'SENDING MAIL...';
    try {
      const element = registerForm.elements;
      const username = element['username'].value;
      const email = element['email'].value;
      const password = element['password'].value;
      const phoneNo = element['phoneNo'].value;
      const city = element['city'].value;
      const gender = element['gender'].value;
      const college = element['college'].value;
      if (!username || !email || !password || !phoneNo) {
        return tempAlert('Please fill all fields', 3000, true);
      }
      if (!validate(parseInt(phoneNo))) {
        return tempAlert('Invalid Phone No', 3000, true);
      }

      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          phoneNo: parseInt(phoneNo),
          ...(city && { city }),
          ...(gender && { gender }),
          ...(college && { college }),
        }),
      });

      const data = await res.json();
      if (data.status === 'fail' || data.status === 'error') {
        throw new Error(data?.message);
      }
      tempAlert('Activation link is sent to email.Please verify', 5000, false);
      emailLink.classList.remove('none');
    } catch (error) {
      console.log(error);
      tempAlert(error?.message || 'Something went wrong', 3000, true);
      emailLink.classList.add('none');
    }
    button.disabled = false;
    button.textContent = 'REGISTER';
  });
})();
