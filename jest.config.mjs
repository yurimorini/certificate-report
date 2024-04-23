import { defaults } from 'jest-config';

/** @type {import('jest').Config} */
export default {
  testMatch: [...defaults.testMatch, "**/?(*.)+(spec|test).mjs"],
  roots: ['<rootDir>/src']
};