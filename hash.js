function cyrb128(str) {
	let h1 = 1779033703, h2 = 3144134277,
		h3 = 1013904242, h4 = 2773480762;
	for (let i = 0, k; i < str.length; i++) {
		k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

function sfc32(seed_1, seed_2, seed_3, seed_4) {
	return () => {
		seed_1 >>>= 0; seed_2 >>>= 0; seed_3 >>>= 0; seed_4 >>>= 0;
		let cast32 = (seed_1 + seed_2) | 0;
		seed_1 = seed_2 ^ seed_2 >>> 9;
		seed_2 = seed_3 + (seed_3 << 3) | 0;
		seed_3 = (seed_3 << 21 | seed_3 >>> 11);
		seed_4 = seed_4 + 1 | 0;
		cast32 = cast32 + seed_4 | 0;
		seed_3 = seed_3 + cast32 | 0;
		return (cast32 >>> 0) / 4294967296;
	}
}

function shuffleArray(str, arr){
	arr = structuredClone(arr);
	var rArr = [];
	var random = sfc32(...cyrb128(str));        
	while(arr.length > 1){
		rArr.push(arr.splice(Math.floor(random() * arr.length), 1)[0]);
	}
	rArr.push(arr[0]);
	return rArr;
}