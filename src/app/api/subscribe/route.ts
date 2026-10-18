import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const { firstName, email } = await req.json()
    if (!firstName?.trim() || !emailRegex.test(email?.trim() ?? '')) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }
    await pool.query(
      `INSERT INTO leads (first_name, email, topic)
       VALUES ($1, $2, $3)
       ON CONFLICT (email, topic) DO NOTHING`,
      [firstName.trim(), email.trim().toLowerCase(), 'genji']
    )
    return Response.json({ ok: true })
  } catch (error) {
    console.error('Error saving lead:', error)
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
