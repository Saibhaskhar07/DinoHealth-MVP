import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract text from PDF
    let extractedText = ''
    try {
      const pdfParse = (await import('pdf-parse')).default
      const pdfData = await pdfParse(buffer)
      extractedText = pdfData.text
    } catch (pdfError) {
      return NextResponse.json(
        { error: 'Could not read PDF. Please ensure it is a valid pathology results file.' },
        { status: 400 }
      )
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF. Try a different file.' },
        { status: 400 }
      )
    }

    // Call Claude API
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are a health literacy assistant for Dino, an Australian health platform. Your role is to explain pathology results in plain English so patients can understand them easily.

IMPORTANT RULES:
- Never diagnose conditions
- Never recommend specific treatments or medications  
- Always suggest the patient discuss results with their GP
- Use simple, friendly, non-clinical language
- Be reassuring but honest about results outside normal range

Here are the pathology results to explain:

${extractedText}

Please provide your explanation in this exact format:

SUMMARY
A 2-3 sentence plain English overview of the results overall.

YOUR MARKERS
For each test result found, explain:
- What it measures (in simple terms)
- Whether it is normal, low, or high
- What this means for the patient in everyday language

WHAT TO DO NEXT
A brief, friendly recommendation to discuss with their GP, and any general lifestyle notes if relevant.

DISCLAIMER
Always end with: "This explanation is for health literacy purposes only and is not a medical diagnosis. Please discuss your results with your GP."`,
        },
      ],
    })

    const explanation = message.content[0].text

    return NextResponse.json({ explanation, success: true })
  } catch (error) {
    console.error('API Error:', error)
    if (error.status === 401) {
      return NextResponse.json({ error: 'API key invalid. Please check your configuration.' }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
