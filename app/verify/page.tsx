'use client'

import { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { decryptData } from '@/app/lib/clientOperations'
import dynamic from 'next/dynamic'

const QrReader = dynamic(() => import('react-qr-reader').then(mod => mod.QrReader), { ssr: false })

interface DecryptedCertificate {
  studentName: string;
  course: string;
  graduationDate: string;
  studentId: string;
}

export default function Verify() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [certificateDetails, setCertificateDetails] = useState<DecryptedCertificate | null>(null)
  const [certificateHash, setCertificateHash] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)

  const handleVerifyCertificate = async (hash: string) => {
    setIsVerifying(true)

    try {
      const response = await fetch(`/api/verify-certificate?hash=${encodeURIComponent(hash)}`)
      const data = await response.json()
      if (response.ok) {
        setVerificationResult(data.isValid)
        if (data.isValid && data.details) {
          const { encryptedStudentId, ...otherDetails } = data.details;
          const decryptedDetails: DecryptedCertificate = {
            ...otherDetails,
            studentId: decryptData(encryptedStudentId, 'local-encryption-key')
          };
          setCertificateDetails(decryptedDetails);
        }
      } else {
        throw new Error(data.message || 'Failed to verify certificate')
      }
    } catch (error) {
      console.error('Error verifying certificate:', error)
      setVerificationResult(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleScan = (data: string | null) => {
    if (data) {
      setCertificateHash(data)
      setIsScanning(false)
      handleVerifyCertificate(data)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Verify Certificate</h1>
      <Card>
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <CardDescription>Enter the certificate ID or scan QR code to verify its authenticity</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleVerifyCertificate(certificateHash); }}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="certificateId">Certificate ID</Label>
              <Input 
                id="certificateId" 
                value={certificateHash}
                onChange={(e) => setCertificateHash(e.target.value)}
                placeholder="Enter certificate ID" 
                required 
              />
            </div>
            <CardFooter className="mt-4 p-0">
              <Button type="submit" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify Certificate'}
              </Button>
              <Button type="button" onClick={() => setIsScanning(!isScanning)} className="ml-2">
                {isScanning ? 'Stop Scanning' : 'Scan QR Code'}
              </Button>
            </CardFooter>
          </form>
          {isScanning && (
            <div className="mt-4">
              <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={(result) => {
                  if (result) {
                    handleScan(result.getText());
                  }
                }}
                containerStyle={{ width: '100%' }}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {verificationResult !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
          </CardHeader>
          <CardContent>
            {verificationResult ? (
              <>
                <p className="text-green-600 mb-4">Certificate is valid and exists in the system.</p>
                {certificateDetails && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Certificate Details:</h3>
                    <p><strong>Certificate ID:</strong> {certificateHash}</p>
                    <p><strong>Student Name:</strong> {certificateDetails.studentName}</p>
                    <p><strong>Student ID:</strong> {certificateDetails.studentId}</p>
                    <p><strong>Course:</strong> {certificateDetails.course}</p>
                    <p><strong>Graduation Date:</strong> {certificateDetails.graduationDate}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-600">Certificate is not valid or does not exist in the system.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

