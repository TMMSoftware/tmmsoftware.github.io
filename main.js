// Dark Mode toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// Reset the form when the success message animation ends
document.querySelectorAll('.success-message').forEach(successMessage => {
  successMessage.addEventListener('animationend', function() {
    const form = successMessage.closest('form');
    form.reset();
  });
});

// Run when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Dynamic datalist attachment for email inputs
  const emailInputs = document.querySelectorAll('.email-input');
  emailInputs.forEach(input => {
    input.addEventListener('input', function () {
      // Attach the datalist if the input value contains an "@"
      if (this.value.includes('@')) {
        this.setAttribute('list', 'domain-suggestions');
      } else {
        this.removeAttribute('list');
      }
    });
  });

  // Validate email only when the "Request Early Access" label is clicked
  const waitlistLabels = document.querySelectorAll('.btn-waitlist');
  waitlistLabels.forEach(label => {
    label.addEventListener('click', function(e) {
      const form = label.closest('form');
      const emailInput = form.querySelector('.email-input');
      // If the email is invalid, prevent further action and show validation message.
      if (!emailInput.checkValidity()) {
        e.preventDefault();
        emailInput.reportValidity();
      }
    });
  });
});
