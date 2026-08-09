document.addEventListener('DOMContentLoaded', () => {
  // Progressive reveal. Content remains fully visible when JS is unavailable via the fallback below.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(el => observer.observe(el));
  }

  // One-click BibTeX copy.
  const copyButton = document.getElementById('copy-bibtex');
  const bibtexCode = document.getElementById('bibtex-code');
  if (copyButton && bibtexCode) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(bibtexCode.textContent.trim());
        const label = copyButton.querySelector('span');
        label.textContent = 'Copied';
        setTimeout(() => { label.textContent = 'Copy'; }, 1600);
      } catch (_) {
        // Clipboard APIs may be disabled on local file previews.
      }
    });
  }

  // Click any primary figure to inspect it at full resolution.
  const dialog = document.getElementById('image-dialog');
  const dialogImage = dialog ? dialog.querySelector('img') : null;
  const closeButton = dialog ? dialog.querySelector('.dialog-close') : null;
  if (dialog && dialogImage && typeof dialog.showModal === 'function') {
    document.querySelectorAll('.zoomable img').forEach(img => {
      img.closest('.zoomable').addEventListener('click', () => {
        dialogImage.src = img.src;
        dialogImage.alt = img.alt;
        dialog.showModal();
      });
    });
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  }
});

// If deferred JS fails before DOMContentLoaded handling, do not leave content hidden forever.
window.addEventListener('load', () => {
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible')), 800);
});
