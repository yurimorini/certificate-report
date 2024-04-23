import { basename } from "node:path";

/**
 * Usage helper to render help text and check condition
 * to show or not showing it
 */
export class PrintHelper {
  getName() {
    return basename(process.argv[1]);
  }

  usage() {
    const name = this.getName();
    const list = [
      "",
      `Usage: ${name} [OPTIONS]... `,
      "Fetches input domain list certificates and shows expirations",
      "",
      "  -f, --file    read from space or new line delimited file input",
      "  -h, --help    display this help and exit",
      "  -i, --input   read from space delimited option",
      "  -o, --output  print output to the provided file name",
      "  -r, --report  use only the specified reporter instead of all the availables",
      "  -t, --format  format the output",
      "",
      "With no -i or -f options read standard input",
      "",
      "Examples:",
      "",
      `  ${name} -i "example.com example.net example.org:443"`,
      `  ${name} -f domains.txt`,
      `  ${name} < domains.txt`,
      `  cat domains.txt | ${name}`,
      `  ${name} -f input.txt -o output.csv -t csv -r exp`,
      "",
    ];
    return list.join("\n");
  }

  renderInvalidOption(opt) {
    return `Invalid option -- ${opt}\n${this.usage()}`;
  }

  show() {
    process.stdout.write(`${this.usage()}\n`);
    process.exit(0);
  }

  error(error) {
    process.stderr.write(`${this.getName()}: ${error}\n`);
    process.exit(1);
  }
}

/**
 * Usage text helper
 */
export const createHelper = () => {
  return new PrintHelper();
};
