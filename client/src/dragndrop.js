// source: https://css-tricks.com/examples/DragAndDropFileUploading/

module.exports =  (document, window, index) => {
	// feature detection for drag&drop upload
	const isAdvancedUpload = () => {
			const div = document.createElement('div');
			return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
		}
	const form = document.querySelector('.box');
	const input = form.querySelector('input[type="file"]');
	const	label = form.querySelector('label');
	const	errorMsg = form.querySelector('.box__error span');
	const restart	= form.querySelectorAll('.box__restart');
	let droppedFile = false;
	const showFile = (file) => {
		label.textContent = file.name;
	};
	const triggerFormSubmit = () => {
		const event = document.createEvent('HTMLEvents');
		event.initEvent('submit', true, false);
		form.dispatchEvent(event);
	};

	// letting the server side to know we are going to make an Ajax request
	const ajaxFlag = document.createElement('input');
	ajaxFlag.setAttribute('type', 'hidden');
	ajaxFlag.setAttribute('name', 'file');
	ajaxFlag.setAttribute('value', 1);
	form.appendChild(ajaxFlag);

	// automatically submit the form on file select
	input.addEventListener('change', function(e) {
		showFile(e.target.files[0]);
		triggerFormSubmit();
	});

	form.classList.add('has-advanced-upload'); // change CSS if drag&drop is supported by the browser

	['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((event) => {
		form.addEventListener(event, (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
	});
	['dragover', 'dragenter'].forEach((event) => {
		form.addEventListener(event, () => {
			form.classList.add('is-dragover');
		});
	});
	['dragleave', 'dragend', 'drop'].forEach((event) => {
		form.addEventListener(event, () => {
			form.classList.remove('is-dragover');
		});
	});
	form.addEventListener('drop', (e) => {
		droppedFile = e.dataTransfer.files[0]; // the file that was dropped
		showFile(droppedFile);
		triggerFormSubmit();
	});

	// if the form was submitted
	form.addEventListener('submit', (e) => {
		// prevent duplicate submissions if the current one is in progress
		if (form.classList.contains('is-uploading')) return false;
		form.classList.add('is-uploading');
		form.classList.remove('is-error');

		if (isAdvancedUpload) { // ajax file upload for modern browsers
			e.preventDefault();

			// gathering the form data
			const ajaxData = new FormData(form);
			if (droppedFile) {
					ajaxData.set(input.getAttribute('name'), droppedFile);
				};
			console.log(ajaxData);

			// ajax request
			const ajax = new XMLHttpRequest();
			ajax.open(form.getAttribute('method'), form.getAttribute('action'), true);

			ajax.onload = () => {
				console.log('ajax.onload');
				form.classList.remove('is-uploading');
				console.log(`ajax.status: ${ajax.status}`);
				console.log(ajax.responseText);
				if(ajax.status >= 200 && ajax.status < 400) {
					var data = JSON.parse(ajax.responseText);
					form.classList.add(data.success === true ? 'is-success' : 'is-error');
					if(!data.success) errorMsg.textContent = data.error;
				}
				else alert('Error. Please, contact the webmaster!');
			};

			ajax.onerror = () => {
				form.classList.remove('is-uploading');
				alert('Error. Please, try again!');
			};

			ajax.send(ajaxData);
		} else {
			console.log('This browser does not support ajax')
		}
	});

	// restart the form if has a state of error/success
	Array.prototype.forEach.call(restart, (entry) => {
		entry.addEventListener('click', (e) => {
			e.preventDefault();
			form.classList.remove('is-error', 'is-success');
			input.click();
		});
	});

	// Firefox focus bug fix for file input
	input.addEventListener('focus', () => { input.classList.add('has-focus'); });
	input.addEventListener('blur', () => { input.classList.remove('has-focus'); });
};