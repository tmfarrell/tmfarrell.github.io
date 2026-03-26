const AI_MODE_SUGGESTIONS = [
    'What products has Tim worked on?',
    'Tell me about his experience with AI/ML.', 
    'What experience does Tim have with APIs?',
    'Does Tim have a technical background?'
];

class AIChat {
    constructor() {
        this.maxChatsPerDay = 5;
        this.isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.useMockData = new URLSearchParams(window.location.search).get('mock') === 'true';
        this.useLocal = new URLSearchParams(window.location.search).get('local') === 'true';
        this.apiBaseUrl = this.useLocal 
            ? 'http://localhost:8888' 
            : 'https://api-tmfarrell.netlify.app';
        this.messages = [];
        this.isStreaming = false;
        this.hasUsedAI = false;
        this.init();
    }

    init() {
        this.bindModeToggle();
        this.bindChatForm();
        this.bindTextarea();
        this.bindSuggestionsToggle();
        this.showSuggestions();
        this.showSuggestionsToggle();
        this.checkChatAvailability();
        this.updateUsageCounter();
    }

    checkChatAvailability() {
        const { count } = this.getQueryCount();
        if (count >= this.maxChatsPerDay) {
            const chatBtn = document.getElementById('mode-chat');
            
            if (chatBtn) {
                chatBtn.disabled = true;
                chatBtn.classList.add('disabled');
                chatBtn.title = "You've hit your chat limit for the day";
            }
            
            this.activateSearchMode();
        } else {
            this.activateChatMode();
        }
    }

    activateChatMode() {
        const searchBtn = document.getElementById('mode-search');
        const chatBtn = document.getElementById('mode-chat');
        const searchForm = document.getElementById('search-form');
        const chatForm = document.getElementById('chat-form');
        const searchSuggestions = document.getElementById('search-suggestions');
        const chatSuggestions = document.getElementById('chat-suggestions');
        const chatMessages = document.getElementById('chat-messages');
        const searchResults = document.getElementById('search-results');
        
        chatBtn?.classList.add('active');
        searchBtn?.classList.remove('active');
        chatForm?.classList.remove('hidden');
        searchForm?.classList.add('hidden');
        chatSuggestions?.classList.remove('hidden');
        searchSuggestions?.classList.add('hidden');
        chatMessages?.classList.remove('hidden');
        searchResults?.classList.add('hidden');
    }

    activateSearchMode() {
        const searchBtn = document.getElementById('mode-search');
        const chatBtn = document.getElementById('mode-chat');
        const searchForm = document.getElementById('search-form');
        const chatForm = document.getElementById('chat-form');
        const searchResults = document.getElementById('search-results');
        const searchSuggestions = document.getElementById('search-suggestions');
        const chatMessages = document.getElementById('chat-messages');
        const chatSuggestions = document.getElementById('chat-suggestions');
        const chatCounter = document.getElementById('chat-counter');
        const usageCounter = document.getElementById('usage-counter');
        
        searchBtn?.classList.add('active');
        chatBtn?.classList.remove('active');
        searchForm?.classList.remove('hidden');
        chatForm?.classList.add('hidden');
        searchSuggestions?.classList.remove('hidden');
        chatSuggestions?.classList.add('hidden');
        searchResults?.classList.add('hidden');
        chatMessages?.classList.add('hidden');
        if (chatCounter) chatCounter.classList.add('hidden');
        if (usageCounter) usageCounter.classList.remove('hidden');
    }

    updateUsageCounter() {
        const { count } = this.getQueryCount();
        const searchRemaining = this.getSearchRemaining();
        const remaining = Math.max(0, this.maxChatsPerDay - count);
        const usageCounter = document.getElementById('usage-counter');
        
        if (!usageCounter) return;
        
        if (this.hasUsedAI) {
            if (searchRemaining > 0 && remaining > 0) {
                usageCounter.textContent = `${searchRemaining} search${searchRemaining === 1 ? '' : 'es'}, ${remaining} chat${remaining === 1 ? '' : 's'} remaining today`;
                usageCounter.className = 'usage-counter';
            } else if (searchRemaining > 0) {
                usageCounter.textContent = `${searchRemaining} search${searchRemaining === 1 ? '' : 'es'} remaining today`;
                usageCounter.className = 'usage-counter';
            } else if (remaining > 0) {
                usageCounter.textContent = `${remaining} chat${remaining === 1 ? '' : 's'} remaining today`;
                usageCounter.className = 'usage-counter';
            } else {
                usageCounter.textContent = 'Daily limits reached';
                usageCounter.className = 'usage-counter limit-reached';
            }
        } else {
            usageCounter.textContent = '';
        }
    }

