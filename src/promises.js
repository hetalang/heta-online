
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