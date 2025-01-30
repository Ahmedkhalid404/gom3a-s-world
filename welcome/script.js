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


let myRandomLink = document.getElementById("myRandomLink");


const random = (mn, mx) => {
    return Math.floor(Math.random() * (mx - mn)) + mn;
}

function randomizeLink(){
    event.preventDefault();
    
    let links = [
        "https://www.youtube.com/watch?v=AOHx8JLdf1E",
        "https://www.youtube.com/watch?v=Zz-HelZtKEQ",
        "https://www.youtube.com/watch?v=BfwSLOHlPrw&t=1s",
        "https://www.youtube.com/watch?v=FZSlX_pwvf0"
    ];
    
    window.open(links[ random(0, links.length - 1) ], "_blank");
}

myRandomLink.onclick = randomizeLink;
