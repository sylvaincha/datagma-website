/* Decap CMS admin customizations:
   - modern-ish preview template close to the blog layout
   - preview styles
*/

(function () {
  function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") return fn();
    document.addEventListener("DOMContentLoaded", fn);
  }

  function register() {
    if (!window.CMS || !window.createClass || !window.h) return false;

    // Preview styling
    try {
      window.CMS.registerPreviewStyle("/admin/preview.css");
    } catch {}

    // ---------
    // Markdown editor components (toolbar)
    // ---------

    // ---------
    // Clipboard image paste → upload to /public/uploads → insert markdown
    // Local only (uses decap-server).
    // ---------
    (function () {
      var host = window.location.hostname;
      var isLocal = host === "localhost" || host === "127.0.0.1";
      if (!isLocal) return;

      var PROXY_URL = "http://localhost:8081/api/v1";
      var MEDIA_FOLDER = "public/uploads";
      var PUBLIC_FOLDER = "/uploads";
      var MAX_BYTES = 12 * 1024 * 1024; // 12MB safety

      var uploading = false;

      function toast(msg) {
        try {
          var id = "ecm-clipboard-toast";
          var el = document.getElementById(id);
          if (!el) {
            el = document.createElement("div");
            el.id = id;
            el.style.position = "fixed";
            el.style.right = "16px";
            el.style.bottom = "16px";
            el.style.zIndex = "99999";
            el.style.background = "rgba(15,23,42,0.92)";
            el.style.color = "white";
            el.style.padding = "10px 12px";
            el.style.borderRadius = "12px";
            el.style.font = "600 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
            el.style.boxShadow = "0 10px 30px rgba(0,0,0,0.18)";
            el.style.maxWidth = "320px";
            el.style.pointerEvents = "none";
            document.body.appendChild(el);
          }
          el.textContent = msg;
          el.style.opacity = "1";
          clearTimeout(el.__t);
          el.__t = setTimeout(function () {
            el.style.opacity = "0";
          }, 2200);
        } catch {}
      }

      function extForType(type) {
        var t = String(type || "").toLowerCase();
        if (t === "image/png") return "png";
        if (t === "image/jpeg" || t === "image/jpg") return "jpg";
        if (t === "image/webp") return "webp";
        if (t === "image/gif") return "gif";
        if (t === "image/svg+xml") return "svg";
        return "png";
      }

      function arrayBufferToBase64(buf) {
        var bytes = new Uint8Array(buf);
        var chunk = 0x8000;
        var binary = "";
        for (var i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        }
        return btoa(binary);
      }

      function findHtmlImgSrcs(html) {
        var s = String(html || "");
        if (!s) return [];
        var out = [];
        var re = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
        var m;
        while ((m = re.exec(s))) {
          if (m && m[1]) out.push(m[1]);
          if (out.length >= 10) break;
        }
        return out;
      }

      function parseDataImageUrl(url) {
        var u = String(url || "");
        var m = u.match(/^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i);
        if (!m) return null;
        return { mime: m[1], base64: m[2] };
      }

      function makePaths(mime) {
        var now = new Date();
        var y = String(now.getFullYear());
        var mo = String(now.getMonth() + 1).padStart(2, "0");
        var base =
          "clipboard-" +
          now.toISOString().replace(/[:.]/g, "-") +
          "-" +
          Math.random().toString(16).slice(2, 8);
        var ext = extForType(mime);
        var rel = y + "/" + mo + "/" + base + "." + ext;
        return {
          assetPath: MEDIA_FOLDER + "/" + rel,
          publicUrl: PUBLIC_FOLDER + "/" + rel,
        };
      }

      function isInMarkdownEditor(activeEl) {
        if (!activeEl) return false;
        if (!document.getElementById("nc-root")) return false;
        if (!activeEl.closest || !activeEl.closest("#nc-root")) return false;
        if (activeEl.closest(".CodeMirror")) return true;
        // Rich text mode uses a contenteditable (Slate). We still want to intercept image paste.
        if (activeEl.isContentEditable) return true;
        var ce = activeEl.closest ? activeEl.closest('[contenteditable="true"]') : null;
        if (ce) return true;
        // Raw mode often uses a textarea – allow only if focused element is a textarea/input.
        var tag = String(activeEl.tagName || "").toLowerCase();
        return tag === "textarea" || tag === "input";
      }

      function getActiveCodeMirror() {
        var a = document.activeElement;
        var cmWrap = a && a.closest ? a.closest(".CodeMirror") : null;
        var el = cmWrap || document.querySelector(".CodeMirror");
        return el && el.CodeMirror ? el.CodeMirror : null;
      }

      function findModeControls() {
        var root = document.getElementById("nc-root") || document;
        // Most reliable: find the "Rich Text" and "Markdown" labels and compute their nearest common ancestor.
        var labels = root.querySelectorAll ? root.querySelectorAll("button,span,label,div") : [];
        var richEls = [];
        var mdEls = [];
        for (var i = 0; i < labels.length; i++) {
          var el = labels[i];
          if (!el) continue;
          var t = (el.textContent || "").trim();
          if (t === "Rich Text") richEls.push(el);
          else if (t === "Markdown") mdEls.push(el);
        }
        function ancestors(node) {
          var out = [];
          var n = node;
          var guard = 0;
          while (n && guard++ < 25) {
            out.push(n);
            n = n.parentElement;
          }
          return out;
        }
        function commonAncestor(a, b) {
          var aa = ancestors(a);
          var bb = ancestors(b);
          for (var i2 = 0; i2 < aa.length; i2++) {
            if (bb.indexOf(aa[i2]) !== -1) return aa[i2];
          }
          return null;
        }
        var best = null;
        var bestDepth = 999;
        for (var r = 0; r < richEls.length; r++) {
          for (var m = 0; m < mdEls.length; m++) {
            var ca = commonAncestor(richEls[r], mdEls[m]);
            if (!ca) continue;
            // Prefer the closest (smallest) container.
            var depth = ancestors(ca).length;
            if (depth < bestDepth) {
              bestDepth = depth;
              best = { container: ca, richEl: richEls[r], markdownEl: mdEls[m] };
            }
          }
        }
        if (!best) return null;

        // Find a nearby switch element inside the container (optional).
        var switchEl =
          (best.container && best.container.querySelector
            ? best.container.querySelector('[role="switch"], input[type="checkbox"]')
            : null) || null;
        best.switchEl = switchEl;
        return best;
      }

      function waitFor(fn, ms) {
        var timeout = typeof ms === "number" ? ms : 1500;
        return new Promise(function (resolve) {
          var start = Date.now();
          var t = setInterval(function () {
            var ok = false;
            try {
              ok = !!fn();
            } catch {}
            if (ok) {
              clearInterval(t);
              resolve(true);
              return;
            }
            if (Date.now() - start > timeout) {
              clearInterval(t);
              resolve(false);
            }
          }, 50);
        });
      }

      async function ensureMarkdownMode() {
        if (document.querySelector(".CodeMirror")) return true;
        var ctl = findModeControls();
        if (ctl) {
          if (ctl.markdownEl && ctl.markdownEl.click) ctl.markdownEl.click();
          else if (ctl.switchEl && ctl.switchEl.click) ctl.switchEl.click();
        }
        return await waitFor(function () {
          return document.querySelector(".CodeMirror");
        }, 2000);
      }

      async function ensureRichTextMode() {
        if (!document.querySelector(".CodeMirror")) return true;
        var ctl = findModeControls();
        if (ctl) {
          if (ctl.richEl && ctl.richEl.click) ctl.richEl.click();
          else if (ctl.switchEl && ctl.switchEl.click) ctl.switchEl.click();
        }
        return await waitFor(function () {
          return !document.querySelector(".CodeMirror");
        }, 2000);
      }

      async function withRawMode(fn) {
        var startedRaw = !!document.querySelector(".CodeMirror");
        if (!startedRaw) await ensureMarkdownMode();
        var res = await fn();
        if (!startedRaw) {
          await ensureRichTextMode();
          // Give Decap a beat to re-parse markdown into rich text.
          await new Promise(function (r) {
            setTimeout(r, 120);
          });
        }
        return res;
      }

      function insertAtCursor(markdown) {
        var cm = getActiveCodeMirror();
        if (cm && typeof cm.replaceSelection === "function") {
          cm.replaceSelection(markdown);
          cm.focus();
          try {
            if (typeof cm.save === "function") cm.save();
            var inp = cm.getInputField ? cm.getInputField() : null;
            if (inp && inp.dispatchEvent) {
              inp.dispatchEvent(new Event("input", { bubbles: true }));
              inp.dispatchEvent(new Event("change", { bubbles: true }));
            }
          } catch {}
          return true;
        }
        var a = document.activeElement;
        if (a && (a.tagName === "TEXTAREA" || a.tagName === "INPUT") && typeof a.setRangeText === "function") {
          var start = a.selectionStart || 0;
          var end = a.selectionEnd || 0;
          a.setRangeText(markdown, start, end, "end");
          return true;
        }
        // Rich text mode: insert text at selection inside contenteditable.
        try {
          if (a && (a.isContentEditable || (a.closest && a.closest('[contenteditable="true"]')))) {
            // Works in most browsers even though deprecated.
            if (document.queryCommandSupported && document.queryCommandSupported("insertText")) {
              document.execCommand("insertText", false, markdown);
              return true;
            }
            var sel = window.getSelection && window.getSelection();
            if (sel && sel.rangeCount) {
              var range = sel.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(markdown));
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
              return true;
            }
          }
        } catch {}
        return false;
      }

      async function persistMedia(assetPath, base64, name) {
        var payload = {
          action: "persistMedia",
          params: {
            branch: "main",
            asset: { path: assetPath, content: base64, encoding: "base64" },
            options: { commitMessage: "Upload media via clipboard paste" },
          },
        };
        var res = await fetch(PROXY_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          var txt = "";
          try {
            txt = await res.text();
          } catch {}
          throw new Error("Upload failed (" + res.status + "): " + (txt || name || assetPath));
        }
        return await res.json();
      }

      document.addEventListener(
        "paste",
        function (e) {
          try {
            if (uploading) return;
            if (!isInMarkdownEditor(document.activeElement)) return;
            var cd = e.clipboardData;
            if (!cd || !cd.items) return;
            var files = [];
            for (var i = 0; i < cd.items.length; i++) {
              var it = cd.items[i];
              if (!it) continue;
              if (it.kind === "file" && it.type && String(it.type).startsWith("image/")) {
                var f = it.getAsFile && it.getAsFile();
                if (f) files.push(f);
              }
            }
            // Some browsers/apps copy images as HTML <img src="data:image/..."> (no file item).
            var html = "";
            try {
              html = cd.getData ? cd.getData("text/html") : "";
            } catch {}
            var htmlImgSrcs = findHtmlImgSrcs(html);
            var hasImageIntent = files.length > 0 || htmlImgSrcs.length > 0;
            if (!hasImageIntent) return;

            // Prevent Decap's default handler (it can crash on pasted images in rich_text mode).
            e.preventDefault();

            uploading = true;
            toast("Upload de l’image…");

            (async function () {
              // 1) Handle real image files (screenshots, etc.)
              for (var j = 0; j < files.length; j++) {
                var file = files[j];
                if (!file) continue;
                if (file.size && file.size > MAX_BYTES)
                  throw new Error("Image trop lourde (" + Math.round(file.size / 1024 / 1024) + "MB)");
                var paths = makePaths(file.type || "");
                var buf = await file.arrayBuffer();
                var base64 = arrayBufferToBase64(buf);
                await persistMedia(paths.assetPath, base64, file.name);
                var md = "\n![](" + paths.publicUrl + ")\n";
                await withRawMode(function () {
                  insertAtCursor(md);
                });
              }

              // 2) Handle HTML-copied images (data URLs, sometimes remote URLs)
              if (!files.length && htmlImgSrcs.length) {
                for (var k = 0; k < htmlImgSrcs.length; k++) {
                  var src = htmlImgSrcs[k];
                  if (!src) continue;
                  var data = parseDataImageUrl(src);
                  if (data) {
                    var p2 = makePaths(data.mime || "image/png");
                    await persistMedia(p2.assetPath, data.base64, "clipboard");
                    await withRawMode(function () {
                      insertAtCursor("\n![](" + p2.publicUrl + ")\n");
                    });
                    continue;
                  }

                  // Best-effort for remote image URLs (may fail due to CORS).
                  if (/^https?:\/\//i.test(src)) {
                    try {
                      var resp = await fetch(src, { mode: "cors" });
                      if (!resp.ok) throw new Error("HTTP " + resp.status);
                      var ct = resp.headers.get("content-type") || "image/png";
                      var ab = await resp.arrayBuffer();
                      var p3 = makePaths(ct);
                      await persistMedia(p3.assetPath, arrayBufferToBase64(ab), "clipboard-remote");
                      await withRawMode(function () {
                        insertAtCursor("\n![](" + p3.publicUrl + ")\n");
                      });
                    } catch (err2) {
                      throw new Error(
                        "Image copiée depuis le web: impossible à récupérer (CORS). Fais une capture d’écran, ou télécharge le fichier puis insère-le via le bouton Image.",
                      );
                    }
                  }
                }
              }

              toast("Image collée et ajoutée ✅");
            })()
              .catch(function (err) {
                var msg = (err && err.message) || String(err || "Erreur inconnue");
                toast("Échec upload image: " + msg);
                try {
                  console.error("[clipboard-image]", err);
                } catch {}
              })
              .finally(function () {
                uploading = false;
              });
          } catch {}
        },
        true,
      );
    })();

    function quoteLines(s) {
      return String(s || "")
        .split("\n")
        .map(function (l) {
          return "> " + l;
        })
        .join("\n");
    }

    function unquoteLines(s) {
      return String(s || "")
        .split("\n")
        .map(function (l) {
          return l.replace(/^>\s?/, "");
        })
        .join("\n");
    }

    try {
      window.CMS.registerEditorComponent({
        id: "callout",
        label: "Callout (Astuce / Note / Attention)",
        fields: [
          {
            name: "kind",
            label: "Type",
            widget: "select",
            options: ["Astuce", "Note", "Attention"],
            default: "Astuce",
          },
          { name: "title", label: "Titre", widget: "string", required: false },
          { name: "body", label: "Texte", widget: "text" },
        ],
        pattern: /^>\s\*\*(Astuce|Note|Attention):\*\*\s?(.*?)\n([\s\S]*)$/,
        fromBlock: function (match) {
          return {
            kind: match[1],
            title: match[2],
            body: unquoteLines(match[3]),
          };
        },
        toBlock: function (obj) {
          var head = "> **" + (obj.kind || "Astuce") + ":**" + (obj.title ? " " + obj.title : "");
          var body = quoteLines(obj.body || "");
          return head + "\n" + body + "\n";
        },
        toPreview: function (obj) {
          return (
            "<blockquote><p><strong>" +
            (obj.kind || "Astuce") +
            ":</strong> " +
            (obj.title || "") +
            "</p><p>" +
            String(obj.body || "").replace(/\n/g, "<br/>") +
            "</p></blockquote>"
          );
        },
      });
    } catch {}

    try {
      window.CMS.registerEditorComponent({
        id: "cta",
        label: "Bouton CTA",
        fields: [
          { name: "label", label: "Texte du bouton", widget: "string" },
          { name: "url", label: "URL", widget: "string" },
          {
            name: "variant",
            label: "Style",
            widget: "select",
            options: ["primary", "secondary"],
            default: "primary",
          },
        ],
        pattern:
          /^<p><a class="ecm-cta (primary|secondary)" href="([^"]+)"[^>]*>([^<]+)<\/a><\/p>$/m,
        fromBlock: function (match) {
          return { variant: match[1], url: match[2], label: match[3] };
        },
        toBlock: function (obj) {
          var variant = obj.variant === "secondary" ? "secondary" : "primary";
          return (
            '<p><a class="ecm-cta ' +
            variant +
            '" href="' +
            String(obj.url || "#") +
            '" target="_blank" rel="noreferrer">' +
            String(obj.label || "En savoir plus") +
            "</a></p>\n"
          );
        },
        toPreview: function (obj) {
          var variant = obj.variant === "secondary" ? "secondary" : "primary";
          return (
            '<p><a class="ecm-cta ' +
            variant +
            '" href="' +
            String(obj.url || "#") +
            '">' +
            String(obj.label || "En savoir plus") +
            "</a></p>"
          );
        },
      });
    } catch {}

    try {
      window.CMS.registerEditorComponent({
        id: "figure",
        label: "Image + légende",
        fields: [
          { name: "src", label: "Image", widget: "image" },
          { name: "alt", label: "Alt", widget: "string", required: false },
          { name: "caption", label: "Légende", widget: "string", required: false },
        ],
        pattern: /^<figure>\s*<img src="([^"]+)" alt="([^"]*)"\s*\/>\s*(?:<figcaption>([\s\S]*?)<\/figcaption>)?\s*<\/figure>$/m,
        fromBlock: function (match) {
          return { src: match[1], alt: match[2], caption: match[3] || "" };
        },
        toBlock: function (obj) {
          var alt = String(obj.alt || "").replace(/"/g, "&quot;");
          var cap = obj.caption ? "<figcaption>" + String(obj.caption) + "</figcaption>" : "";
          return '<figure><img src="' + obj.src + '" alt="' + alt + '" />' + cap + "</figure>\n";
        },
        toPreview: function (obj) {
          var src = this.props.getAsset(obj.src);
          var alt = String(obj.alt || "");
          return (
            '<figure style="margin:16px 0"><img style="max-width:100%;border-radius:12px;border:1px solid #e2e8f0" src="' +
            (src ? src.toString() : obj.src) +
            '" alt="' +
            alt +
            '"/>' +
            (obj.caption ? '<figcaption style="color:#475569;margin-top:8px">' + obj.caption + "</figcaption>" : "") +
            "</figure>"
          );
        },
      });
    } catch {}

    try {
      window.CMS.registerEditorComponent({
        id: "youtube",
        label: "YouTube",
        fields: [{ name: "url", label: "URL YouTube", widget: "string" }],
        pattern: /^<div class="ecm-video"><iframe[^>]*src="([^"]+)"[\s\S]*?<\/iframe><\/div>$/m,
        fromBlock: function (match) {
          return { url: match[1] };
        },
        toBlock: function (obj) {
          var url = String(obj.url || "").trim();
          // Accept full URL and try to convert to embed when possible.
          var embed = url;
          var m = url.match(/v=([a-zA-Z0-9_-]{6,})/);
          if (m && m[1]) embed = "https://www.youtube.com/embed/" + m[1];
          var m2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
          if (m2 && m2[1]) embed = "https://www.youtube.com/embed/" + m2[1];
          return (
            '<div class="ecm-video"><iframe src="' +
            embed +
            '" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>\n'
          );
        },
        toPreview: function (obj) {
          return '<div class="ecm-video"><iframe src="' + String(obj.url || "") + '" loading="lazy"></iframe></div>';
        },
      });
    } catch {}

    var ArticlePreview = window.createClass({
      render: function () {
        var entry = this.props.entry;
        var data = entry && entry.get ? entry.get("data") : null;

        var title = entry.getIn ? entry.getIn(["data", "title"]) : (data && data.title) || "";
        var description = entry.getIn ? entry.getIn(["data", "description"]) : (data && data.description) || "";
        var images = entry.getIn ? entry.getIn(["data", "images"]) : (data && data.images) || null;
        var hero = "";

        // images is usually an Immutable List
        if (images && images.get && images.size) hero = images.get(0);
        else if (Array.isArray(images) && images.length) hero = images[0];

        var heroAsset = hero ? this.props.getAsset(hero) : null;

        return window.h(
          "div",
          { className: "ecm-container" },
          window.h(
            "header",
            { className: "ecm-header" },
            window.h("h1", null, title),
            description ? window.h("p", { className: "ecm-description" }, description) : null
          ),
          heroAsset
            ? window.h(
                "div",
                { className: "ecm-hero" },
                window.h("img", { src: heroAsset.toString(), alt: title })
              )
            : null,
          window.h("div", { className: "ecm-body" }, this.props.widgetFor("body"))
        );
      },
    });

    var collections = [
      "blog_en",
      "blog_fr",
      "blog_de",
      "blog_nl",
      "blog_it",
      "blog_es",
      "blog_pt",
    ];
    collections.forEach(function (name) {
      try {
        window.CMS.registerPreviewTemplate(name, ArticlePreview);
      } catch {}
    });

    return true;
  }

  onReady(function () {
    // Decap loads async; poll briefly.
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (register() || tries > 50) clearInterval(t);
    }, 100);

    // Rebrand "Login with GitHub" → "Login with Google"
    var labelTries = 0;
    var lt = setInterval(function () {
      labelTries++;
      var buttons = document.querySelectorAll("button, [role='button'], a");
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        if (btn.textContent && btn.textContent.trim() === "Login with GitHub") {
          btn.textContent = "Login with Google";
        }
      }
      if (labelTries > 100) clearInterval(lt);
    }, 150);
  });
})();

