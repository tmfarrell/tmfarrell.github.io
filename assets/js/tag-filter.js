class TagFilter {
  constructor(category) {
    this.category = category;
    this.root = document.querySelector(`.filter-component[data-filter="${category}"]`);
    if (!this.root) return;

    this.container = document.getElementById(`post-list-${category}`) || document.getElementById(`portfolio-list`);
    this.panel = this.root.querySelector('.filter-wrap');
    this.trigger = this.root.querySelector('.filter-trigger');
    this.searchInput = this.root.querySelector('[data-filter-input="query"]');
    this.chipsEl = this.root.querySelector('.filter__chips');
    this.badge = this.root.querySelector('[data-trigger-badge]');
    this.clearBtn = this.root.querySelector('[data-filter-action="clear"]');

    this.allTags = new Set();
    this.activeTags = new Set();
    this.query = '';
    this.isExpanded = false;

    this.init();
  }

  init() {
    this.collectTags();
    this.renderChips();
    this.bindToggle();
    this.bindSearch();
    this.bindChips();
    this.bindClear();
    this.bindEscape();
    this.updateStatus();
  }

  getItems() {
    return document.querySelectorAll(
      `[data-category="${this.category}"] .post-list-item, [data-category="${this.category}"] .portfolio-list-item`
    );
  }

  getShowMoreItem() {
    return document.querySelector(`[data-category="${this.category}"] .show-more-item`);
  }

  isFiltering() {
    return this.activeTags.size > 0 || this.query.trim().length > 0;
  }

  collectTags() {
    this.getItems().forEach(item => {
      const tags = item.dataset.tags;
      if (tags) {
        tags.split(',').forEach(tag => {
          if (tag.trim()) this.allTags.add(tag.trim());
        });
      }
    });
  }

  renderChips() {
    if (!this.chipsEl) return;
    const sortedTags = Array.from(this.allTags).sort();
    this.chipsEl.innerHTML = sortedTags.map(tag =>
      `<button type="button" class="chip" aria-pressed="false" data-tag="${tag}">${tag}</button>`
    ).join('');
  }

  showAllItems() {
    if (!this.container) return;
    this.container.classList.add('filtering-active');
    const showMoreItem = this.getShowMoreItem();
    if (showMoreItem) showMoreItem.style.display = 'none';
  }

  showPreviewOnly() {
    if (!this.container) return;
    this.container.classList.remove('filtering-active');
    this.getItems().forEach(item => item.classList.remove('hidden'));
    const showMoreItem = this.getShowMoreItem();
    if (showMoreItem) showMoreItem.style.display = 'list-item';
  }

  setExpanded(expanded) {
    this.isExpanded = expanded;
    this.panel.setAttribute('data-expanded', String(expanded));
    this.trigger.setAttribute('aria-expanded', String(expanded));

    if (expanded) {
      this.showAllItems();
    } else {
      // Filters stay applied when collapsed; only return to the preview when clean
      if (this.isFiltering()) {
        this.showAllItems();
      } else {
        this.showPreviewOnly();
      }
      this.trigger.focus();
    }
  }

  bindToggle() {
    this.root.querySelectorAll('[data-filter-action="toggle"]').forEach(btn => {
      btn.addEventListener('click', () => this.setExpanded(!this.isExpanded));
    });
  }

  bindSearch() {
    if (!this.searchInput) return;
    this.searchInput.addEventListener('input', () => {
      this.query = this.searchInput.value;
      this.applyFilters();
    });
  }

  bindChips() {
    if (!this.chipsEl) return;
    this.chipsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const tag = chip.dataset.tag;
      if (this.activeTags.has(tag)) {
        this.activeTags.delete(tag);
        chip.setAttribute('aria-pressed', 'false');
      } else {
        this.activeTags.add(tag);
        chip.setAttribute('aria-pressed', 'true');
      }
      this.applyFilters();
    });
  }

  bindClear() {
    if (!this.clearBtn) return;
    this.clearBtn.addEventListener('click', () => {
      this.activeTags.clear();
      this.query = '';
      this.searchInput.value = '';
      this.chipsEl.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      this.applyFilters();
      this.searchInput.focus();
    });
  }

  bindEscape() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isExpanded) this.setExpanded(false);
    });
  }

  applyFilters() {
    const q = this.query.trim().toLowerCase();
    let visibleCount = 0;

    this.getItems().forEach(item => {
      const itemTags = (item.dataset.tags || '').split(',').map(t => t.trim()).filter(t => t);

      const matchesTag = this.activeTags.size === 0 ||
        Array.from(this.activeTags).some(tag => itemTags.includes(tag));

      const titleEl = item.querySelector('.post-link, .portfolio-link');
      const title = (titleEl ? titleEl.textContent : '').toLowerCase();
      const matchesQuery = !q ||
        title.includes(q) ||
        itemTags.some(tag => tag.toLowerCase().includes(q));

      if (matchesTag && matchesQuery) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    if (this.isFiltering() || this.isExpanded) {
      this.showAllItems();
    } else {
      this.showPreviewOnly();
    }

    const showMoreItem = this.getShowMoreItem();
    if (showMoreItem) {
      showMoreItem.style.display = (this.isFiltering() || this.isExpanded) ? 'none' : 'list-item';
    }

    this.updateStatus();
  }

  updateStatus() {
    const total = this.activeTags.size + (this.query.trim().length > 0 ? 1 : 0);
    this.clearBtn.disabled = total === 0;
    this.badge.hidden = total === 0;
    this.badge.textContent = String(total);
  }
}

// Portfolio Expander Class
class PortfolioExpander {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Handle clicks on portfolio item headers
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.portfolio-item-header');
      if (header) {
        this.toggleExpansion(header);
      }
    });

    // Handle keyboard navigation (Enter and Space)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const header = e.target.closest('.portfolio-item-header');
        if (header) {
          e.preventDefault();
          this.toggleExpansion(header);
        }
      }
    });
  }

  toggleExpansion(header) {
    const content = header.nextElementSibling;
    const isExpanded = header.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      this.collapseItem(header, content);
    } else {
      this.expandItem(header, content);
    }
  }

  expandItem(header, content) {
    // Update ARIA attributes
    header.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');

    // Add visual feedback
    header.classList.add('expanded');

    // Focus management - keep focus on header for keyboard users
    header.focus();
  }

  collapseItem(header, content) {
    // Update ARIA attributes
    header.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');

    // Remove visual feedback
    header.classList.remove('expanded');

    // Focus management
    header.focus();
  }
}

// Initialize filters when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.filter-component[data-filter]').forEach(component => {
    new TagFilter(component.dataset.filter);
  });

  // Initialize portfolio expander
  if (document.querySelector('.portfolio-list')) {
    new PortfolioExpander();
  }
});
