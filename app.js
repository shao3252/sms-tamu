function iconSVG(name, filled = false) {
  const paths = {
    heart: '<path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    comment: '<path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.7-3.8A7.5 7.5 0 1 1 20 11.5Z"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/>',
    share: '<path d="M12 16V3m0 0L7 8m5-5 5 5"/><path d="M5 13v7h14v-7"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>', pin: '<path d="m16 3 5 5-4 1-4 4 1 4-2 2-3-5-5-3 2-2 4 1 4-4z"/><path d="m9 15-6 6"/>',
    edit: '<path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4z"/><path d="m14.8 5.7 3.5 3.5"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v7m6-7v7"/>'
  };
  return '<svg class="ui-icon action-svg" viewBox="0 0 24 24" aria-hidden="true" fill="' +
    (filled && (name === "heart" || name === "bookmark") ? "currentColor" : "none") +
    '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    (paths[name] || paths.heart) + '</svg>';
}

// SMS TAMU - normal user app (front-end demo)
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "sms-tamu-user-demo-v1";

const demoPosts = [
  {
    id: 101,
    name: "VeeAmor",
    username: "veeamor",
    verified: true,
    category: "Kuomba Msamaha",
    text: "Siwezi sema sijawahi kuwa na makosa, lakini nikikumbuka namna ulivyonipa nafasi ya kuwa mimi, moyo wangu unajaa shukrani. Wewe ni sehemu nzuri ya maisha yangu.",
    likes: 1,
    liked: false,
    saved: false,
    comments: [{ name: "Shauku", text: "Ujumbe mzuri sana." }],
    mine: false
  },
  {
    id: 102,
    name: "Shaolin",
    username: "shaolin",
    verified: true,
    category: "Kusifia",
    text: "Nikikuwaza wewe, moyo wangu unapata amani. Natamani tuwe karibu, tushirikiane ndoto zetu na tujenge upendo wenye heshima na furaha.",
    likes: 3,
    liked: false,
    saved: false,
    comments: [],
    mine: true
  },
  {
    id: 103,
    name: "Shaolin",
    username: "shaolin",
    verified: true,
    category: "Ujumbe wa Mapenzi",
    text: "Kitu ninachokipenda zaidi ni kusikia sauti yako na kuona furaha yako. Natamani kila siku nikukumbushe jinsi ulivyo wa thamani kwangu.",
    likes: 3,
    liked: false,
    saved: false,
    comments: [],
    mine: true
  },
  {
    id: 104,
    name: "Shauku",
    username: "shauku",
    verified: true,
    category: "Ushauri",
    text: "Usimlazimishe mtu akuone wa muhimu. Upendo wa kweli hauhitaji kushindana ili upate nafasi; unahitaji moyo unaochagua kwa hiari.",
    likes: 31,
    liked: false,
    saved: false,
    comments: [{ name: "VeeAmor", text: "Kweli kabisa." }],
    mine: false
  }
];

const defaultProfile = {
  name: "Shaolin",
  username: "shaolin",
  bio: "Everyone is Unique.",
  avatar: "",
  verified: false
};

const defaultFollowing = [
  { id: "veeamor", name: "VeeAmor", username: "veeamor" },
  { id: "shauku", name: "Shauku", username: "shauku" },
  { id: "ally", name: "Ally", username: "ally" },
  { id: "abby", name: "Abby", username: "abby" },
  { id: "matrix", name: "Matrix", username: "matrix" }
];

const defaultFollowers = [
  { id: "veeamor", name: "VeeAmor", username: "veeamor" },
  { id: "shauku", name: "Shauku", username: "shauku" },
  { id: "ally", name: "Ally", username: "ally" }
];

function createDefaultChats() {
  return [
    { id: "sms-tamu-group", name: "SMS TAMU GROUP", isGroup: true, topic: "Tupo Online", last: "Karibu kwenye SMS TAMU GROUP", pinned: "Karibu SMS TAMU GROUP! Tumia kundi kwa maoni na ushauri wenye heshima.", muted: false },
    { id: "global-group", name: "Global Group", isGroup: true, topic: "Tupo Online", last: "Karibu Global Group", pinned: "Karibu Global Group. Shiriki mawazo mazuri na ujumbe wenye heshima.", muted: false },
    { id: "veeamor", name: "VeeAmor", last: "Ujumbe wako umenigusa." },
    { id: "shauku", name: "Shauku", last: "Habari yako?" },
    { id: "ally", name: "Ally", last: "Asante sana." }
  ];
}

function ensureDefaultGroups(chats) {
  const groups = createDefaultChats().filter(chat => chat.isGroup);
  const existing = new Set(chats.map(chat => chat.id));
  return [...groups.filter(group => !existing.has(group.id)), ...chats];
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const profile = { ...defaultProfile, ...(saved.profile || {}), verified: false };
    const sourcePosts = Array.isArray(saved.posts) ? saved.posts : [];

    const posts = sourcePosts.map((post, index) => {
      const category = post.category === "Message Kuu" ? "Ujumbe wa Mapenzi"
        : (post.category === "Kuwa Msham" ? "Kumtia Moyo" : (post.category || "Ujumbe wa Mapenzi"));
      const isOwn = post.username === profile.username || post.mine === true;

      return {
        ...post,
        id: post.id || (Date.now() + index),
        name: post.name || profile.name,
        username: post.username || profile.username,
        category,
        format: post.format || "Ujumbe wa kawaida",
        status: post.status === "removed" ? "removed" : "published",
        verified: isOwn ? false : Boolean(post.verified),
        likes: Number.isFinite(post.likes) ? post.likes : 0,
        liked: Boolean(post.liked),
        saved: Boolean(post.saved),
        comments: Array.isArray(post.comments) ? post.comments : [],
        mine: isOwn
      };
    });

    return {
      posts,
      profile,
      following: Array.isArray(saved.following) ? saved.following : [],
      followers: Array.isArray(saved.followers) ? saved.followers : [],
      chats: Array.isArray(saved.chats) ? saved.chats : [],
      messages: saved.messages && typeof saved.messages === "object" ? saved.messages : {},
      privacy: saved.privacy === "private" ? "private" : "public",
      notifications: saved.notifications !== false
    };
  } catch (error) {
    return {
      posts: [],
      profile: { ...defaultProfile, verified: false },
      following: [],
      followers: [],
      chats: [],
      messages: {},
      privacy: "public",
      notifications: true
    };
  }
}

let state = loadState();
let activeCategory = "Vyote";
let activeProfileTab = "posts";
let activeCommentPostId = null;
let activeEditPostId = null;
let activeChat = null;
let toastTimer = null;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function avatarMarkup(profile, extraClass = "") {
  if (profile.avatar) {
    return `<img class="avatar-image ${extraClass}" src="${profile.avatar}" alt="Picha ya ${escapeHTML(profile.name)}">`;
  }

  return `<span class="avatar-letter ${extraClass}">${escapeHTML((profile.name || "U").charAt(0).toUpperCase())}</span>`;
}

function goToScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  document.querySelectorAll(".nav-item[data-screen]").forEach(button => {
    button.classList.toggle("selected", button.dataset.screen === screenId);
  });

  if (screenId === "profileScreen") renderProfile();
  if (screenId === "chatScreen") renderChats();
  if (screenId === "searchScreen") { renderSearch($("searchInput").value); searchLiveUsers($("searchInput").value); }
  if (screenId === "composeScreen") $("postText").focus();

  if (activeChat && screenId !== "chatScreen") closeChat();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function postCard(post) {
  const isMine = post.username === state.profile.username || post.mine;
  const ownerAvatar = isMine ? state.profile : { name: post.name, avatar: post.avatar || "" };

  return `
    <article class="post-card" data-post-id="${post.id}">
      <div class="post-author">
        ${avatarMarkup(ownerAvatar, "post-avatar")}
        <div class="author-info">
          <div class="author-name">
            ${escapeHTML(post.name)}
            ${post.verified ? '<span class="verified-badge small-verified">✓</span>' : ""}
            ${post.premium ? '<span class="premium-badge small-premium">PREMIUM</span>' : ""}
          </div>
          <div class="post-time">${escapeHTML(post.time || "Sasa")} <span class="post-tag">${escapeHTML(post.category || "Ujumbe")}</span> ${post.format ? '<span class="post-tag format-tag">' + escapeHTML(post.format) + '</span>' : ""}</div>
        </div>
        ${isMine ? '<button class="more-post-button" data-action="post-menu" aria-label="Chaguo za posti">⋯</button>' : ""}
      </div>
    <p class="post-text">${escapeHTML(post.text)}</p>
      <div class="post-actions">
        <button class="action-button like-button ${post.liked ? "liked" : ""}" data-action="like"><span class="action-icon">${iconSVG("heart", post.liked)}</span><span>${post.likes}</span></button>
        <button class="action-button" data-action="comment"><span class="action-icon">${iconSVG("comment")}</span><span>${(post.comments || []).length}</span></button>
        <button class="action-button" data-action="copy"><span class="action-icon">${iconSVG("copy")}</span><span>Copy</span></button>
        <button class="action-button" data-action="share"><span class="action-icon">${iconSVG("share")}</span><span>Share</span></button>
        <button class="action-button ${post.saved ? "liked" : ""}" data-action="save"><span class="action-icon">${iconSVG("bookmark", post.saved)}</span><span>Save</span></button>
      </div>
      <div class="post-extra-actions">
        <button data-action="likes">${iconSVG("users")} Likes</button>
        ${isMine ? '<button data-action="edit">' + iconSVG("edit") + ' Edit</button><button class="delete-post" data-action="delete">' + iconSVG("trash") + ' Futa</button>' : ""}
      </div>
    </article>`;
}

function renderFeed(targetId, posts) {
  const target = $(targetId);
  if (!target) return;

  target.innerHTML = posts.length
    ? posts.map(postCard).join("")
    : '<div class="empty-state">Hakuna posti hapa kwa sasa.</div>';
}

function renderHome() {
  const visiblePosts = state.posts.filter(post => post.status !== "removed");
  const posts = activeCategory === "Vyote"
    ? visiblePosts
    : visiblePosts.filter(post => post.category === activeCategory);
  renderFeed("feed", posts);
}

function renderSearch(query) {
  const term = (query || "").trim().toLowerCase();
  const visiblePosts = state.posts.filter(post => post.status !== "removed");
  const results = !term ? visiblePosts : visiblePosts.filter(post =>
    (post.text + " " + post.name + " " + post.username + " " + post.category + " " + (post.format || ""))
      .toLowerCase().includes(term)
  );
  renderFeed("searchResults", results);
}

