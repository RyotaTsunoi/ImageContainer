import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

/**
 * @class
 * @classdesc Storage identity management.
 */
export class ManageStorageIdentity {
  storageAccountName: string;
  storageAccountKey: string;

  constructor(storageAccountName: string, storageAccountKey: string) {
    this.storageAccountName = storageAccountName;
    this.storageAccountKey = storageAccountKey;
  }

  //if initialize this class, use factory method. storeage or database.
  static async manageStorageIdentityFactory(): Promise<ManageStorageIdentity> {
    const keyVaultName = process.env.KEY_VAULT_NAME;
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUri, credential);
    const storageAccountName = await client.getSecret(process.env.TARGET_STORAGE_ACCOUNT_NAME);
    const storageAccountKey = await client.getSecret(process.env.TARGET_STORAGE_ACCOUNT_KEY);
    return new ManageStorageIdentity(storageAccountName.value, storageAccountKey.value);
  }
}

/**
 * @class
 * @classdesc Database identity management.
 */
export class ManageDatabaseIdentity {
  databaseConnectionType: string;
  databaseConnectionHost: string;
  databaseConnectionPort: number;
  databaseConnectionUserName: string;
  databaseConnectionPassword: string;

  constructor(
    databaseConnectionType: string,
    databaseConnectionHost: string,
    databaseConnectionPort: number,
    databaseConnectionUserName: string,
    databaseConnectionPassword: string
  ) {
    this.databaseConnectionType = databaseConnectionType;
    this.databaseConnectionHost = databaseConnectionHost;
    this.databaseConnectionPort = databaseConnectionPort;
    this.databaseConnectionUserName = databaseConnectionUserName;
    this.databaseConnectionPassword = databaseConnectionPassword;
  }

  //if initialize this class, use factory method. storeage or database.
  static async manageDatabaseIdentityFactory(): Promise<ManageDatabaseIdentity> {
    const keyVaultName = process.env.KEY_VAULT_NAME;
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUri, credential);
    const databaseConnectionType = await client.getSecret(process.env.TARGET_DATABASE_CONNECTION_TYPE);
    const databaseConnectionHost = await client.getSecret(process.env.TARGET_DATABASE_CONNECTION_HOST);
    const databaseConnectionPort = await client.getSecret(process.env.TARGET_DATABASE_CONNECTION_PORT);
    const databaseConnectionUserName = await client.getSecret(process.env.TARGET_DATABASE_CONNECTION_USERNAME);
    const databaseConnectionPassword = await client.getSecret(process.env.TARGET_DATABASE_CONNECTION_PASSWORD);
    
    return new ManageDatabaseIdentity(
      databaseConnectionType.value,
      databaseConnectionHost.value,
      parseInt(databaseConnectionPort.value),
      databaseConnectionUserName.value,
      databaseConnectionPassword.value
    );
  }
}
