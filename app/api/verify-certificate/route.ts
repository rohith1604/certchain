import { NextResponse } from 'next/server'
import clientPromise from '@/app/components/lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hash = searchParams.get('hash')

  if (!hash) {
    return NextResponse.json({ message: 'Certificate hash is required' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db("certchain").collection("certificates")
    
    const certificate = await collection.findOne({ hash })
    const isValid = !!certificate
    
    return NextResponse.json({ isValid, details: isValid ? certificate.data : null })
  } catch (error) {
    console.error('Error verifying certificate:', error)
    return NextResponse.json({ message: 'Failed to verify certificate' }, { status: 500 })
  }
}

