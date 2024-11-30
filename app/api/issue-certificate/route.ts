import { NextResponse } from 'next/server'
import clientPromise from '@/app/components/lib/mongodb'
import { hashCertificate } from '@/app/lib/clientOperations'

export async function POST(request: Request) {
  try {
    const certificateData = await request.json()
    const client = await clientPromise
    const collection = client.db("certchain").collection("certificates")
    
    const certificateHash = hashCertificate(certificateData)
    await collection.insertOne({ hash: certificateHash, data: certificateData })
    
    return NextResponse.json({ hash: certificateHash })
  } catch (error) {
    console.error('Error issuing certificate:', error)
    return NextResponse.json({ message: 'Failed to issue certificate' }, { status: 500 })
  }
}