function renderProfile() {
  const profile = state.profile || defaultProfile;
  $("profileName").textContent = profile.name || "Mtumiaji";
  $("profileUsername").textContent = "@" + (profile.username || "user");
  $("profileBio").textContent = profile.bio || "";
  $("profileVerified").hidden = !profile.verified;
  $("profilePremium").hidden = !(profile.premiumUntil && new Date(profile.premiumUntil) > new Date());
  $("profileAvatar").innerHTML = profile.avatar
    ? '<img src="' + escapeHTML(profile.avatar) + '" alt="Picha ya wasifu">'
    : escapeHTML((profile.name || "U").charAt(0).toUpperCase());
  $("followingCount").textContent = state.following.length;
  $("followersCount").textContent = state.followers.length;
  document.querySelectorAll("[data-profile-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.profileTab === activeProfileTab);
  });
  const own = state.posts.filter(post => post.username === profile.username || post.mine);
  let shown = own;
  if (activeProfileTab === "liked") shown = state.posts.filter(post => post.liked);
  if (activeProfileTab === "saved") shown = state.posts.filter(post => post.saved);
  renderFeed("myPosts", shown.filter(post => post.status !== "removed"));
}

async function searchLiveUsers(query){
 const target=$("searchUserResults");if(!target)return;
 const term=(query||"").trim();
 if(!signedInUser||term.length<2){target.innerHTML='<div class="empty-state">'+(signedInUser?'Andika angalau herufi 2.':'Ingia ili kutafuta watumiaji.')+'</div>';return;}
 target.innerHTML='<div class="empty-state">Inatafuta watumiaji...</div>';
 const pattern="%"+term.replace(/[%_]/g,"\\function getPostFromElement(element) {")+"%";
 const [byName,byUser]=await Promise.all([
  sbClient.from("profiles").select("id,username,display_name,avatar_url,verified,premium_until").ilike("display_name",pattern).limit(12),
  sbClient.from("profiles").select("id,username,display_name,avatar_url,verified,premium_until").ilike("username",pattern).limit(12)
 ]);
 if(byName.error||byUser.error){target.innerHTML='<div class="empty-state">Search haijafanikiwa. Jaribu tena.</div>';return;}
 const map=new Map();[...(byName.data||[]),...(byUser.data||[])].forEach(p=>{if(p.id!==signedInUser.id)map.set(p.id,p);});
 const users=[...map.values()].slice(0,15);
 target.innerHTML=users.map(p=>{
  const following=state.following.some(f=>f.id===p.id);
  const name=p.display_name||p.username||"Mtumiaji";
  return '<article class="search-user-row" data-search-user="'+escapeHTML(p.id)+'">'+
   '<span class="avatar-image">'+(p.avatar_url?'<img src="'+escapeHTML(p.avatar_url)+'" alt="">':escapeHTML((name||"U").charAt(0).toUpperCase()))+'</span>'+
   '<div class="search-user-info"><strong>'+escapeHTML(name)+(p.verified?' <span class="verified-badge small-verified">✓</span>':'')+'</strong><small>@'+escapeHTML(p.username||"user")+'</small></div>'+
   '<div class="search-user-actions"><button class="person-action" '+(following?'data-unfollow="'+escapeHTML(p.id)+'"':'data-follow="'+escapeHTML(p.id)+'"')+'>'+(following?'Unafuata':'Fuata')+'</button><button class="person-action" data-message-user-id="'+escapeHTML(p.id)+'">Message</button></div></article>';
 }).join("")||'<div class="empty-state">Hakuna mtumiaji wa wazi aliyepatikana.</div>';
}
function getPostFromElement(element) {
  const card = element.closest("[data-post-id]");
  if (!card) return null;
  return state.posts.find(post => post.id === Number(card.dataset.postId));
}

function getOwnedPost(post) {
  return post && (post.username === state.profile.username || post.mine);
}

function openComments(postId) {
  const post = state.posts.find(item => item.id === postId);
  if (!post) return;

  activeCommentPostId = postId;
  $("commentsList").innerHTML = post.comments.length
    ? post.comments.map(comment => `
      <div class="comment-item">
        <strong>${escapeHTML(comment.name)}</strong>
        ${escapeHTML(comment.text)}
      </div>`).join("")
    : '<div class="empty-state">Bado hakuna maoni. Kuwa wa kwanza kutoa maoni.</div>';

  $("commentsDialog").showModal();
}

function openEditPost(post) {
  if (!getOwnedPost(post)) {
    showToast("Unaweza kuhariri posti zako tu.");
    return;
  }

  activeEditPostId = post.id;
  $("editPostCategory").value = post.category || "Ujumbe wa Mapenzi";
  $("editPostFormat").value = post.format || "Ujumbe wa kawaida";
  $("editPostText").value = post.text;
  $("editPostDialog").showModal();
}

function renderChats() {
  $("chatList").innerHTML = state.chats.map(chat =>
    '<button class="chat-row" data-chat-id="' + escapeHTML(chat.id) + '">' +
      '<span class="avatar pink">' + (chat.isGroup ? iconSVG("users") : escapeHTML(chat.name.charAt(0).toUpperCase())) + '</span>' +
      '<span class="chat-preview"><strong>' + escapeHTML(chat.name) + '</strong><p>' + escapeHTML(chat.last || "Anza mazungumzo") + '</p></span>' +
      '<time>' + (chat.isGroup ? "Kundi" : "DM") + '</time>' +
    '</button>'
  ).join("") || '<div class="empty-state">Bado huna mazungumzo.</div>';
}

function renderMessages() {
  if (!activeChat) return;
  const messages = state.messages[activeChat.id] || [];
  $("chatMessages").innerHTML = messages.length
    ? messages.map(message =>
      '<div class="bubble ' + (message.mine ? "mine" : "") + '">' +
        (message.name && !message.mine ? '<strong class="bubble-name">' + escapeHTML(message.name) + '</strong>' : "") +
        escapeHTML(message.text) +
        '<small>' + escapeHTML(message.time || "Sasa") + '</small>' +
      '</div>'
    ).join("")
    : '<div class="empty-state">Hakuna ujumbe bado. Chat hii ni demo ya browser hii; haiunganishi users wengine.</div>';
  $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
}

function closeChat() {
  activeChat = null;
  $("chatWindow").hidden = true;
}

function openProfileList(type) {
  const list = type === "following" ? state.following : state.followers;
  $("listDialogTitle").textContent = type === "following" ? "Unafuata" : "Wafuasi";

  $("listDialogContent").innerHTML = list.length
    ? list.map(person => {
      const isFollowing = state.following.some(item => item.id === person.id);
      const action = type === "following"
        ? '<button class="person-action" data-unfollow="' + escapeHTML(person.id) + '">Unafuata</button>'
        : (isFollowing
          ? '<button class="person-action" data-unfollow="' + escapeHTML(person.id) + '">Unafuata</button>'
          : '<button class="person-action" data-follow="' + escapeHTML(person.id) + '">Fuata</button>');

      return '<div class="person-row">' +
        '<span class="avatar pink">' + escapeHTML(person.name.charAt(0).toUpperCase()) + '</span>' +
        '<span class="person-info"><strong>' + escapeHTML(person.name) + '</strong><small>@' + escapeHTML(person.username) + '</small></span>' +
        action +
      '</div>';
    }).join("")
    : '<div class="empty-state">Orodha bado haina mtu.</div>';

  $("listDialog").showModal();
}

function openSettingsDetail(type) {
  const detail = $("settingsDetail");
  detail.hidden = false;

  if (type === "privacy") {
    detail.innerHTML = `
      <h3>Faragha ya wasifu</h3>
      <label class="setting-choice"><input type="radio" name="privacy" value="public" ${state.privacy === "public" ? "checked" : ""}> Wasifu wa wazi</label>
      <label class="setting-choice"><input type="radio" name="privacy" value="private" ${state.privacy === "private" ? "checked" : ""}> Wasifu wa faragha (demo)</label>
      <button class="primary-button" id="savePrivacy">Hifadhi</button>
      <p class="form-hint">Mipangilio hii ni ya demo kwenye browser hii pekee.</p>`;
    $("savePrivacy").addEventListener("click", () => {
      state.privacy = document.querySelector('input[name="privacy"]:checked').value;
      saveState();
      showToast("Mipangilio ya faragha imehifadhiwa.");
      detail.hidden = true;
    });
  } else if (type === "notifications") {
    detail.innerHTML = `
      <h3>Arifa</h3>
      <label class="setting-choice"><input type="checkbox" id="notificationToggle" ${state.notifications ? "checked" : ""}> Washa arifa za demo</label>
      <button class="primary-button" id="saveNotifications">Hifadhi</button>`;
    $("saveNotifications").addEventListener("click", () => {
      state.notifications = $("notificationToggle").checked;
      saveState();
      showToast(state.notifications ? "Arifa zimewashwa." : "Arifa zimezimwa.");
      detail.hidden = true;
    });
  } else if (type === "help") {
    detail.innerHTML = "<h3>Msaada wa SMS TAMU</h3><p>Hii ni demo ya upande wa browser. Ujumbe na profile huhifadhiwa kwenye kifaa hiki tu. Chat na follower counts hazijaunganishwa na server bado.</p>";
  }
}

function openEditProfile() {
  $("editNameInput").value = state.profile.name;
  $("editUsernameInput").value = state.profile.username;
  $("editBioInput").value = state.profile.bio || "";
  $("profileDialog").showModal();
}

// Navigation and post actions
document.addEventListener("click", async event => {
  const category = event.target.closest(".category");
  if (category) {
    activeCategory = category.dataset.category;
    document.querySelectorAll(".category").forEach(button => {
      button.classList.toggle("active", button === category);
    });
    renderHome();
    return;
  }

  const nav = event.target.closest(".nav-item[data-screen]");
  if (nav) {
    goToScreen(nav.dataset.screen);
    return;
  }

  const profileTab = event.target.closest("[data-profile-tab]");
  if (profileTab) {
    activeProfileTab = profileTab.dataset.profileTab;
    renderProfile();
    return;
  }

  const profileListButton = event.target.closest("[data-profile-list]");
  if (profileListButton) {
    openProfileList(profileListButton.dataset.profileList);
    return;
  }

  const settingButton = event.target.closest("[data-setting]");
  if (settingButton) {
    const setting = settingButton.dataset.setting;

    if (setting === "edit") {
      $("settingsDialog").close();
      openEditProfile();
    } else if (setting === "logout") {
      if (confirm("Futa demo data ya SMS TAMU kwenye browser hii?")) {
        localStorage.removeItem(STORAGE_KEY);
        state = loadState();
        renderHome();
        renderProfile();
        renderChats();
        $("settingsDialog").close();
        showToast("Demo data imewekwa upya.");
      }
    } else {
      openSettingsDetail(setting);
    }
    return;
  }

  const followButton = event.target.closest("[data-follow]");
  if (followButton) {
    const person = state.followers.find(item => item.id === followButton.dataset.follow);
    if (person && !state.following.some(item => item.id === person.id)) {
      state.following.push(person);
      saveState();
      renderProfile();
      openProfileList("followers");
      showToast("Sasa unamfuata " + person.name + ".");
    }
    return;
  }

  const unfollowButton = event.target.closest("[data-unfollow]");
  if (unfollowButton) {
    state.following = state.following.filter(person => person.id !== unfollowButton.dataset.unfollow);
    saveState();
    renderProfile();
    openProfileList("following");
    showToast("Umeacha kumfuata mtumiaji.");
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const post = getPostFromElement(actionButton);
    if (!post) return;

    switch (actionButton.dataset.action) {
      case "like":
        post.liked = !post.liked;
        post.likes = Math.max(0, post.likes + (post.liked ? 1 : -1));
        saveState();
        renderHome();
        renderSearch($("searchInput").value);
        renderProfile();
        break;

      case "comment":
        openComments(post.id);
        break;

      case "copy":
        try {
          await navigator.clipboard.writeText(post.text);
          showToast("Ujumbe umenakiliwa.");
        } catch (error) {
          showToast("Copy haipatikani kwenye browser hii.");
        }
        break;

      case "share":
        if (navigator.share) {
          try {
            await navigator.share({ title: "SMS TAMU", text: post.text });
          } catch (error) {
            // User cancelled the share sheet.
          }
        } else {
          try {
            await navigator.clipboard.writeText(post.text);
            showToast("Ujumbe umenakiliwa ili ushiriki.");
          } catch (error) {
            showToast(post.text);
          }
        }
        break;

      case "save":
        post.saved = !post.saved;
        saveState();
        renderHome();
        renderProfile();
        showToast(post.saved ? "Posti imehifadhiwa." : "Posti imeondolewa kwenye Saved.");
        break;

      case "likes":
        $("listDialogTitle").textContent = "Waliopenda posti";
        $("listDialogContent").innerHTML = post.likes
          ? '<div class="empty-state">Posti hii imependwa na ' + post.likes + ' watu (majina hayajapatikana kwenye demo).</div>'
          : '<div class="empty-state">Bado hakuna likes.</div>';
        $("listDialog").showModal();
        break;

      case "edit":
        openEditPost(post);
        break;

      case "delete":
        if (getOwnedPost(post) && confirm("Una uhakika unataka kufuta posti hii?")) {
          state.posts = state.posts.filter(item => item.id !== post.id);
          saveState();
          renderHome();
          renderProfile();
          showToast("Posti imefutwa.");
        }
        break;

      case "post-menu":
        openEditPost(post);
        break;
    }
  }
});

