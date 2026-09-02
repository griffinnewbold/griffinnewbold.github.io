document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-nav-toggle]').forEach((toggle) => {
    const nav = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!nav) return;
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.dataset.open = 'false';
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.dataset.open = String(open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  });
});
