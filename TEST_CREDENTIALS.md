# 🔐 Identifiants de Test

## ✅ Utilisateur de démonstration créé

**Username:** `demo`  
**Email:** `demo@example.com`  
**Password:** `demo123456`

## 🧪 Comment tester

### Sur le Frontend (http://localhost:5173/login)

**Option 1 - Avec l'email :**
- Email: `demo@example.com`
- Password: `demo123456`

**Option 2 - Avec le username :**
- Email: `demo` (saisissez le username dans le champ email)
- Password: `demo123456`

⚠️ **IMPORTANT** : Pour que l'option 1 (email) fonctionne, vous DEVEZ redémarrer le backend avec le nouveau code :

```powershell
# Arrêtez le backend (Ctrl+C)
cd d:\GitHub\social-media-BE\social-media-BE
dotnet run
```

## ✅ Problème du reload RÉSOLU

**Cause** : L'intercepteur axios redirigeait vers `/login` même quand on était déjà sur cette page, causant un reload.

**Solution** : L'intercepteur vérifie maintenant si on est sur `/login` ou `/register` avant de rediriger.

```typescript
// Avant
case 401:
  window.location.href = '/login'; // ❌ Reload !

// Après
case 401:
  if (currentPath !== '/login' && currentPath !== '/register') {
    window.location.href = '/login'; // ✅ Seulement si nécessaire
  }
```

## 🎯 Résultat attendu

Quand vous entrez de mauvais identifiants :
- ❌ Toast rouge avec message d'erreur
- ✅ **PAS de reload de la page**
- ✅ Reste sur la page de login
- ✅ Le bouton redevient actif

## 🧪 Test Backend Direct

```powershell
# Test avec username
$body = '{"username":"demo","password":"demo123456"}'
Invoke-WebRequest -Uri "http://localhost:5098/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing

# Test avec email (nécessite backend redémarré)
$body = '{"username":"demo@example.com","password":"demo123456"}'
Invoke-WebRequest -Uri "http://localhost:5098/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing
```

## ⚠️ Note sur test123@example.com

L'utilisateur `test123@example.com` semble avoir été créé avec un mot de passe différent. Utilisez plutôt `demo@example.com` pour les tests.
