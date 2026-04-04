# 🔧 TrustSignals Admin Editor - Setup Guide

## What's New

The "Trusted by Tech Enthusiasts" section now has **real-time editing capabilities for admin users**!

- ✅ Admin users see an **Edit** button on the section
- ✅ Click to open an edit panel
- ✅ Change stat values (e.g., "5,000+" → "10,000+")
- ✅ Changes are saved to Supabase and appear instantly
- ✅ Only admins can see the edit button
- ✅ All changes are tracked with timestamps

---

## 🔌 Setup Steps

### Step 1: Create Supabase Table

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of [SUPABASE_SETUP.sql](../SUPABASE_SETUP.sql)
6. Click **Run**

✅ Table `site_stats` is now created with RLS policies

---

### Step 2: Verify User is Admin

Make sure your user account has `role: 'admin'` in the `profiles` table:

```sql
-- Check your role
SELECT id, email, role FROM profiles WHERE email = 'your@email.com';

-- If not admin, update it (do this carefully!)
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

### Step 3: Test It

1. Sign in with your **admin account**
2. Go to Home page
3. Scroll to "Trusted by Tech Enthusiasts" section
4. You should see a **pencil icon** next to the title
5. Click it to open the edit panel

---

## 📝 How to Edit

### Edit Mode

When you click the edit button:

```
┌─────────────────────────────────────┐
│ 📝 Edit Trust Stats              [X] │
├─────────────────────────────────────┤
│ Devices Indexed:                    │
│ [5,000+           ]                 │
│                                     │
│ Active Users:                       │
│ [50K+             ]                 │
│                                     │
│ Verified Specs:                     │
│ [100%             ]                 │
│                                     │
│ Comparisons Made:                   │
│ [500K+            ]                 │
│                                  [Save Changes] │
└─────────────────────────────────────┘
```

1. Type new values (e.g., `10,000+` for "Devices Indexed")
2. Click **Save Changes**
3. Values update instantly on the page
4. Changes are sent to Supabase database

---

## 📊 Example Edits

**Scenario 1: Update as you grow**
```
Before: 5,000+ devices
After:  50,000+ devices (when you hit this milestone)
```

**Scenario 2: Real user metrics**
```
Before: 50K+ active users (placeholder)
After:  156,432 active users (real data from analytics)
```

**Scenario 3: Verified specs percentage**
```
Before: 100% (all devices)
After:  98.5% (most verified, some pending)
```

---

## 🔐 Security

### Who Can Edit?

Only users with `role: 'admin'` in the `profiles` table can:
- See the edit button
- Click edit mode
- Save changes

Everyone else: Cannot edit, can only view stats

### Row-Level Security (RLS)

The Supabase table has RLS policies:
- `PUBLIC`: Everyone can READ stats
- `ADMIN_ONLY`: Only admins can UPDATE/INSERT
- Changes are tracked with `updated_at` timestamp

---

## 🐛 Troubleshooting

### "Edit button not showing"
- ❌ You're not logged in as admin
- ✅ Check your profile: `SELECT role FROM profiles WHERE id = auth.uid();`
- ✅ Ask another admin to update your role to `'admin'`

### "Error saving stats"
- ❌ RLS policies not set up correctly
- ✅ Run the SQL setup again
- ✅ Check browser console for error details

### "Stats not loading from database"
- ❌ Table doesn't exist
- ✅ Verify table was created: `SELECT * FROM site_stats;`
- ✅ Re-run the SQL setup

### "Changes not appearing"
- ❌ Browser cache issue
- ✅ Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- ✅ Check Supabase dashboard to verify data was saved

---

## 💡 Pro Tips

1. **Test on staging first** - Don't update production stats if you're unsure
2. **Update periodically** - As your app grows, update these metrics monthly
3. **Real data is better** - Use actual metrics from Google Analytics/your dashboard
4. **Trust = Credibility** - Accurate numbers build user confidence

---

## 📋 File Changes

**Modified:**
- `src/components/TrustSignals.jsx` - Added edit UI and state management

**Created:**
- `SUPABASE_SETUP.sql` - Database schema
- `TRUSTSIGNALS_ADMIN_GUIDE.md` - This guide

---

## 🚀 Next Steps

After testing the edit feature:

1. Update stats to real values from your analytics
2. Set up a monthly reminder to update metrics
3. Monitor which stats get the most attention
4. Share milestone updates with your users on social media

---

**Questions?** Check the TrustSignals component code - it has inline comments! 🎯
