const passDisplay = document.querySelector('[randomGeneratedPassword]');
const copyBtn = document.querySelector('[copyButton]');
const copyPass = document.querySelector('[copyPassword]');
const sliderVal = document.querySelector('[passLenSlider]');
const passLenDisplay = document.querySelector('[passwordLengthDisplay]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numberCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbols');
const strengthIndicator = document.querySelector('#strengthIcon');
const generatePassBtn = document.querySelector('#generatePasswordBtn');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbolString = " !\"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~";

let password = "";
let passwordLength = 10;
let checkCount = 1;
let strengthColor = "white";

handleSlider();
// SET PASSWORD LENGTH
function handleSlider(){
    sliderVal.value = passwordLength;
    passLenDisplay.textContent = passwordLength;
    const min = sliderVal.min;
    const max = sliderVal.max;
    sliderVal.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}

// SET INDICATOR
function setIndicator(strengthColor){
    strengthIndicator.style.backgroundColor = strengthColor;
    strengthIndicator.style.boxShadow = `0px 0px 12px 1px ${strengthColor}`;
}

// GET RANDOM INTEGER
function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

// GET RANDOM NUMBER
function getRandomNumber(){
    return getRandomInteger(0,9);
}

// GET RANDOM LOWERCASE
function getRandomLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

// GET RANDOM UPPERCASE
function getRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

// GET RANDOM SYMBOL
function getRandomSymbol(){
    return symbolString.charAt(getRandomInteger(0,symbolString.length-1));
}

// CALCULATING STRENGTH AND SETTING COLOR
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNumber || hasSym) && passwordLength >= 8){
        setIndicator("#0f0")
    }else if((hasLower || hasUpper) && (hasNumber || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

// COPY CONTENT
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyPass.textContent = "Copied";
    }catch(e){
        copyPass.textContent = "Failed"
    }
    copyPass.classList.add("active");
    setTimeout(() => {
        copyPass.classList.remove("active");
    },2000);
}

sliderVal.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',() => {
    if(passDisplay.value)
        copyContent();
});

generatePassBtn.addEventListener('click',() =>{
    generatePassword();
});

// CHECKING ALL CHECKBOXES
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    // if passwordLength < checkCount thus passwordLength = checkCount
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); 
    }
};

// GENERATE PASSWORD
function generatePassword(){
    console.log("yes");
    // none of checkBox Selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // PASSWORD GENERATE
    
    // REMOVE OLD PASSWORD
    password = "";

    let funcArr  = [];

    // COMPULSORY ADDITION
    if(uppercaseCheck.checked){
        funcArr.push(getRandomUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(getRandomLowercase);
    }
    if(numberCheck.checked){
        funcArr.push(getRandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(getRandomSymbol);
    }

    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    // Remaning values Enter
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    
    // SHUFFLING
    password = shufflePassword(Array.from(password));
    passDisplay.value = password;
    calcStrength();
}

function shufflePassword(array){
    // FISHER YATES METHOD
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}