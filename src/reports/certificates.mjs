import { placeholders, renderDate } from "../utils.mjs";
import { TerminalRenderer } from "../renderer/terminal.mjs";

export class CertificatesReport {
  constructor(buffer) {
    this.add = this.add.bind(this);
    this.rows = [];
  }

  get name() {
    return "cert";
  }

  get target() {
    return "certificate";
  }

  get keys() {
    return ["commonName", "expiration", "serial"];
  }

  get label() {
    return "found certificates";
  }

  get serializer() {
    return (row) =>
      placeholders({
        ...row,
        expiration: renderDate(row.expiration),
      });
  }

  add(data) {
    const { certificate } = data;

    if (certificate.error()) {
      return;
    }

    this.rows.push({
      commonName: certificate.commonName(),
      expiration: certificate.expiration(),
      serial: certificate.serial(),
      error: certificate.error(),
    });

    this.rows.sort((a, b) => {
      return (
        a.error - b.error ||
        new Date(a?.expiration ?? 0) - new Date(b?.expiration ?? 0) ||
        a?.commonName?.localeCompare(b?.commonName)
      );
    });
  }
}