$("headerSearch").addEventListener("click", () => goToScreen("searchScreen"));
$("searchInput").addEventListener("input", event => { renderSearch(event.target.value); searchLiveUsers(event.target.value); });
$("postText").addEventListener("input", event => {
  $("characterCount").textContent = event.target.value.length + "/700";
});

$("postForm").addEventListener("submit", event => {
  event.preventDefault();
  const text = $("postText").value.trim();
  if (!text) return;
  state.posts.unshift({
    id: Date.now(), name: state.profile.name, username: state.profile.username,
    verified: false, category: $("postCategory").value, format: $("postFormat").value,
    status: "published", text, likes: 0, liked: false, saved: false,
    comments: [], mine: true, time: "Sasa"
  });
  saveState();
  $("postText").value = "";
  $("characterCount").textContent = "0/700";
  $("postFormat").value = "Ujumbe wa kawaida";
  activeCategory = "Vyote";
  document.querySelectorAll(".category").forEach(button => button.classList.toggle("active", button.dataset.category === "Vyote"));
  renderHome();
  renderProfile();
  goToScreen("homeScreen");
  showToast("Posti yako imechapishwa kwenye feed.");
});

$("closeComments").addEventListener("click", () => $("commentsDialog").close());
$("commentForm").addEventListener("submit", event => {
  event.preventDefault();
  const text = $("commentInput").value.trim();
  const post = state.posts.find(item => item.id === activeCommentPostId);
  if (!post || !text) return;

  post.comments.push({ name: state.profile.name, text });
  saveState();
  $("commentInput").value = "";
  openComments(post.id);
  renderHome();
  renderProfile();
  showToast("Maoni yametumwa.");
});

$("editProfile").addEventListener("click", openEditProfile);
$("closeProfile").addEventListener("click", () => $("profileDialog").close());
$("profileForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("editNameInput").value.trim();
  const username = $("editUsernameInput").value.trim().replace(/^@/, "").replace(/\s+/g, "").toLowerCase();
  const bio = $("editBioInput").value.trim();

  if (!name || !username) return;

  const oldUsername = state.profile.username;
  state.profile.name = name;
  state.profile.username = username;
  state.profile.bio = bio;

  state.posts.forEach(post => {
    if (post.username === oldUsername || post.mine) {
      post.name = name;
      post.username = username;
      post.mine = true;
    }
  });

  saveState();
  $("profileDialog").close();
  renderProfile();
  renderHome();
  showToast("Wasifu umehifadhiwa.");
});

$("chooseAvatar").addEventListener("click", () => $("avatarFile").click());
$("avatarFile").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Chagua picha pekee.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast("Picha iwe chini ya 2MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    state.profile.avatar = reader.result;
    saveState();
    renderProfile();
    showToast("Picha ya wasifu imebadilishwa.");
  };
  reader.readAsDataURL(file);
  event.target.value = "";
});

$("profileSettings").addEventListener("click", () => {
  $("settingsDetail").hidden = true;
  $("settingsDialog").showModal();
});
$("closeSettings").addEventListener("click", () => $("settingsDialog").close());

$("closeEditPost").addEventListener("click", () => $("editPostDialog").close());
$("editPostForm").addEventListener("submit", event => {
  event.preventDefault();

  const post = state.posts.find(item => item.id === activeEditPostId);
  if (!getOwnedPost(post)) return;

  const text = $("editPostText").value.trim();
  if (!text) return;

  post.text = text;
  post.category = $("editPostCategory").value;
  post.format = $("editPostFormat").value;
  saveState();
  $("editPostDialog").close();
  renderHome();
  renderProfile();
  renderSearch($("searchInput").value);
  showToast("Posti imehaririwa.");
});

$("closeListDialog").addEventListener("click", () => $("listDialog").close());

$("chatList").addEventListener("click", event => {
  const row = event.target.closest("[data-chat-id]");
  if (!row) return;

  activeChat = state.chats.find(chat => chat.id === row.dataset.chatId);
  if (!activeChat) return;

  $("chatUserName").textContent = activeChat.name;
  $("chatStatus").textContent = "Demo ya kifaa hiki";
  $("chatAvatar").textContent = activeChat.isGroup ? iconSVG("users") : activeChat.name.charAt(0).toUpperCase();
  $("groupSettingsButton").hidden = !activeChat.isGroup;
  $("pinnedBanner").hidden = !activeChat.isGroup;
  if (activeChat.isGroup) $("pinnedBanner").innerHTML = iconSVG("pin") + " Pinned: " + escapeHTML(activeChat.pinned || "Gusa kuona");
  $("chatWindow").hidden = false;
  renderMessages();
});

$("backToChats").addEventListener("click", closeChat);
$("chatForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!activeChat) return;

  const input = $("chatMessageInput");
  const text = input.value.trim();
  if (!text) return;

  state.messages[activeChat.id] = state.messages[activeChat.id] || [];
  state.messages[activeChat.id].push({
    text,
    name: state.profile.name,
    mine: true,
    time: new Date().toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" })
  });

  activeChat.last = text;
  saveState();
  input.value = "";
  renderMessages();
  renderChats();
  showToast("Ujumbe umehifadhiwa kwenye browser hii tu.");
});


$("groupSettingsButton").addEventListener("click", () => {
  if (!activeChat || !activeChat.isGroup) return;
  $("groupNameInput").value = activeChat.name;
  $("groupTopicInput").value = activeChat.topic || "";
  $("groupMuteInput").checked = Boolean(activeChat.muted);
  $("groupSettingsDialog").showModal();
});

$("closeGroupSettings").addEventListener("click", () => $("groupSettingsDialog").close());

$("groupSettingsForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!activeChat || !activeChat.isGroup) return;
  const name = $("groupNameInput").value.trim();
  if (!name) return;

  activeChat.name = name;
  activeChat.topic = $("groupTopicInput").value.trim() || "Kundi la SMS TAMU";
  activeChat.muted = $("groupMuteInput").checked;
  saveState();
  $("chatUserName").textContent = activeChat.name;
  $("chatStatus").textContent = activeChat.topic;
  renderChats();
  $("groupSettingsDialog").close();
  showToast("Mipangilio ya kundi imehifadhiwa kwenye demo.");
});

$("leaveGroupButton").addEventListener("click", () => {
  if (!activeChat || !activeChat.isGroup) return;
  if (!confirm("Una uhakika unataka kuondoka kwenye kundi hili?")) return;

  const groupId = activeChat.id;
  state.chats = state.chats.filter(chat => chat.id !== groupId);
  delete state.messages[groupId];
  saveState();
  $("groupSettingsDialog").close();
  closeChat();
  renderChats();
  showToast("Umeondoka kwenye kundi la demo.");
});

$("pinnedBanner").addEventListener("click", () => {
  if (!activeChat || !activeChat.isGroup) return;
  $("listDialogTitle").textContent = "Ujumbe uliopiniwa";
  $("listDialogContent").innerHTML = '<div class="comment-item">' + escapeHTML(activeChat.pinned || "Hakuna pinned message.") + '</div>';
  $("listDialog").showModal();
});

// Initial render
renderHome();
renderChats();
renderProfile();


// Supabase authentication + database-backed feed/admin.
const smsConfig = window.SMS_TAMU_SUPABASE;
const sbClient = window.supabase && smsConfig ? window.supabase.createClient(smsConfig.url, smsConfig.publishableKey) : null;
let signedInUser = null;
let signedInProfile = null;
let authMode = "login";

