import { useEffect } from "react";
import {
  translateItalian,
  type TranslationContext,
} from "./italian-translation-engine";

const EXCLUDED_SELECTOR = [
  "code",
  "pre",
  "textarea",
  ".font-mono",
  "[data-terminal]",
  "[data-log-line]",
  "[contenteditable='true']",
  "[data-no-translate]",
].join(", ");

const TRANSLATABLE_ATTRIBUTES = [
  "placeholder",
  "title",
  "aria-label",
  "aria-description",
  "data-placeholder",
] as const;

type TranslationSnapshot = { source: string; output: string };

function inferContext(element: Element): TranslationContext {
  if (element.closest("[data-sonner-toast], [role='status'], [role='alert']"))
    return "notification";
  if (element.closest("[role='dialog'], [role='alertdialog']")) return "dialog";
  if (element.closest("option, [role='option'], [role='listbox']")) return "option";
  if (element.closest("nav, [role='navigation'], [data-sidebar]"))
    return "navigation";
  if (element.closest("button, [role='button'], [role='menuitem']")) return "action";
  if (element.closest("form, label, input, select, [role='combobox']")) return "form";
  if (element.closest("table, [role='table'], [role='grid']")) return "table";
  if (
    element.closest(
      "[data-status], [data-state], [role='progressbar'], [aria-live='polite']",
    )
  )
    return "status";
  if (element.closest("p, [data-description]")) return "description";
  return "generic";
}

function isExcluded(element: Element) {
  return Boolean(element.closest(EXCLUDED_SELECTOR));
}

export function ItalianLocalizationProvider() {
  useEffect(() => {
    document.documentElement.lang = "it";

    const textSnapshots = new WeakMap<Text, TranslationSnapshot>();
    const attributeSnapshots = new WeakMap<Element, Map<string, TranslationSnapshot>>();
    const pendingRoots = new Set<Node>();
    let animationFrame: number | undefined;

    const translateTextNode = (node: Text) => {
      const parent = node.parentElement;
      if (!parent || isExcluded(parent)) return;

      const previous = textSnapshots.get(node);
      if (previous?.output === node.data) return;

      const source = node.data;
      const output = translateItalian(source, inferContext(parent));
      textSnapshots.set(node, { source, output });
      if (output !== source) node.data = output;
    };

    const translateAttributes = (element: Element) => {
      if (isExcluded(element)) return;
      const context = inferContext(element);
      const snapshots = attributeSnapshots.get(element) ?? new Map();

      for (const attribute of TRANSLATABLE_ATTRIBUTES) {
        const current = element.getAttribute(attribute);
        if (!current) continue;

        const previous = snapshots.get(attribute);
        if (previous?.output === current) continue;

        const output = translateItalian(current, context);
        snapshots.set(attribute, { source: current, output });
        if (output !== current) element.setAttribute(attribute, output);
      }

      if (
        element instanceof HTMLInputElement &&
        ["button", "reset", "submit"].includes(element.type) &&
        element.value
      ) {
        const attribute = "value";
        const current = element.value;
        const previous = snapshots.get(attribute);
        if (previous?.output !== current) {
          const output = translateItalian(current, "action");
          snapshots.set(attribute, { source: current, output });
          if (output !== current) element.value = output;
        }
      }

      attributeSnapshots.set(element, snapshots);
    };

    const processRoot = (root: Node) => {
      if (root instanceof Text) {
        translateTextNode(root);
        return;
      }
      if (!(root instanceof Element || root instanceof DocumentFragment)) return;

      if (root instanceof Element) translateAttributes(root);

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      );
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node instanceof Text) translateTextNode(node);
        else if (node instanceof Element) translateAttributes(node);
      }
    };

    const flush = () => {
      animationFrame = undefined;
      const roots = [...pendingRoots];
      pendingRoots.clear();
      for (const root of roots) processRoot(root);
    };

    const schedule = (root: Node) => {
      pendingRoots.add(root);
      if (animationFrame === undefined)
        animationFrame = window.requestAnimationFrame(flush);
    };

    processRoot(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          schedule(mutation.target);
          continue;
        }
        if (mutation.type === "attributes") {
          schedule(mutation.target);
          continue;
        }
        for (const node of mutation.addedNodes) schedule(node);
      }
    });

    observer.observe(document.body, {
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
      pendingRoots.clear();
    };
  }, []);

  return null;
}
