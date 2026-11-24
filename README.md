# SMS TAMU

SMS TAMU ni front-end demo ya Kiswahili ya kushiriki posti na kuwasiliana.

## Mafaili
- `index.html` — UI na dialogs.
- `style.css` — layout na muonekano.
- `app.js` — feed, profile, posts, search, comments na chat demo.
- `README.md` — maelezo ya project.

## Posti
- Posti hutumwa kwenye feed mara moja, si kwenye Chat.
- Chagua category na aina ya maandishi: ujumbe wa kawaida, caption fupi, shairi au status.
- Posti zina like, comment, copy, share, save, edit na delete.
- Posti huonekana kwenye profile ya mwenyewe.

## Wasifu na verification
Profile ina jina, username, bio, picha, following/followers na tabs za posti, liked na saved.
Normal user hawezi kujipa verification. Verification halisi lazima admin aidhinishe kupitia backend/database yenye admin permissions. Front-end hii bado haina admin authentication; badge ya demo haijaruhusiwa kwa normal user.

## Chat
Chat screen iko tofauti na feed/posts. DM na group chat kwa sasa ni demo ya browser hii; ujumbe unaohifadhiwa hapa hauonekani kwa users wengine. Live chat, group membership na DM halisi zinahitaji database na realtime backend.

## Data na usalama
Hii ni static front-end demo inayotumia localStorage. Hakuna database/authentication iliyounganishwa. Admin permissions, verification na live messaging haviwezi kulindwa au kusawazishwa kwa HTML/CSS/JavaScript pekee.

## Kuendesha
Fungua `index.html` au host files hizi kwenye static hosting.
