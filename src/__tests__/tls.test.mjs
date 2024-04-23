import { sourceDataFor } from "../tls.mjs";

describe("sourceDataFor", () => {
  test("sourceDataFor should bind hostname and port", () => {
    const hostname = "example.com";
    const port = 443;
    const bound = sourceDataFor(hostname, port);
    expect(bound.hostname).toEqual(hostname);
    expect(bound.port).toEqual(port);
  });
});

function mockCertificate() {
  return {
    commonName: "www.example.net",
    serialNumber: "CertificateSerial",
    valid_to: "Jan 01 12:00:00 2024 GMT",
    subjectaltname: "DNS:example.com, DNS:www.example.com",
    subject: { CN: "CertificateCommonName" },
  };
}
