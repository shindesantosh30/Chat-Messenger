const socket = io();
let messageTextarea = document.getElementById('messageTextarea');
let selectedUserName = document.getElementById('selectedUserName');
let chatArea = document.getElementById('chatArea');
let userChatWindows = document.getElementById('userChatWindows');
let userList = document.getElementById('userList');

let name;
const storedFirstName = localStorage.getItem('name');
name = storedFirstName ? storedFirstName : 'User';
const senderID = localStorage.getItem('userID');

const defaultPage = () => {
    chatArea.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
            <div style="background-color: #f9f9f9; border-radius: 10px; padding: 40px 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="margin-bottom: 20px; font-size: 1.5em;">Welcome to the Chat</h2>
                <p style="margin: 0; font-size: 1.2em;">Start the conversation by sending your first message.</p>
                <div style="margin-top: 20px;">
                    <span style="color: #ff69b4;">🎉</span> <span style="color: #ff4500;">🎊</span> <span style="color: #00bfff;">🎈</span>
                </div>
                <p style="margin-top: 30px; font-size: 1.2em;">Feel free to explore and enjoy!</p>
            </div>
        </div>
    `;
}

window.addEventListener('load', async () => {
    try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Internal server error !!!');
        }
        const url = `/contact-users?userId=${senderID}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const userData = await response.json();
            const users = userData.data;
            if (users) {
                users.forEach(user => {
                    appendUser(user);
                });
            }
        } else {
            console.error('Failed to fetch user list');
        }
        defaultPage();
    } catch (error) {
        console.error('Error fetching user list:', error);
    }
});

function sendMessage(message) {
    let receiverId = getSelectedUserId();
    let senderId = localStorage.getItem('userID');
    let content = {
        message: message.trim(),
        senderId: senderId,
        receiverId: receiverId
    };
    appendMessage(content, 'outgoing');
    messageTextarea.value = '';
    scrollToBottom();
    socket.emit('message', content);
}

function getSelectedUserId() {
    let selectedUser = document.querySelector('.user.selected');
    return selectedUser ? selectedUser.dataset.userId : null;
}

const distributeMessage = (message) => {
    let type = message.senderId == senderID ? 'outgoing' : 'incoming';
    appendMessage(message, type);
};

function appendMessage(msg, type) {
    let messageDiv = document.createElement('div');
    let className = type;
    messageDiv.classList.add(className, 'message');
    let markup = `<p>${msg.message}</p><small>${formatTime(msg.createdAt)}</small>`;
    messageDiv.innerHTML = markup;
    chatArea.appendChild(messageDiv);
}

const formatTime = (time) => {
    const date = time ? new Date(time) : new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

function appendUser(user) {
    if (user.id != senderID) {
        let li = document.createElement('li');
        if (user.firstName) {
            var name = user.firstName
        } if (user.lastName) {
            name += user.lastName
        }
        if (!name) {
            name = user.username;
        }
        li.textContent = `${user.firstName} ${user.lastName}`;
        li.dataset.userId = user.id;
        li.classList.add('user');
        li.addEventListener('click', () => {
            selectUser(li);
        });

        userList.appendChild(li);
    }
}

function selectUser(selectedUser) {
    let prevSelectedUser = document.querySelector('.user.selected');
    if (prevSelectedUser) {
        prevSelectedUser.classList.remove('selected');
    }
    if (selectedUser) {
        selectedUser.classList.add('selected');
        selectedUserName.textContent = selectedUser.textContent;

        let userId = selectedUser.dataset.userId;
        let chatWindow = document.getElementById(`user${userId}-chat`);
        if (!chatWindow) {
            chatWindow = document.createElement('div');
            chatWindow.id = `user${userId}-chat`;
            chatWindow.classList.add('user-chat-window', 'active');
            chatWindow.innerHTML = '';
            userChatWindows.appendChild(chatWindow);
        } else {
            let activeChatWindow = document.querySelector('.user-chat-window.active');
            if (activeChatWindow) {
                activeChatWindow.classList.remove('active');
            }
            chatWindow.classList.add('active');
        }
        messageTextarea.value = '';
        fetchConversation(userId);

        // Show message input
        messageInput.style.display = 'block';
    } else {
        // Hide message input
        messageInput.style.display = 'none';
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
socket.on('authenticationRequired', () => {
    window.location.href = '/login';
});

// Handle other socket events and functionality as needed
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById('sendMessageBtn').addEventListener('click', () => {
    const message = messageTextarea.value.trim();
    if (message) {
        if (message !== '') {
            sendMessage(message);
        }
    }
    // sendMessage(messageTextarea.value);
});

messageTextarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const message = e.target.value.trim();
        if (message !== '') {
            sendMessage(message);
        }
    }
});

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

async function fetchConversation(receiver) {
    try {
        const url = `/message?sender=${senderID}&receiver=${receiver}`;
        console.log("RECEIVER ", receiver, "SENDER ", senderID);
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const conversation = await response.json();
            if (conversation && conversation.length > 0) {
                chatArea.innerHTML = '';
                conversation.forEach(msg => {
                    distributeMessage(msg);
                });
                scrollToBottom();
            } else {
                chatArea.innerHTML = `
                <div style="font-family: Arial, sans-serif; color: #fff; text-align: center; background:linear-gradient(45deg, #076089, #05c7e0); border-radius: 10px; padding: 20px;">
                    <h2 style="margin-bottom: 10px; font-size: 1.5em;">Hello ${name}</h2>
                    <p style="margin: 0; font-size: 1.2em;">It appears that there are no messages in this conversation yet.</p>
                </div>
            `;
            }
        } else {
            console.error('Failed to fetch conversation');
        }

    } catch (error) {
        console.error('Error fetching conversation:', error);
    }
}

