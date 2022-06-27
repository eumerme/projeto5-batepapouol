//----------------------- open sidebar
function openSidebar (sidebar){
    document.querySelector(".modal").classList.remove("hide");
}

//----------------------- close sidebar
function closeSidebar (sidebar) {
    document.querySelector(".modal").classList.add("hide");
}


//----------------------- contact check selected
function contactSelected (contact) {
    const check = contact.querySelector(".info-contact .check");
    const checkSelected = document.querySelector(".info-contact .check.check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}

/*/contact name selected (pra tentar comparar pelo inner.HTML com o user selecionado)
function contactNameSelected (name) {
    const contactName = name.querySelector(".info-contact .contact-name");
    const nameSelected = document.querySelector(".info-contact .contact-name.contact-name-selected");

    if (nameSelected !== null) {
        nameSelected.classList.remove("contact-name-selected");
    }

    contactName.classList.add("contact-name-selected");
}/*/


//----------------------- visibility selected
function visibilitySelected (visibility) {
    const check = visibility.querySelector(".info-visibility .check");
    const checkSelected = document.querySelector(".info-visibility .check.check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}

/*/visibility name selected (pra tentar comparar pelo inner.HTML com o user selecionado)
function visibilityNameSelected (visibName) {
    const visib = visibName.querySelector(".info-visibility .visib-name");
    const visibSelected = document.querySelector(".info-visibility .visib-name.visib-selected");

    if (visibSelected !== null) {
        visibSelected.classList.remove("visib-selected");
    }

    visib.classList.add("visib-selected");
} /*/


//---------------------- api
let content = [];
let onlineUsers = [];
let userName;
let messageText; 


//----------------------- close login page
function closeLoginPage () {
    const loginPage = document.querySelector(".login-page");
    loginPage.classList.add("hide");

    setTimeout(closeLoadingPage, 1000);
}

//----------------------- close loading page
function closeLoadingPage (){
    const loadingPage = document.querySelector(".loading-page");
    loadingPage.classList.add("hide");
}


//----------------------- send infos with keydown
document.querySelector(".login-page > input").addEventListener("keydown", enterName);

function enterName (event) {
    if (event.which === 13) {
        loginPage();
    }
}

document.querySelector(".footer > textarea").addEventListener("keydown", enterMsg);

function enterMsg (event) {
    if (event.which === 13) {
        sendMessage();
    }
}


//----------------------- join bate-papo
function loginPage () {    
    userName = document.querySelector(".login-page > input").value; 

    if(userName === undefined){
        return;
    }

    let promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants", 
        {
            name: userName,
        }
    );
    
    promise.then(loginSuccess);  
    promise.catch(loginFail); 
}

function loginSuccess() {
    closeLoginPage();
    getMessages (); 
    getUsers ();
}

function loginFail () {
    alert("Já existe um usuário online com esse nome, por favor escolha outro.");
}


//----------------------- get messages from api
function getMessages () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    
    promise.then(processResponse);
    promise.catch(erro); 
}

function erro (error){
    console.log(`Status code: ${error.response.status}`);
}

function processResponse(response) {
    content = response.data;
    renderMessages ();
}

//----------------------- render messages
function renderMessages () {
    const messages = document.querySelector(".main");
    messages.innerHTML = "";

    for (let i = 0; i < content.length; i++) {

        if (content[i].type === "status") {
            messages.innerHTML += `
                <div class="status-msg">
                    <span class="msg-time">${content[i].time}</span>
                    <span class="name">${content[i].from}</span>
                        para 
                    <span class="to">${content[i].to}:</span>
                    <span class="msg">${content[i].text}</span>
                </div>
            `
        }

        if (content[i].type === "message") {
            messages.innerHTML += `
                <div class="normal-msg">
                    <span class="msg-time">${content[i].time}</span>
                    <span class="name">${content[i].from}</span>
                        para 
                    <span class="to">${content[i].to}:</span>
                    <span class="msg">${content[i].text}</span>
                </div>
            `
        }
    
       if (content[i].type === "private_message" && content[i].to === userName) {
            messages.innerHTML += `
                <div class="private-msg">
                    <span class="msg-time">${content[i].time}</span>
                    <span class="name">${content[i].from}</span>
                        reservadamente para 
                    <span class="to">${userName}:</span>
                    <span class="msg">${content[i].text}</span>
                </div>
            `
        }    

    }

    autoScroll(); 
    setInterval(getMessages, 3000); 
    setInterval(stillActive, 5000); 
    setInterval(getUsers, 10000); 
}

function autoScroll () {
    const scroll = document.querySelector('.main div:last-child');
    scroll.scrollIntoView();
}

function stillActive () {
    axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status", 
        {
            name: userName,
        }
    );   
}


//----------------------- send messages to api
function sendMessage() {
    messageText = document.querySelector(".footer > textarea").value;

    let promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/messages",
        {
            from: userName,
            to: "Todos", 
            text: messageText,
            type: "message" // ou "private_message" para o bônus 
        }
    );

    promise.then(msgSuccess);
    promise.catch(msgFail);    
}

function msgSuccess (){
    getMessages();

    document.querySelector(".footer > textarea").value = ""; //clean textarea 
}

function msgFail (error){
    console.log(`Status code: ${error.response.status}`);

    alert("Desculpe, você foi desconectado! Tente novamente.")
    window.location.reload();
}


//----------------------- get online users from api
function getUsers () {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

    promise.then(users);  
    promise.catch(msgFail);   
}

function users (response){
    onlineUsers = response.data   
    renderUsers ();
}

//----------------------- render users
function renderUsers () {
    const users = document.querySelector(".contacts");
    users.innerHTML = `
         <li class="info-contact" onclick="contactSelected(this), contactNameSelected (this);">                   
            <div class="contact-options">
                <ion-icon name="people"></ion-icon> 
                <p class="contact-name contact-name-selected">Todos</p>
                <img class="check check-selected" src="./images/Vector.png" alt="">
            </div>
        </li>
    `;

    for (let i = 0; i < onlineUsers.length; i++) {
        users.innerHTML += `
            <li class="info-contact" onclick="contactSelected(this), contactNameSelected (this);">                   
                <div class="contact-options">
                    <ion-icon name="people"></ion-icon> 
                    <p class="contact-name">${onlineUsers[i].name}</p>
                    <img class="check" src="./images/Vector.png" alt="">
                </div>
            </li>    
        `
    }
}
