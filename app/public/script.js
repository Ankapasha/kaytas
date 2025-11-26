(() => {
  const openLoginBtn = document.getElementById('openLoginBtn');
  const authModal = document.getElementById('authModal');
  const showLogin = document.getElementById('showLogin');
  const showRegister = document.getElementById('showRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const closeModal = document.getElementById('closeModal');
  const closeModal2 = document.getElementById('closeModal2');

  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginSubmit = document.getElementById('loginSubmit');
  const loginMsg = document.getElementById('loginMsg');

  const regEmail = document.getElementById('regEmail');
  const regPassword = document.getElementById('regPassword');
  const registerSubmit = document.getElementById('registerSubmit');
  const registerMsg = document.getElementById('registerMsg');

  function openModal() {
    authModal.style.display = 'flex';
    authModal.setAttribute('aria-hidden', 'false');
  }

  function closeModalAll() {
    authModal.style.display = 'none';
    authModal.setAttribute('aria-hidden', 'true');
  }

  function updateLoginButton() {
    const token = localStorage.getItem('token');
    if (token) {
      openLoginBtn.textContent = 'Min sida';
      openLoginBtn.onclick = () => window.location.href = '/dashboard.html';
    } else {
      openLoginBtn.textContent = 'Logga in';
      openLoginBtn.onclick = openModal;
    }
  }

  updateLoginButton();

  openLoginBtn.addEventListener('click', openModal);
  closeModal.addEventListener('click', closeModalAll);
  closeModal2.addEventListener('click', closeModalAll);

  showLogin.addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  });

  showRegister.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  });

  const API_BASE = '/api';

  // Registrering
  registerSubmit.addEventListener('click', async () => {
    registerMsg.textContent = '';

    const email = regEmail.value.trim();
    const password = regPassword.value;

    if (!email || !password) {
      registerMsg.textContent = 'Fyll i alla fält.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        registerMsg.textContent = data.error || 'Fel vid registrering';
        return;
      }

      registerMsg.textContent = 'Registrering lyckades. Du är inloggad.';

      if (data.token) {
        localStorage.setItem('token', data.token);
        updateLoginButton();
      }

      setTimeout(() => {
        closeModalAll();
        window.location.href = '/dashboard.html';
      }, 900);

    } catch (err) {
      registerMsg.textContent = 'Nätverksfel vid registrering';
    }
  });

  // Login
  loginSubmit.addEventListener('click', async () => {
    loginMsg.textContent = '';

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      loginMsg.textContent = 'Fyll i e-post och lösenord.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        loginMsg.textContent = data.error || 'Fel vid inloggning';
        return;
      }

      loginMsg.textContent = 'Inloggning lyckades.';

      if (data.token) {
        localStorage.setItem('token', data.token);
        updateLoginButton();
      }

      setTimeout(() => {
        closeModalAll();
        window.location.href = '/dashboard.html';
      }, 700);

    } catch (err) {
      loginMsg.textContent = 'Nätverksfel vid inloggning';
    }
  });

  // Ladda annonser
  async function loadListings() {
    const el = document.getElementById('listings');
    el.innerHTML = '<div class="card">Laddar annonser...</div>';

    try {
      const res = await fetch(`${API_BASE}/listings`);

      if (!res.ok) {
        el.innerHTML = '<div class="card">Kunde inte hämta annonser</div>';
        return;
      }

      const list = await res.json();

      if (!Array.isArray(list) || list.length === 0) {
        el.innerHTML = '<div class="card">Inga annonser hittades.</div>';
        return;
      }

      el.innerHTML = list.map(l => `
        <div class="card">
          <h4>${escapeHtml(l.title || 'Ingen rubrik')}</h4>
          <div class="small">${escapeHtml(l.description || '')}</div>
          <div>Adress: ${escapeHtml(l.address || 'Ej angiven')}</div>
          <div style="margin-top:10px">Pris: ${escapeHtml(String(l.price || ''))}</div>
        </div>
      `).join('');

    } catch (err) {
      el.innerHTML = '<div class="card">Fel vid kontakt med server</div>';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  }

  loadListings();
})();