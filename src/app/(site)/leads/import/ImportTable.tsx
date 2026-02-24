"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  SPEC_FIELDS,
  SPEC_FIELD_LABELS,
  emptyRow,
  parseCsvText,
  csvRowToImportRow,
  validateRow,
  type ImportRow,
  type SpecField,
} from "@/lib/sanity/import";
import type { ImportResult } from "@/app/api/admin/import-products/route";

interface Category {
  _id: string;
  title: string;
}

interface Props {
  categories: Category[];
}

const PRICE_UNITS = ["/ sq ft", "/ box", "/ piece", "/ linear ft"];
const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "wholesale", label: "Wholesale" },
  { value: "hidden", label: "Hidden" },
] as const;

// ─── Field components ─────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  hasError,
  type = "text",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasError?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-orange/30 ${
        hasError
          ? "border-red-300 bg-red-50 focus:border-red-400"
          : "border-gray-200 bg-white focus:border-accent-orange"
      } ${className}`}
    />
  );
}

function Select<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly { value: T; label: string }[] | readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/30"
    >
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

// ─── Specs accordion ──────────────────────────────────────────────────────────

function SpecsAccordion({
  specs,
  onChange,
}: {
  specs: Partial<Record<SpecField, string>>;
  onChange: (specs: Partial<Record<SpecField, string>>) => void;
}) {
  const [open, setOpen] = useState(false);
  const filledCount = Object.values(specs).filter((v) => v?.trim()).length;

  return (
    <div className="rounded-md border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Product Specifications
          {filledCount > 0 ? (
            <span className="rounded-full bg-accent-orange px-2 py-0.5 text-[11px] font-semibold text-white">
              {filledCount} filled
            </span>
          ) : (
            <span className="text-xs font-normal text-gray-400">optional — 25 fields</span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {SPEC_FIELDS.map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  {SPEC_FIELD_LABELS[field]}
                </label>
                <input
                  type="text"
                  value={specs[field] ?? ""}
                  onChange={(e) => onChange({ ...specs, [field]: e.target.value })}
                  placeholder="—"
                  className="rounded border border-gray-200 px-2.5 py-1.5 text-sm focus:border-accent-orange focus:outline-none focus:ring-1 focus:ring-accent-orange/30"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Image input ──────────────────────────────────────────────────────────────

function ImageInput({
  imageUrls,
  imageFiles,
  onUrlChange,
  onFilesChange,
}: {
  imageUrls: string;
  imageFiles: File[];
  onUrlChange: (v: string) => void;
  onFilesChange: (files: File[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const urlCount = imageUrls.split("|").filter((u) => u.trim().startsWith("http")).length;
  const totalCount = urlCount + imageFiles.length;

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={imageUrls}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://example.com/img1.jpg | https://example.com/img2.jpg"
        title="Paste image URLs separated by |"
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/30"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:border-accent-orange hover:text-accent-orange"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upload files
        </button>
        {totalCount > 0 && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {totalCount} image{totalCount !== 1 ? "s" : ""}
          </span>
        )}
        {imageFiles.length > 0 && (
          <button
            type="button"
            onClick={() => onFilesChange([])}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Remove files
          </button>
        )}
        {imageFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {imageFiles.map((f, i) => (
              <span key={i} className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
                {f.name.length > 20 ? f.name.slice(0, 18) + "…" : f.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          onFilesChange([...imageFiles, ...files]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Product card (one per row) ───────────────────────────────────────────────

function ProductCard({
  row,
  index,
  categories,
  onUpdate,
  onRemove,
}: {
  row: ImportRow;
  index: number;
  categories: Category[];
  onUpdate: (patch: Partial<ImportRow>) => void;
  onRemove: () => void;
}) {
  const errors = validateRow(row);
  const hasError = (field: "title" | "price") => errors.some((e) => e.field === field);
  const isValid = errors.length === 0 && row.title.trim();

  return (
    <div className={`rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
      errors.length > 0 ? "border-red-200" : "border-gray-200"
    }`}>
      {/* Card header */}
      <div className={`flex items-center justify-between rounded-t-xl px-5 py-3 ${
        errors.length > 0 ? "bg-red-50" : "bg-gray-50"
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-gray-700">
            {row.title.trim() || <span className="font-normal italic text-gray-400">Untitled product</span>}
          </span>
          {isValid && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Ready
            </span>
          )}
          {errors.length > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-600">
              {errors.map((e) => e.message).join(" · ")}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          title="Remove product"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Card body */}
      <div className="p-5 space-y-5">
        {/* Row 1: Core fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Field label="Product Title" required error={hasError("title") ? "Required" : undefined}>
              <Input
                value={row.title}
                onChange={(v) => onUpdate({ title: v })}
                placeholder="e.g. White Alaska"
                hasError={hasError("title")}
              />
            </Field>
          </div>

          <Field label="Price" required error={hasError("price") ? "Required" : undefined}>
            <div className="flex gap-2">
              <Input
                value={row.price}
                onChange={(v) => onUpdate({ price: v })}
                placeholder="8.50"
                hasError={hasError("price")}
                className="text-right"
              />
              <select
                value={row.priceUnit}
                onChange={(e) => onUpdate({ priceUnit: e.target.value })}
                className="w-32 shrink-0 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm focus:border-accent-orange focus:outline-none"
              >
                {PRICE_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Category">
            <select
              value={row.categoryId}
              onChange={(e) => onUpdate({ categoryId: e.target.value })}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/30"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Row 2: Description */}
        <Field label="Description">
          <textarea
            value={row.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Short product description (optional, max 500 chars)"
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/30"
          />
        </Field>

        {/* Row 3: Images */}
        <Field label="Images" >
          <ImageInput
            imageUrls={row.imageUrls}
            imageFiles={row.imageFiles ?? []}
            onUrlChange={(v) => onUpdate({ imageUrls: v })}
            onFilesChange={(files) => onUpdate({ imageFiles: files })}
          />
        </Field>

        {/* Row 4: Visibility + Featured + Slug */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Visibility">
            <Select
              value={row.visibility}
              options={VISIBILITY_OPTIONS}
              onChange={(v) => onUpdate({ visibility: v })}
            />
          </Field>

          <Field label="Slug (auto-generated if blank)">
            <Input
              value={row.slug}
              onChange={(v) => onUpdate({ slug: v })}
              placeholder="e.g. white-alaska"
            />
          </Field>

          <Field label="Featured">
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={row.isFeatured}
                onChange={(e) => onUpdate({ isFeatured: e.target.checked })}
                className="h-4 w-4 cursor-pointer rounded accent-accent-orange"
              />
              <span className="text-sm text-gray-700">Show as featured product</span>
            </label>
          </Field>
        </div>

        {/* Row 5: Specs accordion */}
        <SpecsAccordion
          specs={row.specs}
          onChange={(specs) => onUpdate({ specs })}
        />
      </div>
    </div>
  );
}

