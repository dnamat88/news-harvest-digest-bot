
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel'
import { LoginForm } from '@/components/auth/LoginForm'
import { 
  Newspaper, 
  Mail, 
  Clock, 
  Filter, 
  Zap, 
  Shield,
  ArrowRight,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'

export const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return <LoginForm />
  }

  const features = [
    {
      icon: <Newspaper className="h-12 w-12 text-primary" />,
      title: "Raccolta Automatica",
      description: "Monitoriamo automaticamente centinaia di fonti di notizie finanziarie e bancarie per te.",
      highlight: "24/7 Monitoring"
    },
    {
      icon: <Filter className="h-12 w-12 text-primary" />,
      title: "Filtraggio Intelligente",
      description: "I nostri algoritmi selezionano solo le notizie più rilevanti per il tuo settore.",
      highlight: "AI-Powered"
    },
    {
      icon: <Mail className="h-12 w-12 text-primary" />,
      title: "Digest Personalizzati",
      description: "Ricevi un riassunto quotidiano delle notizie più importanti direttamente nella tua inbox.",
      highlight: "Daily Delivery"
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Risparmio di Tempo",
      description: "Riduci il tempo dedicato alla ricerca di notizie da ore a pochi minuti al giorno.",
      highlight: "Time Saver"
    }
  ]

  const stats = [
    { number: "500+", label: "Fonti Monitorate" },
    { number: "10K+", label: "Notizie Analizzate/Giorno" },
    { number: "98%", label: "Accuratezza" },
    { number: "2min", label: "Tempo di Lettura Medio" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/f30e033a-dcdc-467e-bee0-e5292115598d.png" 
              alt="FlashBrief Logo" 
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm hidden">
              F
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FlashBrief
            </h1>
          </div>
          <Button onClick={() => setShowLogin(true)} className="flex items-center gap-2">
            Accedi <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Novità nel Mondo Banking
          </Badge>
          
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
            Il tuo <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">digest quotidiano</span> delle notizie finanziarie
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            FlashBrief raccoglie, filtra e riassume automaticamente le notizie più importanti 
            del settore bancario e finanziario, consegnandole direttamente nella tua inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" onClick={() => setShowLogin(true)} className="text-lg px-8 py-6">
              Inizia Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Shield className="mr-2 h-5 w-5" />
              Scopri di Più
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Funzionalità che Fanno la Differenza
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scopri come FlashBrief può trasformare il modo in cui rimani aggiornato 
            sulle notizie del settore finanziario.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="flex justify-center">
                        {feature.icon}
                      </div>
                      <Badge variant="secondary" className="mb-2">
                        {feature.highlight}
                      </Badge>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container py-20">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Unisciti a centinaia di professionisti del settore
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Banchieri, analisti finanziari e consulenti si affidano già a FlashBrief 
              per rimanere aggiornati sulle ultime novità del settore.
            </p>
            <div className="flex justify-center items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">4.9/5 su 200+ recensioni</span>
            </div>
            <Button size="lg" onClick={() => setShowLogin(true)}>
              <TrendingUp className="mr-2 h-5 w-5" />
              Inizia Subito
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 FlashBrief. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  )
}