function authNotice(message, error) {
  $("authNotice").textContent = message || "";
  $("authNotice").classList.toggle("error", !!error);
}
function updateAuthMode() {
  const signup = authMode === "signup";
  $("authTitle").textContent = signup ? "Tengeneza akaunti" : "Ingia kwenye akaunti";
  $("authNameWrap").hidden = !signup;
  $("authDisplayName").required = signup;
  $("authSubmit").textContent = signup ? "Jisajili" : "Ingia";
  $("authSwitchText").textContent = signup ? "Una akaunti tayari?" : "Huna akaunti?";
  $("authSwitch").textContent = signup ? "Ingia" : "Jisajili";
  $("authForgot").hidden = signup;
  authNotice("");
}
async function loadCloudPosts() {
  if (!sbClient || !signedInUser) return;
  const { data, error } = await sbClient.from("posts")
    .select("id,user_id,content,category,format,status,created_at,profiles!posts_user_id_fkey(display_name,username,verified,avatar_url,premium_until)")
    .eq("status","published").order("created_at",{ascending:false}).limit(100);
  if (error) { showToast("Feed error: " + error.message); return; }
  const ids = (data || []).map(p => p.id);
  let likes = [], comments = [];
  if (ids.length) {
    const l = await sbClient.from("post_likes").select("post_id,user_id").in("post_id",ids);
    if (!l.error) likes = l.data || [];
    const c = await sbClient.from("comments").select("id,post_id,user_id,content,profiles!comments_user_id_fkey(display_name,username)").in("post_id",ids);
    if (!c.error) comments = c.data || [];
  }
  state.posts = (data || []).map(p => {
    const profile = Array.isArray(p.profiles) ? p.profiles[0] : (p.profiles || {});
    const postLikes = likes.filter(x => x.post_id === p.id);
    const postComments = comments.filter(x => x.post_id === p.id).map(x => {
      const cp = Array.isArray(x.profiles) ? x.profiles[0] : (x.profiles || {});
      return { id:x.id, name:cp.display_name || cp.username || "Mtumiaji", text:x.content };
    });
    return { id:p.id,userId:p.user_id,name:profile.display_name || profile.username || "Mtumiaji",
      username:profile.username || "user",avatar:profile.avatar_url || "",verified:!!profile.verified,
      premium:!!(profile.premium_until && new Date(profile.premium_until)>new Date()),
      category:p.category,format:p.format,text:p.content,status:p.status,
      time:new Date(p.created_at).toLocaleDateString("sw-TZ"),likes:postLikes.length,
      liked:postLikes.some(x=>x.user_id===signedInUser.id),saved:false,comments:postComments,
      mine:p.user_id===signedInUser.id };
  });
  renderHome(); renderSearch($("searchInput").value); searchLiveUsers($("searchInput").value); renderProfile();
}
async function loadUserProfile() {
  if (!signedInUser) return;
  let result = await sbClient.from("profiles").select("id,username,display_name,bio,avatar_url,role,verified,premium_until,is_private,notifications_enabled").eq("id",signedInUser.id).maybeSingle();
  if (!result.data) {
    await new Promise(resolve=>setTimeout(resolve,700));
    result = await sbClient.from("profiles").select("id,username,display_name,bio,avatar_url,role,verified,premium_until,is_private,notifications_enabled").eq("id",signedInUser.id).maybeSingle();
  }
  if (result.error || !result.data) { showToast("Profile haijapakiwa: "+(result.error?.message||"jaribu refresh")); return; }
  signedInProfile = result.data;
  state.profile = { name:result.data.display_name || "Mtumiaji",username:result.data.username || "user",
    bio:result.data.bio || "",avatar:result.data.avatar_url || "",verified:!!result.data.verified,
    role:result.data.role || "user",premiumUntil:result.data.premium_until };
  $("adminSetting").hidden = state.profile.role !== "admin";
  if ($("authDialog").open) $("authDialog").close();
  renderProfile();
  await loadCloudPosts();
}
async function initializeSMSAuth() {
  if (!sbClient) { $("authDialog").showModal(); authNotice("Supabase haijapakia; hakikisha internet ipo.",true); return; }
  if (!$("authDialog").open) $("authDialog").showModal();
  updateAuthMode();
  const { data } = await sbClient.auth.getSession();
  if (data.session) { signedInUser=data.session.user; await loadUserProfile(); }
  sbClient.auth.onAuthStateChange((_event,session)=>{
    signedInUser=session ? session.user : null;
    if (signedInUser) setTimeout(loadUserProfile,0);
    else { signedInProfile=null; $("adminSetting").hidden=true; if (!$("authDialog").open) $("authDialog").showModal(); }
  });
}
$("authSwitch").addEventListener("click",()=>{authMode=authMode==="login"?"signup":"login";updateAuthMode();});
$("authForm").addEventListener("submit",async event=>{
  event.preventDefault(); if(!sbClient)return;
  const email=$("authEmail").value.trim(),password=$("authPassword").value;
  $("authSubmit").disabled=true; authNotice(authMode==="signup"?"Inatengeneza akaunti...":"Inaingia...");
  try {
    if(authMode==="signup"){
      const {data,error}=await sbClient.auth.signUp({email,password,options:{data:{display_name:$("authDisplayName").value.trim()},emailRedirectTo:window.location.origin+window.location.pathname}});
      if(error)throw error;
      if(!data.session)authNotice("Akaunti imetengenezwa. Angalia email uthibitishe, kisha ingia.");
      else {signedInUser=data.user;await loadUserProfile();}
    } else {
      const {data,error}=await sbClient.auth.signInWithPassword({email,password});
      if(error)throw error;signedInUser=data.user;await loadUserProfile();
    }
  } catch(error){authNotice(error.message||"Imeshindikana kuingia.",true);}
  finally{$("authSubmit").disabled=false;}
});
$("authForgot").addEventListener("click",async()=>{
  const email=$("authEmail").value.trim();if(!email)return authNotice("Andika email kwanza.",true);
  const {error}=await sbClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
  authNotice(error?error.message:"Link ya password imetumwa ikiwa email imesajiliwa.",!!error);
});

let adminUsersCache=[];
let adminPostsCache=[];
function adminUserIsPremium(user){return !!(user.premium_until&&new Date(user.premium_until)>new Date());}
function filterAdminUsers(){
 const search=($("adminSearch")?.value||"").trim().toLowerCase(),filter=$("adminFilter")?.value||"all";
 return adminUsersCache.filter(user=>{
  const matchesSearch=(user.display_name||"").toLowerCase().includes(search)||(user.username||"").toLowerCase().includes(search);
  const premium=adminUserIsPremium(user);
  return matchesSearch&&(filter==="all"||(filter==="unverified"&&!user.verified)||(filter==="verified"&&user.verified)||(filter==="premium"&&premium)||(filter==="admins"&&user.role==="admin")||(filter==="normal"&&user.role!=="admin"));
 });
}
function renderAdminRows(){
 const users=filterAdminUsers();$("adminResultCount").textContent="Inaonyesha "+users.length+" kati ya "+adminUsersCache.length+" users";
 $("adminUsers").innerHTML=users.map(u=>{
  const premium=adminUserIsPremium(u),self=u.id===signedInUser.id;
  const tags='<div class="admin-user-tags">'+(u.verified?'<span class="tag-verified">✓ Verified</span>':'<span>Not verified</span>')+(premium?'<span class="tag-premium">✦ Premium</span>':'<span>Normal</span>')+(u.role==="admin"?'<span class="tag-admin">Admin</span>':'')+'</div>';
  const joined=u.created_at?new Date(u.created_at).toLocaleDateString("sw-TZ"):"";
  return '<article class="admin-user-row" data-user-id="'+escapeHTML(u.id)+'"><div class="admin-user-info"><strong>'+escapeHTML(u.display_name||u.username||"Mtumiaji")+(self?' <small>(Wewe)</small>':'')+'</strong><small>@'+escapeHTML(u.username||"user")+' · '+escapeHTML(joined)+'</small>'+tags+'</div><div class="admin-user-actions"><button data-admin-action="verify" data-value="'+(!u.verified)+'">'+(u.verified?"Ondoa Verify":"✓ Verify")+'</button><button data-admin-action="premium" data-value="'+(!premium)+'">'+(premium?"Ondoa Premium":"Premium +30d")+'</button><button data-admin-action="role" data-value="'+(u.role==="admin"?"user":"admin")+'" '+(self?'disabled title="Huwezi kubadilisha role yako hapa"':'')+'>'+(u.role==="admin"?"Ondoa Admin":"Make Admin")+'</button></div></article>';
 }).join("")||'<div class="empty-state">Hakuna user anayelingana na utafutaji huu.</div>';
}
async function renderAdminUsers(){
 if(!signedInUser||state.profile.role!=="admin")return;
 $("adminUsers").innerHTML='<div class="empty-state">Inapakia users...</div>';
 const {data,error}=await sbClient.from("profiles").select("id,username,display_name,role,verified,premium_until,created_at").order("created_at",{ascending:false}).limit(1000);
 if(error){$("adminUsers").innerHTML='<div class="empty-state">Imeshindwa kupakia: '+escapeHTML(error.message)+'</div>';return;}
 adminUsersCache=data||[];
 const verified=adminUsersCache.filter(u=>u.verified).length,premium=adminUsersCache.filter(adminUserIsPremium).length,admins=adminUsersCache.filter(u=>u.role==="admin").length;
 const [postsCount,commentsCount]=await Promise.all([
  sbClient.from("posts").select("id",{count:"exact",head:true}),
  sbClient.from("comments").select("id",{count:"exact",head:true})
 ]);
 $("adminStats").innerHTML='<div class="admin-stat"><small>Users</small><strong>'+adminUsersCache.length+'</strong></div><div class="admin-stat"><small>Verified</small><strong>'+verified+'</strong></div><div class="admin-stat"><small>Premium active</small><strong>'+premium+'</strong></div><div class="admin-stat"><small>Admins</small><strong>'+admins+'</strong></div><div class="admin-stat"><small>Posts</small><strong>'+(postsCount.count??"—")+'</strong></div><div class="admin-stat"><small>Comments</small><strong>'+(commentsCount.count??"—")+'</strong></div>';
 renderAdminRows();
}
async function renderAdminPosts(){
 if(!signedInUser||state.profile.role!=="admin")return;
 $("adminPosts").innerHTML='<div class="empty-state">Inapakia posts...</div>';
 const {data,error}=await sbClient.from("posts").select("id,user_id,content,category,status,created_at,profiles(display_name,username)").order("created_at",{ascending:false}).limit(500);
 if(error){$("adminPosts").innerHTML='<div class="empty-state">Posts hazijapakiwa: '+escapeHTML(error.message)+'</div>';return;}
 adminPostsCache=data||[];
 const term=($("adminPostSearch").value||"").trim().toLowerCase(),filter=$("adminPostFilter").value;
 const rows=adminPostsCache.filter(p=>{
  const pr=Array.isArray(p.profiles)?p.profiles[0]:(p.profiles||{});
  return (filter==="all"||p.status===filter)&&((p.content||"").toLowerCase().includes(term)||(pr.display_name||"").toLowerCase().includes(term)||(pr.username||"").toLowerCase().includes(term));
 });
 $("adminPostResultCount").textContent="Inaonyesha "+rows.length+" kati ya "+adminPostsCache.length+" posts";
 $("adminPosts").innerHTML=rows.map(p=>{
  const pr=Array.isArray(p.profiles)?p.profiles[0]:(p.profiles||{});
  const hidden=p.status==="removed";
  return '<article class="admin-post-row" data-admin-post-id="'+escapeHTML(p.id)+'"><div class="admin-post-meta"><strong>'+escapeHTML(pr.display_name||pr.username||"Mtumiaji")+' <small>@'+escapeHTML(pr.username||"user")+'</small></strong><span class="admin-post-status '+(hidden?'is-hidden':'')+'">'+(hidden?'Hidden':'Live')+' · '+escapeHTML(p.category||"Post")+' · '+escapeHTML(new Date(p.created_at).toLocaleDateString("sw-TZ"))+'</span><p>'+escapeHTML(p.content)+'</p></div><div class="admin-post-actions"><button data-post-moderate="'+(hidden?'published':'removed')+'">'+(hidden?'Rejesha post':'Ficha post')+'</button><button class="danger" data-post-delete="true">Futa kabisa</button></div></article>';
 }).join("")||'<div class="empty-state">Hakuna post inayolingana na utafutaji.</div>';
}
$("adminSearch").addEventListener("input",renderAdminRows);
$("adminFilter").addEventListener("change",renderAdminRows);
$("adminRefresh").addEventListener("click",renderAdminUsers);
$("adminPostSearch").addEventListener("input",renderAdminPosts);
$("adminPostFilter").addEventListener("change",renderAdminPosts);
$("adminPostsRefresh").addEventListener("click",renderAdminPosts);
document.querySelectorAll("[data-admin-tab]").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll("[data-admin-tab]").forEach(x=>x.classList.toggle("active",x===tab));$("adminUsersPane").classList.toggle("active",tab.dataset.adminTab==="users");$("adminPostsPane").classList.toggle("active",tab.dataset.adminTab==="posts");$("adminTextsPane").classList.toggle("active",tab.dataset.adminTab==="texts");if(tab.dataset.adminTab==="posts")renderAdminPosts();if(tab.dataset.adminTab==="texts")premiumAdminLoadTexts();}));
$("closeAdmin").addEventListener("click",()=>$("adminDialog").close());
$("adminPosts").addEventListener("click",async event=>{
 const button=event.target.closest("[data-post-moderate],[data-post-delete]");if(!button||state.profile.role!=="admin")return;
 const id=button.closest("[data-admin-post-id]").dataset.adminPostId;
 if(button.dataset.postDelete){
  if(!confirm("Futa kabisa post hii? Hili haliwezi kurudishwa."))return;
  const {error}=await sbClient.from("posts").delete().eq("id",id);
  if(error)return showToast("Post haijafutwa: "+error.message);
  showToast("Post imefutwa kabisa.");
 }else{
  const status=button.dataset.postModerate;
  const {error}=await sbClient.from("posts").update({status}).eq("id",id);
  if(error)return showToast("Moderation: "+error.message);
  showToast(status==="removed"?"Post imefichwa kutoka feed.":"Post imerudishwa live.");
 }
 await renderAdminPosts();await loadCloudPosts();
});
$("adminUsers").addEventListener("click",async event=>{
 const button=event.target.closest("[data-admin-action]");
 if(!button||state.profile.role!=="admin"||button.disabled)return;
 const id=button.closest("[data-user-id]").dataset.userId,action=button.dataset.adminAction,value=button.dataset.value;
 const user=adminUsersCache.find(item=>item.id===id);if(!user)return;
 const changes={};
 if(action==="verify")changes.verified=value==="true";
 if(action==="premium"){
  if(value==="true"&&!confirm("Mpe user huyu Premium kwa siku 30?"))return;
  changes.premium_until=value==="true"?new Date(Date.now()+30*86400000).toISOString():null;
 }
 if(action==="role"){
  if(!confirm(value==="admin"?"Mpe user huyu ruhusa za Admin? Admin ataweza kusimamia akaunti nyingine.":"Ondoa ruhusa za Admin kwa user huyu?"))return;
  changes.role=value;
 }
 button.disabled=true;
 const {error}=await sbClient.from("profiles").update(changes).eq("id",id);
 if(error){button.disabled=false;showToast("Action imekataliwa: "+error.message);return;}
 showToast(action==="verify"?(value==="true"?"User ameverified.":"Verification imeondolewa."):action==="premium"?(value==="true"?"Premium imeongezwa siku 30.":"Premium imeondolewa."):(value==="admin"?"Admin role imeongezwa.":"Admin role imeondolewa."));
 await renderAdminUsers();
 if(id===signedInUser.id)await loadUserProfile();
});
document.addEventListener("click",async event=>{
  const admin=event.target.closest('[data-setting="admin"]');
  if(admin&&state.profile.role==="admin"){event.preventDefault();event.stopImmediatePropagation();$("settingsDialog").close();$("adminDialog").showModal();await renderAdminUsers();await renderAdminPosts();}
},true);
document.addEventListener("click",async event=>{
  const logout=event.target.closest('[data-setting="logout"]');
  if(!logout||!sbClient||!signedInUser)return;
  event.preventDefault();event.stopImmediatePropagation();
  await sbClient.auth.signOut();signedInUser=null;state=loadState();renderHome();renderProfile();renderChats();
  $("settingsDialog").close();$("authForm").reset();authMode="login";updateAuthMode();$("authDialog").showModal();
},true);

