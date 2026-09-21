export function initHeroScene() {
  const hero=document.querySelector('.video-hero');
  const header=document.querySelector('.site-header');
  const video=document.querySelector('#hero-film');
  const control=document.querySelector('.hero-playback');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const controller=new AbortController(),{signal}=controller;
  let frame=0,heroEnd=0,visible=true,loaded=false,userPaused=false,failed=false,disposed=false;
  function updateHeader(){frame=0;const island=scrollY>=heroEnd-112;header.classList.toggle('is-island',island);header.dataset.headerState=island?'island':'transparent';}
  function measure(){heroEnd=hero.getBoundingClientRect().bottom+scrollY;updateHeader();}
  function schedule(){if(!frame)frame=requestAnimationFrame(updateHeader);}
  function updateControl(){const paused=video.paused;control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'Film abspielen':'Film pausieren');control.querySelector('.playback-label').textContent=paused?'Film abspielen':'Film pausieren';control.querySelector('.playback-icon use').setAttribute('href',paused?'#icon-play':'#icon-pause');}
  function load(){if(loaded)return;loaded=true;video.querySelectorAll('source').forEach(source=>source.src=source.dataset.src);video.load();}
  function sync(){
    if(disposed||failed)return;
    if(media.matches||userPaused||!visible||document.hidden){video.pause();updateControl();return;}
    video.autoplay=true;load();video.muted=true;video.play().then(()=>{if(disposed)return;if(media.matches||userPaused||!visible||document.hidden)video.pause();updateControl();}).catch(()=>{if(!disposed)updateControl();});
  }
  control.hidden=false;
  control.addEventListener('click',()=>{if(video.paused){userPaused=false;load();video.muted=true;video.play().catch(updateControl);}else{userPaused=true;video.pause();}updateControl();},{signal});
  video.addEventListener('playing',()=>{hero.classList.add('is-playing','has-played');updateControl();},{signal});
  video.addEventListener('pause',()=>{hero.classList.remove('is-playing');updateControl();},{signal});
  video.addEventListener('error',()=>{failed=true;hero.classList.remove('has-played','is-playing');control.hidden=true;},{signal});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});observer.observe(hero);
  addEventListener('scroll',schedule,{passive:true,signal});addEventListener('resize',measure,{signal});addEventListener('pageshow',()=>{measure();sync();},{signal});
  document.addEventListener('visibilitychange',sync,{signal});media.addEventListener('change',()=>{userPaused=false;sync();},{signal});
  measure();sync();
  return()=>{disposed=true;controller.abort();observer.disconnect();cancelAnimationFrame(frame);video.pause();};
}
