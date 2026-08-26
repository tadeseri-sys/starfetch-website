# Website change log — Starfetch Investment Limited

Every change to the public website, why it was made, and who approved it.

This exists because starfetchinvestltd.com.ng is the published material of an SEC-registered
fund and portfolio manager. A regulator, a compliance reviewer or an auditor asking "when did
that claim change, and on whose authority?" should be able to answer it from this file plus the
Git history behind it — not from anyone's memory.

**How to read it.** Newest first. Each entry records the date, what changed, the reason, who
approved it, and the version strings in force afterwards. The consent version is the identifier
stored with every form submission, so it establishes exactly what wording a subscriber agreed to.

---

## 24–26 August 2026 — Publishing restored, and a record of the 12–26 August publication gap

**Changed**

- `publish.sh` rewritten so that a push to GitHub is retried on every run whenever this Mac holds
  commits GitHub does not have — previously the script exited early whenever the folder had no new
  edits, so a push that had already failed was never attempted again.
- The script now writes a proof-of-life timestamp to `.publish_heartbeat` on every run, so it can be
  established at any time whether the scheduler is still running at all.
- On failure the script now raises a visible alert — a file named `00 - WEBSITE DID NOT PUBLISH -
  READ ME.txt` at the top of the website folder, plus a Mac notification — and removes it
  automatically once publishing succeeds.
- `GIT_TERMINAL_PROMPT=0` set, so a credential problem fails immediately and visibly instead of
  leaving the job waiting for a password that no one can type.
- No change to any published page, policy or figure. Consent, privacy and complaints versions are
  unaffected by this entry.

**Publication record — this is the part a reviewer should read.** The two entries dated 12 August
2026 below were written and committed on 12 August 2026 but **did not reach the live site until 26
August 2026.** The automated push to GitHub failed that afternoon with a credential error, and
because the script did not retry, the failure ran unnoticed for twelve days. Restoring the push then
took a further two days, because the credential could not be re-entered on the Mac's terminal; the
backlog was finally pushed through GitHub Desktop on the morning of 26 August 2026.

Between 12 and 26 August 2026 the live site therefore continued to display:

- **USD/NGN ₦1,360.14, marked "as at 10 Aug 2026"**, in the home page rates strip — the very figure
  the 12 August entry retired, and by 26 August a sixteen-day-old hand-maintained exchange rate;
- the **duplicated policy-rate figures** on the home page; and
- **privacy policy v4**, consent version `2026-08-12.v4`.

**Any consent captured through a website form between 12 and 26 August 2026 is recorded against
`2026-08-12.v4`, and v4 is the wording that governs it.** Version v5 governs only from 26 August
2026, 10:20 West Africa Time, the deploy that followed the push. No figure published in that window was inaccurate at the date it carried; the exchange rate
was correct as at 10 August 2026 and was labelled as such throughout.

**Why.** Publishing depended on a single unattended push with no confirmation that it had happened
and no alarm when it had not. For the published material of an SEC-registered firm that is not an
acceptable arrangement: the failure mode was silent, and the thing left on display was the one item
that had been judged unsafe to leave on display. The heartbeat, the retry and the visible alert
exist so that the next failure is noticed within minutes rather than weeks, and so that the
question "was this actually live?" can be answered from the record.

**Note on this entry.** It was drafted on 24 August 2026, when the script was repaired, and states
the dates it then expected. Publication did not in fact occur until 26 August 2026, and every date in
the entry was corrected to the actual one on that day. The correction is recorded here rather than
made silently, because an audit record that quietly adjusts its own dates is worth less than one that
shows where it was wrong.

**Approved by** Toluwani Adeseri, Director — Investment Strategy & Finance, who identified that the
live site did not match the approved version.

---

## 12 August 2026 — Home page de-duplicated: equity ticker returns to the header band

**Changed**

- The self-hosted rates strip was removed from the top of the home page and the TradingView equity
  ticker returned to that position.
- The duplicate equity block in the Market pulse section was removed.
- The disclosure line — prices supplied by TradingView, may be delayed, information only, not an
  offer, recommendation or indication of any Starfetch product's performance — now sits beneath the
  ticker band.
- Privacy policy updated to **v5** to place the third-party equity ticker at the top of the page
  rather than in Market pulse, and to state that these third-party features appear on the home page
  only. Consent version `2026-08-12.v5`.

