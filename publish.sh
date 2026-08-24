#!/bin/bash
# Starfetch website auto-publish.
#
# Runs every 5 minutes from cron. It does three things, in this order:
#
#   1. Records proof of life in .publish_heartbeat, on every run, whether or
#      not anything is published. If that file's timestamp is old, the
#      scheduler itself has stopped and nothing else here is running.
#   2. Commits any change in this folder.
#   3. Pushes to GitHub - which is what makes Netlify redeploy the site.
#
# Step 3 is deliberately independent of step 2. If a push failed in the past,
# the commit is sitting on this Mac and the live site is behind, so the push is
# retried on every run until it succeeds - even when nothing new has changed.
# (Before 24 Aug 2026 the script exited early on a clean folder, so a failed
# push was never retried and the site stayed 12 days out of date in silence.)
#
# Commit message: if a file called COMMIT_MSG.txt exists in this folder, its
# contents are used as the commit message and the file is then removed. This is
# how a written reason gets attached to a change. If it is absent, the commit
# falls back to a timestamp.
#
# Kill switch: create a file called PAUSE_PUBLISH in this folder and nothing
# will be published until it is removed.
#
# When a push fails: a file named
#   "00 - WEBSITE DID NOT PUBLISH - READ ME.txt"
# appears at the top of this folder and a Mac notification is shown. That file
# deletes itself as soon as a push succeeds. It is never published to the site.
#
# Log: .publish.log in this folder. Check it if a change does not appear live.

cd "$(cd "$(dirname "$0")" && pwd)" || exit 1

# Never let git stop and wait for a password: there is no keyboard inside cron.
# Without this a credential problem can hang the job instead of failing it.
export GIT_TERMINAL_PROMPT=0

LOG=".publish.log"
MSGFILE="COMMIT_MSG.txt"
ALERT="00 - WEBSITE DID NOT PUBLISH - READ ME.txt"
HEARTBEAT=".publish_heartbeat"
stamp() { date '+%Y-%m-%d %H:%M:%S'; }

# --- 1. proof of life -------------------------------------------------------
stamp > "$HEARTBEAT"

if [ -f "PAUSE_PUBLISH" ]; then
  exit 0
fi

raise_alert() {
  {
    echo "THE WEBSITE DID NOT PUBLISH"
    echo "==========================="
    echo
    echo "When:  $(stamp)"
    echo "Why:   $1"
    echo
    echo "Your changes are safe. They are committed on this Mac. They have just"
    echo "not reached GitHub, so starfetchinvestltd.com.ng is still showing the"
    echo "previous version of the site."
    echo
    echo "What to do"
    echo "----------"
    echo "Tell Claude: \"the website publish alert has appeared\", and paste the"
    echo "last 20 lines of .publish.log in this folder."
    echo
    echo "In the meantime the site is not broken - it is simply out of date."
    echo "Nothing in this folder needs to be edited or deleted, and this file"
    echo "will remove itself automatically once publishing succeeds."
  } > "$ALERT"
  /usr/bin/osascript -e 'display notification "The website did not publish - see the folder for details." with title "Starfetch website"' >/dev/null 2>&1
}

push_and_report() {
  if git push -q origin main >> "$LOG" 2>&1; then
    echo "$(stamp) PUBLISHED - Netlify will redeploy within a minute" >> "$LOG"
    rm -f "$ALERT"
    return 0
  fi
  echo "$(stamp) PUSH FAILED - committed locally but not pushed. Usually a credential problem." >> "$LOG"
  raise_alert "The push to GitHub failed. Usually a credential problem."
  return 1
}

# --- 2. commit anything new -------------------------------------------------
if [ -n "$(git status --porcelain)" ]; then
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
    raise_alert "The commit failed, so nothing could be published."
    exit 1
  fi
fi

# --- 3. push whatever is not yet on GitHub ----------------------------------
# Refresh our picture of GitHub first. If this fails (no network, bad
# credential) we fall through and let the push report the real error.
git fetch -q origin main >/dev/null 2>&1

AHEAD=$(git rev-list --count origin/main..main 2>/dev/null)
case "$AHEAD" in
  ''|*[!0-9]*) AHEAD=0 ;;
esac

if [ "$AHEAD" -gt 0 ]; then
  echo "--- $(stamp) $AHEAD commit(s) on this Mac are not on GitHub - pushing ---" >> "$LOG"
  push_and_report
  exit $?
fi

# Nothing outstanding: this Mac and GitHub agree. Clear any alert left over from
# an earlier failure - including one cleared by a push made from somewhere else,
# such as GitHub Desktop - then stay quiet. The heartbeat above proves the job ran.
if [ -f "$ALERT" ]; then
  echo "$(stamp) RESOLVED - this Mac and GitHub agree; clearing the alert" >> "$LOG"
  rm -f "$ALERT"
fi
exit 0
