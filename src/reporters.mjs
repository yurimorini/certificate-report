import { isString } from "./utils.mjs";

/**
 * Expose reporters indexed by their name
 */
const createFactory = (iterator) => {
  const list = {};

  for (const item of iterator) {
    if (item.name && item.add) {
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

    byTarget(target) {
      return Object.values(list).find((item) => item.target === target);
    },

    /**
     * Check if the reporters with the given name exists
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

    /**
     * Loop over the list
     */
    *iterate(type) {
      if (type) {
        yield this.get(type);
      } else {
        for (const [name, item] of Object.entries(list)) {
          yield item;
        }
      }
    },
  };
};

/**
 * Create a reporter orchestrator
 */
export const createReporters = (type, list) => {
  const factory = createFactory(list);

  if (type && !factory.exists(type)) {
    throw new Error(
      `Invalid reporter provided. Available reporters: [${factory.all().join(",")}] -- ${type}`,
    );
  }

  return {
    /**
     * Connect every collection event
     * to a reporter exposing the same target name
     */
    connect(collection) {
      const events = ["hostname", "certificate"];

      for (const event of events) {
        const reporter = factory.byTarget(event);

        if (reporter) {
          collection.on(event, reporter.add);
        }
      }
    },

    /**
     * Render all reporter contents
     */
    render(buffer, renderer) {
      for (const reporter of factory.iterate(type)) {
        renderer.render(buffer, reporter);
      }
    },
  };
};
