let title, seeds;
let info;
let id = 0;

document.getElementById('titleChange').onclick = function() {
	let p = prompt('Enter new title.');
	if (p) {
		title = p.trim();
		this.parentNode.parentNode.children[2].children[0].innerText = title;
	}
}

document.getElementById('seedChange').onclick = function() {
	let p = prompt('Enter new seed(s).');
	if (p) {
		seeds = p.split(',');
		seeds.forEach((e, i) => {
			seeds[i] = e.trim();
		});
		this.parentNode.parentNode.children[2].children[0].innerText = seeds.join(',');
	}
}

Array.from([
	['titleButton', 'Input the title for the test.'],
	['seedButton', 'Input the seed(s) for the test.\n\nInputting a list of seeds separated by commas will generate multiple tests, starting with version A.\n\nE.g. inputting "abc,def,ghi" will result in tests with versions A, B, and C with seeds "abc", "def", and "ghi", respectively (ignore the quotes).'],
	['hasNameButton', 'Check if you want a line to write the student\'s name.'],
	['hasDateButton', 'Check if you want a line to write the date.'],
	['hasPeriodButton', 'Check if you want a line to write the student\'s period.'],
	['hasSeedButton', 'Check if you want to print the seed on the test.'],
	['hasTotalPointsButton', 'Check if you want to print the total number of points at the top.'],
	['isNumberedButton', 'Check if you want to number questions automatically.'],
	['hasPointValuesButton', 'Check if you want to include the point value for each question next to it.'],
	['fileUploadButton', 'Upload a completed .xlsx file (can download and edit the template).']
]).forEach((e) => {
	document.getElementById(e[0]).onclick = function() {
		alert(e[1]);
	}
});

function parseExcel(file) {
	return new Promise((resolve) => {
		let reader = new FileReader();
		reader.onload = function(e) {
			let data = e.target.result;
			let workbook = XLSX.read(data, {
				type: 'binary'
			});
			workbook.SheetNames.forEach(function(sheetName) {
				let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
				let json_object = JSON.stringify(XL_row_object);
				let info = JSON.parse(json_object);
				resolve(info);
			});
		};
		reader.readAsBinaryString(file);
	});
}

async function handleFileSelect(id) {
	var files = document.getElementById(id).files;
	if (files[0]) {
		info = await parseExcel(files[0]);
		Object.freeze(info);
	}
}

async function generate() {
	await handleFileSelect('fileUpload');
	if (!title) {
		let d = document.getElementById('titleButton').parentElement.parentElement;
		d.style.boxShadow = '0 0 10px red';
		setTimeout(function() {
			d.style.boxShadow = null;
		}, 250);
	}
	if (!seeds) {
		let d = document.getElementById('seedButton').parentElement.parentElement;
		d.style.boxShadow = '0 0 10px red';
		setTimeout(function() {
			d.style.boxShadow = null;
		}, 250);
	}
	if (!info) {
		let d = document.getElementById('fileUploadButton').parentElement.parentElement;
		d.style.boxShadow = '0 0 10px red';
		setTimeout(function() {
			d.style.boxShadow = null;
		}, 250);
	}
	if (title && seeds && info) {
		document.getElementById('div1').style.display = 'none';
		generate2();
	}
}

