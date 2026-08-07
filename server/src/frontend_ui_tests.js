import fetch from 'node-fetch';

const CLIENT = 'http://localhost:5173';
const API = 'http://localhost:5000';

async function waitFor(url, ms = 5000, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      return res;
    } catch (e) {
      await new Promise(r => setTimeout(r, ms));
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function checkPage(path = '/') {
  const url = CLIENT + path;
  const res = await waitFor(url, 500, 20);
  const text = await res.text();
  return { status: res.status, length: text.length, snippet: text.slice(0, 200) };
}

async function register(email, password, name = 'UI Test') {
  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role: 'CUSTOMER' })
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  return { status: res.status, data };
}

(async () => {
  console.log('Waiting for client dev server...');
  try {
    const home = await checkPage('/');
    console.log('Home page:', home);

    console.log('Checking /login page (SPA route)');
    const loginPage = await checkPage('/login');
    console.log('/login:', loginPage);

    console.log('Checking /register page (SPA route)');
    const regPage = await checkPage('/register');
    console.log('/register:', regPage);

    console.log('Checking /dashboard (protected SPA route)');
    const dash = await checkPage('/dashboard');
    console.log('/dashboard:', dash);

    // Try registering a temp user
    const ts = Date.now();
    const testEmail = `uitest+${ts}@fixnear.local`;
    console.log('Attempting register for', testEmail);
    const reg = await register(testEmail, 'UiTest@123');
    console.log('Register response:', JSON.stringify(reg, null, 2));

    // Login as the newly registered user (or existing if already created by seed)
    console.log('Attempting login for', testEmail);
    const lg = await login(testEmail, 'UiTest@123');
    console.log('Login response:', JSON.stringify(lg, null, 2));

    const token = lg.data?.data?.token;
    if (token) {
      console.log('Calling /api/auth/me with token');
      const meRes = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      console.log('/api/auth/me status', meRes.status, 'body:', JSON.stringify(await meRes.json(), null, 2));
    } else {
      console.log('No token from login; skipping /api/auth/me');
    }

    console.log('UI check script complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during UI checks:', err);
    process.exit(2);
  }
})();
