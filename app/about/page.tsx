import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cgc-ink pt-20">
      {/* Hero */}
      <div className="bg-cgc-ink py-24 text-center border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Image src="/images/logo.jpg" alt="" width={400} height={400} className="object-contain" />
        </div>
        <p className="font-inter text-cgc-red tracking-[0.4em] text-xs mb-4 relative z-10">Est. 2002</p>
        <h1 className="section-heading relative z-10">Our Story</h1>
        <div className="red-underline" />
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-24">
        <div className="space-y-8 text-cgc-slate font-inter leading-relaxed text-base md:text-lg">
          <p className="text-cgc-paper text-xl md:text-2xl font-inter leading-relaxed">
            "I started selling my CG t-shirts and hats from a duffle bag. LOL…"
          </p>
          <div className="w-16 h-px bg-cgc-red" />
          <p>
            The Cary Grant Clothing Company started back in the day when I worked with my friend AKA Big Brother Micks outside the Eaton Centre in Downtown Toronto. We shared a little booth selling watches and I had my designs and mix-tapes in a duffle-bag hustling at the same time.
          </p>
          <p>
            I then went to the Jane & Finch area and sold my CG clothing and mix-tapes outta the trunk of my car in the parking lot of Yorkgate Mall during the day, and then to my friends all over the city at night. To my Portuguese fam', you know who you are, thank you for always supporting my business!
          </p>
          <p>
            After being outside for a few months, I got a little space inside the Mall to sell my clothing and CDs on a folding table. Then the hating began. A few store owners started complaining about me selling clothing, saying it was a conflict of their interest.
          </p>
          <p>
            I then moved across the street to my current location, 54 Dunlop Street West. This space was much bigger than the previous three combined. And today — we own the building.
          </p>
          <p className="text-cgc-paper font-inter text-lg">
            From a duffle bag to owning the building. This is more than clothing. This is legacy.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
          {[
            { value: '2002', label: 'Year Founded' },
            { value: '20+', label: 'Years in Business' },
            { value: '120+', label: 'Products' },
            { value: 'Barrie, ON', label: 'Home Base' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-inter text-cgc-red font-bold text-2xl md:text-3xl">{stat.value}</p>
              <p className="text-cgc-slate text-xs mt-2 font-inter">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/shop" className="btn-primary">Shop The Collection</Link>
        </div>
      </div>
    </div>
  )
}
