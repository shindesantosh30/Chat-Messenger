const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

const storedFirstName = localStorage.getItem('name');
if (storedFirstName) { name = storedFirstName; } else { name = 'User'; }

window.addEventListener('load', async () => {
    try {
        const response = await fetch('/message');
        if (response.ok) {
            const data = await response.json();
            const messages = data.data;
            console.log("messages : ", messages);
            messages.forEach(msg => {
                appendMessage(msg, 'incoming');
            });
            scrollToBottom();
        } else {
            console.error('Failed to fetch previous messages');
        }
    } catch (error) {
        console.error('Error fetching previous messages:', error);
    }
});


textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let content = {
        message: message.trim(),
        senderId: YOUR_SENDER_ID_HERE,
        receiverId: YOUR_RECEIVER_ID_HERE
    };

    // Append 
    appendMessage(content, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send to server 
    socket.emit('message', content);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    // Check if the message user matches the stored name
    if (msg.user === name) {
        mainDiv.classList.add('outgoing');
    }

    let markup = `<h4>${msg.user}</h4> <p>${msg.message}</p>`;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}


// Receive messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
