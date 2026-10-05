# Clearcost website

Static site — no build step. `index.html` + `styles.css` + `app.js`.

## Go live (GitHub → Vercel)
1. Create a new GitHub repo (e.g. `clearcost-site`) and upload these files to the root.
2. In Vercel: **Add New → Project → Import** the repo. Framework preset: **Other**. Leave build command and output directory empty. Deploy.
3. **Settings → Domains** → add `clearcost.eu` and `www.clearcost.eu`, then set the DNS records Vercel shows at your domain registrar (A record `76.76.21.21` for the apex, CNAME `cname.vercel-dns.com` for www).

Every push to `main` redeploys automatically.

## Before launch — replace the placeholders
Search the files for `XXXX`, `[X]`, `[00000000]`, `[NL000000000B01]`, `[Street`, `[Legal entity name]`:
- WhatsApp number: `https://wa.me/316XXXXXXXX` and `tel:+316XXXXXXXX` (6 places)
- Address, KvK, VAT, legal entity name (contact section + footer)
- `[X] orders a month` (backend section + FAQ)
- Booking: swap the `.booking` block in `#call` for your Calendly / Cal.com embed (comment in the HTML shows how). Until then the button opens a prefilled email.
- Legal pages: Terms / Privacy / Cookie links in the footer point to `#`.

## Notes
- Fonts load from Google Fonts (Space Grotesk, DM Sans, IBM Plex Mono).
- Clocks in the Team section are live (Asia/Shanghai and Europe/Amsterdam).
- Backend demo uses fictional data only.
