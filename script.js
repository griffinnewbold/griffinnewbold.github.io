/*
 * Copyright (c) 2013, 2020, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */
let currentDiv = 1;
let currentTeachingDiv = 1;
let currentProjectDiv = 1;
const totalProjectDivs = 10;
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
        document.getElementById('div10').classList.add('active');
    }
}
