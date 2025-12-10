import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Upload, Save, Send } from 'lucide-react';
import { toast } from 'sonner';

const NewPost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [publishType, setPublishType] = useState('now');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('12:00');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(['facebook']);

  const networks = [
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'twitter', name: 'X (Twitter)' },
    { id: 'tiktok', name: 'TikTok' }
  ];

  const handleNetworkToggle = (networkId: string) => {
    setSelectedNetworks(prev =>
      prev.includes(networkId)
        ? prev.filter(id => id !== networkId)
        : [...prev, networkId]
    );
  };

  const handleSaveDraft = () => {
    toast.success('Brouillon enregistré !');
  };

  const handlePublish = () => {
    if (!content.trim()) {
      toast.error('Le contenu ne peut pas être vide');
      return;
    }
    if (selectedNetworks.length === 0) {
      toast.error('Sélectionnez au moins un réseau social');
      return;
    }
    if (publishType === 'schedule' && !date) {
      toast.error('Sélectionnez une date de publication');
      return;
    }

    const message = publishType === 'now' 
      ? 'Publication en cours...' 
      : 'Publication planifiée !';
    
    toast.success(message);
    setTimeout(() => navigate('/publications'), 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nouvelle publication</h1>
          <p className="text-muted-foreground">
            Créez et planifiez votre publication sur plusieurs réseaux sociaux
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Contenu</CardTitle>
            <CardDescription>
              Rédigez le contenu de votre publication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                placeholder="Écrivez votre message ici..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {content.length} caractères
              </p>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label>Médias</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Cliquez pour ajouter des images ou vidéos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, MP4 jusqu'à 10MB
                </p>
              </div>
            </div>

            {/* Social Networks */}
            <div className="space-y-3">
              <Label>Réseaux sociaux</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {networks.map((network) => (
                  <div key={network.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={network.id}
                      checked={selectedNetworks.includes(network.id)}
                      onCheckedChange={() => handleNetworkToggle(network.id)}
                    />
                    <Label
                      htmlFor={network.id}
                      className="cursor-pointer font-normal"
                    >
                      {network.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish Type */}
            <div className="space-y-3">
              <Label>Type de publication</Label>
              <RadioGroup value={publishType} onValueChange={setPublishType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now" className="cursor-pointer font-normal">
                    Publier maintenant
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schedule" id="schedule" />
                  <Label htmlFor="schedule" className="cursor-pointer font-normal">
                    Planifier la publication
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Schedule Date & Time */}
            {publishType === 'schedule' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSaveDraft}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer le brouillon
              </Button>
              <Button
                className="flex-1"
                onClick={handlePublish}
              >
                <Send className="mr-2 h-4 w-4" />
                {publishType === 'now' ? 'Publier maintenant' : 'Planifier'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewPost;
