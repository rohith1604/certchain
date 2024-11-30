import { Button } from "@/app/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card"

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to CertChain</h1>
        <p className="text-xl mb-8">Secure, verifiable academic certificates on blockchain</p>
        <Button size="lg">Get Started</Button>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issue Certificates</CardTitle>
            <CardDescription>For Educational Institutions</CardDescription>
          </CardHeader>
          <CardContent>
            Securely issue and manage academic certificates using blockchain technology.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verify Certificates</CardTitle>
            <CardDescription>For Employers and Institutions</CardDescription>
          </CardHeader>
          <CardContent>
            Easily verify the authenticity of academic credentials in real-time.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Credentials</CardTitle>
            <CardDescription>For Students and Graduates</CardDescription>
          </CardHeader>
          <CardContent>
            Access and share your academic certificates securely and conveniently.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

