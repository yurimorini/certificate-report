import { capitalize } from "../utils.mjs";

export class TitleRenderer {
  render(title, buffer) {
    buffer.write(`\n ${capitalize(title)}:\n`);
  }
}

export const title = () => {
  return new TitleRenderer();
};
