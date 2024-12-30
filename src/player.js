// create web audio api context
/** @type {AudioContext} */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * @param {number} frequency
 * @param {number} duration
 * @param {{gain: number, onended: () => any}|null} options
 */
export const playTone = (frequency, duration, options = null) => {
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = options?.gain ?? 0.75;
    gainNode.connect(audioCtx.destination);

    const oscillator = audioCtx.createOscillator();
    // oscillator.type = 'sine';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(gainNode);
    if (options?.onended) {
        oscillator.onended = options.onended;
    }
    oscillator.start(0);
    oscillator.stop(audioCtx.currentTime + duration);
};
