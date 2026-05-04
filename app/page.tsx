import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { CalculatorSection } from '@/components/sections/CalculatorSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'
import { StickyCtaBar } from '@/components/sections/StickyCtaBar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <CalculatorSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <StickyCtaBar />
    </>
  )
}
