import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Share2, 
  BarChart3, 
  CreditCard, 
  Check,
  ArrowRight 
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Planification des publications',
      description: 'Programmez vos posts à l\'avance sur tous vos réseaux sociaux en quelques clics.'
    },
    {
      icon: Share2,
      title: 'Connexion multi-réseaux',
      description: 'Connectez Facebook, Instagram, LinkedIn, X (Twitter) et TikTok depuis une seule plateforme.'
    },
    {
      icon: BarChart3,
      title: 'Statistiques détaillées',
      description: 'Analysez les performances de vos publications avec des graphiques clairs et précis.'
    },
    {
      icon: CreditCard,
      title: 'Gestion d\'abonnement',
      description: 'Choisissez le plan qui correspond à vos besoins et évoluez à votre rythme.'
    }
  ];

  const plans = [
    {
      name: 'Basique',
      price: '9€',
      description: 'Pour débuter',
      features: [
        'Jusqu\'à 3 réseaux sociaux',
        '10 publications/mois',
        'Statistiques basiques',
        'Support par email'
      ]
    },
    {
      name: 'Standard',
      price: '29€',
      description: 'Le plus populaire',
      features: [
        'Jusqu\'à 5 réseaux sociaux',
        '50 publications/mois',
        'Statistiques avancées',
        'Support prioritaire',
        'Planification illimitée'
      ],
      highlighted: true
    },
    {
      name: 'Premium',
      price: '79€',
      description: 'Pour les professionnels',
      features: [
        'Réseaux sociaux illimités',
        'Publications illimitées',
        'Analytics en temps réel',
        'Support 24/7',
        'API personnalisée',
        'Équipe collaborative'
      ]
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Centralisez vos publications sur tous vos réseaux sociaux
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gagnez du temps avec SocialHub : planifiez, publiez et analysez vos contenus sur Facebook, Instagram, LinkedIn, X et TikTok depuis une seule plateforme.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="shadow-glow group">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-card border bg-card p-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <BarChart3 className="w-20 h-20 mx-auto text-primary opacity-50" />
                  <p className="text-muted-foreground">Aperçu du tableau de bord</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une solution complète pour gérer votre présence sur les réseaux sociaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Des tarifs adaptés à vos besoins
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choisissez le plan qui correspond le mieux à votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`shadow-card transition-smooth ${
                  plan.highlighted 
                    ? 'border-primary shadow-glow scale-105' 
                    : 'hover:shadow-glow'
                }`}
              >
                <CardHeader>
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      Populaire
                    </div>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      Choisir ce plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Prêt à simplifier votre community management ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez des milliers d'utilisateurs qui gagnent du temps chaque jour
            </p>
            <Link to="/register">
              <Button size="lg" className="shadow-glow">
                Commencer maintenant gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Landing;
