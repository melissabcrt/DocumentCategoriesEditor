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
  // Add a new empty category at the top of the list
  const add = () => {
    const newCategory = emptyCategory();
    const next = [newCategory, ...items];

    onChange(next);
    setSelectedIndex(0);
    setDraftCategory({ ...newCategory });
  }

  // Remove a category from the list by index
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  // Duplicate a category and insert the copy right after the original one
  const duplicate = (idx: number) => {
    const copy = { ...items[idx], name: items[idx].name + " (copy)" };
    const next = [...items];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  }

  // Stores the index of the selected category
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Stores the index of the item being dragged
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Stores the index of the item currently being hovered during drag
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Local draft used in the editor so changes are not applied inmediately
  const [draftCategory, setDraftCategory] = useState<DocumentCategory | null>(null);

  // Select a category and create a local editable copy
  const selectCategory = (idx: number) => {
    setSelectedIndex(idx);
    setDraftCategory({ ...items[idx] });
  };

  // Update the local draft by merging the current values with a partial patch
  const updateDraft = (patch: Partial<DocumentCategory>) => {
    setDraftCategory((current) => (current ? { ...current, ...patch } : current));
  }

  // Save the draft into the main items array
  const saveDraft = () => {
    if (selectedIndex === null || !draftCategory) return;

    const next = items.map((item, idx) =>
      idx === selectedIndex ? draftCategory : item
    );

    onChange(next);
    setSelectedIndex(null);
    setDraftCategory(null);
  }

  // Close editor without saving changes
  const closeEditor = () => {
    setSelectedIndex(null);
    setDraftCategory(null);
  }

  // Delete the selected category and close the editor
  const deleteSelectedCategory = () => {
    if (selectedIndex === null) return;

    remove(selectedIndex);
    setSelectedIndex(null);
    setDraftCategory(null);
  }
 
  // Move a category from one position to another in the list
  const moveItem = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;

    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);

    onChange(next);
  }

  // Filter (search categories)
  const [search, setSearch] = useState("");
  const filteredItems = items.filter((c) => {
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
          <input className="search" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="content">
        <div className="listPanel" style={{ display: "grid", gap: 10 }}>
          {items.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No categories yet.</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No matching categories.</div>
          ) : (
            filteredItems.map((c) => {
              const idx = items.indexOf(c);

              return (
                <CategoryCard
                  key={idx}
                  category={c}
                  index={idx}
                  duplicate={duplicate}
                  onSelect={selectCategory}
                  isSelected={selectedIndex === idx}
                  onDragStart={setDragIndex}
                  onDragOverItem={setDragOverIndex}
                  isDragOver={dragOverIndex === idx}
                  onDropItem={(toIndex) => {
                    if (dragIndex === null) return;
                    moveItem(dragIndex, toIndex);
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                />
              );
            })
          )}
        </div>
      
      
        {draftCategory && selectedIndex !== null && (
          <div className="dc-editor">
            <div className="dc-editorHeader">
              <div>
                <div className="dc-editorEyebrow">Edit Category</div>
                <div className="dc-editorTitle">
                  {draftCategory.name || "Untitled category"}
                </div>
              </div>

              <div className="dc-editorActions">
                <button className="dc-iconBtn danger" onClick={deleteSelectedCategory} title="Delete Category">
                  <i className="bi bi-trash3"></i>
                </button>

                <button className="dc-iconBtn" onClick={closeEditor} title="Close Editor">
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>

            <div className="dc-editorBody">

              <div className="dc-field">
                <label className="dc-label">Name</label>
                <input 
                  className="dc-input"
                  value={draftCategory.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                  placeholder="Category name"/>
              </div>
              
              <div className="dc-field">
                <label className="dc-label">Subtext</label>
                <textarea
                  className="dc-textarea"
                  value={draftCategory.subtext}
                  onChange={(e) => updateDraft({ subtext: e.target.value })}
                  placeholder="Category subtext"/>
              </div>

              <div className="dc-twoCols">
                <div className="dc-field">
                  <label className="dc-label">Search String</label>
                  <input
                    className="dc-input"
                    value={draftCategory.searchString}
                    onChange={(e) => updateDraft({ searchString: e.target.value })}
                    placeholder="Search string"/>
                </div>

                <div className="dc-field">
                  <label className="dc-label">Template URL</label>
                  <input
                    className="dc-input"
                    value={draftCategory.templateUrl}
                    onChange={(e) => updateDraft({ templateUrl: e.target.value })}
                    placeholder="https://..."/>
                </div>
              </div>

              <div className="dc-field">
                <label className="dc-label">Naming Convention</label>
                <input
                  className="dc-input"
                  value={draftCategory.namingConvention}
                  onChange={(e) => updateDraft({ namingConvention: e.target.value })}
                  placeholder="ExhibitG1-{filename}-{date}-{timestamp}"/>
              </div>

              <div className="dc-twoCols">
                <div className="dc-field">
                  <label className="dc-label">Required</label>

                  <div className="dc-toggleRow">
                    <label className="dc-switch">
                      <input
                        type="checkbox"
                        checked={draftCategory.required}
                        onChange={(e) => updateDraft({ required: e.target.checked })}/>
                        <span className="dc-slider"></span>
                    </label>

                    <span className="dc-helper">
                      If ON, user must upload requiredCount file(s).
                    </span>
                  </div>
                </div>

                <div className="dc-field">
                  <label className="dc-label">Required Count</label>
                  <input
                    type="number"
                    className="dc-input"
                    value={draftCategory.requiredCount}
                    disabled={!draftCategory.required}
                    onChange={(e) => updateDraft({ requiredCount: Number(e.target.value)})} min={1}/>
                </div>
              </div>

            </div>

            <div className="dc-editorFooter">
              <button className="dc-btnClose" onClick={closeEditor} title="Close Editor">Cancel</button>
              <button className="dc-btnSave" onClick={saveDraft} title="Save this version">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}