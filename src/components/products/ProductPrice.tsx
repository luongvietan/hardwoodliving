interface ProductPriceProps {
  price: number;
  priceUnit?: string;
}

/**
 * Displays the product sale price prominently.
 * Renders nothing if price is 0 or negative.
 */
export default function ProductPrice({
  price,
  priceUnit = "/ sq ft",
}: ProductPriceProps) {
  if (price <= 0) return null;

  return (
    <p className="mt-3 text-2xl font-semibold text-amber-900">
      ${price.toFixed(2)}{" "}
      <span className="text-base font-normal text-gray-500">{priceUnit}</span>
    </p>
  );
}
