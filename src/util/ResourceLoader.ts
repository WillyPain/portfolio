import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

type DownloadedCallback = () => void;
class ResourceBatch {
  priority: number;
  urls: string[];
  cb?: () => void;
  constructor(
    priority: number = Number.MAX_SAFE_INTEGER,
    cb?: DownloadedCallback,
    ...urls: string[]
  ) {
    this.urls = urls;
    this.priority = priority;
    this.cb = cb;
  }
}

// Can add functionality later
// seems like we're just loading gltf files atm
export class ResourceLoader {
  constructor() {}

  resources = new Map<string, GLTF | null>();
  downloadQueue: ResourceBatch[] = [];

  private static _instance: ResourceLoader;
  public static get Instance(): ResourceLoader {
    return (this._instance ??= new ResourceLoader());
  }

  // need better name
  Enqueue(
    priority: number = Number.MAX_SAFE_INTEGER,
    cb?: DownloadedCallback,
    ...urls: string[]
  ) {
    const newUrls = [];
    for (const url of urls) {
      if (this.resources.has(url)) {
        cb?.();
        continue;
      }
      newUrls.push(url);
      this.resources.set(url, null);
    }
    // init in dictonary to keep track of queued resources
    this.downloadQueue.push(new ResourceBatch(priority, cb, ...newUrls));
  }

  // need better name
  LoadResources() {
    const gltfLoader = new GLTFLoader();
    // Sort downloadQueue by priority
    this.downloadQueue.sort((a, b) => a.priority - b.priority);

    // Can trigger some events here for starting and finishing loading
    while (this.downloadQueue.length > 0) {
      const batch = this.downloadQueue.shift();
      if (!batch) continue;

      for (const url of batch.urls) {
        gltfLoader.load(url, (file) => {
          this.OnDownloaded(url, file);
          batch.cb?.();
        });
      }
    }
  }

  OnDownloaded(url: string, file: GLTF | null) {
    this.resources.set(url, file);
  }

  static Get<T extends GLTF | null | undefined>(url: string): T {
    const resource = this.Instance.resources.get(url);
    return resource as T;
  }
}
