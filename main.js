// Dark Mode toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

document.addEventListener('DOMContentLoaded', function () {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});

// Reset the form when the success message animation ends
document.querySelectorAll('.success-message').forEach(successMessage => {
  successMessage.addEventListener('animationend', function() {
    const form = successMessage.closest('form');
    form.reset();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Predefined list of common email providers
  const providers = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"];
  
  // Define the regex pattern
  const regexPattern = '^[a-z0-9._%+\\-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
  const regex = new RegExp(regexPattern);
  
  // For each email input, set up domain suggestions and real-time validation
  document.querySelectorAll('.email-input').forEach(input => {
    const suggestionContainer = input.parentNode.querySelector('.email-suggestions-container');
    const label = input.closest('form').querySelector('.btn-waitlist');
    
    // Track which suggestion is highlighted by keyboard
    let selectedIndex = -1;

    // Real-time validation & suggestions
    input.addEventListener('input', function() {
      // Convert input to lowercase
      this.value = this.value.toLowerCase();
      
      // Reset the highlighted suggestion whenever suggestions update
      selectedIndex = -1;

      // 12-char + regex check
      if (this.value.length >= 12 && regex.test(this.value)) {
        this.setCustomValidity("");
        label.classList.add('valid');
        suggestionContainer.innerHTML = "";
        suggestionContainer.style.display = "none";
        return;
      } else {
        this.setCustomValidity("Please enter a valid email address (e.g., user@example.com)");
        label.classList.remove('valid');
      }
      
      // Domain suggestions logic for incomplete/invalid emails
      if (this.value.includes('@')) {
        const parts = this.value.split('@');
        const domainPart = parts[1] || "";
        const filtered = providers.filter(provider => provider.startsWith(domainPart));
        
        if (filtered.length > 0 && domainPart.length > 0) {
          suggestionContainer.innerHTML = filtered
            .map(provider => `<div class="suggestion-item">${provider}</div>`)
            .join("");
          suggestionContainer.style.display = "block";
        } else {
          suggestionContainer.innerHTML = "";
          suggestionContainer.style.display = "none";
        }
      } else {
        suggestionContainer.innerHTML = "";
        suggestionContainer.style.display = "none";
      }
    });
    
    // Keyboard navigation for suggestions
    input.addEventListener('keydown', function(e) {
      if (suggestionContainer.style.display === 'block') {
        const items = suggestionContainer.querySelectorAll('.suggestion-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % items.length;
          highlightSuggestion(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + items.length) % items.length;
          highlightSuggestion(items, selectedIndex);
        } else if (e.key === 'Enter') {
          if (selectedIndex >= 0) {
            e.preventDefault();
            const selectedDomain = items[selectedIndex].textContent;
            applySuggestion(input, suggestionContainer, selectedDomain);
          }
        }
      }
    });
    
    // Hide suggestions on blur
    input.addEventListener('blur', function() {
      setTimeout(() => {
        suggestionContainer.style.display = "none";
      }, 150);
    });
    
    // Click event on suggestion container: allow user to pick a suggestion with an animation
    suggestionContainer.addEventListener('click', function(e) {
      if (e.target && e.target.matches('.suggestion-item')) {
        // Add highlight animation on click
        e.target.classList.add('highlight');
        setTimeout(() => {
          e.target.classList.remove('highlight');
          const selectedDomain = e.target.textContent;
          applySuggestion(input, suggestionContainer, selectedDomain);
        }, 300); // Adjust the delay to match your animation timing
      }
    });
  });
  
  // Prevent default form submission & process via custom logic
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      processSubmission(form);
    });
  });
  
  // Submission logic (final check)
  function processSubmission(form) {
    const emailInput = form.querySelector('.email-input');
    const successCheckbox = form.querySelector('input[type="checkbox"]');
    const label = form.querySelector('.btn-waitlist');
    
    emailInput.value = emailInput.value.toLowerCase();

    if (emailInput.value.length < 12) {
      emailInput.setCustomValidity("Email must be at least 12 characters long");
      emailInput.reportValidity();
      return false;
    }
    
    if (!regex.test(emailInput.value)) {
      emailInput.reportValidity();
      return false;
    }
    
    label.classList.add('active');
    setTimeout(() => {
      label.classList.remove('active');
    }, 150);
    
    successCheckbox.checked = true;
    return true;
  }
  
  // Make the label clickable
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function(e) {
      e.preventDefault();
      const form = label.closest('form');
      processSubmission(form);
    });
  });
  
  // Helper: highlight suggestion (for keyboard navigation)
  function highlightSuggestion(items, index) {
    items.forEach(item => item.classList.remove('highlight'));
    items[index].classList.add('highlight');
  }
  
  // Helper: apply the chosen suggestion to the input
  function applySuggestion(input, container, domain) {
    const parts = input.value.split('@');
    input.value = parts[0] + "@" + domain;
    container.innerHTML = "";
    container.style.display = "none";
    input.focus();
    input.dispatchEvent(new Event('input'));
  }
});

async function submitEmail(email) {
  try {
    const response = await fetch('/api/requestEarlyAccess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (response.ok) {
      // Display success message
      console.log(result.message);
    } else {
      // Handle error (e.g., show error message to user)
      console.error(result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Bind above async function to waitlist button click event
document.querySelector('.btn-waitlist').addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.querySelector('.email-input').value;
  submitEmail(email);
});

