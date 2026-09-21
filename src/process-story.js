export function initProcessStory() {
  const root = document.querySelector('.process-experience');
  const frames = [...root.querySelectorAll('.process-frame')];
  const choices = [...root.querySelectorAll('.process-choice')];
  const announcement = root.querySelector('#process-announcement');
  const dialog = document.querySelector('#contact-dialog');
  const controller = new AbortController();
  const { signal } = controller;
  const duration = 3000;
  let current = 0, frameId = 0, startedAt = 0, visible = false, disposed = false;
  const canRun = () => visible && !document.hidden && !dialog.open && !disposed;
  function stop() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    root.dataset.playback = 'paused';
  }
  function select(index, manual = false) {
    stop();
    current = (index + frames.length) % frames.length;
    root.dataset.activeStep = String(current);
    root.style.setProperty('--step-progress', '0');
    frames.forEach((frame, i) => {
      frame.classList.toggle('is-current', i === current);
      frame.classList.toggle('is-past', i < current);
      frame.setAttribute('aria-hidden', String(i !== current));
      frame.inert = i !== current;
      choices[i].classList.toggle('is-current', i === current);
      choices[i].classList.toggle('is-complete', i < current);
      choices[i].setAttribute('aria-pressed', String(i === current));
    });
    if (manual) announcement.textContent = frames[current].getAttribute('aria-label');
    start();
  }
  function tick(time) {
    frameId = 0;
    if (!canRun()) { stop(); return; }
    const elapsed = time - startedAt;
    root.style.setProperty('--step-progress', String(Math.min(1, elapsed / duration)));
    if (elapsed >= duration) { select(current + 1); return; }
    frameId = requestAnimationFrame(tick);
  }
  function start() {
    stop();
    root.style.setProperty('--step-progress', '0');
    if (!canRun()) return;
    startedAt = performance.now();
    root.dataset.playback = 'playing';
    frameId = requestAnimationFrame(tick);
  }
  choices.forEach((choice, i) => {
    choice.addEventListener('click', () => select(i, true), { signal });
    choice.addEventListener('keydown', event => {
      const next = event.key === 'ArrowDown' ? (i + 1) % choices.length : event.key === 'ArrowUp' ? (i + choices.length - 1) % choices.length : event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); select(next, true); choices[next].focus({ preventScroll: true });
    }, { signal });
  });
  document.addEventListener('visibilitychange', start, { signal });
  const observer = new IntersectionObserver(entries => {
    const nextVisible = entries[0].intersectionRatio >= .55;
    if (nextVisible !== visible) { visible = nextVisible; start(); }
  }, { threshold: [0, .55] });
  observer.observe(root);
  const modalObserver = new MutationObserver(start);
  modalObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  select(0);
  return () => { disposed = true; stop(); controller.abort(); observer.disconnect(); modalObserver.disconnect(); };
}
