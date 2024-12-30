<script>
  /**
   * @typedef {Object} Props
   * @property {any} fareySequenceOrder
   * @property {any} frequencyRoot
   * @property {any} fareySequence
   * @property {any} frequencyInfos
   * @property {number} [width]
   */

  /** @type {Props} */
  let {
    fareySequenceOrder,
    frequencyRoot,
    fareySequence,
    frequencyInfos,
    width = 500
  } = $props();

  let cellHeight = 12;
  let height = $derived((fareySequenceOrder + 1.5) * cellHeight);

  /**
   * @param {number} i
   * @param {number} freq
   * @return {number}
   */
  const alignX = (i, freq) => {
    const base = (freq - frequencyRoot) * (width - 5) / frequencyRoot;
    const numWidth = 4 * (1 + Math.log10(i) | 0);
    return Math.min(width - numWidth * 1.5, base - numWidth / 2);
  };
</script>

<svg width={width} height={height}>
  <g transform="translate(1, 0)">
    {#each fareySequence as [a, b], i}
      <rect opacity="1" fill="#039BE5" width="4" height="{cellHeight}" y={(b - 1) * cellHeight} x={(a/b - 1) * (width - 5)} tabindex="-1"></rect>
    {/each}
    {#each frequencyInfos as {selected, freq}, i}
      <rect opacity="{selected ? .75 : .25}" fill="#FF5722" width="2" height="{(fareySequenceOrder) * cellHeight}" y="0" x={((freq - frequencyRoot) * (width - 5) / frequencyRoot) + 1} tabindex="-1"></rect>
      <text x=0
            y={i === frequencyInfos.length - 1 ? 9 : -9}
            font-family="monospace"
            transform="translate({((freq - frequencyRoot) * (width - 5) / frequencyRoot) - 1}, 0) rotate(90)"
            font-size="10">
          {Math.round(freq)} hz
      </text>

      <text x={alignX(i, freq)}
            y={(fareySequenceOrder + 1.2) * cellHeight}
            opacity="{selected ? 1 : 0.5}"
            transform="translate(, 0) rotate(90)"
            font-family="monospace"
            font-size="10">
          {i}
      </text>
    {/each}
  </g>
</svg>
