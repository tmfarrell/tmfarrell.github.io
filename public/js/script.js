(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);

  // Reading Progress Bar
  function updateReadingProgress() {
    var progressBar = document.getElementById('reading-progress');
    if (progressBar) {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    }
  }

  // Table of Contents Generation
  function generateTableOfContents() {
    var toc = document.getElementById('toc-list');
    if (!toc) return;

    // Find all headings in the content area (ignore headings in TOC itself)
    var headings = document.querySelectorAll('.post-content > h2, .post-content > h3');
    
    // If no headings or too few headings, hide the TOC
    if (headings.length < 2) {
      toc.closest('.toc').style.display = 'none';
      return;
    }

    var tocHTML = '';

    headings.forEach(function(heading, index) {
      var id = 'heading-' + index;
      heading.setAttribute('id', id);
      
      var level = heading.tagName.toLowerCase();
      var text = heading.textContent;
      
      tocHTML += '<li class="toc-' + level + '"><a href="#' + id + '">' + text + '</a></li>';
    });

    toc.innerHTML = tocHTML;

    // Smooth scrolling for TOC links
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

  // Initialize features when DOM is loaded
  window.addEventListener('DOMContentLoaded', function() {
    updateReadingProgress();
    generateTableOfContents();
  });

  // Update reading progress on scroll
  window.addEventListener('scroll', updateReadingProgress);
})(document);
