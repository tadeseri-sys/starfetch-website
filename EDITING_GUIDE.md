# Editing the Starfetch Website — Plain-English Guide

The site is plain HTML files — no CMS, no database. Any text editor works (Notepad on Windows, TextEdit on Mac, or better: the free **VS Code**). Edit → save → redeploy (drag the folder into Netlify again). Every deploy is versioned, so mistakes can be rolled back in one click.

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

## Sharing a draft for team review (no domain needed)
1. Go to https://app.netlify.com/drop (free account).
2. Drag the whole `Website` folder onto the page.
3. You get a random URL like `https://random-name-123.netlify.app` — share it with the team on WhatsApp/email. It is unlisted (not indexed by Google) and can be deleted anytime.
4. Each new drag creates a new deploy of the same site; the URL stays constant once you claim the site into your account.
The custom domain is only connected when you are ready to go live.

## Redeploying
1. Go to app.netlify.com → your site → **Deploys**.
2. Drag the whole `Website` folder onto the page.
3. Wait ~30 seconds; changes are live. Roll back from the same page if needed.
