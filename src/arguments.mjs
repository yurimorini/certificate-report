import minimist from "minimist";
import { fstat } from "node:fs";
import { IO } from "./ioSelector.mjs";

/**
 * Listen to stdin trying to intercept input stream of data
 */
const pipedIn = async () => {
  const pFstat = (file) =>
    new Promise((resolve, reject) => {
      fstat(file, (err, stats) => (err ? reject(err) : resolve(stats)));
    });

  const stats = await pFstat(0);
  return stats.isFIFO();
};

/**
 * Resolve command arguments to config options
 * Throws an error in case of invalid option
 */
export const resolveArgs = async (helper, argList) => {
  const argv = minimist(argList.slice(2));

  // Prioritize input stream
  let inputType = (await pipedIn()) ? IO.STDIN : undefined;

  // Normalizes other options
  let outputType;
  let formatType;
  let reportType;
  let help = false;

  // Read options
  for (const [opt, value] of Object.entries(argv)) {
    switch (opt) {
      case "i":
      case "input":
        inputType = { type: IO.STRING, data: value };
        break;
      case "f":
      case "file":
        inputType = inputType ? inputType : { type: IO.FILE, data: value };
        break;
      case "o":
      case "output":
        outputType = { type: IO.FILE, data: value };
        break;
      case "t":
      case "format":
        formatType = value;
        break;
      case "r":
      case "report":
        reportType = value;
        break;
      case "h":
      case "help":
        help = true;
        break;
      case "_":
        break;
      default:
        throw new Error(helper.renderInvalidOption(opt));
    }
  }

  return { argv, inputType, outputType, formatType, reportType, help };
};
