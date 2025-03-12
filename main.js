// Dark Mode toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load theme from localStorage
document.addEventListener('DOMContentLoaded', function () {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") document.body.classList.add("dark-mode");

  setupEmailValidation();
  setupFormSubmission();
});

// Hide suggestions (helper function)
function hideSuggestions(suggestionContainer) {
  suggestionContainer.innerHTML = "";
  suggestionContainer.style.display = "none";
}

// Setup email validation & suggestions
function setupEmailValidation() {
  const providers = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"];
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  document.querySelectorAll('.email-input').forEach(input => {
    const suggestionContainer = input.parentNode.querySelector('.email-suggestions-container');
    const label = input.closest('form').querySelector('.btn-waitlist');
    let selectedIndex = -1;

    // Input event listener
    input.addEventListener('input', function () {
      this.value = this.value.toLowerCase();
      selectedIndex = -1;

      if (this.value.length >= 12 && regex.test(this.value)) {
        this.setCustomValidity("");
        label.classList.add('valid');
        hideSuggestions(suggestionContainer);
        return;
      }

      this.setCustomValidity("Please enter a valid email address");
      label.classList.remove('valid');

      if (this.value.includes('@')) {
        const domainPart = this.value.split('@')[1] || "";
        const filtered = providers.filter(provider => provider.startsWith(domainPart));
        
        filtered.length > 0 && domainPart.length > 0
          ? (suggestionContainer.innerHTML = filtered.map(p => `<div class="suggestion-item">${p}</div>`).join(""),
             suggestionContainer.style.display = "block")
          : hideSuggestions(suggestionContainer);
      } else {
        hideSuggestions(suggestionContainer);
      }
    });

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      if (suggestionContainer.style.display !== 'block') return;
      const items = suggestionContainer.querySelectorAll('.suggestion-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = e.key === 'ArrowDown'
          ? (selectedIndex + 1) % items.length
          : (selectedIndex - 1 + items.length) % items.length;
        highlightSuggestion(items, selectedIndex);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        applySuggestion(input, suggestionContainer, items[selectedIndex].textContent);
      }
    });

    // Hide suggestions on blur
    input.addEventListener('blur', () => setTimeout(() => hideSuggestions(suggestionContainer), 150));

    // Click event for suggestions
    suggestionContainer.addEventListener('click', function (e) {
      if (e.target && e.target.matches('.suggestion-item')) {
        e.target.classList.add('highlight');
        setTimeout(() => {
          e.target.classList.remove('highlight');
          applySuggestion(input, suggestionContainer, e.target.textContent);
        }, 300);
      }
    });
  });
}

// Helper: Highlight selected suggestion
function highlightSuggestion(items, index) {
  items.forEach(item => item.classList.remove('highlight'));
  items[index].classList.add('highlight');
}

// Helper: Apply domain suggestion
function applySuggestion(input, container, domain) {
  input.value = input.value.split('@')[0] + "@" + domain;
  hideSuggestions(container);
  input.focus();
  input.dispatchEvent(new Event('input'));
}

// Setup form submission logic
function setupFormSubmission() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      processSubmission(form);
    });
  });

  // Make labels clickable
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function (e) {
      e.preventDefault();
      processSubmission(label.closest('form'));
    });
  });
}

// Form submission logic
function processSubmission(form) {
  const emailInput = form.querySelector('.email-input');
  const successCheckbox = form.querySelector('input[type="checkbox"]');
  const label = form.querySelector('.btn-waitlist');
  

  emailInput.value = emailInput.value.toLowerCase();

  if (emailInput.value.length < 12 || !regex.test(emailInput.value)) {
    emailInput.setCustomValidity("Enter a valid email (min 12 chars)");
    emailInput.reportValidity();
    return false;
  }

  label.classList.add('active');
  setTimeout(() => label.classList.remove('active'), 150);

  successCheckbox.checked = true;
  submitEmail(emailInput.value);
  return true;
}

// Submit email to API
async function submitEmail(email) {
  try {
    const response = await fetch('/api/requestEarlyAccess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    
    if (response.ok) {
      console.log(result.message);
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
