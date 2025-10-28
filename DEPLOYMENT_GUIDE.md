# Hephaitos Deployment Guide

## 🚀 Production Deployment

Complete guide for deploying Hephaitos to production.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] API backend deployed and accessible
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] OAuth credentials obtained (Toss, KFTC)
- [ ] PWA icons generated (192x192, 512x512)

### 2. Code Quality
- [ ] All tests passing
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] No TypeScript errors
- [ ] Dependencies updated

### 3. Configuration
- [ ] Production API URL set
- [ ] Analytics enabled (if using)
- [ ] Error tracking configured
- [ ] CDN configured (if using)

---

## 🌐 Vercel Deployment (Recommended)

### Mobile Service Deployment

#### 1. Install Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

#### 2. Login to Vercel
\`\`\`bash
vercel login
\`\`\`

#### 3. Deploy Mobile Service
\`\`\`bash
cd services/mobile
vercel --prod
\`\`\`

#### 4. Configure Environment Variables in Vercel Dashboard

Go to your project settings and add:

\`\`\`env
NEXT_PUBLIC_API_URL=https://api.hephaitos.app
NEXT_PUBLIC_TOSS_CLIENT_ID=your_toss_client_id
NEXT_PUBLIC_KFTC_CLIENT_ID=your_kftc_client_id
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_APP_NAME=Hephaitos
NEXT_PUBLIC_APP_VERSION=1.0.0
\`\`\`

#### 5. Configure Custom Domain

In Vercel dashboard:
1. Go to Project → Settings → Domains
2. Add your custom domain (e.g., `app.hephaitos.com`)
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

### Web Service Deployment

Similar process for web service:

\`\`\`bash
cd services/web
vercel --prod
\`\`\`

Environment variables:
\`\`\`env
NEXT_PUBLIC_API_URL=https://api.hephaitos.app
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_APP_NAME=Hephaitos
NEXT_PUBLIC_APP_VERSION=1.0.0
\`\`\`

---

## 🐳 Docker Deployment (Alternative)

### Build Docker Images

#### Mobile Service
\`\`\`bash
cd services/mobile
docker build -t hephaitos-mobile:latest .
\`\`\`

#### Web Service
\`\`\`bash
cd services/web
docker build -t hephaitos-web:latest .
\`\`\`

### Run with Docker Compose

Create `docker-compose.yml`:

\`\`\`yaml
version: '3.8'

services:
  mobile:
    image: hephaitos-mobile:latest
    ports:
      - "3002:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.hephaitos.app
      - NEXT_PUBLIC_ENABLE_PWA=true
    restart: unless-stopped

  web:
    image: hephaitos-web:latest
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.hephaitos.app
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - mobile
      - web
    restart: unless-stopped
\`\`\`

### Deploy
\`\`\`bash
docker-compose up -d
\`\`\`

---

## 📱 PWA Configuration

### Generate Icons

Before deploying, generate PWA icons:

1. Create a 1024x1024 source image with:
   - Hephaitos blue background (#3b82f6)
   - White/light logo in center
   - 10% padding around logo

2. Generate required sizes:
\`\`\`bash
# Using ImageMagick
convert source.png -resize 192x192 services/mobile/public/icon-192.png
convert source.png -resize 512x512 services/mobile/public/icon-512.png
\`\`\`

3. Verify manifest.json references correct paths

### Test PWA Installation

1. Deploy to HTTPS domain
2. Open in Chrome/Edge on Android
3. Check "Install app" prompt appears
4. Install and verify functionality
5. Test offline capabilities (future enhancement)

---

## 🔧 API Integration

### Backend Requirements

Your API backend must provide these endpoints:

#### Dashboard
- `GET /api/v1/dashboard` - Returns summary, transactions, insights

#### Accounts
- `GET /api/v1/accounts` - Returns banks, cards, loans list
- `POST /api/v1/accounts/sync` - Triggers account synchronization

#### Debt Analysis
- `GET /api/v1/debts/analysis` - Returns debt breakdown and scenarios

#### Policy Recommendations
- `GET /api/v1/policies/recommendations` - Returns matched policies

#### OAuth
- `POST /api/v1/oauth/toss/token` - Toss OAuth token exchange
- `GET /api/v1/oauth/kftc/authorize` - KFTC authorization URL
- `POST /api/v1/oauth/kftc/callback` - KFTC callback handler

### CORS Configuration

Ensure your API allows requests from your frontend domains:

\`\`\`javascript
// Express example
const cors = require('cors');

app.use(cors({
  origin: [
    'https://app.hephaitos.com',
    'https://web.hephaitos.com',
    'http://localhost:3002', // Development
  ],
  credentials: true,
}));
\`\`\`

---

## 📊 Monitoring & Analytics

### Error Tracking

Recommended: Sentry

1. Install Sentry SDK:
\`\`\`bash
npm install @sentry/nextjs --save
\`\`\`

2. Initialize in `sentry.client.config.ts`:
\`\`\`typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
\`\`\`

### Analytics

Recommended: Google Analytics 4 or Plausible

Add to `app/layout.tsx`:
\`\`\`typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          \`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

---

## 🔐 Security Checklist

- [ ] HTTPS enabled on all domains
- [ ] Environment variables not committed to git
- [ ] API keys rotated from development
- [ ] Content Security Policy configured
- [ ] Rate limiting enabled on API
- [ ] OAuth redirect URIs whitelisted
- [ ] CORS properly configured
- [ ] No sensitive data in client-side code

---

## 🧪 Post-Deployment Testing

### Functional Testing
1. [ ] Dashboard loads correctly
2. [ ] All 4 pages accessible
3. [ ] Navigation works (bottom nav, links)
4. [ ] OAuth connections functional
5. [ ] API calls succeed
6. [ ] Error states display correctly

### Performance Testing
1. [ ] Lighthouse score > 90
2. [ ] First Contentful Paint < 2s
3. [ ] Time to Interactive < 3s
4. [ ] Page size < 500KB
5. [ ] API response time < 500ms

### Mobile Testing
1. [ ] Test on iPhone (Safari)
2. [ ] Test on Android (Chrome)
3. [ ] Test different screen sizes
4. [ ] Test touch gestures
5. [ ] Test PWA installation

### Cross-Browser Testing
1. [ ] Chrome (latest)
2. [ ] Firefox (latest)
3. [ ] Safari (latest)
4. [ ] Edge (latest)

---

## 📱 Mobile App Store (Future)

For native app distribution:

### iOS App Store
1. Wrap PWA using Capacitor/Cordova
2. Add native capabilities as needed
3. Submit to App Store Connect
4. Pass App Review

### Google Play Store
1. Wrap PWA using TWA (Trusted Web Activity)
2. Generate signed APK
3. Submit to Play Console
4. Pass review

---

## 🔄 CI/CD Pipeline (Recommended)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install pnpm
        run: npm install -g pnpm
      - name: Install dependencies
        run: cd services/mobile && pnpm install
      - name: Build
        run: cd services/mobile && pnpm build
      - name: Deploy to Vercel
        run: cd services/mobile && vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}
\`\`\`

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: PWA not installing
- **Solution**: Ensure HTTPS enabled and manifest.json accessible

**Issue**: API calls failing
- **Solution**: Check CORS configuration and API URL

**Issue**: OAuth not working
- **Solution**: Verify redirect URIs match exactly

**Issue**: Slow performance
- **Solution**: Enable caching, optimize images, check API response times

### Getting Help

- Review error logs in Vercel dashboard
- Check browser console for client errors
- Monitor API logs for backend issues
- Contact Hephaitos team: support@hephaitos.app

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PWA Best Practices](https://web.dev/pwa/)
- [React Query Docs](https://tanstack.com/query/latest)

---

**Last Updated**: 2025-10-28
**Version**: 1.0.0 (90% Complete)
