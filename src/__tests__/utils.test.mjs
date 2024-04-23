import { jest } from "@jest/globals";
import { getLocale, renderDate, isString, capitalize, placeholders, listingExit, parseDomain } from "../utils.mjs";

describe("getLocale", () => {
  test("should return default locale based on environment variables", () => {
    process.env.LANG = "en_US.UTF-8";
    expect(getLocale()).toBe("en-US");

    delete process.env.LANG; // Clean up
    delete getLocale.LOCALE;
  });

  test("should use Intl when no environment variables are set", () => {
    const originalIntl = Intl;
    
    global.Intl = {
      DateTimeFormat: () => ({
        resolvedOptions: () => ({ locale: "fr_FR" }),
      }),
    };

    expect(getLocale()).toBe("fr-FR");
    
    global.Intl = originalIntl; // Restore original Intl
    delete getLocale.LOCALE;
  });
});

describe("renderDate", () => {
  test("should correctly format a date", () => {
    const date = new Date("2023-01-01T12:00:00Z");
    const formattedDate = renderDate(date);
    // Assuming getLocale() returns 'en-US', you might need to mock getLocale if it doesn't
    expect(formattedDate).toBe("Sunday, Jan 1, 2023, 12:00");
  });

  test("should return placeholder string for non-Date inputs", () => {
    expect(renderDate("2023-01-01")).toBe("--");
  });

  test("should return placeholder string for non-Date inputs", () => {
    expect(renderDate("2023-01-01", "xx")).toBe("xx");
  });
});

describe("isString", () => {
  test("should return true for string inputs", () => {
    expect(isString("hello")).toBe(true);
    expect(isString(new String("hello"))).toBe(true);
  });

  test("should return false for non-string inputs", () => {
    expect(isString(123)).toBe(false);
    expect(isString({})).toBe(false);
  });
});

describe("capitalize", () => {
  test("should capitalize lowercase words", () => {
    expect(capitalize("word")).toBe("Word");
  });

  test("should handle empty strings", () => {
    expect(capitalize("")).toBe("");
  });

  test("should handle nullish inputs", () => {
    expect(capitalize(null)).toBe("");
    expect(capitalize(undefined)).toBe("");
  });

  it('should handle already capitalized words', () => {
    expect(capitalize('Hello')).toBe('Hello');
    expect(capitalize('World')).toBe('World');
  });

  it('should handle words with all uppercase letters', () => {
    expect(capitalize('HELLO')).toBe('HELLO');
  });
});

describe('placeholders', () => {
  it('should serialize empty values correctly', () => {
    const input = { name: 'John', age: 30, isActive: true };
    const expectedOutput = { name: 'John', age: 30, isActive: 'true' };
    expect(placeholders(input)).toEqual(expectedOutput);
  });

  it('should replace empty strings with "--"', () => {
    const input = { name: '', age: 0, isActive: false };
    const expectedOutput = { name: '--', age: 0, isActive: 'false' };
    expect(placeholders(input)).toEqual(expectedOutput);
  });

  it('should replace null values with "--"', () => {
    const input = { name: null, age: null, isActive: null };
    const expectedOutput = { name: '--', age: '--', isActive: '--' };
    expect(placeholders(input)).toEqual(expectedOutput);
  });

  it('should replace undefined values with "--"', () => {
    const input = { name: undefined, age: undefined, isActive: undefined };
    const expectedOutput = { name: '--', age: '--', isActive: '--' };
    expect(placeholders(input)).toEqual(expectedOutput);
  });

  it('should handle mixed types correctly', () => {
    const input = { name: null, age: 25, isActive: true };
    const expectedOutput = { name: '--', age: 25, isActive: 'true' };
    expect(placeholders(input)).toEqual(expectedOutput);
  });

  it('should handle boolean values correctly', () => {
    const input = { trueValue: true, falseValue: false };
    const expectedOutput = { trueValue: 'true', falseValue: 'false' };
    expect(placeholders(input)).toEqual(expectedOutput);
  });

  it('should handle non-empty string values correctly', () => {
    const input = { name: 'Alice', age: '30', isActive: 'true' };
    const expectedOutput = { name: 'Alice', age: '30', isActive: 'true' };
    expect(placeholders(input)).toEqual(expectedOutput);
  });
});


describe('listingExit', () => {
  let originalProcessOn;

  beforeAll(() => {
    // Save the original process.on method so we can restore it later
    originalProcessOn = process.on;
  });

  afterAll(() => {
    // Restore the original process.on method after all tests are done
    process.on = originalProcessOn;
  });

  it('should attach callback to exit signals', () => {
    const callback = jest.fn();
    const processOnMock = jest.spyOn(process, 'on');

    listingExit(callback);

    expect(processOnMock).toHaveBeenCalledTimes(4);
    expect(processOnMock).toHaveBeenCalledWith('exit', expect.any(Function));
    expect(processOnMock).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(processOnMock).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(processOnMock).toHaveBeenCalledWith('SIGQUIT', expect.any(Function));
  });

  it('should call the callback when exit signals are received', () => {
    const callback = jest.fn();
    listingExit(callback);

    // Simulate receiving exit signals
    process.emit('exit');
    process.emit('SIGINT');
    process.emit('SIGTERM');
    process.emit('SIGQUIT');

    // Expect the callback to be called for each signal
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('parseDomain', () => {
  it('should parse domain strings without port correctly', () => {
    const result = parseDomain('example.com');
    expect(result).toEqual({ hostname: 'example.com', port: 443 });
  });

  it('should parse domain strings with port correctly', () => {
    const result = parseDomain('example.com:8080');
    expect(result).toEqual({ hostname: 'example.com', port: '8080' });
  });

  it('should handle empty strings', () => {
    const result = parseDomain('');
    expect(result).toEqual({ hostname: '', port: 443 });
  });

  it('should handle null values', () => {
    const result = parseDomain(null);
    expect(result).toEqual({ hostname: '', port: 443 });
  });

  it('should handle undefined values', () => {
    const result = parseDomain(undefined);
    expect(result).toEqual({ hostname: '', port: 443 });
  });

  it('should handle domain strings with no hostname', () => {
    const result = parseDomain(':8080');
    expect(result).toEqual({ hostname: '', port: '8080' });
  });

  it('should handle domain strings with no port', () => {
    const result = parseDomain('example.com:');
    expect(result).toEqual({ hostname: 'example.com', port: 443 });
  });

  it('should handle domain strings with invalid port', () => {
    const result = parseDomain('example.com:abc');
    expect(result).toEqual({ hostname: 'example.com', port: 443 });
  });

  it('should handle domain strings with special characters', () => {
    const result = parseDomain('example-123.com:8080');
    expect(result).toEqual({ hostname: 'example-123.com', port: '8080' });
  });
});