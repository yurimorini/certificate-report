import tls from "node:tls";
import { mapper } from "./certificateMapper.mjs";
import { parseDomain } from "./utils.mjs";

/**
 * Extract the certficate from a domain
 */
export const getCertificate = async (host, port) => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ servername: host, port, host }, () => {
      const certificate = socket.getPeerCertificate();
      socket.end();
      resolve(certificate);
    });

    socket.on("error", (error) => {
      reject(error);
    });

    socket.setTimeout(1000, () => {
      const error = new Error("Handshake timeout");
      socket.emit("error", error);
      reject(error);
    });
  });
};

/**
 * Bind an hostname and port and extract certificate data
 */
export function sourceDataFor(host) {
  let certificate;
  const { hostname, port } = parseDomain(host);

  const get = async () => {
    if (!certificate) {
      try {
        certificate = await getCertificate(hostname, port);
      } catch (e) {
        return { error: e, hostname, port };
      }
    }
    return certificate;
  };

  return {
    get hostname() {
      return hostname;
    },

    get port() {
      return port;
    },

    async create() {
      const cert = await get();
      return mapper(cert);
    },
  };
}
