/**
 * Inline script for the root layout <head>, run before any app chunk.
 *
 * A browser older than the build target can't parse the app's chunks, so React
 * never starts and the server-rendered spinner stays forever. This script is
 * plain ES5 so it runs anyway: it shows a "browser too old" screen when a
 * required feature is missing, and a "loading failed" screen with a Reload
 * button when the app hasn't started after WATCHDOG_MS (blocked chunk, network
 * or extension). W3pkProvider sets window.__genjiReady on mount; setting it
 * later removes the "loading failed" screen.
 */

import { translations } from '@/translations'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type Language } from '@/utils/i18n'

const WATCHDOG_MS = 15000

const RTL_LANGUAGES: Language[] = ['ar', 'ur']

function serialize(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function getBrowserCompatScript(): string {
  const strings = Object.fromEntries(
    (Object.keys(SUPPORTED_LANGUAGES) as Language[]).map(lang => [lang, translations[lang].compat])
  )

  return `(function () {
  var S = ${serialize(strings)};
  var RTL = ${serialize(RTL_LANGUAGES)};
  var overlay = null;
  var kind = null;
  var ready = false;

  function pickLanguage() {
    var stored = null;
    try {
      stored = window.localStorage.getItem('userLanguage');
    } catch (e) {}
    if (stored && S.hasOwnProperty(stored)) return stored;
    var nav = ((navigator && navigator.language) || '').split('-')[0];
    return S.hasOwnProperty(nav) ? nav : ${serialize(DEFAULT_LANGUAGE)};
  }

  function el(tag, style, text) {
    var node = document.createElement(tag);
    node.style.cssText = style;
    if (text) node.appendChild(document.createTextNode(text));
    return node;
  }

  function show(which) {
    if (overlay) return;
    var lang = pickLanguage();
    var t = S[lang];
    var tooOld = which === 'old';
    kind = which;
    overlay = el('div', 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#0a0a0a;color:#f5f5f5;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;line-height:1.5');
    overlay.setAttribute('role', 'alert');
    overlay.setAttribute('lang', lang);
    overlay.setAttribute('dir', RTL.indexOf(lang) === -1 ? 'ltr' : 'rtl');
    overlay.appendChild(el('h1', 'margin:0 0 12px;font-size:24px;font-weight:600', tooOld ? t.tooOldTitle : t.loadFailedTitle));
    overlay.appendChild(el('p', 'margin:0 0 24px;max-width:480px;font-size:16px;color:#bdbdbd', tooOld ? t.tooOldBody : t.loadFailedBody));
    var actions = el('div', 'display:flex;flex-wrap:wrap;gap:12px;justify-content:center', '');
    var buttonStyle = 'display:inline-block;padding:10px 20px;border:0;border-radius:6px;background:#8c1c84;color:#fff;font-size:16px;text-decoration:none;cursor:pointer';
    if (tooOld) {
      var links = [['Chrome', 'https://www.google.com/chrome/'], ['Firefox', 'https://www.mozilla.org/firefox/']];
      for (var i = 0; i < links.length; i++) {
        var a = el('a', buttonStyle, links[i][0]);
        a.href = links[i][1];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        actions.appendChild(a);
      }
    } else {
      var button = el('button', buttonStyle, t.reload);
      button.type = 'button';
      button.onclick = function () {
        window.location.reload();
      };
      actions.appendChild(button);
    }
    overlay.appendChild(actions);
    document.body.appendChild(overlay);
  }

  function whenBodyReady(fn) {
    if (document.body) fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var missingFeature =
    typeof Array.prototype.at !== 'function' ||
    typeof window.structuredClone !== 'function' ||
    (window.isSecureContext === true && typeof window.PublicKeyCredential === 'undefined');

  if (missingFeature) {
    whenBodyReady(function () {
      show('old');
    });
    return;
  }

  try {
    Object.defineProperty(window, '__genjiReady', {
      configurable: true,
      get: function () {
        return ready;
      },
      set: function (value) {
        ready = value === true;
        if (ready && kind === 'failed' && overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
          overlay = null;
          kind = null;
        }
      },
    });
  } catch (e) {}

  setTimeout(function () {
    if (window.__genjiReady !== true) {
      whenBodyReady(function () {
        show('failed');
      });
    }
  }, ${WATCHDOG_MS});
})();`
}
