(function(document) {
  // Reading Progress Bar
  function updateReadingProgress() {
    var progressBar = document.getElementById('reading-progress');
    if (progressBar) {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        var scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
      }
    }
  }

  // Table of Contents
  function generateTOC() {
    var nav = document.getElementById('toc');
    if (!nav) return;

    var headings = document.querySelectorAll('.post-content > h2');
    if (headings.length < 2) {
      nav.style.display = 'none';
      return;
    }

    var listHtml = '';
    headings.forEach(function(h, i) {
      var id = 'section-' + (i + 1);
      h.setAttribute('id', id);
      listHtml += '<li><a href="#' + id + '"><span class="toc-num">' + (i + 1) + '.</span>' + h.textContent + '</a></li>';
    });

    nav.innerHTML =
      '<button class="toc-toggle" aria-expanded="false">' +
        '<span class="toc-toggle-icon"></span>' +
        '<span class="toc-toggle-label">Sections</span>' +
      '</button>' +
      '<div class="toc-content">' +
        '<ol>' + listHtml + '</ol>' +
      '</div>';

    var toggle = nav.querySelector('.toc-toggle');
    var content = nav.querySelector('.toc-content');

    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      content.classList.toggle('open');
    });

    // Smooth-scroll on click
    var list = nav.querySelector('ol');
    list.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (link) {
        e.preventDefault();
        var id = link.getAttribute('href').substring(1);
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Active section tracking on scroll
    function updateActiveSection() {
      var links = list.querySelectorAll('a');
      var scrollY = window.scrollY + 100;
      var current = -1;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].offsetTop <= scrollY) {
          current = i;
        }
      }
      links.forEach(function(link, i) {
        link.classList.toggle('active', i === current);
      });
    }
    window.addEventListener('scroll', updateActiveSection);
  }

  window.addEventListener('DOMContentLoaded', function() {
    updateReadingProgress();
    generateTOC();
  });
  window.addEventListener('scroll', updateReadingProgress);
})(document);
