export default function DnDFileController(selector, onDropCallback) {
    var el_ = document.querySelector(selector);
  
    this.dragenter = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  
      // Give a visual indication this element is a drop target.
      el_.classList.add('dropping');
    };
  
    this.dragover = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    };
  
    this.dragleave = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      el_.classList.remove('dropping');
    };
  
    this.drop = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
  
      el_.classList.remove('dropping');
  
      onDropCallback(evt.dataTransfer.files[0]);
    };
  
    el_.addEventListener('dragenter', this.dragenter, false);
    el_.addEventListener('dragover', this.dragover, false);
    el_.addEventListener('dragleave', this.dragleave, false);
    el_.addEventListener('drop', this.drop, false);
  };