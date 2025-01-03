<script>
  import ToneCircle from './ToneCircle.svelte';
  import WavePlot from './WavePlot.svelte';
  import FareySequencePattern from './FareySequencePattern.svelte';
  import {playTone} from './player';

  /**
   * @param {number} order
   * @return {[number, number][]}
   */
  const getFareySequence = (order) => {
    let fareySequenceSet = {};
    for (let b = 1; b <= order; ++b) {
      for (let a = 0; a <= b; ++a) {
        let round = Math.round(a/b * 10000) / 10000;
        fareySequenceSet[round] = fareySequenceSet[round] ?? [a + b, b];
      }
    }

    return Object.values(fareySequenceSet).sort(([a0, b0], [a1, b1]) => a0 / b0 - a1 / b1);
  };

  /**
   * @param {[number, number][]} sequence
   * @param {number} number
   */
  const getClosestFromFareySequence = (sequence, number) => {
    let error = null;
    let best = null;

    sequence.forEach(([a, b]) => {
      let currError = Math.abs(a/b - number);
      if (error === null || currError < error) {
        error = currError;
        best = [a, b];
      }
    });

    return best;
  };

  /**
   * @param {number} number
   * @param {number} precision
   */
  const round = (number, precision) => Math.round(number * 10 ** precision) / 10 ** precision;

  let fareySequenceOrder = $state(15);
  const fareySequence = $derived(getFareySequence(fareySequenceOrder));

  let frequencyRoot = $state(440);
  let semitones = $state(12); // semitones
  // let scaleBinary = "10";
  let scaleBinary = $state("101101011010"); // C minor
  let rowWidth = $state();

  let frequency = $derived((n) => 2 ** (n / semitones));

  let frequencies = $derived((scaleBinary.padEnd(semitones , '0') + (scaleBinary[0] ?? '0')).split('').map((v, i) => [v === '1' || v === 'x', frequency(i)]));

  let frequencyInfo = $derived(([selected, freq]) => {
    const base = {
      selected,
      normalizedFreq: freq - 1,
      freq: freq * frequencyRoot,
      farey: getClosestFromFareySequence(fareySequence, freq),
    };
    base.fareyError = 1 - (1 / freq * base.farey[0] / base.farey[1]);
    base.fareyErrorAbs = freq * frequencyRoot - (frequencyRoot * base.farey[0] / base.farey[1]);

    return base;
  });

  let frequencyInfos = $derived(frequencies.map(frequencyInfo));
  let frequencyStats = $derived((() => {
    let maxError = null;
    let sum = 0;
    frequencyInfos.forEach(({freq, fareyError}) => {
      maxError = Math.max(maxError, fareyError)
      sum += Math.abs(fareyError);
    });

    return {
      maxError,
      avgError: sum / semitones,
    };
  })());

  let toneCircleGenerator = $state(7);

</script>
<h1>Equal temperament playground</h1>
<span class="source"><a href="https://github.com/BafS/equal-temperament-playground">source</a></span>

<WavePlot frequencyRoot={frequencyRoot} semitones={semitones} scaleBinary={scaleBinary} width={rowWidth} />

<div class="row main-inputs">
  <span title="Use 0/1 to define which semi-tones are part of the scale">Scale: <input type="text" maxlength={semitones} bind:value={scaleBinary}></span>
  <span><a href="https://en.wikipedia.org/wiki/Fundamental_frequency">Fundamental frequency</a> (<em>hz</em>): <input type="number" bind:value={frequencyRoot}></span>
  <span>Semi-tones: <input type="number" bind:value={semitones}></span>
  <span>Farey sequence order: <input type="number" min=2 max=200 bind:value={fareySequenceOrder}></span>
</div>

