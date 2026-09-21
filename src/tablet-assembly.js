
export function initTabletAssembly() {
  const tablet = matchMedia('(min-width: 768px) and (max-width: 1279px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const section = document.querySelector('.property-story');
  const stage = section.querySelector('.story-sticky');
  const abort = new AbortController(), { signal } = abort;
  let frame = 0, value = 0, target = 0, last = 0, start = 0, travel = 1;
  const paint = () => section.style.setProperty('--tablet-assembly', value.toFixed(5));
  function tick(now) {
    frame = 0;
    value += (target - value) * (1 - Math.exp(-Math.min(now - last,64) / 85));
    last = now;
    if (Math.abs(target - value) < .0001) value = target;
    paint();
    if (value !== target) frame = requestAnimationFrame(tick);
  }
  function update() {
    if (!tablet.matches) return;
    target = reduced.matches ? 1 : Math.max(0,Math.min(1,(scrollY-start)/travel));
    if (reduced.matches) {cancelAnimationFrame(frame);frame=0;value=1;paint();return;}
    if(!frame && value!==target){last=performance.now();frame=requestAnimationFrame(tick);}
  }
  function measure() {
    cancelAnimationFrame(frame);frame=0;
    if(!tablet.matches){section.style.removeProperty('--tablet-assembly');return;}
    start=section.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(stage).top);
    travel=Math.max(1,section.offsetHeight-stage.offsetHeight);
    update();
  }
  addEventListener('scroll',update,{passive:true,signal});
  addEventListener('resize',measure,{signal});
  tablet.addEventListener('change',measure,{signal});reduced.addEventListener('change',measure,{signal});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)measure();},{signal});
  document.fonts.ready.then(measure);measure();
  return()=>{abort.abort();cancelAnimationFrame(frame);section.style.removeProperty('--tablet-assembly');};
}
