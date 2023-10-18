export default function DnDFileController(selector, onDropCallback) {
    var el_ = document.querySelector(selector);
  
    this.dragenter = function(e) {
      e.stopPropagation();
      e.preventDefault();
  
      // Give a visual indication this element is a drop target.
      el_.classList.add('dropping');
    };
  
    this.dragover = function(e) {
      e.stopPropagation();
      e.preventDefault();
    };
  
    this.dragleave = function(e) {
      e.stopPropagation();
      e.preventDefault();
      el_.classList.remove('dropping');
    };
  
    this.drop = function(e) {
      e.stopPropagation();
      e.preventDefault();
  
      el_.classList.remove('dropping');
  
      onDropCallback(e.dataTransfer.files[0]);
    };
  
    el_.addEventListener('dragenter', this.dragenter, false);
    el_.addEventListener('dragover', this.dragover, false);
    el_.addEventListener('dragleave', this.dragleave, false);
    el_.addEventListener('drop', this.drop, false);
  };