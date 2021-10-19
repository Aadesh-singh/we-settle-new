const passwordIcon = document.querySelector('.passwordIcon');

function togglePassword() {
  const input = passwordIcon?.previousElementSibling;
  console.log(input);
  if (!input) return;
  if (input.type === 'password') {
    passwordIcon.classList.remove('fa-eye-slash');
    passwordIcon.classList.add('fa-eye');
    input.type = 'text';
  } else {
    passwordIcon.classList.remove('fa-eye');
    passwordIcon.classList.add('fa-eye-slash');
    input.type = 'password';
  }
}

passwordIcon.addEventListener('click', togglePassword);
