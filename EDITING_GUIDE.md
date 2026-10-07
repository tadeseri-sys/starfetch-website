# Editing the Starfetch Website — Plain-English Guide

The site is plain HTML files — no CMS, no database. Any text editor works (Notepad on Windows, TextEdit on Mac, or better: the free **VS Code**). Edit → save → commit → push. Netlify watches the GitHub repository and rebuilds the site automatically on every push to `main`; you no longer drag anything anywhere. Every deploy is versioned, so mistakes can be rolled back in one click.

## Which file is which page

| File | Page |
|---|---|
| index.html | Homepage |
| about.html | About us |
| services.html | Services |
| contact.html | Contact |
| privacy.html | Privacy policy |
| tools/index.html | Tools landing |
| tools/budget.html / allocation.html / returns.html | The three tools |
| assets/css/style.css | Colours, fonts, spacing (site-wide) |
| assets/js/main.js | Menus, animations, news feed, macro counters |
| assets/data/macro.json | The three animated macro figures |

## Common edits

**Change any text:** open the page file, Ctrl+F for the sentence you see on the site, edit it between the `>` and `<` marks, save. Don't delete the angle-bracket tags themselves.

**Update the macro figures (inflation, MPR, CRR):** open `assets/data/macro.json`, change `value`, `asOf` and `note` as needed. Numbers only in `value` — no % sign.

**Change the ticker symbols:** in `index.html`, find `NSENG:DANGCEM` — the list of symbols is right there. Add or remove lines (keep the comma pattern). Symbol format is `NSENG:TICKER` for NGX stocks.

**Change the news source:** in `assets/js/main.js`, find `nairametrics.com` and replace the feed URL with any RSS feed (e.g. BusinessDay markets).

**Swap an image:** put the new image in `assets/img/`, then in the page file change the `src="assets/img/..."` to the new filename. Keep images under ~300KB for speed (use webp or compressed jpg).

**Hide a tool before launch:** in `tools/index.html`, delete that tool's `<div class="card">...</div>` block, and remove its card from the homepage tools section in `index.html`.

**Change colours:** top of `assets/css/style.css` — the `:root` block holds the brand colours.

## Rules that keep us compliant
- Never add performance promises or guaranteed-return language — all copy changes on products/returns go through the compliance reviewer.
- Don't remove the footer legal lines, risk disclaimer, or the consent checkboxes on forms.
- If you change what data a form collects, the privacy policy must be updated to match (and the consent_version bumped).

## Images (all local as of 20 Jul 2026)
All photos are served from `assets/img/` as compressed .webp files — no external image dependencies. To swap a photo: save the new image into `assets/img/` (webp or jpg, under ~300KB), then change the matching `src="assets/img/..."` in the page file. Photo credits: Unsplash (free licence).

## Publishing a change (as of 7 Oct 2026)
This folder is a git repository on branch `main`, connected to
`https://github.com/tadeseri-sys/starfetch-website.git`. Netlify builds from that
repository, so **pushing to `main` publishes the site.** Treat a push as going live.

```
cd ".../05_Tech_and_AI/Website"
git add <the files you changed>      # name them; avoid "git add ." so nothing unintended rides along
git commit -m "Short description of what changed"
git push origin main
```

Then watch app.netlify.com → your site → **Deploys** for the build to finish (~30 seconds).
If a change looks wrong once live, roll back to the previous deploy from that same page —
then fix it properly in the repo, because the next push will re-publish whatever is on `main`.

### Sharing a draft for team review
Don't push unreviewed work to `main` — it goes straight to the live site. Put it on a
branch instead:

```
git checkout -b my-change
git push origin my-change
```

Netlify's deploy-preview feature generates a separate unlisted URL per branch, which you can
share for review and then merge into `main` when approved. Worth confirming deploy previews
are switched on for this site (Netlify → Site configuration → Build & deploy) before relying
on it the first time.

The old `app.netlify.com/drop` drag-and-drop method is **no longer how this site is
deployed.** `DEPLOY_GUIDE.md` keeps it documented as a last-resort fallback only — if you
ever do use it, commit the same change to Git afterwards, or the repository and the live site
drift apart.

**`DEPLOY_GUIDE.md` is the authoritative document on deployment** (one-time setup, domain,
Netlify Forms, rollback, why the firm moved off drag-and-drop for audit reasons). This section
is only the short day-to-day version — if the two ever disagree, follow `DEPLOY_GUIDE.md`.

The custom domain is only connected when you are ready to go live.

### One quirk: this repo lives in OneDrive
Git occasionally fails here with `Resource deadlock avoided` or a bus error, because OneDrive
keeps some files as cloud-only placeholders. Opening the file once (so OneDrive downloads it)
usually clears it. These errors can also make `git status` report a file as modified when it
isn't — check with `git diff` before believing it.
