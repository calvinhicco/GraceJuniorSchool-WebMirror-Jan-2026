# Grace Junior School — Vercel environment variables
# Prereqs: npm i -g vercel  (or use npx vercel)
#          vercel login
#          cd to this repo and: vercel link   (select Grace Junior Vercel project)

$ErrorActionPreference = "Stop"

$vars = @{
  NEXT_PUBLIC_FIREBASE_API_KEY            = "AIzaSyBd20WWDh_uXn94JNUBbjenXJWmuVLf23U"
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        = "jan-2026-webmirror-a1.firebaseapp.com"
  NEXT_PUBLIC_FIREBASE_PROJECT_ID         = "jan-2026-webmirror-a1"
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET       = "jan-2026-webmirror-a1.firebasestorage.app"
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  = "1065081043628"
  NEXT_PUBLIC_FIREBASE_APP_ID               = "1:1065081043628:web:c688bc05d45bc78275fd09"
}

$environments = @("production", "preview", "development")

Write-Host "Setting Grace Junior Firebase env on linked Vercel project..." -ForegroundColor Cyan
Write-Host "Project ID must be: jan-2026-webmirror-a1" -ForegroundColor Yellow

foreach ($name in $vars.Keys) {
  foreach ($env in $environments) {
    Write-Host "  $name ($env)"
    $value = $vars[$name]
    vercel env add $name $env --value $vars[$name] --yes --force 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "    (run manually: vercel env add $name $env)" -ForegroundColor DarkYellow
    }
  }
}

Write-Host ""
Write-Host "Done. Redeploy: npx vercel --prod" -ForegroundColor Green
Write-Host "Confirm footer shows: Firestore: jan-2026-webmirror-a1" -ForegroundColor Green
