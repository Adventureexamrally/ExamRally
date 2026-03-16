import jsPDF from "jspdf";
import { fonts } from "./fonts.js";

/* ================= IMAGE HELPERS ================= */

const LOGO_URL = "https://examrally.in/assets/logo-DuhjVB4Q.png";
const LOGO_WIDTH = 25; // mm

let cachedLogo = null;
let fontsRegistered = false;

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

const registerFonts = (doc) => {
  if (fontsRegistered || !fonts) return;

  const stripBase64Prefix = (str) => {
    if (typeof str !== "string") return str;
    return str.replace(/^data:font\/[a-z]+;base64,/, "");
  };

  try {
    // Tamil Fonts
    if (fonts.NotoSansTamil) {
      doc.addFileToVFS(
        "NotoSansTamil-Regular.ttf",
        stripBase64Prefix(fonts.NotoSansTamil)
      );
      doc.addFont("NotoSansTamil-Regular.ttf", "NotoSansTamil", "normal");
    }
    if (fonts.NotoSansTamilBold) {
      doc.addFileToVFS(
        "NotoSansTamil-Bold.ttf",
        stripBase64Prefix(fonts.NotoSansTamilBold)
      );
      doc.addFont("NotoSansTamil-Bold.ttf", "NotoSansTamil", "bold");
    }

    // Devanagari (Hindi) Fonts
    if (fonts.NotoSansDevanagari) {
      doc.addFileToVFS(
        "NotoSansDevanagari-Regular.ttf",
        stripBase64Prefix(fonts.NotoSansDevanagari)
      );
      doc.addFont(
        "NotoSansDevanagari-Regular.ttf",
        "NotoSansDevanagari",
        "normal"
      );
    }
    if (fonts.NotoSansDevanagariBold) {
      doc.addFileToVFS(
        "NotoSansDevanagari-Bold.ttf",
        stripBase64Prefix(fonts.NotoSansDevanagariBold)
      );
      doc.addFont("NotoSansDevanagari-Bold.ttf", "NotoSansDevanagari", "bold");
    }

    fontsRegistered = true;
  } catch (error) {
    console.warn("Failed to register custom fonts:", error);
  }
};

/* ================= MAIN FUNCTION ================= */

