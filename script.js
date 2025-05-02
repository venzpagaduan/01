const board = document.getElementById("gameBoard");
const statusDiv = document.getElementById("status");
let firstCard, secondCard;
let lockBoard = false;
let matchesFound = 0;
let images = [];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function loadGame() {
  board.innerHTML = "";
  statusDiv.textContent = "Match all cards!";
  firstCard = secondCard = null;
  lockBoard = false;
  matchesFound = 0;

  // Create list of 32 possible images
  const totalImages = 32;
  const allImages = [];
  for (let i = 1; i <= totalImages; i++) {
    allImages.push(`img${i}.jpg`);
  }

  // Pick 8 random unique images
  const numPairs = 8;
  const selectedImages = shuffle(allImages).slice(0, numPairs);
  images = shuffle([...selectedImages, ...selectedImages]);

  images.forEach(img => board.appendChild(createCard(img)));
}

function createCard(imageSrc) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");
  cardBack.style.backgroundImage = `url('${imageSrc}')`;

  cardInner.append(cardFront, cardBack);
  card.appendChild(cardInner);

  card.addEventListener("click", () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const firstImg = firstCard.querySelector(".card-back").style.backgroundImage;
  const secondImg = secondCard.querySelector(".card-back").style.backgroundImage;

  if (firstImg === secondImg) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchesFound++;

    if (matchesFound === images.length / 2) {
      setTimeout(() => {
        statusDiv.textContent = "🎉 Task Completed! Restarting...";
        setTimeout(loadGame, 2000);
      }, 500);
    }

    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

loadGame();
