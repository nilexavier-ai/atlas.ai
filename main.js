const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.desktop-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const recipient = 'atlasiq26@gmail.com';

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(contactForm);
  const name = `${form.get('firstName')} ${form.get('lastName')}`;
  const subject = encodeURIComponent(`Atlas AI inquiry from ${form.get('company')}`);
  const body = encodeURIComponent([
    `Name: ${name}`,
    `Email: ${form.get('email')}`,
    `Company: ${form.get('company')}`,
    '',
    form.get('message'),
  ].join('\n'));

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

const legalDialog = document.querySelector('#legal-dialog');
const legalPanels = legalDialog?.querySelectorAll('[data-panel]');

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    legalPanels?.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== button.dataset.dialog;
    });
    legalDialog?.showModal();
  });
});

legalDialog?.querySelector('.dialog-close')?.addEventListener('click', () => legalDialog.close());
legalDialog?.addEventListener('click', (event) => {
  if (event.target === legalDialog) legalDialog.close();
});
