<script>
    import {playTone} from './player';

    /**
     * Euclidean algorithm
     *
     * @param {number} a
     * @param {number} b
     * @return {number}
     */
    const gcd = (a, b) => {
      if (!b) {
        return a;
      }

      return gcd(b, a % b);
    }

    /**
     * @param {number} ratio
     * @return {number}
     */
    const ratioToSemitones = (ratio) => semitones * Math.log2(ratio);

    /**
     * @typedef {Object} Props
     * @property {number} semitones
     * @property {number} height
     * @property {number} width
     * @property {number} [frequencyRoot]
     * @property {number} [generator]
     */

    /** @type {Props} */
    let {
      semitones,
      height,
      width,
      frequencyRoot = 440,
      generator = Math.round(ratioToSemitones(3/2))
    } = $props();

    let hovering = $state(false);

    let radius = $derived((Math.min(height, width) / 2) - 20);

    let getPositionOnCircle = $derived((s) => ([
        -Math.sin((s % semitones) * 2 * Math.PI / semitones),
        -Math.cos((s % semitones) * 2 * Math.PI / semitones),
    ]));

    /**
     * @param {MouseEvent} e
     */
    function enter(e) {
      hovering = e.target.attributes['data-number']?.value ?? false;
    }

    /**
     * @param {MouseEvent} e
     */
    function leave(e) {
      hovering = false;
    }

    let isComplete = $derived(1 === gcd(semitones, generator));

    const intervalsToDraw = [
      {name: 'P4', ratio: 4/3},
      {name: 'P5', ratio: 3/2},
      {name: 'M3', ratio: 5/4},
    ];
</script>
<svg width="{width}" height="{height}">
  <circle cx="{width / 2}" cy="{height / 2}" r="{radius}" stroke="black" stroke-width="2" fill="transparent" />

  {#if !isComplete}
    <text
      x="{width / 2}"
      y="{height / 2}"
      text-anchor="middle"
      font-family="monospace"
      fill="#944"
      font-size="12"
    >
      Not a complete circle
    </text>
  {/if}

  {#if hovering !== false}
    {#each intervalsToDraw as {name, ratio}}
      <line
        x1="{radius * getPositionOnCircle(semitones - +hovering)[0] + width / 2}"
        y1="{radius * getPositionOnCircle(semitones - +hovering)[1] + height / 2}"
        x2="{radius * getPositionOnCircle(semitones - +hovering - (generator * Math.round(ratioToSemitones(ratio))))[0] + width / 2}"
        y2="{radius * getPositionOnCircle(semitones - +hovering - (generator * Math.round(ratioToSemitones(ratio))))[1] + height / 2}"
        style="stroke:rgba(255,50,50,.6); stroke-width:4"
      />

      <circle
        cx="{radius * getPositionOnCircle(semitones - +hovering - (generator * Math.round(ratioToSemitones(ratio))))[0] + width / 2}"
        cy="{radius * getPositionOnCircle(semitones - +hovering - (generator * Math.round(ratioToSemitones(ratio))))[1] + height / 2}"
        r="14"
        stroke="rgba(255,50,50,.6)"
        stroke-width="2"
        fill="transparent"
      />

      <rect
        x="{(radius * (getPositionOnCircle(semitones - +hovering)[0] + getPositionOnCircle((semitones - +hovering - ((generator * Math.round(ratioToSemitones(ratio))) % semitones) + semitones))[0]) / 2 + width / 2) - 10}"
        y="{(radius * (getPositionOnCircle(semitones - +hovering)[1] + getPositionOnCircle((semitones - +hovering - ((generator * Math.round(ratioToSemitones(ratio))) % semitones) + semitones))[1]) / 2 + height / 2) - 10}"
        width="20"
        height="20"
        style="fill:rgba(255,255,255,.85)"
      />
      <text
        x="{radius * (getPositionOnCircle(semitones - +hovering)[0] + getPositionOnCircle((semitones - +hovering - ((generator * Math.round(ratioToSemitones(ratio))) % semitones) + semitones))[0]) / 2 + width / 2}"
        y="{radius * (getPositionOnCircle(semitones - +hovering)[1] + getPositionOnCircle((semitones - +hovering - ((generator * Math.round(ratioToSemitones(ratio))) % semitones) + semitones))[1]) / 2 + height / 2 + 4}"
        text-anchor="middle"
        font-family="monospace"
        fill="#52f"
        font-size="12">
        {name}
      </text>
    {/each}
  {/if}

  {#each Array(semitones) as _, i}
		<circle
      data-number={(semitones - i) % semitones}
      data-n={i}
      cx="{radius * getPositionOnCircle(i)[0] + width / 2}"
      cy="{radius * getPositionOnCircle(i)[1] + height / 2}"
      r="13"
      stroke="black"
      stroke-width="1"
      fill="rgba(245,245,245,1)"
      onclick={() => playTone(frequencyRoot * (2 ** (i / semitones)), 1)}
      onmouseenter={enter}
      onmouseleave={leave}
    />

    <text
      x="{radius * getPositionOnCircle(i)[0] + width / 2}"
      y="{radius * getPositionOnCircle(i)[1] + 5 + height / 2}"
      data-n={i}
      data-number={(semitones - i) % semitones}
      text-anchor="middle"
      font-family="monospace"
      fill="#555"
      font-size="12"
      onclick={() => playTone(frequencyRoot * (2 ** (i / semitones)), 1)}
      onmouseenter={enter}
      onmouseleave={leave}
    >
      {(i * (semitones - generator)) % semitones}
      <!-- {frequencyRoot * (2 ** (i / 12))} -->
    </text>
	{/each}
</svg>

<style>
  svg [data-n] {
    cursor: pointer;
  }
</style>
