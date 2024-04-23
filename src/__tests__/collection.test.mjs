import { jest } from "@jest/globals";
import { Collection } from "../collection";

describe("Collection", () => {
  let collection;

  beforeEach(() => {
    collection = new Collection();
  });

  it("should emit hostname event when a new source is added", async () => {
    const certificate = { serial: () => "123" };
    const source = {
      create: jest.fn().mockResolvedValue(certificate),
      hostname: "example.com",
    };
    const callback = jest.fn();

    collection.on(Collection.ON_HOSTNAME, callback);
    await collection.add(source);

    expect(callback).toHaveBeenCalledWith({
      certificate: certificate,
      hostname: "example.com",
    });
  });

  it("should emit certificate event when a new certificate is added", async () => {
    const certificate = { serial: () => "123" };
    const source = {
      create: jest.fn().mockResolvedValue(certificate),
      hostname: "example.com",
    };
    const callback = jest.fn();

    collection.on(Collection.ON_CERTIFICATE, callback);
    await collection.add(source);

    expect(callback).toHaveBeenCalledWith({
      certificate: certificate,
      hostname: "example.com",
    });
  });

  it("should not emit event if certificate with same serial is added multiple times", async () => {
    const certificate1 = { serial: () => "123", prop: "a" };
    const certificate2 = { serial: () => "123", prop: "b" };
    const source1 = { create: jest.fn().mockResolvedValue(certificate1), hostname: "example.com" };
    const source2 = { create: jest.fn().mockResolvedValue(certificate2), hostname: "example.net" };

    const callback = jest.fn();

    collection.on(Collection.ON_CERTIFICATE, callback);
    await collection.add(source1);
    await collection.add(source2);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      certificate: certificate1,
      hostname: "example.com",
    });
  });

  it("should add a source to the collection", async () => {
    const certificate = { serial: () => "123" };
    const source = {
      create: jest.fn().mockResolvedValue(certificate),
      hostname: "example.com",
    };

    await collection.add(source);

    const data = collection.get();
    expect(data.size).toBe(1);
    expect(data.get("123")).toEqual({ certificate, hostnames: ["example.com"] });
  });

  it("should add multiple hostnames to an existing certificate", async () => {
    const certificate = { serial: () => "123" };
    const source1 = { create: jest.fn().mockResolvedValue(certificate), hostname: "example.com" };
    const source2 = { create: jest.fn().mockResolvedValue(certificate), hostname: "example.org" };

    await collection.add(source1);
    await collection.add(source2);

    const data = collection.get();
    expect(data.size).toBe(1);
    expect(data.get("123").hostnames).toEqual(["example.com", "example.org"]);
  });

  it("should accept multiple handlers", async () => {
    const certificate = { serial: () => "123" };
    const source = { create: jest.fn().mockResolvedValue(certificate), hostname: "example.com" };

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    collection.on(Collection.ON_HOSTNAME, [callback1, callback2]);
    await collection.add(source);

    expect(callback1).toHaveBeenCalledWith({
      certificate: certificate,
      hostname: "example.com",
    });

    expect(callback2).toHaveBeenCalledWith({
      certificate: certificate,
      hostname: "example.com",
    });
  });
});
