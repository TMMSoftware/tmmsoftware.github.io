// When the success message animation ends, reset the form.
document.querySelectorAll('.success-message').forEach(successMessage => {
  successMessage.addEventListener('animationend', function() {
    // Find the closest form element and reset it.
    const form = successMessage.closest('form');
    form.reset();
  });
});

