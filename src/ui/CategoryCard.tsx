import * as React from "react";
import { DocumentCategory } from "../types";
import { MdDragIndicator } from "react-icons/md";import { IoDuplicateOutline } from "react-icons/io5";

interface Props {
    category: DocumentCategory;
    index: number;
    duplicate: (idx: number) => void;
    onSelect: (idx: number) => void;
    isSelected: boolean;
    onDragStart: (idx: number) => void;
    onDragOverItem: (idx: number) => void;
    isDragOver: boolean;
    onDropItem: (idx: number) => void;
    onDragEnd: () => void;
}

export function CategoryCard({ category, index, duplicate, onSelect, isSelected, onDragStart, onDragOverItem, isDragOver, onDropItem, onDragEnd }: Props) {

  return (
    <div className={`dc-listItem ${isSelected ? "selected" : ""} ${isDragOver ? "drag-over-line" : ""}`} 
        onClick={() => onSelect(index)}
        draggable
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => {
           e.preventDefault();
           onDragOverItem(index);
        }}
        onDrop={() => onDropItem(index)}
        onDragEnd={onDragEnd}>

        <div className="dc-dragHandle">
            <MdDragIndicator size={18} />
        </div>

        <div className="dc-listItemMain">
            <div className="dc-listItemTitle">{category.name || "Untitled category"}</div>
            <div className="dc-listItemSubtext">{category.subtext || "No description"}</div>

            <div className="dc-badges">
                {category.required ? (
                    <span className="badge required">Required: {category.requiredCount}</span>
                ) : (
                    <span className="badge optional">Optional</span>
                )}

                {category.templateUrl ? (
                    <span className="badge template">Template</span>
                ) : (
                    <span className="badge notemplate">No template</span>
                )}
            </div>
        </div>

        <div className="dc-listItemActions" onClick={(e) => e.stopPropagation()}>
            <button className="dc-iconBtn" onClick={() => duplicate(index)} title="Duplicate Category"><IoDuplicateOutline size={15} /></button>
        </div>

    </div>
  );
}