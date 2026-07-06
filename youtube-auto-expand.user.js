// ==UserScript==
// @name         YouTube 自动展开了解详情
// @name:zh-CN   YouTube 自动展开帖子与评论
// @namespace    https://github.com/codertesla/ytb-more-button
// @version      1.0.1
// @description  自动点击 YouTube 帖子和评论区中的“了解详情 / Read more / Show more”按钮，直接显示完整内容。
// @author       codertesla
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const APP = Object.freeze({
    name: 'YouTube 自动展开',
    storageKey: 'ytb_more_button_auto_expand',
    scanDelayMs: 180,
    scanIntervalMs: 1500,
    startupScans: 8,
  });

  const EXPANDER_ROOT_SELECTOR = [
    'ytd-backstage-post-renderer',
    'ytd-comment-renderer',
    'ytd-comment-view-model',
    'ytm-comment-renderer',
    'ytm-backstage-post-renderer',
  ].join(',');

  const MORE_BUTTON_SELECTOR = [
    'ytd-expander tp-yt-paper-button#more[aria-expanded="false"]',
    'ytd-expander tp-yt-paper-button[slot="more-button"][aria-expanded="false"]',
    'ytd-expander button#more[aria-expanded="false"]',
    'ytd-expander [role="button"]#more[aria-expanded="false"]',
    'ytd-text-inline-expander button[aria-expanded="false"]',
    'ytd-text-inline-expander tp-yt-paper-button[aria-expanded="false"]',
    '.more-button[slot="more-button"]',
  ].join(',');

  const MORE_TEXT_PATTERN = /^(了解详情|展开|展开正文|显示更多|更多|read more|show more|more)$/i;
  let clickedButtons = new WeakSet();
  let observer = null;
  let scanTimer = 0;
  let menuCommandId = null;
  let enabled = readEnabled();

  function readEnabled() {
    try {
      return GM_getValue(APP.storageKey, true);
    } catch (_error) {
      return true;
    }
  }

  function setEnabled(nextEnabled) {
    enabled = nextEnabled;
    try {
      GM_setValue(APP.storageKey, nextEnabled);
    } catch (_error) {
      // Ignore storage errors in userscript managers without GM storage support.
    }
    registerMenu();
    scheduleScan(0);
    console.info(`${APP.name}: 自动展开已${nextEnabled ? '开启' : '关闭'}`);
  }

  function registerMenu() {
    if (typeof GM_registerMenuCommand !== 'function') return;

    if (menuCommandId && typeof GM_unregisterMenuCommand === 'function') {
      try {
        GM_unregisterMenuCommand(menuCommandId);
      } catch (_error) {
        // Some userscript managers do not support unregistering menu commands.
      }
    }

    menuCommandId = GM_registerMenuCommand(
      `自动展开：${enabled ? '开' : '关'}`,
      () => setEnabled(!enabled)
    );
  }

  function scheduleScan(delay = APP.scanDelayMs) {
    if (!enabled) return;
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(expandVisibleContent, delay);
  }

  function expandVisibleContent() {
    if (!enabled) return;

    const roots = document.querySelectorAll(EXPANDER_ROOT_SELECTOR);
    for (const root of roots) {
      expandInsideRoot(root);
    }
  }

  function expandInsideRoot(root) {
    const buttons = root.querySelectorAll(MORE_BUTTON_SELECTOR);
    for (const button of buttons) {
      const clickTarget = normalizeClickTarget(button);
      if (!clickTarget || clickedButtons.has(clickTarget)) continue;
      if (!isExpandableButton(clickTarget)) continue;

      clickedButtons.add(clickTarget);
      clickTarget.click();
    }
  }

  function normalizeClickTarget(button) {
    if (!(button instanceof HTMLElement)) return null;

    const slottedButton = button.closest('tp-yt-paper-button, button, [role="button"]');
    if (slottedButton instanceof HTMLElement) return slottedButton;

    const assignedSlot = button.assignedSlot;
    if (assignedSlot instanceof HTMLElement) {
      const slotButton = assignedSlot.closest('tp-yt-paper-button, button, [role="button"]');
      if (slotButton instanceof HTMLElement) return slotButton;
    }

    return button;
  }

  function isExpandableButton(button) {
    if (button.hidden || button.hasAttribute('hidden')) return false;
    if (button.getAttribute('aria-disabled') === 'true') return false;
    if (button.getAttribute('disabled') !== null) return false;
    if (button.getAttribute('aria-expanded') === 'true') return false;

    const root = button.closest(EXPANDER_ROOT_SELECTOR);
    if (!root) return false;

    const labels = [
      button.getAttribute('aria-label'),
      button.textContent,
      button.querySelector('.more-button')?.textContent,
    ]
      .filter(Boolean)
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    if (labels.some((label) => MORE_TEXT_PATTERN.test(label))) return true;
    return button.matches('tp-yt-paper-button#more, button#more, [role="button"]#more');
  }

  function observePage() {
    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
      if (!enabled) return;
      if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
        scheduleScan();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function runStartupScans() {
    let remaining = APP.startupScans;
    const intervalId = window.setInterval(() => {
      if (!enabled || remaining <= 0) {
        window.clearInterval(intervalId);
        return;
      }

      expandVisibleContent();
      remaining -= 1;
    }, APP.scanIntervalMs);
  }

  registerMenu();
  observePage();
  scheduleScan(0);
  runStartupScans();

  window.addEventListener('yt-navigate-finish', () => {
    clickedButtons = new WeakSet();
    scheduleScan(300);
    runStartupScans();
  });
  window.addEventListener('scroll', () => scheduleScan(), { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scheduleScan(0);
  });
})();
