# SMS TAMU

SMS TAMU ni web app ya Kiswahili ya kushiriki ujumbe, kujenga wasifu na kuwasiliana.

## Files (root)
- `index.html` — app interface, auth and dialogs.
- `style.css` — styling and responsive layout.
- `app.js` — frontend logic and Supabase realtime connections.

## Supabase
Project: `qtsanhytungskipatyqc` (eu-west-1)

The browser uses the Supabase publishable key only. Never put a `service_role` or secret key in frontend code.

## Live features
- Supabase email/password sign-up and login.
- Feed posts stored in `posts`, with realtime feed refresh.
- Likes, comments and saved posts stored in the database.
- Profile name, username, bio, avatar, privacy and notification preference saved to `profiles`.
- Followers/following stored in `follows`.
- Public SMS TAMU group and private direct chats stored in `conversations`, `conversation_members` and `messages`.
- Realtime chat updates for messages.
- Profile privacy is enforced by RLS for profiles, posts and comments.
- Admin verification, Premium, role management and live post moderation (hide/restore/delete) are available in Admin Control Center.

## Storage
The `sms-tamu-avatars` public bucket stores profile images. Upload/update/delete policies restrict writes to the signed-in user's own folder.

## First admin setup
Register your account first. Then use Supabase SQL Editor and replace the email below with your own registered email:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR_ACCOUNT_EMAIL');
```

Sign out and sign in again. Admin Dashboard will appear in Settings.

## Admin Dashboard
The first registered account has been promoted to the initial Admin. After signing out and back in, open Settings → Admin Dashboard.

Admin Control Center includes user/verified/Premium/Admin/post/comment counts, user search and status filters, verification toggle, Premium grant/removal, Admin role changes, and a Posts & Moderation tab to search posts, hide/restore them or delete them permanently. Admin role changes require confirmation; the current admin account's own role button is disabled to help avoid accidental lockout.

Admin and Premium are separate permissions. Verification, Premium expiry, and role are managed from the dashboard.

## Premium
Premium is separate from Admin and uses `premium_until`. Admin can grant 30 days or remove Premium.

## Notes
- For instant registration/login, turn off Email provider's **Confirm email** setting in Supabase Auth.
- Browser/phone push notifications are not enabled; the saved preference only records the user's choice. Full push requires a push provider/service worker and permission flow.
- Group title/topic/pinned-message management and a full searchable user directory are not complete yet. The app's former browser demo seed feed/follower/chat entries were removed so the UI no longer presents fake sample content as real activity.
