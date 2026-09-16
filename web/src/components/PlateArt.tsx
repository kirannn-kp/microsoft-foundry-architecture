import { PLANE_H, PLANE_W } from '../lib/iso';

/** Percentage helpers so plate geometry matches module coordinates exactly. */
const px = (value: number) => (value / 100) * PLANE_W;
const py = (value: number) => (value / 100) * PLANE_H;

type Props = { layerId: string };

function AzurePlate() {
  const hub = { x: px(58), y: py(34) };
  const nodes = [
    { x: px(50), y: py(24) },
    { x: px(66), y: py(24) },
    { x: px(50), y: py(46) },
    { x: px(66), y: py(46) }
  ];
  return (
    <>
      <rect className="plate-zone" x={px(8)} y={py(22)} width={px(22)} height={py(38)} rx="2" />
      <rect className="plate-zone" x={px(44)} y={py(16)} width={px(32)} height={py(38)} rx="2" />
      {nodes.map((node, index) => (
        <line key={index} className="plate-line" x1={hub.x} y1={hub.y} x2={node.x} y2={node.y} />
      ))}
      <line className="plate-line" x1={px(76)} y1={py(34)} x2={px(82)} y2={py(42)} />
      <line className="plate-line plate-line--soft" x1={px(30)} y1={py(40)} x2={px(37)} y2={py(34)} />
      <line className="plate-line plate-line--soft" x1={px(48)} y1={py(64)} x2={px(66)} y2={py(66)} />
      <line className="plate-line plate-line--soft" x1={px(40)} y1={py(70)} x2={px(48)} y2={py(64)} />
    </>
  );
}

function GovernancePlate() {
  const railY = py(44);
  const checkpoints = [17, 32, 48, 62, 76, 88];
  return (
    <>
      <line className="plate-rail" x1={px(8)} y1={railY} x2={px(94)} y2={railY} />
      {checkpoints.map((x) => (
        <g key={x}>
          <line className="plate-line" x1={px(x)} y1={railY - 8} x2={px(x)} y2={railY + 8} />
          <circle className="plate-dot plate-dot--purple" cx={px(x)} cy={railY} r="3" />
        </g>
      ))}
      <rect className="plate-zone plate-zone--purple" x={px(10)} y={py(24)} width={px(84)} height={py(48)} rx="3" />
      <line className="plate-line plate-line--soft" x1={px(17)} y1={railY} x2={px(33)} y2={py(64)} />
      <line className="plate-line plate-line--soft" x1={px(62)} y1={railY} x2={px(62)} y2={py(62)} />
      <line className="plate-line plate-line--soft" x1={px(76)} y1={railY} x2={px(88)} y2={py(58)} />
      <line className="plate-line plate-line--dashed" x1={px(20)} y1={py(78)} x2={px(44)} y2={py(78)} />
    </>
  );
}

function OperationsPlate() {
  const lanes = [py(30), py(44), py(58)];
  return (
    <>
      {lanes.map((y, index) => (
        <line key={index} className="plate-line plate-line--dotted" x1={px(10)} y1={y} x2={px(92)} y2={y} />
      ))}
      <path
        className="plate-trace"
        d={`M ${px(12)} ${py(48)} L ${px(20)} ${py(48)} L ${px(23)} ${py(40)} L ${px(27)} ${py(54)} L ${px(31)} ${py(44)} L ${px(36)} ${py(48)} L ${px(44)} ${py(48)}`}
      />
      <path
        className="plate-trace"
        d={`M ${px(52)} ${py(24)} L ${px(58)} ${py(24)} L ${px(61)} ${py(18)} L ${px(65)} ${py(30)} L ${px(69)} ${py(22)} L ${px(74)} ${py(24)} L ${px(84)} ${py(24)}`}
      />
      <path className="plate-loop" d={`M ${px(76)} ${py(60)} C ${px(60)} ${py(84)}, ${px(28)} ${py(82)}, ${px(18)} ${py(46)}`} />
      <circle className="plate-dot plate-dot--cyan" cx={px(18)} cy={py(46)} r="3.5" />
      <circle className="plate-dot plate-dot--cyan" cx={px(76)} cy={py(60)} r="3.5" />
    </>
  );
}

