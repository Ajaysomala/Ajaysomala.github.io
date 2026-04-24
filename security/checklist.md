# ✅ Security Checklist
### Somala Ajay Portfolio

Run this checklist before every major deployment.

## Pre-Deploy Checks

### Headers & CSP
- [ ] CSP meta tag is first in `<head>` before any content
- [ ] All external domains are whitelisted in CSP
- [ ] No new CDN sources added without updating CSP
- [ ] `frame-ancestors 'none'` still present
- [ ] `X-Content-Type-Options: nosniff` present
- [ ] `Referrer-Policy` set to strict

### External Links
- [ ] All `target="_blank"` links have `rel="noopener noreferrer"`
- [ ] No user-controlled redirect URLs

### Forms
- [ ] Contact form validates all fields client-side
- [ ] Honeypot field still hidden (display:none, not visibility:hidden)
- [ ] Rate limiting active (max 3 per 10 min)
- [ ] EmailJS public key not hardcoded as secret (public key is safe)

### JavaScript
- [ ] No `eval()` usage
- [ ] No `innerHTML` with user data
- [ ] All user text uses `textContent`
- [ ] No sensitive data in `console.log`

### Dependencies
- [ ] EmailJS CDN URL still valid and on HTTPS
- [ ] Google Fonts still on HTTPS
- [ ] No new npm packages added (static site)

## Post-Deploy Checks
- [ ] Run scan at securityheaders.com
- [ ] Run scan at observatory.mozilla.org
- [ ] Test contact form works end-to-end
- [ ] Test on mobile (no console errors)
- [ ] Check all external links open correctly

---
*Last reviewed: 2026*
