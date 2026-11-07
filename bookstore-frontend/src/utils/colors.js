// The same name always gives the same colour (a number from 0 to 359 = hue on the colour wheel)
export function categoryHue(name = "") {
  let hash = 0;
  for (const character of name) {
    hash = (hash * 31 + character.charCodeAt(0)) % 360;
  }
  return hash;
}