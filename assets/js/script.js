(function(document) {
  // Reading Progress Bar
  function updateReadingProgress() {
    var progressBar = document.getElementById('reading-progress');
    if (progressBar) {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        var scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
      }
    }
  }

  // Table of Contents Generation
  function generateTableOfContents() {
    var toc = document.getElementById('toc-list');
    if (!toc) return;

    var headings = document.querySelectorAll('.post-content > h2, .post-content > h3');
    if (headings.length < 2) {
      var tocNav = toc.closest('.toc');
      if (tocNav) tocNav.style.display = 'none';
      return;
    }

    var tocHTML = '';
    headings.forEach(function(heading, index) {
      var id = 'heading-' + index;
      heading.setAttribute('id', id);
      var text = heading.textContent;
      tocHTML += '<li class="toc-' + heading.tagName.toLowerCase() + '"><a href="#' + id + '">' + text + '</a></li>';
    });
    toc.innerHTML = tocHTML;

    toc.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        var targetId = e.target.getAttribute('href').substring(1);
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
      }
    });
  }

  window.addEventListener('DOMContentLoaded', function() {
    updateReadingProgress();
    generateTableOfContents();
  });
  window.addEventListener('scroll', updateReadingProgress);
})(document);
