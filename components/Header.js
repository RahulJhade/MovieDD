import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-secondary shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-accent">
            🎬 MovieDB
          </Link>
          
          <ul className="flex gap-6">
            <li>
              <Link 
                href="/" 
                className="hover:text-accent transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/search" 
                className="hover:text-accent transition-colors"
              >
                Search
              </Link>
            </li>
            <li>
              <Link 
                href="/genres" 
                className="hover:text-accent transition-colors"
              >
                Genres
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
