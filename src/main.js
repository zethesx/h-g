import { initContactAlignment } from './contact-alignment.js';
import './style.css';
import './revision.css';
import './hero-scene.css';
import './contact-panel.css';
import './color-system.css';
import './contact-stage.css';
import { initHeroScene } from './hero-scene.js';
import { initProcessStory } from './process-story.js';
import { contactConfig } from './config.js';

const services = [
  { title: 'Ein Garten, in dem Sie gern Zeit verbringen.', category: 'WACHSEN LASSEN. IN FORM HALTEN.', description: 'Rasen mähen, Hecken schneiden, Grünflächen pflegen. Regelmäßig oder dann, wenn es nötig ist – passend zu Ihrem Garten.', image: 'library/garten', position: '50% 50%', material: 'LEBENDIGES GRÜN', alt: 'Hände schneiden eine Hecke mit einer Heckenschere' },
  { title: 'Ein guter Rahmen für Ihr Grundstück.', category: 'ABGRENZEN. VERBINDEN. ERHALTEN.', description: 'Zäune, Tore und Metallarbeiten rund ums Grundstück. Wir besprechen, was neu entstehen oder instand gesetzt werden soll.', image: 'library/zaun', position: '50% 50%', material: 'METALL MIT SUBSTANZ', alt: 'Ein Metallzaun wird mit einem Steckschlüssel befestigt' },
  { title: 'Ein fester Platz fürs Draußensein.', category: 'WEGE SCHAFFEN. FLÄCHEN GESTALTEN.', description: 'Pflasterflächen, Gartenwege und Terrassen. Wir kümmern uns um die Arbeiten und stimmen Material und Umfang mit Ihnen ab.', image: 'library/pflaster', position: '50% 50%', material: 'STEIN & HOLZ', alt: 'Ein Natursteinpflaster wird mit einem Gummihammer gesetzt' },
  { title: 'Auch oben braucht es Zuwendung.', category: 'REINIGEN. PFLEGEN. ERHALTEN.', description: 'Dachreinigung und Pflege mit Blick auf die vorhandene Oberfläche. Welche Arbeiten sinnvoll sind, klären wir vorab.', image: 'library/dach', position: '50% 50%', material: 'RUND UMS DACH', alt: 'Moos wird mit einer Bürste von Dachziegeln entfernt' },
  { title: 'Feuchtigkeit an der richtigen Stelle stoppen.', category: 'GENAU HINSEHEN. GEZIELT ABDICHTEN.', description: 'Bei Kellerabdichtungen kommt es auf die Ursache und die Gegebenheiten vor Ort an. Wir schauen hin und besprechen die nötigen Arbeiten.', image: 'library/keller', position: '50% 50%', material: 'STEIN & ERDREICH', alt: 'Eine Kelleraußenwand erhält eine bituminöse Abdichtung' },
  { title: 'Damit wieder alles richtig schließt.', category: 'EINSTELLEN. REPARIEREN. WEITERNUTZEN.', description: 'Klemmende Fenster, schwergängige Türen oder kleinere Defekte: Wir prüfen, was sich reparieren und wieder gängig machen lässt.', image: 'library/fenster', position: '50% 50%', material: 'BESCHLÄGE & MECHANIK', alt: 'Ein Fensterbeschlag wird mit einem Inbusschlüssel eingestellt' },
  { title: 'Wenn der Winter vor der Tür steht.', category: 'RÄUMEN. STREUEN. WEGE FREIHALTEN.', description: 'Schnee räumen und Flächen streuen. Sprechen Sie die zu betreuenden Wege und den gewünschten Einsatz mit uns ab.', image: 'library/winter', position: '50% 50%', material: 'WEGE & FLÄCHEN', alt: 'Schnee wird auf einem Hauseingangsweg geräumt' },
  { title: 'Platz für das, was bleiben soll.', category: 'SORTIEREN. RAUSSCHAFFEN. ENTSORGEN.', description: 'Wenn Dinge nicht mehr gebraucht werden, helfen wir beim Freimachen und Entsorgen. Art, Menge und Ablauf klären wir vorab.', image: 'library/entsorgung', position: '50% 50%', material: 'MIT ANPACKEN', alt: 'Altholz, Metall und Pflanzgefäße werden getrennt sortiert' },
  { title: 'Ein paar helfende Hände mehr.', category: 'TRAGEN. VERLADEN. WEITERKOMMEN.', description: 'Ein Umzug steht an? Wir unterstützen beim Tragen und Verladen. Erzählen Sie uns, wobei und in welchem Umfang Sie Hilfe brauchen.', image: 'library/umzug', position: '50% 50%', material: 'HANDGRIFFE, DIE HELFEN', alt: 'Zwei Helfer tragen einen Umzugskarton durch eine Haustür' },
  { title: 'Was halten soll, wird verbunden.', category: 'VERBINDEN. AUSBESSERN. INSTAND SETZEN.', description: 'Schweißarbeiten für passende Metallbauteile. Material, Einsatz und die erforderlichen Arbeiten stimmen wir vorab mit Ihnen ab.', image: 'library/schweissen', position: '50% 50%', material: 'METALL & VERBINDUNGEN', alt: 'Ein Metallrahmen wird mit Schutzausrüstung geschweißt' },
  { title: 'Weg damit. Aber ordentlich.', category: 'ABHOLEN. TRANSPORTIEREN. FREIRAUM SCHAFFEN.', description: 'Abfalltransport nach Absprache. Teilen Sie uns mit, was abgeholt werden soll und welche Menge anfällt – wir klären den weiteren Ablauf.', image: 'library/abfall', position: '50% 50%', material: 'RUND UMS GRUNDSTÜCK', alt: 'Gartenabfälle werden in einem Anhänger für den Transport gesichert' },
];

