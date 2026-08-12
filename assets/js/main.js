// Starfetch site JS
document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav
  var t = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (t && nav) t.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    t.setAttribute("aria-expanded", open ? "true" : "false");
  });
  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Scroll-reveal (skipped for users preferring reduced motion)
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(
    ".section-head, .card, .value-row, .hero .wrap > div, .who-media, .tool-panel, .result-box, .faq details, .why-band .wrap > *"
  );
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      if (el.classList.contains("card")) el.classList.add("d" + ((i % 3) + 1) * 1);
      io.observe(el);
    });
  }

  // Hero gallery carousel
  var gal = document.getElementById("hero-gallery");
  if (gal) {
    var slides = gal.querySelectorAll(".g-slide");
    var dotsWrap = gal.querySelector(".g-dots");
    var cur = 0, timer = null;
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      if (i === 0) b.className = "active";
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll("button");
    function go(i) {
      slides[cur].classList.remove("active"); dots[cur].classList.remove("active");
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add("active"); dots[cur].classList.add("active");
    }
    function restart() {
      if (reduced) return;
      clearInterval(timer);
      timer = setInterval(function () { go(cur + 1); }, 6000);
    }
    gal.querySelector(".g-prev").addEventListener("click", function () { go(cur - 1); restart(); });
    gal.querySelector(".g-next").addEventListener("click", function () { go(cur + 1); restart(); });
    gal.addEventListener("mouseenter", function () { clearInterval(timer); });
    gal.addEventListener("mouseleave", restart);
    // touch swipe
    var sx = null;
    gal.addEventListener("pointerdown", function (e) { sx = e.clientX; });
    gal.addEventListener("pointerup", function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); restart(); }
    });
    restart();
  }

  // Macro stat cards (from assets/data/macro.json) with count-up animation
  var macroWrap = document.getElementById("macro-cards");
  if (macroWrap) {
    fetch("assets/data/macro.json").then(function (r) { return r.json(); }).then(function (data) {
      data.stats.forEach(function (s) {
        var card = document.createElement("div");
        card.className = "card macro-card";
        card.innerHTML = '<div class="macro-value" data-target="' + s.value + '" data-suffix="' + (s.suffix || "") + '">0</div>' +
          '<h3>' + s.label + '</h3><p>' + s.note + '</p><p class="macro-asof">' + s.asOf + " · " + s.source + '</p>';
        macroWrap.appendChild(card);
      });
      var animate = function (el) {
        var target = parseFloat(el.dataset.target), suffix = el.dataset.suffix;
        var dp = (String(el.dataset.target).split(".")[1] || "").length;
        if (reduced) { el.textContent = target.toFixed(dp) + suffix; return; }
        var start = null, dur = 1400;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          p = 1 - Math.pow(1 - p, 3); // ease-out
          el.textContent = (target * p).toFixed(dp) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      if ("IntersectionObserver" in window) {
        var mio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { animate(e.target); mio.unobserve(e.target); }
          });
        }, { threshold: 0.4 });
        macroWrap.querySelectorAll(".macro-value").forEach(function (el) { mio.observe(el); });
      } else {
        macroWrap.querySelectorAll(".macro-value").forEach(animate);
      }
    }).catch(function () { /* leave section minimal if data missing */ });
  }

  // Nigerian market news marquee (Nairametrics RSS via rss2json; hidden if unavailable)
  var newsTrack = document.getElementById("news-track");
  if (newsTrack) {
    var FEED = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://nairametrics.com/category/market-news/feed/");
    fetch(FEED).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.items || !d.items.length) return;
      var items = d.items.slice(0, 10);
      var html = items.map(function (it) {
        var date = (it.pubDate || "").slice(0, 10);
        return '<a class="news-item" href="' + it.link + '" target="_blank" rel="noopener nofollow">' +
          '<span class="news-star">✦</span><span>' + it.title + '</span><span class="news-date">' + date + "</span></a>";
      }).join("");
      newsTrack.innerHTML = html + html; // duplicate for seamless loop
      ["news-title", "news-outer", "news-attrib"].forEach(function (id) { document.getElementById(id).hidden = false; });
      if (reduced) newsTrack.classList.add("static");
    }).catch(function () { /* keep hidden */ });
  }

  // Leave-a-message widget
  var fab = document.getElementById("msg-fab");
  var panel = document.getElementById("msg-panel");
  var close = document.getElementById("msg-close");
  function setPanel(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var f = panel.querySelector("input[name=name]"); if (f) f.focus(); }
  }
  if (fab && panel) {
    fab.addEventListener("click", function () { setPanel(panel.hidden); });
    close.addEventListener("click", function () { setPanel(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) setPanel(false); });
  }
});
