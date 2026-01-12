const messageInput = document.querySelector(".user-reply");
const chatbody = document.querySelector(".chatbot-body");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploader = document.querySelector(".file-uploader");
const fileCancelButtom = document.querySelector("#file-cancel");

const API_KEY= `AIzaSyDW_QskOcV96AsGodmt_InOg-snGPCfc6I`;
const API_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message : null,
    file : {
      data : null,
      mime_type : null
    }
}

//Message element with dynamic classes
const createMessageElement = (content,...classes) => {
    const div = document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML = content;
    return div;
}

// Generate Bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userData.message },
            ...(userData.file.data ? [{inline_data: userData.file}] : [])
          ]
        }
      ]
    })
  };

  try {
    // Fetch bot response from API
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API Error");
    }

    const botReply = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

    messageElement.innerText = botReply;

  } catch (error) {
    messageElement.innerText = error.message;
    messageElement.style.color = "red";
    console.error("Error:", error);
  }finally{
    //reset user's file data , remove bot loading-indicator
    userData.file = {};
    incomingMessageDiv.classList.remove("loading-indicator");
  }

};


//handling outgoing user messages
handleOutgoingMeassage = (e)=>{
  
    e.preventDefault(); //prevent form from submmitting
    userData.message = messageInput.value.trim();

    if(!userData.message) return; // empty input no send  & validation for security

    messageInput.value = "";//clear textarea after sending input

    fileUploader.classList.remove("file-uploaded");

    sendMessageButton.disable = true;

    //create and display user message
    const messageContent = `<div class="message-text"></div>
              ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}"
                class="attachment"/>` : ""}`;

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
    
    generateBotResponse(incomingMessageDiv);

    chatbody.scrollTo({
      top: chatbody.scrollHeight,
      behavior :'smooth'
    });
    },600);
  
  //  chatbody.scrollTop = chatbody.scrollHeight - chatbody.clientHeight;  AutoScroll
      chatbody.scrollTo({
      top: chatbody.scrollHeight,
      behavior :'smooth'
    });
}

//Enter key to send message
messageInput.addEventListener("keydown" , (e)=>{
   const userMessage = e.target.value.trim();
   if(e.key=='Enter' && userMessage){
    handleOutgoingMeassage(e);
   }
});

//Attach File
fileInput.addEventListener("change",(e)=>{
   const file = fileInput.files[0];
   if(!file) return;

   let fileDate = new Date(file.lastModified);
   console.log(file.name);
   console.log(fileDate.toLocaleDateString());
   console.log(file.lastModifiedDate);
   console.log(file.size < 1000 ? file.size : `${Math.round(file.size/1000)}KB`);
   console.log(file.type);//MIME
   
   //convert file into Base64(binary to text encoding) 
   const reader = new FileReader();

   reader.onload = (e)=>{

     fileUploader.querySelector("img").src = e.target.result;
     fileUploader.classList.add("file-uploaded");

     const base64string = e.target.result.split(",")[1];
     //store data in UserData
     userData.file = {
      data : base64string,
      mime_type : file.type
     };
     fileInput.value = "";
     console.log(e.target.result.split(","));
   }
   reader.readAsDataURL(file);
});

fileCancelButtom.addEventListener("click",()=>{
  userData.file = {};
  fileUploader.classList.remove("file-uploaded");
});

//emoji picker --
const picker = new EmojiMart.Picker({
  // onEmojiSelect: console.log,
  theme : "light",
  previewPosition : "none",
  skinTonePosition : "none"
});

document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click",(e) => handleOutgoingMeassage(e));
document.querySelector("#file-upload").addEventListener("click",()=>{fileInput.click()});