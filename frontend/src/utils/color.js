import material from "material-colors";
const RAINBOW_TEARS_PALETTE = [
  material.red["900"],
  material.pink["900"],
  material.purple["900"],
  material.deepPurple["900"],
  material.indigo["900"],
  material.blue["900"],
  material.lightBlue["900"],
  material.cyan["900"],
  material.teal["900"],
  "#194D33",
  material.lightGreen["900"],
  material.lime["900"],
  material.yellow["700"],
  material.amber["900"],
  material.orange["900"],
  material.deepOrange["900"],
  material.brown["900"],
  material.blueGrey["900"],
  "#000000",
  "#525252",
  "#969696",
  "#D9D9D9",
  "#FFFFFF",
];

export const randomColor = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

export const intToColor = function (value) {
  if (value < 0 && value >= RAINBOW_TEARS_PALETTE.length) {
    return randomColor();
  }
  return RAINBOW_TEARS_PALETTE[value];
};


export const setOpacity = (hex, alpha) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;
