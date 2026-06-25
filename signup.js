document.addEventListener('DOMContentLoaded', function () {
  try {
    if (localStorage.getItem('vmfa_user')) {
      window.location.href = 'index.html';
      return;
    }
  } catch (e) {}

  var form    = document.getElementById('signupForm');
  var errorEl = document.getElementById('signupError');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.textContent = '';

    var first    = document.getElementById('signupFirst').value.trim();
    var last     = document.getElementById('signupLast').value.trim();
    var email    = document.getElementById('signupEmail').value.trim();
    var password = document.getElementById('signupPassword').value;

    if (!first)    { errorEl.textContent = 'Please enter your first name.'; return; }
    if (!last)     { errorEl.textContent = 'Please enter your last name.'; return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.'; return;
    }
    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.'; return;
    }

    var capitalize = function(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); };
    var displayName = capitalize(first) + ' ' + capitalize(last);

    var user = { name: displayName, email: email };
    try { localStorage.setItem('vmfa_user', JSON.stringify(user)); } catch (err) {}

    window.location.href = 'index.html';
  });
});
