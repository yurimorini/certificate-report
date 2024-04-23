/**
 * Normalizes locale from OS
 */
export const getLocale = () => {
  if (!getLocale.LOCALE) {
    const env = process.env;
    let locale = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
    if (!locale) {
      locale = Intl.DateTimeFormat().resolvedOptions().locale;
    }
    getLocale.LOCALE = locale.split(".")[0].replace("_", "-");
  }
  return getLocale.LOCALE;
};

/**
 * Render a date
 */
export const renderDate = (date, placeholder= "--") => {
  if (date instanceof Date) {
    return date.toLocaleString(getLocale(), {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h24",
      timeZone: "utc",
    });
  }
  return placeholder;
};

/**
 * Check if var is string
 */
export const isString = (s) => {
  return typeof s === "string" || s instanceof String;
};

/**
 * Capitalize first letter
 */
export const capitalize = (s) => {
  const word = s ?? "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * Timeout async
 */
export const delay = (t, val) => {
  return new Promise((resolve) => setTimeout(resolve, t, val));
};

/**
 * Serialize empty values
 */
export const placeholders = (row) => {
  const mapped = {};
  for (const [k, v] of Object.entries(row)) {
    if (typeof v === "boolean") {
      mapped[k] = v ? "true" : "false";
    } else if (typeof v === 'number') {
      mapped[k] = v;
    } else {
      mapped[k] = v ? v : "--";
    }
  }
  return mapped;
};

/**
 * Attach a callback to the exit signals
 */
export const listingExit = (callback) => {
  for (const evt of ["exit", "SIGINT", "SIGTERM", "SIGQUIT"]) {
    process.on(evt, async () => await callback());
  }
};

/**
 * Parse a domain string splitting port and host
 */
export const parseDomain = (hostname) => {
  if (hostname) {
    const res = hostname.match(/^([^:]*):*(\d+)*/);
    if (res) {
      return { hostname: res[1], port: res[2] || 443 };
    }
  }
  return { hostname: '', port: 443 };
};

/**
 * Resolve the promise when the stream closes
 */
export const closeStream = async (stream) => {
  return new Promise((res, rej) => {
    if (stream !== process.stdout && !stream.writableFinished) {
      stream.on("finish", () => res());
      stream.on("error", () => rej());
      stream.end();
    } else {
      res();
    }
  });
};