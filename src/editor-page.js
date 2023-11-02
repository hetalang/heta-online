import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Page from './abstract-page';

export default class EditorPage extends Page {
    constructor(id, monacoOptions={}, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
        super(id, deleteBtn, rightSide, mimeType);
        let _monacoOptions = Object.assign({}, {
          readOnly: false,
          minimap: {enabled: false},
          //automaticLayout: true
        }, monacoOptions)

        this.monacoEditor = monaco.editor.create(this.editorContainer, _monacoOptions);
        this.monacoEditor._page = this; // XXX: bad solution
    }
    delete() {
      this.monacoEditor.dispose();
      super.delete();
    }
    addTo(pageCollection, setAsDefault=false) {
      super.addTo(pageCollection, setAsDefault);
      this.monacoEditor.layout();

      return this;
    }
    fromArrayBuffer(ab) {
      let text = new TextDecoder('utf-8').decode(ab);
      this.monacoEditor.setValue(text);

      return this;
    }
    async fromFile(file) {
      let text = await file.text();
      this.type = file.type;
      this.monacoEditor.setValue(text);

      return this;
    }
    /*
    getFile() {
      let text = this.monacoEditor.getValue();
      let file = new File([text], this.id, {type: this.type});

      return file;
    }
    */
    getArrayBuffer() {
      let text = this.monacoEditor.getValue();

      return new TextEncoder().encode(text).buffer;
    }
}
