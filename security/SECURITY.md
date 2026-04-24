# 🔐 Security Documentation
### Somala Ajay Portfolio — ajaysomala.github.io

> This document outlines all security measures implemented in this portfolio.
> Maintained by: **Somala Ajay** | Last updated: 2026

---

## 📋 Security Layers Overview

```
┌─────────────────────────────────────────────┐
│           SECURITY ARCHITECTURE              │
├─────────────────────────────────────────────┤
│  Layer 1 │ Content Security Policy (CSP)    │
│  Layer 2 │ HTTP Security Headers (meta)     │
│  Layer 3 │ Input Sanitization               │
│  Layer 4 │ External Link Protection         │
│  Layer 5 │ Form Spam Prevention             │
│  Layer 6 │ Subresource Integrity (SRI)      │
└─────────────────────────────────────────────┘
```

---

## 1. Content Security Policy (CSP)

**File:** `index.html` — `<meta http-equiv="Content-Security-Policy">`

Controls exactly which resources the browser is allowed to load.

| Directive        | Value                                      | Purpose                          |
|------------------|--------------------------------------------|----------------------------------|
| `default-src`    | `'self'`                                   | Only load from same origin       |
| `script-src`     | `'self' cdn.jsdelivr.net`                  | Scripts from self + EmailJS CDN  |
| `style-src`      | `'self' fonts.googleapis.com`              | Styles from self + Google Fonts  |
| `font-src`       | `'self' fonts.gstatic.com`                 | Fonts from Google CDN only       |
| `img-src`        | `'self' data: https:`                      | Images from self + HTTPS sources |
| `connect-src`    | `'self' api.emailjs.com api.github.com`    | API calls whitelist              |
| `frame-ancestors`| `'none'`                                   | Prevent clickjacking via iframes |
| `object-src`     | `'none'`                                   | Block Flash/plugins              |
| `base-uri`       | `'self'`                                   | Prevent base tag hijacking       |
| `upgrade-insecure-requests` | (present)                     | Force HTTPS for all resources    |

---

## 2. HTTP Security Headers

Set via `<meta>` tags (GitHub Pages limitation — no server headers):

| Header                      | Value                          | Protects Against              |
|-----------------------------|--------------------------------|-------------------------------|
| `X-Content-Type-Options`    | `nosniff`                      | MIME-type sniffing attacks    |
| `X-Frame-Options`           | `DENY`                         | Clickjacking                  |
| `Referrer-Policy`           | `strict-origin-when-cross-origin` | Referrer leakage           |
| `Permissions-Policy`        | camera/mic/geolocation off     | Browser API abuse             |

> ⚠️ **GitHub Pages Note:** Full HTTP response headers (HSTS, etc.) cannot be set
> on GitHub Pages. These meta equivalents provide the maximum protection available
> for static GitHub Pages hosting.

---

## 3. Input Sanitization

**File:** `assets/js/security.js`

All user inputs (contact form) are sanitized before use:
- HTML special characters escaped (`<`, `>`, `"`, `'`, `&`)
- Email format validated via regex
- Max length enforced on all fields
- No `innerHTML` used with user data — only `textContent`

---

## 4. External Link Protection

All external links (`target="_blank"`) include:
```html
rel="noopener noreferrer"
```
- `noopener` — prevents new tab from accessing `window.opener`
- `noreferrer` — prevents referrer header from being sent

---

## 5. Form Spam Prevention

**File:** `assets/js/security.js`

- Rate limiting: max 3 submissions per 10 minutes
- Honeypot field (hidden, bots fill it, humans don't)
- Client-side validation before any API call
- EmailJS used server-side — no credentials exposed client-side

---

## 6. Subresource Integrity (SRI)

External CDN scripts are loaded with integrity hashes where possible,
ensuring the files haven't been tampered with.

---

## 🛡️ Threat Model

| Threat                | Mitigated? | Method                          |
|-----------------------|------------|---------------------------------|
| XSS                   | ✅ Yes     | CSP + input sanitization        |
| Clickjacking          | ✅ Yes     | frame-ancestors: none           |
| MIME sniffing         | ✅ Yes     | X-Content-Type-Options          |
| Open redirect         | ✅ Yes     | No user-controlled redirects    |
| Form spam             | ✅ Yes     | Rate limit + honeypot           |
| Reverse tabnapping    | ✅ Yes     | rel="noopener noreferrer"       |
| Mixed content         | ✅ Yes     | upgrade-insecure-requests       |
| Base tag hijacking    | ✅ Yes     | base-uri 'self'                 |
| CSRF                  | ✅ N/A     | No server-side state/cookies    |
| SQL Injection         | ✅ N/A     | Static site — no database       |

---

## 📁 Security Files

```
security/
├── SECURITY.md        ← This file (documentation)
├── csp-policy.txt     ← Full CSP policy reference
└── checklist.md       ← Security checklist
```

---

## 🔍 How to Verify

Test the portfolio security score at:
- **securityheaders.com** → Enter `ajaysomala.github.io`
- **observatory.mozilla.org** → Free Mozilla security scan

---

*Security is an ongoing process. Review and update this document with each major change.*
