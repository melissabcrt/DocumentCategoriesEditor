import { DocumentCategory } from "./types";

type RawCategory = Partial<Record<keyof DocumentCategory, unknown>>;

function toString(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function toBool(v: unknown): boolean {
  return typeof v === "boolean" ? v : Boolean(v);
}

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function parseCategories(raw: string | null | undefined): DocumentCategory[] {
  if (!raw || !raw.trim()) return [];

  try {
    let data: unknown = JSON.parse(raw);

    // Case 1: Whole payload was stringified twice
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { /* ignore */ }
    }

    // Case 2: data is an array with 1 object and that object's "name" contains the JSON array as a string
    if (Array.isArray(data) && data.length === 1 && data[0] && typeof data[0] === "object") {
      const maybeName = (data[0] as Record<string, unknown>)["name"];
      if (typeof maybeName === "string") {
        const s = maybeName.trim();
        if (s.startsWith("[") || s.startsWith("{")) {
          try { data = JSON.parse(s); } catch { /* ignore */ }
        }
      }
    }

    const arr: unknown =
      Array.isArray(data)
        ? data
        : (data as Record<string, unknown>)["documentCategories"];

    if (!Array.isArray(arr)) return [];

    return arr.map((x: unknown) => {
      const o = (x ?? {}) as RawCategory;

      return {
        name: toString(o.name),
        subtext: toString(o.subtext),
        namingConvention: toString(o.namingConvention),
        templateUrl: toString(o.templateUrl),
        searchString: toString(o.searchString),
        required: toBool(o.required),
        requiredCount: toNumber(o.requiredCount),
        requiredInfo: toString(o.requiredInfo),
      };
    });
  } catch {
    return [];
  }
}

export function stringifyCategories(items: DocumentCategory[]): string {
  return JSON.stringify(items, null, 2);
}