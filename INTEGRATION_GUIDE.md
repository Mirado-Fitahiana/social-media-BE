# Guide de Test - Intégration Login & Register

## 🎯 Modifications effectuées

### Backend (.NET)

1. **CORS configuré** (`Program.cs`)
   - Autorise les requêtes depuis `http://localhost:5173` et `http://localhost:3000`
   - Active CORS dans le pipeline

2. **AuthController.cs**
   - Login et Register retournent maintenant un `token` (temporaire en Base64)
   - Format de réponse standardisé avec `{ message, user, token }`

3. **LoginDto.cs**
   - Accepte username ou email dans le champ `Username`

### Frontend (React + Vite)

1. **Configuration**
   - `.env.local` créé avec `VITE_BASE_URL=http://localhost:5098/api`

2. **AuthContext.tsx**
   - Interface `User` mise à jour pour correspondre au backend
   - `login()` envoie `username` au lieu de `email`
   - `register()` prend maintenant 4 paramètres : `username, name, email, password`

3. **Register.tsx**
   - Ajout du champ "Nom d'utilisateur"
   - Validation complète (min 3 caractères pour username, 6 pour password)
   - Gestion d'erreur améliorée

4. **Login.tsx**
   - Déjà correctement configuré avec validation

## 🚀 Comment tester

### 1. Démarrer le Backend

```powershell
cd d:\GitHub\social-media-BE\social-media-BE
dotnet run
```

Le backend démarre sur `http://localhost:5098`

### 2. Démarrer le Frontend

```powershell
cd d:\GitHub\social-media-BE\social-sync-studio
npm install  # Si pas déjà fait
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

### 3. Test d'inscription

1. Aller sur `http://localhost:5173/register`
2. Remplir le formulaire :
   - Nom d'utilisateur : `testuser` (min 3 caractères)
   - Nom complet : `Test User`
   - Email : `test@example.com`
   - Mot de passe : `password123` (min 6 caractères)
   - Confirmer le mot de passe : `password123`
3. Cliquer sur "Créer mon compte"
4. Vous devriez être redirigé vers `/dashboard`

### 4. Test de connexion

1. Se déconnecter si connecté
2. Aller sur `http://localhost:5173/login`
3. Se connecter avec :
   - Email : `test@example.com` (ou username : `testuser`)
   - Mot de passe : `password123`
4. Cliquer sur "Se connecter"
5. Vous devriez être redirigé vers `/dashboard`

## 🔍 Vérifications

### Dans le navigateur (F12)

1. **Console** : Vérifier qu'il n'y a pas d'erreurs CORS
2. **Network** :
   - Requête POST vers `http://localhost:5098/api/auth/login`
   - Requête POST vers `http://localhost:5098/api/auth/register`
   - Status 200 pour login, 201 pour register
3. **Application > Local Storage** :
   - `token` : doit être présent après login/register
   - `user` : objet JSON avec les infos utilisateur

### Dans le terminal backend

- Logs des requêtes entrantes
- Pas d'erreurs 500

## ⚠️ Points importants

1. **Base de données** : Assurez-vous que SQL Server est démarré et que la BD existe
2. **CORS** : Le backend autorise uniquement localhost:5173 et localhost:3000
3. **Token** : Actuellement un token simple en Base64, à remplacer par JWT en production
4. **Validation** :
   - Username : 3-50 caractères
   - Password : 6+ caractères
   - Email : format valide

## 🎯 Prochaines étapes (recommandées)

1. ✅ Implémenter JWT au lieu du token Base64
2. ✅ Ajouter un refresh token
3. ✅ Protéger les routes avec authentification
4. ✅ Ajouter "Se souvenir de moi"
5. ✅ Implémenter "Mot de passe oublié"
