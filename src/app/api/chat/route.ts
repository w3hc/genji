import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 })
    }

    const response = 'Bonjour !'

    return NextResponse.json({
      success: true,
      response: response,
    })
  } catch (error) {
    console.error('Error in chat API:', error)

    return NextResponse.json(
      { message: 'Failed to process chat message', error: String(error) },
      { status: 500 }
    )
  }
}
