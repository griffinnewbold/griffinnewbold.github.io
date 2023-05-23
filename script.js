let currentDiv = 1;
let currentTeachingDiv = 1;
let currentProjectDiv = 1;
const totalProjectDivs = 9;
const totalTeachingDivs = 2;
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
        currentTeachingDiv = totalTeachingDivs;
        document.getElementById('div2').classList.add('active');
    }
}

function showNextDivProject(){
    const currentDivId = `div${currentProjectDiv}`;
    const nextDivId = `div${currentProjectDiv + 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentProjectDiv++;
    }else{
        currentDivElem.classList.remove('active');
        currentProjectDiv = 1;
        document.getElementById('div1').classList.add('active');
    }
}

function showPrevDivProject(){
    const currentDivId = `div${currentProjectDiv}`;
    const nextDivId = `div${currentProjectDiv - 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentProjectDiv--;
    }else{
        currentDivElem.classList.remove('active');
        currentProjectDiv = totalProjectDivs;
        document.getElementById('div9').classList.add('active');
    }
}