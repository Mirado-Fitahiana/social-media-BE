import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Billing = () => {
  const { user, updatePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const plans = [
    {
      id: 'basic',
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
      id: 'standard',
      name: 'Standard',
      price: '29€',
      description: 'Le plus populaire',
      features: [
        'Jusqu\'à 5 réseaux sociaux',
        '50 publications/mois',
        'Statistiques avancées',
        'Support prioritaire',
        'Planification illimitée'
      ]
    },
    {
      id: 'premium',
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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setDialogOpen(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlan) {
      updatePlan(selectedPlan as 'basic' | 'standard' | 'premium');
      toast.success(`Paiement réussi ! Vous êtes maintenant sur le plan ${selectedPlan}`);
      setDialogOpen(false);
      setCardNumber('');
      setExpiryDate('');
      setCvc('');
      setCardHolder('');
    }
  };

  const currentPlan = plans.find(p => p.id === user?.plan);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon abonnement</h1>
          <p className="text-muted-foreground">
            Gérez votre abonnement et votre facturation
          </p>
        </div>

        {/* Current Plan */}
        <Card className="shadow-card border-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Plan actuel</CardTitle>
                <CardDescription>Votre abonnement en cours</CardDescription>
              </div>
              <Badge variant="default">Actif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold capitalize">{currentPlan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prix</span>
                <span className="font-semibold">{currentPlan?.price}/mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prochain renouvellement</span>
                <span className="font-semibold">1er janvier 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Changer de plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`shadow-card transition-smooth ${
                  plan.id === user?.plan 
                    ? 'border-primary shadow-glow' 
                    : 'hover:shadow-glow'
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.id === user?.plan ? (
                    <Button className="w-full" variant="outline" disabled>
                      Plan actuel
                    </Button>
                  ) : (
                    <Dialog open={dialogOpen && selectedPlan === plan.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full"
                          onClick={() => handleSelectPlan(plan.id)}
                        >
                          Choisir ce plan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Paiement sécurisé</DialogTitle>
                          <DialogDescription>
                            Finaliser le changement de plan vers {plan.name}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePayment} className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Plan</span>
                              <span className="font-semibold">{plan.name}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total</span>
                              <span>{plan.price}/mois</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Numéro de carte</Label>
                            <div className="relative">
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                              />
                              <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Date d'expiration</Label>
                              <Input
                                id="expiryDate"
                                placeholder="MM/AA"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input
                                id="cvc"
                                placeholder="123"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardHolder">Titulaire de la carte</Label>
                            <Input
                              id="cardHolder"
                              placeholder="Jean Dupont"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full">
                            Payer maintenant
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
