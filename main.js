// Dark Mode toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// Event listener to reset form when the success message animation ends
document.querySelectorAll('.success-message').forEach(successMessage => {
  successMessage.addEventListener('animationend', function() {
    // Find the closest form element and reset it.
    const form = successMessage.closest('form');
    form.reset();
  });
});


// Event listener to manually check the inputs validity with Constraint Validation API
document.querySelectorAll('.email-input').forEach(input => {
  input.addEventListener('blur', function() {
    if (!this.checkValidity()) {
      // Show custom error message or use reportValidity() to let the browser show its message.
      this.reportValidity();
    }
  });
});


// Add or remove the list attribute based on whether the input contains an "@"
document.addEventListener('DOMContentLoaded', function () {
  const emailInputs = document.querySelectorAll('.email-input');
  emailInputs.forEach(input => {
    input.addEventListener('input', function () {
      // Only attach the datalist if the input value contains an "@"
      if (this.value.includes('@')) {
        this.setAttribute('list', 'domain-suggestions');
      } else {
        this.removeAttribute('list');
      }
    });
  });
});
