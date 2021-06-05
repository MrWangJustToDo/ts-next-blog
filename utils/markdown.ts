import Mark from "markdown-it";
import hljs from "config/highLight";
import { AddIdForHeadsType } from "types/utils";

const temp = new Mark();

const mark = new Mark({
  html: true,
  xhtmlOut: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const transformValue = hljs.highlight(lang, str, true).value;
        const transformArr = transformValue.split(/\n/).slice(0, -1);
        const minWidth = String(transformArr.length).length - 0.4;
        const html = transformArr.reduce(
          (p: string, c: string, idx: number) =>
            `${p}<span class='d-inline-block text-center border-right pr-2 mr-2 border-dark' style='min-width: ${minWidth}em; line-height: 1.5'>${
              idx + 1
            }</span>${c}\n`,
          `<div class='overflow-hidden w-100 border-bottom border-dark mb-2'><span style='opacity: 0'>1</span><b class='text-info position-absolute' style='left: 10px'>${lang}</b></div>`
        );
        return `<pre class="rounded position-relative"><code class="hljs ${lang} p-2" style='font-size: 16px'>${html}</code></pre>`;
      } catch (__) {}
    }
    return '<pre class="rounded"><code class="hljs">' + temp.utils.escapeHtml(str) + "</code></pre>";
  },
});

const addIdForHeads: AddIdForHeadsType = (className) => {
  if (className) {
    const headings = document.querySelector(className)?.querySelectorAll("h1, h2, h3, h4, h5, h6, h7") || [];
    const headingMap: { [props: string]: number } = {};
    Array.prototype.forEach.call(headings, function (heading) {
      const id = heading.id
        ? heading.id
        : heading.textContent
            .trim()
            .toLowerCase()
            .split(" ")
            .join("-")
            .replace(/[!@#$%^&*():]/gi, "")
            .replace(/\//gi, "-");
      headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0;
      if (headingMap[id]) {
        heading.id = id + "-" + headingMap[id];
      } else {
        heading.id = id;
      }
    });
    return !!headings.length;
  }
};

const markNOLineNumber = new Mark({
  html: true,
  xhtmlOut: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const transformValue = hljs.highlight(lang, str, true).value;
        return `<pre class="rounded bg-dark"><code class="bg-dark hljs ${lang}">${transformValue}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="rounded bg-dark"><code class="bg-dark hljs">${temp.utils.escapeHtml(str)}</code></pre>`;
  },
});

export { mark, markNOLineNumber, addIdForHeads };
