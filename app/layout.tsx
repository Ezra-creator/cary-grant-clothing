import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import GlobalLayout from '@/components/GlobalLayout'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Cary Grant Clothing | Premium Streetwear — Est. 2002',
  description: 'Premium Canadian streetwear brand from Barrie, Ontario. Shop hoodies, tracksuits, African collections, women\'s wear, kids\' clothing and more. Est. 2002.',
  keywords: [
    'Cary Grant Clothing', 'CGC', 'Canadian streetwear', 'premium clothing',
    'Barrie Ontario', 'hoodies', 'tracksuits', 'African collection',
    'women\'s clothing Canada', 'men\'s streetwear', 'kids clothing Canada',
    'activewear Canada', 'footwear Canada', 'luxury streetwear',
    'Canadian fashion brand', 'Barrie clothing store', 'CGC hoodies',
    'premium tracksuits', 'streetwear brand Ontario', 'Canadian designer clothing',
  ],
  openGraph: {
    title: 'Cary Grant Clothing | Premium Streetwear — Est. 2002',
    description: 'From a duffle bag to owning the building. Premium Canadian streetwear Est. 2002, Barrie, Ontario.',
    url: 'https://carygrantclothing.com',
    siteName: 'Cary Grant Clothing',
    type: 'website',
    images: [
      {
        url: 'https://carygrantclothing.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cary Grant Clothing — Premium Canadian Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cary Grant Clothing | Premium Streetwear — Est. 2002',
    description: 'From a duffle bag to owning the building. Premium Canadian streetwear Est. 2002.',
    images: ['https://carygrantclothing.com/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://carygrantclothing.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Skip to content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-cgc-red focus:text-white focus:font-cinzel focus:text-xs focus:uppercase focus:tracking-widest focus:px-4 focus:py-2"
        >
          Skip to content
        </a>

        <AuthProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--cgc-surface)',
              color: 'var(--cgc-white)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              borderRadius: '0',
              padding: '12px 16px',
            },
            success: {
              style: {
                background: 'var(--cgc-surface)',
                color: 'var(--cgc-white)',
                border: '1px solid rgba(34,197,94,0.5)',
              },
              iconTheme: { primary: '#22c55e', secondary: 'var(--cgc-surface)' },
            },
            error: {
              style: {
                background: 'var(--cgc-surface)',
                color: 'var(--cgc-white)',
                border: '1px solid var(--cgc-red)',
              },
              iconTheme: { primary: '#e63333', secondary: 'var(--cgc-surface)' },
            },
            loading: {
              style: {
                background: 'var(--cgc-surface)',
                color: 'var(--cgc-white)',
                border: '1px solid rgba(251,191,36,0.5)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
