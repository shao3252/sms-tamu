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
    text: "Nikikuwaza wewe akili yangu inawaza mambo machafu matupu. Leo nataka nikufanye uwe wangu kuanzia utosini mpaka unyayoni.",
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
    category: "Message Kuu",
    text: "Kitu ninachokipenda zaidi duniani ni kusikia zile sauti zako ukiwa unafika kileleni. Leo nataka nizisikie zaidi na zaidi.",
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
  verified: true
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

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    return {
      posts: Array.isArray(saved.posts) ? saved.posts : demoPosts.map(post => ({
        ...post,
        comments: [...post.comments]
      })),
      profile: { ...defaultProfile, ...(saved.profile || {}) },
      following: Array.isArray(saved.following) ? saved.following : [...defaultFollowing],
      followers: Array.isArray(saved.followers) ? saved.followers : [...defaultFollowers],
      chats: saved.chats || [
        { id: "veeamor", name: "VeeAmor", last: "Ujumbe wako umenigusa." },
        { id: "shauku", name: "Shauku", last: "Habari yako?" },
        { id: "ally", name: "Ally", last: "Asante sana." }
      ],
      messages: saved.messages || {},
      privacy: saved.privacy || "public",
      notifications: saved.notifications !== false
    };
  } catch (error) {
    return {
      posts: demoPosts,
      profile: { ...defaultProfile },
      following: [...defaultFollowing],
      followers: [...defaultFollowers],
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
          </div>
          <div class="post-time">${escapeHTML(post.time || "159d ago")} <span class="post-tag">${escapeHTML(post.category || "Ujumbe")}</span> <span class="post-owner-tag">✏️ Kundi</span></div>
        </div>
        ${isMine ? '<button class="more-post-button" data-action="post-menu" aria-label="Chaguo za posti">⋯</button>' : ""}
      </div>
      <p class="post-text">${escapeHTML(post.text)}</p>
      <div class="post-actions">
        <button class="action-button like-button ${post.liked ? "liked" : ""}" data-action="like"><span class="action-icon">${post.liked ? "♥" : "♡"}</span><span>${post.likes}</span></button>
        <button class="action-button" data-action="comment"><span class="action-icon">☏</span><span>${post.comments.length}</span></button>
        <button class="action-button" data-action="copy"><span class="action-icon">▤</span><span>Copy</span></button>
        <button class="action-button" data-action="share"><span class="action-icon">🚀</span><span>Share</span></button>
        <button class="action-button ${post.saved ? "liked" : ""}" data-action="save"><span class="action-icon">${post.saved ? "★" : "☆"}</span><span>Save</span></button>
      </div>
      <div class="post-extra-actions">
        <button data-action="likes">+ Likes</button>
        ${isMine ? '<button data-action="edit">✏️ Edit</button><button class="delete-post" data-action="delete">🗑 Futa</button>' : ""}
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
  const posts = activeCategory === "Vyote"
    ? state.posts
    : state.posts.filter(post => post.category === activeCategory);

  renderFeed("feed", posts);
}

function renderSearch(query) {
  const term = (query || "").trim().toLowerCase();
  const results = !term
    ? state.posts
    : state.posts.filter(post =>
      (post.text + " " + post.name + " " + post.username + " " + post.category)
        .toLowerCase().includes(term)
    );

  renderFeed("searchResults", results);
}

function renderProfile() {
  const profile = state.profile;

  $("profileName").textContent = profile.name;
  $("profileUsername").textContent = "@" + profile.username;
  $("profileBio").textContent = profile.bio || "Hakuna bio bado.";
  $("profileVerified").hidden = !profile.verified;
  $("followingCount").textContent = state.following.length;
  $("followersCount").textContent = state.followers.length;

  const avatar = $("profileAvatar");
  avatar.innerHTML = profile.avatar
    ? `<img src="${profile.avatar}" alt="Picha ya wasifu">`
    : escapeHTML((profile.name || "U").charAt(0).toUpperCase());

  document.querySelectorAll(".profile-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.profileTab === activeProfileTab);
  });

  let posts = [];
  if (activeProfileTab === "posts") {
    posts = state.posts.filter(post => post.username === profile.username || post.mine);
  } else if (activeProfileTab === "liked") {
    posts = state.posts.filter(post => post.liked);
  } else if (activeProfileTab === "saved") {
    posts = state.posts.filter(post => post.saved);
  }

  renderFeed("myPosts", posts);
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
  $("editPostCategory").value = post.category || "Message Kuu";
  $("editPostText").value = post.text;
  $("editPostDialog").showModal();
}

function renderChats() {
  $("chatList").innerHTML = state.chats.map(chat => `
    <button class="chat-row" data-chat-id="${escapeHTML(chat.id)}">
      <span class="avatar pink">${escapeHTML(chat.name.charAt(0).toUpperCase())}</span>
      <span class="chat-preview"><strong>${escapeHTML(chat.name)}</strong><p>${escapeHTML(chat.last || "Anza mazungumzo")}</p></span>
      <time>Karibuni</time>
    </button>`).join("")
    || '<div class="empty-state">Bado huna mazungumzo.</div>';
}

function renderMessages() {
  if (!activeChat) return;

  const messages = state.messages[activeChat.id] || [];
  $("chatMessages").innerHTML = messages.length
    ? messages.map(message => `
      <div class="bubble ${message.mine ? "mine" : ""}">
        ${escapeHTML(message.text)}
        <small>${escapeHTML(message.time || "Sasa")}</small>
      </div>`).join("")
    : '<div class="empty-state">Anza mazungumzo kwa kutuma ujumbe.</div>';

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
    ? list.map(person => `
      <div class="person-row">
        <span class="avatar pink">${escapeHTML(person.name.charAt(0).toUpperCase())}</span>
        <span class="person-info"><strong>${escapeHTML(person.name)}</strong><small>@${escapeHTML(person.username)}</small></span>
        ${type === "following" ? '<button class="person-action" data-unfollow="' + escapeHTML(person.id) + '">Unafuata</button>' : ""}
      </div>`).join("")
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
    id: Date.now(),
    name: state.profile.name,
    username: state.profile.username,
    verified: state.profile.verified,
    category: $("postCategory").value,
    text,
    likes: 0,
    liked: false,
    saved: false,
    comments: [],
    mine: true,
    time: "Sasa"
  });

  saveState();
  $("postText").value = "";
  $("characterCount").textContent = "0/700";
  activeCategory = "Vyote";
  document.querySelectorAll(".category").forEach(button => {
    button.classList.toggle("active", button.dataset.category === "Vyote");
  });
  renderHome();
  goToScreen("homeScreen");
  showToast("Ujumbe wako umeshirikishwa!");
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
    mine: true,
    time: new Date().toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" })
  });

  activeChat.last = text;
  saveState();
  input.value = "";
  renderMessages();
  renderChats();
  showToast("Ujumbe umehifadhiwa kwenye demo hii.");
});

// Initial render
renderHome();
renderChats();
renderProfile();
