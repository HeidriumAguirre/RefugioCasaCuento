(function() {
  'use strict';

  const WHATSAPP_NUMBER = '56991924089';
  const WHATSAPP_BASE = 'https://wa.me/' + WHATSAPP_NUMBER;
  const BOOKING_URL = 'https://www.booking.com/hotel/cl/casa-cuento.es.html';
  const EXPEDIA_URL = 'https://www.expedia.com/es/Vina-Del-Mar-Hoteles-Casa-Cuento.h16264146.Informacion-Hotel';
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
    const altEn = 'Magic House Hotel Boutique - Refugio';

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
  // FONT SIZE
  // ============================================
  const initFontSize = () => {
    const STORAGE_KEY = 'casacuento-font-scale';
    const slider = document.getElementById('fontSlider');
    const minus = document.getElementById('fontBtnMinus');
    const plus = document.getElementById('fontBtnPlus');
    if (!slider) return;

    const STEP = 0.05;
    const MIN = parseFloat(slider.min);
    const MAX = parseFloat(slider.max);
    const clamp = (v) => Math.max(MIN, Math.min(MAX, Math.round(v / STEP) / STEP));

    const applyScale = (scale) => {
      const s = clamp(scale);
      slider.value = s;
      document.documentElement.style.setProperty('--font-scale', s);
      document.body.style.fontSize = (16 * s) + 'px';
      try { localStorage.setItem(STORAGE_KEY, s); } catch (e) {}
    };

    let saved = 1;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = parseFloat(raw) || 1;
    } catch (e) {}
    applyScale(saved);

    slider.addEventListener('input', () => applyScale(parseFloat(slider.value)));
    if (minus) minus.addEventListener('click', () => applyScale(parseFloat(slider.value) - STEP));
    if (plus) plus.addEventListener('click', () => applyScale(parseFloat(slider.value) + STEP));
  };

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
  const initEncantosModals = () => {
    const overlay = document.getElementById('encantoModal');
    if (!overlay) return;
    const closeBtn = document.getElementById('encantoModalClose');
    const titleEl = document.getElementById('encantoModalTitle');
    const textEl = document.getElementById('encantoModalText');
    const galleryEl = document.getElementById('encantoModalGallery');

    document.querySelectorAll('[data-encanto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nombre = btn.dataset.encantoNombre || '';
        const texto = btn.dataset.encantoTexto || '';
        const imagenes = (btn.dataset.encantoImagenes || '').split(',').map(s => s.trim()).filter(Boolean);
        if (titleEl) titleEl.textContent = nombre;
        if (textEl) textEl.textContent = texto;
        if (galleryEl) {
          if (imagenes.length) {
            galleryEl.innerHTML = imagenes.map(src =>
              `<img src="${src}" alt="${nombre}" loading="lazy" />`
            ).join('');
            galleryEl.style.display = 'grid';
          } else {
            galleryEl.innerHTML = '';
            galleryEl.style.display = 'none';
          }
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
    const btns = [
      document.getElementById('contactoBtnCombinada'),
      ...document.querySelectorAll('[data-open-contacto]')
    ].filter(Boolean);
    const modal = document.getElementById('contactoModalCombinada');
    const close = document.getElementById('contactoModalCloseCombinada');
    const form = document.getElementById('contactoFormCombinada');
    const note = document.getElementById('contactoModalNoteCombinada');

    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
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

  const ready = window.__includesReady || Promise.resolve();

  ready.then(() => {
    setYear();
    initMultiLangLogo();
    initHeader();
    initFontSize();
    initLangMenu();
    initAlojamientoForms();
    initChatbot();
    initGalleries();
    initEncantosModals();
    initContactoModalCombinada();
    initReveal();
    initSmoothScroll();
    initReservarButton();
  });
})();
