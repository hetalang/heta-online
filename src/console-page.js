import EditorPage from "./editor-page";

export default class ConsolePage extends EditorPage {
    constructor(id) {
      super(id, {language: 'console', readOnly: true}, false, true, 'text/plain');
    }
    appendText(text) {
      let currentValue = this.monacoEditor.getValue();
      this.monacoEditor.setValue(currentValue + text);
    }
}
