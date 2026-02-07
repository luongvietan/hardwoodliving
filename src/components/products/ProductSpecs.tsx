interface Spec {
  _key: string;
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs?: Spec[];
}

/**
 * Displays product technical specifications as a definition list.
 * Renders nothing if no specs are provided.
 */
export default function ProductSpecs({ specs }: ProductSpecsProps) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
      <dl className="mt-3 divide-y divide-gray-200 border-t border-gray-200">
        {specs.map((spec) => (
          <div key={spec._key || spec.label} className="flex justify-between py-3 text-sm">
            <dt className="font-medium text-gray-500">{spec.label}</dt>
            <dd className="text-gray-900">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
