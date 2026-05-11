export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  try {
    const body = req.body;
    const text = body['message[add][0][text]'] || '';

    const match = text.match(/([A-Z0-9]{6})/);

    if (!match) {
      return res.status(200).json({ ok: true, msg: 'Sin código' });
    }

    const code = match[1];

    // Actualizar Supabase
    const capiRes = await fetch(
      `https://ghwdppswzzlrtacrszbq.supabase.co/rest/v1/leads?code=eq.${code}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdod2RwcHN3enpscnRhY3JzemJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDk1NjUsImV4cCI6MjA5NDAyNTU2NX0.UXK33HLozGKZwvqWcWkDkzd_hnwpUKPZe5lmhhmREDs',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdod2RwcHN3enpscnRhY3JzemJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDk1NjUsImV4cCI6MjA5NDAyNTU2NX0.UXK33HLozGKZwvqWcWkDkzd_hnwpUKPZe5lmhhmREDs',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ contacted: true })
      }
    );

    // Enviar evento a Meta CAPI
    const eventTime = Math.floor(Date.now() / 1000);
    await fetch(
      `https://graph.facebook.com/v19.0/963255786627033/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: 'Purchase',
              event_time: eventTime,
              action_source: 'other',
              event_id: code,
              custom_data: {
                currency: 'ARS',
                value: 1
              }
            }
          ],
          access_token: 'EAAQYJyiJZCEEBRfUQyklqHTrintXkVUX5k0s4zCbvasuyJLCTIn3ylico0IW5zlbazboFUUMkZAoEBmQYhNJ30eOxxCcon6xZBtKZCH94vedSYmZAZBH4PhrmaWHKDjEOdrv993GY8RblZAonE6aXy6nQ3Xd7DdAa04eCUmhNl0e8qetGY8ZCLECYEpP4ams0aOSVAZDZD'
        })
      }
    );

    const capiData = await capiRes.json();
console.log('CAPI response:', JSON.stringify(capiData));
console.log('Supabase + CAPI OK, code:', code);
    return res.status(200).json({ ok: true, code });

  } catch (e) {
    console.error('Error:', e);
    return res.status(200).json({ ok: true });
  }
}
