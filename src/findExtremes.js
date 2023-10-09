//bathroom above the bench
//let verticesArray = [0, 0, 839, 0, 848, 1860, 0, 1854];
export function findExtremes(arr) {
  if (arr.length < 2 || arr.length % 2 !== 0) {
    throw new Error("Invalid input array");
  }

  let leftmost = [arr[0], arr[1]];
  let rightmost = [arr[0], arr[1]];
  let highest = [arr[0], arr[1]];
  let lowest = [arr[0], arr[1]];

  for (let i = 0; i < arr.length; i += 2) {
    const x = arr[i];
    const y = arr[i + 1];

    if (x < leftmost[0]) {
      leftmost = [x, y];
    }

    if (x > rightmost[0]) {
      rightmost = [x, y];
    }

    if (y < highest[1]) {
      highest = [x, y];
    }

    if (y > lowest[1]) {
      lowest = [x, y];
    }
  }

  return {
    leftmost,
    rightmost,
    highest,
    lowest,
  };
}
