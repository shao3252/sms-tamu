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
    const sourcePosts = Array.isArray(saved.posts) ? saved.posts : demoPosts;

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
      following: Array.isArray(saved.following) ? saved.following : [...defaultFollowing],
      followers: Array.isArray(saved.followers) ? saved.followers : [...defaultFollowers],
      chats: Array.isArray(saved.chats) ? ensureDefaultGroups(saved.chats) : createDefaultChats(),
      messages: saved.messages && typeof saved.messages === "object" ? saved.messages : {},
      privacy: saved.privacy === "private" ? "private" : "public",
      notifications: saved.notifications !== false
    };
  } catch (error) {
    return {
      posts: demoPosts.map(post => ({ ...post, status: "published", comments: Array.isArray(post.comments) ? post.comments : [] })),
      profile: { ...defaultProfile, verified: false },
      following: [...defaultFollowing],
      followers: [...defaultFollowers],
      chats: createDefaultChats(),
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
  if (screenId === "searchScreen") renderSearch($("searchInput").value);
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
  $("profileBio").textContent = profile.bio || "Karibu SMS TAMU.";
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
$("searchInput").addEventListener("input", event => renderSearch(event.target.value));
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
    .select("id,user_id,content,category,format,status,created_at,profiles(display_name,username,verified,avatar_url,premium_until)")
    .eq("status","published").order("created_at",{ascending:false}).limit(100);
  if (error) { showToast("Feed error: " + error.message); return; }
  const ids = (data || []).map(p => p.id);
  let likes = [], comments = [];
  if (ids.length) {
    const l = await sbClient.from("post_likes").select("post_id,user_id").in("post_id",ids);
    if (!l.error) likes = l.data || [];
    const c = await sbClient.from("comments").select("id,post_id,user_id,content,profiles(display_name,username)").in("post_id",ids);
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
  renderHome(); renderSearch($("searchInput").value); renderProfile();
}
async function loadUserProfile() {
  if (!signedInUser) return;
  let result = await sbClient.from("profiles").select("id,username,display_name,bio,avatar_url,role,verified,premium_until").eq("id",signedInUser.id).maybeSingle();
  if (!result.data) {
    await new Promise(resolve=>setTimeout(resolve,700));
    result = await sbClient.from("profiles").select("id,username,display_name,bio,avatar_url,role,verified,premium_until").eq("id",signedInUser.id).maybeSingle();
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
      const {data,error}=await sbClient.auth.signUp({email,password,options:{data:{display_name:$("authDisplayName").value.trim()}}});
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
  const {error}=await sbClient.auth.resetPasswordForEmail(email);
  authNotice(error?error.message:"Link ya password imetumwa ikiwa email imesajiliwa.",!!error);
});

async function renderAdminUsers() {
  if(!signedInUser || state.profile.role!=="admin")return;
  $("adminUsers").innerHTML='<div class="empty-state">Inapakia users...</div>';
  const {data,error}=await sbClient.from("profiles").select("id,username,display_name,role,verified,premium_until,created_at").order("created_at",{ascending:false}).limit(100);
  if(error){$("adminUsers").innerHTML='<div class="empty-state">Error: '+escapeHTML(error.message)+'</div>';return;}
  $("adminUsers").innerHTML=(data||[]).map(u=>{
    const prem=u.premium_until&&new Date(u.premium_until)>new Date();
    return '<article class="admin-user-row" data-user-id="'+escapeHTML(u.id)+'"><div class="admin-user-info"><strong>'+escapeHTML(u.display_name||u.username)+'</strong><small>@'+escapeHTML(u.username)+' · '+escapeHTML(u.role)+'</small><small>'+(u.verified?"Verified":"Not verified")+' · '+(prem?"Premium":"Normal")+'</small></div><div class="admin-user-actions"><button data-admin-action="verify" data-value="'+(!u.verified)+'">'+(u.verified?"Ondoa ✓":"Verify")+'</button><button data-admin-action="premium" data-value="'+(!prem)+'">'+(prem?"Ondoa Premium":"Premium 30d")+'</button><button data-admin-action="role" data-value="'+(u.role==="admin"?"user":"admin")+'">'+(u.role==="admin"?"Make user":"Make admin")+'</button></div></article>';
  }).join("")||'<div class="empty-state">Hakuna users bado.</div>';
}
$("closeAdmin").addEventListener("click",()=>$("adminDialog").close());
$("adminUsers").addEventListener("click",async event=>{
  const button=event.target.closest("[data-admin-action]");if(!button||state.profile.role!=="admin")return;
  const id=button.closest("[data-user-id]").dataset.userId,action=button.dataset.adminAction,value=button.dataset.value;
  const changes={};
  if(action==="verify")changes.verified=value==="true";
  if(action==="premium")changes.premium_until=value==="true"?new Date(Date.now()+30*86400000).toISOString():null;
  if(action==="role")changes.role=value;
  const {error}=await sbClient.from("profiles").update(changes).eq("id",id);
  if(error){showToast("Action imekataliwa: "+error.message);return;}
  showToast("User amesasishwa.");await renderAdminUsers();if(id===signedInUser.id)await loadUserProfile();
});
document.addEventListener("click",async event=>{
  const admin=event.target.closest('[data-setting="admin"]');
  if(admin&&state.profile.role==="admin"){event.preventDefault();event.stopImmediatePropagation();$("settingsDialog").close();$("adminDialog").showModal();await renderAdminUsers();}
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
