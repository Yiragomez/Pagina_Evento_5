/* ============================================
   script.js — Colombia 5.0 (Completo)
   ============================================ */

// ════════════════════════════════════════════
//  BARRA DE PROGRESO DE SCROLL
// ════════════════════════════════════════════
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ════════════════════════════════════════════
//  NAV: sombra al hacer scroll + activo
// ════════════════════════════════════════════
function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      links.forEach(l => l.classList.remove('active'));

      const link = document.querySelector(
        `.nav__links a[href="#${entry.target.id}"]`
      );

      if (link) link.classList.add('active');
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

// ════════════════════════════════════════════
//  MENÚ MÓVIL
// ════════════════════════════════════════════
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');

  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');

    btn.setAttribute(
      'aria-expanded',
      links.classList.contains('open')
    );

    btn.textContent =
      links.classList.contains('open')
        ? '✕'
        : '☰';
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.textContent = '☰';
    })
  );
}

// ════════════════════════════════════════════
//  SCROLL REVEAL GENÉRICO
// ════════════════════════════════════════════
function initScrollReveal() {
  const targets =
    document.querySelectorAll('.reveal, .reveal-fade');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach(el => obs.observe(el));
}

// ════════════════════════════════════════════
//  CONTADOR ANIMADO
// ════════════════════════════════════════════
function initCounters() {
  const nums =
    document.querySelectorAll('.stat-num[data-target]');

  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);

      const dur = 1400;
      const step = dur / target;

      let current = 0;

      const tick = () => {
        current++;
        el.textContent = current;

        if (current < target)
          setTimeout(tick, step);
      };

      setTimeout(tick, 300);

      obs.unobserve(el);

    });
  }, { threshold: 0.6 });

  nums.forEach(n => obs.observe(n));
}

// ════════════════════════════════════════════
//  LIGHTBOX
// ════════════════════════════════════════════
(function initLightbox() {

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  if (!lb) return;

  let items = [];
  let current = 0;

  function buildItems() {

    const withSrc =
      [...document.querySelectorAll('[data-src]')];

    const rawImgs =
      [...document.querySelectorAll(
        '.resumen-galeria img, .pixar-gallery img, .conference-card img'
      )];

    const fromImgs = rawImgs.map(img => ({
      src: img.src,
      caption: img.alt || ''
    }));

    const fromSrc = withSrc.map(el => ({
      src: el.dataset.src,
      caption: el.dataset.caption || ''
    }));

    const seen = new Set();

    return [...fromSrc, ...fromImgs].filter(item => {
      if (seen.has(item.src)) return false;
      seen.add(item.src);
      return true;
    });

  }

  function openLightbox(index) {
    items = buildItems();
    current = index;

    show(current);

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function show(i) {

    if (!items.length) return;

    current =
      (i + items.length) % items.length;

    lbImg.src = items[current].src;
    lbImg.alt = items[current].caption;

    lbCaption.textContent =
      items[current].caption;

  }

  document.addEventListener('click', e => {

    const trigger =
      e.target.closest('[data-src]');

    if (trigger) {

      items = buildItems();

      const src = trigger.dataset.src;

      const idx =
        items.findIndex(it => it.src === src);

      openLightbox(idx >= 0 ? idx : 0);

      return;
    }

    const img =
      e.target.closest(
        '.resumen-galeria img, .pixar-gallery img, .conference-card img'
      );

    if (img) {

      items = buildItems();

      const idx =
        items.findIndex(it => it.src === img.src);

      openLightbox(idx >= 0 ? idx : 0);

    }

  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => show(current - 1));
  lbNext?.addEventListener('click', () => show(current + 1));

  document.addEventListener('keydown', e => {

    if (!lb.classList.contains('open')) return;

    if (e.key === 'Escape')
      closeLightbox();

    if (e.key === 'ArrowLeft')
      show(current - 1);

    if (e.key === 'ArrowRight')
      show(current + 1);

  });

  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  let startX = 0;

  lb.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', e => {

    const dx =
      e.changedTouches[0].clientX - startX;

    if (Math.abs(dx) > 50)
      show(current + (dx < 0 ? 1 : -1));

  });

})();

