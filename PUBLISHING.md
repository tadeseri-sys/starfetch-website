# How the site publishes itself

Set up 12 August 2026. The intention is that you never open a terminal to update the website.

---

## How it works

1. You confirm a change in conversation.
2. Claude writes the updated files straight into this folder and updates any version strings that need to change (consent version, privacy policy version).
3. A small background job on your Mac notices the folder has changed, commits it to Git and pushes to GitHub.
4. Netlify sees the push and redeploys the site, usually within a minute.

**Our conversation is the approval gate.** Nothing is written into this folder until you have said yes, so nothing gets published that you have not agreed to. The automation only moves what is already approved.

---

## One-time setup

Paste this into Terminal once. It creates the scheduled job and starts it. You will not need to do it again.

```bash
mkdir -p ~/Library/LaunchAgents && cat > ~/Library/LaunchAgents/com.starfetch.website-publish.plist <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.starfetch.website-publish</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>/Users/tadeseri/Library/CloudStorage/OneDrive-Personal/HP Envy Laptop/HP Envy - Documents/NEXA AM/STARFETCH INV LTD/05_Tech_and_AI/Website/publish.sh</string>
  </array>
  <key>StartInterval</key>
  <integer>300</integer>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>
PLIST
chmod +x "/Users/tadeseri/Library/CloudStorage/OneDrive-Personal/HP Envy Laptop/HP Envy - Documents/NEXA AM/STARFETCH INV LTD/05_Tech_and_AI/Website/publish.sh"
launchctl unload ~/Library/LaunchAgents/com.starfetch.website-publish.plist 2>/dev/null
launchctl load ~/Library/LaunchAgents/com.starfetch.website-publish.plist
echo "Auto-publish is running. It checks every 5 minutes."
```

It runs every five minutes, and only does anything when something has actually changed.

---

## Checking it worked

Open `.publish.log` in this folder. Every publish writes a line. `PUBLISHED` means it went out; `PUSH FAILED` means it committed locally but could not reach GitHub, which is nearly always a credential problem.

Claude can read that log directly, so you can simply ask "did the last change publish?" rather than checking yourself.

---

## Stopping it

Create an empty file called `PAUSE_PUBLISH` in this folder and nothing will publish until you delete it. Ask Claude to create or remove it — no terminal needed.

To remove the job entirely:

```bash
launchctl unload ~/Library/LaunchAgents/com.starfetch.website-publish.plist
rm ~/Library/LaunchAgents/com.starfetch.website-publish.plist
```

---

## What this does not do

It does not review anything. It publishes whatever is in the folder. That is safe precisely because the approval happens in conversation before anything is written — but it does mean this folder should not be used as a scratch space for half-finished drafts. Draft elsewhere; put finished files here.

## Written reasons

Every change carries a documented reason. Two places record it:

**`CHANGELOG.md`** in this folder is the readable record — what changed, why, who approved it, and
the consent and privacy policy versions in force afterwards, newest first. This is the file to hand
a compliance reviewer or auditor. It is kept in the repository but is **not** served publicly; the
site returns a 404 for it.

**`COMMIT_MSG.txt`** is the mechanism. When Claude makes a change, it writes the reason into that
file alongside the changed files. The publish job uses its contents as the commit message, then
deletes it. So the reason travels into the Git history with the change rather than a bare
timestamp, and the two records — the changelog and the commit — say the same thing.

You do not need to touch either file. Approve the change in conversation and both are written for
you. If you want particular wording in the record — a reason, a reference to a board or committee
decision, the name of whoever authorised it — say so when you approve, and it goes in verbatim.
