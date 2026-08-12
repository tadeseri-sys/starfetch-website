#!/bin/bash
# Starfetch website auto-publish.
# Checks this folder for changes; if there are any, commits and pushes them,
# which makes Netlify redeploy the site. Run on a schedule by launchd.
#
# Commit message: if a file called COMMIT_MSG.txt exists in this folder, its
# contents are used as the commit message and the file is then removed. This is
# how a written reason gets attached to a change. If it is absent, the commit
# falls back to a timestamp.
#
# Kill switch: create a file called PAUSE_PUBLISH in this folder and nothing
# will be published until it is removed.
#
# Log: .publish.log in this folder. Check it if a change does not appear live.

cd "$(cd "$(dirname "$0")" && pwd)" || exit 1

LOG=".publish.log"
MSGFILE="COMMIT_MSG.txt"
stamp() { date '+%Y-%m-%d %H:%M:%S'; }

if [ -f "PAUSE_PUBLISH" ]; then
  exit 0
fi

# Nothing changed - stay quiet.
if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

{
  echo "--- $(stamp) changes detected ---"
  git status --porcelain
} >> "$LOG" 2>&1

git add -A >> "$LOG" 2>&1

if [ -s "$MSGFILE" ]; then
  COMMITTED=$(git commit -q -F "$MSGFILE" && echo yes || echo no)
  if [ "$COMMITTED" = "yes" ]; then
    echo "$(stamp) commit message taken from $MSGFILE" >> "$LOG"
    rm -f "$MSGFILE"
    # the message file itself must not linger in the working tree
    git add -A >> "$LOG" 2>&1
    git diff --cached --quiet || git commit -q -m "Remove used commit message file" >> "$LOG" 2>&1
  fi
else
  COMMITTED=$(git commit -q -m "Site update $(stamp)" && echo yes || echo no)
fi

if [ "$COMMITTED" != "yes" ]; then
  echo "$(stamp) COMMIT FAILED - see above" >> "$LOG"
  exit 1
fi

if git push -q origin main >> "$LOG" 2>&1; then
  echo "$(stamp) PUBLISHED - Netlify will redeploy within a minute" >> "$LOG"
else
  echo "$(stamp) PUSH FAILED - committed locally but not pushed. Usually a credential problem." >> "$LOG"
fi
