import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {UserProvider} from '../AuthContext/useContext'
import { Toaster } from "sonner";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Baiacu',
  description: 'By GabrielAlSanty',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider >
      <Toaster  position="top-right"/>
      <body className='antialiased bg-violet-100'>{children}</body>
      </UserProvider>
    </html>
  )
}
