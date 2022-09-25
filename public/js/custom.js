const socket = io();
console.log(window.location.pathname)
// CHAT APP

if (window.location.pathname === "/chat") {
    socket.emit("requestMessages")
    socket.on("conexionOK", data => {
        document.getElementById("chat_messages_new").innerHTML = data.messages.map(message =>        
        `
        <div class="chat-message-right pb-4">
            <div>
                <div class="text-muted small text-nowrap mt-2">${message.dataObject.date}</div>
            </div>
            <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                <div class="font-weight-bold mb-1">${message.dataObject.email}</div>
                ${message.dataObject.text}
            </div>
        </div>
        `).join("");
    })

    const emailField = document.getElementById("socket-email");
    const messageField = document.getElementById("socket-input");
    const sendButton = document.getElementById("socket-send");
    sendButton.addEventListener("click", ()=>{
        const text = messageField.value;
        const email = emailField.value;
        console.log(email)

        const newMessage = {
            email: email,
            date: new Date().toLocaleString(),
            text: text,
        }

        socket.emit("message", newMessage)
        emailField.value = "";
        messageField.value = "";
    })

}
