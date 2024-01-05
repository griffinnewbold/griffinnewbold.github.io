let currentProjectDiv = 1;
const totalProjectDivs = 10;
const lastDiv = `div${totalProjectDivs}`;

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
        document.getElementById(lastDiv).classList.add('active');
    }
}