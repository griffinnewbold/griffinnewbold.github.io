let currentTeachingDiv = 1;
const totalTeachingDivs = 4;
const lastDiv = `div${totalTeachingDivs}`

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
        document.getElementById(lastDiv).classList.add('active');
    }
}