/*
    Zum starten eine Taste außer "Escape" drücken.
    Die Schlange wird mit w, a, s, d bewegt.
    Mit "Escape" kann das Spiel angehalten werden, zum erneuten starten `startGameLoop()` aufrufen

    Dieses Project wurde in rund 1.20h geschrieben
*/


const {
    floor,
    random
} = Math;



/*
    tickTime ist die Zeit zwischen den moves der schlange
    startingLength ist die länge auf die die Schlange ohne das Essen von Früchten anwächst
    maxFruits: die Maximale Anzahl die zugleich auf dem Feld sein kann (mehr oder weniger, logik ist wonky), beeinflusst auch die respanrate
*/
const GameSettings = {
    tickTime: 500,
    startingLength: 5,
    maxFruits: 5,
}




const createBoard = (width = 10, height = 10) => {
    document.getElementById("rootNode").innerHTML = Array(height).fill().map((_, y) => Array(width).fill().map((_, x) => `<div data-x=${x} data-y=${y} class="cell"></div>`).join("")).join("<br>")
};
createBoard(10, 10);



let lastKey = "s"
const trackCurrentDir = () => {
    document.addEventListener("keydown", e => {
        if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
            lastKey = e.key;
        }
    })
};
trackCurrentDir();


/*
  snakeFields bildet die schlange ab, an Stelle 0 ist der Head
  fruits ist die aktuell auf dem Feld befindliche Anzahl and Früchten (Grün)
  length ist die maximale länge die die Schlange derzeitig haben kann
 */
const State = {
    snakeFields: [],
    fruits: 0,
    length: GameSettings.startingLength,
}



const setUpGame = () => {
    const startPos = [floor(random() * 10), floor(random() * 10)];
    State.snakeFields.push(startPos);
    document.querySelector(`[data-x="${startPos[0]}"][data-y="${startPos[1]}"]`).classList.toggle("isActiveSnailPart");
};
setUpGame();



let interID;
const startGameLoop = () => {
    interID = setInterval(() => {
        logic();
    }, GameSettings.tickTime);
};
document.addEventListener("keydown", startGameLoop, {once: true})



const stopGameLoop = () => clearInterval(interID);
document.addEventListener("keydown", e => e.key === "Escape" && stopGameLoop())



const logic = () => {
    let offsetX = 0;
    let offsetY = 0;

    switch (lastKey) {
        case "w":
            offsetY = -1;
            break;

        case "a":
            offsetX = -1;
            break;

        case "s":
            offsetY = 1;
            break;

        case "d":
            offsetX = 1;
            break;
    }

    const nextPos = [State.snakeFields[0][0] + offsetX, State.snakeFields[0][1] + offsetY];
    const nextCellNode = document.querySelector(`[data-x="${nextPos[0]}"][data-y="${nextPos[1]}"]`);

    if (nextCellNode === null || nextCellNode.classList.contains("isActiveSnailPart")) {
        stopGameLoop()
        alert("game Over")
        return;

    } else if (nextCellNode.classList.contains("containsFruit")) {
        State.length++;
        State.fruits--;
        nextCellNode.classList.toggle("containsFruit");
    }

    State.snakeFields.unshift(nextPos);
    nextCellNode.classList.toggle("isActiveSnailPart");
    if (State.snakeFields.length > State.length) {
        document.querySelector(`[data-x="${State.snakeFields[State.snakeFields.length - 1][0]}"][data-y="${State.snakeFields[State.snakeFields.length - 1][1]}"]`).classList.toggle("isActiveSnailPart");
        State.snakeFields.pop();
    }

    // this logic can be improved a lot 
    if (State.fruits < GameSettings.maxFruits && (1 - (State.fruits/GameSettings.maxFruits)) * random() > 0.6) {
        const freeCells = [...document.querySelectorAll(".cell:not(.containsFruit):not(.isActiveSnailPart)")]
        freeCells[floor(random() * (freeCells.length - 1))].classList.toggle("containsFruit");
        State.fruits++;
    }
};