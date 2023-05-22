let currentDiv = 1;
const totalDivs = 4;

function showNextDiv() {
    const currentDivId = `div${currentDiv}`;
    const nextDivId = `div${currentDiv + 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentDiv++;
    }else{
        currentDivElem.classList.remove('active');
        currentDiv = 1;
        document.getElementById('div1').classList.add('active');
    }
}

function showPrevDiv() {
    const currentDivId = `div${currentDiv}`;
    const nextDivId = `div${currentDiv - 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentDiv--;
    }else{
        currentDivElem.classList.remove('active');
        currentDiv = 4;
        document.getElementById('div4').classList.add('active');
    }
}