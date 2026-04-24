import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: 'Dino — Know Sooner',
  description: 'Upload your pathology results and get a plain English explanation instantly.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/Users/saibhaskharramesh/Saibhaskhar/University-Temp/TechE/dino-health/public/icon.png" type="image/png" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}