**Why.** The rates strip and the Market pulse cards were showing the same three figures — Monetary
Policy Rate, headline inflation and Cash Reserve Ratio — on the same page. Each kind of content now
appears exactly once, in the position that suits its shape: equity prices scroll in the header band
because short numbers read well there and they change continuously; policy figures sit as cards
with their notes, sources and as-of dates; headlines run as a marquee below them.

**Approved by** Toluwani Adeseri, Director — Investment Strategy & Finance, who identified the
duplication.

---

## 12 August 2026 — USD/NGN removed from the rates strip

**Changed**

- USD/NGN retired from the home page rates strip. The strip now carries the Monetary Policy Rate,
  headline inflation and the Cash Reserve Ratio, with treasury bill stop rates and the FGN 10-year
  yield held unpublished pending verified figures.
- A rule recorded in `assets/data/macro.json`: only figures that change on a known, infrequent
  schedule belong in the strip. Anything that moves daily belongs in the live market data block,
  which updates itself.
- The strip now repeats its contents enough times to fill the screen, so a short list cannot leave
  a visible gap on a wide display.

**Why.** The rates strip is maintained by hand and verified against the official source before
publication. The exchange rate moves daily, so a hand-maintained figure would always have been
displaying a stale number — the one figure a visitor is most likely to know is out of date, on a
site whose positioning is honest numbers. The remaining figures change on published schedules:
policy rates when the MPC moves them, inflation monthly with the NBS release, auction rates at each
auction. Each carries its source and as-of date.

**Approved by** Toluwani Adeseri, Director — Investment Strategy & Finance.

---

## 12 August 2026 — Nigerian equity prices restored alongside the rates strip

**Changed**

- Restored the TradingView ticker-tape widget showing Nigerian equity prices, placed in the
  Market pulse section rather than the page header.
- Added a disclosure line beneath it: prices supplied by TradingView, may be delayed, shown for
  information only, not an offer, recommendation or indication of any Starfetch product's
  performance.
- Privacy policy updated to **v4** to disclose both third-party loads on the home page, including
  that the TradingView widget may set analytics and advertising cookies under TradingView's own
  policy rather than ours.
- Consent version bumped to `2026-08-12.v4` on all ten pages.

**Why.** Management wanted equity prices available to visitors as well as policy rates. NGX
requires a Market Data Agreement for anyone redistributing its data, so we cannot serve NGX prices
from our own systems without a licence; TradingView is a licensed redistributor, which is what makes
the widget permissible. The trade-off is that the widget loads from TradingView's servers and sets
their cookies — disclosed rather than hidden.

**Approved by** Toluwani Adeseri, Director — Investment Strategy & Finance.

---

## 12 August 2026 — Self-hosted Nigerian rates strip replaces the third-party price ticker

**Changed**

- Removed the TradingView ticker from the page header.
- Added a rates strip served entirely from our own systems, rendered from
  `assets/data/macro.json`: USD/NGN, Monetary Policy Rate, headline inflation and Cash Reserve
  Ratio, each displayed with its source and as-of date.
- Every ticker item carries a `publish` flag; nothing renders unless it is both published and has
  a value, so an unverified figure cannot reach the site by accident.
- Privacy policy updated to **v3**; consent version `2026-08-12.v3`.

**Why.** A verification of the home page's third-party embeds found that TradingView's widget sets
cookies including analytics and advertising categories, which contradicted the privacy policy's
statement that the site used no advertising or tracking cookies. Rates were also judged more
relevant than equity prices to a fixed-income-first manager.

**Note on method.** The rates are curated and verified against the official source before
publication, not scraped. A scraper silently publishing an incorrect rate on a regulated firm's
website would be a compliance incident, not a technical fault.

**Approved by** Toluwani Adeseri.

---

## 12 August 2026 — Deployment moved to version control

**Changed**

- The website folder became a Git repository, pushed to a private GitHub repository, connected to
  Netlify for continuous deployment.
- Added `netlify.toml` with security headers (HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy), plus `robots.txt`,
  `sitemap.xml` and `.gitignore`.
- Added an automatic publish job so that approved changes reach the live site without manual steps.

**Why.** Drag-and-drop deployment left no record of what changed, when, or on whose authority, and
concentrated the site on a single machine. The SEC technology audit expects a demonstrable change
trail. The security headers form part of the ISO 27001 / NIST CSF-aligned control checklist
committed to in §5 of the Technology Plan.

