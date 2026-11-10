// Formulario de contacto → email vía Resend (https://resend.com/docs/api-reference/emails/send-email)
// Variables en Vercel: RESEND_API_KEY (obligatoria), CONTACT_FROM (remitente de un dominio verificado
// en Resend, p. ej. "Web TEC AUSTRAL <web@tecaustral.com>"), CONTACT_TO (por defecto m.bogado@tecaustral.com).

const MAX_FILES = 5;
const MAX_BYTES = 4 * 1024 * 1024; // el cuerpo de una función de Vercel no puede pasar de 4,5 MB
const ALLOWED_EXT = /\.(jpe?g|png|webp|heic|heif|gif|pdf|dwg|dxf)$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) => Response.json(body, { status });
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (body, status) =>
    wantsJson ? json(body, status) : Response.redirect(new URL(status ? '/?error=1#contacto' : '/?enviado=1#contacto', request.url), 303);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply({ error: 'Formulario no válido.' }, 400);
  }

  // Trampa anti-spam: si un bot rellena el campo oculto, fingimos éxito y no enviamos nada.
  if (clean(form.get('web'), 200)) return reply({ ok: true });

  const nombre = clean(form.get('nombre'), 120);
  const contacto = clean(form.get('contacto'), 160);
  const mensaje = clean(form.get('mensaje'), 5000);
  if (!nombre || !contacto || !mensaje) return reply({ error: 'Faltan datos: nombre, contacto y mensaje.' }, 400);

  const files = form.getAll('archivos').filter(f => typeof f === 'object' && f.size > 0);
  if (files.length > MAX_FILES) return reply({ error: `Máximo ${MAX_FILES} archivos.` }, 400);
  if (files.reduce((n, f) => n + f.size, 0) > MAX_BYTES) return reply({ error: 'Los archivos superan 4 MB en total.' }, 413);
  if (files.some(f => !ALLOWED_EXT.test(f.name))) return reply({ error: 'Formato no admitido. Usa imágenes, PDF, DWG o DXF.' }, 400);

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM) {
    console.error('contact: faltan RESEND_API_KEY o CONTACT_FROM');
    return reply({ error: 'El formulario no está disponible ahora mismo.' }, 500);
  }

  const attachments = await Promise.all(files.map(async f => ({
    filename: f.name.replace(/[^\w.\- ]/g, '_'),
    content: Buffer.from(await f.arrayBuffer()).toString('base64'),
  })));

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO || 'm.bogado@tecaustral.com',
      ...(EMAIL_RE.test(contacto) && { reply_to: contacto }),
      subject: `Web: ${nombre.replace(/[\r\n]+/g, ' ')}`,
      text: `Nombre: ${nombre}\nContacto: ${contacto}\n\n${mensaje}\n\nAdjuntos: ${attachments.length}`,
      attachments,
    }),
  });

  if (!res.ok) {
    console.error('contact: Resend respondió', res.status, await res.text());
    return reply({ error: 'No se pudo enviar el mensaje.' }, 502);
  }
  return reply({ ok: true });
}
