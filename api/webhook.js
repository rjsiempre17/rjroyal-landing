export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  try {
    const body = req.body;
    const text = body['message[add][0][text]'] || '';
    
    // Extraer código de 6 caracteres alfanuméricos
    const match = text.match(/([A-Z0-9]{6})/);
    
    if (!match) {
      return res.status(200).json({ ok: true, msg: 'Sin código' });
    }

    const code = match[1];

    const supabaseRes = await fetch(
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

    console.log('Supabase status:', supabaseRes.status, 'code:', code);
    return res.status(200).json({ ok: true, code });

  } catch (e) {
    console.error('Error:', e);
    return res.status(200).json({ ok: true });
  }
}
