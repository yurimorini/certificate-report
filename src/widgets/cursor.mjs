import readline from "readline";
import { listingExit } from "../utils.mjs";

export const createCursor = (buffer) => {
  buffer = buffer ?? process.stderr;

  const frames = ["-", "\\", "|", "/"];
  const max = frames.length;

  let i = 0;
  let hidden = false;
  let last;
  let frame;

  const iface = {
    /**
     * Hide the cursor
     */
    hide() {
      if (!hidden) {
        hidden = true;
        buffer.write("\u001B[?25l");
      }
    },

    /**
     * Shows the cursor
     */
    show() {
      if (hidden) {
        hidden = false;
        buffer.write("\u001B[?25h");
      }
    },

    /**
     * Updates the state pointer
     */
    update(text) {
      this.hide();

      last = frame;
      frame = `${frames[i % max]} ${text ?? ""}`;

      const prevLen = last?.length ?? 0;
      const frameLen = frame.length;

      // clear
      buffer.write(" ".repeat(prevLen));
      readline.moveCursor(buffer, -prevLen, 0);

      // rewrite
      buffer.write(frame);
      readline.moveCursor(buffer, -frameLen, 0);

      i++;
    },

    /**
     * End the cursor and reset
     */
    end() {
      last = frame;
      const prevLen = last?.length ?? 0;

      // clear
      buffer.write(" ".repeat(prevLen));
      readline.moveCursor(buffer, -prevLen, 0);

      this.show();
    },
  };

  // Reset cursor
  listingExit(() => {
    iface.show();
  });

  return iface;
};
