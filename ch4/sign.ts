// Something to test (doesn't handle zero properly).
export const sign = (value: number) => {
  if (value < 0) {
    return -1;
  } else {
    return 1;
  }
};
