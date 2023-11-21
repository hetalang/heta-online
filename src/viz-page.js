// https://github.com/mdaines/viz-js/tree/v3/packages/viz
// https://github.com/magjac/d3-graphviz
// https://viz-js.com/api/
// https://github.com/abstratt/eclipsegraphviz
// https://codemirror.net/

import { instance } from "@viz-js/viz";
import Page from './abstract-page';
import path from 'path';

const LAYOUTS = [ // viz.engines
    'circo', 'dot', 'fdp', 'neato',
    //'nop', 'nop1', 'nop2',
    'osage', 'patchwork', 'sfdp', 'twopi'
];

export default class VizPage extends Page {
    constructor(id, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
        super(id, deleteBtn, rightSide, mimeType);
        this.layout = 'dot';
    }
    async fromArrayBuffer(ab){
        let text = new TextDecoder('utf-8').decode(ab);
        this.text = text;

        let blob = new Blob([text])
        let url = window.URL.createObjectURL(blob);
        let filename = path.parse(this.id).base;

        let rightPanel = $('<p class="w3-right"/>')
            .appendTo(this.editorContainer)
            .append(`<p><a href="${url}" download="${filename}">Download file</a></p>`)
            .append(`<p class="downloadSVG"></p>`);
        let select = $('<select class="w3-select layoutSelect" name="option"/>')
            .appendTo(rightPanel)
            .on('change', (evt) => this.setLayout(evt.target.value));
        LAYOUTS.forEach((optName) => $(`<option value="${optName}">${optName}</option>`).appendTo(select));
        select[0].value = this.layout;

        $(this.editorContainer).append('<p class="svgContainer"/>');
        await this.setLayout(this.layout);

        return this;
    }
    async setLayout(layout = 'dot') {
        this.layout = layout;
        
        let viz = await instance();
        let svg = this.svg = viz.renderSVGElement(this.text, { // https://viz-js.com/api/#viz.RenderOptions
            //format: 'dot', // ignored
            engine: layout, 
            yInvert: true,
            //reduce: false,
            //graphAttributes:
            //nodeAttributes:
            //edgeAttributes:
        });
        $(this.editorContainer)
            .find('.svgContainer')
            .html(svg);

        // set download ref
        let blob = new Blob([svg.parentElement.innerHTML]);
        let url = window.URL.createObjectURL(blob);
        let filename = path.parse(this.id).base;
        $(this.editorContainer)
            .find('.downloadSVG')
            .html(`<a href="${url}" download="${filename}.svg">Download SVG</a>`);
    }
    getArrayBuffer() {
        let text = this.text;
  
        return new TextEncoder().encode(text).buffer;
    }
}
