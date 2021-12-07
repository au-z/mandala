import { Hybrids } from "hybrids";
export interface MandalaLayerElement extends HTMLElement {
    exportparts: string;
    height: number;
    nested: number;
    name: string;
    nodes: [number, number, number, Array<number>?][];
    tag: string;
    template: [number, number, number, Array<number>?];
}
declare const MandalaLayer: Hybrids<MandalaLayerElement>;
export default MandalaLayer;
