const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key present:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message, plus_one } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    console.log('📩 Submitting RSVP:', { name, email, plus_one });

    const { error } = await supabase
      .from('rsvps')
      .insert([{ name, email, message, plus_one }]);

    if (error) {
      console.error('❌ Supabase insert error:', error.message);
      return res.status(500).json({ success: false