export const generateImageEnabledPDF = async (questions, options = {}) => {
  const {
    title = "Exam PDF",
    sectionTitle = "1. Questions",
    explanationTitle = "2. Answer & Explanation",
    watermarkText = "ExamRally",
    language = "english",
  } = options;

  const doc = new jsPDF("p", "mm", "a4");

  /* -------- REGISTER FONTS -------- */
  registerFonts(doc);

  /* -------- SELECT FONT BASED ON LANGUAGE -------- */
  let currentFont = "helvetica";
  if (language === "tamil" && fonts.NotoSansTamil) {
    currentFont = "NotoSansTamil";
  } else if (language === "hindi" && fonts.NotoSansDevanagari) {
    currentFont = "NotoSansDevanagari";
  }

  /* -------- PAGE CONFIG -------- */
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const MARGIN = 15;
  const HEADER_HEIGHT = 22;
  const FOOTER_HEIGHT = 15;
  const LINE_HEIGHT = 7;

  const CONTENT_WIDTH = pageWidth - MARGIN * 2;
  const IMAGE_MAX_WIDTH = CONTENT_WIDTH * 0.65;
  const IMAGE_MAX_HEIGHT = 90;

  let cursorY = HEADER_HEIGHT + 5;

  /* -------- LOAD LOGO ONCE -------- */
  if (!cachedLogo) {
    try {
      cachedLogo = await loadImage(LOGO_URL);
    } catch {
      cachedLogo = null;
    }
  }

  /* -------- HEADER / FOOTER / WATERMARK -------- */

  const addWatermark = () => {
    doc.saveGraphicsState();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(235);
    doc.text(watermarkText, pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    });
    doc.restoreGraphicsState();
  };

  const addHeader = () => {
    addWatermark();

    if (cachedLogo) {
      const logoHeight = (cachedLogo.height * LOGO_WIDTH) / cachedLogo.width;
      doc.addImage(cachedLogo, "PNG", MARGIN, 6, LOGO_WIDTH, logoHeight);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(37, 138, 20);
      doc.text("ExamRally", MARGIN, 12);
    }

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(title, pageWidth / 2, 12, { align: "center" });

    doc.setDrawColor(37, 138, 20);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, 16, pageWidth - MARGIN, 16);
  };

  const addFooter = (pageNo, total) => {
    doc.setDrawColor(37, 138, 20);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, pageHeight - 15, pageWidth - MARGIN, pageHeight - 15);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Page ${pageNo} of ${total}`, pageWidth - MARGIN, pageHeight - 8, {
      align: "right",
    });
  };

  const newPage = () => {
    doc.addPage();
    addHeader();
    cursorY = HEADER_HEIGHT + 5;
  };

  const checkPageBreak = (height = LINE_HEIGHT) => {
    if (cursorY + height > pageHeight - FOOTER_HEIGHT) {
      newPage();
    }
  };

  /* -------- TEXT PRINTER -------- */

  const decodeHtmlEntities = (text) => {
    const entityMap = {
      "&times;": "×",
      "&divide;": "÷",
      "&plus;": "+",
      "&minus;": "−",
      "&equals;": "=",
      "&plusmn;": "±",
      "&lt;": "<",
      "&gt;": ">",
      "&le;": "≤",
      "&ge;": "≥",
      "&ne;": "≠",
      "&equiv;": "≡",
      "&asymp;": "≈",
      "&cong;": "≅",
      "&prop;": "∝",
      "&frac12;": "½",
      "&frac14;": "¼",
      "&frac34;": "¾",
      "&frac13;": "⅓",
      "&frac23;": "⅔",
      "&sup2;": "²",
      "&sup3;": "³",
      "&sup1;": "¹",
      "&isin;": "∈",
      "&notin;": "∉",
      "&sub;": "⊂",
      "&sube;": "⊆",
      "&sup;": "⊃",
      "&supe;": "⊇",
      "&cup;": "∪",
      "&cap;": "∩",
      "&empty;": "∅",
      "&exist;": "∃",
      "&forall;": "∀",
      "&and;": "∧",
      "&or;": "∨",
      "&not;": "¬",
      "&rArr;": "⇒",
      "&lArr;": "⇐",
      "&hArr;": "⇔",
      "&rarr;": "→",
      "&larr;": "←",
      "&harr;": "↔",
      "&alpha;": "α",
      "&beta;": "β",
      "&gamma;": "γ",
      "&delta;": "δ",
      "&epsilon;": "ε",
      "&zeta;": "ζ",
      "&eta;": "η",
      "&theta;": "θ",
      "&iota;": "ι",
      "&kappa;": "κ",
      "&lambda;": "λ",
      "&mu;": "μ",
      "&nu;": "ν",
      "&xi;": "ξ",
      "&omicron;": "ο",
      "&pi;": "π",
      "&rho;": "ρ",
      "&sigma;": "σ",
      "&tau;": "τ",
      "&upsilon;": "υ",
      "&phi;": "φ",
      "&chi;": "χ",
      "&psi;": "ψ",
      "&omega;": "ω",
      "&Alpha;": "Α",
      "&Beta;": "Β",
      "&Gamma;": "Γ",
      "&Delta;": "Δ",
      "&Epsilon;": "Ε",
      "&Zeta;": "Ζ",
      "&Eta;": "Η",
      "&Theta;": "Θ",
      "&Iota;": "Ι",
      "&Kappa;": "Κ",
      "&Lambda;": "Λ",
      "&Mu;": "Μ",
      "&Nu;": "Ν",
      "&Xi;": "Ξ",
      "&Omicron;": "Ο",
      "&Pi;": "Π",
      "&Rho;": "Ρ",
      "&Sigma;": "Σ",
      "&Tau;": "Τ",
      "&Upsilon;": "Υ",
      "&Phi;": "Φ",
      "&Chi;": "Χ",
      "&Psi;": "Ψ",
      "&Omega;": "Ω",
      "&int;": "∫",
      "&sum;": "∑",
      "&prod;": "∏",
      "&part;": "∂",
      "&nabla;": "∇",
      "&infin;": "∞",
      "&lim;": "lim",
      "&sqrt;": "√",
      "&radic;": "√",
      "&deg;": "°",
      "&prime;": "′",
      "&Prime;": "″",
      "&permil;": "‰",
      "&perp;": "⊥",
      "&ang;": "∠",
      "&parallel;": "∥",
      "&amp;": "&",
      "&quot;": '"',
      "&apos;": "'",
      "&nbsp;": " ",
      "&ndash;": "-",
      "&mdash;": "—",
      "&lsquo;": "'",
      "&rsquo;": "'",
      "&ldquo;": "\u201C",
      "&rdquo;": "\u201D",
      "&hellip;": "…",
      "&bull;": "•",
      "&middot;": "·",
      "&#8800;": "≠",
      "&#8804;": "≤",
      "&#8805;": "≥",
      "&#8730;": "√",
      "&#178;": "²",
      "&#179;": "³",
      "&#8734;": "∞",
      "&#8721;": "∑",
      "&#8747;": "∫",
      "&#8706;": "∂",
    };

    let decoded = text;
    Object.entries(entityMap).forEach(([entity, char]) => {
      decoded = decoded.replace(
        new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        char
      );
    });
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) =>
      String.fromCharCode(dec)
    );
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    return decoded;
  };

  /**
   * Prints text that can contain inline bold tags (<b> or <strong>).
   * It handles word wrapping and style changes mid-line.
   */
  const printRichText = (
    htmlText,
    size = 11,
    defaultStyle = "normal",
    indent = 0
  ) => {
    if (!htmlText) return;

    // 1. Parse HTML into simple chunks of { text, style }
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlText;

    const chunks = [];
    const walk = (node, currentStyle) => {
      if (node.nodeType === 3) {
        // Text node
        if (node.nodeValue) {
          chunks.push({ text: node.nodeValue, style: currentStyle });
        }
      } else if (node.nodeType === 1) {
        // Element node
        let nextStyle = currentStyle;
        if (["B", "STRONG"].includes(node.nodeName)) {
          nextStyle = "bold";
        }
        for (const child of node.childNodes) {
          walk(child, nextStyle);
        }
      }
    };
    walk(tempDiv, defaultStyle);

    // 2. Wrap chunks into lines manually since jsPDF doesn't support mixed styles in splitTextToSize
    const lines = [];
    let currentLine = [];
    let currentLineWidth = 0;
    const maxWidth = CONTENT_WIDTH - indent;

    const wordsWithStyles = [];
    chunks.forEach((chunk) => {
      const decoded = decodeHtmlEntities(chunk.text);
      // We need to keep track of spaces too
      const tokens = decoded.split(/(\s+)/);
      tokens.forEach((token) => {
        if (token) {
          wordsWithStyles.push({ text: token, style: chunk.style });
        }
      });
    });

    wordsWithStyles.forEach((item) => {
      doc.setFont(currentFont, item.style);
      doc.setFontSize(size);
      const wordWidth = doc.getTextWidth(item.text);

      if (
        currentLineWidth + wordWidth > maxWidth &&
        currentLine.length > 0 &&
        !item.text.match(/^\s+$/)
      ) {
        lines.push(currentLine);
        currentLine = [];
        currentLineWidth = 0;
        // If it was just a space that caused overflow at the start of a new line, skip it
        if (item.text.match(/^\s+$/)) return;
      }

      currentLine.push(item);
      currentLineWidth += wordWidth;
    });
    if (currentLine.length > 0) lines.push(currentLine);

    // 3. Print lines
    lines.forEach((line) => {
      checkPageBreak();
      let xOffset = MARGIN + indent;
      line.forEach((item) => {
        doc.setFont(currentFont, item.style);
        doc.setFontSize(size);
        doc.text(item.text, xOffset, cursorY);
        xOffset += doc.getTextWidth(item.text);
      });
      cursorY += LINE_HEIGHT;
    });
  };

  // Keep original printText for backwards compatibility if needed, but it just calls printRichText now
  const printText = (text, size = 11, style = "normal", indent = 0) => {
    printRichText(text, size, style, indent);
  };

  /* -------- IMAGE PRINTER -------- */

  const printImage = async (url) => {
    if (!url) return;
    try {
      const img = await loadImage(url);
      let imgW = img.width;
      let imgH = img.height;
      const scale = Math.min(
        IMAGE_MAX_WIDTH / imgW,
        IMAGE_MAX_HEIGHT / imgH,
        1
      );
      imgW *= scale;
      imgH *= scale;
      checkPageBreak(imgH + 6);
      const x = MARGIN + (CONTENT_WIDTH - imgW) / 2;
      doc.addImage(img, "PNG", x, cursorY, imgW, imgH);
      cursorY += imgH + 6;
    } catch {
      console.warn("Image load failed:", url);
    }
  };

  /* -------- HTML RENDERER -------- */

  const renderHtml = async (html, indent = 0) => {
    if (!html) return;

    const container = document.createElement("div");
    container.innerHTML = html;

    for (const node of Array.from(container.childNodes)) {
      if (node.nodeType === 3) {
        // Text node
        const val = node.nodeValue.trim();
        if (val) printRichText(val, 11, "normal", indent);
        continue;
      }

      if (node.nodeName === "P") {
        if (node.querySelector("img")) {
          await printImage(node.querySelector("img").src);
        } else {
          const text = node.innerHTML.trim();
          if (text) {
            printRichText(text, 11, "normal", indent);
            cursorY += 2;
          }
        }
      } else if (node.nodeName === "UL") {
        for (const li of node.querySelectorAll("li")) {
          printRichText(`• ${li.innerHTML}`, 11, "normal", indent + 4);
        }
        cursorY += 2;
      } else if (node.nodeName === "DIV") {
        const text = node.innerHTML.trim();
        if (text) {
          printRichText(text, 11, "normal", indent);
        }
      }
    }
  };

  /* ================= START PDF ================= */

  addHeader();

  /* -------- QUESTIONS SECTION -------- */

  printText(sectionTitle, 12, "bold");
  cursorY += 4;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    checkPageBreak(25);

    if (q.common_data) {
      await renderHtml(q.common_data);
      cursorY += 4;
    }

    printText(`Q${i + 1}. ${q.question}`, 11, "bold");
    cursorY += 2;

    if (q.options?.length) {
      for (let j = 0; j < q.options.length; j++) {
        printText(
          `${String.fromCharCode(97 + j)}. ${q.options[j]}`,
          11,
          "normal",
          5
        );
      }
    }
    cursorY += 6;
  }

  /* -------- EXPLANATION SECTION -------- */

  newPage();
  printText(explanationTitle, 12, "bold");
  cursorY += 6;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    checkPageBreak(30);

    printText(`Q${i + 1}.`, 11, "bold");
    cursorY += 2;

    if (q.answer !== undefined) {
      printText(
        `Correct Answer: ${String.fromCharCode(65 + q.answer)}`,
        11,
        "bold",
        5
      );
      cursorY += 2;
    }

    if (q.explanation) {
      await renderHtml(q.explanation, 5);
    }
    cursorY += 6;
  }

  /* -------- FOOTERS -------- */

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  doc.save(title + ".pdf");
};
