document.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('[data-project-filter]');
  const projects = document.querySelectorAll('[data-project-card]');

  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.projectFilter;

    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    projects.forEach((project) => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
    });
  }));
});
