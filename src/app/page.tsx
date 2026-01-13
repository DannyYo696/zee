'use client'

import { useState } from 'react'
import { Ticket, Calendar, MapPin, Users, Star, Crown, Zap, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'

const TICKET_TIERS = [
  {
    id: 'regular',
    name: 'Regular',
    price: 5000,
    description: 'Standard access to the event',
    features: [
      'Event entry',
      'General seating area',
      'Access to main venue',
      'Digital ticket delivery'
    ],
    icon: Ticket,
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500'
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 30000,
    description: 'Premium experience with exclusive perks',
    features: [
      'Priority entrance',
      'Premium seating area',
      'Exclusive VIP lounge access',
      'Complimentary drinks',
      'Meet and greet opportunity',
      'Digital ticket delivery'
    ],
    icon: Crown,
    color: 'bg-amber-500',
    borderColor: 'border-amber-500',
    popular: true
  },
  {
    id: 'gang-of-5',
    name: 'Gang of 5',
    price: 20000,
    description: 'Group package for 5 people',
    features: [
      '5 tickets included',
      'Group seating arrangement',
      'Entry for your entire squad',
      'Discounted rate per person (₦4,000)',
      'Digital ticket delivery'
    ],
    icon: Users,
    color: 'bg-purple-500',
    borderColor: 'border-purple-500',
    isGroup: true
  }
]

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBuyTicket = (tierId: string) => {
    const tier = TICKET_TIERS.find(t => t.id === tierId)
    if (!tier) return

    setSelectedTier(tierId)
    
    // Store selected tier in localStorage (convert icon to string name)
    const tierToStore = {
      ...tier,
      icon: tierId // Store icon name as string
    }
    localStorage.setItem('selectedTicketTier', JSON.stringify(tierToStore))
    
    toast({
      title: 'Ticket tier selected',
      description: `You selected ${tier.name} ticket tier. Proceeding to checkout...`,
    })

    // Redirect to checkout page
    window.location.href = '/checkout'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const eventDate = new Date()
  eventDate.setDate(eventDate.getDate() + 30) // Set event date to 30 days from now

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-white">Nightflix</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6">
              <a href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#tickets" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Tickets
              </a>
              <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                FAQ
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
            <Zap className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-semibold text-rose-500">Limited Tickets Available</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Nightflix
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500 mt-2">
              Live Experience
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Experience the ultimate night of entertainment, music, and excitement. Join us for an unforgettable event!
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-slate-300 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-rose-500" />
              <span>{formatDate(eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-rose-500" />
              <span>7:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-rose-500" />
              <span>Lagos, Nigeria</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-rose-500/25"
          >
            Get Your Tickets Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        {/* Ticket Tiers Section */}
        <section id="tickets" className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Choose Your Experience</h2>
            <p className="text-slate-400 text-lg">Select the perfect ticket tier for your Nightflix experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {TICKET_TIERS.map((tier) => {
              const Icon = tier.icon
              const pricePerPerson = tier.isGroup ? Math.round(tier.price / 5) : tier.price

              return (
                <Card
                  key={tier.id}
                  className={`relative bg-slate-900/50 border-slate-800 hover:border-${tier.color.split('-')[1]}-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${tier.borderColor}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 font-semibold shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${tier.color} mb-4 mx-auto shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                        ₦{tier.price.toLocaleString()}
                      </div>
                      {tier.isGroup && (
                        <div className="text-sm text-slate-400">
                          ₦{pricePerPerson.toLocaleString()} per person (5 tickets)
                        </div>
                      )}
                    </div>

                    <Separator className="bg-slate-800" />

                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleBuyTicket(tier.id)}
                      disabled={isProcessing}
                      className={`w-full bg-gradient-to-r ${tier.color.replace('bg-', 'from-')} to-${tier.color.split('-')[1]}-600 hover:from-${tier.color.split('-')[1]}-600 hover:to-${tier.color.split('-')[1]}-700 text-white font-semibold py-6 text-lg shadow-lg`}
                    >
                      {isProcessing && selectedTier === tier.id ? (
                        'Processing...'
                      ) : (
                        <>
                          Buy {tier.name} Ticket
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-16 sm:mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Star className="h-12 w-12 text-rose-500 mb-4" />
                  <CardTitle className="text-xl text-white">World-Class Entertainment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Experience top-tier performances, stunning visuals, and immersive entertainment that will keep you on the edge of your seat all night long.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Users className="h-12 w-12 text-purple-500 mb-4" />
                  <CardTitle className="text-xl text-white">Network & Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Join over 1000+ attendees from across the region. Make new connections, build relationships, and create lasting memories.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <MapPin className="h-12 w-12 text-emerald-500 mb-4" />
                  <CardTitle className="text-xl text-white">Prime Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Located in the heart of Lagos with easy accessibility. Multiple parking options and excellent transport links available.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <Ticket className="h-12 w-12 text-amber-500 mb-4" />
                  <CardTitle className="text-xl text-white">Secure & Verified</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">
                    Every ticket comes with a unique QR code for instant verification at the venue. No fake tickets, guaranteed access.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-400 text-lg">Got questions? We've got answers</p>
            </div>

            <div className="space-y-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-white">How do I receive my ticket after purchase?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm sm:text-base">
                    After successful payment, your ticket will be sent instantly to the email address you provided during checkout. You'll also see your ticket details on the confirmation page with a QR code.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-white">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm sm:text-base">
                    We accept all major payment methods including Visa, Mastercard, Verve, and mobile money through our secure Paystack payment gateway.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-white">Can I transfer my ticket to someone else?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Tickets are non-transferable for security reasons. Each ticket is linked to the buyer's email and phone number for verification at the venue.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-white">What happens if I lose my ticket email?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Simply contact our support team with the email address used for purchase, and we'll resend your ticket. Your unique QR code ensures you can always regain access.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-white">How do I verify my ticket at the venue?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Simply present your ticket with the QR code at the entrance. Our team will scan it for instant verification. You can also show the confirmation page on your phone.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-rose-500" />
              <span className="text-lg font-bold text-white">Nightflix</span>
            </div>
            <p className="text-sm text-slate-400 text-center sm:text-left">
              © 2025 Nightflix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
