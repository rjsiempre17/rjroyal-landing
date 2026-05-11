export default async function handler(req, res) {
  console.log('BODY:', JSON.stringify(req.body));
  return res.status(200).json({ ok: true });
}
