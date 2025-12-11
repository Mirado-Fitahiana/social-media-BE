import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import axios from '@/lib/axios';
import { URL_UPDATE_PROFILE, URL_CHANGE_PASSWORD, URL_DELETE_ACCOUNT } from '@/constante';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Utilisateur non connecté');
      return;
    }

    setLoadingProfile(true);

    try {
      const response = await axios.put(URL_UPDATE_PROFILE(user.id), {
        name,
        email
      });

      // Mettre à jour l'utilisateur dans le contexte
      if (response.data.user) {
        updateUser(response.data.user);
        toast.success('Profil mis à jour avec succès !');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      toast.error(errorMessage);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('Utilisateur non connecté');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoadingPassword(true);

    try {
      await axios.put(URL_CHANGE_PASSWORD(user.id), {
        currentPassword,
        newPassword
      });

      toast.success('Mot de passe modifié avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(errorMessage);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );

    if (!confirmed) return;

    setLoadingDelete(true);

    try {
      await axios.delete(URL_DELETE_ACCOUNT(user.id));
      
      toast.success('Compte supprimé avec succès');
      logout();
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression du compte';
      toast.error(errorMessage);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon compte</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Profile Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  disabled={loadingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  disabled={loadingProfile}
                />
              </div>
              <Button type="submit" disabled={loadingProfile}>
                {loadingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Changer le mot de passe</CardTitle>
            <CardDescription>
              Assurez-vous d'utiliser un mot de passe fort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={loadingPassword}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loadingPassword}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  disabled={loadingPassword}
                />
              </div>
              <Button type="submit" disabled={loadingPassword}>
                {loadingPassword ? 'Modification...' : 'Changer le mot de passe'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="shadow-card border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
            <CardDescription>
              Actions irréversibles sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={loadingDelete}
            >
              {loadingDelete ? 'Suppression...' : 'Supprimer mon compte'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Account;
