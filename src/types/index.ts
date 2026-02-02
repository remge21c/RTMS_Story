// 스토리북 장면 인터페이스
export interface Scene {
  id: number;           // 장면 고유 ID
  imageUrl: string;     // 이미지 URL (Base64 또는 경로)
  text: string;         // 장면 텍스트
}

// 스토리 데이터 인터페이스
export interface StoryData {
  audioUrl: string;     // 배경음악 URL
  scenes: Scene[];      // 장면 배열
}

// 스토리 컨텍스트 타입
export interface StoryContextType {
  storyData: StoryData;
  setStoryData: (data: StoryData) => void;
  addScene: (scene: Omit<Scene, 'id'>) => void;
  updateScene: (id: number, scene: Partial<Scene>) => void;
  deleteScene: (id: number) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;
  setAudioUrl: (url: string) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportToJson: () => void;
  importFromJson: (jsonString: string) => void;
  saveImageToFile: (base64Data: string, filename: string) => Promise<string>;
}
