import HeroSection from '@/components/HeroSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import NewArrivals from '@/components/NewArrivals'
import Collections from '@/components/Collections'
import BrandStory from '@/components/BrandStory'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <Collections />
      <BrandStory />
      <Testimonials />
      <Newsletter />
    </>
  )
}
