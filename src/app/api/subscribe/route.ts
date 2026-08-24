import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error('DATABASE_URL is not configured')
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 })
    }

    const sql = neon(databaseUrl)

    // Try to insert the email, handle duplicate case
    try {
      await sql`
        INSERT INTO subscribers (email)
        VALUES (${email.toLowerCase()})
      `
      return NextResponse.json({ message: 'Successfully subscribed' }, { status: 200 })
    } catch (error: any) {
      // Check if it's a unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Email already subscribed' }, { status: 200 })
      }
      throw error
    }
  } catch (error) {
    console.error('Error saving email:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
