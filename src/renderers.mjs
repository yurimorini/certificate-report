import { TerminalRenderer } from "./renderer/terminal.mjs";
import { isString } from "./utils.mjs";

/**
 * Expose renderers indexed by their name
 */
const createFactory = (iterator) => {
  const list = {};

  for (const item of iterator) {
    if (item.name && item.render) {
      list[item.name] = item;
    }
  }

  return {
    /**
     * Get the renderer by its id
     */
    get(name) {
      if (isString(name) && list[name]) {
        return list[name];
      }
    },

    /**
     * Check if the renderer with the given name exists
     */
    exists(format) {
      return Object.keys(list).includes(format);
    },

    /**
     * Returns all available names
     */
    all() {
      return Object.keys(list);
    },
  };
};

/**
 * Select the output of the data or use a default one
 */
export const createRenderer = (format, list) => {
  const factory = createFactory(list);
  const selected = format ?? TerminalRenderer.ID;

  if (!factory.exists(selected)) {
    throw new Error(
      `Invalid format provided. Available formats: [${factory.all().join(",")}] -- ${format}`,
    );
  }

  return factory.get(selected);
};
