import CryptoJS from 'crypto-js'
import clientPromise from './mongodb'

export interface CertificateData {
  studentName: string;
  course: string;
  graduationDate: string;
  encryptedStudentId: string;
}

export function hashCertificate(certificateData: CertificateData): string {
  return CryptoJS.SHA256(JSON.stringify(certificateData)).toString()
}

export function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString()
}

export function decryptData(encryptedData: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export async function issueCertificate(certificateData: CertificateData): Promise<string> {
  const client = await clientPromise
  const collection = client.db("certchain").collection("certificates")
  
  const certificateHash = hashCertificate(certificateData)
  await collection.insertOne({ hash: certificateHash, data: certificateData })
  return certificateHash
}

export async function verifyCertificate(certificateHash: string): Promise<boolean> {
  const client = await clientPromise
  const collection = client.db("certchain").collection("certificates")
  
  const certificate = await collection.findOne({ hash: certificateHash })
  return !!certificate
}

export async function getCertificateDetails(certificateHash: string): Promise<CertificateData | null> {
  const client = await clientPromise
  const collection = client.db("certchain").collection("certificates")
  
  const certificate = await collection.findOne({ hash: certificateHash })
  return certificate ? certificate.data : null
}

