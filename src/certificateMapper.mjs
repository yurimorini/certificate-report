/**
 * Maps expiration month to JS month
 */
const getMonthFromString = (mon) => {
  return new Date(Date.parse(`${mon} 1, 2012`)).getMonth();
};

/**
 * Map certificate expiration to JS date
 */
const mapExpiration = (data) => {
  const matched = data.matchAll(/^([a-z]{3})\s+(\d+) (\d{2}:\d{2}:\d{2}) (\d{4}) ([a-z]{3})/gi);
  const splitted = Array.from(matched)[0];

  if (splitted && splitted.length > 0) {
    const rawTime = splitted[3].split(":");
    const year = Number.parseInt(splitted[4]);
    const month = getMonthFromString(splitted[1]);
    const day = Number.parseInt(splitted[2]);
    const hour = Number.parseInt(rawTime[0]);
    const minute = Number.parseInt(rawTime[1]);
    const second = Number.parseInt(rawTime[2]);

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  return null;
};

/**
 * Maps certificate SANs
 */
const mapSan = (data) => {
  const re = /DNS:([^\s,]+)/g;
  return [...data.matchAll(re)].map((item) => item[1]).sort();
};

/**
 * Maps an SSL certificate result
 */
export const mapper = (cert) => {
  return !cert.error ? validCertificate(cert) : invalidCertificate(cert);
};

/**
 * Maps a valid certificate
 */
const validCertificate = (cert) => {
  return {
    raw() {
      return cert;
    },

    serial() {
      return cert.serialNumber;
    },

    expiration() {
      return mapExpiration(cert.valid_to);
    },

    sans() {
      return mapSan(cert.subjectaltname);
    },

    subject() {
      return cert.subject;
    },

    commonName() {
      return cert.subject?.CN;
    },

    domains() {
      return [...new Set([...this.sans(), this.commonName()])].sort();
    },

    error() {
      return false;
    },

    toJson() {
      return {
        serial: this.serial(),
        expiration: this.expiration(),
        domains: this.domains(),
      };
    },
  };
};

const invalidCertificate = (cert) => {
  const DUMMY = "--";
  return {
    raw() {
      return cert;
    },

    serial() {
      return "";
    },

    expiration() {
      return;
    },

    sans() {
      return [];
    },

    subject() {
      return hostname;
    },

    commonName() {
      return "";
    },

    domains() {
      return [];
    },

    error() {
      return true;
    },

    toJson() {
      return {
        serial: this.serial(),
        expiration: this.expiration(),
        domains: this.domains(),
      };
    },
  };
};