const $ = (selector) => document.querySelector(selector);
const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const serviceButtons = [...document.querySelectorAll('[data-service]')];
const subject = $('#subject');
serviceButtons.forEach((button) => {
  const option = document.createElement('option');
  option.value = button.dataset.service;
  option.textContent = button.childNodes[1].textContent.trim();
  subject.append(option);
});
let activeService = 0;
let revealTimer;
function selectService(index) {
  activeService = (index + services.length) % services.length;
  const service = services[activeService];
  serviceButtons.forEach((button, i) => {
    button.classList.toggle('is-active', i === activeService);
    button.setAttribute('aria-pressed', String(i === activeService));
  });
  $('#service-image').src = assetPath(`media/${service.image}.webp`);
  $('#service-image').alt = service.alt;
  $('#service-image').style.objectPosition = service.position;
  $('#service-category').textContent = service.category;
  $('#service-title').textContent = service.title;
  $('#service-description').textContent = service.description;
  $('#service-material').textContent = service.material;
  $('#service-number').textContent = String(activeService + 1).padStart(2, '0');
  const wrap = $('.service-image-wrap');
  wrap.classList.remove('is-changing');
  clearTimeout(revealTimer);
  requestAnimationFrame(() => { wrap.classList.add('is-changing'); });
  revealTimer = setTimeout(() => wrap.classList.remove('is-changing'), 700);
}
serviceButtons.forEach((button, i) => {
  button.addEventListener('click', () => selectService(i));
  button.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowDown') next = (i + 1) % services.length;
    if (event.key === 'ArrowUp') next = (i - 1 + services.length) % services.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = services.length - 1;
    if (next !== undefined) { event.preventDefault(); selectService(next); serviceButtons[next].focus(); }
  });
});
$('#service-prev').addEventListener('click', () => selectService(activeService - 1));
$('#service-next').addEventListener('click', () => selectService(activeService + 1));

const dialog = $('#contact-dialog');
const form = $('#contact-form');
let lastFocus;
let closingTimer;
function openContact() {
  if (dialog.open) return;
  clearTimeout(closingTimer);
  lastFocus = document.activeElement;
  dialog.classList.remove('is-closing');
  dialog.showModal();
  $('.floating-contact').setAttribute('aria-expanded', 'true');
  document.body.classList.add('modal-open');
  $('.close-contact').focus({ preventScroll: true });
}
function closeContact() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  dialog.classList.add('is-closing');
  closingTimer = setTimeout(() => dialog.close(), reducedMotion.matches ? 0 : 230);
}
document.querySelectorAll('[data-contact]').forEach((button) => button.addEventListener('click', openContact));
$('[data-service-contact]').addEventListener('click', () => { subject.value = String(activeService); openContact(); });
$('.close-contact').addEventListener('click', closeContact);
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeContact(); });
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const items = [...dialog.querySelectorAll('a[href], button:not(:disabled), input:not([tabindex="-1"]), select, textarea')].filter(element => element.getClientRects().length);
  const first = items[0], last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
