import './globals.css'

export const metadata = {
  title: 'Dino — Know Sooner',
  description: 'Upload your pathology results and get a plain English explanation instantly.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
