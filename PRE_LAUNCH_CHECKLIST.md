# Pre-Launch Checklist ✅

Complete this checklist before deploying your app to production.

---

## 🔐 SECURITY (Do First!)

- [ ] **URGENT**: Rotate Supabase keys
  - Visit: https://app.supabase.com → Settings → API → Rotate
  - Update `.env` locally with new keys
  - Only then deploy

- [ ] Verify `.env` not in git history
  ```bash
  git log --all -- .env | head -5
  # Should show nothing (or historical removal)
  ```

- [ ] Verify `.env.example` has NO secrets
  ```bash
  cat .env.example
  # Should only have placeholder values
  ```

- [ ] `.gitignore` contains `.env` patterns
  ```bash
  grep -i ".env" .gitignore
  # Should return multiple matches
  ```

---

## ⚙️ CODE QUALITY

- [ ] ESLint passes (zero errors)
  ```bash
  npm run lint
  # Output: "✖ 0 problems"
  ```

- [ ] Production build succeeds
  ```bash
  npm run build
  # Should complete without errors
  # Check dist/ folder exists
  ```

- [ ] Production build size acceptable
  ```bash
  # Check output from build command
  # Total gzipped: should be < 500 KB
  ```

---

## 🧪 TESTING

### Core Functionality
- [ ] Home page loads
- [ ] Device listing shows content
- [ ] Device details page works
- [ ] Search/filter works
- [ ] Compare feature works

### Authentication
- [ ] Sign up flow works
- [ ] Email validation works
- [ ] Sign in works
- [ ] Logout works
- [ ] Protected routes blocked when not logged in

### Error Handling
- [ ] ErrorBoundary shows on crash (dev mode: intentional error)
- [ ] Invalid email rejected by validation
- [ ] Invalid password rejected by validation
- [ ] API errors handled gracefully

### Performance
- [ ] Pages load in < 3 seconds
- [ ] No console errors on first load
- [ ] Mobile responsive (test on phone or DevTools)
- [ ] Images load correctly

### Browser Compatibility
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Edge ✓
- [ ] Mobile browsers (optional)

---

## 🎯 HOSTING SETUP

### For Vercel
- [ ] Create Vercel account
- [ ] Connect GitHub repo to Vercel
- [ ] Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy preview works
- [ ] Production deploy works
- [ ] Custom domain configured (if applicable)

### For Netlify
- [ ] Create Netlify account
- [ ] Connect GitHub repo
- [ ] Add environment variables (same as above)
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Test production deploy
- [ ] Custom domain configured (if applicable)

### For Other Platforms
- [ ] Verify deployment method works
- [ ] Test environment variables
- [ ] Test production URL

---

## 🔧 SUPABASE CONFIGURATION

- [ ] Set CORS to your domain
  - Supabase Dashboard → Settings → API → CORS
  - Add: `https://yourdomain.com`

- [ ] Email setup configured
  - Check auth email templates (optional customization)

- [ ] Database backups enabled
  - Verify in Supabase dashboard

- [ ] Review RLS policies
  - tables → profiles → RLS status
  - Should be enabled for production

---

## 📊 MONITORING (Recommended)

- [ ] Error tracking service selected
  - [ ] Sentry (recommended)
  - [ ] Or other service
  - [ ] Or skip for now

- [ ] Analytics configured (optional)
  - [ ] Google Analytics
  - [ ] Or other service

- [ ] Error logging setup (if applicable)

---

## 📱 FINAL CHECKS

- [ ] No hardcoded credentials in code
  - ```bash
    grep -r "supabase" src/ | grep http
    # Verify only using env variables
    ```

- [ ] No console.log() debug statements left
  - Review code before commit

- [ ] Sensitive data not in localStorage
  - Check Network tab in DevTools
  - Verify auth token not exposed

- [ ] Forms validate input before sending
  - Check SignUp page example

- [ ] Error messages user-friendly
  - No technical jargon
  - Clear action items

- [ ] Mobile menu works properly
  - If applicable

- [ ] Loading states show while fetching
  - Check Device Listing, etc.

---

## 🚀 DEPLOYMENT

### Before Going Live
- [ ] Run final build
  ```bash
  npm run build
  npm run lint
  ```

- [ ] Final URL tested in browser

- [ ] Ask someone to test from their device

### After Going Live
- [ ] Monitor error tracking dashboard
- [ ] Check analytics (if set up)
- [ ] Verify email notifications work
- [ ] Be ready to quickly patch any issues

---

## 🎉 Success Criteria

Once all items are checked:

✅ Your app is ready for production!

If any item is unchecked:
- ❌ If Security/Code Quality: Fix before deploying
- ⚠️ If Testing: Try to fix, but can deploy with caution
- 📝 If Monitoring: Nice to have, can add later

---

## 📞 Troubleshooting Quick Links

- **Build fails**: Check Node.js version (`node -v` → should be 16+)
- **Env not loading**: Restart dev server after `.env` changes
- **Supabase error**: Verify CORS is set correctly
- **Blank page**: Check browser console, verify build happened
- **Mobile looks weird**: Check viewport meta tag in `index.html`

---

## 📋 Sign-Off

Once everything is complete, you can confidently deploy! 🚀

**Deploy Date**: _______________

**Deployed By**: _______________

**Any Issues**: _______________

---

Good luck! You've got this! 💪