// ════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  initScrollProgress();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initCounters();

  // ═══════════════════════════════
  // MODAL ÉTICA
  // ═══════════════════════════════
  const modalEtica =
    document.getElementById('modalEtica');

  const openEtica =
    document.getElementById('openEtica');

  const closeEtica =
    document.getElementById('closeEtica');

  if (openEtica && modalEtica) {

    openEtica.addEventListener('click', () => {
      modalEtica.classList.add('active');
    });

  }

  if (closeEtica && modalEtica) {

  closeEtica.addEventListener('click', () => {
    modalEtica.classList.remove('active');
  });

}

/* ==========================================
   TRADUCTOR ES | EN
========================================== */

const langBtn =
document.getElementById("langToggle");

let currentLang = "es";

const translations = {

  es: {

    navInicio: "Inicio",
    navConferencias: "Conferencias",
    navGaleria: "Galería",

    heroEvento: "EVENTO ACADÉMICO 2026",
    heroSub: "Transformación Digital · Innovación · Futuro",

    btnConf: "Ver Conferencias",
    btnGaleria: "Galería",
    btnGlosario: "📚 Glosario",

    txtConceptos: "Conceptos",
    txtGlosario: "Glosario Tecnológico",
    txtIntroGlosario:"Conceptos fundamentales relacionados con transformación digital, inteligencia artificial, animación digital y redes sociales.",


    txtPrograma: "Programa",

    txtConferencias: "Conferencias Destacadas",

    txtIntroConferencias:
    "Dos visiones del mundo digital: animación cinematográfica de talla mundial y estrategias de crecimiento en redes sociales.",

    txtGaleriaTitulo: "Galería del Evento",

    txtResumen: "Resumen de la Conferencia",
    txtTemas: "Temas Principales",
    txtBeneficios: "Beneficios de la Transformación Digital",
    txtMomentos: "Momentos del Evento",
    txtConclusion: "Conclusión",

    txtBtnContacto: "Contacto",
    txtBtnEtica: "Reflexión Ética",

    txtEtica: "Reflexión Ética",

    txtEticaContenido:
    "Fue un espacio muy creativo, acompañado por personas íntegras y profesionales. Allí aprendimos acerca de varias tecnologías que hoy en día son fundamentales para el futuro y el crecimiento personal. La transformación digital debe utilizarse de manera responsable, respetando la privacidad, la transparencia y el bienestar de las personas.",

    txtContacto: "Información de Contacto",

    txtNombre:
    "Nombre: Yira Gómez",

    txtCorreo:
    "Correo: gomezhurtadoyirley@gmail.com",

    txtTelefono:
    "Teléfono: +57 3212570018",

    txtProyecto:
    "Proyecto: Colombia 5.0",

    txtScroll: "Scroll",

    txtStat1: "Conferencistas",
    txtStat2: "Películas Pixar",
    txtStat3: "Redes Sociales",
    txtStat4: "Día de Evento",

    txtPixarSubtitulo:
    "Ian Megibben · Director of Photography & Lighting",

    txtPixarHero:
    "Descubre cómo la iluminación, la dirección de fotografía y las sombras transforman personajes e historias en producciones animadas de talla mundial.",

    txtTrayectoria:
    "🎬 Trayectoria",

    txtExperiencia:
    "🏆 Experiencia",

    txtConferencia:
    "🦫 Conferencia",

    txtResumen1:
    "Durante la conferencia, Ian Megibben compartió cómo la iluminación, la composición visual y las sombras permiten transmitir emociones y fortalecer la narrativa dentro de las producciones animadas.",

    txtResumen2:
    "También explicó parte del proceso creativo utilizado en Pixar para desarrollar mundos visualmente impactantes y personajes memorables, destacando ejemplos de proyectos recientes como Hoppers.",

    txtDestacado:
    "Lo más destacado",

    txtConclusion1:
    "Ian nos muestra que en cada uno de sus trabajos va mejorando sus técnicas y el aprovechamiento de las luces y el contraste.",

    txtConclusion2:
    "También nos enseña que el trabajo en equipo detrás de cámaras es la parte más importante."
      },
    
  en: {

    navInicio: "Home",
    navConferencias: "Conferences",
    navGaleria: "Gallery",

    heroEvento: "ACADEMIC EVENT 2026",
    heroSub: "Digital Transformation · Innovation · Future",

    btnConf: "View Conferences",
    btnGaleria: "Gallery",
    btnGlosario: "📚 Glossary",

    txtConceptos: "Concepts",
    txtGlosario: "Technology Glossary",
    txtIntroGlosario:"Fundamental concepts related to digital transformation, artificial intelligence, digital animation and social media.",
    

    txtPrograma: "Program",

    txtConferencias: "Featured Conferences",

    txtIntroConferencias:
    "Two visions of the digital world: world-class animated filmmaking and social media growth strategies.",

    txtGaleriaTitulo: "Event Gallery",

    txtResumen: "Conference Summary",
    txtTemas: "Main Topics",
    txtBeneficios: "Benefits of Digital Transformation",
    txtMomentos: "Event Highlights",
    txtConclusion: "Conclusion",

    txtBtnContacto: "Contact",
    txtBtnEtica: "Ethical Reflection",

    txtEtica: "Ethical Reflection",

    txtEticaContenido:
    "It was a very creative space, accompanied by professional and committed people. We learned about several technologies that are essential today for the future and personal growth. Digital transformation must be used responsibly, respecting privacy, transparency and people's well-being.",

    txtContacto: "Contact Information",

    txtNombre:
    "Name: Yira Gómez",

    txtCorreo:
    "Email: gomezhurtadoyirley@gmail.com",

    txtTelefono:
    "Phone: +57 3212570018",

    txtProyecto:
    "Project: Colombia 5.0",

    txtScroll: "Scroll",

    txtStat1: "Speakers",
    txtStat2: "Pixar Movies",
    txtStat3: "Social Networks",
    txtStat4: "Event Day",

    txtPixarSubtitulo:
    "Ian Megibben · Director of Photography & Lighting",

    txtPixarHero:
    "Discover how lighting, cinematography and shadows transform characters and stories in world-class animated productions.",

    txtTrayectoria:
    "🎬 Career",

    txtExperiencia:
    "🏆 Experience",

    txtConferencia:
    "🦫 Conference",

    txtResumen1:
    "During the conference, Ian Megibben explained how lighting, visual composition and shadows help convey emotions and strengthen storytelling in animated productions.",

    txtResumen2:
    "He also described Pixar's creative process for building visually stunning worlds and memorable characters, highlighting recent projects such as Hoppers.",

    txtDestacado:
    "Highlights",

    txtConclusion1:
    "Ian shows how he continually improves his techniques and the use of lighting and contrast to enhance the viewer experience.",

    txtConclusion2:
    "He also teaches that teamwork behind the scenes is one of the most important parts of creating successful productions."

  }

};
if(langBtn){

  langBtn.addEventListener("click", () => {

    currentLang =
    currentLang === "es"
    ? "en"
    : "es";

    Object.keys(
      translations[currentLang]
    ).forEach(id => {

      const element =
      document.getElementById(id);

      if(element){

  element.textContent =
  translations[currentLang][id];

}

    });

  });

}
/* ==========================================
   FONDO TECNOLÓGICO
========================================== */

