export class CsvRenderer {
  static ID = "csv";

  get name() {
    return CsvRenderer.ID;
  }

  render(buffer, report) {
    buffer.write(`"${Object.keys(report.rows[0]).join('","')}"\n`);
    for (const row of report.rows) {
      const serialized = report.serializer(row);
      buffer.write(`"${Object.values(serialized).join('","')}"\n`);
    }
  }
}
