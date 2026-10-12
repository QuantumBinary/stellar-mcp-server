import { validateStellarServerUrl } from '../environment.config.js';

describe('validateStellarServerUrl', () => {
  const originalEnv = process.env.STELLAR_SERVER_URL;

  afterEach(() => {
    process.env.STELLAR_SERVER_URL = originalEnv;
  });

  describe('valid URLs', () => {
    it('should validate and return a valid https URL passed directly', () => {
      const url = 'https://horizon-testnet.stellar.org';
      expect(validateStellarServerUrl(url)).toBe(url);
    });

    it('should validate and return a valid http localhost URL', () => {
      const url = 'http://localhost:8000';
      expect(validateStellarServerUrl(url)).toBe(url);
    });

    it('should read and validate from process.env.STELLAR_SERVER_URL when no argument passed', () => {
      const url = 'https://horizon.stellar.org';
      process.env.STELLAR_SERVER_URL = url;
      expect(validateStellarServerUrl()).toBe(url);
    });
  });

  describe('missing or empty values', () => {
    it('should throw actionable error when URL is undefined and env var is unset', () => {
      delete process.env.STELLAR_SERVER_URL;
      expect(() => validateStellarServerUrl()).toThrow(
        'STELLAR_SERVER_URL environment variable is not set. Please set it to your Stellar Horizon server URL (e.g., https://horizon-testnet.stellar.org)',
      );
    });

    it('should throw actionable error when URL is empty string', () => {
      expect(() => validateStellarServerUrl('')).toThrow(
        'STELLAR_SERVER_URL environment variable is not set',
      );
    });

    it('should throw actionable error when URL is whitespace only', () => {
      expect(() => validateStellarServerUrl('   ')).toThrow(
        'STELLAR_SERVER_URL environment variable is not set',
      );
    });
  });

  describe('invalid URL formats', () => {
    it('should throw actionable error when URL format is malformed', () => {
      expect(() => validateStellarServerUrl('not-a-valid-url')).toThrow(
        /Invalid STELLAR_SERVER_URL: 'not-a-valid-url'/,
      );
    });

    it('should throw actionable error when protocol is not http or https', () => {
      expect(() =>
        validateStellarServerUrl('ftp://horizon.stellar.org'),
      ).toThrow(
        "Invalid STELLAR_SERVER_URL: 'ftp://horizon.stellar.org'. Protocol must be http: or https:",
      );
    });

    it('should throw actionable error for ws:// protocol', () => {
      expect(() => validateStellarServerUrl('ws://localhost:8000')).toThrow(
        /Protocol must be http: or https:/,
      );
    });
  });
});
