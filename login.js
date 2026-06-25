document.addEventListener('DOMContentLoaded', function () {
  // Already logged in — go straight to the main site
  try {
    if (localStorage.getItem('vmfa_user')) {
      window.location.href = 'index.html';
      return;
    }
  } catch (e) {}

  var form = document.getElementById('loginForm');
  var errorEl = document.getElementById('loginError');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.textContent = '';

    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      return;
    }
    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.';
      return;
    }

    // Derive a display name from the email local-part
    var localPart = email.split('@')[0].replace(/[._+\-]/g, ' ');
    var displayName = localPart
      .split(' ')
      .filter(Boolean)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); })
      .join(' ') || 'VMFA Member';

    var user = { name: displayName, email: email };
    try { localStorage.setItem('vmfa_user', JSON.stringify(user)); } catch (e) {}

    window.location.href = 'index.html';
  });
});
