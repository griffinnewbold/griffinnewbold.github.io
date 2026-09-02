#!/bin/sh
set -eu

root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
fixture=$(mktemp -d)
output=$(mktemp)
trap 'rm -rf "$fixture"; rm -f "$output"' EXIT HUP INT TERM

mkdir -p "$fixture/pages/nested" "$fixture/pages/directory"
: > "$fixture/root.txt"
: > "$fixture/pages/nested/asset name.png"
: > "$fixture/pages/directory/index.html"

printf '%s\n' \
  '<a href="../../root.txt?download=1#top">root file</a>' \
  '<img src="./asset%20name.png">' \
  '<a href="../directory/">directory index</a>' \
  '<a href="../missing%20asset.png?download=1#top">missing relative</a>' \
  '<a href="/root-missing.html">missing root</a>' \
  '<a href="../../../../etc/passwd">must not escape root</a>' \
  '<a href="#section">fragment</a>' \
  '<a href="mailto:test@example.com">email</a>' \
  '<a href="tel:+15555550100">phone</a>' \
  '<a href="https://example.com/path">https</a>' \
  '<a href="//cdn.example.com/file.js">protocol relative</a>' \
  '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">' \
  '<a href="javascript:void(0)">script</a>' \
  > "$fixture/pages/nested/source.html"

if LINK_CHECK_ROOT="$fixture" sh "$root/tests/link_check.sh" > "$output" 2>&1; then
  echo "expected link checker to reject missing and escaping targets" >&2
  exit 1
fi

test "$(grep -c 'Missing target:' "$output")" = "3"
grep -F 'pages/nested/source.html' "$output" | grep -F 'pages/missing asset.png' >/dev/null
grep -F 'pages/nested/source.html' "$output" | grep -F 'root-missing.html' >/dev/null
grep -F 'pages/nested/source.html' "$output" | grep -F '../../../../etc/passwd' >/dev/null
! grep -F 'asset name.png' "$output" | grep -v 'missing asset.png' >/dev/null
! grep -E 'example\.com|mailto:|tel:|data:|javascript:' "$output" >/dev/null

echo "link checker behavior passed"
