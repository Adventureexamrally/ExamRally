import jsPDF from "jspdf";

/* ================= IMAGE HELPERS ================= */

const LOGO_URL = "https://examrally.in/assets/logo-DuhjVB4Q.png";
const LOGO_WIDTH = 25; // mm

let cachedLogo = null;

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

/* ================= MAIN FUNCTION ================= */

export const generateImageEnabledPDF = async (questions, options = {}) => {
  const {
    title = "Exam PDF",
    sectionTitle = "1. Questions",
    explanationTitle = "2. Answer & Explanation",
    watermarkText = "ExamRally",
  } = options;

  const doc = new jsPDF("p", "mm", "a4");

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
    doc.text(
      watermarkText,
      pageWidth / 2,
      pageHeight / 2,
      {
        align: "center",
        angle: 45,
      }
    );
    doc.restoreGraphicsState();
  };

  const addHeader = () => {
    addWatermark();

    if (cachedLogo) {
      const logoHeight =
        (cachedLogo.height * LOGO_WIDTH) / cachedLogo.width;

      doc.addImage(
        cachedLogo,
        "PNG",
        MARGIN,
        6,
        LOGO_WIDTH,
        logoHeight
      );
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
    doc.text(
      `Page ${pageNo} of ${total}`,
      pageWidth - MARGIN,
      pageHeight - 8,
      { align: "right" }
    );
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

  const printText = (text, size = 11, style = "normal", indent = 0) => {
    if (!text) return;

    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(0);

    const cleanText = text.replace(/<[^>]+>/g, "");
    const lines = doc.splitTextToSize(
      cleanText,
      CONTENT_WIDTH - indent
    );

    lines.forEach((line) => {
      checkPageBreak();
      doc.text(line, MARGIN + indent, cursorY);
      cursorY += LINE_HEIGHT;
    });
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
      if (node.nodeName === "P" && node.querySelector("img")) {
        await printImage(node.querySelector("img").src);
        continue;
      }

      if (node.nodeName === "P") {
        const text = node.innerText.trim();
        if (text) {
          printText(text, 11, "normal", indent);
          cursorY += 2;
        }
      }

      if (node.nodeName === "UL") {
        for (const li of node.querySelectorAll("li")) {
          printText(`• ${li.innerText}`, 11, "normal", indent + 4);
        }
        cursorY += 2;
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
