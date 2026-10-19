(function() {
  'use strict';

  const WHATSAPP_NUMBER = '56991924089';
  const WHATSAPP_BASE = 'https://wa.me/' + WHATSAPP_NUMBER;
  const BOOKING_URL = 'https://www.booking.com/hostal/cl/casa-cuento.es.html';
  const EXPEDIA_URL = 'https://www.expedia.com/es/Vina-Del-Mar-Hoteles-Casa-Cuento.h16264146.Informacion-Hostal';
  const EMAIL_TO = 'refugiocasacuento@gmail.com';

  // Año dinámico footer
  const setYear = () => {
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  // ============================================
  // LOGO MULTI-IDIOMA
  // ============================================
  const initMultiLangLogo = () => {
    const lang = (navigator.language || 'es').toLowerCase();
    const isSpanish = lang.startsWith('es');
    const logoEs = 'assets/logo-refugio-casacuento-es.png';
    const logoEn = 'assets/logo-magic-house-en.png';
    const altEs = 'Refugio CasaCuento Hostal Mágico';
    const altEn = 'Magic House Hostal Boutique - Refugio';

    const headerLogo = document.getElementById('headerLogo');
    const footerLogo = document.getElementById('footerLogo');

    if (!isSpanish) {
      if (headerLogo) { headerLogo.src = logoEn; headerLogo.alt = altEn; }
      if (footerLogo) { footerLogo.src = logoEn; footerLogo.alt = altEn; }
    } else {
      if (headerLogo) { headerLogo.src = logoEs; headerLogo.alt = altEs; }
      if (footerLogo) { footerLogo.src = logoEs; footerLogo.alt = altEs; }
    }
  };

  // ============================================
  // HEADER: scroll, dropdown, mobile menu
  // ============================================
  const initHeader = () => {
    const header = document.getElementById('siteHeader');
    const navToggle = document.getElementById('navToggle');

    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }, { passive: true });
    }

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const isOpen = header.classList.toggle('menu-open');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Dropdown toggle
    document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = btn.parentElement;
        const isOpen = parent.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
        // cerrar otros
        document.querySelectorAll('.nav-dropdown.open').forEach(other => {
          if (other !== parent) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.nav-dropdown-toggle');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => {
          d.classList.remove('open');
          const btn = d.querySelector('.nav-dropdown-toggle');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Cerrar menú móvil al click en link
    document.querySelectorAll('.nav-list a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          header.classList.remove('menu-open');
          if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  };

  // ============================================
  // FONT SIZE: deshabilitado (mantengo solo el idioma por ahora)
  // ============================================
  // const initFontSize = () => { ... }; // removido

  // ============================================
  // IDIOMA: dropdown manual con ES / EN / PT
  // ============================================
  const initLangMenu = () => {
    const control = document.getElementById('langControl');
    const btn = control && control.querySelector('.lang-btn');
    const menu = control && control.querySelector('.lang-menu');
    if (!control || !btn || !menu) return;

    const open = () => {
      control.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      control.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };
    const isOpen = () => control.classList.contains('open');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen()) close(); else open();
    });

    document.addEventListener('click', (e) => {
      if (!control.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) close();
    });

    menu.querySelectorAll('a[data-lang]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = a.dataset.lang;
        if (lang === 'es') {
          window.location.reload();
          return;
        }
        const url = window.location.href;
        const target = `https://translate.google.com/translate?sl=es&tl=${lang}&u=${encodeURIComponent(url)}`;
        window.open(target, '_blank', 'noopener');
        close();
      });
    });
  };

  // ============================================
  // RESERVA: helper para abrir WhatsApp con datos
  // ============================================
  const openWhatsAppReserva = (opts) => {
    const lines = [
      `Hola CasaCuento, me interesa consultar disponibilidad.`,
      ``,
      `• Alojamiento: ${opts.alojamiento}`,
      `• Fecha de entrada: ${opts.fechaEntrada}`,
      `• Fecha de salida: ${opts.fechaSalida}`,
      `• Personas: ${opts.personas}`,
    ];
    if (opts.cascada) lines.push(`• Cascada en piscina: Sí (+$${opts.cascadaPrecio || 90000} CLP)`);
    lines.push('');
    lines.push('Quedo atento a su confirmación. ¡Gracias!');

    const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');
  };

  // ============================================
  // ALOJAMIENTOS: form inline → WhatsApp
  // ============================================
  const initAlojamientoForms = () => {
    document.querySelectorAll('[data-alojamiento-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const alojamiento = form.dataset.alojamiento || 'alojamiento';
        const fechaEntrada = form.querySelector('[name="fechaEntrada"]').value;
        const fechaSalida = form.querySelector('[name="fechaSalida"]').value;
        const personas = form.querySelector('[name="personas"]').value;
        const cascada = form.querySelector('[name="cascada"]')?.checked || false;

        if (!fechaEntrada || !fechaSalida) {
          alert('Por favor selecciona fecha de entrada y salida.');
          return;
        }

        openWhatsAppReserva({
          alojamiento,
          fechaEntrada,
          fechaSalida,
          personas,
          cascada,
          cascadaPrecio: 90000
        });
      });
    });
  };

  // ============================================
  // CHATBOT
  // ============================================
  const responses = {
    habitaciones: {
      text: '🛏️ Nuestras habitaciones boutique combinan piedra y madera noble. Están equipadas con ropa de cama premium, calefacción y todo lo necesario para un descanso profundo.',
      waText: 'Hola%20CasaCuento%2C%20me%20interesan%20las%20habitaciones'
    },
    piscina: {
      text: '🏊 Nuestra piscina al aire libre está rodeada de áreas verdes y naturaleza. Un refugio perfecto para refrescar cuerpo y espíritu bajo el sol de la costa.',
      waText: 'Hola%20CasaCuento%2C%20me%20interesa%20la%20piscina'
    },
    entorno: {
      text: '🌲 CasaCuento está abrazada por el bosque nativo de Mantagua. Senderos, silencio, aire puro y la brisa del Pacífico a minutos de Concón.',
      waText: 'Hola%20CasaCuento%2C%20quisiera%20conocer%20m%C3%A1s%20sobre%20el%20entorno'
    },
    ubicacion: {
      text: '📍 Estamos en Mantagua, Concón, V Región de Chile. Aprox. 1 h 30 min desde Santiago por Ruta 5 Norte, a 15 min de Concón por la F-30.',
      waText: 'Hola%20CasaCuento%2C%20quisiera%20m%C3%A1s%20detalles%20sobre%20la%20ubicaci%C3%B3n'
    },
    desayuno: {
      text: '🍳 Cada mañana servimos un desayuno casero con productos frescos y locales: pan recién hecho, café de la zona, frutas y más. Una forma encantadora de empezar el día.',
      waText: 'Hola%20CasaCuento%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20desayuno'
    },
    equipo: {
      text: '💬 ¡Con mucho gusto! Te conecto directamente con nuestro equipo por WhatsApp para resolver todas tus dudas.',
      waText: 'Hola%20CasaCuento%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n'
    }
  };

  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const buildOptionsHTML = (actions) => {
    return '<div class="chat-options">' + actions.map(a =>
      `<button class="chat-option" data-action="${a.action}">${a.label}</button>`
    ).join('') + '</div>';
  };

  const addBotMessage = (body, html = '') => {
    const chatbotBody = document.getElementById('chatbotBody');
    if (!chatbotBody) return;
    const msg = document.createElement('div');
    msg.className = 'chat-message bot';
    msg.innerHTML = `<div class="chat-bubble">${escapeHTML(body)}</div>${html}`;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return msg;
  };

  const addUserMessage = (text) => {
    const chatbotBody = document.getElementById('chatbotBody');
    if (!chatbotBody) return;
    const msg = document.createElement('div');
    msg.className = 'chat-message user';
    msg.innerHTML = `<div class="chat-bubble">${escapeHTML(text)}</div>`;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  const initChatbot = () => {
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotBody = document.getElementById('chatbotBody');
    if (!chatbot || !chatbotToggle || !chatbotWindow || !chatbotClose || !chatbotBody) return;

    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('active');
    });
    chatbotClose.addEventListener('click', () => {
      chatbotWindow.classList.remove('active');
    });

    const welcomeActions = [
      { action: 'habitaciones', label: '🛏️  Habitaciones' },
      { action: 'piscina', label: '🏊  Piscina' },
      { action: 'entorno', label: '🌲  El entorno' },
      { action: 'ubicacion', label: '📍  Ubicación y cómo llegar' },
      { action: 'desayuno', label: '🍳  Desayuno' },
      { action: 'equipo', label: '💬  Hablar con el equipo' }
    ];
    addBotMessage('✨ ¡Saludos, viajero! Soy el Asistente Mágico de CasaCuento. ¿Qué quieres conocer?', buildOptionsHTML(welcomeActions));

    chatbotBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.chat-option');
      if (!btn) return;
      const action = btn.dataset.action;
      const resp = responses[action];
      if (!resp) return;

      const label = btn.textContent.trim();
      addUserMessage(label);

      const optionLists = chatbotBody.querySelectorAll('.chat-options');
      optionLists.forEach(o => o.style.display = 'none');

      setTimeout(() => {
        if (action === 'equipo') {
          const waLink = `${WHATSAPP_BASE}?text=${resp.waText}`;
          const cta = `<div class="chat-options" style="margin-top:12px;">
            <a class="chat-option" href="${waLink}" target="_blank" rel="noopener">💬 Abrir WhatsApp</a>
          </div>`;
          addBotMessage(resp.text, cta);
        } else {
          const cta = `<div class="chat-options" style="margin-top:12px;">
            <a class="chat-option" href="${BOOKING_URL}" target="_blank" rel="noopener">📅 Reservar por Booking</a>
            <a class="chat-option" href="${WHATSAPP_BASE}?text=${resp.waText}" target="_blank" rel="noopener">💬 Hablar por WhatsApp</a>
            <button class="chat-option" data-action="reset">↩️  Ver el menú principal</button>
          </div>`;
          addBotMessage(resp.text, cta);
        }
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
      }, 700);
    });

    chatbotBody.addEventListener('click', (e) => {
      const reset = e.target.closest('[data-action="reset"]');
      if (!reset) return;
      const label = reset.textContent.trim();
      addUserMessage(label);
      const optionLists = chatbotBody.querySelectorAll('.chat-options');
      optionLists.forEach(o => o.style.display = 'none');
      setTimeout(() => {
        addBotMessage('✨ ¿Qué más te gustaría saber de CasaCuento?', buildOptionsHTML(welcomeActions));
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
      }, 500);
    });

    // Mostrar el chatbot
    document.body.classList.add('chatbot-ready');
  };

  // ============================================
  // GALERÍA: thumbnails + lightbox
  // ============================================
  const initGalleries = () => {
    // Thumbnails en páginas de alojamiento
    document.querySelectorAll('.alojamiento-gallery').forEach(gallery => {
      const main = gallery.querySelector('.alojamiento-gallery-main');
      const thumbs = gallery.querySelectorAll('.alojamiento-thumb');
      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          const src = thumb.dataset.src || thumb.src;
          if (main) main.src = src;
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    });

    // Lightbox de galería general
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    if (lightbox && lightboxImg && lightboxClose) {
      document.querySelectorAll('.galeria-item').forEach(item => {
        item.addEventListener('click', () => {
          const img = item.querySelector('img');
          if (!img) return;
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || '';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      });
      const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      };
      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });
    }
  };

  // ============================================
  // MODALES DE ENCANTOS
  // ============================================
  const SERVICIOS = {
    piscina: {
      eyebrow: 'Servicio · Naturaleza',
      title: 'Piscina y Cascada Encantada',
      subtitle: 'Agua cristalina rodeada de naturaleza nativa, con cascada incorporada.',
      description: 'Nuestra piscina al aire libre es el corazón del lugar. Agua cristalina rodeada de áreas verdes, con espacio para relajarse bajo el sol de la costa. En verano se convierte en el punto de encuentro familiar; en otoño e invierno, en un rincón tranquilo donde leer junto al agua.',
      features: [
        { icon: '\u{1F4A7}', title: 'Cascada natural', text: 'Cascada integrada al diseño del jardín, rodeada de piedras nativas y vegetación.' },
        { icon: '\u{1F33F}', title: 'Entorno verde', text: 'Áreas verdes con árboles nativos que dan sombra y privacidad natural.' },
        { icon: '\u{2600}\u{FE0F}', title: 'Todo el año', text: 'Disponible en verano e invierno, temperada y apta para distintas edades.' }
      ],
      gallery: [
        'fotos-web/galeria/piscina-01.webp',
        'fotos-web/galeria/piscina-02.webp',
        'fotos-web/galeria/piscina-cascada-01.webp',
        'fotos-web/galeria/piscina-cascada-02.webp'
      ],
      whatsappText: 'Hola CasaCuento, me interesa la piscina'
    },
    desayuno: {
      eyebrow: 'Servicio · Mañana',
      title: 'Desayuno de Cuento',
      subtitle: 'Pan recién hecho, café de la zona y frutas frescas cada mañana.',
      description: 'Cada mañana servimos un desayuno casero con productos frescos y locales: pan recién hecho, café de la zona, frutas de temporada y mermeladas artesanales. Es la forma más encantadora de empezar el día antes de salir a descubrir Mantagua.',
      features: [
        { icon: '\u{1F35E}', title: 'Pan artesanal', text: 'Pan recién hecho cada mañana, horneado en casa con recetas tradicionales.' },
        { icon: '\u{2615}', title: 'Café de la zona', text: 'Café de productores locales de la V Región, tostado suave para conservar su aroma.' },
        { icon: '\u{1F36F}', title: 'Mermeladas y frutas', text: 'Mermeladas caseras y frutas de temporada de la zona.' }
      ],
      gallery: [
        'fotos-web/galeria/desayuno.webp',
        'fotos-web/galeria/cocina-01.webp',
        'fotos-web/galeria/cocina-02.webp',
        'fotos-web/galeria/cocina-03.webp'
      ],
      whatsappText: 'Hola CasaCuento, me interesa el desayuno'
    },
    bosque: {
      eyebrow: 'Servicio · Naturaleza',
      title: 'Árboles Mágicos',
      subtitle: 'El bosque nativo de Mantagua abraza cada rincón del hostal.',
      description: 'Senderos para caminar, árboles centenarios, pájaros cantores a la mañana. Una invitación a desconectarse del ritmo de la ciudad y reconectar con lo esencial.',
      features: [
        { icon: '\u{1F332}', title: 'Bosque nativo', text: 'Árboles centenarios que forman un ecosistema protegido y silencioso.' },
        { icon: '\u{1F97E}', title: 'Senderos', text: 'Caminos peatonales señalizados para recorrer el bosque a tu ritmo.' },
        { icon: '\u{1F99C}', title: 'Avistamiento', text: 'Pájaros y fauna nativa para observar desde los miradores del hostal.' }
      ],
      gallery: [
        'fotos-web/galeria/arboles-01.webp',
        'fotos-web/galeria/arboles-02.webp',
        'fotos-web/galeria/cabana-aymar.webp',
        'fotos-web/galeria/cabana-poetadeltiempo.webp'
      ],
      whatsappText: 'Hola CasaCuento, quiero conocer el bosque'
    },
    habitaciones: {
      eyebrow: 'Servicio · Confort',
      title: 'Habitaciones de Cuento',
      subtitle: 'Suites de piedra y madera noble, equipadas para el descanso más profundo.',
      description: 'Las suites combinan piedra y madera noble. Están equipadas con ropa de cama premium, calefacción y todo lo necesario para un descanso profundo. Cada habitación tiene su propio carácter, inspirado en el bosque que las rodea.',
      features: [
        { icon: '\u{1F6CF}\u{FE0F}', title: 'Ropa de cama premium', text: 'Sábanas de algodón de alto gramaje y almohadas hipoalergénicas.' },
        { icon: '\u{1F525}', title: 'Calefacción', text: 'Calefacción central para que el invierno sea cálido y silencioso.' },
        { icon: '\u{1F319}', title: 'Privacidad', text: 'Cada suite está pensada para ofrecer silencio y descanso sin interrupciones.' }
      ],
      gallery: [
        'fotos-web/galeria/habitacion-paula.webp',
        'fotos-web/galeria/habitacion-unicornio.webp',
        'fotos-web/galeria/habitacion-bano.webp',
        'fotos-web/galeria/loft-arcaluz.webp'
      ],
      whatsappText: 'Hola CasaCuento, me interesan las habitaciones'
    },
    fuego: {
      eyebrow: 'Servicio · Calor',
      title: 'Fuego y Calor',
      subtitle: 'Chimeneas que encienden las noches y crean momentos memorables.',
      description: 'Las chimeneas son el alma de las noches en CasaCuento. Enciendes el fuego, sirves un vino, y el tiempo se detiene. Calor, conversación, estrellas a través de los ventanales. Es la experiencia que nuestros huéspedes más recuerdan.',
      features: [
        { icon: '\u{1F525}', title: 'Chimenea encendida', text: 'Leña seca y servicio de encendido incluido para todas las noches frías.' },
        { icon: '\u{1F377}', title: 'Espacios para compartir', text: 'Salones con chimenea para conversar, leer o tomar algo después de cenar.' },
        { icon: '\u{1F30C}', title: 'Cielos estrellados', text: 'En las noches despejadas, el cielo de Mantagua regala un manto de estrellas.' }
      ],
      gallery: [
        'fotos-web/galeria/chimenea.webp',
        'fotos-web/galeria/fuego-calor.webp',
        'fotos-web/galeria/suite-torreon.webp',
        'fotos-web/galeria/suite-sanfrancisco.webp'
      ],
      whatsappText: 'Hola CasaCuento, me interesan las chimeneas'
    },
    eventos: {
      eyebrow: 'Servicio · Celebración',
      title: 'Eventos de Maravillas',
      subtitle: 'Matrimonios, cumpleaños y eventos corporativos en un entorno de cuento.',
      description: 'Matrimonios, cumpleaños, aniversarios y eventos corporativos en un entorno de cuento. Coordinación personalizada con nuestro equipo para que cada celebración sea única e inolvidable. La piscina, el bosque y la chimenea crean el marco perfecto para tus momentos más importantes.',
      features: [
        { icon: '\u{1F48D}', title: 'Matrimonios', text: 'Ceremonias al aire libre con vista al bosque y la piscina como marco.' },
        { icon: '\u{1F382}', title: 'Cumpleaños', text: 'Celebraciones íntimas o grandes, con piscina privada disponible.' },
        { icon: '\u{1F4BC}', title: 'Eventos corporativos', text: 'Retiros de equipo, reuniones ejecutivas y lanzamientos en un lugar inspirador.' }
      ],
      gallery: [],
      whatsappText: 'Hola CasaCuento, quiero cotizar un evento'
    }
  };

  const initServicioModal = () => {
    const overlay = document.getElementById('servicioModalCombinada');
    if (!overlay) return;
    const closeBtn = document.getElementById('servicioModalCloseCombinada');
    const eyebrowEl = document.getElementById('servicioModalEyebrowCombinada');
    const titleEl = document.getElementById('servicioModalTitleCombinada');
    const subtitleEl = document.getElementById('servicioModalSubtitleCombinada');
    const descEl = document.getElementById('servicioModalDescriptionCombinada');
    const featuresEl = document.getElementById('servicioModalFeaturesCombinada');
    const galleryEl = document.getElementById('servicioModalGalleryCombinada');
    const ctaEl = document.getElementById('servicioModalCtaCombinada');

    document.querySelectorAll('[data-servicio]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.dataset.servicio;
        const data = SERVICIOS[key];
        if (!data) return;

        if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
        if (titleEl) titleEl.textContent = data.title;
        if (subtitleEl) subtitleEl.textContent = data.subtitle;
        if (descEl) descEl.textContent = data.description;

        if (featuresEl) {
          featuresEl.innerHTML = (data.features || []).map(f => `
            <div class="servicio-modal-feature-combinada">
              <div class="servicio-modal-feature-icon-combinada">${f.icon}</div>
              <h4 class="servicio-modal-feature-title-combinada">${f.title}</h4>
              <p class="servicio-modal-feature-text-combinada">${f.text}</p>
            </div>
          `).join('');
        }

        if (galleryEl) {
          if (data.gallery && data.gallery.length) {
            galleryEl.className = 'servicio-modal-gallery-combinada';
            galleryEl.innerHTML = data.gallery.map(src =>
              `<img src="${src}" alt="${data.title}" loading="lazy" />`
            ).join('');
          } else {
            galleryEl.className = 'servicio-modal-no-gallery-combinada';
            galleryEl.innerHTML = 'Aun no tenemos fotos para mostrar. Escribenos por WhatsApp y te enviamos ejemplos de eventos que hemos organizado.';
          }
        }

        if (ctaEl) {
          ctaEl.href = `https://wa.me/56991924089?text=${encodeURIComponent(data.whatsappText)}`;
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const close = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('active')) close(); });
  };

  // ============================================
  // REVEAL ON SCROLL
  // ============================================
  const initReveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => obs.observe(el));
  };

  // ============================================
  // SMOOTH SCROLL para anchors internos
  // ============================================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  // ============================================
  // RESERVAR button → scroll a sección
  // ============================================
  const initReservarButton = () => {
    document.querySelectorAll('[data-action="reservar"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const whatsappURL = `${WHATSAPP_BASE}?text=${encodeURIComponent('Hola CasaCuento, me gustaría reservar. ¿Pueden ayudarme con disponibilidad?')}`;
        window.open(whatsappURL, '_blank');
      });
    });
  };

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  // MODAL DE CONTACTO (Combinada)
  // ============================================
  const initContactoModalCombinada = () => {
    // IMPORTANTE: "Contacto" del menú (data-open-contacto) ahora navega a
    // contacto.html (redes sociales), NO abre este modal. Solo el botón
    // "Contactar" del header (id="contactoBtnCombinada") abre este modal
    // (es el formulario de contacto real, distinto del menú de redes).
    const btn = document.getElementById('contactoBtnCombinada');
    const modal = document.getElementById('contactoModalCombinada');
    const close = document.getElementById('contactoModalCloseCombinada');
    const form = document.getElementById('contactoFormCombinada');
    const note = document.getElementById('contactoModalNoteCombinada');

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }
    if (close && modal) {
      close.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = form.nombre.value.trim();
        const asunto = form.asunto.value.trim();
        const correo = form.correo.value.trim();
        const mensaje = form.mensaje.value.trim();
        if (!nombre || !asunto || !correo || !mensaje) {
          if (note) { note.textContent = 'Por favor completa todos los campos.'; note.style.display = 'block'; note.style.color = '#C84B2D'; }
          return;
        }
        const body = `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`;
        const mailtoUrl = `mailto:refugiocasacuento@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        if (note) { note.textContent = 'Abriendo tu cliente de correo...'; note.style.display = 'block'; note.style.color = '#2E4A3E'; }
        setTimeout(() => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
          form.reset();
        }, 1000);
      });
    }
  };


  // ============================================
  // CONSIDERACIONES (modal flotante en index + modal al reservar)
  // ============================================
  const STORAGE_KEY = 'casacuento-consideraciones-oculto';

  const initConsideraciones = () => {
    const flotante = document.getElementById('consideracionesFlotante');
    const modal = document.getElementById('consideracionesModal');
    const modalAceptar = document.getElementById('consideracionesModalAceptar');
    const modalCerrar = document.getElementById('consideracionesModalCerrar');
    const modalNomostrar = document.getElementById('consideracionesModalNomostrar');
    const cerrarFlotante = document.querySelector('[data-consideraciones-cerrar]');
    const noMostrarFlotante = document.querySelector('[data-consideraciones-nomostrar]');

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    };

    // 1. Mensaje flotante: mostrar tras 1.5s solo en el index
    const isIndex = window.location.pathname.endsWith('index.html') ||
                    window.location.pathname === '/' ||
                    window.location.pathname.endsWith('/RefugioCasaCuento/') ||
                    window.location.pathname === '';
    const isOculto = localStorage.getItem(STORAGE_KEY) === 'true';
    if (flotante && isIndex && !isOculto) {
      setTimeout(() => flotante.classList.remove('oculta'), 1500);
    }
    if (cerrarFlotante) {
      cerrarFlotante.addEventListener('click', () => {
        if (noMostrarFlotante && noMostrarFlotante.checked) {
          localStorage.setItem(STORAGE_KEY, 'true');
        }
        flotante.classList.add('oculta');
      });
    }

    // 2. Modal: handlers de cierre vinculados una sola vez
    if (modalCerrar) {
      modalCerrar.addEventListener('click', closeModal);
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // 3. Mostrar modal al enviar formulario de reserva
    const formsReserva = document.querySelectorAll('[data-alojamiento-form]');
    formsReserva.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!modal) return;
        // Si el usuario ya acepto antes, dejamos pasar al handler de WhatsApp
        if (localStorage.getItem(STORAGE_KEY) === 'true') return;
        e.preventDefault();
        e.stopImmediatePropagation();
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
        if (modalAceptar) {
          modalAceptar.onclick = () => {
            if (modalNomostrar && modalNomostrar.checked) {
              localStorage.setItem(STORAGE_KEY, 'true');
            }
            closeModal();
            form.requestSubmit();
          };
        }
      });
    });
  };

const ready = window.__includesReady || Promise.resolve();

  ready.then(() => {
    setYear();
    initMultiLangLogo();
    initHeader();
    initLangMenu();
    initConsideraciones();
    initAlojamientoForms();
    initChatbot();
    initGalleries();
    initServicioModal();
    initContactoModalCombinada();
    initReveal();
    initSmoothScroll();
    initReservarButton();
    initBookingDropdowns();
    initEstadosDisponibilidad();
  });
})();

/* === BOOKING DROPDOWN: muestra/oculta el menu de "Ver sitios de alianza" === */
const initBookingDropdowns = () => {
  document.querySelectorAll('.booking-dropdown').forEach(btn => {
    const trigger = btn.querySelector('.btn-bosque-dropdown');
    const menu = btn.querySelector('.booking-dropdown-menu');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = btn.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
  document.addEventListener('click', e => {
    document.querySelectorAll('.booking-dropdown.open').forEach(btn => {
      if (!btn.contains(e.target)) {
        btn.classList.remove('open');
        const t = btn.querySelector('.btn-bosque-dropdown');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });
};

/* === ESTADOS DE DISPONIBILIDAD: lee data/availability.json y actualiza cada card === */
const initEstadosDisponibilidad = async () => {
  const lines = document.querySelectorAll('.alojamiento-estado-line[data-espacio]');
  if (lines.length === 0) return;
  let data = { espacios: {} };
  try {
    const res = await fetch('data/availability.json', { cache: 'no-store' });
    if (res.ok) data = await res.json();
  } catch (err) {
    console.warn('No se pudo cargar availability.json:', err);
  }
  const mapa = {
    'Disponible':    { texto: 'Disponible',   clase: 'disponible' },
    'Reservado':     { texto: 'Reservado',    clase: 'reservado' },
    'Mantenimiento': { texto: 'Mantención',   clase: 'mantencion' },
  };
  lines.forEach(line => {
    const nombre = line.dataset.espacio;
    const luz = line.querySelector('[data-estado-luz]');
    const texto = line.querySelector('[data-estado-texto]');
    if (!nombre || !luz || !texto) return;
    const estadoCrudo = data.espacios && data.espacios[nombre];
    const cfg = mapa[estadoCrudo] || { texto: 'Sin información', clase: '' };
    texto.textContent = cfg.texto;
    luz.classList.remove('disponible', 'mantencion', 'reservado');
    if (cfg.clase) luz.classList.add(cfg.clase);
    line.setAttribute('data-estado', (estadoCrudo || '').toLowerCase());
  });
};
