'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, ChevronLeft, ChevronRight, ArrowRight, Users, Heart as HeartIcon, Utensils, Activity, Quote, Star, BarChart3, Smile, Award } from 'lucide-react'
import TestimonialForm from '@/components/TestimonialForm'
import AdSlot from '@/components/AdSlot'
import { useTranslations } from 'next-intl'
import * as Icons from 'lucide-react'

interface Statistic {
  id: string
  label: string
  value: string
  icon: string
}

interface Testimonial {
  id: string
  name: string
  role: string | null
  message: string
  rating: number | null
}

interface SiteContent {
  hero_title?: string
  hero_subtitle?: string
  mission_statement?: string
}

interface Program {
  id: string
  title: string
  slug: string
  description: string
  photos: string // JSON string
  translations?: any[]
}

// Main Landing Page Component
export default function Home() {
  const t = useTranslations();
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [content, setContent] = useState<SiteContent>({})
  const [programs, setPrograms] = useState<Program[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const heroImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop'
  ]

  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    const localeQuery = locale ? `?locale=${locale}` : ''
    // Fetch statistics
    fetch(`/api/statistics${localeQuery}`)
      .then(res => {
        if (!res.ok) throw new Error(`Statistics API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setStatistics(data)
      })
      .catch(err => console.error('Error loading statistics:', err))

    // Fetch testimonials
    fetch(`/api/testimonials?status=APPROVED${locale ? `&locale=${locale}` : ''}`)
      .then(res => {
        if (!res.ok) throw new Error(`Testimonials API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setTestimonials(data)
      })
      .catch(err => console.error('Error loading testimonials:', err))

    // Fetch content
    fetch(`/api/content?keys=hero_title,hero_subtitle,mission_statement${locale ? `&locale=${locale}` : ''}`)
      .then(res => {
        if (!res.ok) throw new Error(`Content API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setContent(data)
      })
      .catch(err => console.error('Error loading content:', err))

    // Fetch programs
    fetch(`/api/programs${localeQuery}`)
      .then(res => {
        if (!res.ok) throw new Error(`Programs API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setPrograms(data)
      })
      .catch(err => console.error('Error loading programs:', err))
  }, [locale])

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.length, isPaused])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }, [heroImages.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [heroImages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevSlide, nextSlide])

  function getIconComponent(iconName: string, size: number) {
    const Icon = (Icons as any)[iconName] || Icons.BarChart3
    return <Icon size={size} className="mb-4 text-[#2E8B57] drop-shadow-lg" />
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section with Enhanced Carousel */}
      <section
        className="relative h-[600px] flex items-center justify-center text-white overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Hero carousel"
      >
        {/* Base layer to prevent white gap in Firefox */}
        <div className="absolute inset-0 bg-gray-900 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6E8C82]/70 to-[#2E8B57]/70 z-10" />

        {/* Sliding Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url("${image}")` }}
            aria-hidden={index !== currentSlide}
          />
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} className="text-white drop-shadow-lg" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={28} className="text-white drop-shadow-lg" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2" role="tablist">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white w-8 shadow-lg'
                : 'bg-white/50 hover:bg-white/75 w-3'
                }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentSlide}
              role="tab"
            />
          ))}
        </div>

        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 font-heading drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            {content.hero_title || t('hero.title')}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          >
            {content.hero_subtitle || t('hero.subtitle')}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/get-involved"
              className="bg-[#2E8B57] hover:bg-[#267347] text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] active:scale-95"
            >
              <Heart size={20} />
              {t('hero.donateNow')}
            </Link>
            <Link
              href="/programs"
              className="bg-white hover:bg-gray-100 text-[#6E8C82] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] active:scale-95"
            >
              {t('hero.ourPrograms')}
            </Link>
          </div>
        </div>
      </section>

      {/* Advertisement: Home Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot placement="HOME_TOP" className="w-full min-h-[90px] bg-gray-50 rounded-lg flex items-center justify-center" />
      </div>

      {/* Mission Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <h2 className="text-3xl font-bold text-[#6E8C82] mb-6">{t('mission.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {content.mission_statement || t('mission.statement')}
          </p>
        </div>
      </section>

      {/* Impact Stats with Hover Animations - Dynamic */}
      <section className="bg-gradient-to-r from-[#6E8C82] to-[#0b5090] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {statistics && statistics.length > 0 ? (
              statistics.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >
                  {getIconComponent(stat.icon, 48)}
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-white/70">{t('common.loading')}</div>
            )}
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('programs.title')}</h2>
            <p className="text-gray-600">{t('programs.subtitle')}</p>
          </div>
          <Link href="/programs" className="text-[#6E8C82] hover:text-[#0b5090] hover:underline flex items-center gap-1 transition-colors">
            {t('programs.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {programs.length > 0 ? (
            programs.map((program, i) => {
              const photos = JSON.parse(program.photos || '[]')
              const coverImage = photos[0] || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop'

              return (
                <div
                  key={program.id}
                  className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 border border-gray-100 group flex flex-col w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-[380px]"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url("${coverImage}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-[#6E8C82] transition-colors">{program.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{program.description}</p>
                    <div className="mt-auto">
                      <Link href={`/programs/${program.slug}`} className="text-[#2E8B57] font-medium hover:text-[#267347] hover:underline transition-colors inline-flex items-center gap-1 group/link">
                        {t('programs.learnMore')}
                        <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            // Fallback to placeholders or loading state
            [1, 2, 3].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl h-80 animate-pulse border border-gray-100" />
            ))
          )}
        </div>
      </section>

      {/* Testimonials - Dynamic */}
      {testimonials.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">{t('testimonials.title')}</h2>
              <p className="text-gray-600 text-center mb-12">{t('testimonials.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full"
                >
                  <Quote size={32} className="text-[#6E8C82] mb-4 opacity-20" />
                  <p className="text-gray-700 mb-4 italic">&quot;{testimonial.message}&quot;</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      {testimonial.role && (
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      )}
                    </div>
                    {testimonial.rating && (
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advertisement: Home Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot placement="HOME_BOTTOM" className="w-full min-h-[90px] bg-gray-50 rounded-lg flex items-center justify-center" />
      </div>

      {/* Share Your Story */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">{t('shareStory.title')}</h2>
          <p className="text-gray-600 text-center mb-8">
            {t('shareStory.subtitle')}
          </p>
          <TestimonialForm />
        </div>
      </section>
    </div>
  )
}
