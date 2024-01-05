let currentExamDiv = 1;
const totalExamDivs = 3;

function showNextDivExam() {
    const currentDivId = `div${currentExamDiv}`;
    const nextDivId = `div${currentExamDiv + 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentExamDiv++;
    }else{
        currentDivElem.classList.remove('active');
        currentExamDiv = 1;
        document.getElementById('div1').classList.add('active');
    }

    editButtonText();
}

function showPrevDivExam() {
    const currentDivId = `div${currentExamDiv}`;
    const nextDivId = `div${currentExamDiv - 1}`;

    const currentDivElem = document.getElementById(currentDivId);
    const nextDivElem = document.getElementById(nextDivId);

    if(nextDivElem){
        currentDivElem.classList.remove('active');
        nextDivElem.classList.add('active');
        currentExamDiv--;
    }else{
        currentDivElem.classList.remove('active');
        currentExamDiv = totalExamDivs;
        document.getElementById('div3').classList.add('active');
    }

    editButtonText();
}

function editButtonText() { 
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");

    if (currentExamDiv === 1) {
        prevButton.textContent = "Final Exam";
        nextButton.textContent = "Midterm 2";
    } else if (currentExamDiv === 2) {
        prevButton.textContent = "Midterm 1";
        nextButton.textContent = "Final Exam";
    } else {
        prevButton.textContent = "Midterm 2";
        nextButton.textContent = "Midterm 1";
    }
}