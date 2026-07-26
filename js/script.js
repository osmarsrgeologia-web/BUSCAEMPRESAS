/* =====================================================================
   OUTORGA FÁCIL — script do site estático
   - menu mobile
   - links de WhatsApp centralizados (número em UM lugar)
   - formulário de contato -> WhatsApp (com honeypot anti-spam)
   - banner de cookies (LGPD)
   - captura de UTMs (first-touch / last-touch) em cookie — sem disparar nada
     se não houver configuração de rastreamento
   ===================================================================== */

/* ----------------------------------------------------------------------
   CONFIGURAÇÃO — preencha o WhatsApp aqui (formato internacional, só dígitos).
   Enquanto ficar vazio, os botões avisam que o canal ainda não foi configurado.
   Ex.: var WHATSAPP = "5511915230152";
---------------------------------------------------------------------- */
var WHATSAPP = ""; // TODO: preencher com o número da Outorga Fácil
var EMAIL = "comercial@outorgafacil.com.br";

(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */
  window.toggleMenu = function () {
    var nav = document.querySelector(".nav");
    if (nav) nav.classList.toggle("aberto");
  };

  /* ---------- WhatsApp centralizado ---------- */
  function waUrl(msg) {
    var texto = encodeURIComponent(msg || "Olá! Vim pelo site da Outorga Fácil e gostaria de mais informações.");
    if (!WHATSAPP) return null;
    return "https://wa.me/" + WHATSAPP + "?text=" + texto;
  }

  function ligarLinksWpp() {
    var links = document.querySelectorAll(".js-wpp");
    links.forEach(function (a) {
      var msg = a.getAttribute("data-msg");
      var url = waUrl(msg);
      if (url) {
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      } else {
        a.setAttribute("href", "#");
        a.addEventListener("click", function (e) {
          e.preventDefault();
          alert("O WhatsApp ainda não foi configurado. Enquanto isso, fale conosco por e-mail: " + EMAIL);
        });
      }
    });
  }

  /* ---------- Cookies / UTMs (first & last touch) ---------- */
  function setCookie(n, v, dias) {
    var d = new Date();
    d.setTime(d.getTime() + dias * 864e5);
    document.cookie = n + "=" + encodeURIComponent(v) + ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax";
  }
  function getCookie(n) {
    var m = document.cookie.match("(^|;)\\s*" + n + "\\s*=\\s*([^;]+)");
    return m ? decodeURIComponent(m.pop()) : "";
  }
  function capturarUTMs() {
    var p = new URLSearchParams(location.search);
    var campos = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
    var dados = {};
    var temAlgo = false;
    campos.forEach(function (c) {
      var val = p.get(c);
      if (val) { dados[c] = val; temAlgo = true; }
    });
    if (temAlgo) {
      if (!getCookie("of_first_touch")) setCookie("of_first_touch", JSON.stringify(dados), 180);
      setCookie("of_last_touch", JSON.stringify(dados), 180);
    }
  }
  function resumoAtribuicao() {
    var f = getCookie("of_first_touch");
    var l = getCookie("of_last_touch");
    if (!f && !l) return "";
    return "\n\n---\nOrigem (first): " + (f || "-") + "\nOrigem (last): " + (l || "-");
  }

  /* ---------- Formulário -> WhatsApp ---------- */
  function montarMensagem(form) {
    var nome = (form.nome.value || "").trim();
    var tel = (form.telefone.value || "").trim();
    var email = (form.email.value || "").trim();
    var cidade = (form.cidade ? form.cidade.value : "").trim();
    var assunto = form.assunto ? form.assunto.value : "";
    var msg = (form.mensagem.value || "").trim();

    var texto =
      "*Novo contato pelo site — Outorga Fácil*\n\n" +
      "*Nome:* " + nome + "\n" +
      "*Telefone:* " + tel + "\n" +
      (email ? "*E-mail:* " + email + "\n" : "") +
      (cidade ? "*Cidade:* " + cidade + "\n" : "") +
      (assunto ? "*Assunto:* " + assunto + "\n" : "") +
      (msg ? "\n" + msg : "") +
      resumoAtribuicao();
    return texto;
  }

  function ligarFormulario() {
    var form = document.getElementById("form-contato");
    if (!form) return;
    var msgBox = document.getElementById("form-msg");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot: se o campo escondido veio preenchido, é bot
      if (form.website && form.website.value) return;

      // validação simples
      if (!form.nome.value.trim() || !form.telefone.value.trim()) {
        if (msgBox) { msgBox.className = "form-msg erro"; msgBox.textContent = "Por favor, preencha ao menos nome e telefone."; }
        return;
      }
      if (!form.consentimento.checked) {
        if (msgBox) { msgBox.className = "form-msg erro"; msgBox.textContent = "É necessário concordar com o uso dos dados para prosseguir."; }
        return;
      }

      var texto = montarMensagem(form);
      var url = waUrl(texto);

      if (url) {
        if (msgBox) { msgBox.className = "form-msg ok"; msgBox.textContent = "Tudo certo! Abrindo o WhatsApp com a sua mensagem. Se não abrir, chame no " + EMAIL + "."; }
        window.open(url, "_blank", "noopener");
      } else {
        // WhatsApp não configurado: oferece e-mail com corpo pronto
        var assunto = encodeURIComponent("Contato pelo site — Outorga Fácil");
        var corpo = encodeURIComponent(texto.replace(/\*/g, ""));
        if (msgBox) { msgBox.className = "form-msg ok"; msgBox.textContent = "Recebemos os seus dados. Abrindo o seu e-mail para envio — ou escreva para " + EMAIL + "."; }
        window.location.href = "mailto:" + EMAIL + "?subject=" + assunto + "&body=" + corpo;
      }
      form.reset();
    });
  }

  /* ---------- Banner de cookies (LGPD) ---------- */
  function ligarCookies() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    if (!getCookie("of_cookie_ok")) banner.classList.add("show");
    var aceitar = document.getElementById("cookie-aceitar");
    var recusar = document.getElementById("cookie-recusar");
    if (aceitar) aceitar.addEventListener("click", function () { setCookie("of_cookie_ok", "1", 180); banner.classList.remove("show"); });
    if (recusar) recusar.addEventListener("click", function () { setCookie("of_cookie_ok", "0", 180); banner.classList.remove("show"); });
  }

  /* ---------- Ano no rodapé ---------- */
  function ano() {
    var el = document.querySelectorAll(".js-ano");
    el.forEach(function (e) { e.textContent = new Date().getFullYear(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    capturarUTMs();
    ligarLinksWpp();
    ligarFormulario();
    ligarCookies();
    ano();
  });
})();
