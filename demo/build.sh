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

# Tailwind skips git-ignored folders when it looks for class names, and the copied app
# folders are git-ignored, so the page would build with no styling. Point it at the real
# ../frontend folders instead (they are not ignored) and turn automatic detection off.
sed -i '0,/@import "tailwindcss";/s//@import "tailwindcss" source(none);\n@source "..\/..\/..\/..\/frontend\/app";\n@source "..\/..\/..\/..\/frontend\/components";\n@source "..\/..\/..\/..\/frontend\/context";/' "$spa/src/app/globals.css"

cd "$spa"
npm install --no-audit --no-fund --silent
npx vite build

# Guard: fail the build if the styling is missing (this once shipped an unstyled demo).
for cls in '.sticky{' '.rounded-xl{' '.grid{' '.flex{' 'html.dark'; do
  grep -qF -- "$cls" dist/index.html || { echo "ERROR: built CSS is missing $cls. The demo would be unstyled." >&2; exit 1; }
done
cp dist/index.html "$here/northshore-demo.html"
echo "Wrote $here/northshore-demo.html ($(wc -c < "$here/northshore-demo.html") bytes)"
