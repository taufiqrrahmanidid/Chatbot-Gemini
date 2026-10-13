const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Fungsi untuk mendapatkan waktu saat ini dengan format (Today, HH:MMpm)
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `Today, ${hours}:${minutes}${ampm}`;
}

// Fungsi untuk menambahkan pesan ke antarmuka
function appendMessage(sender, text) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', sender);
    
    const timeStr = getCurrentTime();

    // Template HTML untuk bubble chat
    wrapper.innerHTML = `
        <div class="message-bubble">${text}</div>
        <span class="timestamp">${timeStr}</span>
    `;

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
    return wrapper;
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // Tampilkan pesan pengguna
    appendMessage('user', userMessage);
    input.value = '';

    // Tampilkan indikator bot sedang memproses
    const botWrapper = appendMessage('bot', 'Typing...');
    const botBubble = botWrapper.querySelector('.message-bubble');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data && data.result) {
            // Render hasil dari Gemini (mengubah newline menjadi <br> agar rapi)
            botBubble.innerHTML = data.result.replace(/\n/g, '<br>');
        } else {
            botBubble.textContent = 'Sorry, no response received.';
        }
    } catch (error) {
        console.error('Error:', error);
        botBubble.textContent = 'Failed to connect to the server.';
    } finally {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});