    getSearchRemaining() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('search_queries');
        let searchCount = 0;
        
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.date === today) {
                    searchCount = data.count;
                }
            } catch (error) {}
        }
        
        return Math.max(0, 20 - searchCount);
    }

    bindModeToggle() {
        const searchBtn = document.getElementById('mode-search');
        const chatBtn = document.getElementById('mode-chat');
        const searchForm = document.getElementById('search-form');
        const chatForm = document.getElementById('chat-form');
        const searchResults = document.getElementById('search-results');
        const searchSuggestions = document.getElementById('search-suggestions');
        const chatMessages = document.getElementById('chat-messages');
        const chatSuggestions = document.getElementById('chat-suggestions');
        const queryCounter = document.getElementById('query-counter');
        const chatCounter = document.getElementById('chat-counter');

        const activateSearch = () => {
            const chatValue = document.getElementById('chat-input')?.value || '';
            const searchInput = document.getElementById('search-query');
            if (searchInput) searchInput.value = chatValue;
            
            searchBtn?.classList.add('active');
            chatBtn?.classList.remove('active');
            searchForm?.classList.remove('hidden');
            chatForm?.classList.add('hidden');
            searchSuggestions?.classList.remove('hidden');
            chatSuggestions?.classList.add('hidden');
            searchResults?.classList.add('hidden');
            chatMessages?.classList.add('hidden');
            chatCounter?.classList.add('hidden');
            const usageCounter = document.getElementById('usage-counter');
            if (usageCounter && chatInstance?.hasUsedAI) {
                usageCounter.classList.remove('hidden');
                chatInstance.updateUsageCounter();
            }
        };

        const activateChat = () => {
            const searchValue = document.getElementById('search-query')?.value || '';
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.value = searchValue;
            
            chatBtn?.classList.add('active');
            searchBtn?.classList.remove('active');
            chatForm?.classList.remove('hidden');
            searchForm?.classList.add('hidden');
            chatSuggestions?.classList.remove('hidden');
            searchSuggestions?.classList.add('hidden');
            chatMessages?.classList.remove('hidden');
            searchResults?.classList.add('hidden');
            queryCounter?.classList.add('hidden');
            const usageCounter = document.getElementById('usage-counter');
            if (usageCounter) usageCounter.classList.remove('hidden');
            this.updateChatCounter();
        };

        searchBtn?.addEventListener('click', activateSearch);
        chatBtn?.addEventListener('click', activateChat);
    }

    bindSuggestionsToggle() {
        const toggle = document.getElementById('suggestions-toggle');
        const wrapper = document.getElementById('suggestions-wrapper');
        
        if (!toggle || !wrapper) return;
        
        toggle.addEventListener('click', () => {
            const isVisible = wrapper.classList.contains('visible');
            
            if (isVisible) {
                wrapper.classList.remove('visible');
                toggle.classList.remove('active');
            } else {
                this.showSuggestions();
                wrapper.classList.add('visible');
                toggle.classList.add('active');
            }
        });
    }

    bindChatForm() {
        const form = document.getElementById('chat-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    bindTextarea() {
        const textarea = document.getElementById('chat-input');
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSubmit(e);
                }
            });
        }
    }

    getQueryCount() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('chat_queries');
        
        if (!stored) return { date: today, count: 0 };
        
        try {
            const data = JSON.parse(stored);
            if (data.date !== today) {
                return { date: today, count: 0 };
            }
            return data;
        } catch (error) {
            return { date: today, count: 0 };
        }
    }

    incrementQueryCount() {
        const queryData = this.getQueryCount();
        queryData.count += 1;
        localStorage.setItem('chat_queries', JSON.stringify(queryData));
        
        this.hasUsedAI = true;
        
        const counterEl = document.getElementById('chat-counter');
        if (counterEl) {
            counterEl.classList.remove('hidden');
        }
        
        this.updateChatCounter();
        this.updateUsageCounter();
    }

    updateChatCounter() {
        const { count } = this.getQueryCount();
        const remaining = Math.max(0, this.maxChatsPerDay - count);
        const counterEl = document.getElementById('chat-counter');
        
        if (!counterEl) return;
        
        if (remaining > 0) {
            counterEl.textContent = `${remaining} chat${remaining === 1 ? '' : 's'} remaining today`;
            counterEl.className = 'query-counter';
        } else {
            counterEl.textContent = 'Daily chat limit reached';
            counterEl.className = 'query-counter limit-reached';
            
            const chatBtn = document.getElementById('mode-chat');
            if (chatBtn) {
                chatBtn.disabled = true;
                chatBtn.classList.add('disabled');
                chatBtn.title = "You've hit your chat limit for the day";
            }
        }
        
        this.updateUsageCounter();
    }

    showSuggestions() {
        const searchContainer = document.getElementById('search-suggestions');
        const chatContainer = document.getElementById('chat-suggestions');

        const shuffled = [...AI_MODE_SUGGESTIONS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 2);

        if (searchContainer) {
            searchContainer.innerHTML = selected.map(s => 
                `<button class="suggestion-btn">${s}</button>`
            ).join('');

            searchContainer.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const input = document.getElementById('search-query');
                    if (input) {
                        input.value = btn.textContent;
                        input.focus();
                    }
                });
            });
        }

        if (chatContainer) {
            chatContainer.innerHTML = selected.map(s => 
                `<button class="suggestion-btn">${s}</button>`
            ).join('');

            chatContainer.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const input = document.getElementById('chat-input');
                    if (input) {
                        input.value = btn.textContent;
                        input.focus();
                    }
                });
            });
        }
    }

    hideSuggestions() {
        const wrapper = document.getElementById('suggestions-wrapper');
        const toggle = document.getElementById('suggestions-toggle');
        
        if (wrapper) {
            wrapper.classList.remove('visible');
            wrapper.style.display = 'none';
        }
        if (toggle) {
            toggle.classList.remove('active');
            toggle.style.display = 'none';
        }
    }

    showSuggestionsToggle() {
        const wrapper = document.getElementById('suggestions-wrapper');
        const toggle = document.getElementById('suggestions-toggle');
        
        if (wrapper) wrapper.style.display = '';
        if (toggle) toggle.style.display = '';
    }

    getMockResponse(userMessage) {
        return `Thanks for your question about "${userMessage}".\n
        I can share some insights from Tim's work in product management and health/ biotech.\n
        Tim has a technical background in biomedical engineering and has worked in various roles across research, engineering and product. His approach typically involves understanding user needs deeply before proposing solutions.\n
        You might be interested in checking out some of his writing on product strategy or his notes on relevant books. Feel free to explore the search results or continue our conversation!
        `;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isStreaming) return;

        const input = document.getElementById('chat-input');
        const message = input?.value.trim();
        
        if (!message) return;

        const { count } = this.getQueryCount();
        if (count >= this.maxChatsPerDay) {
            this.showError("You've hit your chat limit for the day.<br>Feel free to email tfarrell01@gmail.com with any other questions!");
            return;
        }

        this.hideSuggestions();
        this.incrementQueryCount();
        
        const newCount = this.getQueryCount().count;
        const atLimit = newCount >= this.maxChatsPerDay;
        
        this.addMessage('user', message);
        input.value = '';

        this.setLoading(true);
        
        try {
            let responseText;
            
            let responseData = null;
            
            if (this.useMockData) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                responseText = this.getMockResponse(message);
            } else {
                const response = await fetch(`${this.apiBaseUrl}/.netlify/functions/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        query: message,
                        history: this.messages
                    })
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error("Too many users have been using this feature. Please try again soon!");
                    } else if (response.status === 401) {
                        throw new Error('Service temporarily unavailable.');
                    } else {
                        responseData = await response.json().catch(() => ({}));
                        throw new Error(responseData.error || responseData.message || 'An error occurred.');
                    }
                }

                responseData = await response.json();
                responseText = responseData.response || responseData.text || responseData.content || responseData.result || JSON.stringify(responseData);
                
                if (!responseText || responseText === '{}') {
                    throw new Error('Empty response from chat service');
                }
            }
            
            if (atLimit) {
                responseText += '\n\n---\n\nP.S. You\'ve hit your chat limit for the day. Feel free to use search mode or email tfarrell01@gmail.com with any other questions!';
            }

            await this.streamResponse(responseText);
            
            if (atLimit) {
                this.updateChatCounter();
            }

        } catch (error) {
            console.error('Chat error:', error);
            this.showError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(role, content) {
        this.messages.push({ role, content });
        
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        container.classList.remove('hidden');

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;
        
        const formattedContent = role === 'assistant' ? this.formatMarkdown(content) : this.escapeHtml(content);
        messageDiv.innerHTML = `<div class="message-content">${formattedContent}</div>`;
        
        container.appendChild(messageDiv);
        this.scrollToBottom();
    }

    async streamResponse(text) {
        this.isStreaming = true;
        
        const container = document.getElementById('chat-messages');
        container.classList.remove('hidden');
        
        const streamingDiv = document.createElement('div');
        streamingDiv.className = 'chat-message assistant';
        streamingDiv.id = 'streaming-message';
        streamingDiv.innerHTML = '<div class="message-content"></div><span class="typing-indicator"><span></span><span></span><span></span></span>';
        container.appendChild(streamingDiv);

        const contentDiv = streamingDiv.querySelector('.message-content');
        const typingIndicator = streamingDiv.querySelector('.typing-indicator');
        
        const chars = text.split('');
        const baseDelay = Math.max(8, 600 / text.length);
        
        for (let i = 0; i < chars.length; i++) {
            await new Promise(resolve => setTimeout(resolve, baseDelay + (Math.random() * 5 - 2.5)));
            
            const partialText = text.substring(0, i + 1);
            contentDiv.innerHTML = this.formatMarkdown(partialText);
            this.scrollToBottom();
        }
        
        typingIndicator?.remove();
        this.isStreaming = false;
        
        this.messages.push({ role: 'assistant', content: text });
    }

    scrollToBottom() {
        const container = document.getElementById('chat-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    formatMarkdown(text) {
        if (!text) return '';
        
        let formatted = this.escapeHtml(text);
        
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');
        
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
        
        formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, (match) => {
            if (match.includes('<ol>')) return match;
            return '<ul>' + match + '</ul>';
        });
        
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        
        if (!formatted.startsWith('<p>') && !formatted.startsWith('<ol>') && !formatted.startsWith('<ul>')) {
            formatted = '<p>' + formatted + '</p>';
        }
        
        return formatted;
    }

    showError(message) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message error';
        errorDiv.innerHTML = `
            <div class="message-content">
                <p class="error-text">${message}</p>
            </div>
        `;
        container.appendChild(errorDiv);
        this.scrollToBottom();
    }

    setLoading(loading) {
        const chatForm = document.getElementById('chat-form');
        const btn = chatForm?.querySelector('.ai-btn');
        const text = btn?.querySelector('.ai-btn-text');
        const spinner = btn?.querySelector('.ai-btn-loading');
        const input = document.getElementById('chat-input');
        
        if (btn) btn.disabled = loading;
        if (input) input.disabled = loading;
        if (text) text.style.display = loading ? 'none' : 'inline';
        if (spinner) spinner.style.display = loading ? 'inline' : 'none';
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

let chatInstance = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('chat-form')) {
            chatInstance = new AIChat();
        }
    });
} else {
    if (document.getElementById('chat-form')) {
        chatInstance = new AIChat();
    }
}
