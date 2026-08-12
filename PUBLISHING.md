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

## How it is scheduled

Installed 12 August 2026 using **cron**. The entry is:

```
*/5 * * * * /bin/bash ".../05_Tech_and_AI/Website/publish.sh"
```

To see it: `crontab -l`. To remove it: `crontab -e`, delete the line, save.

**Why cron and not launchd.** The launchd route (`launchctl bootstrap`) failed on this Mac with
"Input/output error" and asked for administrator rights, which a job this small does not warrant.
Cron does the same work, needs no elevated permission, and is easier to inspect. If a
`com.starfetch.website-publish.plist` file is still sitting in `~/Library/LaunchAgents`, delete it
so there is no chance of two schedulers publishing at once:

```bash
rm ~/Library/LaunchAgents/com.starfetch.website-publish.plist
```

**If scheduled runs never publish but a manual run does**, macOS is blocking cron from reading the
CloudStorage folder. Fix it in System Settings → Privacy & Security → Full Disk Access, adding
`/usr/sbin/cron`. Run the script manually any time to publish immediately:

```bash
bash ".../05_Tech_and_AI/Website/publish.sh"
```

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
