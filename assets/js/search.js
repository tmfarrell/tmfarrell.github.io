class SemanticSearch {
    constructor() {
        this.maxQueriesPerDay = 3;
        this.apiBaseUrl = 'https://api-tmfarrell.netlify.app';
        this.init();
    }

    init() {
        this.updateQueryCounter();
        const form = document.getElementById('search-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSearch(e));
        }
    }

    getQueryCount() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('search_queries');
        
        if (!stored) return { date: today, count: 0 };
        
        try {
            const data = JSON.parse(stored);
            if (data.date !== today) {
                // New day, reset counter
                return { date: today, count: 0 };
            }
            return data;
        } catch (error) {
            // Invalid stored data, reset
            return { date: today, count: 0 };
        }
    }

    incrementQueryCount() {
        const queryData = this.getQueryCount();
        queryData.count += 1;
        localStorage.setItem('search_queries', JSON.stringify(queryData));
        this.updateQueryCounter();
    }

    updateQueryCounter() {
        const { count } = this.getQueryCount();
        const remaining = Math.max(0, this.maxQueriesPerDay - count);
        const counterEl = document.getElementById('query-counter');
        
        if (!counterEl) return;
        
        if (remaining > 0) {
            counterEl.textContent = `${remaining} search${remaining === 1 ? '' : 'es'} remaining today`;
            counterEl.className = 'query-counter';
        } else {
            counterEl.textContent = 'Daily search limit reached';
            counterEl.className = 'query-counter limit-reached';
        }
    }

    async handleSearch(e) {
        e.preventDefault();
        
        const { count } = this.getQueryCount();
        if (count >= this.maxQueriesPerDay) {
            this.showError("You've hit your limit for the day. Please email tfarrell01@gmail.com with any other questions you might have!");
            return;
        }

        const query = document.getElementById('search-query').value.trim();
        if (!query) return;

        this.setLoading(true);
        this.clearResults();
        
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
                    this.showError("Too many users have been using this feature and we've hit the limit of our free-tier backend services! Please take a break and try this feature again soon, or email tfarrell01@gmail.com with any other questions you might have.");
                } else {
                    this.showError(data.message || data.error || 'An error occurred while searching.');
                }
                return;
            }

            // Successfully got results
            this.incrementQueryCount();
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
        const btn = document.getElementById('search-btn');
        const text = btn?.querySelector('.search-btn-text');
        const spinner = btn?.querySelector('.search-btn-loading');
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
        
        if (!results || results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No results found</h3>
                    <p>Try rephrasing your question or using different keywords. The search looks through all my writing, reading notes, and project descriptions.</p>
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
                        <span class="result-score">Match: ${Math.round(result.score * 100)}%</span>
                    </div>
                    <p class="result-excerpt">${this.escapeHtml(result.excerpt)}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="results-header">
                <h2>Search Results</h2>
                <p>Found ${results.length} relevant post${results.length === 1 ? '' : 's'} for: <em>"${this.escapeHtml(query)}"</em></p>
            </div>
            <div class="results-list">
                ${resultHtml}
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('search-results');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message">
                <h3>Oops!</h3>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only initialize on the search page
        if (document.getElementById('search-form')) {
            new SemanticSearch();
        }
    });
} else {
    // DOM already loaded
    if (document.getElementById('search-form')) {
        new SemanticSearch();
    }
}