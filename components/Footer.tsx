import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-cgc-footer-bg border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Image src="/images/logo.jpg" alt="CGC Logo" width={70} height={70} className="mb-4 object-contain" />
            <p className="font-cinzel text-[#f5f0e8] uppercase tracking-widest text-sm mb-2">Cary Grant Clothing</p>
            <p className="text-[#6e6358] text-xs font-inter leading-relaxed mb-4">
              Premium Canadian streetwear. Est. 2002, Barrie, Ontario. From the streets to the world.
            </p>
            <div className="flex gap-4 text-[#6e6358] text-xs font-cinzel tracking-widest">
              <a href="https://instagram.com/cgclthn" target="_blank" rel="noreferrer" className="hover:text-[#c9a84c] transition-colors">IG</a>
              <a href="https://twitter.com/CG021" target="_blank" rel="noreferrer" className="hover:text-[#c9a84c] transition-colors">TW</a>
              <a href="https://facebook.com/Cary-Grant-Clothing-19389221599" target="_blank" rel="noreferrer" className="hover:text-[#c9a84c] transition-colors">FB</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#c9a84c] transition-colors">TK</a>
              <a href="https://snapchat.com" target="_blank" rel="noreferrer" className="hover:text-[#c9a84c] transition-colors">SC</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-[#f5f0e8] uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-3 text-[#6e6358] text-xs font-inter">
              {['Home', 'Shop', 'About', 'Contact'].map(link => (
                <li key={link}>
                  <Link href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="hover:text-[#c9a84c] transition-colors uppercase tracking-widest">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-cinzel text-[#f5f0e8] uppercase tracking-widest text-xs mb-6">Customer Service</h4>
            <ul className="space-y-3 text-[#6e6358] text-xs font-inter">
              {['Shipping Policy', 'Returns', 'Size Guide', 'FAQ', 'Track Order'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-[#c9a84c] transition-colors uppercase tracking-widest">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-[#f5f0e8] uppercase tracking-widest text-xs mb-6">Contact Us</h4>
            <ul className="space-y-3 text-[#6e6358] text-xs font-inter">
              <li className="flex gap-2">
                <span>📍</span>
                <span>54 Dunlop Street West, Main Floor<br />Barrie, ON</span>
              </li>
              <li className="flex gap-2">
                <span>📞</span>
                <a href="tel:+17057171073" className="hover:text-[#c9a84c] transition-colors">+1 705-717-1073</a>
              </li>
              <li className="flex gap-2">
                <span>✉️</span>
                <a href="mailto:cary@carygrantclothing.com" className="hover:text-[#c9a84c] transition-colors">cary@carygrantclothing.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[rgba(245,240,232,0.05)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6e6358] text-xs font-inter">
            © {new Date().getFullYear()} Cary Grant Clothing. All rights reserved.
          </p>
          <p className="text-[#6e6358] text-xs font-inter">
            Built with ❤️ for the streets of Barrie, Ontario 🇨🇦
          </p>
        </div>
      </div>
    </footer>
  )
}
