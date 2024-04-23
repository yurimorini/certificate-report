import { title } from "../widgets/title.mjs";
import { table } from "../widgets/table.mjs";

export class TerminalRenderer {
  static ID = "terminal";

  get name() {
    return TerminalRenderer.ID;
  }

  render(buffer, report) {
    const { keys, serializer, label, rows } = report;
    title().render(label, buffer);
    table({ keys, serializer }).render(rows, buffer);
  }
}
