const typingText = document.getElementById("typingText");
const text = "I hope you enjoy exploring!";
let index = 0;
let isErasing = false;

function typeEffect() {
  if (!isErasing) {
    typingText.textContent += text[index++];
    if (index === text.length) {
      isErasing = true;
      setTimeout(typeEffect, 1000);
    } else {
      setTimeout(typeEffect, 100);
    }
  } else {
    typingText.textContent = typingText.textContent.slice(0, -1);
    if (typingText.textContent.length === 0) {
      isErasing = false;
      index = 0;
      setTimeout(typeEffect, 500);
    } else {
      setTimeout(typeEffect, 50);
    }
  }
}

typeEffect();
document.getElementById('currentYear').textContent = new Date().getFullYear();