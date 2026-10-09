/* ============================================================
   FalaReal — pwa.js  (v11.31.1)
   ------------------------------------------------------------
   Um arquivo só, com tudo que é PWA do lado do navegador:

     1. registra o service worker
     2. aviso "nova versão disponível" com botão Atualizar
     3. botão de instalar no Android/Chrome (beforeinstallprompt)
     4. dica de instalar no iPhone (o iOS não tem prompt nativo)
     5. aviso de "você está offline" / "de volta online"
     6. botão fixo "Instalar app", sempre visível, sem esperar 25s

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

  /* ---------- 6. botão fixo "Instalar app" (sempre visível) ---------- */
  var installBtn = null;
  function showInstallButton(onClick) {
    if (isStandalone) return;
    if (installBtn) { installBtn.onclick = onClick; return; }

    installBtn = document.createElement('button');
    installBtn.type = 'button';
    installBtn.id = 'fr-install-btn';
    installBtn.setAttribute('aria-label', 'Instalar o app FalaReal');
    installBtn.innerHTML =
      '<span style="display:inline-block;transform:translateY(1px)">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
      'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"/></svg></span>' +
      '<span>Instalar app</span>';
    installBtn.style.cssText = [
      'position:fixed', 'top:calc(12px + env(safe-area-inset-top,0px))',
      'left:12px', 'z-index:99998',
      'display:flex', 'align-items:center', 'gap:7px',
      'background:' + C.gold, 'color:' + C.green, 'border:0',
      'border-radius:999px', 'padding:9px 15px 9px 12px',
      'font-family:Poppins,system-ui,-apple-system,sans-serif',
      'font-weight:700', 'font-size:13px', 'cursor:pointer',
      'box-shadow:0 6px 18px rgba(0,0,0,.35)'
    ].join(';');
    installBtn.onclick = onClick;
    document.body.appendChild(installBtn);
  }
  function hideInstallButton() {
    if (installBtn) { installBtn.remove(); installBtn = null; }
  }

  /* ---------- 3. instalar no Android / Chrome ---------- */
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;

    // botão fixo aparece assim que o navegador libera a instalação
    showInstallButton(function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
    });

    if (localStorage.getItem('pwaInstallDismissed')) return;
    setTimeout(function () {
      if (!deferredPrompt) return;
      toast({
        html: 'Instale o <strong style="color:' + C.gold + '">FalaReal</strong> ' +
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
    }, 25000);   // o toast continua só depois de 25s — o botão fixo já está lá antes disso
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    localStorage.setItem('pwaInstalled', '1');
    hideInstallButton();
  });

  /* ---------- 4. dica de instalar no iPhone ---------- */
  if (isIOS && !isStandalone) {
    function iosInstallToast() {
      toast({
        html: 'Instale o <strong style="color:' + C.gold + '">FalaReal</strong> ' +
              'no seu iPhone: toque em <strong style="color:' + C.gold +
              '">Compartilhar</strong> ' +
              '<span style="display:inline-block;transform:translateY(2px)">' +
              '<svg width="13" height="16" viewBox="0 0 13 16" fill="none" ' +
              'xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
              '<path d="M6.5 1v9M3 4l3.5-3.5L10 4" stroke="' + C.gold +
              '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
              '<path d="M1.5 7.5v6a1 1 0 001 1h8a1 1 0 001-1v-6" stroke="' + C.gold +
              '" stroke-width="1.6" stroke-linecap="round"/></svg></span>' +
              ' e depois em <strong style="color:' + C.gold +
              '">Adicionar à Tela de Início</strong>.',
        onDismiss: function () {
          localStorage.setItem('pwaInstallDismissed', '1');
        }
      });
    }

    // botão fixo aparece de cara pro iPhone, sem esperar nada
    showInstallButton(iosInstallToast);

    if (!localStorage.getItem('pwaInstallDismissed')) {
      window.addEventListener('load', function () {
        setTimeout(iosInstallToast, 25000);
      });
    }
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
