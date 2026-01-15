# Script pour démarrer le backend et le frontend ensemble

Write-Host "🚀 Démarrage de l'application Social Media..." -ForegroundColor Cyan

# Démarrer le backend en arrière-plan
Write-Host "`n📡 Démarrage du backend .NET..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\GitHub\social-media-BE\social-media-BE'; Write-Host '=== BACKEND .NET API ===' -ForegroundColor Green; dotnet run"

# Attendre un peu que le backend démarre
Start-Sleep -Seconds 3

# Démarrer le frontend en arrière-plan
Write-Host "`n🎨 Démarrage du frontend React..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\GitHub\social-media-BE\social-sync-studio'; Write-Host '=== FRONTEND REACT ===' -ForegroundColor Blue; npm run dev"

Write-Host "`n✅ Les deux applications sont en cours de démarrage..." -ForegroundColor Green
Write-Host "`n📋 Informations:" -ForegroundColor Cyan
Write-Host "   Backend API:  http://localhost:5098" -ForegroundColor White
Write-Host "   Frontend:     http://localhost:5173" -ForegroundColor White
Write-Host "`n💡 Deux fenêtres PowerShell se sont ouvertes pour chaque application." -ForegroundColor Yellow
Write-Host "   Fermez-les pour arrêter les applications.`n" -ForegroundColor Yellow
