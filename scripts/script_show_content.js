function showContent(contentId) {
  // Hide all content divs
  const contents = document.querySelectorAll('div[id^="content"]');
  contents.forEach((content) => (content.style.display = "none"));

  // Show selected content
  const content = document.getElementById(contentId);
  if (!content) {
    console.error("Missing content container:", contentId);
    return;
  }
  content.style.display = "flex";

  // Clear previous content
  while (content.firstChild) content.removeChild(content.firstChild);

  // Basic markdown → HTML converter
  function mdToHtml(md) {
    // dot-list grouping (· or • or .)
    md = md.replace(/(^[ \t]*[•·.]\s+.*(\n[ \t]*[•·.]\s+.*)*)/gim, (block) => {
      const items = block
        .split("\n")
        .map((line) => line.replace(/^[ \t]*[•·.]\s+(.*)/, "<li>$1</li>"))
        .join("\n");
      return `<ul>${items}</ul>`;
    });

    return md
      .replace(/\n\s*\n/g, "<br><br>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/`([^`]+)`/gim, "<code>$1</code>")
      .replace(/\n$/gim, "<br>");
  }

  // Load markdown description
  fetch(`../full_stack_portfolio_description/${contentId}.md`)
    .then((response) => response.text())
    .then((markdown) => {
      const html = mdToHtml(markdown);
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      content.appendChild(wrapper);
    });

  // Scroll into view
  content.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => window.scrollBy({ top: 20, behavior: "smooth" }), 50);

  // Remove previously attached images/videos
  const media = content.querySelectorAll("img, video");
  media.forEach((el) => el.remove());

  // Media directory
  const directory = `../full_stack_portfolio_images/${contentId}/`;

  // Helper: convert Blob → URL
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Fetch media files
  fetch(directory)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(text, "text/html");

      const fileLinks = Array.from(html.querySelectorAll("a"))
        .map((a) => a.href)
        .filter(
          (href) =>
            href.endsWith(".jpg") ||
            href.endsWith(".png") ||
            href.endsWith(".mp4")
        );

      fileLinks.forEach(async (link) => {
        const filename = link.split("/").pop();
        const file = await fetch(link).then((res) => res.blob());
        const url = URL.createObjectURL(file);

        if (filename.endsWith(".mp4")) {
          const video = document.createElement("video");
          video.src = url;
          video.controls = true;
          video.alt = filename;
          content.appendChild(video);
        } else {
          const img = document.createElement("img");
          img.src = url;
          img.alt = filename;
          content.appendChild(img);
        }
      });
    });
}
