let content = []

//ETAPA 1 - BUSCAR AS MSGS
getMessages ();

function getMessages () {
    console.log(`ordem de execução 1 - buscarMensagens`) //apagr dps

    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(processResponse);
}


//ETAPA 2 - JOGAR AS MSG DO SRVIDOR NA VARIAVEL CONTENT
function processResponse(response) {
    console.log(`ordem de execução 2 - popularMsgServidor`) //apagar dps

    content = response.data;
    renderMessages ();
}


//ETAPA 3 - RENDERIZAR O CONTENT NO DOM
function renderMessages () {
    console.log("orden de execução 3 - plotarDoServidor") //apagar dps

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
                <div class="status-msg">
                    <span class="msg-time">${content[i].time}</span>
                    <span class="name">${content[i].from}</span>
                        para 
                    <span class="name">${content[i].to}:</span>
                    <span class="msg">${content[i].text}</span>
                </div>
            `
        }

 
    }

}




//open sidebar
function openSidebar (sidebar){
    document.querySelector(".modal").classList.remove("hide");
}

//close sidebar
function closeSidebar (sidebar) {
    document.querySelector(".modal").classList.add("hide");
}

//contact selected
function contactSelected (contact) {
    const check = contact.querySelector(".info-contact .check");
    const checkSelected = document.querySelector(".info-contact .check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}

//visibility selected
function visibilitySelected (visibility) {
    const check = visibility.querySelector(".info-visibility .check");
    const checkSelected = document.querySelector(".info-visibility .check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}