// ─── Results modal ────────────────────────────────────────────────────────────

function ResultsModal({
  results,
  total,
  onClose,
}: {
  results: ImportResult[];
  total: number;
  onClose: () => void;
}) {
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Import Results</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-green-50 p-4 text-center">
              <p className="text-3xl font-bold text-green-700">{successCount}</p>
              <p className="mt-0.5 text-xs font-medium text-green-600">Imported</p>
            </div>
            <div className="rounded-xl bg-red-50 p-4 text-center">
              <p className="text-3xl font-bold text-red-700">{failCount}</p>
              <p className="mt-0.5 text-xs font-medium text-red-600">Failed</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-3xl font-bold text-gray-700">{total}</p>
              <p className="mt-0.5 text-xs font-medium text-gray-500">Total</p>
            </div>
          </div>

          <div className="max-h-64 space-y-1.5 overflow-y-auto">
            {results.map((r) => (
              <div
                key={r.index}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  r.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {r.success ? (
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0">
                  <span className="font-semibold">{r.title}</span>
                  {r.success && r.imageCount ? (
                    <span className="ml-1.5 text-xs text-green-600">
                      · {r.imageCount} image{r.imageCount !== 1 ? "s" : ""}
                    </span>
                  ) : null}
                  {r.error && <p className="mt-0.5 text-xs opacity-80">{r.error}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-charcoal py-2.5 text-sm font-semibold text-white hover:bg-charcoal-dark"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImportTable({ categories }: Props) {
  const [rows, setRows] = useState<ImportRow[]>([emptyRow("row-0")]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const rowCounter = useRef(1);

  function addRow() {
    const id = `row-${rowCounter.current++}`;
    setRows((prev) => [...prev, emptyRow(id)]);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  function updateRow(id: string, patch: Partial<ImportRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function loadCsv(text: string) {
    const csvRows = parseCsvText(text);
    if (csvRows.length === 0) return;
    const importRows = csvRows.map((r, i) => csvRowToImportRow(r, i));
    setRows(importRows);
    rowCounter.current = importRows.length;
  }

  function handleCsvFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") loadCsv(text);
    };
    reader.readAsText(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) handleCsvFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function downloadTemplate() {
    const header =
      "title,slug,description,price,priceUnit,categoryId,species,width,thickness,length,prefinished,surface,stain,color,cut,grade,edge,traffic,application,installation,pattern,source,eco,jankaRate,radiantHeatRated,airMoisture,trimMoulding,stock,deliveryTime,sftPerBox,weightPerBox,boxDimensions,visibility,isFeatured,image_urls";
    const blob = new Blob([header + "\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit() {
    const invalidRows = rows.filter((r) => validateRow(r).length > 0);
    if (invalidRows.length > 0) {
      alert(`${invalidRows.length} row(s) have errors. Please fix them before importing.`);
      return;
    }

    setSubmitting(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append(
        "rows",
        JSON.stringify(rows.map((r) => ({ ...r, imageFiles: undefined })))
      );
      rows.forEach((row, rowIdx) => {
        (row.imageFiles ?? []).forEach((file, fileIdx) => {
          formData.append(`images[${rowIdx}][${fileIdx}]`, file);
        });
      });

      const res = await fetch("/api/admin/import-products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Import failed.");
        return;
      }
      setResults(data.results);
    } catch (err) {
      console.error("Import error:", err);
      alert("Unexpected error. Check the browser console.");
    } finally {
      setSubmitting(false);
    }
  }

  const validCount = rows.filter((r) => validateRow(r).length === 0 && r.title.trim()).length;
  const invalidCount = rows.length - validCount;

  return (
    <div className="space-y-6">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* CSV drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => csvInputRef.current?.click()}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-4 py-2.5 text-sm font-medium transition-colors ${
            dragOver
              ? "border-accent-orange bg-orange-50 text-accent-orange"
              : "border-gray-300 text-gray-500 hover:border-accent-orange hover:text-accent-orange"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import CSV
        </div>
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCsvFile(file);
            e.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={downloadTemplate}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Template
        </button>

        {/* Stats */}
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
            {rows.length} product{rows.length !== 1 ? "s" : ""}
          </span>
          {invalidCount > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-600">
              {invalidCount} invalid
            </span>
          )}
          {validCount > 0 && invalidCount === 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
              All ready
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
          <button
            type="button"
            disabled={submitting || validCount === 0}
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-accent-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Importing…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import {validCount > 0 ? validCount : ""} Product{validCount !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      {submitting && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-accent-orange" />
        </div>
      )}

      {/* ── Product cards ── */}
      <div className="space-y-4">
        {rows.map((row, idx) => (
          <ProductCard
            key={row.id}
            row={row}
            index={idx}
            categories={categories}
            onUpdate={(patch) => updateRow(row.id, patch)}
            onRemove={() => removeRow(row.id)}
          />
        ))}
      </div>

      {/* ── Add product footer ── */}
      <button
        type="button"
        onClick={addRow}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 transition-colors hover:border-accent-orange hover:text-accent-orange"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add another product
      </button>

      {/* ── Results modal ── */}
      {results && (
        <ResultsModal
          results={results}
          total={rows.length}
          onClose={() => setResults(null)}
        />
      )}
    </div>
  );
}
