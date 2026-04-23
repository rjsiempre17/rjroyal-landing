export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  try {
    const body = req.body;
    
    // Buscar el mensaje en el payload de Kommo
    const message = body?.message?.text || 
                    body?.text || 
                    body?.messages?.[0]?.text || '';

    // Extraer código entre 🎁
    const match = message.match(/🎁\s*([A-Z0-9]{6})\s*🎁/);
    
    if (!match) {
      return res.status(200).json({ ok: true, msg: 'Sin código' });
    }

    const code = match[1];

    // Actualizar Supabase
    const supabaseRes = await fetch(
      `https://wqiqurogioclchswjpox.supabase.co/rest/v1/leads?code=eq.${code}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXF1cm9naW9jbGNoc3dqcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjAyMjIsImV4cCI6MjA5MjM5NjIyMn0.tY9Ykjm6bsQrmENk4OLEtKwt6TjojiwnKjUz-yM0aog',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXF1cm9naW9jbGNoc3dqcG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjAyMjIsImV4cCI6MjA5MjM5NjIyMn0.tY9Ykjm6bsQrmENk4OLEtKwt6TjojiwnKjUz-yM0aog',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ contacted: true })
      }
    );

    console.log('Supabase update status:', supabaseRes.status, 'code:', code);
    return res.status(200).json({ ok: true, code });

  } catch (e) {
    console.error('Webhook error:', e);
    return res.status(200).json({ ok: true });
  }
}
