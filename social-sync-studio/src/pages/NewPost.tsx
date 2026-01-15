import React, { useState, useEffect } from 'react';
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
import { CalendarIcon, Upload, Save, Send, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { socialMediaApi, postApi, SocialMedia } from '@/lib/api';
import { BASE_URL } from '@/constante';

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishType, setPublishType] = useState('now');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('12:00');
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);
  const [networks, setNetworks] = useState<SocialMedia[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingNetworks, setLoadingNetworks] = useState(true);

  // Charger les réseaux sociaux au montage
  useEffect(() => {
    const loadSocialMedia = async () => {
      try {
        setLoadingNetworks(true);
        const data = await socialMediaApi.getAll();
        setNetworks(data);
      } catch (error) {
        toast.error('Erreur lors du chargement des réseaux sociaux');
        console.error(error);
      } finally {
        setLoadingNetworks(false);
      }
    };

    loadSocialMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Vérifier la taille (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 10MB)');
        return;
      }

      // Vérifier le type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/webm'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Type de fichier non autorisé');
        return;
      }

      setFile(selectedFile);
      
      // Créer la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleNetworkToggle = (network: SocialMedia) => {
    setSelectedNetwork(network.id);
  };

  const handleSaveDraft = () => {
    toast.success('Brouillon enregistré !');
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Le titre ne peut pas être vide');
      return;
    }
    if (!content.trim()) {
      toast.error('Le contenu ne peut pas être vide');
      return;
    }
    if (selectedNetwork === null) {
      toast.error('Sélectionnez un réseau social');
      return;
    }
    if (publishType === 'schedule' && !date) {
      toast.error('Sélectionnez une date de publication');
      return;
    }

    try {
      setLoading(true);

      await postApi.create({
        socialMediaId: selectedNetwork,
        title: title,
        content: content,
        file: file || undefined
      });

      const message = publishType === 'now' 
        ? 'Publication créée avec succès !' 
        : 'Publication planifiée !';
      
      toast.success(message);
      setTimeout(() => navigate('/publications'), 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création du post';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
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
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Titre de votre publication..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

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
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {content.length} caractères
              </p>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label>Médias</Label>
              {!filePreview ? (
                <label className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour ajouter des images ou vidéos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF, WEBP, MP4, MOV, AVI, WMV, WEBM jusqu'à 10MB
                  </p>
                </label>
              ) : (
                <div className="relative border rounded-lg overflow-hidden">
                  {file?.type.startsWith('image/') ? (
                    <img src={filePreview} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
                  ) : (
                    <video src={filePreview} controls className="w-full h-auto max-h-64" />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeFile}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Social Networks */}
            <div className="space-y-3">
              <Label>Réseau social</Label>
              {loadingNetworks ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {networks.map((network) => (
                    <div key={network.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={network.id.toString()}
                        checked={selectedNetwork === network.id}
                        onCheckedChange={() => handleNetworkToggle(network)}
                        disabled={loading}
                      />
                      <Label
                        htmlFor={network.id.toString()}
                        className="cursor-pointer font-normal"
                      >
                        {network.platform}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
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
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer le brouillon
              </Button>
              <Button
                className="flex-1"
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {publishType === 'now' ? 'Publier maintenant' : 'Planifier'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewPost;
