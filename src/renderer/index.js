
import electron  from 'electron';
const clipboard = electron.clipboard;
const ipc = electron.ipcRenderer;

console.log('loaded');

ipc.on('formattedJson', (evt, formattedJson) => {
	console.log('b');
	document.getElementById("jsonDisplay").innerText = formattedJson;
});

ipc.on('copySelection', (evt, formattedJson) => {
	console.log('copy selection');
	const selectedJson =  window.getSelection().toString();
	clipboard.writeText(selectedJson);
});

document.getElementById('reload').addEventListener('click', () => {
	console.log('reload');
	ipc.send('reload');
});

document.getElementById('copy').addEventListener('click', () => {
	console.log('copy');
	ipc.send('copy');
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


