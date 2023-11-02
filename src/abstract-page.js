
// class storing editor and visualization
export default class Page {
    constructor(id, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
      this.id = id;
      this.name = id.split('/').pop();
      this.rightSide = rightSide;
      this.deleteBtn = deleteBtn;
      this.type = mimeType;
      //this._parent = undefined;
  
      // create div element
      this.editorContainer = $(`<div class="hetaModuleContainer" style="height:100%;"></div>`)[0];
      this.navigationButton = $(`<a href="#" class="hetaModuleBtn w3-button w3-small"><span class="hetaModuleName">${id}</span></a>`)[0];
      if (rightSide) {
          $(this.navigationButton).addClass('w3-right');
      }
  
      // add events to module
      $(this.navigationButton).on('click', () => this.show());
      if (deleteBtn) {
          $('<span class="hetaModuleCloseBtn">&nbsp; &times;</span>')
              .appendTo(this.navigationButton)
              .on('click', () => {
                  let isOk = window.confirm(`"${this.id}" file will be deleted.\nAre you sure?`)
                  if (isOk) {                    
                      this.delete();
                  }
              });
      }
    }
    show() {
      this._parent.hideEditors();
  
      $(this.navigationButton).addClass('w3-bottombar w3-border-green');
      $(this.editorContainer).css('display', 'block');
      // resize
      this.monacoEditor?.layout()
    }
    delete() {
      window.localStorage.removeItem(this.id);
      $(this.navigationButton).remove();
      $(this.editorContainer).remove();
      this._parent.pagesStorage.delete(this.id);
      this._parent.defaultPage?.show();
    }
    addTo(pageCollection, setAsDefault=false) {
      // add to panel
      this._parent = pageCollection;
      if (setAsDefault) {
        pageCollection.defaultPageName = this.id;
      }
      $(pageCollection.panel).find('.codeContainer').append($(this.editorContainer));
      $(pageCollection.panel).find('.codeNavigation').append($(this.navigationButton));
  
      // add to storage
      pageCollection.pagesStorage.set(this.id, this);
      this.show();
  
      return this;
    }
    async toUint8String() {
      let ab = await this.getArrayBuffer();
  
      return new Uint8Array(ab).toString();
    }
}
  