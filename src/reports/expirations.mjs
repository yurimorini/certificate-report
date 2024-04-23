import { placeholders, renderDate } from "../utils.mjs";
import { TerminalRenderer } from "../renderer/terminal.mjs";

export class ExpirationReport {
  constructor(buffer) {
    this.add = this.add.bind(this);
    this.rows = [];
  }

  get name() {
    return "exp";
  }

  get target() {
    return "hostname";
  }

  get keys() {
    return ["hostname", "expiration", "serial"];
  }

  get label() {
    return "domain expirations";
  }

  get serializer() {
    return (row) => placeholders({ ...row, expiration: renderDate(row.expiration) });
  }

  add(data) {
    const { certificate, hostname } = data;

    this.rows.push({
      hostname: hostname,
      expiration: certificate.expiration(),
      serial: certificate.serial(),
      error: certificate.error(),
    });

    this.rows.sort((a, b) => {
      return (
        a.error - b.error ||
        new Date(a?.expiration ?? 0) - new Date(b?.expiration ?? 0) ||
        a?.hostname?.localeCompare(b?.hostname)
      );
    });
  }
}
