# DevX Final Deployment Guide 🚀

This guide provides the essential steps and checklists to take **DevX** from your local machine to a live, production environment.

---

## 🔐 1. Security First
These actions are **URGENT** and must be done before you go live.

### Rotate Supabase Keys
Your initial keys may have been exposed during development. To secure your app:
1. Go to your [Supabase Dashboard](https://app.supabase.com).
2. Navigate to **Settings → API**.
3. Click **Rotate** for your `anon` (public) key.
4. Update your local `.env` file with the new key.
5. **Never** commit your `.env` file to GitHub.

### Configure RLS (Row Level Security)
Ensure your database tables have RLS enabled in the Supabase Dashboard. Only the tables you want public (like `devices` or `device_news`) should have `SELECT` policies for all users. Admin tables should be restricted.

---

## 🛠️ 2. Build & Deploy

### Step 1: Production Build
Run the following command to create an optimized version of your app:
```bash
npm run build
```
This generates a `dist/` folder. This folder contains the files you will upload to your host.

### Step 2: Choose a Hosting Platform
- **Vercel (Recommended)**: Seamless integration with Vite. Just connect your GitHub repo and add your `.env` variables in the Vercel dashboard.
- **Netlify**: Similar to Vercel. Set the build command to `npm run build` and the publish directory to `dist`.
- **GitHub Pages**: Good for static sites, but requires more manual setup for routing.

### Step 3: Environment Variables
On your hosting platform (Vercel/Netlify), you **must** add these two environment variables:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your (Newly Rotated) Supabase Anon Key.

---

## ✅ 3. Pre-Launch Checklist

### Core Features
- [ ] **Home Page**: Tagline "Compare smarter. Choose faster." is visible.
- [ ] **Device Search**: Filtering by brand and search terms works.
- [ ] **Comparison**: 3-device slots and "+" button are functional.
- [ ] **News Feed**: "New Launch" badges show correctly for recent items.
- [ ] **Admin Dashboard**: Accessible only to your admin email.

### Quality & Performance
- [ ] **Linting**: Run `npm run lint` and ensure 0 errors.
- [ ] **Responsiveness**: Check the site on a mobile phone.
- [ ] **Speed**: Ensure pages load in under 3 seconds.
- [ ] **Console**: Clear any `console.log` statements before final commit.

---

## 📈 4. Post-Launch
- **Monitor Errors**: Keep an eye on the browser console for any production-only issues.
- **Analytics**: Consider adding Google Analytics to track user engagement.
- **Feedback**: Monitor the feedback form results in your Supabase `feedback` table.

**Good luck with your launch! Your platform is ready for the world. 💪**
