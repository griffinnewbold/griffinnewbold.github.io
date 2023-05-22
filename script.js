let currentDiv = 1;
const totalDivs = 4;


let currentTeachingDiv = 1;
const totalTeachingDivs = 2;

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
        currentDiv = totalDivs;
        document.getElementById('div4').classList.add('active');
    }
}

function showNextDivTeach() {
    const currentDivId = `div${currentTeachingDiv}`;
    const nextDivId = `div${currentTeachingDiv + 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentTeachingDiv++;
    }else{
        currentDivElem.classList.remove('active');
        currentTeachingDiv = 1;
        document.getElementById('div1').classList.add('active');
    }
}

function showPrevDivTeach() {
    const currentDivId = `div${currentTeachingDiv}`;
    const nextDivId = `div${currentTeachingDiv - 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentTeachingDiv--;
    }else{
        currentDivElem.classList.remove('active');
        currentTeachingDiv = 2;
        document.getElementById('div2').classList.add('active');
    }
}