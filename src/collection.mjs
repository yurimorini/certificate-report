import { EventEmitter } from "node:events";

/**
 * Factory helper
 */
export const createCollection = () => {
  return new Collection();
};

/**
 * Create a certificate collection for all found domains
 */
export class Collection {
  #list = new Map();
  #events = new EventEmitter();

  /**
   * Events on adding info
   */
  static ON_HOSTNAME = "hostname";
  static ON_CERTIFICATE = "certificate";

  /**
   * Listen to events on the emitter
   */
  on(event, callbacks) {
    const list = Array.isArray(callbacks) ? callbacks : [callbacks];
    for (const cb of list) {
      this.#events.on(event, cb);
    }
  }

  /**
   * Add a source to the collection splitting
   * it in certificate and input domain.
   *
   * Emits events in case of new domain or certificate
   */
  async add(source) {
    const certificate = await source.create();
    const serial = certificate.serial();
    const hostname = source.hostname;

    const payload = { certificate, hostname };
    const isNew = !this.#list.has(serial);

    if (isNew) {
      this.#list.set(serial, { certificate, hostnames: [hostname] });
    } else {
      const value = this.#list.get(serial);
      value.hostnames.push(hostname);
    }

    if (isNew) {
      this.#events.emit(Collection.ON_CERTIFICATE, payload);
    }
    this.#events.emit(Collection.ON_HOSTNAME, payload);
  }

  /**
   * Ge the collection data
   */
  get() {
    return this.#list;
  }
}
