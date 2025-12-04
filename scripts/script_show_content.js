function showContent(contentId) {
  // Hiding all content divs
  const contents = document.querySelectorAll('div[id^="content"]');
  contents.forEach((content) => (content.style.display = "none"));

  // Show the selected content div
  const content = document.getElementById(contentId);
  if (!content) {
    console.error("Missing content container:", contentId);
    return;
  }
  content.style.display = "flex";

  // Clear previous content
  while (content.firstChild) content.removeChild(content.firstChild);

  // Load text description
  fetch(`../full_stack_portfolio_description/${contentId}.txt`)
    .then((response) => response.text())
    .then((data) => {
      const lines = data.split(/\r?\n/);
      lines.forEach((line) => {
        const p = document.createElement("p");
        p.innerHTML = line;
        content.appendChild(p);
      });
    });

  // Scroll into view
  content.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => window.scrollBy({ top: 20, behavior: "smooth" }), 50);

  // Remove previously attached images/videos
  const media = content.querySelectorAll("img, video");
  media.forEach((el) => el.remove());

  // Define media directory
  const directory = `../full_stack_portfolio_media/${contentId}/`; // use a unified folder

  // Helper: convert Blob to URL
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

      // Filter supported files
      const fileLinks = Array.from(html.querySelectorAll("a"))
        .map((a) => a.href)
        .filter(
          (href) =>
            href.endsWith(".jpg") ||
            href.endsWith(".png") ||
            href.endsWith(".mp4")
        );

      // Load each file and create proper element
      fileLinks.forEach(async (link) => {
        const filename = link.split("/").pop();
        const file = await fetch(link).then((res) => res.blob());
        const url = URL.createObjectURL(file);

        if (filename.endsWith(".mp4")) {
          const video = document.createElement("video");
          video.src = url;
          video.controls = true;
          video.width = 640; // optional
          video.height = 360; // optional
          video.alt = filename;
          content.appendChild(video);
        } else {
          const img = document.createElement("img");
          img.src = url;
          img.alt = filename;
          img.style.maxWidth = "100%";
          content.appendChild(img);
        }
      });
    });
}
