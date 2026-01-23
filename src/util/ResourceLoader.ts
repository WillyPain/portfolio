import {
  ResourceTypes as ResourceType,
  type MediaResource,
  type ResourceEntry,
} from "@/definitions";
import { AudioLoader, Group, SRGBColorSpace, TextureLoader } from "three";
import {
  GLTFLoader,
  SkeletonUtils,
  type GLTF,
} from "three/examples/jsm/Addons.js";

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

export class ResourceLoader {
  constructor() {}

  resources = new Map<string, MediaResource | string | null>();
  downloadQueue: ResourceBatch[] = [];

  private static _instance: ResourceLoader;
  public static get Instance(): ResourceLoader {
    return (this._instance ??= new ResourceLoader());
  }

  progressEventListeners: ((
    fileId: string,
    loaded: number,
    total: number
  ) => void)[] = [];

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

  LoadResources() {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new TextureLoader();
    const audioLoader = new AudioLoader();

    // Sort downloadQueue by priority
    this.downloadQueue.sort((a, b) => a.priority - b.priority);

    // Can trigger some events here for starting and finishing loading
    while (this.downloadQueue.length > 0) {
      const batch = this.downloadQueue.shift();

      if (!batch) continue;

      for (const resourceEntry of batch.resourceEntry) {
        const onDownload = (resource: MediaResource | null) => {
          this.OnDownloaded(resourceEntry.url, resource);
          batch.cb?.();
        };

        const onProgress = (event: ProgressEvent) => {
          this.progressEventListeners.forEach((pel) =>
            pel(resourceEntry.url, event.loaded, event.total)
          );
        };

        switch (resourceEntry.type) {
          case ResourceType.GLTF:
            gltfLoader.load(resourceEntry.url, onDownload, onProgress);
            break;

          case ResourceType.Video: {
            this.downloadVideo(resourceEntry.url, onDownload, onProgress);
            break;
          }

          case ResourceType.Texture:
            textureLoader.load(
              resourceEntry.url,
              (texture) => {
                texture.colorSpace = SRGBColorSpace;
                texture.needsUpdate = true;
                onDownload(texture);
              },
              onProgress,
              (e) => {
                console.log(e);
              }
            );
            break;

          case ResourceType.Audio:
            audioLoader.load(resourceEntry.url, onDownload, onProgress);
            break;

          default:
        }
      }
    }
  }

  OnDownloaded(url: string, resource: MediaResource | null) {
    this.resources.set(url, resource);
  }

  // possibly dont event need this method? accessing resource by URL should be cached by browser?
  static Get<T extends MediaResource | null | undefined>(url: string): T {
    const resource = this.Instance.resources.get(url);
    if ((resource as GLTF).scene) {
      const gltf = resource as GLTF;
      const copiedGltf: GLTF = {
        scene: new Group().add(SkeletonUtils.clone(gltf.scene)),
        animations: gltf.animations,
        scenes: gltf.scenes,
        cameras: gltf.cameras,
        userData: gltf.userData,
        asset: gltf.asset,
        parser: gltf.parser,
      };
      return copiedGltf as T;
    }
    return resource as T;
  }

  downloadVideo(
    url: string,
    onDownloaded?: (media: MediaResource | null) => void,
    onProgress?: (event: ProgressEvent) => void
  ) {
    fetch(url).then(async (response) => {
      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body!.getReader();
      const chunks: BlobPart[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          const url = URL.createObjectURL(new Blob(chunks));
          const video = document.createElement<"video">("video");
          video.src = url;
          video.preload = "auto";
          video.crossOrigin = "anonymous";
          video.loop = true;
          video.muted = true;

          video.addEventListener("canplay", () => {
            onDownloaded?.(video);
          });

          video.load();
          return video;
        }

        chunks.push(value);
        loaded += value.length;
        onProgress?.({
          loaded,
          total,
        });
      }
    });
  }
}
// utils/fetchWithProgress.ts
interface ProgressEvent {
  loaded: number;
  total: number;
}
