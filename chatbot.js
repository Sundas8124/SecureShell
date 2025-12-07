window.addEventListener('load', () => {
  const chatbotBtn = document.getElementById('chatbot-btn');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');

  function appendMessage(sender, text){
    const div = document.createElement('div');
    div.style.marginBottom = '6px';
    if(sender === 'user'){
      div.style.fontWeight = '600';
      div.textContent = 'You: ' + text;
    } else {
      div.textContent = 'Bot: ' + text;
    }
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  chatbotBtn.addEventListener('click', () => {
    chatbotWindow.style.display = (chatbotWindow.style.display === 'flex') ? 'none' : 'flex';
  });

  function handleChat(){
    const q = chatbotInput.value.trim();
    if(!q) return;
    appendMessage('user', q);
    chatbotInput.value = '';

    const query = q.toLowerCase();
    let reply = "";

    if(query.includes("encrypt") || query.includes("aes") || query.includes("des") || query.includes("base64") || query.includes("security")){
      reply = "Encryption transforms readable information into protected ciphertext. AES is currently the strongest widely used cipher. DES and Base64 are older or simpler methods.";
    }
    else if(query.includes("decrypt")){
      reply = "Decryption reverses encryption. Only users with the correct key can convert ciphertext back into readable text.";
    }
    else if(query.includes("hello") || query.includes("hi") || query.includes("hey")){
      reply = "Hello! How can I help you today?";
    }
    else if(query.includes("how are you") || query.includes("what's up") || query.includes("sup")){
      reply = "I'm just a chatbot, but I'm functioning perfectly! 😄 How about you?";
    }
    else if(query.includes("your name")){
      reply = "I am SecureShell Bot — your friendly encryption assistant!";
    }
    else if(query.includes("who") || query.includes("what") || query.includes("when") || query.includes("where") || query.includes("why") || query.includes("how")){
      reply = "Here's a brief answer for your query: " + q + ". You can also ask me for a detailed explanation!";
    }
    else {
      reply = "I am here to help with encryption, decryption, and basic questions. Could you rephrase?";
    }

    appendMessage('bot', reply);
  }

  chatbotSend.addEventListener('click', handleChat);
  chatbotInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ 
      e.preventDefault(); 
      handleChat(); 
    }
  });
});