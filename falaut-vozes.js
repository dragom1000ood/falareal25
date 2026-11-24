/* Falaut — escolha de vozes mais humanizadas (Web Speech API)
 * Uso: falar("Guten Morgen!", "de")  |  falar("Hello!", "en")  |  falar("Bom dia!", "pt")
 */
(function () {
  const IDIOMAS = { de: "de-DE", en: "en-US", pt: "pt-BR" };

  // Vozes conhecidas por soarem naturais, em ordem de preferência
  const PREFERIDAS = {
    de: ["Microsoft Katja Online (Natural)", "Microsoft Conrad Online (Natural)", "Google Deutsch", "Anna (Premium)", "Anna (Enhanced)", "Anna"],
    en: ["Microsoft Aria Online (Natural)", "Microsoft Jenny Online (Natural)", "Google US English", "Samantha (Premium)", "Samantha (Enhanced)", "Samantha"],
    pt: ["Microsoft Francisca Online (Natural)", "Microsoft Antonio Online (Natural)", "Google português do Brasil", "Luciana (Premium)", "Luciana (Enhanced)", "Luciana"]
  };

  let vozes = [];
  const cache = {};

  function carregarVozes() {
    vozes = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    for (const k in cache) delete cache[k];
  }

  // Pontua vozes genéricas quando nenhuma preferida existe no aparelho
  function pontuar(v) {
    const n = v.name;
    let p = 0;
    if (/Natural|Neural/i.test(n)) p += 50;
    if (/Premium/i.test(n)) p += 40;
    if (/Enhanced|Melhorada|Erweitert/i.test(n)) p += 30;
    if (/Online/i.test(n)) p += 20;
    if (/Google/i.test(n)) p += 15;
    if (/Siri/i.test(n)) p += 10;
    if (/compact|eSpeak/i.test(n)) p -= 40;
    if (!v.localService) p += 5;
    return p;
  }

  function escolherVoz(idioma) {
    if (cache[idioma]) return cache[idioma];
    const tag = IDIOMAS[idioma];
    const base = tag.split("-")[0];
    const doIdioma = vozes.filter(v => v.lang.replace("_", "-").toLowerCase().startsWith(base));
    if (!doIdioma.length) return null;

    for (const nome of PREFERIDAS[idioma]) {
      const achou = doIdioma.find(v => v.name === nome || v.name.startsWith(nome));
      if (achou) return (cache[idioma] = achou);
    }
    const daRegiao = doIdioma.filter(v => v.lang.replace("_", "-").toLowerCase() === tag.toLowerCase());
    const lista = daRegiao.length ? daRegiao : doIdioma;
    lista.sort((a, b) => pontuar(b) - pontuar(a));
    return (cache[idioma] = lista[0]);
  }

  function esperarVozes() {
    return new Promise(resolve => {
      carregarVozes();
      if (vozes.length) return resolve();
      speechSynthesis.addEventListener("voiceschanged", function h() {
        speechSynthesis.removeEventListener("voiceschanged", h);
        carregarVozes();
        resolve();
      });
      setTimeout(() => { carregarVozes(); resolve(); }, 1500); // Safari às vezes não dispara o evento
    });
  }

  window.falar = async function (texto, idioma = "de") {
    if (!window.speechSynthesis) return;
    await esperarVozes();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = IDIOMAS[idioma] || idioma;
    const voz = escolherVoz(idioma);
    if (voz) u.voice = voz;
    u.rate = 0.95;   // um pouco mais devagar, soa mais natural para quem aprende
    u.pitch = 1;
    speechSynthesis.speak(u);
  };

  if (window.speechSynthesis) {
    carregarVozes();
    speechSynthesis.addEventListener("voiceschanged", carregarVozes);
  }
})();
