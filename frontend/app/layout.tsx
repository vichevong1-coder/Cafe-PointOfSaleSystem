import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Café POS - Point of Sale System",
  description: "Professional web-based point of sale system for cafes and coffee shops",
}

export const viewport = {
  themeColor: "#5D4037",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}

      </body>
    </html>
  )
}
