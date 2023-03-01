import './Page.css';
import { useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

function Page() {
	const [count, setCount] = useState(0);

	console.log('%c*** render=', 'background: #eee; color: blue', qrList.length);

	// get cameras list
	useEffect(() => {
		videoContainerElem = document.getElementById('video-container');
		videoElem = videoContainerElem.children[0];
		infoContainerElem = document.getElementById('info-container');
		initQrScanner();
		qrScanner.start().then(() => {
			QrScanner.listCameras(true).then(_cameras => {
				console.debug('%c*** cameras=', 'background: #eee; color: blue', _cameras);
				cameras = _cameras;
				if (!cameras?.length) return;
				if (!cameras[0].id) {
					// не удалось распознать камеру
					return renderError('Нет доступа к камере. Разрешите доступ у перезагрузите приложение.');
				}
				renderSwitchCameraButton();
				checkFlash();
				cameraIndex = cameras.length - 1;
				if (cameras.length > 1) {
					switchCamera(cameraIndex);
				}
			});
		});
	}, []);

	useEffect(() => {
		// for rerender
		setTimeout(() => setCount(count + 1), 5000);
	});

	return null;
}

let qrScanner;
let lastError;
let videoContainerElem;
let videoElem;
let infoContainerElem;
let switchCameraButtonElem;
let cameras;
let cameraIndex;
let qrCount = 0;
let qrList = [];
let restoreStyleTimerId;
let qrListElem;

const callbacker = {
	onDetect: ({ data }) => {
		console.log('%c*** data=', 'background: #eee; color: blue', data);
		const found = qrList.find(qr => qr.data === data);
		if (!found) {
			console.log('%c*** add new rq=', 'background: #eee; color: blue');
			qrList.unshift({
				data,
				index: ++qrCount,
			});
			renderQrList();
		}
		switchStyle('example-style-1');
	},
	onError: error => {
		if (error !== lastError) {
			lastError = error;
			console.log('%c*** error=', 'background: #eee; color: blue', error);
		}
	},
	handleDetect: (...args) => callbacker.onDetect?.apply(this, args),
	handleError: (...args) => callbacker.onError?.apply(this, args),
}

function initQrScanner() {
	qrScanner = new QrScanner(
		videoElem,
		callbacker.handleDetect,
		{
			onDecodeError: callbacker.handleError,
			highlightScanRegion: true,
			highlightCodeOutline: true,
		},
	);
}

function updateSwitchCameraText() {
	switchCameraButtonElem.innerText = `Camera ${cameraIndex}`;
}

function switchCamera(index) {
	qrScanner.setCamera(cameras[index].id);
	updateSwitchCameraText();
}

function switchStyle(cn) {
	clearTimeout(restoreStyleTimerId);
	videoContainerElem.className = cn;
	qrScanner._updateOverlay();
	if (cn) {
		restoreStyleTimerId = setTimeout(() => {
			switchStyle('');
		}, 1000);
	}
}

function renderSwitchCameraButton() {
	infoContainerElem.innerHTML = '';
	try {
		if (cameras.length <= 1) return;
		switchCameraButtonElem = document.createElement('button');
		infoContainerElem.appendChild(switchCameraButtonElem);
		switchCameraButtonElem.addEventListener('click', () => {
			cameraIndex = (cameraIndex + 1) % cameras.length;
			switchCamera(cameraIndex);
		});
		updateSwitchCameraText();
	} catch (error) {
		renderError(error);
	}
}

function checkFlash() {
	qrScanner.hasFlash().then(hasFlash => {
		if (hasFlash) {
			const flashToggle = document.createElement('button');
			flashToggle.innerText = 'Flash';
			infoContainerElem.appendChild(flashToggle);
			flashToggle.addEventListener('click', () => {
				qrScanner.toggleFlash();
			});
		}
	});
}

function renderError(error) {
	alert(error);
}

function removeQrByIndex(index) {
	qrList = qrList.filter(qr => qr.index !== index);
	renderQrList();
}

function renderQrList() {
	if (!qrListElem) {
		qrListElem = document.createElement('div');
		qrListElem.className = 'info';
		infoContainerElem.appendChild(qrListElem);
	}
	qrListElem.innerHTML = '';
	qrList.forEach(qr => {
		const itemNode = document.createElement('div');
		itemNode.className = 'qr-item';
		qrListElem.appendChild(itemNode);

		const textNode = document.createElement('div');
		textNode.innerText = `${qr.index}. ${qr.data}`;
		itemNode.appendChild(textNode);

		const removeBtn = document.createElement('button');
		removeBtn.innerText = 'x';
		itemNode.appendChild(removeBtn);
		removeBtn.addEventListener('click', () => removeQrByIndex(qr.index));
	});
}

export default Page;
