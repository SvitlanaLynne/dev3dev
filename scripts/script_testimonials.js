const testimonialTextArr = [
  "I want to express my admiration for Svetlana - it is a true manifestation of professionalism, creativity, and responsibility.<br>Attention to detail has left an indelible impression, always ready to go above and beyond to help and ensure the best result. Svetlana not only excels in her field but is also a wonderful person to work with - working with her is a real pleasure, and her positive attitude brings a sense of comfort to the work environment.<br>I sincerely thank Svetlana for a whole 10 years of our collaboration! Thank you, Svetlana, for your contribution and dedication, for the magnificent jewelry created with such professionalism and creativity!",
  "Svetlana is an incredibly intelligent, organized and professional 2D and 3D artist. Her communication is amazing and we were always on the same page regarding scope, timeline, cost and delivery.<br>If she bids on your job, consider yourself lucky and look no further! Thanks Svetlana!!",
  "The first thing I would like to mention is professionalism. Svetlana always delves into the tasks given, understands what is needed, and implements them. I set a task and forgot about it, and as a result, I always received more than I expected. For me, this is very valuable because I can rely on her, knowing that the task will be completed on time, and I will get exactly what I wanted.<br><br>I would also like to note that we started our business with Svetlana. She created the very first 3D model for the 'Candy Factory' brand, and for many years, we collaborated and grew together. Without Svetlana, 'Candy Factory' would not have become so unique and recognizable because Svetlana also created the logo and much more for us. Together, we laid the foundation for our business, and Svetlana will always be a part of our team.",
];

function loadTestimonials() {
  testimonialTextArr.forEach((text, index) => {
    const contentElement = document.getElementById(
      `testimonialContent${index + 1}`
    );
    if (contentElement) {
      contentElement.innerHTML = text;
      contentElement.style.display = "block";
    }
  });
}

loadTestimonials();
