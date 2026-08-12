# Deploying the Starfetch website

Updated 12 August 2026. Replaces the drag-and-drop-only guide.

---

## Why move off drag-and-drop

Drag-and-drop works, but it has three problems that matter for a regulated firm:

1. **No history.** If a deploy breaks something, there is nothing to roll back to except a folder on someone's laptop. Netlify keeps its own deploy history, but you cannot see *what changed* between two deploys.
2. **No audit trail.** The SEC technology audit expects to see who changed what, when, and who approved it. "I dragged a folder in" is not that. A Git history is.
3. **Key-person risk.** If the folder lives on one machine, one machine is the firm's website.

Connecting the site to a Git repository fixes all three and costs nothing. Every change becomes a commit with an author and a timestamp; every commit deploys automatically; every deploy can be rolled back with one click.

---

## Recommended: GitHub → Netlify continuous deployment

### One-time setup (about 20 minutes)

**1. Create the repository.** On github.com, create a **private** repository named `starfetch-website`. Private matters — the repo holds the site source, and there is no reason for it to be public.

**2. Push this folder to it.** The folder has already been initialised as a Git repository with an initial commit. From the Website folder:

```bash
git remote add origin https://github.com/<your-account>/starfetch-website.git
git branch -M main
git push -u origin main
```

GitHub will ask for credentials. Use a personal access token, not your password — GitHub no longer accepts passwords over HTTPS.

**3. Connect Netlify.** In Netlify: *Add new site → Import an existing project → GitHub →* select `starfetch-website`. Leave the build command empty and set the publish directory to `.` (the `netlify.toml` in this folder already declares this, so Netlify should fill it in itself).

**4. Move the domain.** If starfetchinvestltd.com.ng currently points at the drag-and-drop site, move the custom domain across to the new site in Netlify's domain settings, then delete the old site. HTTPS re-provisions automatically within a few minutes.

**5. Re-check the forms.** Netlify Forms are detected at deploy time. After the first deploy from Git, confirm in *Site configuration → Forms* that `newsletter`, `contact` and the message widget are all listed, and send one test submission through each.

### Day-to-day after that

Edit the files, then:

```bash
git add -A
git commit -m "Describe what changed and why"
git push
```

Netlify builds and publishes within a minute. That is the whole workflow.

To roll back: Netlify → *Deploys* → pick the last good deploy → *Publish deploy*. Instant.

---

## Middle option: Netlify CLI

If Git feels like too much for now, the CLI is still better than dragging folders — it deploys from the command line and keeps you in the habit of a repeatable command:

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

You still get no history of what changed, so treat this as a stepping stone rather than the destination.

---

## Fallback: drag-and-drop

Still works. Go to app.netlify.com, drag the **Website** folder onto the drop zone. Use this only if the other two are unavailable — and if you do, commit the change to Git afterwards so the history stays honest.

---

## What is in this folder for deployment

| File | Purpose |
|---|---|
| `netlify.toml` | Publish directory, security headers (HSTS, frame options, referrer and permissions policy), and cache rules. The security headers are on the SEC technology-audit control checklist. |
| `robots.txt` | Allows indexing and points crawlers at the sitemap. |
| `sitemap.xml` | Lists all ten public pages. Submit this URL in Google Search Console after the first deploy. |
| `.gitignore` | Keeps `.DS_Store`, temp files and local Netlify state out of the repository. |

---

## After the first Git deploy — do these three things

1. **Google Search Console.** Add the property, verify by DNS, submit `https://starfetchinvestltd.com.ng/sitemap.xml`. Outstanding since the July tracker.
2. **Check the security headers landed.** Load the site and inspect the response headers, or run it through an online header checker. All six should be present.
3. **Delete the old drag-and-drop site** in Netlify once the domain has moved, so there is no second copy of the site serving stale content at a `.netlify.app` address.

---

## Housekeeping noted while setting this up

There is a stray file `tmpjchmrdw5.js` in this folder — a leftover from an earlier build, not referenced by any page. It is excluded by `.gitignore`, but it should be removed from the folder. Nothing on the site depends on it.

`Website_v4_backup_2026-08-11` sits alongside this folder as the pre-remediation snapshot. Once v5 is deployed and confirmed working, that backup can go — Git history replaces it.
