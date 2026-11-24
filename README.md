# SMS TAMU

SMS TAMU ni web app ya Kiswahili ya kushiriki posti za mapenzi, kuwasiliana na kujenga profile.

## Files (root)
- `index.html` — interface, sign-in/sign-up and dialogs.
- `style.css` — styles and SVG icon appearance.
- `app.js` — app interactions, Supabase auth, feed and admin UI.

## Supabase
Project: `qtsanhytungskipatyqc`
Region: `eu-west-1`

Supabase is connected with the public publishable key in `index.html`. Never put a `service_role` or secret key in browser code.

Database tables include:
- `profiles`: account details, role, verified and premium expiry
- `posts`, `comments`, `post_likes`, `follows`
- `conversations`, `conversation_members`, `messages`

Row Level Security is enabled. Normal users cannot update their own role, verified flag or premium expiry. The admin dashboard can grant verification, premium for 30 days, and admin role.

## First admin setup
The project starts with no registered users. First create your own account in SMS TAMU. Then set that account to admin in Supabase SQL Editor using its exact email:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR_ACCOUNT_EMAIL');
```

Replace `YOUR_ACCOUNT_EMAIL` with the email you registered. After this, sign out and sign in again; the Admin Dashboard will appear in Settings.

## Premium
Premium access is stored as `premium_until` (expiry timestamp), not as an admin role. Admin can grant 30 days or remove Premium from the dashboard. The app displays the Premium badge while the membership is active.

## Current scope
Authentication, profile loading, cloud post creation/feed and admin verification/premium controls are connected. Chat tables and realtime publication are prepared in Supabase; the current chat UI still needs its live conversation/member/message workflow connected before it becomes real-time messaging.
