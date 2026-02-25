import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Movie Database - Discover Movies',
  description: 'Browse and discover popular movies, search for your favorites, and explore detailed information.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-secondary py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-400">
          </div>
        </footer>
      </body>
    </html>
  )
}