function generate2() {
	document.getElementById('pageLeft').style.display = id != 0 ? null : 'none';
	document.getElementById('pageRight').style.display = id != seeds.length - 1 ? null : 'none';

	document.body.scrollTop = document.documentElement.scrollTop = 0;
	
	let d = document.getElementById('div2');
	d.innerHTML = '';
	let d1 = document.createElement('div');
	d1.classList.add('flexbox');
	d1.style.justifyContent = 'flex-end';
	d.appendChild(d1);
	
	if (document.getElementById('hasName').checked) {
		let d2 = document.createElement('div');
		d2.classList.add('flexbox');
		d2.style.flexGrow = 3;
		d2.style.columnGap = '5px';
		d1.appendChild(d2);
		let p = document.createElement('p');
		p.innerText = 'Name: ';
		d2.appendChild(p);
		let l = document.createElement('div');
		l.style.height = '18px';
		l.style.borderBottom = '1px solid black';
		l.style.flex = 1;
		d2.appendChild(l);
	}
	if (document.getElementById('hasDate').checked) {
		let d2 = document.createElement('div');
		d2.classList.add('flexbox');
		d2.style.flexGrow = 1;
		d2.style.columnGap = '5px';
		d1.appendChild(d2);
		let p = document.createElement('p');
		p.innerText = 'Date: ';
		d2.appendChild(p);
		let l = document.createElement('div');
		l.style.height = '18px';
		l.style.borderBottom = '1px solid black';
		l.style.flex = 1;
		d2.appendChild(l);
	}
	if (document.getElementById('hasPeriod').checked) {
		let d2 = document.createElement('div');
		d2.classList.add('flexbox');
		d2.style.flexGrow = 1;
		d2.style.columnGap = '5px';
		d1.appendChild(d2);
		let p = document.createElement('p');
		p.innerText = 'Period: ';
		d2.appendChild(p);
		let l = document.createElement('div');
		l.style.height = '18px';
		l.style.borderBottom = '1px solid black';
		l.style.flex = 1;
		d2.appendChild(l);
	}

	let d2 = document.createElement('h3');
	d2.innerText = 'ID: ' + getID(id);
	d1.appendChild(d2);

	if (document.getElementById('hasSeed').checked) {
		let d1 = document.createElement('div');
		d1.classList.add('flexbox');
		d1.style.justifyContent = 'flex-end';
		d.appendChild(d1);
		let p = document.createElement('p');
		p.innerText = 'Seed: ' + seeds[id];
		d1.appendChild(p);
	}

	d2 = document.createElement('h2');
	d2.innerText = title + (document.getElementById('hasTotalPoints').checked ? '\xa0\xa0( ' + '_'.repeat(getTotalPoints().toString().length) + ' / ' + getTotalPoints() + ' )' : '');
	d.appendChild(d2);
	d.appendChild(document.createElement('br'));

	let newInfo = shuffleArray(seeds[id], info);
	newInfo.forEach((e, i) => {
		d.appendChild(generateQuestion(e, i + 1));
		d.appendChild(document.createElement('br'));
	});
}

function pageRight() {
	if (id + 1 < seeds.length) {
		id++;
		generate2();
	}
}

function pageLeft() {
	if (id - 1 >= 0) {
		id--;
		generate2();
	}
}

function generateQuestion(question, num) {
	let qArray = generateTextArray(question.question);
	let q = document.createElement('div');
	let top = document.createElement('div');
	top.classList.add('flexbox');
	top.style.alignItems = 'flex-start';
	if (document.getElementById('isNumbered').checked) {
		let d1 = document.createElement('b');
		d1.innerText = num + '.';
		top.appendChild(d1);
	}
	let d2 = document.createElement('div');
	d2.innerHTML = qArray.join('<br>') + (document.getElementById('hasPointValues').checked ? '(' + (isNaN(parseInt(question.pointValue)) ? 1 : parseInt(question.pointValue)) + ' pts.)' : '');
	top.appendChild(d2);
	q.appendChild(top);

	let answers = document.createElement('div');
	answers.classList.add('answers');
	if (question.type == 'MCQ') {
		let a = question.answers.split('\\\\');
		let list = document.createElement('ol');
		list.style.listStyleType = 'upper-alpha';
		a.forEach(e => {
			let li = document.createElement('li');
			li.innerHTML = generateTextArray(e).join('<br>');
			list.appendChild(li);
		});
		answers.appendChild(list);
	} else if (question.type == 'SAQ') {
		let l = [document.createElement('div'), document.createElement('div')];
		l.forEach(e => {
			e.classList.add('answerLine');
			answers.appendChild(e);
		});
	}
	q.appendChild(answers);
	
	return q;
}

function generateTextArray(text) {
	let list = [];
	while (text.length) {
		let newLineIndex = text.indexOf('\\n');
		let imgIndex1 = text.indexOf('image(');
		let imgIndex2;
		if (imgIndex1 != -1) {
			imgIndex2 = text.indexOf(')', imgIndex1 + 6);
		}
		
		if (imgIndex1 != -1 && imgIndex2 != -1) {
			if (newLineIndex != -1 && newLineIndex < imgIndex1) {
				list.push('<p>' + text.substring(0, newLineIndex) + '</p>');
				text = text.substring(newLineIndex + 2);
			} else {
				list.push('<p>' + text.substring(0, imgIndex1) + '</p>');
				list.push('<img src=' + text.substring(imgIndex1 + 6, imgIndex2) + '>');
				text = text.substring(imgIndex2 + 1);
			}
		} else {
			if (newLineIndex != -1) {
				list.push('<p>' + text.substring(0, newLineIndex) + '</p>');
				text = text.substring(newLineIndex + 2);
			} else {
				list.push('<p>' + text + '</p>');
				text = '';
			}
		}
	}
	return list;
}

function getTotalPoints() {
	let s = 0;
	for (let i of info) {
		s += parseInt(i.pointValue);
	}
	return s;
}

function getID(n) {
	let s = '';
	while (n >= 0) {
		s = String.fromCharCode(n % 26 + 'A'.charCodeAt(0)) + s;
		n = Math.floor(n / 26) - 1;
	}
	return s;
}