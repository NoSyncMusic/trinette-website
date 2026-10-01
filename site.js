(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const text = (id, value) => {
    const el = $(id);
    if (el && typeof value === 'string') el.textContent = value;
  };
  const record = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const list = (v) => Array.isArray(v) ? v.filter(record) : [];

  function hex(value) {
    if (typeof value !== 'string') return '';
    const m = value.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!m) return '';
    const raw = m[1].length === 3 ? [...m[1]].map(c => c + c).join('') : m[1];
    return '#' + raw.toUpperCase();
  }

  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const u = new URL(value, document.baseURI);
      if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) return '';
      return u.href;
    } catch {
      return '';
    }
  }

  function safeImage(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const u = new URL(value.trim(), document.baseURI);
      if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) return '';
      if (u.origin !== location.origin && u.protocol !== 'https:') return '';
      return u.href;
    } catch {
      return '';
    }
  }

  function applyColors(colors) {
    if (!record(colors)) return;
    const vars = {
      background: '--bg',
      backgroundSoft: '--bg-soft',
      panel: '--panel',
      text: '--text',
      muted: '--muted',
      accent: '--accent',
      accentLight: '--accent-2',
      quoteBackground: '--quote-bg',
      ctaBackground: '--cta-bg'
    };
    for (const [key, cssVar] of Object.entries(vars)) {
      const value = hex(colors[key]);
      if (value) document.documentElement.style.setProperty(cssVar, value);
    }
    const theme = hex(colors.background);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (theme && meta) meta.content = theme;
  }

  function renderServices(items) {
    const target = $('services-list');
    if (!target) return;
    target.replaceChildren();
    list(items).filter(item => item.visible !== false).forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'service-row';

      const number = document.createElement('div');
      number.className = 'service-no';
      number.textContent = String(item.number || String(index + 1).padStart(2, '0'));

      const titleEl = document.createElement('div');
      titleEl.className = 'service-title';
      titleEl.textContent = String(item.title || '');

      const note = document.createElement('div');
      note.className = 'service-note';
      note.textContent = String(item.note || '');

      row.append(number, titleEl, note);
      target.append(row);
    });
  }

  function makeWork(item) {
    const article = document.createElement('article');
    const size = ['tall', 'square', 'wide'].includes(item.size) ? item.size : 'tall';
    article.className = 'work ' + size + ' reveal visible';
    article.setAttribute('data-lightbox', '');

    const img = document.createElement('img');
    const src = safeImage(item.image);
    if (src) img.src = src;
    img.alt = String(item.alt || item.title || 'Kunstwerk van Trinette den Hamer');
    img.loading = 'lazy';
    img.decoding = 'async';

    const caption = document.createElement('div');
    caption.className = 'work-caption';

    const titleEl = document.createElement('span');
    titleEl.textContent = String(item.title || '');
    const medium = document.createElement('span');
    medium.textContent = String(item.medium || '');

    caption.append(titleEl, medium);
    article.append(img, caption);
    return article;
  }

  function renderPortfolio(items) {
    const gallery = $('portfolio-gallery');
    if (!gallery) return;

    const visible = list(items).filter(item => item.visible !== false && item.image);
    gallery.replaceChildren();

    const split = Math.ceil(visible.length / 2);
    const groups = [visible.slice(0, split), visible.slice(split)];

    groups.forEach(group => {
      const col = document.createElement('div');
      col.className = 'gallery-col';
      group.forEach(item => col.append(makeWork(item)));
      gallery.append(col);
    });
  }

  function renderProcess(steps) {
    const target = $('process-list');
    if (!target) return;
    target.replaceChildren();

    list(steps).forEach((step, index) => {
      const item = document.createElement('div');
      item.className = 'process-item';

      const number = document.createElement('small');
      number.textContent = String(step.number || String(index + 1).padStart(2, '0'));

      const body = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = String(step.title || '');
      const span = document.createElement('span');
      span.textContent = String(step.text || '');

      body.append(strong, span);
      item.append(number, body);
      target.append(item);
    });
  }

  function bindLightbox() {
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      if (item.dataset.bound === 'true') return;
      item.dataset.bound = 'true';
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const box = $('lightbox');
        const boxImg = $('lightboxImage');
        if (!img || !box || !boxImg || !img.src) return;
        boxImg.src = img.src;
        boxImg.alt = img.alt;
        box.classList.add('open');
        box.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function applyContent(data) {
    if (!record(data)) return;

    const site = record(data.site) ? data.site : {};
    const nav = record(data.navigation) ? data.navigation : {};
    const hero = record(data.hero) ? data.hero : {};
    const intro = record(data.intro) ? data.intro : {};
    const portfolio = record(data.portfolio) ? data.portfolio : {};
    const quote = record(data.quote) ? data.quote : {};
    const about = record(data.about) ? data.about : {};
    const process = record(data.process) ? data.process : {};
    const contact = record(data.contact) ? data.contact : {};
    const footer = record(data.footer) ? data.footer : {};

    applyColors(data.colors);

    if (typeof site.artistName === 'string') {
      text('site-name', site.artistName);
      text('footer-name', site.artistName);
    }
    if (typeof site.pageTitle === 'string' && site.pageTitle.trim()) document.title = site.pageTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description && typeof site.description === 'string') description.content = site.description;

    text('nav-work', nav.work);
    text('nav-about', nav.about);
    text('nav-process', nav.process);
    text('nav-contact', nav.contact);
    text('mobile-work', nav.work);
    text('mobile-about', nav.about);
    text('mobile-process', nav.process);
    text('mobile-contact', nav.contact);

    text('hero-eyebrow', hero.eyebrow);
    text('hero-title-main', hero.title);
    text('hero-title-accent', hero.titleAccent);
    text('hero-intro', hero.intro);
    text('hero-button-text', hero.buttonText);
    text('hero-caption', hero.caption);

    const heroImg = $('hero-image');
    const heroSrc = safeImage(hero.image);
    if (heroImg && heroSrc) heroImg.src = heroSrc;
    if (heroImg && typeof hero.imageAlt === 'string') heroImg.alt = hero.imageAlt;

    text('intro-eyebrow', intro.eyebrow);
    text('intro-title', intro.title);
    text('intro-text-1', intro.text1);
    text('intro-text-2', intro.text2);
    renderServices(data.services);

    text('portfolio-eyebrow', portfolio.eyebrow);
    text('portfolio-title', portfolio.title);
    text('portfolio-intro', portfolio.intro);
    renderPortfolio(portfolio.items);

    text('quote-text', quote.text);

    text('about-eyebrow', about.eyebrow);
    text('about-title', about.title);
    text('about-text-1', about.text1);
    text('about-text-2', about.text2);
    text('about-button-text', about.buttonText);
    const aboutImg = $('about-image');
    const aboutSrc = safeImage(about.image);
    if (aboutImg && aboutSrc) aboutImg.src = aboutSrc;
    if (aboutImg && typeof about.imageAlt === 'string') aboutImg.alt = about.imageAlt;

    text('process-eyebrow', process.eyebrow);
    text('process-title', process.title);
    renderProcess(process.steps);

    text('contact-eyebrow', contact.eyebrow);
    text('contact-title', contact.title);
    text('contact-text', contact.text);
    text('contact-button', contact.buttonText);

    const email = typeof site.contactEmail === 'string' ? site.contactEmail.trim() : '';
    const contactButton = $('contact-button');
    const aboutButton = $('about-contact-link');
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const mail = 'mailto:' + email + '?subject=' + encodeURIComponent('Aanvraag portret');
      if (contactButton) contactButton.href = mail;
      if (aboutButton) aboutButton.href = '#contact';
    }

    text('footer-work', footer.work);
    text('footer-about', footer.about);
    text('footer-contact', footer.contact);
    text('footer-instagram', footer.instagram);

    const instagram = $('footer-instagram');
    const instagramUrl = safeUrl(site.instagramUrl);
    if (instagram) {
      instagram.hidden = !instagramUrl;
      if (instagramUrl) instagram.href = instagramUrl;
    }

    bindLightbox();
  }

  async function load() {
    try {
      const response = await fetch('content.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('content.json kon niet worden geladen');
      applyContent(await response.json());
    } catch (error) {
      console.warn('De ingebouwde website-inhoud wordt gebruikt.', error);
      bindLightbox();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, { once: true });
  } else {
    load();
  }
})();
