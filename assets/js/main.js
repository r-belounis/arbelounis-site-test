/* ═══════════════════════════════════════════════════
   RENARDIER THEME — main.js
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Theme credit ───
     Console-only, deliberately not visible anywhere on the page --
     credits the theme's creator/developer, distinct from the site's
     owner/content. Every line below sits on its own background chip
     (not a bare foreground color) on purpose: %c has no way to detect
     whether the visitor's DevTools console is light- or dark-themed, so
     a foreground color tuned for one can vanish on the other -- a
     background we control removes that guesswork, same contrast either
     way. Colors are the theme's own real tokens (--accent/--accent-2/
     --accent-l/--text-2), not invented. See docs/architecture.md.

     Resists console.clear() -- overriding it to reprint right after
     clearing means the credit survives a stray/deliberate clear() call
     mid-session, not just the initial page-load print. This can NOT
     survive an actual page reload (a fresh page load is a fresh JS
     context by browser design, nothing site-side can override that) --
     a non-issue regardless, since renardierPrintCredit() already runs
     again on every single page load anyway. */
  function renardierPrintCredit() {
    console.log(
      '%c THÈME %c RENARDIER ',
      'background:#0F4A55;color:#fff;padding:5px 0 5px 11px;border-radius:4px 0 0 4px;font-weight:700;font-family:sans-serif;font-size:12px;letter-spacing:.04em;',
      'background:#176472;color:#fff;padding:5px 11px 5px 0;border-radius:0 4px 4px 0;font-weight:400;font-family:sans-serif;font-size:12px;letter-spacing:.04em;'
    );
    console.log(
      '%cConçu et développé par Reza Belounis',
      'font-family:Georgia,serif;font-size:15px;font-weight:600;background:#176472;color:#fff;padding:4px 10px;border-radius:4px;'
    );
    console.log(
      '%c→ github.com/r-belounis',
      'font-family:monospace;font-size:12px;background:#4A6468;color:#EAF3F4;padding:4px 10px;border-radius:4px;'
    );
    console.log(
      '%cPas un thème monolithique — une vraie bibliothèque de composants (esprit Flowbite), 27 blocs testés un par un',
      'font-style:italic;font-size:11px;background:#CBE8EE;color:#0F4A55;padding:4px 10px;border-radius:4px;'
    );
    console.log(
      '%c👀 Vous jetez un œil au code ? Curiosité appréciée.',
      'font-size:11px;color:#7A7A7A;'
    );
  }
  renardierPrintCredit();
  if (window.console && typeof console.clear === 'function') {
    var renardierRealClear = console.clear;
    console.clear = function () {
      renardierRealClear.apply(console, arguments);
      renardierPrintCredit();
    };
  }

  /* ─── Desktop dropdowns ───
     Hover-only by design (CSS :hover / :focus-within in main.css) -- no
     click-to-toggle JS here. Keyboard users get it via :focus-within
     (tabbing into a link inside .dd keeps it open). */

  /* ─── Mobile nav ───
     The burger IS the close control (icon swaps to ✕ via its own "open"
     class, see main.css) -- one toggle, one element. */
  var burger = document.getElementById('nav-burger');
  var mobileNav = document.getElementById('mobile-nav');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      // Kept in sync with the real open/closed state -- a screen reader
      // announces "collapsed"/"expanded" off this attribute.
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }
  function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (burger) {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }
  /* Tapping an actual link closes the panel -- matters for same-page
     anchors (e.g. a link back to "#" sections) that don't trigger a full
     navigation/reload, which would otherwise leave the menu stuck open. */
  if (mobileNav) {
    mobileNav.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ─── Mark active nav link ─── */
  var currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links a, .dd a, .mobile-nav-links a').forEach(function (link) {
    var linkPath = link.getAttribute('href') || '';
    linkPath = linkPath.replace(/\/$/, '');
    if (linkPath && currentPath === linkPath) {
      link.classList.add('active');
    }
  });

  /* ─── Smooth scroll for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Mobile submenu accordion ─── */
  document.querySelectorAll('.mobile-sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sub = this.nextElementSibling;
      var isOpen = sub ? sub.classList.toggle('open') : this.classList.toggle('open');
      if (sub) this.classList.toggle('open', isOpen);
      // Same reasoning as the burger above -- kept in sync with the real
      // expand/collapse state.
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ─── Dark mode toggle ───
     The dark-mode-toggle component only renders its button in "manuel"/
     "manuel-auto" modes, so this does nothing when the button isn't
     present. Persists the choice to localStorage under the same key
     header.hbs's own inline init script reads on the next page load. */
  var THEME_STORAGE_KEY = 'renardier-theme-dark';
  var themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme');
      var isDark =
        current === 'dark' ||
        (!current &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (e) {}
    });
  }

  /* ─── Alert system ───
     Toast API + "une seule fois par visiteur" persistence for
     src/library/components/message-alerte -- general-purpose, used by the
     contact form below and any placed Message d'alerte component. */

  /* Toast (floating, auto-dismissing) -- container lives once in
     partials/footer.hbs (#toast-container). Icons reuse the exact SVG
     inner markup partials/icon.hbs defines for the same 4 states, kept
     here as plain strings since a toast is built entirely client-side. */
  var RENARDIER_TOAST_ICONS = {
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/>',
    success: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>',
    warning:
      '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    error: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
  };
  var renardierToastCount = 0;
  function renardierCloseToast(id) {
    var el = document.getElementById(id);
    if (!el || el.classList.contains('dismissing')) return;
    el.classList.add('dismissing');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 260);
  }
  /* window-scoped so any future trigger elsewhere can call
     window.showToast(...) without its own copy of this logic. */
  window.showToast = function (type, title, msg, duration) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    duration = duration || 4000;
    var id = 'toast-' + ++renardierToastCount;
    var t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.id = id;
    t.style.setProperty('--dur', duration / 1000 + 's');
    t.innerHTML =
      '<div class="toast-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
      (RENARDIER_TOAST_ICONS[type] || RENARDIER_TOAST_ICONS.info) +
      '</svg></div>' +
      '<div class="toast-body"><div class="toast-title"></div><div class="toast-msg"></div></div>' +
      '<button class="toast-dismiss" aria-label="Fermer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="toast-progress"></div>';
    // User-supplied text set via textContent, not innerHTML above --
    // never trusted as markup.
    t.querySelector('.toast-title').textContent = title;
    t.querySelector('.toast-msg').textContent = msg;
    t.querySelector('.toast-dismiss').addEventListener('click', function () {
      renardierCloseToast(id);
    });
    container.prepend(t);
    setTimeout(function () {
      renardierCloseToast(id);
    }, duration);
  };

  /* Publii's real GDPR consent banner sits at z-index:999999 -- Message
     d'alerte's own 9999 stays well below it deliberately (the consent
     banner should always win a stacking fight). Both are bottom-anchored
     by default though, so a bottom-positioned alert can end up visually
     covered. If `.pcb` (Publii's consent-banner root, present in the DOM
     whenever GDPR is enabled) exists, tag <body> so main.css can push
     bottom-positioned alerts clear of it. See docs/architecture.md. */
  if (document.querySelector('.pcb')) {
    document.body.classList.add('has-gdpr-consent');
  }

  /* Message d'alerte's "une seule fois par visiteur" -- always rendered
     server-side, hidden here on load if this exact alert was already
     seen. alertId (or a hash of the title when blank) is the
     localStorage key. */
  function renardierSimpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return 'h' + Math.abs(hash);
  }
  document.querySelectorAll('.alert[data-alert-once="true"]').forEach(function (el) {
    var key =
      'renardier-alert-seen-' +
      (el.getAttribute('data-alert-id') ||
        renardierSimpleHash(el.getAttribute('data-alert-title') || ''));
    try {
      if (localStorage.getItem(key)) {
        el.style.display = 'none';
        return;
      }
    } catch (e) {
      /* localStorage unavailable -- always show */
    }
    var dismissBtn = el.querySelector('.alert-dismiss');
    var markSeen = function () {
      try {
        localStorage.setItem(key, '1');
      } catch (e) {}
    };
    if (dismissBtn) dismissBtn.addEventListener('click', markSeen);
    // Also marked seen on page unload, not only an explicit dismiss click
    // -- "seen once" means "shown once", not "actively closed".
    window.addEventListener('beforeunload', markSeen, { once: true });
  });
  /* Any Message d'alerte instance's dismiss button closes on click
     regardless of displayFrequency -- an exit animation first (matches
     the toast layer's .dismissing pattern), then hidden once finished. */
  document.querySelectorAll('.alert-dismiss').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var alertEl = btn.closest('.alert');
      if (!alertEl || alertEl.classList.contains('dismissing')) return;
      alertEl.classList.add('dismissing');
      setTimeout(function () {
        alertEl.style.display = 'none';
      }, 200);
    });
  });

  /* ─── Contact form: live validation + real submit paths ───
     Shared by two genuinely different forms now ("Formulaire de contact":
     prénom/nom/email/message required; the "Prendre rendez-vous" modal:
     prénom/nom/téléphone/motif required, email optional) -- required-ness
     is read from each field's own real `required` attribute per form
     instance, not a hardcoded name list, so one code path correctly
     supports both without special-casing either.
     1. Client-side validation, live on blur/input, plus a full check at
        submit time that blocks submission and shows a WARNING alert
        (incomplete, not failed).
     2. A real honeypot + timing check first (2026-09-13, plan Phase 4a) --
        a filled `botcheck` field or a too-fast submit silently shows the
        same success UI a real submission would, without ever calling
        fetch()/mailto:. Only forms that actually carry these fields are
        checked.
     3. Once valid and not flagged as a bot: a real fetch() POST when
        action="..." is set (the CTA modal's own Cloudflare Worker URL,
        Theme Settings -> Paramètres de contact -> Champs du formulaire --
        see Test-mail-cloudflare's own reference implementation for what
        the Worker does with it), Accept:application/json -- 2xx shows a
        SUCCESS alert+toast and resets the form, failure shows an ERROR
        alert+toast. No action= means the mailto: fallback, paired with an
        INFO alert+toast -- never a false "success", since a static site
        can't confirm a mailto: link was actually sent. */
  // "Formulaire de contact" (the separate, page-placeable component,
  // temporarily mailto-only) still uses these fixed field names --
  // unaffected by the CTA modal's own Phase 5.7 rework below.
  var CONTACT_FORM_VALIDATORS = {
    prenom: function (v) {
      return v.trim().length > 0;
    },
    nom: function (v) {
      return v.trim().length > 0;
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    telephone: function (v) {
      return v.trim().length > 0;
    },
    message: function (v) {
      return v.trim().length >= 20;
    },
    ctaReasonPreset: function (v) {
      return v.trim().length > 0;
    },
    // Real, per-motif conditional field (2026-09-14) -- shown/required
    // live per the selected motif's own "Précision" setting, see the
    // reason-preset change handler further down this file.
    ctaMotifPrecision: function (v) {
      return v.trim().length > 0;
    },
  };

  // The CTA modal's own field list (2026-09-14, plan Phase 5.7, second
  // revision) is now fully agnostic -- Theme Settings -> Paramètres de
  // contact -> Champs du formulaire -> "Champs", a real repeater. Field
  // *names* are purely positional (ctaField0, ctaField1…), so there's no
  // longer a fixed name to key a validator off -- each rendered field
  // instead carries its own `data-field-type` (footer.hbs), read here to
  // pick the right check. `email`/`tel` real-format checks kept, per
  // direct request, rather than dropped to a bare `text`/`textarea`
  // pair when the type/required system was generalized.
  var FIELD_TYPE_VALIDATORS = {
    text: function (v) {
      return v.trim().length > 0;
    },
    textarea: function (v) {
      return v.trim().length > 0;
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    tel: function (v) {
      return v.trim().length > 0;
    },
  };

  // Set below, inside the "Prendre RDV" modal block -- kept as a hoisted
  // `var` so the submit handler (registered first, in the forEach right
  // below) can still reach it by the time a real submit actually fires
  // (always after all of this file's synchronous top-level code has
  // already run, since the modal's own functions only run on user
  // interaction). Stays null for `form.contact-form` instances outside
  // the CTA modal (e.g. "Formulaire de contact"), which keep the plain
  // setFormAlert()+toast behavior unchanged below.
  var ctaHandleResult = null;

  document.querySelectorAll('form.contact-form').forEach(function (form) {
    // Real, robust "is this the sitewide CTA modal's own form" check
    // (2026-09-14, plan Phase 5.7b) -- since "Formulaire de contact" now
    // shares the exact same field set (ctaFormFields/ctaReasonPreset)
    // as the modal, `form.elements.ctaReasonPreset` alone can no longer
    // tell the two apart (both have it). Only the modal's own form has
    // a real #cta-result sibling to swap in -- checked structurally via
    // its real container, not a field guess.
    var isCtaModalForm = !!form.closest('#cta-modal');
    // Real `required` attribute per field present in *this* form instance
    // -- correctly differs between the two forms sharing this handler.
    var requiredFields = Array.prototype.slice
      .call(form.querySelectorAll('[required]'))
      .map(function (el) {
        return el.name;
      })
      .filter(function (name, i, arr) {
        return name && arr.indexOf(name) === i;
      });
    // The per-motif "Précisez votre demande" field (2026-09-14, real
    // request) starts without `required` in the static markup -- its
    // own motif row decides show/hide + required live (see the
    // reason-preset change handler further down this file) -- but it
    // still needs blur/input listeners wired up from page load like
    // every other field, so it's added here even though `[required]`
    // didn't catch it. `validateAll`'s own `[hidden]` guard above
    // already skips it correctly whenever the current motif doesn't
    // reveal it.
    if (form.elements.ctaMotifPrecision && requiredFields.indexOf('ctaMotifPrecision') === -1) {
      requiredFields.push('ctaMotifPrecision');
    }
    function fieldErrorEl(input) {
      var wrap = input.closest('.contact-form-group');
      return wrap ? wrap.querySelector('.field-error') : null;
    }
    function validateField(name) {
      var input = form.elements[name];
      if (!input) return true;
      // CTA modal fields (2026-09-14, plan Phase 5.7) carry their own
      // data-field-type instead of having a fixed name to look up --
      // "Formulaire de contact"'s fixed-name fields (and the CTA
      // modal's own "Motif de la demande") fall back to the by-name
      // table exactly as before.
      var fieldType = input.getAttribute && input.getAttribute('data-field-type');
      var validator = fieldType ? FIELD_TYPE_VALIDATORS[fieldType] : CONTACT_FORM_VALIDATORS[name];
      var valid = validator ? validator(input.value) : true;
      input.classList.toggle('is-error', !valid);
      input.classList.toggle('is-success', valid && input.value.trim() !== '');
      var err = fieldErrorEl(input);
      if (err) err.hidden = valid;
      return valid;
    }
    function validateAll() {
      var ok = true;
      requiredFields.forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        // ctaMotifPrecision's own `required` is toggled live (per
        // selected motif's own "Précision" setting), not fixed at page
        // load like every other field here -- check the CURRENT state.
        if (!input.required) return;
        // Never require a field the visitor can't currently see or fill
        // in (the per-motif précision field is hidden unless its motif
        // reveals it).
        if (input.closest('[hidden]')) return;
        if (!validateField(name)) ok = false;
      });
      return ok;
    }
    requiredFields.forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value.trim()) validateField(name);
      });
      input.addEventListener('input', function () {
        input.classList.remove('is-error', 'is-success');
        var err = fieldErrorEl(input);
        if (err) err.hidden = true;
      });
    });

    var alertWrap = form.parentElement
      ? form.parentElement.querySelector('.form-alert-wrap')
      : null;
    function setFormAlert(type, title, msg) {
      if (!alertWrap) return;
      alertWrap.innerHTML =
        '<div class="alert alert-' +
        type +
        '"><span class="alert-icon"></span>' +
        '<span class="alert-body"><span class="alert-title"></span><span class="alert-msg"></span></span></div>';
      // Icon reuses the same inline paths as the toast API -- see
      // RENARDIER_TOAST_ICONS above.
      alertWrap.querySelector('.alert-icon').innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
        (RENARDIER_TOAST_ICONS[type] || RENARDIER_TOAST_ICONS.info) +
        '</svg>';
      alertWrap.querySelector('.alert-title').textContent = title;
      alertWrap.querySelector('.alert-msg').textContent = msg;
      alertWrap.hidden = false;
      alertWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    var submitBtn = form.querySelector('.contact-form-submit');
    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.classList.toggle('is-loading', isLoading);
    }

    // Honeypot + timing check (2026-09-13, plan Phase 4a) -- silently
    // shows the exact same success UI a real submission would, without
    // ever calling fetch()/mailto: -- "the bot still gets a 200 so it
    // never learns to evade" (same philosophy already proven live in
    // Test-mail-cloudflare's own Worker). Only forms that actually carry
    // these fields are checked -- a form without them (not yet true for
    // any form in this theme, but kept defensive) is never rejected for
    // missing something it was never given.
    var MIN_HUMAN_SUBMIT_MS = 2000;
    function looksLikeBot() {
      var botcheck = form.elements.botcheck;
      if (botcheck && botcheck.value.trim() !== '') return true;
      var loadedAtField = form.elements.loadedAt;
      if (loadedAtField && loadedAtField.value) {
        var elapsed = Date.now() - Number(loadedAtField.value);
        if (!(elapsed >= MIN_HUMAN_SUBMIT_MS)) return true;
      }
      return false;
    }
    function showSilentSuccess() {
      form.reset();
      if (ctaHandleResult && isCtaModalForm) {
        ctaHandleResult('success');
        return;
      }
      setFormAlert(
        'success',
        'Message envoyé',
        'Merci, votre message a bien été reçu. Nous vous répondons sous 48 heures ouvrées.'
      );
      window.showToast('success', 'Message envoyé', 'Votre demande a bien été transmise.', 5000);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (alertWrap) alertWrap.hidden = true;
      if (!validateAll()) {
        setFormAlert(
          'warning',
          'Formulaire incomplet',
          'Veuillez remplir tous les champs obligatoires avant d’envoyer votre message.'
        );
        return;
      }
      if (looksLikeBot()) {
        showSilentSuccess();
        return;
      }

      var endpoint = form.getAttribute('action');
      var mailtoEmail = form.getAttribute('data-mailto-fallback');
      var phone = form.getAttribute('data-contact-phone') || '';

      if (endpoint) {
        setLoading(true);
        // Real bug found live (2026-09-13): the Worker's own server-side
        // timing check (defense in depth, doesn't just trust this same
        // client-side looksLikeBot() check above) needs `submittedAt` to
        // actually be present in the POSTed FormData -- it isn't a real
        // form field (only `loadedAt` is), so it has to be set here
        // explicitly. Its absence silently rejected every real
        // submission as "too fast" (null fails closed), even though
        // looksLikeBot() itself had already correctly passed it.
        var postData = new FormData(form);
        postData.set('submittedAt', String(Date.now()));
        // Real bug found live (2026-09-13): the CTA modal's own
        // motif dropdown posts its raw <option> VALUE (a plain
        // numeric index into ctaReasonPresets, e.g. "0") -- fine for
        // this file's own JS logic, but meaningless in the actual
        // email a real person reads. The mailto path already resolves
        // this to the option's real display text; do the same here so
        // both delivery paths show a real motif, not a bare index.
        if (form.elements.ctaReasonPreset) {
          var reasonSelect = form.elements.ctaReasonPreset;
          if (reasonSelect.selectedIndex >= 0) {
            var selectedOpt = reasonSelect.options[reasonSelect.selectedIndex];
            postData.set('ctaReasonPreset', selectedOpt.text);
          }
        }
        var fetchOptions = {
          method: 'POST',
          body: postData,
          headers: { Accept: 'application/json' },
        };
        fetch(endpoint, fetchOptions)
          .then(function (res) {
            setLoading(false);
            if (res.ok) {
              if (ctaHandleResult && isCtaModalForm) {
                ctaHandleResult('success');
              } else {
                setFormAlert(
                  'success',
                  'Message envoyé',
                  'Merci, votre message a bien été reçu. Nous vous répondons sous 48 heures ouvrées.'
                );
                window.showToast(
                  'success',
                  'Message envoyé',
                  'Votre demande a bien été transmise.',
                  5000
                );
              }
              form.reset();
              requiredFields.forEach(function (name) {
                var input = form.elements[name];
                if (input) input.classList.remove('is-error', 'is-success');
              });
            } else if (ctaHandleResult && isCtaModalForm) {
              ctaHandleResult('error');
            } else {
              setFormAlert(
                'error',
                'Erreur d’envoi',
                'Une erreur technique est survenue. Veuillez réessayer' +
                  (phone ? ' ou nous contacter directement par téléphone au ' + phone : '') +
                  '.'
              );
              window.showToast(
                'error',
                'Erreur d’envoi',
                'Impossible d’envoyer le formulaire.',
                5000
              );
            }
          })
          .catch(function () {
            setLoading(false);
            if (ctaHandleResult && isCtaModalForm) {
              ctaHandleResult('error');
              return;
            }
            setFormAlert(
              'error',
              'Erreur d’envoi',
              'Une erreur technique est survenue. Veuillez réessayer' +
                (phone ? ' ou nous contacter directement par téléphone au ' + phone : '') +
                '.'
            );
            window.showToast(
              'error',
              'Erreur d’envoi',
              'Impossible d’envoyer le formulaire.',
              5000
            );
          });
        return;
      }

      if (mailtoEmail) {
        // Two genuinely different questions (2026-09-14, plan Phase
        // 5.7b): does THIS form have a #cta-result screen to swap in
        // (isCtaModalForm, only the sitewide modal) vs. does it use the
        // structured ctaField{n}/Motif composer instead of a free-text
        // "message" field (hasStructuredFields -- true for both forms
        // now that "Formulaire de contact" shares the same field set).
        var hasStructuredFields = !!form.elements.ctaReasonPreset;
        if (ctaHandleResult && isCtaModalForm) {
          // Real, honest distinction (2026-09-11, client-found): a
          // mailto: link is fire-and-forget -- the browser hands off to
          // whatever the OS has registered (or nothing, if no mail
          // client exists) and gives JS zero signal back, ever. Never
          // 'success' here -- there is no way to confirm the visitor's
          // mail client even opened, let alone that they hit send.
          ctaHandleResult('info');
        } else {
          setFormAlert(
            'info',
            'Ouverture de votre messagerie',
            'Votre logiciel de messagerie va s’ouvrir avec votre message pré-rempli.'
          );
          window.showToast(
            'info',
            'Ouverture de votre messagerie',
            'Complétez l’envoi depuis votre messagerie.',
            5000
          );
        }
        var get = function (fieldName) {
          var el = form.elements[fieldName];
          return el ? el.value.trim() : '';
        };
        var subject, body;
        if (hasStructuredFields) {
          // The "Prendre rendez-vous" modal -- no free-text message field,
          // composes from the agnostic ctaField{n}/ctaFieldLabel{n} pairs
          // (2026-09-14, plan Phase 5.7, second revision) plus Motif,
          // which stays its own separate mechanism. Nothing here is a
          // fixed field name anymore -- whatever the client configured in
          // Theme Settings -> Champs du formulaire is exactly what shows
          // up, in the order they configured it.
          var presetSelect = form.elements.ctaReasonPreset;
          var reason =
            presetSelect && presetSelect.selectedIndex >= 0
              ? presetSelect.options[presetSelect.selectedIndex].text
              : '';
          subject = 'Prise de rendez-vous' + (reason ? ' (' + reason + ')' : '');
          var lines = [];
          for (var fi = 0; form.elements['ctaField' + fi]; fi += 1) {
            var fieldValue = get('ctaField' + fi);
            if (!fieldValue) continue;
            var fieldLabel = get('ctaFieldLabel' + fi) || 'Champ';
            lines.push(fieldLabel + ' : ' + fieldValue);
          }
          if (reason) lines.push('Motif : ' + reason);
          // Real, per-motif conditional field (2026-09-14) -- only ever
          // has a value when the selected motif's own "Précision"
          // setting revealed it.
          var motifPrecision = get('ctaMotifPrecision');
          if (motifPrecision)
            lines.push('Précisez votre demande de rendez-vous : ' + motifPrecision);
          body = lines.join('\n');
        } else {
          subject = 'Message de ' + (get('prenom') + ' ' + get('nom')).trim();
          var replyTo = get('email');
          body = get('message') + (replyTo ? '\n\n(Répondre à : ' + replyTo + ')' : '');
        }
        window.location.href =
          'mailto:' +
          mailtoEmail +
          '?subject=' +
          encodeURIComponent(subject) +
          '&body=' +
          encodeURIComponent(body);
      }
    });
  });

  /* ─── "Prendre RDV" modal (client-requested "modal" CTA option) ───
     Opens/closes the one shared #cta-modal (partials/footer.hbs) -- the
     form INSIDE it is a plain form.contact-form, already fully handled by
     the contact-form block above (validation, fetch()-or-mailto submit)
     with zero extra code here. This block only owns the overlay itself:
     open/close, Escape, backdrop click, and a real (if simple) focus trap
     -- a booking modal is exactly the kind of thing a keyboard/screen-
     reader user must not get stuck behind or lose their place around. */
  var ctaModal = document.getElementById('cta-modal');
  if (ctaModal) {
    var ctaModalPanel = ctaModal.querySelector('.cta-modal-panel');
    var ctaModalOpener = null; // focus returns here on close
    var ctaModalForm = ctaModalPanel.querySelector('form.contact-form');
    var ctaResultEl = document.getElementById('cta-result');
    var ctaResultText = ctaResultEl ? ctaResultEl.querySelector('.cta-result-text') : null;
    var ctaResultPhoneWrap = ctaResultEl ? ctaResultEl.querySelector('.cta-result-phone') : null;
    var ctaResultPhoneLink = ctaResultPhoneWrap
      ? ctaResultPhoneWrap.querySelector('.cta-result-phone-link')
      : null;
    var ctaResultRetryBtn = ctaResultEl ? ctaResultEl.querySelector('.cta-result-retry') : null;
    var ctaModalSeparator = ctaModalPanel.querySelector('.cta-modal-separator');
    var ctaModalCall = ctaModalPanel.querySelector('.cta-modal-call');
    var ctaModalAlertWrap = ctaModalPanel.querySelector('.form-alert-wrap');

    function ctaModalFocusable() {
      return Array.prototype.slice.call(
        ctaModalPanel.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
        )
      );
    }

    /* Three real outcomes, not two (2026-09-11, client-found): a real
       HTTP 2xx from a configured provider is a genuinely confirmed fact
       ('success')/failure ('error') -- but the no-provider mailto:
       fallback can NEVER be confirmed one way or the other (fire-and-
       forget hand-off to the OS, zero signal back to this page, ever),
       so it gets its own honest third outcome ('info': "about to send,
       not confirmed sent") instead of a false 'success'. */
    var CTA_RESULT_COPY = {
      success: {
        attr: 'successMsg',
        fallback: 'Merci, nous vous recontacterons bientôt.',
        toastType: 'success',
        toastTitle: 'Message envoyé',
      },
      error: {
        attr: 'errorMsg',
        fallback: 'Une erreur est survenue. Merci de réessayer.',
        toastType: 'error',
        toastTitle: 'Erreur d’envoi',
      },
      info: {
        attr: 'pendingMsg',
        fallback:
          'Votre logiciel de messagerie va s’ouvrir avec votre message pré-rempli. Pensez à cliquer sur « Envoyer » pour finaliser votre demande.',
        toastType: 'info',
        toastTitle: 'Ouverture de votre messagerie',
      },
    };

    /* Shows the result screen in place of the form (3 of the 4
       "Confirmation" display modes -- icon / color / text, Theme
       Settings -> Paramètres de contact -> Confirmation) or, for the
       4th mode ("toast"), closes the modal and fires the existing
       sitewide toast instead. Assigned to the hoisted `ctaHandleResult`
       var (declared above the contact-form forEach) so the submit
       handler -- registered earlier in this file, before this block
       runs -- can still call it: this assignment always runs before any
       real submit event fires. */
    ctaHandleResult = function (type) {
      var copy = CTA_RESULT_COPY[type] || CTA_RESULT_COPY.error;
      var mode = (ctaResultEl && ctaResultEl.dataset.confirmMode) || 'icon';
      var msg = (ctaResultEl && ctaResultEl.dataset[copy.attr]) || copy.fallback;

      if (mode === 'toast' || !ctaResultEl) {
        closeCtaModal();
        window.showToast(copy.toastType, copy.toastTitle, msg, 5000);
        return;
      }

      ctaResultEl.classList.remove('cta-result--icon', 'cta-result--color', 'cta-result--text');
      ctaResultEl.classList.add('cta-result--' + mode);
      ctaResultEl.classList.remove('is-success', 'is-error', 'is-info');
      ctaResultEl.classList.add('is-' + type);
      if (ctaResultText) ctaResultText.textContent = msg;

      var phone = ctaResultEl.dataset.phone || '';
      var showPhone = type === 'error' && ctaResultEl.dataset.showPhoneOnError === 'true' && phone;
      if (ctaResultPhoneWrap) {
        ctaResultPhoneWrap.hidden = !showPhone;
        if (showPhone && ctaResultPhoneLink) {
          ctaResultPhoneLink.setAttribute('href', 'tel:' + phone);
          var span = ctaResultPhoneLink.querySelector('span');
          if (span) span.textContent = phone;
        }
      }
      // "Réessayer" only ever makes sense after a real failure -- 'info'
      // is not a failure, just an unconfirmed hand-off, so it gets the
      // same "Fermer"-only treatment as 'success'.
      if (ctaResultRetryBtn) ctaResultRetryBtn.hidden = type !== 'error';

      if (ctaModalForm) ctaModalForm.hidden = true;
      if (ctaModalSeparator) ctaModalSeparator.hidden = true;
      if (ctaModalCall) ctaModalCall.hidden = true;
      if (ctaModalAlertWrap) ctaModalAlertWrap.hidden = true;
      ctaResultEl.hidden = false;
      ctaResultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    /* Back to the form view -- used by the "Réessayer" button, and on
       every modal open so a past success/error screen never lingers
       into the next visit. */
    function ctaResetResultView() {
      if (ctaResultEl) ctaResultEl.hidden = true;
      if (ctaModalForm) ctaModalForm.hidden = false;
      if (ctaModalSeparator) ctaModalSeparator.hidden = false;
      if (ctaModalCall) ctaModalCall.hidden = false;
      // Real bug found live (2026-09-14): a Turnstile token is single-use
      // -- after one failed/errored submit, "Réessayer" showed the form
      // again with the widget still visually "checked", but that same
      // already-consumed token got resubmitted on the next attempt,
      // which Cloudflare correctly rejects (403, captcha_failed) even
      // though nothing looks wrong to the visitor. `turnstile.reset()`
      // issues a fresh challenge/token for the same widget; safe to call
      // even when no widget is on this form (ctaMode "mailto"/"telephone")
      // or the script hasn't loaded yet.
      var turnstileEl = ctaModalForm ? ctaModalForm.querySelector('.cf-turnstile') : null;
      if (turnstileEl && window.turnstile && typeof window.turnstile.reset === 'function') {
        window.turnstile.reset(turnstileEl);
      }
    }
    if (ctaResultRetryBtn) ctaResultRetryBtn.addEventListener('click', ctaResetResultView);

    function openCtaModal(opener) {
      ctaModalOpener = opener || null;
      ctaResetResultView();
      ctaModal.hidden = false;
      document.body.style.overflow = 'hidden';
      // Timing check's real reference point (2026-09-13, plan Phase 4a) --
      // recorded on every genuine open, not once at page load, so
      // re-opening the modal doesn't unfairly count time the modal spent
      // closed as "time filling the form".
      var loadedAtField = ctaModalForm ? ctaModalForm.elements.loadedAt : null;
      if (loadedAtField) loadedAtField.value = String(Date.now());
      var focusable = ctaModalFocusable();
      if (focusable[0]) focusable[0].focus();
    }

    function closeCtaModal() {
      ctaModal.hidden = true;
      document.body.style.overflow = '';
      if (ctaModalOpener) ctaModalOpener.focus();
    }

    /* Real mobile call-bypass (Theme Settings -> Paramètres de contact ->
       Déclenchement -> "Sur mobile, appeler directement..."): when the
       button that was clicked carries data-mobile-tel (appel-action/hero/
       menu templates), and the viewport genuinely is mobile right now
       (same breakpoint this theme already uses everywhere else for
       "what counts as mobile" -- one source of truth, not a second one),
       navigate to tel: instead of opening the modal at all. Desktop is
       never affected regardless of this toggle. */
    var CTA_MOBILE_BREAKPOINT = '(max-width: 900px)';

    // Delegated on `document` (not a static NodeList snapshot) -- opens
    // for ANY current or future element with this data attribute, from
    // one listener, regardless of how many "Prendre RDV" buttons this
    // page actually rendered (topbar/menu/contact-bar/Hero can each have
    // their own).
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-modal="cta-modal"]');
      if (opener) {
        e.preventDefault();
        var mobileTel = opener.getAttribute('data-mobile-tel');
        if (mobileTel && window.matchMedia(CTA_MOBILE_BREAKPOINT).matches) {
          window.location.href = 'tel:' + mobileTel;
          return;
        }
        openCtaModal(opener);
        return;
      }
      if (e.target.closest('[data-close-modal]')) {
        closeCtaModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (ctaModal.hidden) return;
      if (e.key === 'Escape') {
        closeCtaModal();
        return;
      }
      // Real focus trap: Tab past the last focusable element wraps to the
      // first (and vice-versa with Shift+Tab) -- keeps a keyboard user
      // from tabbing out into the page hidden behind the overlay.
      if (e.key === 'Tab') {
        var focusable = ctaModalFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ─── "Motif de la demande" -> per-motif "Précisez votre demande" ───
     Real, per-motif conditional field (2026-09-14) -- each motif's own
     "Précision" setting (Theme Settings -> Motifs de la demande,
     rendered as `data-precision` on the selected <option>: "off"/"opt"/
     "req") decides whether `#cta-motif-precision-group` shows at all,
     and whether it's required. Fixed label this time (no per-motif
     custom text like the old, Phase 5.7-removed design) -- simpler,
     genuinely just show/hide + required, nothing else to keep in sync.
     `.cta-motif-precision[hidden]` (_contact-form.scss) is what makes
     the `hidden` attribute set here actually take effect -- same
     specificity fix this project has needed several times before. */
  document.querySelectorAll('select[name="ctaReasonPreset"]').forEach(function (select) {
    var form = select.closest('form');
    if (!form) return;
    var group = form.querySelector('#cta-motif-precision-group');
    var field = form.querySelector('#cta-motif-precision');
    if (!group || !field) return;
    function updateVisibility() {
      var opt = select.options[select.selectedIndex];
      var precision = opt ? opt.getAttribute('data-precision') : 'off';
      var visible = precision === 'opt' || precision === 'req';
      group.hidden = !visible;
      field.required = precision === 'req';
      if (!visible) field.value = '';
    }
    select.addEventListener('change', updateVisibility);
    updateVisibility();
  });

  /* ─── Diaporama d'images (image-slider component) ───
     The HTML/CSS alone already gives a real, swipeable slider (CSS
     scroll-snap on .image-slider-track) with zero JS -- this block only
     adds the real prev/next arrows, the dot indicators (built from
     however many slides actually rendered on this particular row, not a
     fixed 8), and optional autoplay, same "guarded block in the one
     shared main.js" pattern as every other interactive component here. */
  document.querySelectorAll('.image-slider').forEach(function (slider) {
    var track = slider.querySelector('.image-slider-track');
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.image-slider-slide'));
    if (!track || slides.length < 2) return; // one slide (or none): no nav needed

    var dotsWrap = slider.querySelector('.image-slider-dots');
    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'image-slider-dot';
      dot.setAttribute('aria-label', 'Aller à l’image ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    var current = 0;
    function setActiveDot(index) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('image-slider-dot--active', i === index);
      });
    }
    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides[current].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setActiveDot(current);
    }
    setActiveDot(0);

    var prevBtn = slider.querySelector('.image-slider-prev');
    var nextBtn = slider.querySelector('.image-slider-next');
    if (prevBtn)
      prevBtn.addEventListener('click', function () {
        goTo(current - 1);
      });
    if (nextBtn)
      nextBtn.addEventListener('click', function () {
        goTo(current + 1);
      });

    // A real manual swipe/scroll (not one of our own goTo() calls) should
    // still update which dot is active -- approximate "which slide is
    // this" from scrollLeft rather than tracking scroll events per pixel.
    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var index = Math.round(track.scrollLeft / track.clientWidth);
        current = Math.max(0, Math.min(slides.length - 1, index));
        setActiveDot(current);
      }, 100);
    });

    if (slider.getAttribute('data-autoplay') === 'true') {
      var interval = parseInt(slider.getAttribute('data-interval'), 10) || 5000;
      var timer = setInterval(function () {
        goTo(current + 1);
      }, interval);
      // A real visitor interacting with the slider should stop autoplay,
      // not fight it on the next tick.
      ['pointerdown', 'keydown'].forEach(function (evt) {
        slider.addEventListener(
          evt,
          function () {
            clearInterval(timer);
          },
          { once: true }
        );
      });
    }
  });
})();
