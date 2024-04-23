import { jest } from "@jest/globals";
import { TableRenderer, table } from "../table.mjs";

describe("TableRenderer", () => {
  let mockBuffer;

  beforeEach(() => {
    mockBuffer = { write: jest.fn() };
  });

  test("constructor initializes with provided keys and glyphs", () => {
    const keys = ["name", "age"];
    const renderer = new TableRenderer({ keys });
    renderer.render([{ name: "John", age: "30" }], mockBuffer);
    expect(mockBuffer.write).toHaveBeenCalled();
  });

  test("render outputs the correct header and row data", () => {
    const keys = ["name", "age"];
    const renderer = new TableRenderer({ keys });
    const data = [{ name: "John", age: "30" }];
    renderer.render(data, mockBuffer);

    const calls = mockBuffer.write.mock.calls;

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[1][0]).toContain("Name");
    expect(calls[1][0]).toContain("Age");
    expect(calls[3][0]).toContain("John");
    expect(calls[3][0]).toContain("30");
  });

  test("render outputs the serializing data", () => {
    const keys = ["name", "age"];

    const serializer = (row) => ({
      name: row.name.split("").join(" "),
      age: row.age.split("").join(" "),
    });

    const renderer = new TableRenderer({ keys, serializer });
    const data = [{ name: "John", age: "30" }];
    renderer.render(data, mockBuffer);

    const calls = mockBuffer.write.mock.calls;

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[1][0]).toContain("Name");
    expect(calls[1][0]).toContain("Age");
    expect(calls[3][0]).toContain("J o h n");
    expect(calls[3][0]).toContain("3 0");
  });

  test("handles empty data set", () => {
    const keys = ["name", "age"];
    const renderer = new TableRenderer({ keys });
    renderer.render([], mockBuffer);

    const calls = mockBuffer.write.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[1][0]).toContain("Name");
    expect(calls[1][0]).toContain("Age");
  });
});
