import { jest } from "@jest/globals";
import { Readable } from "node:stream";
import { isAcceptedDomainName, readInput } from "../inputParser.mjs";

describe('isAcceptedDomainName', () => {
  it('should return true for valid domain names without port', () => {
    expect(isAcceptedDomainName('example.com')).toBe(true);
    expect(isAcceptedDomainName('subdomain.example.com')).toBe(true);
    expect(isAcceptedDomainName('www.example.com')).toBe(true);
    expect(isAcceptedDomainName('123example.com')).toBe(true);
    expect(isAcceptedDomainName('example123.com')).toBe(true);
  });

  it('should return true for valid domain names with port', () => {
    expect(isAcceptedDomainName('example.com:8080')).toBe(true);
    expect(isAcceptedDomainName('subdomain.example.com:8080')).toBe(true);
    expect(isAcceptedDomainName('www.example.com:8080')).toBe(true);
    expect(isAcceptedDomainName('123example.com:8080')).toBe(true);
    expect(isAcceptedDomainName('example123.com:8080')).toBe(true);
  });

  it('should return false for invalid domain names', () => {
    expect(isAcceptedDomainName('example')).toBe(false);
    expect(isAcceptedDomainName('example.')).toBe(false);
    expect(isAcceptedDomainName('example.com:')).toBe(false);
    expect(isAcceptedDomainName('example.com:port')).toBe(false);
    expect(isAcceptedDomainName('example.com:8080:')).toBe(false);
  });
});


describe("readInput", () => {
  test("readInput should yield valid domains", async () => {
    const input = new Readable();
    input.push("example.com\nexample.net example.org");
    input.push(null);

    const generator = readInput(input);
    const result = [];
    for await (const domain of generator) {
      result.push(domain);
    }

    expect(result).toEqual(["example.com", "example.net", "example.org"]);
  });

  test("readInput should skip invalid domains", async () => {
    const input = new Readable();
    input.push("not_a_domain\n");
    input.push(null);

    const generator = readInput(input);
    const result = [];
    for await (const domain of generator) {
      result.push(domain);
    }

    expect(result).toEqual([]);
  });
});