// Use the cloud database for post creation and likes, not browser-only demo storage.
$("postForm").addEventListener("submit",async event=>{
  event.preventDefault();event.stopImmediatePropagation();
  if(!signedInUser)return showToast("Ingia kwanza ili kupost.");
  const content=$("postText").value.trim();if(!content)return;
  const {error}=await sbClient.from("posts").insert({user_id:signedInUser.id,content,category:$("postCategory").value,format:$("postFormat").value,status:"published"});
  if(error)return showToast("Posti haijatumwa: "+error.message);
  $("postText").value="";$("characterCount").textContent="0/700";$("postFormat").value="Ujumbe wa kawaida";
  await loadCloudPosts();goToScreen("homeScreen");showToast("Posti imechapishwa kwenye feed.");
},true);
document.addEventListener("click",async event=>{
  const button=event.target.closest('[data-action="like"]');if(!button)return;
  event.preventDefault();event.stopImmediatePropagation();
  const post=getPostFromElement(button);if(!post||!signedInUser)return;
  const response=post.liked
    ? await sbClient.from("post_likes").delete().eq("post_id",post.id).eq("user_id",signedInUser.id)
    : await sbClient.from("post_likes").insert({post_id:post.id,user_id:signedInUser.id});
  if(response.error)return showToast("Like error: "+response.error.message);
  await loadCloudPosts();
},true);

initializeSMSAuth();


// SMS TAMU LIVE LAYER — database-backed profile, social actions, realtime feed and chat.
let liveChannel = null;
let liveRefreshTimer = null;

function getPostFromElement(element) {
  const card = element.closest("[data-post-id]");
  if (!card) return null;
  return state.posts.find(post => String(post.id) === String(card.dataset.postId)) || null;
}

async function loadCloudPosts() {
  if (!sbClient || !signedInUser) return;
  const { data, error } = await sbClient.from("posts")
    .select("id,user_id,content,category,format,status,created_at,profiles(display_name,username,verified,avatar_url,premium_until)")
    .eq("status","published").order("created_at",{ascending:false}).limit(100);
  if (error) { showToast("Feed haijapakiwa: " + error.message); return; }
  const ids=(data||[]).map(p=>p.id);
  let likes=[],comments=[],saved=[];
  if(ids.length){
    const [l,c,s]=await Promise.all([
      sbClient.from("post_likes").select("post_id,user_id").in("post_id",ids),
      sbClient.from("comments").select("id,post_id,user_id,content,created_at,profiles(display_name,username)").in("post_id",ids).order("created_at",{ascending:true}),
      sbClient.from("saved_posts").select("post_id").eq("user_id",signedInUser.id).in("post_id",ids)
    ]);
    if(!l.error)likes=l.data||[];
    if(!c.error)comments=c.data||[];
    if(!s.error)saved=(s.data||[]).map(x=>x.post_id);
  }
  state.posts=(data||[]).map(p=>{
    const profile=Array.isArray(p.profiles)?p.profiles[0]:(p.profiles||{});
    const postLikes=likes.filter(x=>x.post_id===p.id);
    const postComments=comments.filter(x=>x.post_id===p.id).map(x=>{
      const cp=Array.isArray(x.profiles)?x.profiles[0]:(x.profiles||{});
      return {id:x.id,userId:x.user_id,name:cp.display_name||cp.username||"Mtumiaji",text:x.content,time:new Date(x.created_at).toLocaleTimeString("sw-TZ",{hour:"2-digit",minute:"2-digit"})};
    });
    return {id:p.id,userId:p.user_id,name:profile.display_name||profile.username||"Mtumiaji",
      username:profile.username||"user",avatar:profile.avatar_url||"",verified:!!profile.verified,
      premium:!!(profile.premium_until&&new Date(profile.premium_until)>new Date()),
      category:p.category,format:p.format,text:p.content,status:p.status,
      time:new Date(p.created_at).toLocaleDateString("sw-TZ"),likes:postLikes.length,
      liked:postLikes.some(x=>x.user_id===signedInUser.id),saved:saved.includes(p.id),
      comments:postComments,mine:p.user_id===signedInUser.id};
  });
  renderHome();renderSearch($("searchInput").value);searchLiveUsers($("searchInput").value);renderProfile();
}

async function loadLiveSocial() {
  if(!signedInUser)return;
  const [followingResult,followersResult]=await Promise.all([
    sbClient.from("follows").select("followed_id").eq("follower_id",signedInUser.id),
    sbClient.from("follows").select("follower_id").eq("followed_id",signedInUser.id)
  ]);
  if(followingResult.error||followersResult.error){
    showToast("Follow list haijapakiwa: "+(followingResult.error||followersResult.error).message);return;
  }
  const followingIds=(followingResult.data||[]).map(x=>x.followed_id);
  const followerIds=(followersResult.data||[]).map(x=>x.follower_id);
  const allIds=[...new Set([...followingIds,...followerIds])];
  let profiles=[];
  if(allIds.length){
    const result=await sbClient.from("profiles").select("id,username,display_name,avatar_url,verified,premium_until").in("id",allIds);
    if(!result.error)profiles=result.data||[];
  }
  const map=new Map(profiles.map(p=>[p.id,p]));
  const person=id=>{const p=map.get(id)||{};return {id,name:p.display_name||p.username||"Mtumiaji",username:p.username||"user",avatar:p.avatar_url||"",verified:!!p.verified,premium:!!(p.premium_until&&new Date(p.premium_until)>new Date())};};
  state.following=followingIds.map(person);state.followers=followerIds.map(person);
  renderProfile();
}

async function loadLiveChats() {
  if(!signedInUser)return;
  const memberships=await sbClient.from("conversation_members").select("conversation_id").eq("user_id",signedInUser.id);
  if(memberships.error){showToast("Chat haijapakiwa: "+memberships.error.message);return;}
  const ids=(memberships.data||[]).map(x=>x.conversation_id);
  if(!ids.length){state.chats=[];renderChats();return;}
  const [conversations,members,messages]=await Promise.all([
    sbClient.from("conversations").select("id,title,is_group,created_by,created_at").in("id",ids).order("created_at",{ascending:false}),
    sbClient.from("conversation_members").select("conversation_id,user_id").in("conversation_id",ids),
    sbClient.from("messages").select("id,conversation_id,content,sender_id,created_at").in("conversation_id",ids).order("created_at",{ascending:false}).limit(300)
  ]);
  if(conversations.error){showToast("Mazungumzo haijapakiwa: "+conversations.error.message);return;}
  const userIds=[...new Set((members.data||[]).map(x=>x.user_id).filter(id=>id!==signedInUser.id))];
  let profiles=[];
  if(userIds.length){const p=await sbClient.from("profiles").select("id,username,display_name,avatar_url").in("id",userIds);if(!p.error)profiles=p.data||[];}
  const profileMap=new Map(profiles.map(p=>[p.id,p]));
  state.chats=(conversations.data||[]).map(c=>{
    const other=(members.data||[]).find(m=>m.conversation_id===c.id&&m.user_id!==signedInUser.id);
    const p=other?profileMap.get(other.user_id):null;
    const latest=(messages.data||[]).find(m=>m.conversation_id===c.id);
    return {id:c.id,name:c.is_group?(c.title||"Kundi"):(p?.display_name||p?.username||"Mazungumzo"),
      isGroup:!!c.is_group,otherUserId:other?.user_id||null,last:latest?.content||"Anza mazungumzo",
      createdAt:c.created_at};
  });
  renderChats();
}

