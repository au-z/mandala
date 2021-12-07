import { Hybrids } from "hybrids";
export interface MandalaLayer extends HTMLElement {
    exportparts: string;
    height: number;
    nested: number;
    name: string;
    nodes: [number, number, number, Array<number>?][];
    tag: string;
    template: [number, number, number, Array<number>?];
}
declare const MandalaLayer: Hybrids<MandalaLayer>;
export default MandalaLayer;
