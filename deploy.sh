#!/usr/bin/env bash
# LUXORA deploy: safety check -> build -> commit -> push to GitHub.
# Vercel (connected to the GitHub repo, Root Directory = frontend) then publishes automatically.
# Usage:  bash deploy.sh "commit message"          (add --vercel as 2nd arg to also run the Vercel CLI)
set -euo pipefail
cd "$(dirname "$0")"
MSG="${1:-chore: update}"
REMOTE_URL="https://github.com/fatemerostami2021-hash/LUXORA.git"

echo "1/5  Checking that no secret files are tracked by Git..."
if git ls-files 2>/dev/null | grep -E '(^|/)\.env(\..*)?$' | grep -vE '\.env\.example$' | grep -q .; then
  echo "STOP: a .env file is tracked by Git. Run: git rm --cached <file>  and try again."; exit 1
fi

echo "2/5  Frontend: install (if needed), typecheck, production build..."
(
  cd frontend
  [ -d node_modules ] || npm install --no-audit --no-fund
  npm run typecheck
  npm run build
)

echo "3/5  Git branch and remote..."
git branch -M main
git remote get-url origin >/dev/null 2>&1 || git remote add origin "$REMOTE_URL"

echo "4/5  Commit..."
git add -A
if git diff --cached --quiet; then echo "Nothing new to commit."; else git commit -m "$MSG"; fi

echo "5/5  Push to GitHub..."
git push -u origin main

if [ "${2:-}" = "--vercel" ]; then
  echo "Vercel CLI deploy (needs 'npx vercel login' once)..."
  (cd frontend && npx vercel --prod)
else
  echo "Done. If the repo is connected in Vercel, the new version is being published now."
fi
