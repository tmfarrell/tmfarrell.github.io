class SemanticSearch {

    constructor() {
        this.maxQueriesPerDay = 20;
        this.isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.useMockData = new URLSearchParams(window.location.search).get('mock') === 'true';
        this.useLocal = new URLSearchParams(window.location.search).get('local') === 'true';
        this.isDebugMode = this.useMockData || this.useLocal;
        this.apiBaseUrl = this.useLocal 
            ? 'http://localhost:8888' 
            : 'https://api-tmfarrell.netlify.app';
        
        const form = document.getElementById('search-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSearch(e));
        }
        
        this.bindTextarea();
        this.bindDebugButton();
    }
    
    bindTextarea() {
        const textarea = document.getElementById('search-query');
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSearch(e);
                }
            });
        }
    }
    
    bindDebugButton() {
        if (!this.isDebugMode) return;
        
        const resetBtn = document.getElementById('reset-counters-btn');
        if (resetBtn) {
            resetBtn.classList.remove('hidden');
            resetBtn.addEventListener('click', () => this.resetCounters());
        }
        
        const nearLimitBtn = document.getElementById('near-limit-btn');
        if (nearLimitBtn) {
            nearLimitBtn.classList.remove('hidden');
            nearLimitBtn.addEventListener('click', () => this.setNearLimit());
        }
    }
    
    setNearLimit() {
        const today = new Date().toDateString();
        localStorage.setItem('search_queries', JSON.stringify({ date: today, count: this.maxQueriesPerDay - 1 }));
        localStorage.setItem('chat_queries', JSON.stringify({ date: today, count: 5 - 1 }));
        
        if (chatInstance) {
            chatInstance.hasUsedAI = true;
            chatInstance.checkChatAvailability();
            chatInstance.updateUsageCounter();
        }
        
        this.updateQueryCounter();
    }
    
    resetCounters() {
        localStorage.removeItem('search_queries');
        localStorage.removeItem('chat_queries');
        
        if (chatInstance) {
            chatInstance.hasUsedAI = false;
            chatInstance.messages = [];
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) chatMessages.innerHTML = '';
            
            const chatBtn = document.getElementById('mode-chat');
            if (chatBtn) {
                chatBtn.disabled = false;
                chatBtn.classList.remove('disabled');
                chatBtn.title = 'Switch to chat mode';
            }
            
            chatInstance.checkChatAvailability();
            chatInstance.updateUsageCounter();
        }
        
        const searchResults = document.getElementById('search-results');
        if (searchResults) searchResults.innerHTML = '';
        
        this.updateQueryCounter();
    }

    getMockResults() {
        return [
            {
                url: '/writing/some-post/',
                title: 'How I Built My Personal Website',
                date: '2024-01-15',
                category: 'writing',
                tags: ['product', 'AI/ ML', 'strategy'],
                score: 0.92,
                excerpt: 'A deep dive into the technical decisions behind building this site using Jekyll and GitHub Pages. I cover the design system, performance optimizations, and deployment workflow.'
            },
            {
                url: '/building/fib/',
                title: 'Side Project: futurein.bio',
                date: '2023-09-05',
                category: 'building',
                tags: ['bio/ health', 'newsletter'],
                score: 0.81,
                excerpt: 'A weekly visual newsletter on bio/ health and tech/ AI. https://futurein.bio'
            },
            {
                url: '/writing/another-post/',
                title: 'Another Post: Title  Here',
                date: '2024-02-01',
                category: 'writing',
                tags: ['execution'],
                score: 0.75,
                excerpt: 'Some example text here'
            }
        ];
    }

    getQueryCount() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('search_queries');
        
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

    incrementQueryCount() {
        const queryData = this.getQueryCount();
        queryData.count += 1;
        localStorage.setItem('search_queries', JSON.stringify(queryData));
        
        if (chatInstance) {
            chatInstance.hasUsedAI = true;
            chatInstance.updateUsageCounter();
        }
        
        this.updateQueryCounter();
    }

    updateQueryCounter() {
        const { count } = this.getQueryCount();
        const remaining = Math.max(0, this.maxQueriesPerDay - count);
        const chatRemaining = this.getChatRemaining();
        const counterEl = document.getElementById('usage-counter');
        
        if (!counterEl) return;
        
        if (remaining > 0 && chatRemaining > 0) {
            counterEl.textContent = `${remaining} search${remaining === 1 ? '' : 's'}, ${chatRemaining} chat${chatRemaining === 1 ? '' : 's'} remaining today`;
            counterEl.className = 'usage-counter';
        } else if (remaining > 0) {
            counterEl.textContent = `${remaining} search${remaining === 1 ? '' : 's'} remaining today`;
            counterEl.className = 'usage-counter';
        } else if (chatRemaining > 0) {
            counterEl.textContent = `${chatRemaining} chat${chatRemaining === 1 ? '' : 's'} remaining today`;
            counterEl.className = 'usage-counter';
        } else {
            counterEl.textContent = 'Daily limits reached';
            counterEl.className = 'usage-counter limit-reached';
        }
    }

    getChatRemaining() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('chat_queries');
        let chatCount = 0;
        
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.date === today) {
                    chatCount = data.count;
                }
            } catch (error) {}
        }
        
        return Math.max(0, 5 - chatCount);
    }

    async handleSearch(e) {
        e.preventDefault();
        
        const { count } = this.getQueryCount();
        if (count >= this.maxQueriesPerDay) {
            if (chatInstance) {
                chatInstance.activateSearchMode();
            }
            this.showError("You've hit your search limit for the day.<br>Feel free to email tfarrell01@gmail.com with any other questions you might have!");
            return;
        }

        const query = document.getElementById('search-query').value.trim();
        if (!query) return;

        this.setLoading(true);
        this.hideSuggestions();
        this.clearResults();
        this.incrementQueryCount();
        
        if (this.useMockData) {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.displayResults(this.getMockResults(), query);
            this.setLoading(false);
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/.netlify/functions/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Invalid response from search service');
            }

            if (!response.ok) {
                if (response.status === 429) {
                    this.showError("Too many users have been using this feature and we've hit the limit of our free-tier backend service! Please take a break and try this feature again soon, or email tfarrell01@gmail.com with any other questions you might have.");
                } else {
                    this.showError(data.message || data.error || 'An error occurred while searching.');
                }
                return;
            }

            this.displayResults(data.results, query);

        } catch (error) {
            console.error('Search error:', error);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showError('Unable to connect to search service. Please check your internet connection and try again.');
            } else {
                this.showError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const btn = document.querySelector('.ai-btn');
        const text = btn?.querySelector('.ai-btn-text');
        const spinner = btn?.querySelector('.ai-btn-loading');
        const input = document.getElementById('search-query');
        
        if (btn) btn.disabled = loading;
        if (input) input.disabled = loading;
        if (text) text.style.display = loading ? 'none' : 'inline';
        if (spinner) spinner.style.display = loading ? 'inline' : 'none';
    }

    clearResults() {
        const container = document.getElementById('search-results');
        if (container) {
            container.innerHTML = '';
        }
    }

    displayResults(results, query) {
        const container = document.getElementById('search-results');
        if (!container) return;
        
        container.classList.remove('hidden');
        
        if (!results || results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No results found</h3>
                    <p>Try rephrasing your question or using different keywords. The search looks through all my writing, reading notes, and portfolio projects.</p>
                </div>
            `;
            return;
        }

        const resultHtml = results.map((result, index) => `
            <div class="result-card">
                <div class="result-rank">${index + 1}</div>
                <div class="result-content">
                    <h3><a href="${result.url}" target="_blank" rel="noopener">${this.escapeHtml(result.title)}</a></h3>
                    <div class="result-meta">
                        ${result.date ? `<span class="result-date">${this.escapeHtml(result.date)}</span>` : ''}
                        ${result.category ? `<span class="result-category">${this.escapeHtml(result.category)}</span>` : ''}
                        ${result.tags && result.tags.length > 0 ? `<span class="result-tags">${result.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}</span>` : ''}
                    </div>
                    <p class="result-excerpt">${this.convertUrlsToLinks(this.escapeHtml(result.excerpt))}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="results-header">
                <h2>Search Results</h2>
                <p>Relevant content for: <em>"${this.escapeHtml(query)}"</em></p>
            </div>
            <div class="results-list">
                ${resultHtml}
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('search-results');
        if (!container) return;
        
        container.classList.remove('hidden');
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    convertUrlsToLinks(text) {
        if (!text) return '';
        const urlRegex = /(https?:\/\/[^\s,]+)/g;
        return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }
}

let searchInstance = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('search-form')) {
            searchInstance = new SemanticSearch();
        }
    });
} else {
    if (document.getElementById('search-form')) {
        searchInstance = new SemanticSearch();
    }
}