async function loadLiveMessages(conversationId) {
  if(!signedInUser||!conversationId)return;
  const {data,error}=await sbClient.from("messages")
    .select("id,conversation_id,sender_id,content,created_at,profiles(display_name,username)")
    .eq("conversation_id",conversationId).order("created_at",{ascending:true}).limit(300);
  if(error){showToast("Ujumbe haujapakiwa: "+error.message);return;}
  state.messages[conversationId]=(data||[]).map(m=>{
    const p=Array.isArray(m.profiles)?m.profiles[0]:(m.profiles||{});
    return {id:m.id,text:m.content,name:p.display_name||p.username||"Mtumiaji",mine:m.sender_id===signedInUser.id,
      time:new Date(m.created_at).toLocaleTimeString("sw-TZ",{hour:"2-digit",minute:"2-digit"})};
  });
  renderMessages();
  const chat=state.chats.find(c=>c.id===conversationId);
  if(chat&&state.messages[conversationId].length)chat.last=state.messages[conversationId].at(-1).text;
  renderChats();
}

function renderChats() {
  $("chatList").innerHTML=state.chats.map(chat=>
    '<button class="chat-row" data-chat-id="'+escapeHTML(chat.id)+'">'+
    '<span class="avatar pink">'+(chat.isGroup?iconSVG("users"):escapeHTML((chat.name||"U").charAt(0).toUpperCase()))+'</span>'+
    '<span class="chat-preview"><strong>'+escapeHTML(chat.name)+'</strong><p>'+escapeHTML(chat.last||"Anza mazungumzo")+'</p></span>'+
    '<time>'+(chat.isGroup?"Kundi":"DM")+'</time></button>'
  ).join("")||'<div class="empty-state">Hakuna mazungumzo. Tafuta mtu kwenye wafuasi na gusa Message.</div>';
}

function renderMessages() {
  if(!activeChat)return;
  const messages=state.messages[activeChat.id]||[];
  $("chatMessages").innerHTML=messages.length?messages.map(message=>
    '<div class="bubble '+(message.mine?"mine":"")+'">'+
    (message.name&&!message.mine?'<strong class="bubble-name">'+escapeHTML(message.name)+'</strong>':"")+
    escapeHTML(message.text)+'<small>'+escapeHTML(message.time||"Sasa")+'</small></div>'
  ).join(""):'<div class="empty-state">Bado hakuna ujumbe. Tuma salamu ya kwanza.</div>';
  $("chatMessages").scrollTop=$("chatMessages").scrollHeight;
}

async function openLiveChat(chat) {
  if(!chat||!signedInUser)return;
  activeChat=chat;
  $("chatUserName").textContent=chat.name;
  $("chatStatus").textContent=chat.isGroup?"SMS TAMU · Live":"Mazungumzo ya faragha";
  $("chatAvatar").innerHTML=chat.isGroup?iconSVG("users"):escapeHTML((chat.name||"U").charAt(0).toUpperCase());
  $("groupSettingsButton").hidden=true;
  $("pinnedBanner").hidden=true;
  $("chatWindow").hidden=false;
  await loadLiveMessages(chat.id);
}

function openProfileList(type) {
  const list=type==="following"?state.following:state.followers;
  $("listDialogTitle").textContent=type==="following"?"Unafuata":"Wafuasi";
  $("listDialogContent").innerHTML=list.length?list.map(person=>{
    const isFollowing=state.following.some(item=>item.id===person.id);
    const action=type==="following"
      ?'<button class="person-action" data-unfollow="'+escapeHTML(person.id)+'">Unafuata</button>'
      :(isFollowing?'<button class="person-action" data-unfollow="'+escapeHTML(person.id)+'">Unafuata</button>':'<button class="person-action" data-follow="'+escapeHTML(person.id)+'">Fuata</button>');
    return '<div class="person-row"><span class="avatar pink">'+escapeHTML((person.name||"U").charAt(0).toUpperCase())+'</span>'+
      '<span class="person-info"><strong>'+escapeHTML(person.name)+'</strong><small>@'+escapeHTML(person.username)+'</small></span>'+
      '<div class="person-actions-live">'+action+'<button class="person-action" data-message-user-id="'+escapeHTML(person.id)+'">Message</button></div></div>';
  }).join(""):'<div class="empty-state">Orodha bado haina mtu.</div>';
  $("listDialog").showModal();
}

function startLiveSubscriptions() {
  if(!sbClient||!signedInUser)return;
  if(liveChannel)sbClient.removeChannel(liveChannel);
  liveChannel=sbClient.channel("sms-tamu-live-"+signedInUser.id)
    .on("postgres_changes",{event:"*",schema:"public",table:"posts"},()=>{loadCloudPosts();if($("adminDialog").open){renderAdminPosts();renderAdminUsers();}})
    .on("postgres_changes",{event:"*",schema:"public",table:"comments"},()=>loadCloudPosts())
    .on("postgres_changes",{event:"*",schema:"public",table:"post_likes"},()=>loadCloudPosts())
    .on("postgres_changes",{event:"*",schema:"public",table:"saved_posts"},()=>loadCloudPosts())
    .on("postgres_changes",{event:"*",schema:"public",table:"follows"},()=>loadLiveSocial())
    .on("postgres_changes",{event:"*",schema:"public",table:"profiles"},payload=>{
      const p=payload.new;
      if(p&&p.id===signedInUser.id){
        state.profile={...state.profile,name:p.display_name||state.profile.name,username:p.username||state.profile.username,
          bio:p.bio||"",avatar:p.avatar_url||"",verified:!!p.verified,role:p.role||"user",
          premiumUntil:p.premium_until,privacy:p.is_private?"private":"public",notifications:p.notifications_enabled!==false};
        $("adminSetting").hidden=state.profile.role!=="admin";renderProfile();
      }else loadCloudPosts();
    })
    .on("postgres_changes",{event:"*",schema:"public",table:"conversation_members"},()=>loadLiveChats())
    .on("postgres_changes",{event:"*",schema:"public",table:"conversations"},()=>loadLiveChats())
    .on("postgres_changes",{event:"*",schema:"public",table:"messages"},payload=>{
      const conversationId=payload.new?.conversation_id||payload.old?.conversation_id;
      if(activeChat&&activeChat.id===conversationId)loadLiveMessages(conversationId);
      else loadLiveChats();
    })
    .subscribe();
}

async function loadUserProfile() {
  if(!signedInUser||!sbClient)return;
  let result=await sbClient.from("profiles").select("id,username,display_name,bio,avatar_url,role,verified,premium_until,is_private,notifications_enabled").eq("id",signedInUser.id).maybeSingle();
  if(!result.data){await new Promise(resolve=>setTimeout(resolve,600));result=await sbClient.from("profiles").select("id,username,display_name,bio,avatar_url,role,verified,premium_until,is_private,notifications_enabled").eq("id",signedInUser.id).maybeSingle();}
  if(result.error||!result.data){showToast("Profile haijapakiwa: "+(result.error?.message||"refresh"));return;}
  signedInProfile=result.data;
  state.profile={name:result.data.display_name||"Mtumiaji",username:result.data.username||"user",
    bio:result.data.bio||"",avatar:result.data.avatar_url||"",verified:!!result.data.verified,
    role:result.data.role||"user",premiumUntil:result.data.premium_until,privacy:result.data.is_private?"private":"public",notifications:result.data.notifications_enabled!==false};
  $("adminSetting").hidden=state.profile.role!=="admin";
  if($("authDialog").open)$("authDialog").close();
  renderProfile();
  await Promise.all([loadCloudPosts(),loadLiveSocial(),loadLiveChats()]);
  startLiveSubscriptions();
}

document.addEventListener("click",async event=>{
  const chatRow=event.target.closest("[data-chat-id]");
  if(chatRow&&$("chatList").contains(chatRow)){
    event.preventDefault();event.stopImmediatePropagation();
    const chat=state.chats.find(c=>String(c.id)===String(chatRow.dataset.chatId));
    await openLiveChat(chat);return;
  }
  const messageButton=event.target.closest("[data-message-user-id]");
  if(messageButton){
    event.preventDefault();event.stopImmediatePropagation();
    const targetId=messageButton.dataset.messageUserId;
    const {data,error}=await sbClient.rpc("start_direct_chat",{target_user:targetId});
    if(error){showToast("Chat haijaanzishwa: "+error.message);return;}
    $("listDialog").close();await loadLiveChats();
    const chat=state.chats.find(c=>c.id===data);
    if(chat)await openLiveChat(chat);
    return;
  }
  const follow=event.target.closest("[data-follow]");
  if(follow){
    event.preventDefault();event.stopImmediatePropagation();
    const {error}=await sbClient.from("follows").insert({follower_id:signedInUser.id,followed_id:follow.dataset.follow});
    if(error&&error.code!=="23505")return showToast("Follow: "+error.message);
    await loadLiveSocial();if(follow.closest(".search-user-row"))searchLiveUsers($("searchInput").value);else openProfileList("followers");return;
  }
  const unfollow=event.target.closest("[data-unfollow]");
  if(unfollow){
    event.preventDefault();event.stopImmediatePropagation();
    const {error}=await sbClient.from("follows").delete().eq("follower_id",signedInUser.id).eq("followed_id",unfollow.dataset.unfollow);
    if(error)return showToast("Unfollow: "+error.message);
    await loadLiveSocial();if(unfollow.closest(".search-user-row"))searchLiveUsers($("searchInput").value);else openProfileList("following");return;
  }
  const save=event.target.closest('[data-action="save"]');
  if(save){
    event.preventDefault();event.stopImmediatePropagation();
    const post=getPostFromElement(save);if(!post)return;
    const result=post.saved
      ?await sbClient.from("saved_posts").delete().eq("user_id",signedInUser.id).eq("post_id",post.id)
      :await sbClient.from("saved_posts").insert({user_id:signedInUser.id,post_id:post.id});
    if(result.error)return showToast("Save: "+result.error.message);
    await loadCloudPosts();return;
  }
  const edit=event.target.closest('[data-action="edit"]');
  if(edit){
    const post=getPostFromElement(edit);if(!post)return;
    event.preventDefault();event.stopImmediatePropagation();
    activeEditPostId=post.id;$("editPostCategory").value=post.category;$("editPostFormat").value=post.format||"Ujumbe wa kawaida";$("editPostText").value=post.text;$("editPostDialog").showModal();return;
  }
  const remove=event.target.closest('[data-action="delete"]');
  if(remove){
    const post=getPostFromElement(remove);if(!post)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!confirm("Una uhakika unataka kufuta posti hii?"))return;
    const {error}=await sbClient.from("posts").delete().eq("id",post.id).eq("user_id",signedInUser.id);
    if(error)return showToast("Posti haijafutwa: "+error.message);
    await loadCloudPosts();showToast("Posti imefutwa.");return;
  }
},true);

