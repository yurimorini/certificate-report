import { createReadStream, createWriteStream, fstat } from "node:fs";
import { Readable } from "node:stream";

/**
 * Provides an input stream for the process
 */
export const IO = {
  FILE: "file",
  STRING: "string",
  STDIN: "stdin",
  STDOUT: "stdout",
};

/**
 * Select the input stream
 */
export const selectInput = ({ type, data } = {}) => {
  switch (type) {
    case IO.FILE:
      return getReadFileStream(data);
    case IO.STRING:
      return getStringStream(data);
    case IO.STDIN:
      return getStdin();
    default:
      return getStdin();
  }
};

/**
 * Select the output stream
 */
export const selectOutput = ({ type, data } = {}) => {
  switch (type) {
    case IO.FILE:
      return getWriteFileStream(data);
    case IO.STDOUT:
      return getStdout();
    default:
      return getStdout();
  }
};

/**
 * Get a stream from the input string
 */
const getStringStream = (input) => {
  const s = new Readable();
  s.push(input);
  s.push(null);
  return s;
};

/**
 * Get a stream from the file name
 */
const getReadFileStream = (file) => {
  return createReadStream(file);
};

/**
 * Get a stream from stdin
 */
const getStdin = () => {
  return process.stdin;
};

/**
 * Get the stdout stream
 */
const getStdout = () => {
  return process.stdout;
};

/**
 * Get an output file stream
 */
const getWriteFileStream = (file) => {
  if (file) {
    return createWriteStream(file, { flags: "w", autoClose: false });
  }
};
