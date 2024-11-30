import CryptoJS from 'crypto-js'
import { CertificateData } from '@/app/components/lib/localBlockchain'

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