window.addEventListener("scroll",()=>{

 if(window.scrollY > 300){

   document.body.classList.add("tech-bg");

 }else{

   document.body.classList.remove("tech-bg");

 }

});
  // ═══════════════════════════════
  // MODAL CONTACTO
  // ═══════════════════════════════
  const modalContacto =
    document.getElementById('modalContacto');

  const openContacto =
    document.getElementById('openContacto');

  const closeContacto =
    document.getElementById('closeContacto');

  if (openContacto && modalContacto) {

    openContacto.addEventListener('click', () => {
      modalContacto.classList.add('active');
    });

  }

  if (closeContacto && modalContacto) {

    closeContacto.addEventListener('click', () => {
      modalContacto.classList.remove('active');
    });

  }

  // CERRAR MODALES
  window.addEventListener('click', e => {

    if (modalEtica && e.target === modalEtica) {
      modalEtica.classList.remove('active');
    }

    if (modalContacto && e.target === modalContacto) {
      modalContacto.classList.remove('active');
    }

  });

  // BOTONES SCROLL
  const topBtn =
    document.getElementById('scrollTopBtn');

  const bottomBtn =
    document.getElementById('scrollBottomBtn');

  if (topBtn) {

    topBtn.addEventListener('click', () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    });

  }

  if (bottomBtn) {

    bottomBtn.addEventListener('click', () => {

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });

    });

  }

});
