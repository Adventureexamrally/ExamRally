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

const registerFonts = (doc, language) => {
  if (!fonts) return;

  const stripBase64Prefix = (str) => {
    if (typeof str !== "string") return str;
    return str.replace(/^data:font\/[a-z]+;base64,/, "");
  };

  try {
    // Register Tamil font if needed
    if (language === "tamil" && fonts.NotoSansTamil) {
      doc.addFileToVFS(
        "NotoSansTamil-Regular.ttf",
        stripBase64Prefix(fonts.NotoSansTamil)
      );
      doc.addFont("NotoSansTamil-Regular.ttf", "NotoSansTamil", "normal");
    }

    // Register Devanagari (Hindi) font if needed
    if (language === "hindi" && fonts.NotoSansDevanagari) {
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
    language = "english", // NEW: language parameter (english, hindi, tamil)
  } = options;

  // Detect if Rupee symbol is present in any content to trigger font fallback
  const contentString = JSON.stringify(questions);
  const hasRupeeSymbol =
    contentString.includes("₹") ||
    contentString.includes("&#8377;") ||
    contentString.includes("\u20B9");

  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  /* -------- REGISTER FONTS -------- */
  // Always register fonts if they might be needed (for Rupee or Language)
  const needsHindi =
    language === "hindi" ||
    contentString.includes("₹") ||
    contentString.includes("&#8377;") ||
    contentString.includes("\u20B9");
  const needsTamil = language === "tamil";

  if (needsHindi) registerFonts(doc, "hindi");
  if (needsTamil) registerFonts(doc, "tamil");

  /* -------- SELECT BASE FONT -------- */
  const baseFont =
    language === "tamil"
      ? "NotoSansTamil"
      : language === "hindi"
      ? "NotoSansDevanagari"
      : "helvetica";
  let currentFont = baseFont;

  /* -------- PAGE CONFIG -------- */
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const MARGIN = 15;
  const HEADER_HEIGHT = 22;
  const FOOTER_HEIGHT = 15;
  const LINE_HEIGHT = 6; // Reduced from 7 for tighter spacing

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

  /* -------- HEADER / FOOTER / WATERMARK -------- */

  const addWatermark = () => {
    if (!watermarkText) return;
    doc.saveGraphicsState();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(230, 230, 230); // Very light gray
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

      doc.addImage(
        cachedLogo,
        "PNG",
        MARGIN,
        6,
        LOGO_WIDTH,
        logoHeight,
        undefined,
        "FAST"
      );
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(37, 138, 20); // Green
      doc.text("examrally", MARGIN, 14);
    }

    // Exam Title on Right
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(title, pageWidth - MARGIN, 14, { align: "right" });

    // Green Underline
    doc.setDrawColor(37, 138, 20);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, 18, pageWidth - MARGIN, 18);
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

  // Decode HTML entities (e.g., &times; → ×, &divide; → ÷)
  const decodeHtmlEntities = (text) => {
    const entityMap = {
      // Basic arithmetic
      "&times;": "×",
      "&divide;": "÷",
      "&plus;": "+",
      "&minus;": "−",
      "&equals;": "=",
      "&plusmn;": "±",

      // Comparison & Relations
      "&lt;": "<",
      "&gt;": ">",
      "&le;": "≤",
      "&ge;": "≥",
      "&ne;": "≠",
      "&equiv;": "≡",
      "&asymp;": "≈",
      "&cong;": "≅",
      "&prop;": "∝",

      // Fractions & Powers
      "&frac12;": "½",
      "&frac14;": "¼",
      "&frac34;": "¾",
      "&frac13;": "⅓",
      "&frac23;": "⅔",
      "&sup2;": "²",
      "&sup3;": "³",
      "&sup1;": "¹",

      // Set Theory & Logic
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

      // Greek Letters (lowercase)
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

      // Greek Letters (uppercase)
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

      // Calculus & Analysis
      "&int;": "∫",
      "&sum;": "∑",
      "&prod;": "∏",
      "&part;": "∂",
      "&nabla;": "∇",
      "&infin;": "∞",
      "&lim;": "lim",
      "&sqrt;": "√",
      "&radic;": "√",

      // Other Math
      "&deg;": "°",
      "&prime;": "′",
      "&Prime;": "″",
      "&permil;": "‰",
      "&perp;": "⊥",
      "&ang;": "∠",
      "&parallel;": "∥",

      // Standard HTML
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

      // Numeric codes (common math symbols)
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
      "&#8377;": "₹",
    };

    let decoded = text;
    Object.entries(entityMap).forEach(([entity, char]) => {
      decoded = decoded.replace(
        new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        char
      );
    });

    // Handle numeric entities (&#xxx; or &#xXX;)
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) =>
      String.fromCharCode(dec)
    );
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

    return decoded;
  };

  // RICH TEXT RENDERING HELPERS
  let lineBuffer = [];
  let currentX = MARGIN;

  const flushLineBuffer = () => {
    if (lineBuffer.length === 0) return;

    checkPageBreak();
    lineBuffer.forEach((segment) => {
      doc.setFont(segment.font, segment.style);
      doc.setFontSize(segment.size);
      doc.setTextColor(0);
      doc.text(segment.text, segment.x, cursorY + (segment.offsetY || 0));
    });

    cursorY += LINE_HEIGHT;
    lineBuffer = [];
    currentX = MARGIN;
  };

  const printStyledText = (
    text,
    size = 11,
    style = "normal",
    indent = 0,
    offsetY = 0
  ) => {
    if (!text) return;

    // 1. Decode HTML entities FIRST so that split logic works on actual characters
    // This ensures &times; becomes × and is caught by the math symbol regex
    let decodedText = decodeHtmlEntities(text);

    // 2. Normalize non-breaking spaces to regular spaces to prevent "9 0" gaps
    decodedText = decodedText.replace(/\u00A0/g, " ");

    const targetIndent = MARGIN + indent;
    if (currentX < targetIndent) currentX = targetIndent;

    // Split text into words while keeping whitespace
    const words = decodedText.split(/(\s+)/);

    words.forEach((word) => {
      if (!word) return;

      // Split by:
      // 1. Math symbols (×, ÷, +, −, =, *, |, √)
      // 2. Rupee symbol
      // 3. Hindi Blocks (\u0900-\u097F)
      // 4. Tamil Blocks (\u0B80-\u0BFF)
      const segments = word.split(
        /(₹|&#8377;|\u20B9|×|÷|\+|−|=|[*]|\||√|[\u0900-\u097F]+|[\u0B80-\u0BFF]+)/g
      );

      segments.forEach((seg) => {
        if (!seg) return;

        let font = baseFont;
        let activeStyle = style;

        // seg is already decoded
        let activeText = seg;

        // Check for specific content types to switch fonts

        // 1. Square Root -> Use Symbol Font (Code 214 / 0xD6)
        // NotoSans and Helvetica fail to render √ correctly in generic mode
        if (activeText === "√") {
          font = "Symbol";
          activeStyle = "normal";
          activeText = String.fromCharCode(214);
        }
        // 2. Hindi Auto-detection (excluding √)
        else if (/[\u0900-\u097F]/.test(activeText) || activeText === "₹") {
          font = "NotoSansDevanagari";
          activeStyle = "normal"; // Hindi font doesn't have bold, utilize normal
        }
        // 2. Tamil Auto-detection
        else if (/[\u0B80-\u0BFF]/.test(activeText)) {
          font = "NotoSansTamil";
          activeStyle = "normal";
        }
        // 3. Math Symbols -> Force Helvetica
        // Removed '√' from here as it needs a better font
        else if (["×", "÷", "+", "−", "=", "*", "|"].includes(activeText)) {
          font = "helvetica";
        }

        doc.setFont(font, activeStyle);
        doc.setFontSize(size);
        const wordWidth = doc.getTextWidth(activeText);

        if (currentX + wordWidth > MARGIN + CONTENT_WIDTH - 2) {
          flushLineBuffer();
          currentX = targetIndent;
        }

        lineBuffer.push({
          text: activeText,
          x: currentX,
          font,
          style: activeStyle,
          size,
          offsetY, // Capture vertical offset
        });
        currentX += wordWidth;
      });
    });
  };

  const printText = (text, size = 11, style = "normal", indent = 0) => {
    printStyledText(text, size, style, indent);
    flushLineBuffer();
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
      doc.addImage(img, "JPEG", x, cursorY, imgW, imgH, undefined, "FAST");
      cursorY += imgH + 6;
    } catch {
      console.warn("Image load failed:", url);
    }
  };

  /* -------- HTML RENDERER -------- */

  const renderHtml = async (html, indent = 0, defaultStyle = "normal") => {
    if (!html) return;

    // Pre-clean HTML: remove empty paragraphs and repeated breaks
    let cleanHtml = html
      .replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, "") // Remove <p><br></p>
      .replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, "") // Remove <p>&nbsp;</p>
      .replace(/<p[^>]*>\s*<\/p>/gi, "") // Remove empty <p>
      .replace(/(<br\s*\/?>){2,}/gi, "<br/>"); // Collapse multiple <br>

    const container = document.createElement("div");
    container.innerHTML = cleanHtml;

    const processNodes = async (
      childNodes,
      currentIndent,
      currentStyle = defaultStyle,
      currentSize = 11,
      currentOffset = 0
    ) => {
      for (const node of Array.from(childNodes)) {
        const nodeName = node.nodeName ? node.nodeName.toUpperCase() : "";

        // Handle images
        if (nodeName === "IMG") {
          flushLineBuffer();
          await printImage(node.src);
        } else if (node.querySelector && node.querySelector("img")) {
          flushLineBuffer();
          await printImage(node.querySelector("img").src);
        }
        // Handle Superscript (SUP)
        else if (nodeName === "SUP") {
          if (node.childNodes && node.childNodes.length > 0) {
            await processNodes(
              node.childNodes,
              currentIndent,
              currentStyle,
              currentSize * 0.7, // Smaller font for superscript
              currentOffset - 2 // Shift up (negative Y)
            );
          }
        }
        // Handle lists
        else if (nodeName === "UL" || nodeName === "OL") {
          flushLineBuffer();
          for (const li of node.querySelectorAll("li")) {
            printStyledText(
              `• ${li.innerText.trim()}`,
              11,
              currentStyle,
              currentIndent + 4
            );
            flushLineBuffer();
          }
          cursorY += 2;
        }
        // Handle text nodes
        else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (text) {
            printStyledText(
              text,
              currentSize,
              currentStyle,
              currentIndent,
              currentOffset
            );
          }
        }
        // Handle elements
        else if (node.nodeType === Node.ELEMENT_NODE) {
          const isBlock = ["P", "DIV", "H1", "H2", "H3", "BR"].includes(
            nodeName
          );
          if (isBlock) flushLineBuffer();

          let nodeStyle = currentStyle;
          // Support multiple bold tags and inline styles
          if (
            ["B", "STRONG", "H1", "H2", "H3"].includes(nodeName) ||
            (node.style &&
              (node.style.fontWeight === "bold" ||
                node.style.fontWeight === "700"))
          ) {
            nodeStyle = "bold";
          }
          if (
            ["I", "EM"].includes(nodeName) ||
            (node.style && node.style.fontStyle === "italic")
          ) {
            nodeStyle = nodeStyle === "bold" ? "bolditalic" : "italic";
          }

          if (node.childNodes && node.childNodes.length > 0) {
            await processNodes(
              node.childNodes,
              currentIndent,
              nodeStyle,
              currentSize,
              currentOffset
            );
          } else {
            const text = (node.innerText || "").trim();
            if (text)
              printStyledText(
                text,
                currentSize,
                nodeStyle,
                currentIndent,
                currentOffset
              );
          }

          if (isBlock) {
            flushLineBuffer();
            cursorY += 2;
          }
        }
      }
    };

    await processNodes(container.childNodes, indent, defaultStyle);
    flushLineBuffer();
  };

  /* ================= START PDF ================= */

  addHeader();

  /* -------- QUESTIONS SECTION -------- */

  // Section Header with Background
  doc.setFillColor(240, 240, 240); // Light Gray Background
  doc.rect(MARGIN, cursorY, CONTENT_WIDTH, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(37, 138, 20); // Green Text
  doc.text("QUESTIONS", MARGIN + 2, cursorY + 5.5);
  cursorY += 12;

  // Directions (if any, typically first item or separate) - standard text color text reset
  doc.setTextColor(0);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    checkPageBreak(25);

    if (q.common_data) {
      await renderHtml(q.common_data);
      cursorY += 4;
    }

    checkPageBreak(15);
    printStyledText(`Q${i + 1}. `, 11, "bold");

    // Strip surrounding <p> or <div> tags from question to keep it inline
    // Handles attributes too, e.g. <p class="ql-align-justify">
    const questionHtml = q.question.replace(
      /^\s*<(p|div)[^>]*>(.*?)<\/\1>\s*$/i,
      "$2"
    );
    await renderHtml(questionHtml, 0, "bold");

    flushLineBuffer();
    cursorY += 2;

    if (q.options?.length) {
      for (let j = 0; j < q.options.length; j++) {
        checkPageBreak(8);
        printStyledText(`${String.fromCharCode(97 + j)}. `, 11, "bold", 6);

        // Strip surrounding <p> or <div> tags from options
        const optHtml = q.options[j].replace(
          /^\s*<(p|div)[^>]*>(.*?)<\/\1>\s*$/i,
          "$2"
        );
        await renderHtml(optHtml, 6);

        flushLineBuffer();
      }
    }

    cursorY += 6;
  }

  /* -------- EXPLANATION SECTION -------- */

  newPage();

  // Section Header with Background
  doc.setFillColor(240, 240, 240); // Light Gray
  doc.rect(MARGIN, cursorY, CONTENT_WIDTH, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(37, 138, 20); // Green
  doc.text("ANSWERS & EXPLANATIONS", MARGIN + 2, cursorY + 5.5);
  cursorY += 12;
  doc.setTextColor(0);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    checkPageBreak(30);

    printStyledText(`Q${i + 1}.`, 11, "bold");
    flushLineBuffer();
    cursorY += 2;

    if (q.answer !== undefined) {
      const answerText =
        typeof q.answer === "number"
          ? String.fromCharCode(65 + q.answer)
          : q.answer;
      printStyledText(`Correct Answer: `, 11, "bold", 5);
      printStyledText(`${answerText}`, 11, "normal", 0);
      flushLineBuffer();
      cursorY += 2;
    }

    if (q.explanation) {
      await renderHtml(q.explanation, 5);
      flushLineBuffer();
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