<div class="main">
  <div class="row" bind:clientWidth={rowWidth}>
    <div class="column">
      <table>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col" colspan="3">Farey order {fareySequenceOrder}</th>
          </tr>
          <tr>
            <th scope="col">Semi-<br>tone</th>
            <th scope="col">Frequency<br>(Hz)</th>
            <th scope="col">Ratio</th>
            <th scope="col">Error<br>(Hz)</th>
          </tr>
        </thead>
        <tbody>
          {#each frequencyInfos as {selected, freq, farey, fareyError, fareyErrorAbs}, i}
          <tr style="{!selected ? `opacity: .6` : ``}">
            <td>{i}</td>
            <td>{freq ? Math.round(freq * 100) / 100 : ''} <small>Hz</small> <button class="btn-play" onclick={() => playTone(freq, 1)}>▶</button></td>
        <!--     <td></td> -->
            <td>{farey.join(':')}</td>
            <td>{Math.round(fareyError * 10000) / 100}<small>%</small> <small>({Math.round(fareyErrorAbs * 100) / 100} Hz)</small></td>
          </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">
              Avg(error) = {Math.round(frequencyStats.avgError * 10000) / 100}<small>%</small><br>
              Max(error) = {Math.round(frequencyStats.maxError * 10000) / 100}<small>%</small>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="column">
      <div id="tone-circle">
        <h4><a href="https://en.wikipedia.org/wiki/Circle_of_fifths">Circle of fifths</a></h4>
        <ToneCircle
          width={rowWidth > 1000 ? (rowWidth / 2) : 280}
          height={rowWidth > 1000 ? (rowWidth / 3) : 280}
          semitones={semitones}
          generator={toneCircleGenerator}
          frequencyRoot={frequencyRoot}
        /><br>
        Generator: <input class="input-small" type="number" min="1" max="199" bind:value={toneCircleGenerator}>
      </div>

      <div id="farey-sequence-pattern">
        <h4><a href="https://en.wikipedia.org/wiki/Farey_sequence">Farey sequence pattern</a></h4>
        <FareySequencePattern
          fareySequenceOrder={fareySequenceOrder}
          frequencyRoot={frequencyRoot}
          fareySequence={fareySequence}
          frequencyInfos={frequencyInfos}
          width={rowWidth > 1000 ? rowWidth / 2 : rowWidth}
        />
      </div>

      <div>
        <p>
          <a href="https://en.wikipedia.org/wiki/Perfect_fifth">Perfect fifth</a>: {round(frequencyRoot * 3/2, 4)} Hz<br>
          <a href="https://en.wikipedia.org/wiki/Perfect_fourth">Perfect fourth</a>: {round(frequencyRoot * 4/3, 4)} Hz<br>
          <a href="https://en.wikipedia.org/wiki/Major_third">Major third</a>: {round(frequencyRoot * 5/4, 4)} Hz<br>
        </p>
      </div>
    </div>
  </div>
</div>

<!-- Debug -->
<!-- <p>{fareySequence.map(([a, b]) => `${a}/${b}`).join(', ')}</p> -->

<style>
  input[type="number"], .input-small {
    width: 90px
  }
  table {
    min-width: 500px;
    background: #fbfbfb;
    padding: .2rem;
    border-collapse: collapse;
    text-align: left;
  }
  table thead, table tfoot {
    background: #eee;
  }
  table td, table th {
    padding: .4rem 1.5rem;
    vertical-align: top;
  }
  table td {
    border-top: 1px solid #dee2e6;
  }

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
    padding: 0 .25rem;
  }

  h1 {
    font-size: 1.2rem;
    font-weight: normal;
    background: #000;
    display: inline-block;
    color: #fff;
    padding: 2px;
    margin: 0;
    margin-bottom: 6px;
  }
  .source {
    font-size: 80%;
    float: right;
  }

  .main-inputs {
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .main-inputs span {
    margin-right: 25px;
  }

  .btn-play {
    background-color: rgba(200, 200, 200, .075);
    font-size: 90%;
    padding: 3px 10px;
  }
</style>
