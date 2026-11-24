const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "sms-tamu-user-demo-v1";
const defaultPosts = [ {
  id:1,
  name:"VeeAmor",
  username:"veeamor",
  verified:true,
  category:"Message Kuu",
  text:"Siwezi sema sijawahi kuwa na makosa, lakini nikikumbuka namna ulivyonipa nafasi ya kuwa mimi, moyo wangu unajaa shukrani. Wewe ni sehemu nzuri ya maisha yangu. ❤️",
  likes:18,
  liked:false,
  saved:false,
  comments:[{
    name:"Shauku",
    text:"Ujumbe mzuri sana."
  }],
  mine:false
}, {
  id:2,
  name:"VeeAmor",
  username:"veeamor",
  verified:true,
  category:"Kuwa Msham",
  text:"Kwahiyo kosa langu ni kukuhusu kwa namna ambayo hunijui, huku nikijua bado kuna mengi ya kujifunza kuhusu wewe. Safari ya upendo ni kujifunza kila siku.",
  likes:7,
  liked:false,
  saved:false,
  comments:[],
  mine:false
}, {
  id:3,
  name:"Shauku",
  username:"shauku",
  verified:true,
  category:"Ushauri",
  text:"Usimlazimishe mtu akuone wa muhimu. Upendo wa kweli hauhitaji kushindana ili upate nafasi; unahitaji moyo unaochagua kwa hiari.",
  likes:31,
  liked:false,
  saved:false,
  comments:[{
    name:"VeeAmor",
    text:"Kweli kabisa 💗"
  }],
  mine:false
}, {
  id:4,
  name:"Sms Tamu",
  username:"smstamu",
  verified:true,
  category:"Message Kuu",
  text:"Kuna watu wanakuja maishani mwako na kufanya hata siku za kawaida ziwe na maana. Mthamini anayekupa amani, heshima na furaha.",
  likes:12,
  liked:false,
  saved:false,
  comments:[],
  mine:false
}
];
let state = loadState();
let activeCategory = "Vyote";
let activeCommentPost = null;
let activeChat = null;
let toastTimeout;
function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
    return {
      posts:Array.isArray(saved.posts)?saved.posts:defaultPosts.map(p=>({
        ...p,comments:[...p.comments]
      })),
      profile:saved.profile||{
        name:"Sms Tamu User",
        username:"smsuser"
      },
      chats:saved.chats||[ {
        id:"shauku",
        name:"Shauku",
        last:"Habari yako?"
      },
      {
        id:"veeamor",
        name:"VeeAmor",
        last:"Ujumbe wako umenigusa."
      },
      {
        id:"ally",
        name:"Ally",
        last:"Asante sana"
      }
      ],
      messages:saved.messages||{
      }
    };
  }
  catch(e){
    return {
      posts:defaultPosts,
      profile:{
        name:"Sms Tamu User",
        username:"smsuser"
      },
      chats:[],
      messages:{
      }
    };
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }
  [c]));
}
function showToast(message){
  const toast=$("toast");
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>toast.classList.remove("show"),2300);
}
function goToScreen(screenId){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===screenId));
  document.querySelectorAll(".nav-item[data-screen]").forEach(b=>b.classList.toggle("selected",b.dataset.screen===screenId));
  if(screenId==="profileScreen")renderProfile();
  if(screenId==="chatScreen")renderChats();
  if(screenId==="searchScreen")renderSearch($("searchInput").value);
  if(screenId==="composeScreen")$("postText").focus();
  if(activeChat && screenId!=="chatScreen")closeChat();
  window.scrollTo({
    top:0,behavior:"smooth"
  });
}
function postCard(post){
  const isMine=post.username===state.profile.username||post.mine;
  return `<article class="post-card" data-post-id="${post.id}">
    <div class="post-author"><div class="avatar ${post.verified?"pink":""}">${escapeHTML((post.name||"U").charAt(0).toUpperCase())}</div>
      <div class="author-info"><div class="author-name">${escapeHTML(post.name)} ${post.verified?'<span class="verified">●</span>':""}</div><div class="post-time">@${escapeHTML(post.username)} · muda mfupi uliopita</div></div>
      ${isMine?'<button class="action-button delete-post" title="Futa ujumbe">⋯</button>':""}
    </div>
    <span class="post-category">${escapeHTML(post.category||"Ujumbe")}</span>
    <p class="post-text">${escapeHTML(post.text)}</p>
    <div class="post-actions">
      <button class="action-button like-button ${post.liked?"liked":""}" data-action="like"><span class="action-icon">${post.liked?"♥":"♡"}</span><span>${post.likes}</span></button>
      <button class="action-button" data-action="comment"><span class="action-icon">♧</span><span>${post.comments.length}</span></button>
      <button class="action-button" data-action="copy"><span class="action-icon">▣</span><span>Copy</span></button>
      <button class="action-button" data-action="share"><span class="action-icon">↗</span><span>Share</span></button>
      <button class="action-button ${post.saved?"liked":""}" data-action="save"><span class="action-icon">${post.saved?"★":"☆"}</span><span>${post.saved?"Saved":"Save"}</span></button>
    </div>
  </article>`;
}
function renderFeed(target="feed",list=state.posts){
  const container=$(target);
  if(!container)return;
  container.innerHTML=list.length?list.map(postCard).join():'<div class="empty-state">Hakuna ujumbe uliopatikana.</div>';
}
function filteredPosts(){
  return activeCategory==="Vyote"?state.posts:state.posts.filter(p=>p.category===activeCategory);
}
function renderHome(){
  renderFeed("feed",filteredPosts());
}
function renderSearch(query){
  const q=(query||"").trim().toLowerCase();
  const found=!q?state.posts:state.posts.filter(p=>(p.text+" "+p.name+" "+p.username+" "+p.category).toLowerCase().includes(q));
  renderFeed("searchResults",found);
}
function getPostFromButton(button){
  return state.posts.find(p=>p.id===Number(button.closest("[data-post-id]")?.dataset.postId));
}
document.addEventListener("click",async event=>{
  const category=event.target.closest(".category"); if(category){
    activeCategory=category.dataset.category; document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b===category)); renderHome();return;
  }
  const nav=event.target.closest(".nav-item[data-screen]"); if(nav){
    goToScreen(nav.dataset.screen);return;
  }
  const action=event.target.closest("[data-action]"); if(action){
    const post=getPostFromButton(action);if(!post)return; switch(action.dataset.action){
      case "like":post.liked=!post.liked;post.likes+=post.liked?1:-1;saveState();renderHome();renderSearch($("searchInput").value);break; case "comment":openComments(post.id);break; case "copy":try{
        await navigator.clipboard.writeText(post.text);showToast("Ujumbe umenakiliwa.");
      }
      catch(e){
        showToast("Copy haipatikani kwenye browser hii.");
      }
      break; case "share":if(navigator.share){
        try{
          await navigator.share({
            title:"SMS TAMU",text:post.text
          });
        }
        catch(e){
        }
      }
      else{
        try{
          await navigator.clipboard.writeText(post.text);showToast("Ujumbe umenakiliwa ili ushiriki.");
        }
        catch(e){
          showToast("Ujumbe: "+post.text);
        }
      }
      break; case "save":post.saved=!post.saved;saveState();renderHome();showToast(post.saved?"Ujumbe umehifadhiwa.":"Ujumbe umeondolewa Saved.");break;
    }
    return;
  }
  const deleteButton=event.target.closest(".delete-post"); if(deleteButton){
    const post=getPostFromButton(deleteButton);if(post&&confirm("Una uhakika unataka kufuta ujumbe huu?")){
      state.posts=state.posts.filter(p=>p.id!==post.id);saveState();renderHome();renderProfile();showToast("Ujumbe umefutwa.");
    }
  }
});
$("headerSearch").addEventListener("click",()=>goToScreen("searchScreen"));
$("searchInput").addEventListener("input",e=>renderSearch(e.target.value));
$("postText").addEventListener("input",e=>$("characterCount").textContent=e.target.value.length+"/700");
$("postForm").addEventListener("submit",event=>{
  event.preventDefault();const text=$("postText").value.trim();if(!text)return; state.posts.unshift({
    id:Date.now(),name:state.profile.name,username:state.profile.username,verified:false,category:$("postCategory").value,text,likes:0,liked:false,saved:false,comments:[],mine:true
  }); saveState();$("postText").value="";$("characterCount").textContent="0/700";activeCategory="Vyote";document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b.dataset.category==="Vyote"));renderHome();goToScreen("homeScreen");showToast("Ujumbe wako umeshirikishwa!");
});
function openComments(postId){
  activeCommentPost=postId;
  const post=state.posts.find(p=>p.id===postId);
  if(!post)return;
  $("commentsList").innerHTML=post.comments.length?post.comments.map(c=>`<div class="comment-item"><strong>${escapeHTML(c.name)}</strong>${escapeHTML(c.text)}</div>`).join():'<div class="empty-state">Bado hakuna maoni. Kuwa wa kwanza kutoa maoni.</div>';
  $("commentsDialog").showModal();
}
$("closeComments").addEventListener("click",()=>$("commentsDialog").close());
$("commentForm").addEventListener("submit",event=>{
  event.preventDefault();const text=$("commentInput").value.trim();const post=state.posts.find(p=>p.id===activeCommentPost);if(!post||!text)return; post.comments.push({
    name:state.profile.name,text
  });saveState();$("commentInput").value="";openComments(post.id);renderHome();showToast("Maoni yametumwa.");
});
function renderChats(){
  $("chatList").innerHTML=state.chats.map(chat=>`<button class="chat-row" data-chat-id="${escapeHTML(chat.id)}"><div class="avatar pink">${escapeHTML(chat.name.charAt(0))}</div><div class="chat-preview"><strong>${escapeHTML(chat.name)}</strong><p>${escapeHTML(chat.last||"Anza mazungumzo")}</p></div><time>Karibuni</time></button>`).join("")||'<div class="empty-state">Bado huna mazungumzo.</div>';
}
$("chatList").addEventListener("click",event=>{
  const row=event.target.closest("[data-chat-id]");if(!row)return; activeChat=state.chats.find(c=>c.id===row.dataset.chatId);if(!activeChat)return; $("chatUserName").textContent=activeChat.name;$("chatWindow").hidden=false;renderMessages();
});
function renderMessages(){
  const messages=state.messages[activeChat.id]||[];
  $("chatMessages").innerHTML=messages.length?messages.map(m=>`<div class="bubble ${m.mine?"mine":""}">${escapeHTML(m.text)}<small>${escapeHTML(m.time||"Sasa")}</small></div>`).join():'<div class="empty-state">Anza mazungumzo kwa kutuma ujumbe.</div>';
  $("chatMessages").scrollTop=$("chatMessages").scrollHeight;
}
function closeChat(){
  activeChat=null;
  $("chatWindow").hidden=true;
}
$("backToChats").addEventListener("click",closeChat);
$("chatForm").addEventListener("submit",event=>{
  event.preventDefault();if(!activeChat)return;const input=$("chatMessageInput");const text=input.value.trim();if(!text)return; state.messages[activeChat.id]=state.messages[activeChat.id]||[];state.messages[activeChat.id].push({
    text,mine:true,time:new Date().toLocaleTimeString("sw-TZ",{
      hour:"2-digit",minute:"2-digit"
    })
  });activeChat.last=text;saveState();input.value="";renderMessages();renderChats();showToast("Ujumbe umehifadhiwa kwenye demo hii.");
});
function renderProfile(){
  $("profileName").textContent=state.profile.name;
  $("postCount").textContent=state.posts.filter(p=>p.username===state.profile.username||p.mine).length;
  const mine=state.posts.filter(p=>p.username===state.profile.username||p.mine);
  renderFeed("myPosts",mine);
}
$("editProfile").addEventListener("click",()=>{
  $("editNameInput").value=state.profile.name;$("editUsernameInput").value=state.profile.username;$("profileDialog").showModal();
});
$("closeProfile").addEventListener("click",()=>$("profileDialog").close());
$("profileForm").addEventListener("submit",event=>{
  event.preventDefault();const name=$("editNameInput").value.trim();const username=$("editUsernameInput").value.trim().replace(/^@/,"").replace(/\s+/g,"").toLowerCase();if(!name||!username)return; const oldUsername=state.profile.username;state.profile={
    name,username
  };state.posts.forEach(p=>{
    if(p.username===oldUsername||p.mine){
      p.name=name;p.username=username;p.mine=true;
    }
  });saveState();$("profileDialog").close();renderProfile();renderHome();showToast("Wasifu umehifadhiwa.");
});
$("homeScreen").addEventListener("click",event=>{
  if(event.target.closest(".post-card")&&event.target.closest(".post-author")&&!event.target.closest("button")){
  }
});
renderHome();
renderChats();
renderProfile();
