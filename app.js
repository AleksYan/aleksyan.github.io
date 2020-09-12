//add event listener on load to get selected orgId and templateID
document.addEventListener("DOMContentLoaded", detectSelected);
document.getElementById("startchat").addEventListener("click", loadChat);

new ClipboardJS('.btn');


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
  console.log('-----------------');
  let chatsettings = sessionStorage.getItem("bubble_state");
  chatsettings = JSON.stringify(JSON.parse(chatsettings),undefined,2);
  console.log(chatsettings);
  const jsonEl = document.getElementById('json');
  jsonEl.innerHTML = chatsettings;
  //highlicht with json syntax
  Prism.highlightAll();
  //add copy icon to header
  const clip = document.getElementById("clipboard");
  clip.appendChild(copyClipIcon);

  //unhide div with chat bubble settings
  const chatRow = document.getElementById('chat-row');
  chatRow.hidden = false;
}


//svg icons
const copyClipIcon = document.createElement('button');
copyClipIcon.setAttribute("id", "copyClipBtn");
copyClipIcon.setAttribute("data-clipboard-target", "#json");
copyClipIcon.className = "btn btn-secondary btn-sm"
copyClipIcon.innerHTML = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>';