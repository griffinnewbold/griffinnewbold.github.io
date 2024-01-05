let currentDivCourse = 1;
const totalDivsCourse = 4;

function showNextDivCourse() {
    const currentDivId = `div${currentDivCourse}`;
    const nextDivId = `div${currentDivCourse + 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentDivCourse++;
    }else{
        currentDivElem.classList.remove('active');
        currentDivCourse = 1;
        document.getElementById('div1').classList.add('active');
    }
}

function showPrevDivCourse() {
    const currentDivId = `div${currentDivCourse}`;
    const nextDivId = `div${currentDivCourse - 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentDivCourse--;
    }else{
        currentDivElem.classList.remove('active');
        currentDivCourse = totalDivsCourse;
        document.getElementById('div4').classList.add('active');
    }
}