const messageInput = document.querySelector(".user-reply");
const chatbody = document.querySelector(".chatbot-body");
const sendMessageButton = document.querySelector("#send-message");

const API_KEY= `AIzaSyDW_QskOcV96AsGodmt_InOg-snGPCfc6I`;
const API_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message : null
}

//Message element with dynamic classes
const createMessageElement = (content,...classes) => {
    const div = document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML = content;
    return div;
}

// const generateBotResponse = ()=>{
 
// const requestOptions ={
//   method : "POST",
//   headers : {
//     "Content-Type " : "application/json"
//    },
//    body :JSON.stringify({
//     contents : [
//       {
//         parts: [
//           {
//             text: userData.message
//           }
//         ]
//       }
//      ] 
// })
// };
//   try{
//     const response = await fetch(API_URL, requestOptions);
//   }catch(error){

//   }
// }

//handling outgoing user messages
handleOutgoingMeassage = (e)=>{
    e.preventDefault(); //prevent form from submmitting
    userData.message = messageInput.value.trim();

    messageInput.value = "";//clear textarea after sending input

    //create and display user message
    const messageContent = `<div class="message-text">${userData.message}</div>`;
    const outgoingMessageDiv = createMessageElement(messageContent,"user-message");

    outgoingMessageDiv.querySelector(".message-text").innerText =  userData.message; //proper text rendering

    chatbody.appendChild(outgoingMessageDiv);

    //Get bot thinking indicater after delay 
    setTimeout(()=>{
    const messageContent = `<svg class="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <div class="message-text">
               <div class="loading-indicator">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
               </div>
            </div>`;
    const incomingMessageDiv = createMessageElement(messageContent,"bot-message","loading-indicator");
    chatbody.appendChild(incomingMessageDiv);
    // generateBotResponse();
    chatbody.scrollTop = chatbody.scrollHeight;
    },600);
  
  //  chatbody.scrollTop = chatbody.scrollHeight - chatbody.clientHeight;  AutoScroll
    chatbody.scrollTop = chatbody.scrollHeight;
}

//Enter key to send message
messageInput.addEventListener("keydown" , (e)=>{
   const userMessage = e.target.value.trim();
   if(e.key=='Enter' && userMessage){
    handleOutgoingMeassage(e);
   }
});

sendMessageButton.addEventListener("click",(e) => handleOutgoingMeassage(e));