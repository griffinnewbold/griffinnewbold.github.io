(function () {
  const storageKey = 'griffin-theme';
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const dark = theme === 'dark';
      button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
      button.setAttribute('aria-pressed', String(dark));
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = dark ? 'Dark' : 'Light';
    });
  }

  function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem(storageKey, theme);
  }

  applyTheme(localStorage.getItem(storageKey) || systemTheme);
  addEventListener('DOMContentLoaded', () => {
    applyTheme(root.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    });
  });

  window.GriffinTheme = { set: setTheme };
}());
