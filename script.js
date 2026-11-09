(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;


  $("#themeBtn").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
  
  const hour = new Date().getHours();
  $("#hello").textContent = `Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}, I’m`;

  const typed = $("#typed");
  const words = ["BSIT student", "C++ programmer", "Problem solver"];
  if (!reduce) {
    let w = 0, i = 0, deleting = false;
    const type = () => {
      const word = words[w];
      typed.textContent = word.slice(0, i);
      if (!deleting && i === word.length) {
        deleting = true;
        return setTimeout(type, 1400);
      }
      if (deleting && i === 0) {
        deleting = false;
        w = (w + 1) % words.length;
      }
      i += deleting ? -1 : 1;
      setTimeout(type, deleting ? 45 : 90);
    };
    type();
  }

  const bar = $("#progress");
  const topBtn = $("#topBtn");
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    topBtn.classList.toggle("show", scrollY > 500);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  const countUp = (el) => {
    const end = Number(el.dataset.count);
    if (reduce) { el.textContent = end; return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.05 });
  $$(".reveal").forEach((el) => reveal.observe(el));

  const links = $$("#nav a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section").forEach((s) => spy.observe(s));

  $$(".chip").forEach((chip) => chip.addEventListener("click", () => {
    chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") !== "true");
  }));

  $$("details").forEach((d) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.textContent = "Copy code";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText($("code", d).textContent);
        btn.textContent = "Copied!";
      } catch (e) {
        btn.textContent = "Copy failed";
      }
      setTimeout(() => (btn.textContent = "Copy code"), 1800);
    });
    const row = document.createElement("div");
    row.className = "codebar";
    row.append(btn);
    $("summary", d).after(row);
  });


  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
    addEventListener("pointermove", (e) => {
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
    }, { passive: true });
  }
})();
