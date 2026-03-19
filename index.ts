import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";

import { App } from "./src/ui/App";
import { DocumentCategory } from "./src/types";
import { parseCategories, stringifyCategories } from "./src/json";

export class DocumentCategoriesEditor implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container!: HTMLDivElement;
    private _notifyOutputChanged!: () => void;
    
    private _root: Root | null = null;

    private _items: DocumentCategory[] = [];
    private _valueOut = "[]";

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;

        const raw = context.parameters.jsonValue.raw ?? "[]";
        this._items = parseCategories(raw);
        this._valueOut = stringifyCategories(this._items);

        this.render();
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // If the record loads a different value (or changes externally), re-parse and re-render
        const raw = context.parameters.jsonValue.raw ?? "[]";
        const next = parseCategories(raw);
        const nextStr = stringifyCategories(next);

        if (nextStr !== this._valueOut) {
        this._items = next;
        this._valueOut = nextStr;
        this.render();
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { jsonValue: this._valueOut };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        this._root?.unmount();
        this._root = null;
    }

    private render(): void {
        const onChange = (items: DocumentCategory[]) => {
            this._items = items;
            this._valueOut = stringifyCategories(items);
            this.render();
            this._notifyOutputChanged();
        };

        if (!this._root) {
            this._root = createRoot(this._container);
        }

        this._root.render(
            React.createElement(App, { items: this._items, onChange })
        );
    }
}
