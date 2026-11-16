#!/usr/bin/env bash
# Builds demo/northshore-demo.html: the real Next.js app in ../frontend as ONE static file.
# Needs only Node and npm. Run from anywhere:  bash demo/build.sh
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
fe="$here/../frontend"
spa="$here/spa"

rm -rf "$spa/src/app" "$spa/src/components" "$spa/src/context" "$spa/src/lib" "$spa/public"
mkdir -p "$spa/src/app"
cp -r "$fe/app/." "$spa/src/app/"
rm -rf "$spa/src/app/api"            # server routes cannot run in a static file; the app falls back to handbook text
cp -r "$fe/components" "$spa/src/components"
cp -r "$fe/context" "$spa/src/context"
cp -r "$fe/lib" "$spa/src/lib"
[ -d "$fe/public" ] && cp -r "$fe/public" "$spa/public"
find "$spa/src" -name '*.test.ts' -delete

cd "$spa"
npm install --no-audit --no-fund --silent
npx vite build
cp dist/index.html "$here/northshore-demo.html"
echo "Wrote $here/northshore-demo.html ($(wc -c < "$here/northshore-demo.html") bytes)"
