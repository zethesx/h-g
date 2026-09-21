export function initResponsive() {
  const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
  const compact = matchMedia('(max-width: 767px)');
  const adapted = matchMedia('(max-width: 1279px)');
  const abort = new AbortController(), { signal } = abort;
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const contact = document.querySelector('#contact-dialog');
  let restoreMenuFocus = true;
  function closeMenu(restore = true) { restoreMenuFocus = restore; if(menu.open) menu.close(); }
  toggle.addEventListener('click', () => {
    if (!compact.matches) return;
    menu.showModal(); document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded','true'); menu.querySelector('.menu-close').focus();
  }, { signal });
  menu.querySelector('.menu-close').addEventListener('click', () => closeMenu(), { signal });
  menu.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');
    if(restoreMenuFocus && compact.matches) toggle.focus({preventScroll:true});
  }, { signal });
  menu.addEventListener('cancel', event => { event.preventDefault();closeMenu(); }, { signal });
  let outside = false;
  menu.addEventListener('pointerdown', event => { outside = event.target === menu; }, { signal });
  menu.addEventListener('click', event => { if(outside && event.target === menu) closeMenu();outside=false; }, { signal });
  menu.addEventListener('keydown', event => {
    if(event.key !== 'Tab') return;
    const items=[...menu.querySelectorAll('button,a')],first=items[0],last=items.at(-1);
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }, { signal });
  menu.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
    closeMenu(false);
    const target = document.querySelector(link.getAttribute('href'));
    target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
  }, { signal }));
  const breaks = [...document.querySelectorAll(".video-hero-description br,.section-heading>p br,.story-heading>p:last-child br,.process-heading>p:last-child br")];
  const spaces = breaks.map(() => document.createTextNode(" "));
  function syncViewport() {
    breaks.forEach((br,i) => { if(compact.matches) br.after(spaces[i]); else spaces[i].remove(); });
    if(!compact.matches) closeMenu(false);
    if(compact.matches && visualViewport){
      contact.style.setProperty('--panel-viewport',`${visualViewport.height}px`);
      contact.style.setProperty('--panel-keyboard-offset',`${Math.max(0,innerHeight-visualViewport.height-visualViewport.offsetTop)}px`);
    } else {contact.style.removeProperty('--panel-viewport');contact.style.removeProperty('--panel-keyboard-offset');}
  }
  compact.addEventListener('change',syncViewport,{signal});
  visualViewport?.addEventListener('resize',syncViewport,{signal});
  visualViewport?.addEventListener('scroll',syncViewport,{signal});
  syncViewport();
  const serviceIndex=document.querySelector('.service-index');
  const serviceImage=document.querySelector('#service-image');
  function syncService() {
    if(compact.matches){const active=serviceIndex.querySelector('.is-active');if(active){serviceIndex.scrollTo({left:active.offsetLeft-serviceIndex.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}
    sourceFor(serviceImage);
  }
  function sourceFor(img) {
    const path=img.getAttribute('src');
    if(!path || path.includes('/hero/'))return;
    if(adapted.matches){
      const stem=path.split('/').at(-1).replace('.webp','');
      const key=path.includes('/library/')?stem:`original-${stem}`;
      img.srcset=`${assetPath(`media/responsive/${key}-640.webp`)} 640w, ${assetPath(`media/responsive/${key}-960.webp`)} 960w, ${path} 1440w`;
      img.sizes=img.closest('.process-frame,.material-slice,.contact-landscape')?'100vw':compact.matches?'calc(100vw - 40px)':'50vw';
      img.decoding='async';
    } else {img.removeAttribute('srcset');img.removeAttribute('sizes');}
  }
  const sourceObserver=new MutationObserver(syncService);
  sourceObserver.observe(serviceImage,{attributes:true,attributeFilter:['src']});
  function syncSources(){document.querySelectorAll('img').forEach(sourceFor);syncService();}
  adapted.addEventListener('change',syncSources,{signal});compact.addEventListener('change',syncService,{signal});syncSources();
  return()=>{closeMenu(false);abort.abort();sourceObserver.disconnect();};
}
