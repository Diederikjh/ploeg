// pdf.js config

 // Loaded via <script> tag, create shortcut to access PDF.js exports.
var { pdfjsLib } = globalThis;

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

// Drag & drop handling
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

async function handleFiles(fileList) {
  for (let file of fileList) {
    if (file.type !== "application/pdf") continue;
    console.log(`Processing: ${file.name}`);
    const textContent = await extractPdfText(file);
    window.parseBillText(file.name, textContent);
  }
}

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}
