export class TableRenderer {
  #keys = [];
  #gliphs = new LineGliphs();
  #serializer = (i) => i;

  constructor({ keys, serializer, gliphs }) {
    this.#keys = keys;
    this.#serializer = serializer ?? this.#serializer;
    this.#gliphs = gliphs ?? this.#gliphs;

    Object.freeze(this);
  }

  /**
   * Render the table
   */
  render(rows, buffer) {
    const header = this.#prepareHeader();
    const lines = this.#prepareRow(rows);
    const sizes = this.#computeColumnSize(header.concat(lines));

    buffer.write(this.#renderSeparator("top", sizes));

    for (const row of header) {
      buffer.write(this.#renderRow(row, sizes));
    }

    buffer.write(this.#renderSeparator("medium", sizes));

    for (const row of lines) {
      buffer.write(this.#renderRow(row, sizes));
    }

    buffer.write(this.#renderSeparator("bottom", sizes));
  }

  /**
   * Render a row
   */
  #renderRow(row, sizes) {
    const { pad, vertical, nl } = this.#gliphs;
    let buffer = vertical;

    for (const k of this.#keys) {
      const { label, width } = row[k];
      const fill = Math.max(width, sizes[k]) - width;
      const content = label + pad.repeat(fill);
      buffer += content + vertical;
    }

    return buffer + nl;
  }

  /**
   * Render separator row
   */
  #renderSeparator(type, sizes) {
    const { horizontal, nl } = this.#gliphs;
    const chars = this.#gliphs[type];
    const max = this.#keys.length - 1;
    let buffer = chars.left;

    for (const [i, k] of this.#keys.entries()) {
      const sep = i < max ? chars.corner : chars.right;
      buffer += horizontal.repeat(sizes[k]) + sep;
    }

    return buffer + nl;
  }

  /**
   * Prepares header cells
   */
  #prepareHeader() {
    const provider = (k) => k.charAt(0).toUpperCase() + k.slice(1);
    return [this.#prepare(provider)];
  }

  /**
   * Prepares body cells
   */
  #prepareRow(rows) {
    return rows.map((row) => {
      const serialized = this.#serializer(row);
      const provider = (k) => serialized[k];
      return this.#prepare(provider);
    });
  }

  /**
   * Serialize the cell values and pre-compute length
   */
  #prepare(provider) {
    const data = {};
    const { space } = this.#gliphs;

    for (const k of this.#keys) {
      const label = space + provider(k) + space;
      const width = label.length;

      data[k] = { label, width };
    }
    return data;
  }

  /**
   * Giving the epected data structure and
   * the list of rows, compute the lengths of all the columns
   */
  #computeColumnSize(rows) {
    return rows.reduce(
      (prev, row) => {
        for (const k of this.#keys) {
          prev[k] = Math.max(prev[k], row[k].width);
        }
        return prev;
      },
      this.#objFromKeys(this.#keys, 0),
    );
  }

  /**
   * Creates an object from a list of keys
   * filling its values
   */
  #objFromKeys(keys, fill) {
    const obj = {};
    for (const k of keys) {
      obj[k] = fill;
    }
    return obj;
  }
}

/**
 * List of gliphs: https://en.wikipedia.org/wiki/Box-drawing_character
 */
class LineGliphs {
  constructor() {
    this.space = this.pad.repeat(this.margin);
    Object.freeze(this);
  }

  pad = " ";
  nl = "\n";
  margin = 2;

  horizontal = "\u2500";
  vertical = "\u2502";

  top = {
    left: "\u250c",
    right: "\u2510",
    corner: "\u252c",
  };
  bottom = {
    left: "\u2514",
    right: "\u2518",
    corner: "\u2534",
  };
  medium = {
    left: "\u251c",
    right: "\u2524",
    corner: "\u253c",
  };
}

export const table = (options) => {
  return new TableRenderer(options);
};
