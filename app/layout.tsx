import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CertChain',
  description: 'Decentralized Academic Certificate Issuance System Using Blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-primary-foreground p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">CertChain</h1>
            <ul className="flex space-x-4">
              <li><a href="" className="hover:underline">Home</a></li>
              <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
              <li><a href="/verify" className="hover:underline">Verify Certificate</a></li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto mt-8 px-4">
          {children}
        </main>
        <footer className="bg-secondary text-secondary-foreground mt-8 p-4">
          <div className="container mx-auto text-center">
            © 2023 CertChain. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}

