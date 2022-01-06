const maxChars = 12;
let lastBtnPressed;

let answerNum;
let operation;
let tempNumStr = "";

const screenTop = document.querySelector(".top-line");
const screenBottom = document.querySelector(".bottom-line");

const numBtns = document.querySelectorAll(".num-btn");
const opBtns = document.querySelectorAll(".op-btn");
const equalsBtn = document.querySelector(".equals-btn");
const acBtn = document.querySelector("#ac");
const delBtn = document.querySelector("#del");

acBtn.addEventListener("click", resetCalc);

delBtn.addEventListener("click", backspace);

numBtns.forEach(numBtn => {
    numBtn.addEventListener("click", event => storeNum(event));
});

opBtns.forEach(opBtn => {
    opBtn.addEventListener("click", event => storeOp(event));
});

equalsBtn.addEventListener("click", () => evaluate(answerNum, tempNumStr, operation));

// listen for keypresses
document.addEventListener("keydown", typeInput);


function resetCalc() {
    answerNum = "";
    operation = "";
    tempNumStr = "";
    screenTop.textContent = "";
    screenBottom.textContent = "0";
}

function backspace() {
    if (!tempNumStr || tempNumStr.length === 1) {
        tempNumStr = "";
        screenBottom.textContent = "0";
    } else {
        tempNumStr = tempNumStr.slice(0, -1);
        screenBottom.textContent = tempNumStr;
    }
}

function storeNum(event, typed = false) {
    // check if max digits has been reached
    if (tempNumStr.length >= maxChars) {
        return;
    }

    let char;
    
    if (typed) {
        char = event;
    } else {
        char = event.target.textContent;
    }
    console.log(char);

    if (char === "." && tempNumStr === "") tempNumStr = "0.";
    else if (char === "." && tempNumStr.includes(".")) return;
    else tempNumStr += char;
    screenBottom.textContent = tempNumStr;
}

function storeOp(event, typed = false) {
    if (answerNum && tempNumStr && operation) { // evaluate without "="
        answerNum = operate(operation, +answerNum, +tempNumStr);
        screenBottom.textContent = answerNum;
        tempNumStr = "";

    }

    let char;
    
    if (typed) {
        char = event;
    } else {
        char = event.target.textContent;
    }
    operation = char;


    if (!answerNum && !tempNumStr) { // pressing an operator at beginning should yield 0 (+)
        answerNum = "0";
    } else if (!answerNum) { // if no carryover number exists
        answerNum = +tempNumStr;
        tempNumStr = "";
    } else { // carryover number exists

    }
    screenTop.textContent = `${answerNum} ${operation}`;
}

function add(a, b) {
    return +a + +b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "×":
            return multiply(a, b);
        case "÷":
            return divide(a, b);
        
        default:
            return null;

    }
}

function evaluate(answerNum, tempNumStr, operation) {
    // check if both numbers exist before evaluating
    if (!(answerNum && tempNumStr && operation)) return;

    // check if evaluate has just been used prior
    if (screenTop.textContent.includes("=")) {
        // Use carry-over evaluate
        answerNum = screenBottom.textContent;
    }
    
    let numOne = +answerNum;
    let numTwo = +tempNumStr;

    screenTop.textContent = `${answerNum} ${operation} ${tempNumStr} =`;

    answerNum = operate(operation, numOne, numTwo);
    answerNum = roundNumber(answerNum);
    screenBottom.textContent = answerNum;
    console.log(`=\n${answerNum}`)
    

    // tempNumStr = "";
    // operation = "";

}

// round number to 10 dp 
function roundNumber(number) {
    if (number.toString().length > maxChars) { 
        console.log(number);
        if (number.toString().includes(".")) { // Round floating number to 10dp
            return (+number).toFixed(maxChars - 2);
        } else { // large number
            return number.toExponential();
        } 
    } else {
        return number;
    }
}

function typeInput(event) {
    let keyPressed = event.key;
    if (/[0-9]/.test(keyPressed)) storeNum(keyPressed, true);
    else if (/[-+*\/x]/.test(keyPressed)) {
        switch (keyPressed) {
            case "*":
            case "x":
                keyPressed = "×";
                break;
            case "/":
                keyPressed = "÷";
                break;

            default:
                break;
        }
        storeOp(keyPressed, true);
    } 
    else if (keyPressed === "=") {
        evaluate(answerNum, tempNumStr, operation);
    } else if (keyPressed === "Escape") {
        resetCalc();
    }
}