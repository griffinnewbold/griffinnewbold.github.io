const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'projects.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'scripts/projects.js'), 'utf8');

class TestElement {
  constructor(dataset, attributes = {}) {
    this.dataset = dataset;
    this.attributes = new Map(Object.entries(attributes));
    this.hidden = false;
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  click() {
    this.listeners.get('click')();
  }
}

const filters = [...html.matchAll(/<button type="button" data-project-filter="([^"]+)" aria-pressed="([^"]+)">/g)]
  .map((match) => new TestElement({ projectFilter: match[1] }, { 'aria-pressed': match[2] }));
const projects = [...html.matchAll(/<article id="(div\d+)" class="project-entry" data-project-card data-category="([^"]+)">/g)]
  .map((match) => {
    const element = new TestElement({ category: match[2] });
    element.id = match[1];
    return element;
  });

let onReady;
const document = {
  addEventListener(type, listener) {
    assert.equal(type, 'DOMContentLoaded');
    onReady = listener;
  },
  querySelectorAll(selector) {
    if (selector === '[data-project-filter]') return filters;
    if (selector === '[data-project-card]') return projects;
    throw new Error(`Unexpected selector: ${selector}`);
  },
};

vm.runInNewContext(script, { document });
assert.equal(typeof onReady, 'function', 'projects.js registers its setup for DOMContentLoaded');
onReady();

assert.deepEqual(filters.map((filter) => filter.dataset.projectFilter), ['all', 'software', 'academic', 'early']);
assert.equal(projects.length, 13);
assert.equal(projects.every((project) => !project.hidden), true, 'all projects begin visible');

filters.find((filter) => filter.dataset.projectFilter === 'academic').click();
assert.deepEqual(
  projects.filter((project) => !project.hidden).map((project) => project.id),
  ['div7', 'div9', 'div10', 'div11', 'div12', 'div13'],
  'Academic reveals every academic project and hides other categories',
);
assert.deepEqual(
  filters.map((filter) => filter.getAttribute('aria-pressed')),
  ['false', 'false', 'true', 'false'],
  'Academic is the only pressed filter',
);

filters.find((filter) => filter.dataset.projectFilter === 'all').click();
assert.equal(projects.every((project) => !project.hidden), true, 'All restores every project');
assert.deepEqual(
  filters.map((filter) => filter.getAttribute('aria-pressed')),
  ['true', 'false', 'false', 'false'],
  'All is the only pressed filter after reset',
);

console.log('project filter behavior passed');
