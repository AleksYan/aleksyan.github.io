const clipboard = document.getElementById('clipboard');

//add event listener on load to get selected orgId and templateID
document.addEventListener("DOMContentLoaded", detectSelected);
document.getElementById("startchat").addEventListener("click", loadChat);
clipboard.addEventListener("mouseover",highlightSVG);
clipboard.addEventListener("click",clipboardCopied);

//initialize copy to clip library
const copyToClip = new ClipboardJS(clipboard);
copyToClip.on('success', function(e) {
  // console.info('Action:', e.action);
  // console.info('Text:', e.text);
  // console.info('Trigger:', e.trigger);

  e.clearSelection();
});

// function to detect selected value in select-form
function detectSelected() {
  //clear previous chat sessions
  sessionStorage.clear();
  //hiding chat settings view
  const chatRow = document.getElementById('chat-row');
  chatRow.hidden = true;

  const chatdiv = document.getElementById("cisco-chat-bubble-app");
  if (chatdiv) {
    chatdiv.remove();
  }

  const selected = document.getElementById("FormControlSelect1");
  const partner = selected.selectedOptions[0].innerText;
  loadPartner(partner);
}

// load partners from db.json file
function loadPartner(name) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "db.json", true);
  xhr.onload = function () {
    if (this.status === 200) {
      const partners = JSON.parse(this.responseText);
      const partner = partners[0][name];

      buildIdDiv(partner["OrgId"], partner["ChatId"]);
    }
  };
  xhr.send();
} 

// build UI part with Org and Chat IDs
function buildIdDiv(orgId, chatId) {
  const divIds = document.getElementById("IDs");
  divIds.innerHTML = "";
  const p1 = document.createElement("p");
  p1.className = "mb-0";
  p1.innerHTML = `OrgID: <span id="orgid">${orgId}`;
  divIds.appendChild(p1);

  const p2 = document.createElement("p");
  p2.innerHTML = `ChatID: <span id="chatid">${chatId}`;
  divIds.appendChild(p2);
}

function loadChat() {
  //start spinner on start button
  chatStartSpinnerOn();

  const orgId = document.getElementById("orgid").innerText;
  const chatId = document.getElementById("chatid").innerText;
  var bubbleScript = document.createElement("script");
  e = document.getElementsByTagName("script")[0];
  bubbleScript.async = true;
  bubbleScript.CiscoAppId = "cisco-chat-bubble-app";
  bubbleScript.appPrefix = "bts";
  bubbleScript.DC = "appstaging.ciscoccservice.com";
  bubbleScript.orgId = orgId;
  bubbleScript.templateId = chatId;
  bubbleScript.src =
    "https://btsbubble.appstaging.ciscoccservice.com/bubble.js";
  bubbleScript.type = "text/javascript";
  bubbleScript.setAttribute("charset", "utf-8");
  e.parentNode.insertBefore(bubbleScript, e);
  bubbleScript.onload = function () {
    setTimeout(chatStartSpinnerOff, 1000);
  };
}

//starting Loading spinner on StartChat button
function chatStartSpinnerOn() {
  const btn = document.getElementById("startchat");
  btn.setAttribute("disabled", true);
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm"></span> Loading...';
}
// stop loading spinner on StartChat button
function chatStartSpinnerOff() {
  const btn = document.getElementById("startchat");
  btn.removeAttribute("disabled");
  btn.innerHTML = "Start Chat";
  setTimeout(loadChatSettings,1500);
}
//fetch bubble_state json from session storage
function loadChatSettings(){
  // console.log('-----------------');
  let chatsettings = sessionStorage.getItem("bubble_state");
  chatsettings = JSON.stringify(JSON.parse(chatsettings),undefined,2);
  // console.log(chatsettings);
  const jsonEl = document.getElementById('json');
  jsonEl.innerHTML = chatsettings;
  //highlight with json syntax
  Prism.highlightAll();
  //unhide div with chat bubble settings
  const chatRow = document.getElementById('chat-row');
  chatRow.hidden = false;
}

function highlightSVG(){
  clipboard.firstChild.setAttribute("fill","#0d6efd");
  clipboard.style.cursor = "pointer";
  clipboard.addEventListener("mouseout",()=>clipboard.firstChild.setAttribute("fill","current"));
  
}

function clipboardCopied(){
  const svg = clipboard.innerHTML;
  clipboard.innerHTML = '<span class="text-primary">Copied</span>'
  setTimeout(()=>{clipboard.innerHTML=svg},1000);
}