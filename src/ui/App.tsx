import * as React from "react";
import { useState } from "react";
import "./App.css";
import { CategoryCard } from "./CategoryCard";
import "bootstrap-icons/font/bootstrap-icons.css";
import { DocumentCategory, emptyCategory } from "../types";

interface Props {
  items: DocumentCategory[];
  onChange: (next: DocumentCategory[]) => void;
}

export function App({ items, onChange }: Props) {
  const add = () => onChange([emptyCategory(), ...items]);

  const update = (idx: number, patch: Partial<DocumentCategory>) => {
    const next = items.map((x, i) => (i === idx ? { ...x, ...patch } : x));
    onChange(next);
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  const duplicate = (idx: number) => {
    const copy = { ...items[idx], name: items[idx].name + " (copy)"};
    const next = [...items];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  }

  const setRequired = (idx: number, required: boolean) => {
    // If required is turned off, force requiredCount back to 0
    update(idx, { required, requiredCount: required ? items[idx].requiredCount : 0 });
  }

  const setRequiredCount = (idx: number, value: string) => {
    // Clamp to 0+ and force integer
    const n = Number(value);
    const safe = Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;

    update(idx, { requiredCount: safe });
  }

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Filter (search categories)
  const [search, setSearch] = useState("");
  const filtedItems = items.filter((c) => {
    const q = search.toLowerCase().trim();

    if (!q) return true;

    return [
      c.name,
      c.subtext,
      c.searchString,
      c.namingConvention,
      c.requiredInfo
    ].some((value) => (value || "").toLowerCase().includes(q));
  });

  return (
    <div className="wrap">
      <div className="header">
        <div>
          <div className="sectionHeader">
            <i className="bi bi-folder-fill"></i>
            <div className="title">Upload Document Categories</div>
          </div>
          <div className="subtitle">List the established categories for this payment type.</div>
        </div>
        <div className="actions">
          <button className="btn" onClick={add}>+ Add</button>
          <input className="search" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {items.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No categories yet.</div>
        ) : filtedItems.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No matching categories.</div>
        ) : (
          filtedItems.map((c) => {
            const idx = items.indexOf(c);

            return (
              <CategoryCard
                key={idx}
                category={c}
                index={idx}
                update={update}
                remove={remove}
                duplicate={duplicate}
                setRequired={setRequired}
                setRequiredCount={setRequiredCount}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}