# SMS TAMU

SMS TAMU ni front-end demo ya app ya Kiswahili ya kushiriki ujumbe na kuwasiliana.

## Mafaili
- `index.html` — normal-user interface na dialogs.
- `style.css` — responsive layout, rangi na components.
- `app.js` — feed, profile, posts, search, comments, chat groups na settings.
- `README.md` — maelezo ya project.

## Wasifu wa normal user
- Badili picha ya wasifu kwa kugusa avatar; picha iwe chini ya 2MB.
- Badili jina, username na bio.
- Following na Followers: fungua orodha; unaweza ku-unfollow kwenye Following.
- Tabs: Posti Zangu, Zilizopendwa na Zilizohifadhiwa.
- Posti zako: like, comment, copy, share, save, edit na delete.
- Mipangilio: faragha ya demo, arifa za demo, msaada na reset demo data.
- Hakuna Admin Dashboard au admin access icon kwenye normal user profile.

## Feed na post
- Category filters na search.
- Kuandika post, kuchagua kundi na category.
- Post mpya hutumwa kwa review na huonekana kwa umma baada ya admin approval.
- Post pending huonekana kwa mwenye akaunti kwenye Posti Zangu.

## Chat
- SMS TAMU GROUP na Global Group demo chats.
- DM demo chats.
- Group pinned message, group name/topic, mute setting na leave group.
- Chat messages huhifadhiwa kwenye browser hii pekee.

## Data na database
Hii bado ni front-end demo. Profile, posts, likes, comments, group settings na chats huhifadhiwa kwenye localStorage. Hakuna data inayosawazishwa live kati ya watumiaji na hakuna server/database iliyounganishwa.

Following/followers na sample messages ni demo data. Admin role itahitaji backend/database authentication na authorization; front-end pekee haiwezi kutoa admin security.

## Kuendesha
Fungua `index.html` kwenye browser au host files hizi kwenye static hosting.
