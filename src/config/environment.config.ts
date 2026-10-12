import { Networks, rpc } from '@stellar/stellar-sdk';

/**
 * Validates that STELLAR_SERVER_URL environment variable is set and is a valid URL.
 * Throws an actionable error if missing or invalid.
 * @param url Optional string to validate; defaults to process.env.STELLAR_SERVER_URL
 * @returns The validated URL string
 */
export function validateStellarServerUrl(url?: string): string {
  const serverUrl = url ?? process.env.STELLAR_SERVER_URL;
  if (!serverUrl || serverUrl.trim() === '') {
    throw new Error(
      'STELLAR_SERVER_URL environment variable is not set. Please set it to your Stellar Horizon server URL (e.g., https://horizon-testnet.stellar.org)',
    );
  }

  try {
    const parsed = new URL(serverUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(
        `Invalid STELLAR_SERVER_URL: '${serverUrl}'. Protocol must be http: or https:`,
      );
    }
  } catch (err: any) {
    if (err.message && err.message.startsWith('Invalid STELLAR_SERVER_URL:')) {
      throw err;
    }
    throw new Error(
      `Invalid STELLAR_SERVER_URL: '${serverUrl}'. Please provide a valid HTTP or HTTPS URL (e.g., https://horizon-testnet.stellar.org). Details: ${err.message}`,
    );
  }

  return serverUrl;
}

/**
 * Get network configuration based on server URL
 * @param serverUrl - The Stellar server URL
 * @returns Network configuration object with server and passphrase
 */
function getNetworkConfig(serverUrl: string): {
  [key: string]: {
    server: rpc.Server;
    networkPassphrase: string;
  };
} {
  return {
    testnet: {
      server: new rpc.Server(serverUrl, { allowHttp: true }),
      networkPassphrase: Networks.TESTNET,
    },
    public: {
      server: new rpc.Server(serverUrl, { allowHttp: true }),
      networkPassphrase: Networks.PUBLIC,
    },
    futurenet: {
      server: new rpc.Server(serverUrl, { allowHttp: true }),
      networkPassphrase: Networks.FUTURENET,
    },
  };
}

export default getNetworkConfig;
