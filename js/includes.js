(function() {
  'use strict';

  // Carga los partials HTML y los inyecta en elementos con data-include
  const includes = document.querySelectorAll('[data-include]');
  const tasks = Array.from(includes).map(el => {
    const url = el.getAttribute('data-include');
    return fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('No se pudo cargar ' + url);
        return r.text();
      })
      .then(html => {
        el.innerHTML = html;
        el.removeAttribute('data-include');
      })
      .catch(err => {
        console.error(err);
        el.innerHTML = '';
      });
  });

  window.__includesReady = Promise.all(tasks);
})();