$("commentForm").addEventListener("submit",async event=>{
  event.preventDefault();event.stopImmediatePropagation();
  if(!signedInUser)return showToast("Ingia kwanza.");
  const content=$("commentInput").value.trim();if(!content)return;
  const post=state.posts.find(p=>String(p.id)===String(activeCommentPostId));if(!post)return;
  const {error}=await sbClient.from("comments").insert({post_id:post.id,user_id:signedInUser.id,content});
  if(error)return showToast("Maoni: "+error.message);
  $("commentInput").value="";await loadCloudPosts();openComments(post.id);
},true);

$("profileForm").addEventListener("submit",async event=>{
  event.preventDefault();event.stopImmediatePropagation();
  const display_name=$("editNameInput").value.trim();
  const username=$("editUsernameInput").value.trim().replace(/^@/,"").replace(/\s+/g,"").toLowerCase();
  const bio=$("editBioInput").value.trim();
  if(!display_name||!username)return;
  const {error}=await sbClient.from("profiles").update({display_name,username,bio}).eq("id",signedInUser.id);
  if(error)return showToast("Wasifu: "+error.message);
  $("profileDialog").close();await loadUserProfile();showToast("Wasifu umehifadhiwa live.");
},true);

$("editPostForm").addEventListener("submit",async event=>{
  event.preventDefault();event.stopImmediatePropagation();
  const content=$("editPostText").value.trim();if(!content)return;
  const {error}=await sbClient.from("posts").update({content,category:$("editPostCategory").value,format:$("editPostFormat").value}).eq("id",activeEditPostId).eq("user_id",signedInUser.id);
  if(error)return showToast("Hariri posti: "+error.message);
  $("editPostDialog").close();await loadCloudPosts();showToast("Posti imebadilishwa live.");
},true);

$("chatForm").addEventListener("submit",async event=>{
  event.preventDefault();event.stopImmediatePropagation();
  if(!activeChat||!signedInUser)return;
  const input=$("chatMessageInput"),content=input.value.trim();if(!content)return;
  const {error}=await sbClient.from("messages").insert({conversation_id:activeChat.id,sender_id:signedInUser.id,content});
  if(error)return showToast("Ujumbe: "+error.message);
  input.value="";await loadLiveMessages(activeChat.id);await loadLiveChats();
},true);

$("avatarFile").addEventListener("change",async event=>{
  const file=event.target.files?.[0];if(!file)return;
  if(!file.type.startsWith("image/")){showToast("Chagua picha pekee.");event.target.value="";return;}
  if(file.size>2*1024*1024){showToast("Picha iwe chini ya 2MB.");event.target.value="";return;}
  const extension=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
  const path=signedInUser.id+"/avatar-"+Date.now()+"."+extension;
  const {error:uploadError}=await sbClient.storage.from("sms-tamu-avatars").upload(path,file,{upsert:true,contentType:file.type});
  if(uploadError){showToast("Picha: "+uploadError.message);event.target.value="";return;}
  const {data}=sbClient.storage.from("sms-tamu-avatars").getPublicUrl(path);
  const {error}=await sbClient.from("profiles").update({avatar_url:data.publicUrl}).eq("id",signedInUser.id);
  if(error){showToast("Wasifu picha: "+error.message);event.target.value="";return;}
  event.target.value="";await loadUserProfile();showToast("Picha ya wasifu imehifadhiwa live.");
},true);

// Remove old demo-only chat and privacy descriptions once the live session starts.
const liveHelp=document.querySelector('[data-setting="help"]');
if(liveHelp)liveHelp.querySelector("small").textContent="Msaada na maelezo ya SMS TAMU";


function openSettingsDetail(type) {
  const detail=$("settingsDetail");detail.hidden=false;
  if(type==="privacy"){
    detail.innerHTML='<h3>Faragha ya wasifu</h3>'+
      '<label class="setting-choice"><input type="radio" name="privacy" value="public" '+(state.profile.privacy!=="private"?"checked":"")+'> Wasifu wa wazi</label>'+
      '<label class="setting-choice"><input type="radio" name="privacy" value="private" '+(state.profile.privacy==="private"?"checked":"")+'> Wasifu wa faragha</label>'+
      '<button class="primary-button" id="savePrivacy">Hifadhi</button>';
    $("savePrivacy").addEventListener("click",async()=>{
      const is_private=document.querySelector('input[name="privacy"]:checked').value==="private";
      const {error}=await sbClient.from("profiles").update({is_private}).eq("id",signedInUser.id);
      if(error)return showToast("Faragha: "+error.message);
      state.profile.privacy=is_private?"private":"public";detail.hidden=true;showToast("Faragha imehifadhiwa.");
    });
  }else if(type==="notifications"){
    detail.innerHTML='<h3>Arifa za SMS TAMU</h3><label class="setting-choice"><input type="checkbox" id="notificationToggle" '+(state.profile.notifications!==false?"checked":"")+'> Ruhusu arifa ndani ya app</label><button class="primary-button" id="saveNotifications">Hifadhi</button><p class="form-hint">Hii huhifadhi upendeleo wako. Push notifications za simu zitaongezwa baadaye.</p>';
    $("saveNotifications").addEventListener("click",async()=>{
      const notifications_enabled=$("notificationToggle").checked;
      const {error}=await sbClient.from("profiles").update({notifications_enabled}).eq("id",signedInUser.id);
      if(error)return showToast("Arifa: "+error.message);
      state.profile.notifications=notifications_enabled;detail.hidden=true;showToast("Upendeleo wa arifa umehifadhiwa.");
    });
  }else if(type==="help"){
    detail.innerHTML="<h3>Msaada wa SMS TAMU</h3><p>Feed, likes, comments, profile, follow na chat zimeunganishwa na Supabase. Ujumbe wa chat huonekana kwa washiriki wa mazungumzo pekee.</p>";
  }
}

