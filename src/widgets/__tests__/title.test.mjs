import { jest } from "@jest/globals";
import { TitleRenderer, title } from "../title.mjs";

// Mocking buffer.write method
const mockWrite = jest.fn();

// Mocking buffer object
const mockBuffer = {
  write: mockWrite,
};

describe("TitleRenderer", () => {
  beforeEach(() => {
    mockWrite.mockClear();
  });

  test("renders title with capitalize", () => {
    const titleRenderer = new TitleRenderer();
    titleRenderer.render("test", mockBuffer);
    expect(mockWrite).toHaveBeenCalledWith("\n Test:\n");
  });

  test("title function returns an instance of TitleRenderer", () => {
    const instance = title();
    expect(instance).toBeInstanceOf(TitleRenderer);
  });
});
