const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); };
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
});
matchMedia('(min-width: 701px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => {
    for (const b of document.querySelectorAll('[data-filter]')) b.setAttribute('aria-pressed', String(b === button));
    let count = 0;
    const filtered = button.dataset.filter !== 'all';
    const grid = document.querySelector('.project-grid');
    for (const card of grid.querySelectorAll('[data-category]')) {
      card.hidden = filtered && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    }
    grid.classList.toggle('is-filtered', filtered);
    document.querySelector('#filter-status').textContent = `${button.textContent}: ${count}`;
  });
}

for (const trigger of document.querySelectorAll('[data-open]')) {
  const dialog = document.getElementById(trigger.dataset.open);
  trigger.addEventListener('click', () => { dialog.showModal(); document.body.classList.add('dialog-open'); });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  // Only the backdrop itself dismisses a dialog, never a click inside its content.
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); trigger.focus({ preventScroll: true }); });
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }, { threshold: .12 });
  for (const section of document.querySelectorAll('.reveal')) observer.observe(section);
}
