//----------------------- open sidebar
function openSidebar (sidebar){
    document.querySelector(".modal").classList.remove("hide");
}

//----------------------- close sidebar
function closeSidebar (sidebar) {
    document.querySelector(".modal").classList.add("hide");
}

//----------------------- contact selected
function contactSelected (contact) {
    const check = contact.querySelector(".info-contact .check");
    const checkSelected = document.querySelector(".info-contact .check.check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}

//----------------------- visibility selected
function visibilitySelected (visibility) {
    const check = visibility.querySelector(".info-visibility .check");
    const checkSelected = document.querySelector(".info-visibility .check.check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}



//----------------------- PARA O SERVER / api -------------------------

//-------------------- FECHAR LOGIN PAGE 
function closeLoginPage () {
    const loginPage = document.querySelector(".login-page");
    loginPage.classList.add("hide");

    setTimeout(closeLoadingPage, 1000); //fechar loading page
}

// ------------- FECHAR LOADING PAGE
function closeLoadingPage (){
    const loadingPage = document.querySelector(".loading-page");
    loadingPage.classList.add("hide");
}



//---------------------- variaveis api
let content = [];
let onlineUsers = [];
let userName;
let message = "";   //==== VER COMO LIMPAR O INPUT DEPOIS QUE ENVIA A MSG
//------------------


//---------------PARA CADASTRAR NOME 
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
    
    promise.then(loginSuccess);   //VERIFICAÇÃO DA ENTRADA
    promise.catch(loginFail);   //VERIFICÇÃO DO ERRO da entrada
}

//VERIFICAÇÃO DA ENTRADA
function loginSuccess() {
    closeLoginPage();
    getMessages (); 
    getUsers ();
}

//VERIFICAÇÃO DO ERRO da entrada
function loginFail () {
    alert("Já existe um usuário online com esse nome, por favor escolha outro.");
}




//--------------------------------------

//ETAPA 1 - BUSCAR AS MSGS
function getMessages () {
    console.log(`pegou msgs`) //apagr dps

    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    
    promise.then(processResponse); //se pegar as mensagens pra passar pro content
    promise.catch(erro); //se der erro
}

//etapa 2 - se der erro
function erro (error){
    console.log(`Status code: ${error.response.status}`);
}

//ETAPA 2 - JOGAR AS MSG DO SRVIDOR NA VARIAVEL CONTENT
function processResponse(response) {
    console.log(`colocou as msgs no content`) //apagar dps

    content = response.data;
    renderMessages ();
}


//ETAPA 3 - RENDERIZAR O CONTENT NO DOM
function renderMessages () {
    console.log("renderizou as msgs no dom") //apagar dps

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

    autoScroll(); //scroll automatico
    setInterval(getMessages, 3000); //atualizar feed
    setInterval(stillActive, 5000); //mostrar ativididade
    setInterval(getUsers, 10000); //atuliazar participantes online
}

//scroll automatico
function autoScroll () {
    const scroll = document.querySelector('.main div:last-child');
    scroll.scrollIntoView();
}

//MOSTRAR ATIVIDADE
function stillActive () {
    console.log("ainda ativo"); //apagar dps

    axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status", 
        {
            name: userName,
        }
    );   
}


//----------------------PARA ENVIAR MENSAGEM 
function sendMessage() {
    message = document.querySelector(".footer > textarea").value;

    let promise = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/messages",
        {
            from: userName,
            to: "Todos", //ou privado para o bônus
            text: message,
            type: "message" // ou "private_message" para o bônus 
        }
    );

    promise.then(msgSuccess);
    promise.catch(msgFail);
}

//mensagem enviada com sucesso
function msgSuccess (){
    console.log(`Msg enviada com sucesso`);

    getMessages();

    document.querySelector(".footer > textarea").value = ""; //clean textarea 
}

//erro no envio da mensagem
function msgFail (error){
    console.log(`Status code: ${error.response.status}`);

    alert("Desculpe, vocẽ foi desconectado! Tente novamente.")
    window.location.reload();
}




//--------------------------BUSCAR PARTICIPANTES
function getUsers () {
    console.log("buscando participantes");

    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

    promise.then(users);  //se buscar os participantes
    promise.catch(msgFail);   //se der erro
}

//etapa 2 - bse uscar participantes
function users (response){
    console.log(`colocou os participantes no content`);

    onlineUsers = response.data
   
    renderUsers ();
}


//ETAPA 3 - RENDERIZAR O ONLINEUSERS NO DOM
function renderUsers () {
    console.log("renderizou os participantes no dom") //apagar dps

    const users = document.querySelector(".contacts");
    users.innerHTML = `
        <li class="info-contact" onclick="contactSelected(this);">                   
            <div class="contact-options">
                <ion-icon name="people"></ion-icon> 
                <p>Todos</p>
                <img class="check check-selected" src="./images/Vector.png" alt="">
            </div>
        </li>
    `;

    for (let i = 0; i < onlineUsers.length; i++) {

        users.innerHTML += `
            <li class="info-contact" onclick="contactSelected(this);">
                <div class="contact-options">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${onlineUsers[i].name}</p>
                    <img class="check" src="./images/Vector.png" alt="">
                </div>
            </li>
        `
        //tentar tirar meu nome da lista de paticipantes dps
    }
}
