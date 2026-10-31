// [Codex 연결] 페이지 전용 $를 함수 안에 두어 수업의 jQuery $와 충돌하지 않게 합니다.
(function () {
'use strict';
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const characters = {
  boksil: {name: '복실이', description: '마당에서 반겨주는 강아지', title: '반가운 친구, 복실이', file: '01-boksil.png', width: 1199, height: 1312, greeting: '“오셨어요? 오늘 이야기가 궁금해요!”', quotes: ['“오늘은 어디 다녀오셨어요?\n그 이야기가 궁금해요!”', '“같이 있으면 더 즐겁죠!\n재미난 이야기 해봐요.”', '“천천히 이야기해 주세요.\n여기서 듣고 있을게요.”']},
  hodam: {name: '호담이', description: '민화 속 순한 호랑이', title: '수다 친구, 호담이', file: '02-hodam.png', width: 1024, height: 1536, greeting: '“어흥! 오늘 하루 어땠어요?”', quotes: ['“산책길에 무얼 보셨어요?\n나도 그 이야기가 궁금해요.”', '“어흥은 됐고,\n수다나 한 판 할까요?”', '“서두를 것 있나요.\n우리 느긋하게 이야기해요.”']},
  dodam: {name: '도담이', description: '이야기보따리를 푸는 도깨비', title: '능청스러운 친구, 도담이', file: '03-dodam.png', width: 1222, height: 1287, greeting: '“반가워유. 오늘은 어땠어유?”', quotes: ['“별일 없던 하루도 좋아유.\n무슨 일이 있었는지 들려줘유.”', '“재미난 얘기,\n한 보따리 풀어볼까유?”', '“천천히 말씀하셔유.\n이야기는 서두를 것 없지유.”']},
  boksoon: {name: '복순 할머니', description: '살갑게 맞아주는 동네 이웃', title: '정겨운 친구, 복순 할머니', file: '05-boksoon.png', width: 1024, height: 1536, greeting: '“잘 오셨어유. 이야기 좀 해봐유.”', quotes: ['“오늘 무슨 일 있었어유?\n편하게 들려주셔유.”', '“우리 웃긴 얘기 하나씩\n나눠볼까유?”', '“천천히 해도 괜찮아유.\n우리 편하게 이야기해유.”']},
  deoksu: {name: '덕수 할아버지', description: '느긋하게 귀 기울이는 이야기꾼', title: '푸근한 친구, 덕수 할아버지', file: '06-deoksu.png', width: 1024, height: 1536, greeting: '“잘 오셨어요. 이야기나 나눌까요?”', quotes: ['“그 얘기 참 재미있네요.\n조금 더 들려줘요.”', '“내가 아는 재미난 얘기,\n하나 들려드릴까요?”', '“급할 것 있나요.\n천천히 함께 이야기합시다.”']}
};
let activeCharacter = 'hodam';
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }), {threshold: 0.12});
  $$('.reveal').forEach(element => observer.observe(element));
}
// Editorial scenes, not a preview of a finalized app interface.
const scenes = [
  {name: 'daily', label: '작은 이야기도 반갑게', quote: '“오늘 산책은 어떠셨어요?\n그 이야기가 궁금해요.”'},
  {name: 'smile', label: '소소한 웃음을 함께', quote: '“우리, 재미있는 이야기\n하나 해볼까요?”'},
  {name: 'comfort', label: '천천히, 편안하게', quote: '“천천히 말씀하셔도 괜찮아요.\n편하게 이야기해 주세요.”'}
];
const steps = $$('.story-step');
const sceneButtons = $$('[data-scene-select]');
const stage = $('.portrait-stage');
let activeScene = -1;
function setScene(index, force = false) {
  if ((!force && index === activeScene) || !scenes[index]) return;
  activeScene = index;
  const scene = scenes[index];
  stage.dataset.scene = scene.name;
  $('#scene-kicker').textContent = scene.label;
  const quote = $('#scene-quote');
  quote.textContent = characters[activeCharacter].quotes[index];
  quote.classList.remove('scene-enter');
  requestAnimationFrame(() => quote.classList.add('scene-enter'));
  sceneButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
}
function selectCharacter(key, announce = false) {
  const character = characters[key];
  if (!character) return;
  activeCharacter = key;
  document.body.dataset.character = key;
  $$('[data-companion-image]').forEach(image => {
    image.src = `assets/character-candidates/${character.file}`;
    image.width = character.width;
    image.height = character.height;
    image.alt = image.dataset.companionImage === 'decorative' ? '' : `${character.description}, ${character.name}`;
  });
  $('#friend-greeting-label').textContent = `${character.name}의 다정한 첫인사`;
  $('#friend-greeting').textContent = character.greeting;
  $('#friend-description').textContent = character.description;
  $('#friend-name').textContent = character.title;
  $$('[data-character-select]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.characterSelect === key)));
  setScene(Math.max(0, activeScene), true);
  if (announce) $('#character-announcement').textContent = `${character.name}의 모습을 보고 있어요. ${character.greeting}`;
}
$$('[data-character-select]').forEach(button => button.addEventListener('click', () => selectCharacter(button.dataset.characterSelect, true)));
selectCharacter(activeCharacter);
const sceneAnchor = () => innerWidth < 800 ? Math.min(innerHeight - 70, innerHeight * .8) : innerHeight * .54;
sceneButtons.forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.sceneSelect);
  const box = steps[index].getBoundingClientRect();
  setScene(index);
  scrollTo({top: Math.max(0, scrollY + box.top + box.height * .45 - sceneAnchor()), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
}));
const hero = $('.hero');
const parallaxLayers = $$('[data-parallax]');
let scrollQueued = false;
function updateScroll() {
  scrollQueued = false;
  const total = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--page-progress', total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0);
  $('.header').classList.toggle('scrolled', scrollY > 30);
  if (!reducedMotion.matches && scrollY < hero.offsetHeight + innerHeight) parallaxLayers.forEach(element => {element.style.translate = `0 ${Math.min(scrollY, 900) * Number(element.dataset.parallax)}px`;});
  let closest = 0, distance = Infinity;
  steps.forEach((step, index) => {
    const box = step.getBoundingClientRect();
    const next = Math.abs(box.top + box.height * .45 - sceneAnchor());
    if (next < distance) {closest = index; distance = next;}
  });
  setScene(closest);
}
function queueScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(updateScroll);
}
addEventListener('scroll', queueScroll, {passive: true});
addEventListener('resize', queueScroll);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) parallaxLayers.forEach(element => {element.style.translate = 'none';});
  queueScroll();
});
updateScroll();

const menu = $('#mobile-menu');
const menuToggle = $('.menu-toggle');
function closeMenu() {
  menu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '메뉴 열기');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  menu.hidden = !open;
});
$$('a', menu).forEach(link => link.addEventListener('click', closeMenu));
addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {closeMenu(); menuToggle.focus();}
});
addEventListener('resize', () => {if (innerWidth >= 800) closeMenu();});

// Fake-door CTA: disclose availability immediately. No sign-up or transmission occurs.
const dialog = $('#interest-dialog');
let lastTrigger = null;
$$('[data-interest]').forEach(button => button.addEventListener('click', () => {
  if (dialog.open) return;
  lastTrigger = button.dataset.interest === 'mobile' ? menuToggle : button;
  closeMenu();
  dialog.showModal();
  document.body.classList.add('dialog-open');
  // A future analytics integration can subscribe. This event is not sent or stored here.
  document.dispatchEvent(new CustomEvent('maldongmu:interest', {detail: {placement: button.dataset.interest, character: activeCharacter}}));
}));
$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lastTrigger?.focus({preventScroll: true});
});

})();
