
// promisify
export function requestFileSystemPromise(type, size) {
    return new Promise((resolve, reject) => {
      window.webkitRequestFileSystem(type, size, resolve, reject);
    });
}

export function getFilePromise(WFS, name, options) {
    return new Promise((resolve, reject) => {
        WFS.root.getFile(name, options, resolve, reject)
    })
}

export function createWriterPromise(entry) {
    entry.createWriter((writer) => writer.truncate(0)); // clear the old file

    return new Promise((resolve, reject) => {
        entry.createWriter(resolve, reject);
    });
}
