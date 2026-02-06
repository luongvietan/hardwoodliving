/**
 * Custom Sanity image type with properly typed fields.
 * The default `Image` type from 'sanity' defines _key and asset._ref as `{}`,
 * which is incompatible with React's Key type and TypeScript property access.
 */
export interface SanityImageValue {
  _type?: "image";
  _key?: string;
  asset?: {
    _ref: string;
    _type: "reference";
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}
