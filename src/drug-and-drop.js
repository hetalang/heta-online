
export default function DnDFileController(onDropCallback) {
    let el_ = document.querySelector('body');
    let m = document.querySelector('#modalDnD');
  
    this.dragenter = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  
      // Give a visual indication this element is a drop target.
      //el_.classList.add('dropping');
      m.style.display = 'block';
    };
  
    this.dragover = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      //m.style.display = 'none';
    };
  
    this.dragleave = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      //el_.classList.remove('dropping');
      m.style.display = 'none';
    };
  
    this.drop = async function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  
      //el_.classList.remove('dropping');
      m.style.display = 'none';
      let files = [];
      
      let items = evt.dataTransfer.items;
      let prom = [...evt.dataTransfer.items].map((item) => {
        let entry = item.webkitGetAsEntry();
        return _getFilesFromEntry(entry, files);
      });
      await Promise.all(prom);

      onDropCallback(files);
    };
  
    el_.addEventListener('dragenter', this.dragenter, false);
    el_.addEventListener('dragover', this.dragover, false);
    m.addEventListener('dragleave', this.dragleave, false);
    el_.addEventListener('drop', this.drop, false);
  };

async function _getFilesFromEntry(entry, files=[]) {  
  if (entry.isFile) {
    let file = await new Promise((resolve, reject) => entry.file(resolve, reject));
    files.push(file);
  } else if (entry.isDirectory) {
    let reader = entry.createReader();
    let promise = new Promise((resolve, reject) => reader.readEntries(resolve, reject));
    for (let entry of await promise) {
      await _getFilesFromEntry(entry, files)
    }
  }
}
