const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  chatInput.value = '';

  setTimeout(() => {
    let botResponse = getBotResponse(message);
    appendMessage(botResponse, 'bot');
  }, 600);
}

function appendMessage(msg, type) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('msg', type);
  msgDiv.textContent = msg;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(userInput) {
  const msg = userInput.toLowerCase();
  if (msg.includes("portfolio")) return "Let's dive into your portfolio analysis!";
  if (msg.includes("risk")) return "We can assess your risk exposure right away.";
  if (msg.includes("strategy")) return "Sure! Let's create an investment strategy.";
  return "I'm here to help! Try asking about portfolio, risk, or strategy.";
}
