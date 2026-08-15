const { parseLRC } = require('./services/lrclib');

const sampleLRC = `
[00:12.50] First line of the song
[00:15.80] Second line of the song
[00:20.10][01:05.40] Chorus line repeated twice
[00:25.00] Third line of the song
`;

const parsed = parseLRC(sampleLRC);
console.log('Parsed LRC:', parsed);

if (parsed.length === 5 && parsed[0].time === 12.5) {
  console.log('TEST PASSED');
} else {
  console.log('TEST FAILED');
}
