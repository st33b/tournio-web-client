const bgColors = [
  'rgb(217, 2, 2)', // red
  'rgb(217, 145, 2)', // orange
  'rgb(247, 89, 232)', // pink-ish
  'rgb(230, 226, 2)', // yellow-ish
  'rgb(6, 173, 0)', // green
  'rgb(2, 125, 207)', // blue
  'rgb(132, 2, 207)', // purple
];

const randomInteger = (max) => { // exclusive of max
  return Math.floor(Math.random() * max);
}

export const chartColors = () => {
  const colors = Array.from(bgColors);
  const shuffledColors = new Array(colors.length).fill(false);
  while (colors.length > 0) {
    let index = randomInteger(shuffledColors.length);
    while (shuffledColors[index]) {
      index = randomInteger(shuffledColors.length);
    }
    shuffledColors[index] = colors.pop();
  }
  return shuffledColors;
}