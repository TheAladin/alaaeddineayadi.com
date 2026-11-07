(() => {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const ICONS = {
    close: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    external: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    github: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.54h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-4z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.48 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.17h1.7L7.4 4.74H5.58z"/></svg>',
  };

  /* content */
  function renderStatic() {
    const h = D.hero;
    document.title = `${D.name}, ${D.role}`;
    const logo = $("#navLogo");
    logo.textContent = D.initials;
    logo.setAttribute("aria-label", `${D.name}, back to the start`);
    const sfx = '<span class="sfx" lang="ja" aria-hidden="true">ドン!</span>';
    $("#heroTitle").innerHTML = D.name
      .split(" ")
      .map((w, i) => `<span class="line" style="--i:${i}">${esc(w)}${i === 0 ? sfx : ""}</span>`)
      .join(" ");
    $("#heroRole").textContent = D.role;
    $("#heroIntro").innerHTML = `<b lang="ja">${esc(h.greetingJp)}</b> ${esc(h.greeting)} ${esc(h.intro)}`;

    const c = D.contact;
    $("#contactBlurb").textContent = c.blurb;
    $("#contactAvail").textContent = c.available;
    const mail = $("#contactEmail");
    mail.textContent = c.email;
    mail.href = `mailto:${c.email}`;
    // socials as subway line bullets
    const LINES = [
      { bg: "#f8c300", fg: "#151515" },
      { bg: "#00923f", fg: "#fff" },
      { bg: "#a21a68", fg: "#fff" },
      { bg: "#f37021", fg: "#151515" },
    ];
    $("#contactSocials").innerHTML = c.socials
      .map((s, i) => {
        const l = LINES[i % LINES.length];
        return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">
            <i class="bullet" style="--bc:${l.bg};--bt:${l.fg}" aria-hidden="true">${ICONS[s.icon] || ""}</i>
            <span class="soc__label">${esc(s.label)}</span>
          </a></li>`;
      })
      .join("");
    $("#year").textContent = new Date().getFullYear();
    $("#footName").textContent = D.name;
  }

  /* hero */
  function buildClouds() {
    const wrap = $("#clouds");
    const cloud = (shade) => `
      <svg viewBox="0 0 220 96" aria-hidden="true">
        <g fill="${shade}" transform="translate(0 7)" opacity=".55">
          <circle cx="60" cy="55" r="30"/><circle cx="100" cy="40" r="38"/><circle cx="146" cy="50" r="30"/>
          <circle cx="176" cy="62" r="22"/><circle cx="35" cy="66" r="20"/><rect x="28" y="58" width="166" height="28" rx="14"/>
        </g>
        <g fill="url(#cloudGrad)">
          <circle cx="60" cy="55" r="30"/><circle cx="100" cy="40" r="38"/><circle cx="146" cy="50" r="30"/>
          <circle cx="176" cy="62" r="22"/><circle cx="35" cy="66" r="20"/><rect x="28" y="58" width="166" height="28" rx="14"/>
        </g>
      </svg>`;
    // userSpaceOnUse so one gradient covers the whole cloud
    const defs = `<svg width="0" height="0" style="position:absolute"><defs>
      <linearGradient id="cloudGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="88">
        <stop offset="0" stop-color="#fffaf6"/><stop offset=".65" stop-color="#ffe2ea"/><stop offset="1" stop-color="#f6b6cf"/>
      </linearGradient></defs></svg>`;
    // placed by hand to keep clear of the name
    const configs = [
      { x: "66%", y: "11%", w: "26vw", o: 0.95 },
      { x: "88%", y: "31%", w: "15vw", o: 0.85 },
    ];
    wrap.innerHTML =
      defs +
      configs
        .map((c) => `<div class="cloud" style="--x:${c.x};--y:${c.y};--w:${c.w};--o:${c.o}">${cloud("#c98bbd")}</div>`)
        .join("");
  }

  function buildSkyline() {
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let d = "M0 320 L0 290 ";
    let wins = "";
    let x = 0;
    while (x < 1440) {
      const w = 26 + rnd() * 64;
      const h = 228 + rnd() * 62;
      d += `L${x.toFixed(1)} ${h.toFixed(1)} L${(x + w).toFixed(1)} ${h.toFixed(1)} `;
      if (rnd() > 0.82) {
        const ax = x + w * 0.5;
        d += `L${(x + w).toFixed(1)} ${h.toFixed(1)} `;
        wins += `<rect class="fill" x="${(ax - 1).toFixed(1)}" y="${(h - 22).toFixed(1)}" width="2" height="22"/>`;
      }
      // lit windows
      for (let k = 0; k < 3; k++) {
        if (rnd() > 0.72) {
          const wx = x + 6 + rnd() * (w - 14);
          const wy = h + 10 + rnd() * (300 - h);
          wins += `<rect class="win" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="4" height="5"/>`;
        }
      }
      x += w;
    }
    d += "L1440 320 Z";
    const pole = (px) => `
      <rect class="fill" x="${px}" y="40" width="9" height="280"/>
      <rect class="fill" x="${px - 38}" y="62" width="86" height="6"/>
      <rect class="fill" x="${px - 28}" y="86" width="66" height="5"/>`;
    const wires = `
      <path class="wire" d="M-20 108 Q600 170 1142 65"/>
      <path class="wire" d="M-20 128 Q600 196 1152 89"/>
      <path class="wire" d="M-20 150 Q560 214 1170 65"/>
      <path class="wire" d="M1142 65 Q1300 92 1460 74"/>
      <path class="wire" d="M1170 89 Q1310 116 1460 102"/>`;
    $("#skyline").innerHTML = `<path class="fill" d="${d}"/>${wins}${pole(1150)}${wires}`;
  }

  /* petals */
  const petals = (() => {
    const canvas = $("#petals");
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    let items = [];
    const count = () => (innerWidth < 700 ? 10 : 18);

    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20 - Math.random() * 60,
        s: 5 + Math.random() * 8,
        r: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.03,
        vy: 0.35 + Math.random() * 0.7,
        vx: 0.25 + Math.random() * 0.6,
        sw: Math.random() * Math.PI * 2,
        sws: 0.008 + Math.random() * 0.018,
        flip: Math.random() * Math.PI * 2,
      };
    }
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = count();
      while (items.length < n) items.push(spawn(true));
      items.length = n;
    }
    function draw(dt, morph) {
      ctx.clearRect(0, 0, w, h);
      const k = dt / 16.67;
      const cr = 255;
      const cg = Math.round(lerp(170, 182, morph));
      const cb = Math.round(lerp(200, 39, morph));
      for (const p of items) {
        p.sw += p.sws * k;
        p.flip += 0.03 * k;
        p.r += p.vr * k;
        p.y += p.vy * k * (1 + morph * 2);
        p.x += (p.vx + Math.sin(p.sw) * 0.6) * k * (1 - morph * 0.8);
        if (p.y > h + 20 || p.x > w + 20) Object.assign(p, spawn(false), { x: Math.random() * w * 0.9 - w * 0.1 });

        ctx.save();
        ctx.translate(p.x, p.y);
        if (morph > 0.5) {
          const s = p.s * 0.55;
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.4 + morph * 0.5})`;
          ctx.fillRect(-s / 2, -s / 2, s, s);
        } else {
          ctx.rotate(p.r);
          ctx.scale(1, 0.35 + Math.abs(Math.cos(p.flip)) * 0.65);
          const s = p.s;
          const g = ctx.createLinearGradient(0, -s, 0, s);
          g.addColorStop(0, `rgba(255,236,242,.95)`);
          g.addColorStop(1, `rgba(${cr},${cg},${cb},.9)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(0, s);
          ctx.bezierCurveTo(s * 0.95, s * 0.35, s * 0.7, -s * 0.75, s * 0.18, -s);
          ctx.lineTo(0, -s * 0.72);
          ctx.lineTo(-s * 0.18, -s);
          ctx.bezierCurveTo(-s * 0.7, -s * 0.75, -s * 0.95, s * 0.35, 0, s);
          ctx.fill();
        }
        ctx.restore();
      }
    }
    resize();
    addEventListener("resize", resize);
    return { draw };
  })();

  /* hero to experience wipe */
  const stage = (() => {
    const el = $("#home");
    const warp = $("#warp");
    const inner = $("#heroInner");
    const text = $("#warpText");
    const layers = $$("[data-depth]", $("#home"));
    const MSG = "Next stop: Experience";
    let visible = true;
    let t = 0;
    let lastChars = -1;
    let drawnOnce = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);

    if (finePointer && !reduceMotion) {
      $("#home").addEventListener("pointermove", (e) => {
        mouse.tx = (e.clientX / innerWidth) * 2 - 1;
        mouse.ty = (e.clientY / innerHeight) * 2 - 1;
      });
    }

    function progress() {
      const r = el.getBoundingClientRect();
      const total = r.height - innerHeight;
      return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    }

    function tick(dt) {
      if (!visible) return;
      const p = progress();
      t = clamp((p - 0.1) / 0.75, 0, 1);
      const e = easeInOut(t);

      warp.style.setProperty("--x", (140 - e * 140).toFixed(2));
      inner.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0) scale(${(1 - p * 0.06).toFixed(4)})`;
      inner.style.opacity = (1 - t * 0.6).toFixed(3);

      const chars = Math.floor(clamp((t - 0.5) / 0.4, 0, 1) * MSG.length);
      if (chars !== lastChars) {
        text.textContent = MSG.slice(0, chars);
        lastChars = chars;
      }

      // mouse parallax
      mouse.x = lerp(mouse.x, mouse.tx, 0.06);
      mouse.y = lerp(mouse.y, mouse.ty, 0.06);
      for (const l of layers) {
        const d = +l.dataset.depth;
        l.style.transform = `translate3d(${(mouse.x * d).toFixed(2)}px, ${(mouse.y * d * 0.4).toFixed(2)}px, 0)`;
      }

      if (!reduceMotion) petals.draw(dt, t);
      else if (!drawnOnce) {
        petals.draw(0, 0);
        drawnOnce = true;
      }
    }
    return { tick };
  })();

  /* jump (experience to projects) */
  const smooth = (x, a, b) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const jump = (() => {
    const el = $("#jump");
    const canvas = $("#jumpCanvas");
    const ctx = canvas.getContext("2d");
    const grid = $("#jumpGrid");
    const space = $("#jumpSpace");
    const flash = $("#jumpFlash");
    const hud = $(".jump__hud", el);
    const line = $("#jumpLine");
    const speedEl = $("#jumpSpeed");
    const bar = $("#jumpBar");
    const track = $("#jumpTrack");
    // timeline (p): grid falls 0–.5, warp .15–.9; projects start scrolling in at ~.64
    const PHASES = [
      [0.18, "Leaving the grid"],
      [0.36, "Engaging warp drive"],
      [0.5, "Hyperspace"],
      [1.01, "Next stop: Projects"],
    ];
    const IDLE = 0.00005; // cruising speed once we've arrived, in z units per ms
    let w = 0, h = 0, dpr = 1, visible = false, p = 0, phase = "";
    let shooting = null, nextShoot = 3000;
    let stars = [];

    const star = (z) => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.03 + Math.sqrt(Math.random()) * 1.1;
      return {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        z: z === undefined ? Math.random() : z,
        hue: Math.random() > 0.8 ? (Math.random() > 0.5 ? 190 : 262) : 0,
      };
    };
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = innerWidth < 700 ? 240 : 460;
      while (stars.length < n) stars.push(star());
      stars.length = n;
    }
    resize();
    addEventListener("resize", resize);
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);

    function tick(dt) {
      if (!visible) return;
      // p = 1 when projects reach the top
      const total = track.offsetHeight;
      p = clamp(-el.getBoundingClientRect().top / total, 0, 1);

      // 1. grid tilts and drops
      const tilt = smooth(p, 0.02, 0.35) * 82;
      const drop = smooth(p, 0.25, 0.5);
      grid.style.transform = `translate3d(0, ${(drop * 35).toFixed(2)}vh, 0) rotateX(${tilt.toFixed(2)}deg)`;
      grid.style.opacity = (1 - drop).toFixed(3);
      grid.style.setProperty("--ga", (0.07 + smooth(p, 0.05, 0.35) * 0.2).toFixed(3));

      // 2. hyperspace
      const warp = smooth(p, 0.15, 0.38) * (1 - smooth(p, 0.5, 0.9));
      const speed = reduceMotion ? 0 : IDLE + warp * 0.0017;
      canvas.style.opacity = smooth(p, 0.08, 0.25).toFixed(3);
      space.style.opacity = smooth(p, 0.2, 0.55).toFixed(3);
      flash.style.opacity = (Math.max(0, 1 - Math.abs(p - 0.5) / 0.04) * 0.28).toFixed(3);

      const cx = w / 2, cy = h * 0.42, f = Math.max(w, h) * 0.5;
      const trail = Math.max(0, speed - IDLE) * 70;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const s of stars) {
        s.z -= speed * dt;
        let sx = cx + (s.x / s.z) * f;
        let sy = cy + (s.y / s.z) * f;
        if (s.z <= 0.02 || sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          Object.assign(s, star(1));
          continue;
        }
        const near = 1 - s.z;
        const alpha = clamp(near * 1.4, 0, 1);
        const col = s.hue ? `hsla(${s.hue},90%,80%,${alpha})` : `rgba(235,238,255,${alpha})`;
        const tz = s.z + trail;
        const tx = cx + (s.x / tz) * f;
        const ty = cy + (s.y / tz) * f;
        const size = 0.4 + near * 1.8;
        if (Math.hypot(sx - tx, sy - ty) > 1.5) {
          ctx.strokeStyle = col;
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(sx, sy, size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // occasional shooting star
      if (p >= 0.95 && !reduceMotion) {
        nextShoot -= dt;
        if (!shooting && nextShoot < 0) {
          shooting = { x: w * (0.3 + Math.random() * 0.7), y: h * Math.random() * 0.5, life: 0 };
          nextShoot = 4000 + Math.random() * 6000;
        }
      }
      if (shooting) {
        shooting.life += dt;
        const k = shooting.life / 900;
        const x = shooting.x - k * 420, y = shooting.y + k * 200;
        const g = ctx.createLinearGradient(x, y, x + 120, y - 57);
        g.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - k)})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 120, y - 57);
        ctx.stroke();
        if (k >= 1) shooting = null;
      }

      // 3. HUD
      const label = PHASES.find(([t]) => p < t)[1];
      if (label !== phase) {
        phase = label;
        line.textContent = label;
        hud.classList.toggle("is-space", p >= 0.36);
      }
      speedEl.textContent = (warp * 9.97).toFixed(2);
      bar.style.transform = `scaleX(${clamp(p / 0.6, 0, 1).toFixed(3)})`;
      hud.style.opacity = (smooth(p, 0.02, 0.1) * (1 - smooth(p, 0.56, 0.64))).toFixed(3);
    }
    return { tick };
  })();

  /* descent */
  const descent = (() => {
    const root = $("#descent");
    const sky = $("#sky");
    const city = $("#city");
    const road = $(".road", root);
    const under = $(".under", root);
    const alt = $("#alt");
    const altLabel = $("#altLabel");
    const altValue = $("#altValue");
    const gauge = $("#altGauge");
    const car = $("#streetcar");
    const back = $("#dayBack");
    const front = $("#dayFront");
    let visible = false;
    let altitude = 400000;
    let marks = {};
    let clouds = [];

    const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const f1 = (v) => v.toFixed(1);

    // clouds
    function buildClouds() {
      const r = rng(5);
      const shape = `
        <svg viewBox="0 0 220 96">
          <g fill="url(#dayCloud)">
            <circle cx="60" cy="55" r="30"/><circle cx="100" cy="40" r="38"/><circle cx="146" cy="50" r="30"/>
            <circle cx="176" cy="62" r="22"/><circle cx="35" cy="66" r="20"/><rect x="28" y="58" width="166" height="28" rx="14"/>
          </g>
        </svg>`;
      const defs = `<svg width="0" height="0" style="position:absolute"><defs>
        <linearGradient id="dayCloud" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="88">
          <stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eef3f9"/><stop offset="1" stop-color="#c8d5e5"/>
        </linearGradient></defs></svg>`;
      const list = [];
      // high, sparse
      for (let i = 0; i < 9; i++)
        list.push({ x: r() * 90 - 5, y: 46 + r() * 30, w: 10 + r() * 14, o: 0.35 + r() * 0.4, k: -(0.15 + r() * 0.2), near: false });
      // cloud deck
      for (let i = 0; i < 9; i++)
        list.push({ x: i * 12 - 12 + r() * 6, y: 82 + r() * 8, w: 26 + r() * 18, o: 0.95, k: -0.1, near: false });
      // close ones
      for (let i = 0; i < 4; i++)
        list.push({ x: r() * 80 - 10, y: 74 + r() * 16, w: 45 + r() * 25, o: 0.9, k: 0.55 + r() * 0.3, near: true });
      $("#skyClouds").innerHTML =
        defs +
        list
          .map(
            (c) =>
              `<div class="dcloud${c.near ? " is-near" : ""}" style="--x:${f1(c.x)}%;--y:${f1(c.y)}%;--w:${f1(c.w)}vw;--o:${c.o.toFixed(2)}">${shape}</div>`
          )
          .join("");
      clouds = $$(".dcloud", root).map((el, i) => ({ el, k: list[i].k }));
    }

    // skyline
    function buildings(rnd, heightAt, layer, skip) {
      const rect = (x, y, w, h, c) => `<rect class="${c}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"/>`;
      let out = "", x = -10;
      while (x < 1450) {
        const wdt = 28 + rnd() * 56;
        if (skip && x + wdt > skip[0] && x < skip[1]) {
          x = skip[1];
          continue;
        }
        const ht = heightAt(x + wdt / 2, rnd);
        const top = 420 - ht;
        const roll = rnd();
        const kind = roll < 0.5 ? "glass" : roll < 0.68 ? "dark" : "stone";
        const tex = kind === "stone" ? "tex-rows" : "tex-mull";
        let crown = "";
        if (ht > 170 && rnd() > 0.5) {
          const iw = wdt * (0.45 + rnd() * 0.3), ih = 10 + rnd() * 18;
          crown = rect(x + (wdt - iw) / 2, top - ih, iw, ih + 1, `${layer} ${kind}`);
          if (rnd() > 0.55) crown += rect(x + wdt / 2 - 1, top - ih - 22, 2, 23, `${layer} dark`);
        }
        out += crown + rect(x, top, wdt + 0.6, ht, `${layer} ${kind}`);
        if (layer === "front") out += rect(x, top, wdt, ht, tex) + rect(x, top, Math.min(6, wdt * 0.15), ht, "lit");
        x += wdt + (rnd() > 0.8 ? 3 + rnd() * 8 : 0);
      }
      return out;
    }
    function cnTower(cx, base, H) {
      const y = (f) => f1(base - f * H);
      const X = (k) => f1(cx + k * H);
      const P = (pts, c = "cn") => `<polygon class="${c}" points="${pts.map(([k, f]) => `${X(k)},${y(f)}`).join(" ")}"/>`;
      return [
        P([[-0.076, 0], [-0.022, 0.57], [0.022, 0.57], [0.076, 0]]),
        P([[-0.064, 0.57], [-0.099, 0.605], [0.099, 0.605], [0.064, 0.57]]),
        P([[-0.099, 0.605], [-0.083, 0.645], [0.083, 0.645], [0.099, 0.605]]),
        P([[-0.097, 0.615], [-0.093, 0.628], [0.093, 0.628], [0.097, 0.615]], "band"),
        P([[-0.016, 0.645], [-0.016, 0.785], [0.016, 0.785], [0.016, 0.645]]),
        P([[-0.028, 0.78], [-0.032, 0.8], [-0.022, 0.82], [0.022, 0.82], [0.032, 0.8], [0.028, 0.78]]),
        P([[-0.011, 0.818], [-0.003, 1], [0.003, 1], [0.011, 0.818]], "ant"),
        `<circle class="aviation" cx="${cx}" cy="${y(1)}" r="2.6"/>`,
      ].join("");
    }
    function dome(x0, x1) {
      const mid = (x0 + x1) / 2;
      const segs = [0.2, 0.4, 0.6, 0.8]
        .map((k) => {
          const sx = x0 + (x1 - x0) * k;
          return `<path class="seg" d="M${sx} 420 L${sx} 392 Q${mid} ${352 + Math.abs(k - 0.5) * 36} ${mid} 356"/>`;
        })
        .join("");
      return `<path class="dome" d="M${x0} 420 L${x0} 390 Q${mid} 322 ${x1} 390 L${x1} 420 Z"/>${segs}`;
    }
    function buildSkyline() {
      const defs = `<defs>
        <pattern id="mull" width="7" height="12" patternUnits="userSpaceOnUse">
          <rect width="1.2" height="12" fill="rgba(255,255,255,.22)"/><rect width="7" height="1" fill="rgba(255,255,255,.1)"/>
        </pattern>
        <pattern id="rows" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect y="4" width="12" height="3" fill="rgba(40,45,55,.28)"/>
        </pattern>
        <linearGradient id="cnShade" x1="0" x2="1">
          <stop offset=".5" stop-color="#d4cec3"/><stop offset=".5" stop-color="#aea79a"/>
        </linearGradient>
      </defs>`;
      back.innerHTML = buildings(rng(41), (x, r) => 130 + r() * 130 + (x > 830 && x < 1220 ? 60 : 0), "back");
      const h = (x, r) => {
        if (x > 830 && x < 1210) return 170 + r() * 130; // financial district
        if (x > 1210) return 80 + r() * 90;
        if (x > 480) return 50 + r() * 70;
        return 70 + r() * 120;
      };
      front.innerHTML = defs + buildings(rng(7), h, "front", [600, 830]) + dome(612, 748) + cnTower(790, 420, 405);
    }

    function measure() {
      const top = (el) => el.getBoundingClientRect().top + scrollY;
      marks = { sky: top(sky), city: top(city), road: top(road), end: top(under) + under.offsetHeight };
    }

    const fmt = (m) => {
      const a = Math.abs(m);
      if (a >= 1000) return `${(m / 1000).toFixed(a >= 100000 ? 0 : 1)} km`;
      return `${Math.round(m)} m`;
    };

    function tick() {
      if (!visible) return;
      const vh = innerHeight;
      const c = scrollY + vh * 0.5;
      const { sky: s0, city: c0, road: r0, end } = marks;

      // altitude: cubic in the sky, linear over the city
      let t;
      if (c <= c0) {
        t = clamp((c - s0) / (c0 - s0), 0, 1);
        altitude = 600 + 399400 * Math.pow(1 - t, 3);
      } else if (c <= r0) {
        altitude = 600 * (1 - (c - c0) / (r0 - c0));
      } else {
        altitude = -22 * clamp((c - r0) / (end - r0), 0, 1);
      }
      altValue.textContent = fmt(altitude);
      altLabel.textContent =
        altitude > 100000 ? "Low Earth orbit"
        : altitude > 12000 ? "Re-entry"
        : altitude > 1500 ? "Troposphere"
        : altitude > 4 ? "Toronto, ON"
        : altitude > -3 ? "Street level"
        : "Underground";
      gauge.style.transform = `scaleX(${clamp((c - s0) / (end - s0), 0, 1).toFixed(3)})`;
      // only during the descent
      alt.style.opacity = (smooth(c, s0 - vh * 0.1, s0 + vh * 0.1) * (1 - smooth(c, end - vh * 0.45, end - vh * 0.15))).toFixed(3);

      if (reduceMotion) return;

      // parallax by distance from viewport centre
      for (const cl of clouds) {
        const base = cl.el.offsetTop + s0 + cl.el.offsetHeight / 2;
        cl.el.style.transform = `translate3d(0, ${((base - c) * cl.k).toFixed(1)}px, 0)`;
      }

      // skyline parallax, settles at street level
      const roadTop = r0 - scrollY;
      const far = Math.max(0, roadTop - vh);
      back.style.transform = `translate3d(0, ${(far * 0.22).toFixed(1)}px, 0)`;
      front.style.transform = `translate3d(0, ${(far * 0.08).toFixed(1)}px, 0)`;

      // streetcar
      const q = clamp((vh - roadTop) / (vh * 1.1), 0, 1);
      const cw = car.getBoundingClientRect().width;
      car.style.transform = `translate3d(${(-cw + q * (city.clientWidth + cw * 2) - cw * 0.5).toFixed(1)}px, 0, 0)`;
    }

    buildClouds();
    buildSkyline();
    measure();
    addEventListener("resize", measure);
    addEventListener("load", measure);
    new ResizeObserver(measure).observe(document.body);
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
    return { tick };
  })();

  /* nav */
  function initNav() {
    const bar = $("#navProgress");
    const links = $$(".nav__links a");
    const stops = [$("#home"), $("#experience"), $("#projects"), $("#contact")];
    let queued = false;
    function update() {
      queued = false;
      const mark = innerHeight * 0.45;
      const at = stops.map((el, i) => (i ? el.getBoundingClientRect().top + scrollY - mark : 0));
      let current = 0;
      at.forEach((y, i) => {
        if (scrollY >= y) current = i;
      });
      const leg = current < at.length - 1 ? (scrollY - at[current]) / (at[current + 1] - at[current]) : 0;
      bar.style.transform = `scaleX(${((current + leg) / (at.length - 1)).toFixed(4)})`;
      links.forEach((a, i) => {
        a.classList.toggle("is-passed", i < current);
        a.classList.toggle("is-active", i === current);
        if (i === current) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
    return { update };
  }

  /* experience */
  function initExperience() {
    const list = $("#expList");
    const panel = $("#expPanel");
    const inner = $("#expPanelInner");
    const items = D.experience;

    list.innerHTML = items
      .map(
        (e, i) => `
        <button type="button" class="exp__item" role="tab" id="exp-tab-${i}" aria-controls="expPanel"
                aria-selected="false" tabindex="-1" data-i="${i}">
          <span class="exp__date">${esc(e.start)}–${esc(e.end)}</span>
          <span class="exp__company">${esc(e.company)}</span>
          <span class="exp__role-sm">${esc(e.role)}</span>
        </button>`
      )
      .join("");
    const tabs = $$(".exp__item", list);
    let current = -1;

    function render(i) {
      const e = items[i];
      panel.setAttribute("aria-labelledby", `exp-tab-${i}`);
      inner.innerHTML = `
        <h3 class="exp__role">${esc(e.role)}</h3>
        <p class="exp__meta"><span>${esc(e.company)}</span><span>${esc(e.location)}</span><span>${esc(e.type)}</span></p>
        <p class="exp__summary">${esc(e.summary)}</p>
        <h4 class="exp__label">What I did</h4>
        <ul class="exp__tasks">${e.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <h4 class="exp__label">Tools</h4>
        <ul class="tags">${e.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;
      inner.classList.remove("is-switching");
      void inner.offsetWidth;
      inner.classList.add("is-switching");
    }

    function select(i, focus) {
      if (i === current) return;
      current = i;
      tabs.forEach((t, j) => {
        const on = j === i;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
      });
      if (focus) tabs[i].focus();
      tabs[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      render(i);
    }

    list.addEventListener("click", (e) => {
      const b = e.target.closest(".exp__item");
      if (b) select(+b.dataset.i);
    });
    list.addEventListener("keydown", (e) => {
      const n = tabs.length;
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in map) select((current + map[e.key] + n) % n, true);
      else if (e.key === "Home") select(0, true);
      else if (e.key === "End") select(n - 1, true);
      else return;
      e.preventDefault();
    });

    // first entry, without scrolling to it
    current = 0;
    tabs[0].classList.add("is-active");
    tabs[0].setAttribute("aria-selected", "true");
    tabs[0].tabIndex = 0;
    render(0);
  }

  /* projects */
  const metaLine = (p) => `${esc(p.category)}, ${esc(p.year)}${p.ai ? ", AI-powered" : ""}`;

  // title behind the image as a fallback
  const windowHTML = (p, lazy) => `
    <div class="window">
      <div class="window__pane">
        <span class="window__name" aria-hidden="true">${esc(p.title)}</span>
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.alt || "")}" draggable="false" decoding="async"${lazy ? ' loading="lazy"' : ""} />` : ""}
        <i class="window__glass"></i>
      </div>
    </div>`;
  document.addEventListener("error", (e) => e.target.matches?.(".window img") && e.target.remove(), true);

  const BOGIE = '<span class="bogie"><i class="wheel"></i><i class="wheel"></i></span>';

  function cardHTML(p, i, clone) {
    const tab = clone ? ' tabindex="-1"' : "";
    return `
      <article class="pcard" data-index="${i}"${clone ? ' aria-hidden="true"' : ""}>
        <div class="pcard__visual">
          <div class="car">${windowHTML(p, true)}<i class="car__door"></i>${BOGIE}${BOGIE}</div>
        </div>
        <div class="pcard__body">
          <h3 class="pcard__title"><button type="button" class="pcard__open" aria-haspopup="dialog"${tab}>${esc(p.title)}</button></h3>
          <p class="pcard__meta">${metaLine(p)}</p>
          <p class="pcard__desc">${esc(p.short)}</p>
          <ul class="tags">${p.stack.slice(0, 4).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        </div>
      </article>`;
  }

  /* carousel */
  const carousel = (() => {
    const car = $("#projCarousel");
    const track = $("#projTrack");
    const WHEEL_DEG_PER_PX = 360 / (Math.PI * 28); // wheels are 28px across
    let setW = 0, x = 0, vel = 0, rolled = 0;
    let visible = false;
    let drag = null, tween = null, blockClick = false;

    function build() {
      const one = D.projects.map((p, i) => cardHTML(p, i, false)).join("");
      const clone = D.projects.map((p, i) => cardHTML(p, i, true)).join("");
      track.innerHTML = one + clone;
      const cards = track.children;
      setW = cards[D.projects.length].offsetLeft - cards[0].offsetLeft;
      // strip must be wider than the viewport
      const copies = Math.max(2, Math.ceil(car.clientWidth / setW) + 1);
      // copy in front too so it never runs out on the left
      track.innerHTML = clone + one + clone.repeat(copies - 1);
      car.parentElement.style.setProperty("--strip-h", `${track.offsetHeight + 8}px`);
    }
    const wrap = (v) => (setW ? -((((-v) % setW) + setW) % setW) : 0);

    function tick(dt) {
      if (!visible || !setW) return;
      if (!drag) {
        if (tween) {
          const k = clamp((performance.now() - tween.t0) / 520, 0, 1);
          x = lerp(tween.from, tween.to, easeOut(k));
          if (k >= 1) tween = null;
        } else {
          x += vel * dt;
          vel *= Math.pow(0.93, dt / 16.67);
          if (Math.abs(vel) < 0.002) vel = 0;
        }
      }
      track.style.transform = `translate3d(${(wrap(x) - setW).toFixed(2)}px,0,0)`;
      // one turn per circumference travelled
      if (x !== rolled) {
        rolled = x;
        track.style.setProperty("--roll", (x * WHEEL_DEG_PER_PX).toFixed(1));
      }
    }

    function nudge(dir) {
      const cards = track.children;
      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      tween = { from: x, to: x - dir * step, t0: performance.now() };
      vel = 0;
    }

    car.addEventListener("focusin", (e) => {
      const card = e.target.closest(".pcard");
      if (!card) return;
      // scroll focused card into view
      const cr = card.getBoundingClientRect(), vr = car.getBoundingClientRect();
      if (cr.left < vr.left + 40 || cr.right > vr.right - 40) {
        const delta = cr.left + cr.width / 2 - (vr.left + vr.width / 2);
        tween = { from: x, to: x - delta, t0: performance.now() };
      }
    });

    car.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".proj__arrow")) return;
      drag = { id: e.pointerId, sx: e.clientX, x0: x, lx: e.clientX, lt: performance.now(), v: 0, moved: false };
      tween = null;
      vel = 0;
    });
    car.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.sx;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        car.setPointerCapture(e.pointerId);
        car.classList.add("is-dragging");
      }
      if (drag.moved) {
        x = drag.x0 + dx;
        const now = performance.now();
        const ddt = now - drag.lt;
        if (ddt > 0) drag.v = lerp(drag.v, (e.clientX - drag.lx) / ddt, 0.4);
        drag.lx = e.clientX;
        drag.lt = now;
      }
    });
    const endDrag = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        vel = clamp(drag.v, -3, 3);
        blockClick = true;
        setTimeout(() => (blockClick = false), 60);
      }
      car.classList.remove("is-dragging");
      drag = null;
    };
    car.addEventListener("pointerup", endDrag);
    car.addEventListener("pointercancel", endDrag);
    car.addEventListener("dragstart", (e) => e.preventDefault());
    car.addEventListener(
      "wheel",
      (e) => {
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        if (Math.abs(dx) > Math.abs(e.shiftKey ? 0 : e.deltaY)) {
          e.preventDefault();
          tween = null;
          x -= dx;
        }
      },
      { passive: false }
    );
    $("#projPrev").addEventListener("click", () => nudge(-1));
    $("#projNext").addEventListener("click", () => nudge(1));

    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(car);
    let rt;
    addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(build, 150);
    });
    build();

    return {
      tick,
      halt() {
        tween = null;
        vel = 0;
      },
      get blockClick() { return blockClick; },
    };
  })();

  /* train/grid toggle */
  function initExpand() {
    const section = $("#projects");
    const toggle = $("#projToggle");
    const label = $("span", toggle);
    const hint = $("#projHint");
    const win = $("#projWindow");
    const grid = $("#projGrid");
    let filter = "all";
    let expanded = false;

    const fit = () => (win.style.height = expanded ? `${grid.offsetHeight}px` : "");

    function renderGrid() {
      const items = D.projects.map((p, i) => [p, i]).filter(([p]) => filter === "all" || p.ai);
      grid.innerHTML = items.length
        ? items.map(([p, i]) => cardHTML(p, i, false)).join("")
        : '<p class="proj__empty">No projects match this filter. Select All to see every project.</p>';
      fit();
    }

    function set(open) {
      expanded = open;
      section.classList.toggle("is-expanded", open);
      label.textContent = open ? "Show as train" : "Show as grid";
      hint.textContent = open ? "Select one to read more." : "Drag to browse, or select one to read more.";
      $("#projCarousel").inert = open;
      grid.inert = !open;
      if (open) renderGrid();
      else fit();
      const top = $(".proj__head", section).getBoundingClientRect().top + scrollY - 100;
      scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      if (!open && win.contains(document.activeElement)) toggle.focus({ preventScroll: true });
    }

    grid.inert = true;
    toggle.addEventListener("click", () => set(!expanded));
    $("#projFilters").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b || b.dataset.filter === filter) return;
      filter = b.dataset.filter;
      $$(".chip", e.currentTarget).forEach((c) => {
        c.classList.toggle("is-active", c === b);
        c.setAttribute("aria-pressed", c === b);
      });
      renderGrid();
    });
    addEventListener("resize", fit);
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && expanded && !modal.isOpen) set(false);
    });
  }

  /* project modal */
  const modal = (() => {
    const root = $("#modal");
    const scroller = $("#modalScroll");
    const content = $("#modalContent");
    const FLIGHT = { easing: "cubic-bezier(.2, .8, .2, 1)" };
    let src = null, lastFocus = null, open = false, flight = null;

    const inView = (el) => {
      if (!el || !el.isConnected) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    };
    // transform that puts el over rect (same shape, so scale is enough)
    const over = (el, rect) => {
      const at = el.getBoundingClientRect();
      return `translate(${rect.left - at.left}px, ${rect.top - at.top}px) scale(${rect.width / at.width})`;
    };
    // lock html, not body: locking body breaks the sticky starfield
    function lockScroll(on) {
      const page = document.documentElement;
      const bar = innerWidth - page.clientWidth;
      document.body.style.marginRight = on && bar ? `${bar}px` : "";
      page.classList.toggle("no-scroll", on);
    }

    function html(p) {
      const links = [
        p.links.live && `<a class="m__link m__link--primary" href="${esc(p.links.live)}" target="_blank" rel="noopener">${ICONS.external} Visit live site</a>`,
        p.links.repo && `<a class="m__link" href="${esc(p.links.repo)}" target="_blank" rel="noopener">${ICONS.github} Source code</a>`,
      ].filter(Boolean).join("");
      return `
        <button type="button" class="m__close m__fade" data-close aria-label="Close project">${ICONS.close}</button>
        <div class="m__top">
          ${windowHTML(p)}
          <div class="m__story m__fade">
            <h3 id="modalTitle">${esc(p.title)}</h3>
            <p class="m__meta">${metaLine(p)}</p>
            ${p.description.map((d) => `<p>${esc(d)}</p>`).join("")}
          </div>
        </div>
        <div class="m__facts m__fade">
          <div>
            <h4>Highlights</h4>
            <ul class="m__highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
          </div>
          <div>
            <dl>
              <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
              <div><dt>Status</dt><dd>${esc(p.status)}</dd></div>
              <div class="m__stack"><dt>Stack</dt><dd>${esc(p.stack.join(", "))}</dd></div>
            </dl>
            <div class="m__links">${links}</div>
          </div>
        </div>`;
    }

    function show(index, card) {
      if (open || root.classList.contains("is-open")) return;
      open = true;
      src = $(".window", card);
      lastFocus = document.activeElement;
      carousel.halt();
      content.innerHTML = html(D.projects[index]);
      lockScroll(true);

      const win = $(".window", content);
      const img = $("img", win);
      // same image as the card, wait for decode so it doesn't fly empty
      const decoded = img ? img.decode().catch(() => {}) : null;
      Promise.race([decoded, new Promise((r) => setTimeout(r, 120))]).then(() => {
        if (!open) return;
        root.classList.add("is-open");
        root.setAttribute("aria-hidden", "false");
        scroller.scrollTop = 0;
        if (!reduceMotion) {
          flight = win.animate([{ transform: over(win, src.getBoundingClientRect()) }, { transform: "none" }], { ...FLIGHT, duration: 560 });
        }
        src.classList.add("is-away");
        void root.offsetWidth; // commit the hidden state, so the fades below run
        root.classList.add("is-ready");
        scroller.focus({ preventScroll: true }); // the next Tab reaches the close button, and arrow keys scroll
      });
    }

    function hide() {
      if (!open) return;
      open = false;
      const win = $(".window", content);
      const at = win.getBoundingClientRect(); // where it is now, even if it's still landing
      if (flight) flight.cancel();
      root.classList.remove("is-ready");
      if (reduceMotion) return finish();
      // card can be gone after a resize rebuild, just fade out
      const home = inView(src) && src.getBoundingClientRect();
      const start = over(win, at);
      flight = win.animate(
        home ? [{ transform: start }, { transform: over(win, home) }] : [{ transform: start, opacity: 1 }, { transform: start, opacity: 0 }],
        { ...FLIGHT, duration: home ? 460 : 200, fill: "forwards" }
      );
      flight.onfinish = finish;
    }

    function finish() {
      flight = null;
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      if (src) src.classList.remove("is-away");
      content.innerHTML = "";
      lockScroll(false);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]") || e.target === scroller || e.target === content) hide();
    });
    addEventListener("keydown", (e) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        hide();
      } else if (e.key === "Tab") {
        const f = $$('a[href], button:not([disabled])', content);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1], at = document.activeElement;
        if (e.shiftKey && (at === first || at === scroller)) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && at === last) { first.focus(); e.preventDefault(); }
      }
    }, true);

    // train or grid
    document.addEventListener("click", (e) => {
      const c = e.target.closest(".pcard");
      if (!c || carousel.blockClick) return;
      show(+c.dataset.index, c);
    });

    return { get isOpen() { return open; } };
  })();

  /* contact */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-show"), 2400);
  }

  function initContact() {
    const email = D.contact.email;
    $("#copyEmail").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const ta = Object.assign(document.createElement("textarea"), { value: email });
        document.body.append(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast("Email copied");
    });

    const form = $("#contactForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field", form).forEach((f) => {
        const input = $("input, textarea", f);
        const valid = input.checkValidity() && input.value.trim() !== "";
        f.classList.toggle("is-invalid", !valid);
        input.setAttribute("aria-invalid", !valid);
        if (!valid && ok) {
          input.focus();
          ok = false;
        }
      });
      if (!ok) {
        toast("Add your name, a valid email and a message");
        return;
      }
      const d = new FormData(form);
      const subject = `Portfolio contact from ${d.get("name")}`;
      const body = `${d.get("message")}\n\n${d.get("name")} (${d.get("email")})`;
      location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast("Opening your email app…");
    });
    form.addEventListener("input", (e) => {
      e.target.closest(".field")?.classList.remove("is-invalid");
      e.target.removeAttribute("aria-invalid");
    });
  }

  /* init */
  renderStatic();
  buildClouds();
  buildSkyline();
  initExperience();
  initExpand();
  initContact();
  const nav = initNav();

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(50, now - last);
    last = now;
    stage.tick(dt);
    jump.tick(dt);
    descent.tick();
    carousel.tick(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  nav.update();
})();
