export class TabRenderer {
  static ID = "tab";

  get name() {
    return TabRenderer.ID;
  }

  render(buffer, report) {
    buffer.write(`${report.keys.join("\t")}\n`);
    for (const row of report.rows) {
      const serialized = report.serializer(row);
      buffer.write(`${Object.values(serialized).join("\t")}\n`);
    }
  }
}
