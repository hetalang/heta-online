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
  
    this.drop = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  
      //el_.classList.remove('dropping');
      m.style.display = 'none';
  
      onDropCallback(evt.dataTransfer.files[0]);
    };
  
    el_.addEventListener('dragenter', this.dragenter, false);
    el_.addEventListener('dragover', this.dragover, false);
    m.addEventListener('dragleave', this.dragleave, false);
    el_.addEventListener('drop', this.drop, false);
  };