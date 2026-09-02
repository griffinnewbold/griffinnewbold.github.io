(function () {
  const storageKey = 'griffin-theme';
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const dark = theme === 'dark';
      button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
      button.setAttribute('aria-pressed', String(dark));
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = dark ? 'Dark' : 'Light';
    });
  }

  setTheme(localStorage.getItem(storageKey) || systemTheme);
  addEventListener('DOMContentLoaded', () => {
    setTheme(root.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    });
  });

  window.GriffinTheme = { set: setTheme };
}());
