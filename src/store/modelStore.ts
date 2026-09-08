import { create } from 'zustand';
import { ModelInfo, OfflineAIStatus } from '../types';
import { ModelManager, StorageInfo } from '../ai/ModelManager';

interface ModelState {
  modelManager: ModelManager;
  models: ModelInfo[];
  activeModel: ModelInfo | null;
  status: OfflineAIStatus;
  storageInfo: StorageInfo;
  downloadingModelId: string | null;
  downloadProgress: number;
  initModels: () => void;
  downloadModel: (id: string) => Promise<boolean>;
  cancelDownload: (id: string) => void;
  loadModel: (id: string) => Promise<boolean>;
  unloadModel: (id: string) => Promise<boolean>;
  deleteModel: (id: string) => Promise<boolean>;
  refreshStorage: () => void;
}

const manager = new ModelManager();

export const useModelStore = create<ModelState>((set, get) => ({
  modelManager: manager,
  models: manager.listModels(),
  activeModel: manager.getActiveModel() || null,
  status: manager.getActiveModel() ? 'offline_ready' : 'model_required',
  storageInfo: manager.getStorageInfo(),
  downloadingModelId: null,
  downloadProgress: 0,

  initModels: () => {
    const models = manager.listModels();
    const active = manager.getActiveModel() || null;
    set({
      models,
      activeModel: active,
      status: active ? 'offline_ready' : 'model_required',
      storageInfo: manager.getStorageInfo()
    });
  },

  downloadModel: async (id: string) => {
    set({ downloadingModelId: id, downloadProgress: 0, status: 'downloading' });
    try {
      const success = await manager.downloadModel(id, (p) => {
        set({ downloadProgress: p });
      });

      if (success) {
        // Auto-load newly downloaded model
        await manager.loadModel(id);
      }

      get().initModels();
      set({ downloadingModelId: null, downloadProgress: 0 });
      return success;
    } catch (err) {
      set({ downloadingModelId: null, downloadProgress: 0, status: 'error' });
      return false;
    }
  },

  cancelDownload: (id: string) => {
    manager.cancelDownload(id);
    get().initModels();
    set({ downloadingModelId: null, downloadProgress: 0 });
  },

  loadModel: async (id: string) => {
    try {
      const ok = await manager.loadModel(id);
      get().initModels();
      return ok;
    } catch {
      return false;
    }
  },

  unloadModel: async (id: string) => {
    const ok = await manager.unloadModel(id);
    get().initModels();
    return ok;
  },

  deleteModel: async (id: string) => {
    const ok = await manager.deleteModel(id);
    get().initModels();
    return ok;
  },

  refreshStorage: () => {
    set({ storageInfo: manager.getStorageInfo() });
  }
}));
