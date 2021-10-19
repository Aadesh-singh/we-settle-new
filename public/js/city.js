const cityContainer = document.querySelector('.city');

const showCity = (cities) => {
  if (!cities || !cities?.length) return;

  cities.forEach((city) => {
    const option = document.createElement('option');
    option.style = 'text-transform:capitalize;';
    option.value = city?._id;
    option.text = city?.cityName;
    cityContainer.appendChild(option);
  });
};

const fetchCity = async () => {
  try {
    const res = await fetch('/api/v1/city');

    const data = await res.json();
    if (data.status === 'fail' || data.status === 'error') {
      throw new Error(data?.message);
    }
    console.log(data);
    showCity(data?.cities);
  } catch (error) {}
};

fetchCity();