/* Premium text library: RLS-enforced access, favorites, collections, daily text and generator */
let premiumTextsCache=[],premiumFavorites=new Set(),premiumCollections=[],premiumCurrentView="library",premiumCurrentCategory="all",premiumDailyContent="";
let premiumEditingId=null;
const premiumActive=()=>state.profile.role==="admin"||(state.profile.premiumUntil&&new Date(state.profile.premiumUntil)>new Date());
function premiumNeedLogin(){if(!signedInUser){showToast("Ingia kwanza kutumia Premium Library.");$("authDialog").showModal();return false;}return true;}
async function premiumLoad(){
 if(!sbClient||!signedInUser){$("premiumLibraryList").innerHTML='<div class="empty-state">Ingia ili kutumia library.</div>';return;}
 const active=premiumActive();$("premiumLocked").hidden=active;
 const {data,error}=await sbClient.from("premium_texts").select("id,title,content,category,collection,is_premium,is_daily,featured,status,created_at").order("created_at",{ascending:false}).limit(500);
 if(error){$("premiumLibraryList").innerHTML='<div class="empty-state">Library: '+escapeHTML(error.message)+'</div>';return;}
 premiumTextsCache=data||[];
 if(active){
  const fav=await sbClient.from("premium_text_favorites").select("text_id").eq("user_id",signedInUser.id);
  premiumFavorites=new Set((fav.data||[]).map(x=>x.text_id));
  const cols=await sbClient.from("premium_text_collections").select("id,name,created_at").eq("user_id",signedInUser.id).order("created_at",{ascending: false});
  premiumCollections=cols.data||[];
  const dailyTexts=premiumTextsCache.filter(x=>x.is_daily&&x.status==="published");const dayNumber=Math.floor(Date.now()/86400000);const daily=dailyTexts.length?dailyTexts[dayNumber%dailyTexts.length]:null;
  premiumDailyContent=daily?daily.content:"Daily text itaongezwa hivi karibuni.";
 }else{
  premiumFavorites=new Set();premiumCollections=[];premiumDailyContent="Daily Premium Text ni kwa akaunti yenye Premium hai.";
 }
 $("premiumDailyText").textContent=premiumDailyContent;
 $("premiumCollectionsPanel").hidden=premiumCurrentView!=="collections";
 premiumRenderCollections();premiumRenderLibrary();
}
function premiumRenderCollections(){
 const target=$("premiumCollectionList");if(!target)return;
 target.innerHTML=premiumCollections.map(c=>'<div class="premium-collection-row"><span>'+escapeHTML(c.name)+'</span><button type="button" data-premium-open-collection="'+escapeHTML(c.id)+'">Fungua</button></div>').join("")||'<div class="empty-state">Bado huna collections.</div>';
}
function premiumRenderLibrary(){
 const target=$("premiumLibraryList");if(!target)return;
 const active=premiumActive();
 let list=premiumTextsCache.filter(t=>t.status==="published"&&(!t.is_premium||active));
 if(premiumCurrentView==="favorites")list=list.filter(t=>premiumFavorites.has(t.id));
 if(premiumCurrentCategory!=="all")list=list.filter(t=>t.category===premiumCurrentCategory);
 target.innerHTML=list.map(t=>'<article class="premium-text-card" data-premium-text="'+escapeHTML(t.id)+'"><div class="premium-text-meta"><span>'+escapeHTML(t.category)+'</span><span>'+escapeHTML(t.collection||"Library")+'</span>'+(t.is_premium?'<span>✦ Premium</span>':'<span>Free</span>')+(t.featured?'<span>Featured</span>':'')+'</div><h3>'+escapeHTML(t.title||"Ujumbe")+'</h3><p>'+escapeHTML(t.content)+'</p><div class="premium-text-actions"><button type="button" data-premium-copy>Copy</button>'+(active?'<button type="button" data-premium-fav="'+(premiumFavorites.has(t.id)?"true":"false")+'">'+(premiumFavorites.has(t.id)?"★ Saved":"☆ Favorite")+'</button><button type="button" data-premium-collect>Add to collection</button>':'')+'</div></article>').join("")||'<div class="empty-state">'+(premiumCurrentView==="favorites"?"Bado hujahifadhi favorites.":"Hakuna text kwenye category hii.")+'</div>';
}
document.querySelectorAll("[data-premium-view]").forEach(btn=>btn.addEventListener("click",()=>{premiumCurrentView=btn.dataset.premiumView;document.querySelectorAll("[data-premium-view]").forEach(x=>x.classList.toggle("active",x===btn));$("premiumCollectionsPanel").hidden=premiumCurrentView!=="collections";premiumRenderLibrary();}));
document.querySelectorAll("[data-premium-category]").forEach(btn=>btn.addEventListener("click",()=>{premiumCurrentCategory=btn.dataset.premiumCategory;document.querySelectorAll("[data-premium-category]").forEach(x=>x.classList.toggle("active",x===btn));premiumRenderLibrary();}));
$("premiumRefreshAccess").addEventListener("click",async()=>{await loadUserProfile();await premiumLoad();});
$("premiumDailyCopy").addEventListener("click",async()=>{if(!premiumDailyContent)return;try{await navigator.clipboard.writeText(premiumDailyContent);showToast("Daily text copied.");}catch{showToast("Copy haikufanikiwa.");}});
const premiumTemplates={
 sweet:["{name}, napenda namna unavyofanya mambo madogo yaonekane ya thamani. Asante kwa kuwa sehemu nzuri ya siku yangu.","Nikikuwaza {name}, moyo wangu unapata utulivu na sababu ya kutabasamu. Natamani tuendelee kujenga furaha kwa heshima na ukweli."],
 playful:["{name}, usijifanye hujui kuwa una kipaji cha kunifanya nicheke. Leo umeshinda tena tuzo ya mtu anayenifurahisha.","Nimejaribu kuwa serious leo, lakini nikakumbuka utani wako {name} na nikashindwa kujizuia kutabasamu."],
 missing:["{name}, nimekumbuka mazungumzo yetu. Natumaini siku yako inaenda vizuri na unapata muda wa kupumzika.","Kuna ukaribu unaobaki moyoni hata tukiwa mbali. Nimekukumbuka {name}, na nakutakia siku yenye amani."],
 apology:["{name}, samahani kwa nilipokukwaza. Nataka kuelewa hisia zako, kusikiliza kwa makini na kurekebisha nilipokosea.","Nathamini uhusiano wetu {name}. Sitaki maneno yangu yaumize; naomba nafasi ya kuelewa na kufanya vizuri zaidi."],
 encourage:["{name}, hatua ndogo unazochukua zina maana. Jipe muda, endelea kujifunza na usisahau kujivunia maendeleo yako.","Najua kuna siku zinahitaji nguvu zaidi, {name}. Usikate tamaa; pumzika unapohitaji na endelea hatua kwa hatua."]
};
let premiumGeneratedText="";
$("premiumGenerate").addEventListener("click",()=>{const n=$("premiumGenName").value.trim()||"rafiki yangu",m=$("premiumGenMood").value,arr=premiumTemplates[m]||premiumTemplates.sweet;premiumGeneratedText=arr[Math.floor(Math.random()*arr.length)].replaceAll("{name}",n);$("premiumGenerated").textContent=premiumGeneratedText;$("premiumGeneratedCopy").hidden=false;});
$("premiumGeneratedCopy").addEventListener("click",async()=>{if(!premiumGeneratedText)return;try{await navigator.clipboard.writeText(premiumGeneratedText);showToast("Ujumbe copied.");}catch{showToast("Copy haikufanikiwa.");}});
$("premiumCollectionCreate").addEventListener("click",async()=>{if(!premiumNeedLogin()||!premiumActive())return showToast("Collections ni kwa Premium active.");const name=$("premiumCollectionName").value.trim();if(!name)return showToast("Weka jina la collection.");const {data,error}=await sbClient.from("premium_text_collections").insert({user_id:signedInUser.id,name}).select("id,name").single();if(error)return showToast("Collection: "+error.message);premiumCollections.unshift(data);$("premiumCollectionName").value="";premiumRenderCollections();showToast("Collection imetengenezwa.");});
$("premiumCollectionList").addEventListener("click",async e=>{const b=e.target.closest("[data-premium-open-collection]");if(!b)return;const {data,error}=await sbClient.from("premium_text_collection_items").select("text_id").eq("collection_id",b.dataset.premiumOpenCollection).eq("user_id",signedInUser.id);if(error)return showToast("Collection: "+error.message);premiumCurrentView="library";premiumCurrentCategory="all";const ids=new Set((data||[]).map(x=>x.text_id));$("premiumCollectionsPanel").hidden=true;document.querySelectorAll("[data-premium-view]").forEach(x=>x.classList.toggle("active",x.dataset.premiumView==="library"));const items=premiumTextsCache.filter(t=>ids.has(t.id)&&t.status==="published");$("premiumLibraryList").innerHTML=items.map(t=>'<article class="premium-text-card" data-premium-text="'+escapeHTML(t.id)+'"><div class="premium-text-meta"><span>'+escapeHTML(t.category)+'</span></div><h3>'+escapeHTML(t.title)+'</h3><p>'+escapeHTML(t.content)+'</p><div class="premium-text-actions"><button type="button" data-premium-copy>Copy</button></div></article>').join("")||'<div class="empty-state">Collection hii haina ujumbe bado.</div>';});
$("premiumLibraryList").addEventListener("click",async e=>{
 const card=e.target.closest("[data-premium-text]");if(!card)return;const t=premiumTextsCache.find(x=>x.id===card.dataset.premiumText);if(!t)return;
 if(e.target.closest("[data-premium-copy]")){try{await navigator.clipboard.writeText(t.content);showToast("Ujumbe copied.");}catch{showToast("Copy haikufanikiwa.");}}
 if(e.target.closest("[data-premium-fav]")){if(!premiumNeedLogin()||!premiumActive())return showToast("Favorites ni kwa Premium active.");const saved=premiumFavorites.has(t.id);const q=saved?sbClient.from("premium_text_favorites").delete().eq("user_id",signedInUser.id).eq("text_id",t.id):sbClient.from("premium_text_favorites").insert({user_id:signedInUser.id,text_id:t.id});const {error}=await q;if(error)return showToast("Favorite: "+error.message);saved?premiumFavorites.delete(t.id):premiumFavorites.add(t.id);premiumRenderLibrary();showToast(saved?"Favorite imeondolewa.":"Imehifadhiwa Favorites.");}
 if(e.target.closest("[data-premium-collect]")){if(!premiumNeedLogin()||!premiumActive())return showToast("Collections ni kwa Premium active.");if(!premiumCollections.length)return showToast("Tengeneza collection kwanza.");const pick=prompt("Chagua collection:\n"+premiumCollections.map((c,i)=>(i+1)+". "+c.name).join("\n"));const ix=Number(pick)-1,coll=premiumCollections[ix];if(!coll)return;const {error}=await sbClient.from("premium_text_collection_items").insert({collection_id:coll.id,text_id:t.id,user_id:signedInUser.id});if(error)return showToast(error.code==="23505"?"Ujumbe tayari upo kwenye collection.":"Collection: "+error.message);showToast("Ujumbe umeongezwa kwenye "+coll.name+".");}
});
async function premiumAdminLoadTexts(){
 if(!signedInUser||state.profile.role!=="admin")return;
 const {data,error}=await sbClient.from("premium_texts").select("id,title,content,category,collection,is_premium,is_daily,featured,status,created_at").order("created_at",{ascending:false}).limit(500);
 if(error){$("premiumAdminList").innerHTML='<div class="empty-state">Admin texts: '+escapeHTML(error.message)+'</div>';return;}
 premiumTextsCache=data||[];premiumAdminRender();
}
function premiumAdminRender(){
 const term=($("premiumAdminSearch").value||"").trim().toLowerCase(),list=premiumTextsCache.filter(t=>(t.title+" "+t.content+" "+t.category+" "+t.collection).toLowerCase().includes(term));
 $("premiumAdminList").innerHTML=list.map(t=>'<article class="admin-post-row" data-premium-admin-id="'+escapeHTML(t.id)+'"><div class="admin-post-meta"><strong>'+escapeHTML(t.title)+' <small>'+escapeHTML(t.category)+' · '+(t.is_premium?"Premium":"Free")+'</small></strong><p>'+escapeHTML(t.content)+'</p><span class="admin-post-status">'+escapeHTML(t.collection||"")+(t.is_daily?" · Daily":"")+(t.featured?" · Featured":"")+' · '+escapeHTML(t.status)+'</span></div><div class="admin-post-actions"><button type="button" data-premium-edit>Edit</button><button type="button" data-premium-hide="'+(t.status==="published"?"hidden":"published")+'">'+(t.status==="published"?"Hide":"Publish")+'</button><button type="button" class="danger" data-premium-delete>Delete</button></div></article>').join("")||'<div class="empty-state">Hakuna text inayolingana.</div>';
}
function premiumAdminClear(){premiumEditingId=null;$("premiumAdminTitle").value="";$("premiumAdminCategory").value="Hot Text";$("premiumAdminCollection").value="";$("premiumAdminContent").value="";$("premiumAdminIsPremium").checked=true;$("premiumAdminDaily").checked=false;$("premiumAdminFeatured").checked=false;$("premiumAdminSave").textContent="Hifadhi ujumbe";$("premiumAdminCancel").hidden=true;}
$("premiumAdminSave").addEventListener("click",async()=>{
 if(!signedInUser||state.profile.role!=="admin")return showToast("Admin pekee.");
 const title=$("premiumAdminTitle").value.trim()||"Ujumbe",content=$("premiumAdminContent").value.trim(),category=$("premiumAdminCategory").value,collection=$("premiumAdminCollection").value.trim()||category;
 if(!content)return showToast("Andika ujumbe kwanza.");
 const values={title,content,category,collection,is_premium:$("premiumAdminIsPremium").checked,is_daily:$("premiumAdminDaily").checked,featured:$("premiumAdminFeatured").checked,created_by:signedInUser.id,status:"published",updated_at:new Date().toISOString()};
 const q=premiumEditingId?sbClient.from("premium_texts").update(values).eq("id",premiumEditingId):sbClient.from("premium_texts").insert(values);
 const {error}=await q;if(error)return showToast("Save text: "+error.message);
 premiumAdminClear();await premiumAdminLoadTexts();await premiumLoad();showToast("Premium text imehifadhiwa.");
});
$("premiumAdminCancel").addEventListener("click",premiumAdminClear);
$("premiumAdminSearch").addEventListener("input",premiumAdminRender);
$("premiumAdminRefresh").addEventListener("click",premiumAdminLoadTexts);
$("premiumAdminList").addEventListener("click",async e=>{
 const card=e.target.closest("[data-premium-admin-id]");if(!card)return;const t=premiumTextsCache.find(x=>x.id===card.dataset.premiumAdminId);if(!t)return;
 if(e.target.closest("[data-premium-edit]")){premiumEditingId=t.id;$("premiumAdminTitle").value=t.title;$("premiumAdminCategory").value=t.category;$("premiumAdminCollection").value=t.collection;$("premiumAdminContent").value=t.content;$("premiumAdminIsPremium").checked=t.is_premium;$("premiumAdminDaily").checked=t.is_daily;$("premiumAdminFeatured").checked=t.featured;$("premiumAdminSave").textContent="Hifadhi mabadiliko";$("premiumAdminCancel").hidden=false;$("adminTextsPane")?.scrollIntoView({behavior:"smooth"});}
 if(e.target.closest("[data-premium-hide]")){const status=e.target.closest("[data-premium-hide]").dataset.premiumHide;const {error}=await sbClient.from("premium_texts").update({status,updated_at:new Date().toISOString()}).eq("id",t.id);if(error)return showToast("Status: "+error.message);await premiumAdminLoadTexts();await premiumLoad();}
 if(e.target.closest("[data-premium-delete]")){if(!confirm("Futa ujumbe huu kabisa?"))return;const {error}=await sbClient.from("premium_texts").delete().eq("id",t.id);if(error)return showToast("Delete: "+error.message);await premiumAdminLoadTexts();await premiumLoad();}
});
document.querySelectorAll('[data-screen="premiumScreen"]').forEach(btn=>btn.addEventListener("click",()=>premiumLoad()));
document.querySelector(".premium-profile-link")?.addEventListener("click",()=>{goToScreen("premiumScreen");premiumLoad();});
