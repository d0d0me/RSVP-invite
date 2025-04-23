module.exports = async function handler(req, res) {
  console.log('📩 API hit: /api/send-email')

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { name, email } = req.body

  const API_KEY = process.env.MAILERSEND_API_KEY
  const TEMPLATE_ID = process.env.MAILERSEND_TEMPLATE_ID
  const FROM_EMAIL = process.env.MAILERSEND_FROM_EMAIL

  if (!API_KEY || !TEMPLATE_ID || !FROM_EMAIL) {
    console.error('🚫 Missing MailerSend environment variables')
    return res.status(500).json({ message: 'Server config error' })
  }

  const response = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: {
        email: FROM_EMAIL,
        name: "L’Impatience"
      },
      to: [{ email }],
      subject: "You're confirmed for the Mutual Core launch!",
      template_id: TEMPLATE_ID,
      variables: [
        {
          email,
          substitutions: [
            { var: 'name', value: name }
          ]
        }
      ]
    })
  })

  const data = await response.json()

  if (response.ok) {
    console.log('✅ Email sent to:', email)
    return res.status(200).json({ success: true })
  } else {
    console.error('❌ MailerSend error:', data)
    return res.status(500).json({ success: false, error: data })
  }
}
