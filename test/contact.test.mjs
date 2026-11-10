// Ejecutar: node test/contact.test.mjs  (no se despliega: está en .vercelignore)
import assert from 'node:assert/strict';
import { POST } from '../api/contact.mjs';

const sent = [];
globalThis.fetch = async (url, init) => { sent.push(JSON.parse(init.body)); return new Response('{}', { status: 200 }); };
process.env.RESEND_API_KEY = 'test';
process.env.CONTACT_FROM = 'Web <web@example.com>';

const post = (fields, files = []) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  for (const f of files) fd.append('archivos', f);
  return POST(new Request('https://x.test/api/contact', { method: 'POST', body: fd, headers: { Accept: 'application/json' } }));
};
const ok = { nombre: 'Ana', contacto: 'ana@obra.es', mensaje: 'Hola' };

assert.equal((await post({ nombre: 'Ana' })).status, 400, 'faltan campos');
assert.equal((await post(ok, [new File(['x'], 'virus.exe')])).status, 400, 'extensión no admitida');
assert.equal((await post(ok, [new File([new Uint8Array(5 * 1024 * 1024)], 'grande.pdf')])).status, 413, 'demasiado grande');
assert.equal((await post({ ...ok, web: 'spam' })).status, 200, 'honeypot finge éxito');
assert.equal(sent.length, 0, 'nada enviado todavía');

const res = await post(ok, [new File(['%PDF'], 'plano.pdf')]);
assert.equal(res.status, 200);
assert.equal(sent.length, 1);
assert.equal(sent[0].reply_to, 'ana@obra.es');
assert.equal(sent[0].to, 'm.bogado@tecaustral.com');
assert.equal(sent[0].attachments[0].filename, 'plano.pdf');

assert.equal((await post({ ...ok, contacto: '+34 600 000 000' })).status, 200);
assert.equal(sent[1].reply_to, undefined, 'sin reply_to si es teléfono');

console.log('contact: ok');
