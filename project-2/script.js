// ===== Basic Form Validation =====

// Login Form Validation
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!this.checkValidity()) {
    this.classList.add('was-validated');
    return;
  }
  alert('Login successful! Welcome back.');
  this.reset();
  this.classList.remove('was-validated');
  bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
});

// Signup Form Validation
document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const confirmInput = document.getElementById('signupConfirmPassword');

  // Check if passwords match
  if (password !== confirmPassword) {
    confirmInput.setCustomValidity('Passwords do not match');
  } else {
    confirmInput.setCustomValidity('');
  }

  if (!this.checkValidity()) {
    this.classList.add('was-validated');
    return;
  }

  alert('Account created successfully! You can now sign in.');
  this.reset();
  this.classList.remove('was-validated');
  bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
});

// Reset confirm password validity on input
document.getElementById('signupConfirmPassword').addEventListener('input', function () {
  const password = document.getElementById('signupPassword').value;
  if (this.value !== password) {
    this.setCustomValidity('Passwords do not match');
  } else {
    this.setCustomValidity('');
  }
});

// Booking Modal - Set movie name when opened
document.getElementById('bookingModal').addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget;
  const movieName = button.getAttribute('data-movie');
  document.getElementById('movieName').value = movieName;
});

// Booking Form Validation
document.getElementById('bookingForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Validate date is not in the past
  const dateInput = document.getElementById('bookingDate');
  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    dateInput.setCustomValidity('Please select a future date');
  } else {
    dateInput.setCustomValidity('');
  }

  if (!this.checkValidity()) {
    this.classList.add('was-validated');
    return;
  }

  // Show success message
  this.classList.add('d-none');
  document.getElementById('bookingSuccess').classList.remove('d-none');

  // Reset after 3 seconds
  setTimeout(() => {
    this.reset();
    this.classList.remove('was-validated', 'd-none');
    document.getElementById('bookingSuccess').classList.add('d-none');
    bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
  }, 3000);
});

// Reset date validity on change
document.getElementById('bookingDate').addEventListener('change', function () {
  const selectedDate = new Date(this.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    this.setCustomValidity('Please select a future date');
  } else {
    this.setCustomValidity('');
  }
});