function outsidePanel(event) {
  const rect = dialog.getBoundingClientRect();
  return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
}
let startedOutside = false;
dialog.addEventListener('pointerdown', event => { startedOutside = outsidePanel(event); });
dialog.addEventListener('click', event => { if (startedOutside && outsidePanel(event)) closeContact(); startedOutside = false; });
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  dialog.classList.remove('is-closing');
  $('.floating-contact').setAttribute('aria-expanded', 'false');
  lastFocus?.focus({ preventScroll: true });
});
function initInquiryForm(form, prefix = '') {
  const field = selector => form.querySelector('#' + prefix + selector.slice(1));
  const subject = field('#subject');
const submit = form.querySelector('[type=submit]');
submit.disabled = !contactConfig.endpoint;
if (contactConfig.endpoint) field('#form-note').textContent = 'Ihre Angaben verwenden wir zur Bearbeitung Ihrer Anfrage.';
function validateForm() {
  const errors = {
    name: field('#name').value.trim() ? '' : 'Bitte geben Sie Ihren Namen ein.',
    reply: /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|[+()\d\s/.-]{6,})$/.test(field('#reply').value.trim()) ? '' : 'Bitte geben Sie eine gültige Telefonnummer oder E-Mail-Adresse ein.',
    message: field('#message').value.trim().length >= 5 ? '' : 'Bitte beschreiben Sie Ihr Anliegen mit mindestens 5 Zeichen.',
  };
  for (const [id, message] of Object.entries(errors)) { field(`#error-${id}`).textContent = message; field(`#${id}`).setAttribute('aria-invalid', String(Boolean(message))); }
  const first = Object.keys(errors).find((id) => errors[id]);
  if (first) field(`#${first}`).focus();
  return !first;
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactConfig.endpoint) { field('#form-status').textContent = 'Bitte rufen Sie uns an. Die Online-Anfrage ist noch nicht freigeschaltet.'; return; }
  if (!validateForm()) return;
  const data = Object.fromEntries(new FormData(form));
  if (data.website) return;
  submit.disabled = true;
  field('#form-status').textContent = 'Ihre Anfrage wird gesendet …';
  try {
    const endpoint = new URL(contactConfig.endpoint, location.origin);
    if (endpoint.origin !== location.origin) throw new Error('Endpoint must be same-origin');
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data, subject: subject.selectedOptions[0].textContent }), signal: AbortSignal.timeout(contactConfig.timeoutMs) });
    if (!response.ok) throw new Error('Submission failed');
    const result = await response.json();
    if (result.success !== true) throw new Error('Missing confirmation');
    field('#form-status').textContent = 'Vielen Dank. Ihre Anfrage ist eingegangen.';
    form.reset();
  } catch { field('#form-status').textContent = 'Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.'; }
  finally { submit.disabled = false; }
});
for (const id of ['name', 'reply', 'message']) field(`#${id}`).addEventListener('input', () => { field(`#error-${id}`).textContent = ''; field(`#${id}`).removeAttribute('aria-invalid'); });

}
initInquiryForm(form);
const stageForm = $('#stage-contact-form');
$('#stage-subject').innerHTML = subject.innerHTML;
initInquiryForm(stageForm, 'stage-');

const story = $('.property-story');
const footer = $('.footer');
const floating = $('.floating-contact');
const contactStage = $('#kontakt');
let scrollFrame = 0;
let positions = {};
const clamp = (value) => Math.min(1, Math.max(0, value));
function measure() {
  positions = { storyTop: story.offsetTop, storyHeight: story.offsetHeight, footerTop: footer.offsetTop, height: innerHeight };
  updateScroll();
}
function updateScroll() {
  scrollFrame = 0;
  const y = scrollY;
  const contactBounds = contactStage.getBoundingClientRect();
  const inContact = contactBounds.top < innerHeight && contactBounds.bottom > innerHeight;
  floating.classList.toggle('in-contact', inContact);
  floating.tabIndex = inContact ? -1 : 0;
  floating.setAttribute('aria-hidden', String(inContact));
  if (reducedMotion.matches) { story.style.setProperty('--assembly', 1); footer.style.setProperty('--ground-progress', 1); return; }
  const progress = clamp((y - positions.storyTop + 160) / Math.max(1, positions.storyHeight - positions.height + 80));
  story.style.setProperty('--assembly', progress.toFixed(3));
  footer.style.setProperty('--ground-progress', clamp((y + positions.height - positions.footerTop) / 460).toFixed(3));
}
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
addEventListener('resize', measure);
reducedMotion.addEventListener('change', measure);
const destroyHeroScene = initHeroScene();
if (import.meta.hot) import.meta.hot.dispose(destroyHeroScene);
const destroyProcessStory = initProcessStory();
if (import.meta.hot) import.meta.hot.dispose(destroyProcessStory);
$('#year').textContent = new Date().getFullYear();
document.fonts.ready.then(measure);
addEventListener('load', measure, { once: true });
measure();

const destroyContactAlignment = initContactAlignment();
if (import.meta.hot) import.meta.hot.dispose(destroyContactAlignment);
import { initResponsive } from './responsive.js';
import './responsive.css';
const destroyResponsive = initResponsive();
if (import.meta.hot) import.meta.hot.dispose(destroyResponsive);
import { initTabletAssembly } from './tablet-assembly.js';
const destroyTabletAssembly = initTabletAssembly();
if (import.meta.hot) import.meta.hot.dispose(destroyTabletAssembly);
