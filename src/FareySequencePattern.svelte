<script>
  export let fareySequenceOrder;
  export let frequencyRoot;
  export let fareySequence;
  export let frequencyInfos;
  export let width = 500;
  let cellHeight = 12;
  let height = (fareySequenceOrder + 1.5) * cellHeight;
</script>

<svg width="{width}" height={height}>
  <g transform="translate(1, 0)">
    {#each fareySequence as [a, b], i}
      <rect opacity="1" fill="#039BE5" width="4" height="{cellHeight}" y={(b - 1) * cellHeight} x={(a/b - 1) * (width - 5)} tabindex="-1"></rect>
    {/each}
    {#each frequencyInfos as {selected, freq}, i}
      <rect opacity="{selected ? .75 : .25}" fill="#FF5722" width="2" height="{(fareySequenceOrder) * cellHeight}" y="0" x={((freq - frequencyRoot) * (width - 5) / frequencyRoot) + 1} tabindex="-1"></rect>
      <text x=0
            y="-9"
            font-family="monospace"
            transform="translate({((freq - frequencyRoot) * (width - 5) / frequencyRoot) - 1}, 0) rotate(90)"
            font-size="10">
          {Math.round(freq)} hz
      </text>

      <text x={((freq - frequencyRoot) * (width - 5) / frequencyRoot) - 1} y={((fareySequenceOrder + 1.2) * cellHeight)}
            opacity="{selected ? 1 : 0.5}"
            transform="translate(, 0) rotate(90)"
            font-family="monospace"
            font-size="10">
          {i}
      </text>
    {/each}
  </g>
</svg>
