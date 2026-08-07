import fetch from 'node-fetch';

const BASE = 'http://localhost:5000';

async function login(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function me(token) {
  const res = await fetch(`${BASE}/api/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function callProtected(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  const data = await res.json();
  return { status: res.status, data };
}

(async () => {
  console.log('\n== LOGIN: customer');
  const cust = await login('customer@fixnear.local', 'Customer@123');
  console.log(JSON.stringify(cust, null, 2));

  console.log('\n== LOGIN: provider');
  const prov = await login('provider@fixnear.local', 'Provider@123');
  console.log(JSON.stringify(prov, null, 2));

  console.log('\n== LOGIN: admin');
  const adm = await login('admin@fixnear.local', 'Admin@123');
  console.log(JSON.stringify(adm, null, 2));

  console.log('\n== INVALID LOGIN');
  const bad = await login('noone@fixnear.local', 'wrong');
  console.log(JSON.stringify(bad, null, 2));

  const custToken = cust.data?.data?.token;
  const provToken = prov.data?.data?.token;
  const admToken = adm.data?.data?.token;

  console.log('\n== /api/auth/me with valid customer token');
  console.log(JSON.stringify(await me(custToken), null, 2));

  console.log('\n== /api/auth/me with no token');
  try { console.log(JSON.stringify(await me(null), null, 2)); } catch(e){ console.error(e.toString()); }

  console.log('\n== /api/auth/me with invalid token');
  console.log(JSON.stringify(await me('invalid.token.here'), null, 2));

  console.log('\n== Protected /api/test/protected without token');
  console.log(JSON.stringify(await callProtected('/api/test/protected', null), null, 2));

  console.log('\n== Protected /api/test/protected with customer token');
  console.log(JSON.stringify(await callProtected('/api/test/protected', custToken), null, 2));

  console.log('\n== Provider-only /api/test/provider with provider token');
  console.log(JSON.stringify(await callProtected('/api/test/provider', provToken), null, 2));

  console.log('\n== Provider-only /api/test/provider with customer token (should fail)');
  console.log(JSON.stringify(await callProtected('/api/test/provider', custToken), null, 2));

  console.log('\n== Admin-only /api/test/admin with admin token');
  console.log(JSON.stringify(await callProtected('/api/test/admin', admToken), null, 2));

  console.log('\n== Admin-only /api/test/admin with provider token (should fail)');
  console.log(JSON.stringify(await callProtected('/api/test/admin', provToken), null, 2));

  process.exit(0);
})();
