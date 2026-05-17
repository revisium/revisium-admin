#!/bin/sh
set -eu

robots_path=/tmp/revisium-robots.txt
header_path=/tmp/revisium-robots-tag.conf

if [ -n "${REVISIUM_ROBOTS_TXT:-}" ]; then
  printf '%b' "$REVISIUM_ROBOTS_TXT" > "$robots_path"
  case "$REVISIUM_ROBOTS_TXT" in
    *'
') ;;
    *) printf '\n' >> "$robots_path" ;;
  esac
  : > "$header_path"
else
  printf 'User-agent: *\nDisallow: /\n' > "$robots_path"
  printf 'add_header X-Robots-Tag "noindex, nofollow, noarchive" always;\n' > "$header_path"
fi
