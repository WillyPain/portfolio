import {
  ResourceTypes,
  type MediaResource,
  type ResourceEntry,
} from "@/definitions";
import { SRGBColorSpace, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

type DownloadedCallback = () => void;
class ResourceBatch {
  priority: number;
  resourceEntry: ResourceEntry[];
  cb?: () => void;
  constructor(
    priority: number = Number.MAX_SAFE_INTEGER,
    cb?: DownloadedCallback,
    ...urls: ResourceEntry[]
  ) {
    this.resourceEntry = urls;
    this.priority = priority;
    this.cb = cb;
  }
}

// Can add functionality later
// seems like we're just loading gltf files atm
export class ResourceLoader {
  constructor() {}

  resources = new Map<string, MediaResource | string | null>();
  downloadQueue: ResourceBatch[] = [];

  private static _instance: ResourceLoader;
  public static get Instance(): ResourceLoader {
    return (this._instance ??= new ResourceLoader());
  }

  // need better name
  Enqueue(
    priority: number = Number.MAX_SAFE_INTEGER,
    cb?: DownloadedCallback,
    ...resources: ResourceEntry[]
  ) {
    const newResources = [];
    for (const resource of resources) {
      if (this.resources.has(resource.url)) {
        cb?.();
        continue;
      }
      newResources.push(resource);
      this.resources.set(resource.url, null);
    }
    // init in dictonary to keep track of queued resources
    this.downloadQueue.push(new ResourceBatch(priority, cb, ...newResources));
  }

  // need better name
  LoadResources() {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    // Sort downloadQueue by priority
    this.downloadQueue.sort((a, b) => a.priority - b.priority);

    // Can trigger some events here for starting and finishing loading
    while (this.downloadQueue.length > 0) {
      const batch = this.downloadQueue.shift();
      if (!batch) continue;

      for (const resourceEntry of batch.resourceEntry) {
        switch (resourceEntry.type) {
          case ResourceTypes.GLTF:
            gltfLoader.load(resourceEntry.url, (file) => {
              this.OnDownloaded(resourceEntry.url, file);
              batch.cb?.();
            });
            break;

          case ResourceTypes.Video: {
            const video = document.createElement<"video">("video");
            video.src = resourceEntry.url;
            video.preload = "auto";
            video.crossOrigin = "anonymous"; // Important for CORS
            video.loop = true;
            video.muted = true; // Required for autoplay in most browsers

            video.addEventListener("canplay", () => {
              this.OnDownloaded(resourceEntry.url, video);
              batch.cb?.();
            });

            video.addEventListener("error", () => {
              console.error(`Failed to load video: ${resourceEntry.url}`);
              batch.cb?.();
            });

            video.load();
            break;
          }
          case ResourceTypes.Texture:
            textureLoader.load(resourceEntry.url, (texture) => {
              texture.colorSpace = SRGBColorSpace;
              texture.needsUpdate = true;
              this.OnDownloaded(resourceEntry.url, texture);
              batch.cb?.();
            });
            break;

          default:
        }
      }
    }
  }

  OnDownloaded(url: string, file: MediaResource | null) {
    this.resources.set(url, file);
  }

  // possibly dont event need this method? accessing resource by URL should be cached by browser?
  static Get<T extends MediaResource | null | undefined>(url: string): T {
    const resource = this.Instance.resources.get(url);
    return resource as T;
  }
}
