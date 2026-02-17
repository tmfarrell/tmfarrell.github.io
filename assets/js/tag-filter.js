class TagFilter {
  constructor(category) {
    this.category = category;
    this.allTags = new Set();
    this.activeFilters = new Set();
    this.isFilterVisible = false;
    this.init();
  }

  init() {
    this.collectTags();
    this.renderTagCloud();
    this.bindEvents();
    this.bindToggleEvents();
    this.initializeVisibility();
  }

  initializeVisibility() {
    // CSS handles initial visibility of additional items
    const container = document.getElementById(`post-list-${this.category}`) || document.getElementById(`portfolio-list`);
    if (container) {
      container.classList.remove('filtering-active');
    }
  }

  collectTags() {
    const items = document.querySelectorAll(`[data-category="${this.category}"] .post-list-item, [data-category="${this.category}"] .portfolio-list-item`);
    
    items.forEach(item => {
      const tags = item.dataset.tags;
      if (tags) {
        tags.split(',').forEach(tag => {
          if (tag.trim()) {
            this.allTags.add(tag.trim());
          }
        });
      }
    });
  }

  renderTagCloud() {
    const tagCloud = document.getElementById(`tag-cloud-${this.category}`);
    if (!tagCloud) return;

    const sortedTags = Array.from(this.allTags).sort();
    tagCloud.innerHTML = sortedTags.map(tag => 
      `<button class="tag-button" data-tag="${tag}">${tag}</button>`
    ).join('');
  }

  bindToggleEvents() {
    const toggleButton = document.getElementById(`filter-toggle-${this.category}`);
    const filterContainer = document.getElementById(`filter-container-${this.category}`);
    
    if (toggleButton && filterContainer) {
      toggleButton.addEventListener('click', () => {
        this.isFilterVisible = !this.isFilterVisible;
        
        if (this.isFilterVisible) {
          filterContainer.classList.add('visible');
          toggleButton.classList.add('active');
          // Show all items when filtering is available
          this.showAllItems();
        } else {
          filterContainer.classList.remove('visible');
          toggleButton.classList.remove('active');
          // Clear all filters when hiding the container
          this.clearFilters();
          // Return to preview-only view
          this.showPreviewOnly();
        }
      });
    }
  }

  showAllItems() {
    const container = document.getElementById(`post-list-${this.category}`) || document.getElementById(`portfolio-list`);
    const showMoreItem = document.querySelector(`[data-category="${this.category}"] .show-more-item`);
    
    // Add filtering-active class to show additional items
    if (container) {
      container.classList.add('filtering-active');
    }
    
    // Hide the "Show more" link since all items are now visible
    if (showMoreItem) {
      showMoreItem.style.display = 'none';
    }
  }

  showPreviewOnly() {
    const container = document.getElementById(`post-list-${this.category}`) || document.getElementById(`portfolio-list`);
    const showMoreItem = document.querySelector(`[data-category="${this.category}"] .show-more-item`);
    const additionalItems = document.querySelectorAll(`[data-category="${this.category}"] .additional-item`);
    
    // Remove filtering-active class to hide additional items
    if (container) {
      container.classList.remove('filtering-active');
    }
    
    // Remove hidden class from all items to reset state
    const allItems = document.querySelectorAll(`[data-category="${this.category}"] .post-list-item, [data-category="${this.category}"] .portfolio-list-item`);
    allItems.forEach(item => {
      item.classList.remove('hidden');
    });
    
    // Show the "Show more" link if there are additional items
    if (showMoreItem && additionalItems.length > 0) {
      showMoreItem.style.display = 'list-item';
    }
  }

  bindEvents() {
    // Tag button filtering
    const tagCloud = document.getElementById(`tag-cloud-${this.category}`);
    if (tagCloud) {
      tagCloud.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-button')) {
          this.toggleTagFilter(e.target.dataset.tag, e.target);
        }
      });
    }

    // Clear filter button
    const clearButton = document.getElementById(`clear-filter-${this.category}`);
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearFilters();
      });
    }
  }



  toggleTagFilter(tag, buttonElement) {
    if (this.activeFilters.has(tag)) {
      this.activeFilters.delete(tag);
      buttonElement.classList.remove('active');
    } else {
      this.activeFilters.add(tag);
      buttonElement.classList.add('active');
    }

    this.applyTagFilters();
  }

  applyTagFilters() {
    const items = document.querySelectorAll(`[data-category="${this.category}"] .post-list-item, [data-category="${this.category}"] .portfolio-list-item`);
    const showMoreItem = document.querySelector(`[data-category="${this.category}"] .show-more-item`);
    
    let visibleCount = 0;

    // If filters are active and container is visible, show all items
    if (this.activeFilters.size > 0 && this.isFilterVisible) {
      this.showAllItems();
    }

    items.forEach(item => {
      const itemTags = (item.dataset.tags || '').split(',').map(t => t.trim()).filter(t => t);
      
      const hasAnyActiveTag = this.activeFilters.size === 0 || 
                              Array.from(this.activeFilters).some(activeTag => 
                                itemTags.includes(activeTag)
                              );

      if (hasAnyActiveTag) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    // Hide "Show more" when filtering is active
    if (showMoreItem) {
      showMoreItem.style.display = (this.activeFilters.size > 0 || this.isFilterVisible) ? 'none' : 'list-item';
    }

    this.updateClearButton(this.activeFilters.size > 0);
  }

  clearFilters() {
    // Clear active tag filters
    this.activeFilters.clear();
    
    // Remove active class from tag buttons
    const tagButtons = document.querySelectorAll(`#tag-cloud-${this.category} .tag-button`);
    tagButtons.forEach(button => button.classList.remove('active'));

    // Remove hidden class from all items
    const items = document.querySelectorAll(`[data-category="${this.category}"] .post-list-item, [data-category="${this.category}"] .portfolio-list-item`);
    items.forEach(item => item.classList.remove('hidden'));

    // If filter container is visible, show all items; otherwise show preview only
    if (this.isFilterVisible) {
      this.showAllItems();
    } else {
      this.showPreviewOnly();
    }

    this.updateClearButton(false);
  }

  updateClearButton(show) {
    const filterActions = document.querySelector(`[data-category="${this.category}"] .filter-actions`);
    if (filterActions) {
      if (show) {
        filterActions.classList.add('visible');
      } else {
        filterActions.classList.remove('visible');
      }
    }
  }
}

// Initialize filters when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check which page we're on and initialize appropriate filter
  if (document.getElementById('filter-toggle-writing')) {
    new TagFilter('writing');
  }
  
  if (document.getElementById('filter-toggle-reading')) {
    new TagFilter('reading');
  }
  
  if (document.getElementById('filter-toggle-portfolio')) {
    new TagFilter('portfolio');
  }
});