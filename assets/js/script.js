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

  // Roman numeral converter
  function toRoman(num) {
    var map = [
      ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
      ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    var result = '';
    for (var i = 0; i < map.length; i++) {
      while (num >= map[i][1]) {
        result += map[i][0];
        num -= map[i][1];
      }
    }
    return result;
  }

  // Typographic Table of Contents
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
      listHtml += '<li><a href="#' + id + '"><span class="toc-num">' + toRoman(i + 1) + '.</span> ' + h.textContent + '</a></li>';
    });

    nav.innerHTML =
      '<button class="toc-toggle" aria-expanded="false">' +
        '<span class="toc-toggle-icon"></span>' +
        '<span class="toc-toggle-label">Table of Contents</span>' +
      '</button>' +
      '<div class="toc-content">' +
        '<ol>' + listHtml + '</ol>' +
      '</div>';

    var toggle = nav.querySelector('.toc-toggle');
    var content = nav.querySelector('.toc-content');
    var icon = nav.querySelector('.toc-toggle-icon');

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

    // Active section tracking
    if ('IntersectionObserver' in window) {
      var links = list.querySelectorAll('a');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            links.forEach(function(link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-80px 0px -60% 0px' });
      headings.forEach(function(h) { observer.observe(h); });
    }
  }

  window.addEventListener('DOMContentLoaded', function() {
    updateReadingProgress();
    generateTOC();
  });
  window.addEventListener('scroll', updateReadingProgress);
})(document);
