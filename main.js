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
  // Attach a click listener to each "Request Early Access" label.
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function(e) {
      // Stop the label from automatically toggling the checkbox.
      e.preventDefault();

      const form = label.closest('form');
      const emailInput = form.querySelector('.email-input');
      const successCheckbox = form.querySelector('input[type="checkbox"]');

      // Check validity of the email field
      if (!emailInput.checkValidity()) {
        // Show the built-in browser error
        emailInput.reportValidity();
      } else {
        // Valid: manually check the box to trigger the success animation
        successCheckbox.checked = true;
      }
    });
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
