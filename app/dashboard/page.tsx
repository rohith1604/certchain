'use client'

import { useState, useRef } from 'react'
import { Button } from "@/app/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { encryptData } from '@/app/lib/clientOperations'
import { QRCodeSVG } from 'qrcode.react'

export default function Dashboard() {
  const [isIssuing, setIsIssuing] = useState(false)
  const [certificateHash, setCertificateHash] = useState<string | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleIssueCertificate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsIssuing(true)

    const formData = new FormData(event.currentTarget)
    const certificateData = {
      studentName: formData.get('studentName') as string,
      course: formData.get('course') as string,
      graduationDate: formData.get('graduationDate') as string,
      encryptedStudentId: encryptData(formData.get('studentId') as string, 'local-encryption-key')
    }

    try {
      const response = await fetch('/api/issue-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certificateData),
      })
      const data = await response.json()
      if (response.ok) {
        setCertificateHash(data.hash)
      } else {
        throw new Error(data.message || 'Failed to issue certificate')
      }
    } catch (error) {
      console.error('Error issuing certificate:', error)
    } finally {
      setIsIssuing(false)
    }
  }

  const handleSaveQR = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas')
      if (canvas) {
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        const link = document.createElement('a')
        link.download = `certificate-${certificateHash}.png`
        link.href = image
        link.click()
      }
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Institution Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Issue New Certificate</CardTitle>
          <CardDescription>Enter the details of the new academic certificate</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIssueCertificate}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="studentName">Student Name</Label>
                <Input id="studentName" name="studentName" placeholder="Enter student's full name" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" name="studentId" placeholder="Enter student's ID" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="course">Course</Label>
                <Input id="course" name="course" placeholder="Enter course name" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="graduationDate">Graduation Date</Label>
                <Input id="graduationDate" name="graduationDate" type="date" required />
              </div>
            </div>
            <CardFooter className="mt-4 p-0">
              <Button type="submit" disabled={isIssuing}>
                {isIssuing ? 'Issuing...' : 'Issue Certificate'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      {certificateHash && (
        <Card>
          <CardHeader>
            <CardTitle>Certificate Issued</CardTitle>
            <CardDescription>The certificate has been successfully issued</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mb-4">Certificate Hash: {certificateHash}</p>
            <div ref={qrRef}>
              <QRCodeSVG value={certificateHash} size={256} />
            </div>
            <Button onClick={handleSaveQR} className="mt-4">Save QR Code</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

