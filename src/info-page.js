import Page from './abstract-page';

export default class InfoPage extends Page {
    constructor(id, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
        super(id, deleteBtn, rightSide, mimeType);
    }
    fromArrayBuffer(ab) {
      // create file
      let file = new File([ab], this.id, {type: this.type});
      this.fromFile(file);
  
      return this;
    }
    fromFile(file) {
      this._sourceFile = file;
      this.type = file.type;
  
      let url = window.URL.createObjectURL(file);
      let str = `<div class="w3-container">
        <h3>Source file info:</h3>
        <p>name: <i>${file.name}</i></p>
        <p>type: <i>${file.type}</i></p>
        <p>lastModifiedDate: <i>${file.lastModifiedDate}</i></p>
        <p>size: <i>${Math.round(file.size/1024)} Kb</i></p>
        <p><a href="${url}" download="${this.name}">DOWNLOAD</a></p>
      </div>`;
      
      $(str).appendTo(this.editorContainer);
  
      return this;
    }
    async getArrayBuffer() {
      return await this._sourceFile.arrayBuffer();
    }
    /*
    getFile() {
      return this._sourceFile;
    }
    */
}