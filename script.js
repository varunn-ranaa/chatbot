const messageInput = document.querySelector(".user-reply");
const chatbody = document.querySelector(".chat-body");

//Message element with dynamic classes
createMessageElement = (content,classes) => {
    const div = document.createElement("div");
    div.classList.add("message",classes);
    div.innerHTML = content;
    return div;
}

//handling outgoing user messages
handleOutgoingMeassage = (userMessage)=>{
    //create and display user message
    const messageContent = `<div class="message-text">${userMessage}</div>`;
    const messagediv = createMessageElement(messageContent,"user-message");
    chatbody.appendChild(messagediv);
    
}

//Enter key to send message
messageInput.addEventListener("keydown" , (e)=>{
   const userMessage = e.target.value.trim();
   if(e.key=='Enter' && userMessage){
    handleOutgoingMeassage(userMessage);
   }
});