**Approved by** Toluwani Adeseri.

---

## 11 August 2026 — Gate 1 compliance remediation (site v5)

Remediation of items identified in the Gate 1 Compliance Review Pack, ahead of external compliance
counsel review. Items marked HIGH in that pack were corrected without waiting for counsel.

**Changed**

- **Complaints policy published** at `/complaints.html`, linked from the footer of every page.
  Content follows the SEC Rules on the Complaints Management Framework of the Nigerian Capital
  Market: acknowledgement within two working days electronically and five by post, resolution
  within ten working days, notification to the Commission within two working days where a complaint
  is not resolved in time, an electronic complaints register, and the escalation route to the
  Commission and the Investments and Securities Tribunal.
- **Consent unbundled on all three planning tools.** Previously one checkbox made delivery of the
  user's own results conditional on accepting marketing. Now two: a required consent to receive the
  results, and a separate optional consent to the market digest, stating explicitly that leaving it
  unticked does not affect receiving the results. Consent under the Nigeria Data Protection Act
  must be specific and freely given.
- **Newsletter consent narrowed** to the market digest alone, rather than covering both the
  newsletter and unspecified product marketing.
- **"Weekly digest — once a week" changed to "Market digest — sent periodically"**, because no
  issue had yet been sent and the cadence was not being met.
- **Product names aligned to the SEC filing** — Starfetch Fixed Note, Starfetch Discretionary
  Portfolios, Starfetch Execution Mandate — across the home page cards, the services page and the
  contact form's enquiry list. The same correction was applied to the Fixed Note flyer (A4 and A3),
  the roller banner and the investor pack.
- **Privacy policy corrected** on third-party cookies, and the version block moved to the foot of
  the page with an owner and review date.
- **Legal pages re-laid out** to a single column so the heading, introduction and body share one
  left edge.
- **Consent version bumped** from `2026-07-14.v1` to `2026-08-11.v2` across all ten pages.

**Why.** The site had been live since July without compliance sign-off. A self-audit against SEC
conduct and advertising requirements and the NDPA identified sixteen reviewable items. The above
were the ones judged unsafe to leave live pending counsel.

**Still open at the time of this entry:** custody wording remained in the present tense on the
strength of an imminent custodian appointment; the Thank You page's description of double opt-in
remained ahead of the implementation; the Managing Director named in SEC records was confirmed
unchanged.

**Approved by** Toluwani Adeseri, on the record in the project working session of 11 August 2026.

---

## 14 July 2026 — Initial publication (site v4)

Ten pages: Home, About, Services, Contact, Privacy, a tools hub and three planning tools (Budget
Planner, Portfolio Allocation Tool, Returns Calculator), plus a post-submission confirmation page.
NDPR-compliant consent capture with recorded consent versions, market ticker, macro indicators and
a contact widget. Content restricted to verified regulated facts — RC number, SEC registration,
registered address and official email. No performance figures, no named team, no testimonials.

Consent version `2026-07-14.v1`. Privacy policy `2026-07-14.v1`.

---

## Version reference

| Date | Consent version | Privacy policy | Complaints policy |
|---|---|---|---|
| 12 Aug 2026 | `2026-08-12.v5` | `2026-08-12.v5` | `2026-08-11.v1` | *(approved 12 Aug 2026; live from 26 Aug 2026 — see the entry for 24–26 August)*
| 12 Aug 2026 | `2026-08-12.v4` | `2026-08-12.v4` | `2026-08-11.v1` | *(live 12–26 Aug 2026)*
| 12 Aug 2026 | `2026-08-12.v3` | `2026-08-12.v3` | `2026-08-11.v1` |
| 11 Aug 2026 | `2026-08-11.v2` | `2026-08-11.v2` | `2026-08-11.v1` |
| 14 Jul 2026 | `2026-07-14.v1` | `2026-07-14.v1` | — |

**Dates in the left-hand column are approval dates.** Where a version reached the live site
later than it was approved, the delay is stated beside the row and explained in the entry for
the date it went live. The consent version stored with a form submission is the version that
was live at the moment of submission, not the version approved on that date.

Superseded policy versions are retained in the Git history of this repository and can be produced
in full on request.
