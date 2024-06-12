// Utility functions for shape generation

export const generateSpecificShape = (index: number): number[][] => {
  switch (index) {
    case 0:
      return [
        [0, 0, 0],
        [1, 1, 1],
        [-1, -1, -1],
      ];
    case 1:
      return [
        [2, 2, 2],
        [3, 3, 3],
        [-2, -2, -2],
      ];
    case 2:
      return [
        [4, 4, 4],
        [5, 5, 5],
        [-3, -3, -3],
      ];
    default:
      return generateRandomShape();
  }
};

export const generateRandomShape = (): number[][] => {
  const shape = [];
  for (let i = 0; i < 3; i++) {
    shape.push([
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
    ]);
  }
  return shape;
};
