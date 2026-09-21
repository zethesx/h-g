
export function initContactAlignment() {
  const stage = document.querySelector('#kontakt');
  const grid = stage.querySelector('.contact-stage-grid');
  const board = stage.querySelector('.inquiry-board');
  const heading = stage.querySelector('#contact-title');
  const divider = stage.querySelector('.contact-stage-address');
  function align() {
    const top = heading.getBoundingClientRect().top;
    const bottom = divider.getBoundingClientRect().top - 18;
    board.style.setProperty('--board-top', `${top - grid.getBoundingClientRect().top}px`);
    board.style.setProperty('--board-height', `${bottom - top}px`);
  }
  const observer = new ResizeObserver(align);
  [heading, grid, stage.querySelector('.contact-stage-personal')].forEach(el => observer.observe(el));
  document.fonts.ready.then(align);
  align();
  return () => observer.disconnect();
}
