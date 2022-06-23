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
    const checkSelected = document.querySelector(".info-contact .check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}

//----------------------- visibility selected
function visibilitySelected (visibility) {
    const check = visibility.querySelector(".info-visibility .check");
    const checkSelected = document.querySelector(".info-visibility .check-selected");

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
let userName;
//------------------


//---------------PARA CADASTRAR NOME 
function loginPage () {    
    userName = document.querySelector(".login-page > input").value; 

    if(userName === ""){
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


//------------VERIFICAÇÃO DO ERRO da entrada
function loginFail () {
    alert("Já existe um usuário online com esse nome, por favor escolha outro.");
}

//----------------VERIFICAÇÃO DA ENTRADA
function loginSuccess() {
    closeLoginPage();
    getMessages (); 
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
    let fail = error.response.status;
    console.log(fail);
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
                    <span class="name">${content[i].to}:</span>
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
                    <span class="name">${content[i].to}:</span>
                    <span class="msg">${content[i].text}</span>
                </div>
            `
        }

        /*if (content[i].type === "privite_message") {
            messages.innerHTML += `
                <div class="private-msg">
                    <span class="msg-time">${content[i].time}</span>
                    <span class="name">${content[i].from}</span>
                        para 
                    <span class="name">${content[i].to}:</span>
                    <span class="msg">${content[i].text}</span>
                </div>
            `
        }      */    
    }
    
    const scroll = document.querySelector('.main div:last-child');
    scroll.scrollIntoView();
    
    setInterval(getMessages, 3000); //atualizar feed
    setInterval(stillActive, 5000); //mostrar ativididade
}

//-----------MOSTRAR ATIVIDADE
function stillActive () {
    console.log("ainda ativo"); //apagar dps

    axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/status", 
        {
            name: userName,
        }
    );   
}
