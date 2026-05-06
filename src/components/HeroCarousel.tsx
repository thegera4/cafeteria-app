'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: '20% Off Breakfast Combo',
    subtitle: 'Start your day right with a coffee and a sandwich!',
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop',
    color: 'from-primary/80 to-primary-container/90',
  },
  {
    id: 2,
    title: 'New Artisan Pizza',
    subtitle: 'Wood-fired perfection available every afternoon.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    color: 'from-orange-900/80 to-amber-900/90',
  },
  {
    id: 3,
    title: 'Happy Hour!',
    subtitle: 'Half-price pastries after 4 PM.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop',
    color: 'from-primary-container/80 to-primary/90',
  }
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () => setCurrent((curr) => (curr + 1) % slides.length)

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8 shadow-sm">
      <div 
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} flex flex-col justify-center px-8 md:px-16 text-white`}>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl max-w-lg opacity-90">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button 
          onClick={prev}
          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-2.5 h-2.5 bg-white rounded-full ${
                current === i ? 'p-1.5' : 'bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
