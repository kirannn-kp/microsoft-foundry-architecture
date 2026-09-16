/**
 * Product asset map.
 *
 * Policy: Microsoft product logos are never fabricated, approximated or
 * redrawn. Drop official SVGs into `src/assets/logos/` using the file names
 * below and they are detected at build time — no configuration, no 404s. Until
 * an asset is present the module renders a neutral technical glyph instead.
 *
 * Official sets (Microsoft permits use in architecture diagrams):
 *   https://learn.microsoft.com/azure/architecture/icons/
 *   https://learn.microsoft.com/microsoft-365/solutions/architecture-icons-templates
 *   https://learn.microsoft.com/entra/architecture/architecture-icons
 */

const discovered = import.meta.glob('../assets/logos/*.{svg,png}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const byFileName = new Map<string, string>(
  Object.entries(discovered).map(([path, url]) => [path.split('/').pop() as string, url])
);

export type ProductAsset = {
  /** Matches an ArchitectureModule id. */
  moduleId: string;
  productName: string;
  /** Expected file name inside `src/assets/logos/`. */
  file: string;
};

export const productAssets: ProductAsset[] = [
  { moduleId: 'm365', productName: 'Microsoft 365 Copilot', file: 'microsoft-365-copilot.svg' },
  { moduleId: 'teams', productName: 'Microsoft Teams', file: 'microsoft-teams.svg' },
  { moduleId: 'copilot-studio', productName: 'Microsoft Copilot Studio', file: 'copilot-studio.svg' },
  { moduleId: 'orchestrator', productName: 'Microsoft Foundry Agent Service', file: 'foundry-agent-service.svg' },
  { moduleId: 'catalog-0', productName: 'Microsoft Foundry Models', file: 'foundry-models.svg' },
  { moduleId: 'iq-hub', productName: 'Foundry IQ', file: 'foundry-iq.svg' },
  { moduleId: 'entra', productName: 'Microsoft Entra ID', file: 'microsoft-entra-id.svg' },
  { moduleId: 'purview', productName: 'Microsoft Purview', file: 'microsoft-purview.svg' },
  { moduleId: 'defender', productName: 'Microsoft Defender', file: 'microsoft-defender.svg' },
  { moduleId: 'policy', productName: 'Azure Policy', file: 'azure-policy.svg' },
  { moduleId: 'key-vault', productName: 'Azure Key Vault', file: 'azure-key-vault.svg' },
  { moduleId: 'monitor', productName: 'Azure Monitor', file: 'azure-monitor.svg' },
  { moduleId: 'private-link', productName: 'Azure Private Link', file: 'azure-private-link.svg' },
  { moduleId: 'net-core', productName: 'Azure Virtual Network', file: 'azure-virtual-network.svg' },
  { moduleId: 'storage-1', productName: 'Azure Storage', file: 'azure-storage.svg' },
  { moduleId: 'compute-0', productName: 'Azure Compute', file: 'azure-compute.svg' },
  { moduleId: 'src-sharepoint', productName: 'Microsoft SharePoint', file: 'sharepoint.svg' },
  { moduleId: 'src-onelake', productName: 'Microsoft OneLake', file: 'onelake.svg' }
];

const assetsByModule = new Map(productAssets.map((asset) => [asset.moduleId, asset]));

export function getProductAsset(moduleId: string): ProductAsset | undefined {
  return assetsByModule.get(moduleId);
}

/** Resolved URL of an official logo, or undefined when none has been supplied. */
export function getLogoUrl(moduleId: string): string | undefined {
  const asset = assetsByModule.get(moduleId);
  return asset ? byFileName.get(asset.file) : undefined;
}

/**
 * Header brand marks. Same drop-in mechanism as product icons: place the
 * official files below in `src/assets/logos/` and the header picks them up
 * automatically, replacing the neutral placeholder mark.
 */
export const brandAssets = {
  microsoft: 'microsoft-logo.svg',
  foundry: 'microsoft-foundry-logo.svg'
} as const;

export function getBrandLogoUrl(brand: keyof typeof brandAssets): string | undefined {
  return byFileName.get(brandAssets[brand]);
}

/** Assets referenced by the architecture but not yet supplied locally. */
export const missingAssets = productAssets.filter((asset) => !byFileName.has(asset.file));
