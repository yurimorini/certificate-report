import { mapper } from "../certificateMapper.mjs";

describe("Mapper", () => {
  test("Expiration should return a mapped expiration date", () => {
    const mapped = mapCertificate();
    expect(mapped.expiration()).toEqual(new Date(Date.UTC(2024, 0, 1, 12, 0, 0)));
  });

  test("Empty expiration is mapped as null", () => {
    const mapped = mapCertificate({ valid_to: "" });
    expect(mapped.expiration()).toBeNull();
  });

  test("Serial should return the certificate serial number", () => {
    const mapped = mapCertificate();
    expect(mapped.serial()).toEqual("CertificateSerial");
  });

  test("Common name should return the certficate common name", () => {
    const mapped = mapCertificate();
    expect(mapped.commonName()).toEqual("www.example.net");
  });

  test("Domains should return an array of SANs and commonName", () => {
    const mapped = mapCertificate();
    expect(mapped.domains()).toEqual(["example.com", "www.example.com", "www.example.net"]);
  });

  test("If certificate has error map an empty object", () => {
    const mapped = mapCertificate({ error: new Error('dummy') });
    expect(mapped.expiration()).toEqual(undefined);
    expect(mapped.error()).toEqual(true);
  });
});

function mapCertificate(cert) {
  const certificate = cert ?? mockCertificate();
  return mapper(certificate);
}

function mockCertificate() {
  return {
    serialNumber: "CertificateSerial",
    valid_to: "Jan 01 12:00:00 2024 GMT",
    subjectaltname: "DNS:example.com, DNS:www.example.com",
    subject: { CN: "www.example.net" },
  };
}
