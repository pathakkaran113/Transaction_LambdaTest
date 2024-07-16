const btn  = document.getElementById('sendBtn');

//document.getElementById('sendBtn')
 btn.addEventListener('click', async () => {
    let sender = document.getElementById('sender').value;
    if (sender.trim() === '') return;
    
    // Add user message to chat
    addMessage(sender, 'user');

    // Clear the input
    document.getElementById('sender').value = '';

    // Fetch reply from OpenAI API
    let reply = await getReply(sender);
    addMessage(reply, 'bot');
});

//btn.addEventListener('click', sendMessage);
document.getElementById('sender').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        async () => {
            let sender = document.getElementById('sender').value;
            if (sender.trim() === '') return;
            
            // Add user message to chat
            addMessage(sender, 'user');
        
            // Clear the input
            document.getElementById('sender').value = '';
        
            // Fetch reply from OpenAI API
            let reply = await getReply(sender);
            addMessage(reply, 'bot');
        }
    }
});



async function getReply(sender) {
    const APIKey = 'sk-proj-lyDfgGF0LkMSz3qTlkwlT3BlbkFJBJgTNutAD2QJ52cMSvUd';
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APIKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: `Give the reply for this question on behalf of a finance advisor The question is: ${sender}?` }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error fetching reply:', error);
        return 'An error occurred. Please try again.';
    }
}

function addMessage(content, sender) {
    const chatBody = document.getElementById('chat-body');

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');

    const iconElement = document.createElement('div');
    iconElement.classList.add('icon');
    iconElement.textContent = sender === 'bot' ? '🤖' : '🧑';

    const textElement = document.createElement('div');
    textElement.classList.add('text');
    textElement.textContent = content;

    messageElement.appendChild(iconElement);
    messageElement.appendChild(textElement);

    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}
