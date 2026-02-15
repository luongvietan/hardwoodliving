/** Display labels for structured product specifications (matches product detail card). */
const SPEC_LABELS: Record<string, string> = {
  species: 'Species',
  width: 'W',
  thickness: 'T',
  length: 'L',
  prefinished: 'Prefinished',
  surface: 'Surface',
  stain: 'Stain',
  color: 'Color',
  cut: 'Cut',
  grade: 'Grade',
  edge: 'Edge',
  traffic: 'Traffic',
  application: 'Application',
  installation: 'Installation',
  pattern: 'Pattern',
  source: 'Source',
  eco: 'Eco',
  jankaRate: 'Janka Rate',
  radiantHeatRated: 'Radiant heat rated',
  airMoisture: 'Air moisture',
  trimMoulding: 'Trim & moulding',
  stock: 'Stock',
  deliveryTime: 'Delivery time',
  sftPerBox: 'Sft / box',
  weightPerBox: 'Weight / box',
  boxDimensions: 'Box dimensions',
};

export interface ProductSpecifications {
  species?: string;
  width?: string;
  thickness?: string;
  length?: string;
  prefinished?: string;
  surface?: string;
  stain?: string;
  color?: string;
  cut?: string;
  grade?: string;
  edge?: string;
  traffic?: string;
  application?: string;
  installation?: string;
  pattern?: string;
  source?: string;
  eco?: string;
  jankaRate?: string;
  radiantHeatRated?: string;
  airMoisture?: string;
  trimMoulding?: string;
  stock?: string;
  deliveryTime?: string;
  sftPerBox?: string;
  weightPerBox?: string;
  boxDimensions?: string;
}

interface Spec {
  _key: string;
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specifications?: ProductSpecifications | null;
  specs?: Spec[];
  /** Section heading (e.g. "Product Specifications"). Default: "Specifications" */
  title?: string;
}

/**
 * Displays product technical specifications: structured (specifications) first, then additional key-value specs.
 * Renders nothing if neither is provided.
 */
export default function ProductSpecs({ specifications, specs, title = "Specifications" }: ProductSpecsProps) {
  const structuredEntries =
    specifications &&
    (Object.entries(specifications).filter(
      ([, value]) => value != null && String(value).trim() !== ''
    ) as [keyof ProductSpecifications, string][]);

  const hasStructured = structuredEntries && structuredEntries.length > 0;
  const hasLegacy = specs && specs.length > 0;

  if (!hasStructured && !hasLegacy) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <dl className="mt-4 divide-y divide-gray-200 border-t border-gray-200 pt-1">
        {hasStructured &&
          structuredEntries!.map(([key, value]) => (
            <div key={key} className="flex justify-between py-3 text-sm">
              <dt className="font-medium text-gray-500">{SPEC_LABELS[key] ?? key}</dt>
              <dd className="text-gray-900">{value}</dd>
            </div>
          ))}
        {hasLegacy &&
          specs!.map((spec) => (
            <div key={spec._key || spec.label} className="flex justify-between py-3 text-sm">
              <dt className="font-medium text-gray-500">{spec.label}</dt>
              <dd className="text-gray-900">{spec.value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
