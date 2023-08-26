// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';

// Auxilary
import $ from 'jquery';
import * as monaco from 'monaco-editor';

$(window).on('resize', updateWindowHeight);

// Events

// document ready
$(() => {
    updateWindowHeight();
/*
    monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        automaticLayout: true
    });
*/
});

function updateWindowHeight(){
    let h = document.documentElement.clientHeight - $('#topDiv').outerHeight();
    $('#mainDiv').height(h + 'px');
    //console.log($(document.documentElement).height());
}

// Monaco
/*
monaco.editor.create(document.getElementById('container'), {
	value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
	language: 'javascript'
});
*/