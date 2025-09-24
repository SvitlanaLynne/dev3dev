const linkElement = document.getElementById("meetingLink");
const fallbackMessage =
  "Meeting link is not available right now. Please check back later or contact us if you do not see the link.";

fetch("../meetingLink.txt")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to fetch the meeting link");
    return response.text();
  })
  .then((link) => {
    const trimmedLink = link.trim();
    if (trimmedLink) {
      linkElement.href = trimmedLink;
      linkElement.textContent = trimmedLink;
    } else {
      linkElement.textContent = fallbackMessage;
      linkElement.removeAttribute("href");
    }
  })
  .catch((error) => {
    console.error("Error fetching meeting link:", error);
    linkElement.textContent = fallbackMessage;
    linkElement.removeAttribute("href");
  });
