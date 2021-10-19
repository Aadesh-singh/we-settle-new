function loader(msg) {
  const alert = document.querySelector('.custom-loader');
  if (alert) {
    alert.style.display = 'none';
    return;
  }
  var el = document.createElement('div');
  el.classList.add('custom-loader');
  el.setAttribute(
    'style',
    `color:black;height:100%;width:100%;position:fixed;top:0%;left:0%;background-color:white;z-index:10000000;font-family:inherit;display:flex;align-items:center;justify-content:center;flex-direction:column;`
  );
  const gif = document.createElement('img');
  gif.setAttribute('src', '/public/assets/loader.gif');
  const p = document.createElement('p');
  p.innerText = `${msg || 'LOADING...'}`;
  el.appendChild(gif);
  el.appendChild(p);

  document.body.appendChild(el);
}