function ModelsPlate() {
  const iq = { x: px(70), y: py(76) };
  const sources = [
    { x: px(14), y: py(58) },
    { x: px(24), y: py(58) },
    { x: px(34), y: py(58) },
    { x: px(14), y: py(76) },
    { x: px(24), y: py(76) },
    { x: px(34), y: py(76) }
  ];
  return (
    <>
      <line className="plate-line plate-line--divider" x1={px(46)} y1={py(14)} x2={px(46)} y2={py(88)} />
      <rect className="plate-zone plate-zone--blue" x={px(6)} y={py(46)} width={px(36)} height={py(40)} rx="3" />
      <rect className="plate-zone plate-zone--purple" x={px(50)} y={py(14)} width={px(44)} height={py(72)} rx="3" />
      {sources.map((source, index) => (
        <line key={index} className="plate-line plate-line--dashed" x1={source.x} y1={source.y} x2={iq.x} y2={iq.y} />
      ))}
      <line className="plate-line plate-line--soft" x1={px(58)} y1={py(58)} x2={px(70)} y2={py(58)} />
      <line className="plate-line plate-line--soft" x1={px(70)} y1={py(58)} x2={px(82)} y2={py(58)} />
      <path className="plate-bridge" d={`M ${px(70)} ${py(58)} C ${px(70)} ${py(65)}, ${px(70)} ${py(70)}, ${px(70)} ${py(76)}`} />
      <line className="plate-line plate-line--soft" x1={px(58)} y1={py(76)} x2={px(70)} y2={py(76)} />
      <line className="plate-line plate-line--soft" x1={px(70)} y1={py(76)} x2={px(82)} y2={py(76)} />
    </>
  );
}

function AgentPlate() {
  const hub = { x: px(48), y: py(44) };
  const agents = [
    { x: px(33), y: py(30) },
    { x: px(48), y: py(22) },
    { x: px(63), y: py(28) },
    { x: px(34), y: py(58) },
    { x: px(62), y: py(60) }
  ];
  const mcpPins = [34, 40.4, 46.8, 53.2, 59.6, 66];
  return (
    <>
      <rect className="plate-zone plate-zone--hero" x={px(12)} y={py(14)} width={px(80)} height={py(72)} rx="4" />
      {agents.map((agent, index) => (
        <line key={index} className="plate-link" x1={hub.x} y1={hub.y} x2={agent.x} y2={agent.y} />
      ))}
      <path className="plate-link plate-link--soft" d={`M ${px(33)} ${py(30)} C ${px(42)} ${py(20)}, ${px(56)} ${py(20)}, ${px(63)} ${py(28)}`} />
      <path className="plate-link plate-link--soft" d={`M ${px(34)} ${py(58)} C ${px(44)} ${py(70)}, ${px(56)} ${py(70)}, ${px(62)} ${py(60)}`} />
      <line className="plate-line plate-line--soft" x1={px(19)} y1={py(40)} x2={hub.x} y2={hub.y} />
      <line className="plate-line plate-line--soft" x1={px(20)} y1={py(62)} x2={px(34)} y2={py(58)} />
      <line className="plate-line plate-line--soft" x1={px(78)} y1={py(36)} x2={px(63)} y2={py(28)} />
      <line className="plate-line plate-line--soft" x1={px(82)} y1={py(62)} x2={px(62)} y2={py(60)} />
      <line className="plate-line plate-line--soft" x1={px(88)} y1={py(46)} x2={px(78)} y2={py(36)} />
      <line className="plate-rail plate-rail--mcp" x1={px(30)} y1={py(80)} x2={px(70)} y2={py(80)} />
      {mcpPins.map((x) => (
        <line key={x} className="plate-line plate-line--dashed" x1={px(x)} y1={py(80)} x2={px(x + 4)} y2={py(66)} />
      ))}
    </>
  );
}

function ExperiencePlate() {
  return (
    <>
      <line className="plate-line plate-line--dotted" x1={px(16)} y1={py(48)} x2={px(88)} y2={py(44)} />
      <line className="plate-line plate-line--soft" x1={px(24)} y1={py(36)} x2={px(41)} y2={py(26)} />
      <line className="plate-line plate-line--soft" x1={px(41)} y1={py(26)} x2={px(58)} y2={py(32)} />
      <line className="plate-line plate-line--soft" x1={px(58)} y1={py(32)} x2={px(76)} y2={py(34)} />
      <line className="plate-line plate-line--soft" x1={px(34)} y1={py(60)} x2={px(52)} y2={py(64)} />
      <line className="plate-line plate-line--soft" x1={px(52)} y1={py(64)} x2={px(74)} y2={py(58)} />
      <circle className="plate-dot" cx={px(30)} cy={py(46)} r="2.5" />
      <circle className="plate-dot" cx={px(48)} cy={py(44)} r="2.5" />
      <circle className="plate-dot" cx={px(66)} cy={py(45)} r="2.5" />
    </>
  );
}

const plates: Record<string, () => JSX.Element> = {
  'azure-foundation': AzurePlate,
  governance: GovernancePlate,
  'quality-operations': OperationsPlate,
  'models-knowledge': ModelsPlate,
  'agent-service': AgentPlate,
  experiences: ExperiencePlate
};

export function PlateArt({ layerId }: Props) {
  const Plate = plates[layerId];
  if (!Plate) return null;
  return (
    <svg className="plate-art" viewBox={`0 0 ${PLANE_W} ${PLANE_H}`} aria-hidden="true" focusable="false">
      <Plate />
    </svg>
  );
}
