
// promisify
export function requestFileSystemPromise(type, size) {
    return new Promise((resolve, reject) => {
      window.webkitRequestFileSystem(type, size, resolve, reject);
    });
}

export function getFilePromise(directoryEntry, name, options) {
    return new Promise((resolve, reject) => {
        directoryEntry.getFile(name, options, resolve, reject)
    })
}

export function createWriterPromise(entry) {
    entry.createWriter((writer) => writer.truncate(0)); // clear the old file

    return new Promise((resolve, reject) => {
        entry.createWriter(resolve, reject);
    });
}

export function cleanDirectoryPromise(directoryEntry, path, options) {
    return new Promise((resolve, reject) => {
        directoryEntry.createReader().readEntries((entriesArray) => {
            let promises = entriesArray.map(removeEntryPromise);
            Promise.all(promises).then(resolve, reject);
        }, reject);
    });
}

export function removeEntryPromise(entry) {
    return new Promise((resolve, reject) => {
        if (entry.isFile) {
            entry.remove(resolve, reject);
        } else {
            entry.removeRecursively(resolve, reject);
        }
    });
}

export function getDirectoryPromise(entry, path, options) {
    return new Promise((resolve, reject) => {
        entry.getDirectory(path, options, resolve, reject);
    });
}

export function readEntriesPromise(reader) {
    return new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
    });
}

export function filePromise(entry) {
    return new Promise((resolve, reject) => {
        entry.file(resolve, reject);
    });
}
/*
export function readAsTextPromise(file, encoding) {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsText(file, encoding);
    });
}
*/