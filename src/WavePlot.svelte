<script>
	import {onMount, afterUpdate} from 'svelte';

	let canvas;
	export let scaleBinary;
	export let frequencyRoot = 440;
	export let semitones = 12;
  export let width = 1000;
  export let height = 300;
	const colors = ['FF8A80', 'B388FF', '80D8FF', 'B9F6CA', 'FFFF8D', 'FF9E80', '8D6E63'];

	$: frequency = (n) => 2 ** (n / semitones);

	$: frequencies = scaleBinary.padEnd(semitones + 1, '0').split('').map((v, i) => [v === '1' || v === 'x', frequency(i)]);

	const frequencyFunctionCreator = (hz) => (t) => Math.sin(t * hz * Math.PI * 2);

	const compression = 100000;

	const plot = (ctx, fun, color) => {
		let previous = 0;
		ctx.beginPath();
    for (let i = 0; i < canvas.width - 1; ++i) {
			const y = fun(i / compression) * canvas.height / 2.2;
			let rel = canvas.height / 2;

			ctx.lineWidth = "1.5";
			ctx.strokeStyle = color; // Green path
			ctx.moveTo(i, rel - previous);
			ctx.lineTo(i + 1, rel - y);
			previous = y;
    }
		ctx.stroke();
	};

	$: canvasFn = (() => {
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// ticks
		[].forEach((n, idx) => {
			let i = 0;
			let x = 0;
			while (x < canvas.width) {
				ctx.beginPath();
				ctx.lineWidth = "2";
				ctx.strokeStyle = '#' + colors[idx % colors.length];
				x = Math.round(i * compression / frequencyRoot / 2 * n);
				ctx.moveTo(x + .5, Math.round(canvas.height / 2) - 20);
				ctx.lineTo(x + .5, Math.round(canvas.height / 2) + 20);
				ctx.stroke();
				ctx.lineWidth = 1;
				i++;
			}
		});

    var t1 = new Date();

		ctx.beginPath();
		ctx.lineWidth = '1.5';
		ctx.strokeStyle = 'grey';
		ctx.moveTo(0, Math.round(canvas.height / 2));
		ctx.lineTo(canvas.width, Math.round(canvas.height / 2));
		ctx.stroke();

		frequencies.filter(([s, f]) => s).forEach(([s, f], i) => {
			plot(ctx, frequencyFunctionCreator(f * frequencyRoot), '#' + colors[i % colors.length]);
		});

    var t2 = new Date();
    var dt = t2 - t1;

    console.log('elapsed time = ' + dt + ' ms');
	});

	onMount(() => {
    canvas.width = width * 2;
    canvas.height = height * 2;
	});

	afterUpdate(() => {
		canvasFn();
	});
</script>

<canvas
	bind:this={canvas}
	height={height * 2}
></canvas>

<style>
  canvas {
    width: 100%;
    background-color: #000;
  }
</style>
