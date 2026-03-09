import * as React from "react";
import { DocumentCategory } from "../types";

interface Props {
  category: DocumentCategory;
  index: number;
  update: (idx: number, patch: Partial<DocumentCategory>) => void;
  remove: (idx: number) => void;
  duplicate: (idx: number) => void;
  setRequired: (idx: number, required: boolean) => void;
  setRequiredCount: (idx: number, value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function CategoryCard({ category, index, update, remove, duplicate, setRequired, setRequiredCount, isOpen, onToggle }: Props) {

  return (
    <div className="dc-card">

        <div className="dc-cardHeader">

            <input
            className="dc-inputName"
            value={category.name}
            placeholder="Name"
            onChange={(e)=>update(index,{name:e.target.value})}
            />

            <div style={{display: "flex", gap: 6}}>
                <button className="dc-expandBtn" onClick={onToggle}>
                    {isOpen ? <i className="bi bi-arrows-collapse"></i> : <i className="bi bi-arrows-expand"></i>}
                </button>
                <button className="dc-duplicateBtn" onClick={()=>duplicate(index)}>
                    <i className="bi bi-copy"></i>
                </button>
                <button className="dc-deleteBtn" onClick={()=>remove(index)}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>

        </div>

        <div className="dc-badges">

            {category.required ? (
                <span className="badge required">
                    Required: {category.requiredCount}
                </span>
            ) : (
                <span className="badge optional">
                    Optional
                </span>
            )}

            {category.templateUrl ? (
                <span className="badge template">
                    Template
                </span>
            ) : (
                <span className="badge notemplate">
                    No template
                </span>
            )}

        </div>

        {isOpen && (
            <>
                <div className="dc-cardGrid">

                    <input
                        placeholder="Subtext"
                        value={category.subtext}
                        onChange={(e)=>update(index,{subtext:e.target.value})}
                    />

                    <input
                        placeholder="Naming Convention"
                        value={category.namingConvention}
                        onChange={(e)=>update(index,{namingConvention:e.target.value})}
                    />

                    <input
                        placeholder="Search String"
                        value={category.searchString}
                        onChange={(e)=>update(index,{searchString:e.target.value})}
                    />

                    <input
                        placeholder="Template URL"
                        value={category.templateUrl}
                        onChange={(e)=>update(index,{templateUrl:e.target.value})}
                    />

                </div>

                <div className="dc-requiredRow">

                    <label>
                        <input
                            type="checkbox"
                            checked={category.required}
                            onChange={(e)=>setRequired(index, e.target.checked)}
                        />
                        Required
                    </label>

                    <input
                        type="number"
                        min={0}
                        value={category.required ? category.requiredCount : 0}
                        disabled={!category.required}
                        onChange={(e)=>setRequiredCount(index, e.target.value)}
                    />

                </div>

                <input
                    className="dc-requiredInfo"
                    placeholder="Required Info"
                    value={category.requiredInfo}
                    onChange={(e)=>update(index,{requiredInfo:e.target.value})}
                />
            </>
        )}

    </div>
  );
}