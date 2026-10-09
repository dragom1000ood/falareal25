/* ============================================================
   Falaut — pwa.js  (v13.1.0)
   ------------------------------------------------------------
   Um arquivo só, com tudo que é PWA do lado do navegador:

     1. registra o service worker
     2. aviso "nova versão disponível" com botão Atualizar
     3. botão de instalar no Android/Chrome (beforeinstallprompt)
     4. dica de instalar no iPhone (o iOS não tem prompt nativo)
     5. aviso de "você está offline" / "de volta online"
     6. botão "Baixar app" no menu do topo + mini tutorial de instalação

   Não depende de nada e não toca no resto do site.
   ============================================================ */
(function () {
  'use strict';

  var C = {
    green: '#0F2E1D',
    gold:  '#C9A227',
    cream: '#EDE6D6',
    brick: '#B33A2E'
  };

  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var isStandalone =
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;

  /* ---------- toast genérico ---------- */
  function toast(opts) {
    var el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.style.cssText = [
      'position:fixed', 'left:12px', 'right:12px',
      'bottom:calc(12px + env(safe-area-inset-bottom,0px))',
      'z-index:99999', 'max-width:520px', 'margin:0 auto',
      'background:' + C.green, 'border:1px solid ' + C.gold,
      'border-radius:16px', 'padding:14px 16px', 'color:' + C.cream,
      'font-family:Poppins,system-ui,-apple-system,sans-serif',
      'font-size:14px', 'line-height:1.45',
      'box-shadow:0 10px 30px rgba(0,0,0,.4)',
      'display:flex', 'gap:12px', 'align-items:center',
      'transform:translateY(140%)', 'opacity:0',
      'transition:transform .35s cubic-bezier(.2,.8,.2,1),opacity .35s'
    ].join(';');

    var txt = document.createElement('div');
    txt.style.cssText = 'flex:1';
    txt.innerHTML = opts.html;
    el.appendChild(txt);

    if (opts.actionLabel) {
      var btn = document.createElement('button');
      btn.textContent = opts.actionLabel;
      btn.style.cssText = [
        'background:' + C.gold, 'color:' + C.green, 'border:0',
        'border-radius:999px', 'padding:9px 16px', 'font-weight:700',
        'font-family:inherit', 'font-size:13px', 'cursor:pointer',
        'white-space:nowrap'
      ].join(';');
      btn.onclick = function () { opts.onAction && opts.onAction(close); };
      el.appendChild(btn);
    }

    if (opts.dismissible !== false) {
      var x = document.createElement('button');
      x.setAttribute('aria-label', 'Fechar');
      x.innerHTML = '&times;';
      x.style.cssText =
        'background:none;border:0;color:' + C.gold +
        ';font-size:22px;line-height:1;cursor:pointer;padding:0 2px';
      x.onclick = function () {
        opts.onDismiss && opts.onDismiss();
        close();
      };
      el.appendChild(x);
    }

    function close() {
      el.style.transform = 'translateY(140%)';
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 400);
    }

    document.body.appendChild(el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    });

    if (opts.autoCloseMs) setTimeout(close, opts.autoCloseMs);
    return close;
  }

  /* ---------- 1 + 2. service worker e atualização ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function (reg) {

        function promptUpdate(worker) {
          toast({
            html: '<strong style="color:' + C.gold + '">Nova versão disponível.</strong><br>' +
                  'Atualize para pegar as novidades.',
            actionLabel: 'Atualizar',
            onAction: function () {
              worker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }

        // já tem uma versão nova esperando?
        if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg.waiting);

        // uma versão nova chegou durante esta sessão
        reg.addEventListener('updatefound', function () {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', function () {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              promptUpdate(nw);
            }
          });
        });

        // procura update quando o app volta pro primeiro plano
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'visible') reg.update();
        });
      }).catch(function (e) {
        console.warn('[PWA] service worker não registrado:', e);
      });

      // recarrega uma única vez quando o SW novo assume
      var reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (reloading) return;
        reloading = true;
        window.location.reload();
      });
    });
  }

  /* ---------- 6. botão "Baixar app" no menu do topo + mini tutorial ---------- */
  /* v13.1.0: o botão saiu do canto (onde cobria o logo) e foi pro menu,
     ao lado de "Quero testar". Clicar nele abre um tutorial passo a passo,
     já no aparelho certo (iPhone / Android / computador), no idioma do site. */

  var isAndroid = /Android/i.test(navigator.userAgent);
  var isIOSSafari = isIOS && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(navigator.userAgent);
  var deferredPrompt = null;

  var T = {
    pt: {
      btn: 'Baixar app', aria: 'Baixar o app Falaut',
      title: 'Como baixar o app Falaut',
      sub: 'É grátis, não precisa de loja de aplicativos e leva 30 segundos. O app fica na sua tela de início, igual aos outros.',
      tabs: { ios: 'iPhone', android: 'Android', desktop: 'Computador' },
      installNow: 'Instalar agora', orManual: 'Se o botão não funcionar, faça assim:',
      iosOther: 'Se não aparecer a opção, abra este site no <b>Safari</b> (a bússola azul) e repita.',
      ios: [
        ['share', 'Toque no botão <b>Compartilhar</b>', 'É o quadrado com uma seta pra cima. Fica embaixo da tela (ou em cima, no iPad).'],
        ['plus', 'Role e toque em <b>Adicionar à Tela de Início</b>', 'Se não estiver na lista, role pra baixo ou toque em "Editar ações".'],
        ['check', 'Toque em <b>Adicionar</b>', 'Pronto! O ícone do Falaut aparece na sua tela de início.']
      ],
      android: [
        ['dots', 'Toque nos <b>3 pontinhos ⋮</b>', 'Ficam no canto de cima, à direita, no Chrome.'],
        ['plus', 'Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>', 'O nome muda um pouco de celular pra celular.'],
        ['check', 'Confirme em <b>Instalar</b>', 'Pronto! O Falaut aparece junto dos seus apps.']
      ],
      desktop: [
        ['monitor', 'Use o <b>Chrome</b> ou o <b>Edge</b>', 'No Safari do Mac: menu Arquivo → "Adicionar ao Dock".'],
        ['dl', 'Clique no ícone de <b>instalar</b> na barra de endereço', 'Um monitor com uma setinha, à direita do endereço do site. Ou: menu ⋮ → "Instalar Falaut".'],
        ['check', 'Clique em <b>Instalar</b>', 'O Falaut abre numa janela própria, como um programa.']
      ],
      done: 'Entendi', close: 'Fechar'
    },
    en: {
      btn: 'Get the app', aria: 'Download the Falaut app',
      title: 'How to get the Falaut app',
      sub: 'Free, no app store needed, takes 30 seconds. The app sits on your home screen like any other.',
      tabs: { ios: 'iPhone', android: 'Android', desktop: 'Computer' },
      installNow: 'Install now', orManual: "If the button doesn't work, do this:",
      iosOther: "If you don't see the option, open this site in <b>Safari</b> (the blue compass) and try again.",
      ios: [
        ['share', 'Tap the <b>Share</b> button', 'The square with an arrow pointing up. At the bottom of the screen (top on iPad).'],
        ['plus', 'Scroll and tap <b>Add to Home Screen</b>', 'Not in the list? Scroll down or tap "Edit Actions".'],
        ['check', 'Tap <b>Add</b>', 'Done! The Falaut icon is now on your home screen.']
      ],
      android: [
        ['dots', 'Tap the <b>3 dots ⋮</b>', 'Top right corner in Chrome.'],
        ['plus', 'Tap <b>Install app</b> or <b>Add to Home screen</b>', 'The wording varies a little between phones.'],
        ['check', 'Confirm with <b>Install</b>', 'Done! Falaut shows up with your other apps.']
      ],
      desktop: [
        ['monitor', 'Use <b>Chrome</b> or <b>Edge</b>', 'On Mac Safari: File menu → "Add to Dock".'],
        ['dl', 'Click the <b>install</b> icon in the address bar', 'A small monitor with an arrow, right of the site address. Or: menu ⋮ → "Install Falaut".'],
        ['check', 'Click <b>Install</b>', 'Falaut opens in its own window, like a program.']
      ],
      done: 'Got it', close: 'Close'
    },
    es: {
      btn: 'Descargar app', aria: 'Descargar la app Falaut',
      title: 'Cómo descargar la app Falaut',
      sub: 'Es gratis, no necesitas tienda de apps y tarda 30 segundos. La app queda en tu pantalla de inicio como cualquier otra.',
      tabs: { ios: 'iPhone', android: 'Android', desktop: 'Ordenador' },
      installNow: 'Instalar ahora', orManual: 'Si el botón no funciona, hazlo así:',
      iosOther: 'Si no aparece la opción, abre este sitio en <b>Safari</b> (la brújula azul) y repite.',
      ios: [
        ['share', 'Toca el botón <b>Compartir</b>', 'Es el cuadrado con una flecha hacia arriba. Abajo en la pantalla (arriba en iPad).'],
        ['plus', 'Desliza y toca <b>Añadir a pantalla de inicio</b>', 'Si no está, desliza hacia abajo o toca "Editar acciones".'],
        ['check', 'Toca <b>Añadir</b>', '¡Listo! El icono de Falaut aparece en tu pantalla de inicio.']
      ],
      android: [
        ['dots', 'Toca los <b>3 puntitos ⋮</b>', 'Arriba a la derecha en Chrome.'],
        ['plus', 'Toca <b>Instalar app</b> o <b>Añadir a pantalla de inicio</b>', 'El nombre cambia un poco según el móvil.'],
        ['check', 'Confirma con <b>Instalar</b>', '¡Listo! Falaut aparece junto a tus apps.']
      ],
      desktop: [
        ['monitor', 'Usa <b>Chrome</b> o <b>Edge</b>', 'En Safari de Mac: menú Archivo → "Añadir al Dock".'],
        ['dl', 'Haz clic en el icono de <b>instalar</b> en la barra de direcciones', 'Un monitor con una flechita, a la derecha de la dirección. O: menú ⋮ → "Instalar Falaut".'],
        ['check', 'Haz clic en <b>Instalar</b>', 'Falaut se abre en su propia ventana, como un programa.']
      ],
      done: 'Entendido', close: 'Cerrar'
    },
    de: {
      btn: 'App laden', aria: 'Falaut-App herunterladen',
      title: 'So holst du dir die Falaut-App',
      sub: 'Kostenlos, ohne App Store, dauert 30 Sekunden. Die App liegt dann auf deinem Startbildschirm wie jede andere.',
      tabs: { ios: 'iPhone', android: 'Android', desktop: 'Computer' },
      installNow: 'Jetzt installieren', orManual: 'Falls der Button nicht klappt, so geht’s:',
      iosOther: 'Siehst du die Option nicht? Öffne die Seite in <b>Safari</b> (der blaue Kompass) und versuch es nochmal.',
      ios: [
        ['share', 'Tippe auf <b>Teilen</b>', 'Das Quadrat mit dem Pfeil nach oben. Unten am Bildschirm (oben auf dem iPad).'],
        ['plus', 'Scrolle und tippe auf <b>Zum Home-Bildschirm</b>', 'Nicht in der Liste? Weiter runterscrollen oder „Aktionen bearbeiten“.'],
        ['check', 'Tippe auf <b>Hinzufügen</b>', 'Fertig! Das Falaut-Symbol ist jetzt auf deinem Startbildschirm.']
      ],
      android: [
        ['dots', 'Tippe auf die <b>3 Punkte ⋮</b>', 'Oben rechts in Chrome.'],
        ['plus', 'Tippe auf <b>App installieren</b> oder <b>Zum Startbildschirm hinzufügen</b>', 'Der Name ist je nach Handy etwas anders.'],
        ['check', 'Mit <b>Installieren</b> bestätigen', 'Fertig! Falaut erscheint bei deinen Apps.']
      ],
      desktop: [
        ['monitor', 'Nimm <b>Chrome</b> oder <b>Edge</b>', 'Safari auf dem Mac: Menü Ablage → „Zum Dock hinzufügen“.'],
        ['dl', 'Klick auf das <b>Installieren</b>-Symbol in der Adressleiste', 'Ein kleiner Monitor mit Pfeil, rechts neben der Adresse. Oder: Menü ⋮ → „Falaut installieren“.'],
        ['check', 'Klick auf <b>Installieren</b>', 'Falaut öffnet sich in einem eigenen Fenster, wie ein Programm.']
      ],
      done: 'Alles klar', close: 'Schließen'
    }
  };
  function lang() {
    var l = 'pt';
    try { l = localStorage.getItem('falareal_site_lang') || 'pt'; } catch (e) {}
    return T[l] ? l : 'pt';
  }
  function tr() { return T[lang()]; }

  var ICONS = {
    share: '<path d="M12 3v11M8 7l4-4 4 4" /><path d="M6 11v8a2 2 0 002 2h8a2 2 0 002-2v-8"/>',
    plus: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
    dots: '<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
    dl: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 7v6M9.5 10.5L12 13l2.5-2.5"/><path d="M9 20h6M12 16v4"/>'
  };
  function icon(name, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  /* estilos do botão e do tutorial — usam as variáveis do site */
  var css = document.createElement('style');
  css.textContent = [
    '.fl-install-btn{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono,monospace);font-size:.8rem;letter-spacing:.02em;',
      'background:transparent;color:var(--amber,#f0a63a);border:1px solid var(--amber,#f0a63a);padding:8px 15px;border-radius:100px;cursor:pointer;',
      'transition:background .15s ease,color .15s ease,transform .15s ease;white-space:nowrap}',
    '.fl-install-btn:hover{background:var(--amber,#f0a63a);color:var(--ink,#12181f);transform:translateY(-1px)}',
    '.fl-install-btn.fl-floating{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:12px;z-index:99998}',
    '@media (max-width:640px){.fl-install-btn{padding:7px 11px;font-size:.74rem}}',
    '.fl-install-btn .fl-short{display:none}.fl-install-btn svg{flex:none}',
    '@media (max-width:340px){.fl-install-btn .fl-short{display:none!important}.fl-install-btn{padding:6px 7px!important}nav .nav-right{gap:4px!important}.lang-toggle button{padding:6px 7px!important}}',
    '@media (max-width:640px){.fl-install-btn .fl-lbl{display:none}.fl-install-btn .fl-short{display:inline}.fl-install-btn{padding:7px 9px;gap:4px}}',
    '.fl-ov{position:fixed;inset:0;z-index:100000;background:rgba(10,14,18,.78);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;',
      'opacity:0;transition:opacity .25s ease}',
    '.fl-ov.on{opacity:1}',
    '@media (min-width:641px){.fl-ov{align-items:center}}',
    '.fl-sheet{background:var(--ink-soft,#1c2530);color:var(--paper,#f4efe6);border:1px solid var(--line,rgba(244,239,230,.14));width:100%;max-width:460px;',
      'max-height:92vh;overflow:auto;border-radius:22px 22px 0 0;padding:22px 20px calc(20px + env(safe-area-inset-bottom,0px));',
      'font-family:Poppins,system-ui,-apple-system,sans-serif;transform:translateY(30px);transition:transform .3s cubic-bezier(.2,.8,.2,1)}',
    '@media (min-width:641px){.fl-sheet{border-radius:22px;padding:26px}}',
    '.fl-ov.on .fl-sheet{transform:none}',
    '.fl-head{display:flex;align-items:flex-start;gap:12px}',
    '.fl-head h3{flex:1;margin:0;font-family:var(--display,serif);font-size:1.35rem;line-height:1.2;font-weight:600}',
    '.fl-x{background:none;border:0;color:var(--paper,#f4efe6);opacity:.6;font-size:26px;line-height:1;cursor:pointer;padding:0 4px}',
    '.fl-sub{margin:8px 0 16px;font-size:.88rem;line-height:1.5;opacity:.75}',
    '.fl-tabs{display:flex;gap:4px;background:var(--ink,#12181f);border:1px solid var(--line,rgba(244,239,230,.14));padding:4px;border-radius:100px;margin-bottom:16px}',
    '.fl-tabs button{flex:1;font-family:var(--mono,monospace);font-size:.76rem;background:transparent;border:0;color:rgba(244,239,230,.55);padding:8px 6px;border-radius:100px;cursor:pointer}',
    '.fl-tabs button.on{background:var(--amber,#f0a63a);color:var(--ink,#12181f)}',
    '.fl-now{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--amber,#f0a63a);color:var(--ink,#12181f);border:0;',
      'border-radius:14px;padding:14px;font-family:inherit;font-weight:700;font-size:1rem;cursor:pointer;margin-bottom:12px}',
    '.fl-or{font-size:.8rem;opacity:.65;margin:0 0 10px}',
    '.fl-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}',
    '.fl-step{display:flex;gap:12px;align-items:flex-start;background:var(--ink,#12181f);border:1px solid var(--line,rgba(244,239,230,.14));border-radius:14px;padding:12px}',
    '.fl-num{flex:none;width:40px;height:40px;border-radius:12px;background:rgba(240,166,58,.12);color:var(--amber,#f0a63a);display:flex;align-items:center;justify-content:center;position:relative}',
    '.fl-num i{position:absolute;top:-6px;left:-6px;width:18px;height:18px;border-radius:50%;background:var(--amber,#f0a63a);color:var(--ink,#12181f);',
      'font-style:normal;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center}',
    '.fl-step strong{display:block;font-size:.93rem;font-weight:500;line-height:1.35}',
    '.fl-step strong b{color:var(--amber,#f0a63a);font-weight:700}',
    '.fl-step span{display:block;font-size:.8rem;line-height:1.45;opacity:.65;margin-top:3px}',
    '.fl-note{font-size:.8rem;line-height:1.45;margin:12px 0 0;padding:10px 12px;border-radius:12px;background:rgba(179,58,46,.15);border:1px solid rgba(179,58,46,.35)}',
    '.fl-note b{color:var(--amber,#f0a63a)}',
    '.fl-ok{width:100%;margin-top:16px;background:transparent;color:var(--paper,#f4efe6);border:1px solid var(--line,rgba(244,239,230,.14));',
      'border-radius:14px;padding:12px;font-family:inherit;font-size:.9rem;cursor:pointer}'
  ].join('');
  document.head.appendChild(css);

  function defaultTab() {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'desktop';
  }

  var overlay = null;
  function openTutorial(tab) {
    if (overlay) closeTutorial();
    tab = tab || defaultTab();
    var t = tr();
    overlay = document.createElement('div');
    overlay.className = 'fl-ov';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', t.title);

    var steps = t[tab].map(function (s, i) {
      return '<li class="fl-step"><div class="fl-num"><i>' + (i + 1) + '</i>' + icon(s[0], 22) + '</div>' +
             '<div><strong>' + s[1] + '</strong><span>' + s[2] + '</span></div></li>';
    }).join('');

    var canPrompt = !!deferredPrompt && tab !== 'ios';
    overlay.innerHTML =
      '<div class="fl-sheet">' +
        '<div class="fl-head"><h3>' + t.title + '</h3>' +
        '<button class="fl-x" aria-label="' + t.close + '">&times;</button></div>' +
        '<p class="fl-sub">' + t.sub + '</p>' +
        '<div class="fl-tabs" role="tablist">' +
          ['ios', 'android', 'desktop'].map(function (k) {
            return '<button role="tab" data-tab="' + k + '" class="' + (k === tab ? 'on' : '') +
                   '" aria-selected="' + (k === tab) + '">' + t.tabs[k] + '</button>';
          }).join('') +
        '</div>' +
        (canPrompt ? '<button class="fl-now">' + icon('dl', 20) + t.installNow + '</button>' +
                     '<p class="fl-or">' + t.orManual + '</p>' : '') +
        '<ol class="fl-steps">' + steps + '</ol>' +
        (tab === 'ios' && isIOS && !isIOSSafari ? '<p class="fl-note">' + t.iosOther + '</p>' : '') +
        '<button class="fl-ok">' + t.done + '</button>' +
      '</div>';

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.fl-x') || e.target.closest('.fl-ok')) return closeTutorial();
      var tb = e.target.closest('[data-tab]');
      if (tb) return openTutorial(tb.getAttribute('data-tab'));
      if (e.target.closest('.fl-now') && deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () { deferredPrompt = null; closeTutorial(); });
      }
    });
    document.addEventListener('keydown', escClose);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { requestAnimationFrame(function () { overlay && overlay.classList.add('on'); }); });
    var first = overlay.querySelector('.fl-now') || overlay.querySelector('.fl-ok');
    first && first.focus({ preventScroll: true });
  }
  function escClose(e) { if (e.key === 'Escape') closeTutorial(); }
  function closeTutorial() {
    document.removeEventListener('keydown', escClose);
    if (!overlay) return;
    var o = overlay; overlay = null;
    o.classList.remove('on');
    setTimeout(function () { o.remove(); }, 250);
  }
  window.falautOpenInstallTutorial = openTutorial;

  var installBtn = null;
  function paintInstallButton() {
    if (!installBtn) return;
    var t = tr();
    installBtn.setAttribute('aria-label', t.aria);
    installBtn.title = t.aria;
    installBtn.innerHTML = icon('dl', 16) + '<span class="fl-lbl">' + t.btn + '</span><span class="fl-short">App</span>';
  }
  function showInstallButton() {
    if (isStandalone || installBtn) return;
    installBtn = document.createElement('button');
    installBtn.type = 'button';
    installBtn.id = 'fr-install-btn';
    installBtn.className = 'fl-install-btn';
    installBtn.onclick = function () { openTutorial(); };
    paintInstallButton();
    // no menu do topo, logo antes de "Quero testar"; se o menu não existir, fica fixo no canto direito
    var navRight = document.querySelector('nav .nav-right');
    if (navRight) navRight.insertBefore(installBtn, navRight.querySelector('.nav-cta'));
    else { installBtn.classList.add('fl-floating'); document.body.appendChild(installBtn); }
    // acompanha a troca de idioma do site
    var sel = document.getElementById('site-lang-select');
    sel && sel.addEventListener('change', function () { setTimeout(paintInstallButton, 0); });
  }
  function hideInstallButton() {
    if (installBtn) { installBtn.remove(); installBtn = null; }
  }

  // o botão aparece sempre (todo navegador consegue instalar de algum jeito), menos se já estiver instalado
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showInstallButton);
  else showInstallButton();

  /* ---------- 3. Android / Chrome: guarda o prompt nativo pro botão "Instalar agora" ---------- */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;

    if (localStorage.getItem('pwaInstallDismissed')) return;
    setTimeout(function () {
      if (!deferredPrompt) return;
      toast({
        html: 'Instale o <strong style="color:' + C.gold + '">Falaut</strong> ' +
              'na tela de início e estude sem abrir o navegador.',
        actionLabel: 'Instalar',
        onAction: function (close) {
          close();
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
        },
        onDismiss: function () {
          localStorage.setItem('pwaInstallDismissed', '1');
        }
      });
    }, 25000);
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    localStorage.setItem('pwaInstalled', '1');
    hideInstallButton();
    closeTutorial();
  });

  /* ---------- 4. iPhone: o iOS não tem prompt nativo, então o lembrete abre o tutorial ---------- */
  if (isIOS && !isStandalone && !localStorage.getItem('pwaInstallDismissed')) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        toast({
          html: 'Baixe o <strong style="color:' + C.gold + '">Falaut</strong> no seu iPhone. ' +
                'Leva 30 segundos.',
          actionLabel: 'Ver como',
          onAction: function (close) { close(); openTutorial('ios'); },
          onDismiss: function () { localStorage.setItem('pwaInstallDismissed', '1'); }
        });
      }, 25000);
    });
  }

  /* ---------- 5. estado da conexão ---------- */
  var offlineToastClose = null;
  window.addEventListener('offline', function () {
    if (offlineToastClose) return;
    offlineToastClose = toast({
      html: '<strong style="color:' + C.brick +
            '">Sem conexão.</strong> Você continua vendo a última versão salva.',
      dismissible: true
    });
  });
  window.addEventListener('online', function () {
    if (offlineToastClose) { offlineToastClose(); offlineToastClose = null; }
    toast({
      html: '<strong style="color:' + C.gold + '">De volta online.</strong>',
      dismissible: false,
      autoCloseMs: 2600
    });
  });

  /* ---------- extra: marca o <html> quando roda instalado ---------- */
  if (isStandalone) document.documentElement.setAttribute('data-pwa', 'standalone');
})();
