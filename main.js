const recipient = 'atlasiq26@gmail.com';

const navigationItems = [
  ['/how-it-works', 'How It Works'],
  ['/features', 'Features'],
  ['/solutions', 'Solutions'],
  ['/pricing', 'Pricing'],
  ['/faq', 'FAQ'],
];

const normalisePath = (path) => path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
const currentPath = normalisePath(window.location.pathname);

const header = document.querySelector('[data-site-header]');
if (header) {
  header.innerHTML = `
    <div class="announcement">AI receptionists built for businesses that can’t afford to miss a call.</div>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Atlas AI home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>ATLAS<span>.AI</span></span>
      </a>
      <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
        ${navigationItems.map(([href, label]) => `<a href="${href}"${currentPath === href ? ' class="active" aria-current="page"' : ''}>${label}</a>`).join('')}
        <a class="mobile-nav-cta${currentPath === '/book-demo' ? ' active' : ''}" href="/book-demo"${currentPath === '/book-demo' ? ' aria-current="page"' : ''}>Book a Demo</a>
      </nav>
      <a class="button button-small header-cta" href="/book-demo"${currentPath === '/book-demo' ? ' aria-current="page"' : ''}>Book a Demo</a>
      <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open navigation"><span></span><span></span></button>
    </header>`;
}

const footer = document.querySelector('[data-site-footer]');
if (footer) {
  footer.innerHTML = `
    <footer class="footer">
      <div class="footer-brand"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>ATLAS<span>.AI</span></span></a><p>Turning missed calls into booked jobs.</p><a href="mailto:${recipient}">${recipient}</a></div>
      <div><h3>Product</h3><a href="/how-it-works">How It Works</a><a href="/features">Features</a><a href="/book-demo">Book a Demo</a></div>
      <div><h3>Solutions</h3><a href="/solutions">Trades</a><a href="/solutions">Service businesses</a><a href="/solutions">Property maintenance</a></div>
      <div><h3>Company</h3><a href="/">About Atlas</a><a href="mailto:${recipient}">Contact</a></div>
      <div><h3>Legal</h3><button type="button" data-dialog="privacy">Privacy Policy</button><button type="button" data-dialog="terms">Terms</button></div>
      <p class="copyright">© <span data-year></span> Atlas AI. All rights reserved.</p>
    </footer>
    <dialog class="legal-dialog" id="legal-dialog">
      <button class="dialog-close" type="button" aria-label="Close dialog">×</button>
      <div data-panel="privacy"><p class="kicker">Privacy</p><h2>Privacy Policy</h2><p>Atlas AI only uses information you submit to respond to your enquiry and provide requested services. We do not sell personal information. To request access, correction or deletion, email <a href="mailto:${recipient}">${recipient}</a>.</p></div>
      <div data-panel="terms" hidden><p class="kicker">Terms</p><h2>Website Terms</h2><p>This website provides general information about Atlas AI. Product capabilities and availability may change. Contact our team for the terms that apply to a specific service engagement.</p></div>
    </dialog>`;
}

document.querySelectorAll('[data-year]').forEach((year) => { year.textContent = new Date().getFullYear(); });

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(contactForm);
  const subject = encodeURIComponent(`Atlas AI demo request from ${form.get('company')}`);
  const body = encodeURIComponent([
    `Name: ${form.get('firstName')} ${form.get('lastName')}`,
    `Email: ${form.get('email')}`,
    `Business: ${form.get('company')}`,
    '',
    form.get('message'),
  ].join('\n'));
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

const legalDialog = document.querySelector('#legal-dialog');
const legalPanels = legalDialog?.querySelectorAll('[data-panel]');
document.querySelectorAll('[data-dialog]').forEach((button) => button.addEventListener('click', () => {
  legalPanels?.forEach((panel) => { panel.hidden = panel.dataset.panel !== button.dataset.dialog; });
  legalDialog?.showModal();
}));
legalDialog?.querySelector('.dialog-close')?.addEventListener('click', () => legalDialog.close());
legalDialog?.addEventListener('click', (event) => { if (event.target === legalDialog) legalDialog.close(); });
