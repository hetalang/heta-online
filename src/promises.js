const requestFileSystem = window.webkitRequestFileSystem || window.requestFileSystem

// promisify
export function requestFileSystemPromise(type, size) {
    return new Promise((resolve, reject) => {
      requestFileSystem(type, size, resolve, reject);
    });
}

export function getFilePromise(name, options) {
    return new Promise((resolve, reject) => {
        this.getFile(name, options, resolve, reject)
    })
}

export function createWriterPromise() {
    this.createWriter((writer) => writer.truncate(0)); // clear the old file

    return new Promise((resolve, reject) => {
        this.createWriter(resolve, reject);
    });
}

export function cleanDirectoryPromise() {
    return new Promise((resolve, reject) => {
        this.createReader().readEntries((entriesArray) => {
            let promises = entriesArray.map(removeEntryPromise);
            Promise.all(promises).then(resolve, reject);
        }, reject);
    });
}

function removeEntryPromise(entry) {
    return new Promise((resolve, reject) => {
        if (entry.isFile) {
            entry.remove(resolve, reject);
        } else {
            entry.removeRecursively(resolve, reject);
        }
    });
}

export function getDirectoryPromise(path, options) {
    return new Promise((resolve, reject) => {
        this.getDirectory(path, options, resolve, reject);
    });
}

export function readEntriesPromise(reader) {
    return new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
    });
}

export function filePromise() {
    return new Promise((resolve, reject) => {
        this.file(resolve, reject);
    });
}
