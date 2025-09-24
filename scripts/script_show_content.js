function showContent(contentId) {
  // Hiding all content
  const contents = document.querySelectorAll('div[id^="content"]');
  contents.forEach((content) => (content.style.display = "none"));

  // show all
  const content = document.getElementById(contentId);
  content.style.display = "flex";

  // Delete previously attached paragraphs
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  // Reading paragraph from a file
  fetch(`../full_stack_portfolio_description/${contentId}.txt`)
    .then((response) => response.text())
    .then((data) => {
      const pTagArr = data.split(/\r?\n/);

      for (let i = 0; i < pTagArr.length; i++) {
        const p = document.createElement("p");
        p.innerHTML = pTagArr[i];
        p.id = `${contentId}`;
        content.appendChild(p);
      }
    });

  // Scroll to the paragraph corresponding to contentId
  content.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    window.scrollBy({ top: 20, behavior: "smooth" });
  }, 50);

  // Deleting previously attached images
  const images = content.getElementsByTagName("img");
  while (images.length > 0) {
    // Loop until all images are removed
    content.removeChild(images[0]); // Remove the first image element from the div
  }

  // Define the directory containing the images
  const directory = `../full_stack_portfolio_images/${contentId}/`;

  // Define a function to read the contents of a file
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Fetch the list of files in the directory
  fetch(directory)
    .then((response) => response.text())
    .then((text) => {
      // Parse the HTML response to extract the file names
      const parser = new DOMParser();
      const html = parser.parseFromString(text, "text/html");
      const fileLinks = Array.from(html.querySelectorAll("a"))
        .map((a) => a.href)
        .filter((href) => href.endsWith(".jpg"));

      // Load and display each image.
      fileLinks.forEach(async (link) => {
        const filename = link.split("/").pop();
        const file = await fetch(link).then((response) => response.blob());
        const dataUrl = await readFile(file);
        const img = document.createElement("img");
        img.src = dataUrl;
        img.alt = filename;
        content.appendChild(img);
      });
    });
}
