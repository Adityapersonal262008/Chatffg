const socket = io('http://localhost:3000');

const username = localStorage.getItem('username');
if (username) {
  socket.emit('join', username);
} else {
  window.location.href = 'index.html'; // Redirect if no username found
}

const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messageList = document.getElementById('message-list');

// Send message
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('send-message', message);
    messageInput.value = ''; // Clear input after sending
  }
});

// Listen for new messages
socket.on('new-message', (data) => {
  const li = document.createElement('li');
  li.textContent = `${data.username}: ${data.message}`;
  messageList.appendChild(li);
  messageList.scrollTop = messageList.scrollHeight; // Scroll to bottom
});

// Listen for users joining and leaving
socket.on('user-joined', (username) => {
  const li = document.createElement('li');
  li.textContent = `${username} joined the chat`;
  messageList.appendChild(li);
});

socket.on('user-left', (username) => {
  const li = document.createElement('li');
  li.textContent = `${username} left the chat`;
  messageList.appendChild(li);
});
