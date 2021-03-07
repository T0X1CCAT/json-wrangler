import ReactDOM from 'react-dom';
import React from 'react';
import electron  from 'electron';
import  JsonDisplay from './jsonDisplay' 

const clipboard = electron.clipboard;
const ipc = electron.ipcRenderer;

ipc.on('formattedJson', (evt, parsedJson) => {

	ReactDOM.render(
		<JsonDisplay parsedJson={parsedJson}/>,
		document.getElementById( 'jsonDisplay' ),
	);
});

ipc.on('copySelection', (evt, formattedJson) => {
	const selectedJson =  window.getSelection().toString();
	clipboard.writeText(selectedJson);
});

document.getElementById('reload').addEventListener('click', () => {
	ipc.send('reload');
});

document.getElementById('find').addEventListener('click', () => {
	console.log('find');
	ipc.send('find', {term: document.getElementById('searchText').value });
});

document.getElementById('convertToJavascript').addEventListener('click', () => {
	console.log('convert to javascript');
	ipc.send('convertToJavascriptObject');
});

const focusFindField = () => {
	document.getElementById('searchText').focus();
};

ipc.on('focusFindTextField', (evt , args) => {
	focusFindField();
});


