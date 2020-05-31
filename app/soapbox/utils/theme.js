export const themeDataToCss = themeData => (
  themeData
    .entrySeq()
    .reduce((acc, cur) => acc + `--${cur[0]}:${cur[1]};`, '')
);
