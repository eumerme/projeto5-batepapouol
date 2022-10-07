const URLbase = "https://mock-api.driven.com.br/api/v6/uol";
let username, lastTime;
let messageType = "message";
let sendTo = "Todos";

function selectUser(userTo, element) {
	sendTo = userTo;

	const selected = document.querySelector(
		".info-contact .check.check-selected"
	);
	if (selected) {
		selected.classList.remove("check-selected");
	}

	element.querySelector(".info-contact .check").classList.add("check-selected");
}

function selectVisibility(type, element) {
	messageType = type;

	const selected = document.querySelector(
		".info-visibility .check.check-selected"
	);
	if (selected) {
		selected.classList.remove("check-selected");
	}

	element
		.querySelector(".info-visibility .check")
		.classList.add("check-selected");
}

function sendMessage() {
	const message = document.querySelector(".footer > textarea").value;
	const body = {
		from: username,
		to: sendTo,
		text: message,
		type: messageType,
	};

	axios
		.post(`${URLbase}/messages`, body)
		.then(() => getMessages())
		.catch(errorMessage);

	document.querySelector(".footer > textarea").value = "";
}

function getMessages() {
	checkUsername();

	axios
		.get(`${URLbase}/messages`)
		.then((response) => {
			renderMessages(response.data);
		})
		.catch(errorMessage);
}

function renderMessages(response) {
	const messages = document.querySelector(".main");
	messages.innerHTML = "";

	response.forEach((message) => {
		if (message.type === "status") {
			messages.innerHTML += `
                    <li class="status-msg">
                        <span class="msg-time">${message.time}</span>
                        <span class="name">${message.from}</span>
                            para 
                        <span class="to">${message.to}:</span>
                        <span class="msg">${message.text}</span>
                    </li>
                `;
		}

		if (message.type === "message") {
			messages.innerHTML += `
                    <li class="normal-msg">
                        <span class="msg-time">${message.time}</span>
                        <span class="name">${message.from}</span>
                            para 
                        <span class="to">${message.to}:</span>
                        <span class="msg">${message.text}</span>
                    </li>
                `;
		}

		const privateMessage =
			message.type === "private_message" &&
			(message.to === username || message.from === username);
		if (privateMessage) {
			messages.innerHTML += `
                    <li class="private-msg">
                        <span class="msg-time">${message.time}</span>
                        <span class="name">${message.from}</span>
                            reservadamente para 
                        <span class="to">${message.to}:</span>
                        <span class="msg">${message.text}</span>
                    </li>
                `;
		}
	});

	const lastMessageTime = response[response.length - 1].time;
	scrollToLastMessage(lastMessageTime);
}

function getUsers() {
	checkUsername();

	axios
		.get(`${URLbase}/participants`)
		.then((response) => {
			renderUsers(response.data);
		})
		.catch(errorMessage);
}

function renderUsers(response) {
	const users = document.querySelector(".contacts");
	users.innerHTML = `
        <li class="info-contact" onclick="selectUser('Todos', this)">                   
            <div class="contact-options">
                <ion-icon name="people"></ion-icon> 
                <p class="contact-name contact-name-selected">Todos</p>
                <img class="check ${
									sendTo === "Todos" ? "check-selected" : ""
								}" src="./assets/images/Vector.png" alt="">
            </div>
        </li>
    `;

	response.forEach((user) => {
		userTemplate = `
            <li class="info-contact" onclick="selectUser('${
							user.name
						}', this)">                   
                <div class="contact-options">
                    <ion-icon name="people"></ion-icon> 
                    <p class="contact-name">${user.name}</p>
                    <img class="check ${
											sendTo === user.name ? "check-selected" : ""
										}" src="./assets/images/Vector.png" alt="">
                </div>
            </li>    
        `;

		users.innerHTML += userTemplate;
	});
}

function login() {
	username = document.querySelector(".login-page > input").value;
	const body = { name: username };

	axios
		.post(`${URLbase}/participants`, body)
		.then(() => {
			closeLoginPage();
			getMessages();
			getUsers();
			renderChat();
		})
		.catch(() => {
			alert("Insira um nome válido.");
		});
}

function userStillActive() {
	const body = { name: username };
	axios.post(`${URLbase}/status`, body);
}

function renderChat() {
	checkUsername();

	setInterval(getMessages, 3000);
	setInterval(userStillActive, 5000);
	setInterval(getUsers, 10000);
}

function scrollToLastMessage(lastMessageTime) {
	if (lastMessageTime !== lastTime) {
		document.querySelector(".main li:last-child").scrollIntoView();
		lastTime = lastMessageTime;
	}
}

function checkUsername() {
	if (username === undefined) return;
}

function errorMessage(error) {
	console.log(error.response);
	alert("Ocorreu um erro, tente novamente em instantes.");
	window.location.reload();
}

function toggleMenu() {
	document.querySelector(".modal").classList.toggle("hide");
}

function closeLoginPage() {
	document.querySelector(".login-page").classList.add("hide");

	setTimeout(() => {
		document.querySelector(".loading-page").classList.add("hide");
	}, 1000);
}

document
	.querySelector(".login-page > input")
	.addEventListener("keydown", enterName);
function enterName(event) {
	if (event.which === 13) {
		login();
	}
}

document
	.querySelector(".footer > textarea")
	.addEventListener("keydown", enterMsg);
function enterMsg(event) {
	if (event.which === 13) {
		sendMessage();
	}
}
