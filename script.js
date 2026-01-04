(() => {
  "use strict";

  // CSS to inject (fixes layout and hides specific ad/warning areas)
  const CSS_TEXT = `
    .erd-ads-area {
      display: none !important;
    }

    .ads-block-warning-overlay {
      display: none !important;
    }

    .wrapContentERD .erdWrap {
      width: 100% !important;
    }
  `;

  const STYLE_ID = "__erdcloud_layout_canvas_fix_style__";

  // Inject CSS once (id-based to avoid duplicates)
  function injectCSSOnce() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.type = "text/css";
    style.textContent = CSS_TEXT;
    document.head.appendChild(style);
  }

  // Resize all canvases by syncing drawing buffer size with CSS display size (with DPR)
  function resizeAllCanvases() {
    const dpr = window.devicePixelRatio || 1;

    document.querySelectorAll("canvas").forEach((canvas) => {
      const rect = canvas.getBoundingClientRect();

      // Skip canvases that are not visible / not laid out yet
      if (!rect.width || !rect.height) return;

      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      // Update only when needed to avoid unnecessary redraw cost
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Reset transform then apply DPR scaling for correct drawing coordinates
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }
    });
  }

  // Trigger a resize event so site-level handlers can react
  function dispatchResizeEvent() {
    window.dispatchEvent(new Event("resize"));
  }

  // Apply everything in a safe timing (after layout settles)
  function applyFix() {
    injectCSSOnce();

    // Use rAF to ensure layout has been computed after CSS injection
    requestAnimationFrame(() => {
      resizeAllCanvases();
      dispatchResizeEvent();
    });
  }

  // Debounce helper to avoid spamming applyFix on frequent mutations
  function debounce(fn, waitMs) {
    let timer = null;
    return () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(), waitMs);
    };
  }

  // Initial apply
  applyFix();

  // Re-apply on window resize (user resizes the browser, zoom changes, etc.)
  window.addEventListener(
    "resize",
    debounce(() => {
      resizeAllCanvases();
    }, 100),
    { passive: true }
  );

  // Observe DOM changes to handle SPA/navigation or dynamic layout updates
  const debouncedApply = debounce(applyFix, 150);

  const observer = new MutationObserver(() => {
    // If the app re-renders or replaces root nodes, ensure CSS and canvas sizing remain correct
    debouncedApply();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });
})();
