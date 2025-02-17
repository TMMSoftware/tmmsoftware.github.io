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
      // Attach the datalist if the input value contains "@"
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
      // Always prevent the label's default toggle action.
      e.preventDefault();

      const form = label.closest('form');
      const emailInput = form.querySelector('.email-input');
      const successCheckbox = form.querySelector('[type="checkbox"]');

      // Check if the email is valid.
      if (!emailInput.checkValidity()) {
        // Show the native browser validation error
        emailInput.reportValidity();
      } else {
        // If valid, manually toggle the checkbox
        successCheckbox.checked = true;
      }
    });
  });
});
