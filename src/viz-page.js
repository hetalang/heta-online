// https://github.com/mdaines/viz-js/tree/v3/packages/viz
// https://github.com/magjac/d3-graphviz
// https://viz-js.com/api/
// https://github.com/abstratt/eclipsegraphviz
// https://codemirror.net/

import { instance } from "@viz-js/viz";
import Page from './abstract-page';

export default class VizPage extends Page {
    constructor(id, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
        super(id, deleteBtn, rightSide, mimeType);
    }
    async fromArrayBuffer(ab){
        let text = new TextDecoder('utf-8').decode(ab);
        this.text = text;

        let viz = await instance();
        console.log(viz.engines)
        let svg =  viz.renderSVGElement(text, { // https://viz-js.com/api/#viz.RenderOptions
            //format: 'dot', // ignored
            engine: 'dot', //'circo', 'dot', 'fdp', 'neato', 'nop', 'nop1', 'nop2', 'osage', 'patchwork', 'sfdp', 'twopi'
            yInvert: true,
            //reduce: false,
            //graphAttributes:
            //nodeAttributes:
            //edgeAttributes:
        });
        this.editorContainer.appendChild(svg);

        return this;
    }
    getArrayBuffer() {
        let text = this.text;
  
        return new TextEncoder().encode(text).buffer;
    }
}
