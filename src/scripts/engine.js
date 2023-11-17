const state ={
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards:{
        player: document.getElementById("player-card-field"),
        computer: document.getElementById("computer-card-field")
    },
    playerSides: {
        computerBOX: document.getElementById("computer-cards"),
        playerBOX: document.getElementById("player-cards")
    },
    actions:{
        buttom: document.getElementById("next-duel")
    }
};

const bgm = document.getElementById("bgm");
const pathImages = "./src/assets/icons/";
const playerSides = {player: "player-cards", computer: "computer-cards"};

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon", 
        type: "Paper", 
        img: `${pathImages}dragon.png`,
        winsFrom: [1],
        losesTo: [2],
    },
    {
        id:1,
        name: "Dark Magician", 
        type: "Rock", 
        img: `${pathImages}magician.png`,
        winsFrom: [2],
        losesTo: [0],
    },
    {
        id:2,
        name: "Exodia", 
        type: "Scissors", 
        img: `${pathImages}exodia.png`,
        winsFrom: [0],
        losesTo: [1],
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id
};

async function createCardImage(CardId, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",cardData[CardId].id);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player){
  
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(CardId, cardImage);
        });

        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });

    };

    return cardImage;

};

async function removeAllCardsImages() {

    let { computerBOX, playerBOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.buttom.style.display = "none";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";

    showFieldCards(false);

    init();
}

async function playAudio(duelResult) {
    let audio = new Audio(`./src/assets/audios/${duelResult.toLowerCase()}.wav`);
    audio.play();
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResult = "Tie";
    let playerCard = cardData[playerCardId];

    if(playerCard.winsFrom.includes(computerCardId)) {
        duelResult = "WIN";
        state.score.playerScore++
    };
    
    if(playerCard.losesTo.includes(computerCardId)) {
        duelResult = "LOSE";
        state.score.computerScore++
    };

    playAudio(duelResult);

    return duelResult;
}

async function drawButtom(duelResult) {
    state.actions.buttom.innerText = duelResult;
    state.actions.buttom.style.display = "block"
}

async function updateScore(duelResult) {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    showFieldCards();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    await hideCardDetails();

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButtom(duelResults);
};

async function drawSelectedCard(index, cardImage){

    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;

};

async function showFieldCards(boolean = true) {
    if(boolean == false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    } else { 
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
}

async function hideCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i<cardNumbers;i++) {
        const randomCardId = await getRandomCardId();
        const cardImage = await createCardImage(randomCardId,fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

function init() {

    showFieldCards(false);

    bgm.play();

    drawCards(5, playerSides.player);
    drawCards(5, playerSides.computer);

}

init();