# Deployment & Production Readiness Guide

## 🚀 Pre-Deployment Checklist

### Security
- [x] Added `.env` to `.gitignore` 
- [x] Created `.env.example` template
- [x] **ACTION REQUIRED**: Rotate Supabase keys in dashboard to invalidate old ones
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure CORS properly in Supabase
- [ ] Review RLS (Row Level Security) policies in Supabase
- [ ] Set strong passwords for admin accounts

### Code Quality
- [x] ESLint passing (0 errors)
- [x] Added error boundary for crash handling
- [x] Added input validation utilities
- [x] Added API error handler
- [ ] Manual testing of all critical flows
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing

### Performance
- [x] Code splitting configured (Vite)
- [ ] Run production build and check bundle size
- [ ] Set up CDN for static assets (optional but recommended)
- [ ] Enable caching headers

### Monitoring & Observability
- [ ] Set up error tracking (Sentry recommended)
- [ ] Add analytics (Google Analytics or alternative)
- [ ] Configure logging service

---

## 📋 Step-by-Step Deployment

### Step 1: Rotate Supabase Keys (URGENT)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Settings → API**
3. Click **Rotate** on your anon key
4. Update `.env` with new keys
5. Deploy new version

**Why**: Your old keys were exposed in the git history.

### Step 2: Build for Production

```bash
npm run build
# Creates dist/ folder with optimized production build
```

### Step 3: Choose Hosting Platform

#### Recommended: **Vercel** (Best for Vite + React)
```bash
npm install -g vercel
vercel login
vercel deploy
```

#### Alternative: **Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Alternative: **GitHub Pages** (Free but limited)
```bash
# Add to package.json: "homepage": "https://yourusername.github.io/specora-app"
npm run build
# Deploy dist/ folder
```

### Step 4: Set Environment Variables

**On Vercel:**
1. Project Settings → Environment Variables
2. Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**On Netlify:**
1. Site Settings → Build & Deploy → Environment
2. Add the same variables

**Important**: Never commit `.env` file!

### Step 5: Configure Supabase for Production

#### Set up Row Level Security (RLS)

```sql
-- Example: Profiles table - users can only view their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Set CORS in Supabase
1. Go to **Settings → API**
2. Click **CORS Configuration**
3. Add your production domain: `https://yourdomain.com`

#### Configure Authentication
1. Go to **Authentication → Providers**
2. Disable unnecessary providers
3. Set up email templates

---

## 🗂️ Project Structure for Deployment

```
specora-app/
├── .env.example           ✅ (tracked - no secrets)
├── .env                   ❌ (NOT tracked - has secrets)
├── .gitignore             ✅ (includes .env)
├── dist/                  📦 (generated on build)
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx      ✅ NEW - Error handling
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── utils.js
│   │   ├── validation.js          ✅ NEW - Input validation
│   │   └── errorHandler.js        ✅ NEW - Error handling
│   ├── pages/
│   ├── App.jsx             ✅ UPDATED - Uses ErrorBoundary
│   └── main.jsx
├── public/                 📦 (static assets)
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔧 Deployment Configuration Examples

### Vercel (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

### Netlify (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[env]
  VITE_SUPABASE_URL = "your-url"
  VITE_SUPABASE_ANON_KEY = "your-key"
```

---

## 🧪 Pre-Launch Testing

### 1. Test All Authentication Flows
- [ ] Sign up new user
- [ ] Email verification
- [ ] Sign in
- [ ] Password reset
- [ ] Admin login

### 2. Test Core Features
- [ ] Browse devices
- [ ] Search/filter devices
- [ ] View device details
- [ ] Compare devices
- [ ] User profile
- [ ] Admin dashboard

### 3. Test Error Scenarios
- [ ] Network error (disable internet)
- [ ] Invalid input
- [ ] Server error (ErrorBoundary should catch)
- [ ] Rate limiting

### 4. Performance Testing
```bash
# Build and preview
npm run build
npm run preview

# Check bundle size
npm install -g npm-bundle-size
# Analyze your dist/ folder
```

---

## 📊 Monitoring Setup

### Option 1: Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Option 2: LogRocket (Session Replay)

```bash
npm install logrocket
```

### Option 3: Google Analytics

```bash
npm install react-ga4
```

---

## 🔒 Security Checklist

- [ ] SSL/HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection enabled
- [ ] Content Security Policy configured
- [ ] Supabase RLS policies enabled
- [ ] Rate limiting configured
- [ ] API keys rotated

---

## 📈 Post-Launch

1. **Monitor errors** - Check error tracking dashboard daily first week
2. **Check analytics** - Understand user behavior
3. **Performance** - Monitor Core Web Vitals
4. **Support** - Set up support channels
5. **Updates** - Plan feature updates and bug fixes

---

## 🚨 Troubleshooting

### Build fails locally
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not loading
- Check `.env` exists in root
- Restart dev server after changing `.env`
- On hosting platform, verify vars are set

### Supabase connection error
- Verify credentials in `.env`
- Check Supabase project is active
- Verify CORS is configured

### Blank page on production
- Check browser console for errors
- Verify public/_redirects or netlify.toml exists
- Check dist/ folder built correctly

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

---

## Next Steps

1. **Immediate (Today)**
   - Rotate Supabase keys
   - Run production build

2. **This Week**
   - Complete testing checklist
   - Set up hosting account
   - Configure environment

3. **Before Launch**
   - Set up error tracking
   - Configure analytics
   - Final verification

---

Happy deploying! 🎉
