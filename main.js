/*
 * main.js
 * Copyright (C) 2015 KuoE0 <kuoe0.tw@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

function fetch(uri, onLoadToDo) {
	var p = new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", uri, true);
		xhr.responseType = "arraybuffer";
		xhr.addEventListener("load", function() {
			console.log("fetch load uri='" + uri + "' status=" + xhr.status);
			resolve(xhr.response);
		});
		xhr.send();
	});
	if (onLoadToDo) {
		p.then(onLoadToDo);
	}
	return p;
}

function runMSE() {
	console.log("Start test MSE...");
	var ms = new MediaSource();
	var el = document.createElement("video");
	el.src = URL.createObjectURL(ms);
	el.preload = 'auto';
	document.body.appendChild(el);

	ms.addEventListener("sourceopen", function () {
		console.log("sourceopen");
		var sb = ms.addSourceBuffer('video/webm');
		console.log("Source buffer added.");
		fetch('seek.webm', function (response) {
			var data = new Uint8Array(response);
			console.log("Append buffer to SourceBuffer");
			sb.appendBuffer(data);
			sb.addEventListener('update', function () {
				console.log("SourceBuffer updated");
				el.play();
			});
		});
	});
}

window.onload = function () {
	console.log("Simple MSE WebM Test");
	runMSE();
}

