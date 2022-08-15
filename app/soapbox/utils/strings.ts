/** Capitalize the first letter of a string. */
// https://stackoverflow.com/a/1026087
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { capitalize };
