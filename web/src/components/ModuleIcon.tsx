import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AppWindow,
  Bot,
  Boxes,
  Braces,
  Bug,
  Building2,
  ClipboardCheck,
  Cpu,
  Database,
  Droplets,
  FileText,
  FlaskConical,
  Folder,
  Gauge,
  Globe,
  HardDrive,
  KeyRound,
  Layers,
  Link2,
  Lock,
  MessageSquare,
  Network,
  Quote,
  RefreshCw,
  Rocket,
  Route,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Split,
  Users,
  Wand2,
  Workflow,
  Wrench
} from 'lucide-react';
import { getLogoUrl } from '../data/assets';

/**
 * Generic architecture glyphs. These are neutral technical symbols, never
 * substitutes for Microsoft product logos — when an official asset is present
 * it replaces the glyph automatically.
 */
const glyphs: Record<string, LucideIcon> = {
  compute: Cpu,
  storage: HardDrive,
  network: Network,
  link: Link2,
  key: KeyRound,
  monitor: Activity,
  identity: Users,
  lock: Lock,
  policy: ClipboardCheck,
  catalogue: Layers,
  shield: Shield,
  shieldCheck: ShieldCheck,
  audit: ClipboardCheck,
  gauge: Gauge,
  redteam: Bug,
  trace: Route,
  experiment: FlaskConical,
  tune: SlidersHorizontal,
  cicd: RefreshCw,
  models: Boxes,
  router: Split,
  deploy: Rocket,
  knowledge: Search,
  book: FileText,
  citation: Quote,
  sharepoint: Folder,
  onelake: Droplets,
  database: Database,
  files: FileText,
  web: Globe,
  api: Braces,
  orchestrate: Share2,
  agent: Bot,
  workflow: Workflow,
  memory: Database,
  tools: Wrench,
  endpoint: Link2,
  copilot: Sparkles,
  teams: MessageSquare,
  studio: Wand2,
  browser: AppWindow,
  mobile: Smartphone,
  enterprise: Building2
};

type Props = {
  icon: string;
  moduleId: string;
  productName: string;
};

export function ModuleIcon({ icon, moduleId, productName }: Props) {
  const logo = getLogoUrl(moduleId);
  if (logo) {
    // Official assets keep their own proportions and are never recoloured.
    return <img className="pin__logo" src={logo} alt="" aria-hidden="true" title={productName} />;
  }

  const Glyph = glyphs[icon] ?? Boxes;
  return <Glyph className="pin__glyph" strokeWidth={1.6} aria-hidden="true" />;
}
