// 语法高亮
import Hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import less from "highlight.js/lib/languages/less";
import scss from "highlight.js/lib/languages/scss";
import shell from "highlight.js/lib/languages/shell";
import xml from "highlight.js/lib/languages/xml";
import sql from 'highlight.js/lib/languages/sql';
// import "highlight.js/styles/monokai-sublime.css";
import "highlight.js/styles/github-dark.css";

Hljs.registerLanguage("css", css);
Hljs.registerLanguage("json", json);
Hljs.registerLanguage("java", java);
Hljs.registerLanguage("javascript", javascript);
Hljs.registerLanguage("typescript", typescript);
Hljs.registerLanguage("less", less);
Hljs.registerLanguage("scss", scss);
Hljs.registerLanguage("shell", shell);
Hljs.registerLanguage("xml", xml);
Hljs.registerLanguage("sql", sql);

export default Hljs;
