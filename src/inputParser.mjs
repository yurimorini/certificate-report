import { createInterface } from "node:readline";
import { Resolver } from "node:dns/promises";
import { parseDomain } from "./utils.mjs";

/**
 * Accepts just valid domain names
 */
export const isAcceptedDomainName = (domain) => {
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)*$/;
  return domainRegex.test(domain);
};

/**
 * Performs a DNS lookup
 */
const lookupDomain = async (word, timeout = 100) => {
  try {
    const resolver = new Resolver({ timeout });
    await resolver.resolve(word);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validate the domain rules
 */
const isDomainAllowed = async (domain) => {
  const validDomain = isAcceptedDomainName(domain);

  if (!validDomain) {
    return false;
  }

  const { hostname } = parseDomain(domain);
  const realDomain = await lookupDomain(hostname);
  return !!realDomain;
};

/**
 * Check if object is a readable stream
 */
const isReadableStream = (obj) => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    typeof obj.pipe === "function" &&
    typeof obj.on === "function"
  );
};

/**
 * Stream stdin searching input domains
 */
export const readInput = async function* (input) {
  if (!isReadableStream(input)) {
    return;
  }

  const rl = createInterface({
    input,
    output: process.stdout,
    terminal: false,
  });

  for await (const line of rl) {
    const words = line.trim().split(/\s+/);
    for (const word of words) {
      if (await isDomainAllowed(word)) {
        yield word;
      }
    }
  }
};
