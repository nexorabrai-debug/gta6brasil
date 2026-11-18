(function () {
  "use strict";

  var TARGET = new Date("2026-11-19T00:00:00-03:00");
  var NEED_GB = 212;
  var SITE = "https://nexorabrai-debug.github.io/gta6brasil/";
  var SHARE =
    "GTA 6 no Brasil: libera à 0h de 19/11 (horário de Brasília). PS5 e Xbox Series X|S, Standard R$ 449,90, até 212 GB livres. Confira se o seu console tá pronto: " +
    SITE;
  var PIX_KEY = "161.960.879-08";

  var countdown = document.getElementById("countdown");
  var ticks = document.getElementById("ticks");
  var launched = document.getElementById("launched");
  var note = document.getElementById("countdown-note");
  var els = {
    d: document.getElementById("t-d"),
    h: document.getElementById("t-h"),
    m: document.getElementById("t-m"),
    s: document.getElementById("t-s"),
  };

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function tick() {
    var now = new Date();
    var diff = TARGET.getTime() - now.getTime();
    if (diff <= 0) {
      countdown.classList.add("is-live");
      launched.textContent = "Já lançou!";
      note.textContent =
        "A versão instalada no PS5 e no Xbox Series X|S estava prevista para liberar à 0h de 19 de novembro, no horário de Brasília. No Xbox Cloud Gaming (incluindo Xbox One), a disponibilidade anunciada é a partir das 3h.";
      return;
    }
    var sec = Math.floor(diff / 1000);
    var d = Math.floor(sec / 86400);
    sec -= d * 86400;
    var h = Math.floor(sec / 3600);
    sec -= h * 3600;
    var m = Math.floor(sec / 60);
    sec -= m * 60;
    els.d.textContent = pad(d);
    els.h.textContent = pad(h);
    els.m.textContent = pad(m);
    els.s.textContent = pad(sec);
    window.setTimeout(tick, 1000);
  }

  if (countdown) tick();

  var wa = document.getElementById("share-wa");
  var x = document.getElementById("share-x");
  if (wa) {
    wa.href = "https://wa.me/?text=" + encodeURIComponent(SHARE);
  }
  if (x) {
    x.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(SHARE);
  }

  var freeEl = document.getElementById("free-gb");
  var consoleEl = document.getElementById("console");
  var resultEl = document.getElementById("calc-result");
  var tipsEl = document.getElementById("calc-tips");

  function formatGb(n) {
    if (Math.abs(n - Math.round(n)) < 0.05) return String(Math.round(n));
    return n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  }

  function tipsFor(model) {
    var tips = [
      "A Rockstar trata os 212 GB como referência para o pré-carregamento, não como um tamanho idêntico em todos os aparelhos nem como garantia do que o jogo vai ocupar depois das atualizações.",
      "A capacidade anunciada na caixa não é toda utilizável: parte fica reservada para o sistema. Confira na seção de armazenamento do console o que está realmente livre.",
    ];
    if (model.indexOf("ps5") === 0) {
      tips.push(
        "No PS5, uma opção para ampliar a capacidade é instalar um SSD M.2 compatível."
      );
    }
    if (model.indexOf("xbox") === 0) {
      tips.push(
        "No Xbox Series X|S, jogos otimizados em geral precisam do SSD interno ou de um cartão de expansão compatível para rodar. Um HD USB pode servir para guardar outros jogos e transferi-los de volta depois."
      );
    }
    if (model === "xbox-s") {
      tips.push(
        "Num Xbox Series S de 512 GB, reservar 212 GB pode consumir mais da metade do espaço disponível."
      );
    }
    return tips;
  }

  function calculate() {
    if (!freeEl || !resultEl) return;
    var raw = String(freeEl.value || "").trim().replace(",", ".");
    var free = parseFloat(raw);
    var model = (consoleEl && consoleEl.value) || "";
    var tips = tipsFor(model);
    tipsEl.innerHTML = tips.map(function (t) { return "<li>" + t + "</li>"; }).join("");

    if (raw === "" || !isFinite(free) || free < 0) {
      resultEl.className = "result is-on";
      resultEl.querySelector("strong").textContent = "Digite quanto está livre";
      resultEl.querySelector("p").textContent =
        "Olhe em Ajustes > Armazenamento no console e coloque aqui o espaço livre, em GB. Não usamos um valor padrão de fábrica porque a capacidade da caixa não é toda utilizável, e não encontramos um número oficial confiável para cada modelo.";
      return;
    }

    if (free >= NEED_GB) {
      resultEl.className = "result is-on is-ok";
      resultEl.querySelector("strong").textContent = "Cabe.";
      resultEl.querySelector("p").textContent =
        "Com " +
        formatGb(free) +
        " GB livres, dá para reservar os até 212 GB que a Rockstar pede para o pré-carregamento.";
    } else {
      var miss = Math.round((NEED_GB - free) * 10) / 10;
      resultEl.className = "result is-on is-no";
      resultEl.querySelector("strong").textContent = "Ainda não cabe.";
      resultEl.querySelector("p").textContent =
        "Faltam " +
        formatGb(miss) +
        " GB para chegar aos 212 GB livres recomendados para o pré-carregamento. Libere jogos, clips ou transfira títulos que você não vai jogar agora.";
    }
  }

  if (freeEl) {
    freeEl.addEventListener("input", calculate);
    freeEl.addEventListener("change", calculate);
  }
  if (consoleEl) consoleEl.addEventListener("change", calculate);

  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-on");
    }, 2200);
  }

  var copyBtn = document.getElementById("btn-copy-pix");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      function fallback() {
        showToast("Copia a chave manualmente.");
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PIX_KEY).then(function () {
          showToast("Chave Pix copiada.");
        }, fallback);
      } else {
        fallback();
      }
    });
  }
})();
