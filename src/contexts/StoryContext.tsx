import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { StoryData, StoryContextType, Scene } from '../types';

// 로컬스토리지 키
const STORAGE_KEY = 'rtms-storybook-data';

// 기본 스토리 데이터
const defaultStoryData: StoryData = {
  audioUrl: '',
  scenes: []
};

// Context 생성
const StoryContext = createContext<StoryContextType | undefined>(undefined);

// Provider 컴포넌트
export function StoryProvider({ children }: { children: ReactNode }) {
  const [storyData, setStoryData] = useState<StoryData>(defaultStoryData);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      // 먼저 로컬스토리지에서 로드 시도
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.scenes && parsed.scenes.length > 0) {
            setStoryData(parsed);
            return;
          }
        } catch (error) {
          console.error('로컬스토리지 파싱 실패:', error);
        }
      }
      
      // 로컬스토리지에 데이터가 없으면 초기 JSON 파일에서 로드
      try {
        const response = await fetch('/data/scenes.json');
        if (response.ok) {
          const data = await response.json();
          setStoryData(data);
        }
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
      }
    };
    
    loadData();
  }, []);

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (storyData.scenes.length > 0 || storyData.audioUrl) {
      saveToLocalStorage();
    }
  }, [storyData]);

  // 로컬스토리지에서 데이터 로드
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStoryData(parsed);
      }
    } catch (error) {
      console.error('로컬스토리지 로드 실패:', error);
    }
  };

  // 로컬스토리지에 데이터 저장
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storyData));
    } catch (error) {
      console.error('로컬스토리지 저장 실패:', error);
    }
  };

  // 장면 추가
  const addScene = (scene: Omit<Scene, 'id'>) => {
    const newId = storyData.scenes.length > 0 
      ? Math.max(...storyData.scenes.map(s => s.id)) + 1 
      : 1;
    
    setStoryData(prev => ({
      ...prev,
      scenes: [...prev.scenes, { ...scene, id: newId }]
    }));
  };

  // 장면 수정
  const updateScene = (id: number, updates: Partial<Scene>) => {
    setStoryData(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === id ? { ...scene, ...updates } : scene
      )
    }));
  };

  // 장면 삭제
  const deleteScene = (id: number) => {
    setStoryData(prev => ({
      ...prev,
      scenes: prev.scenes.filter(scene => scene.id !== id)
    }));
  };

  // 장면 순서 변경
  const reorderScenes = (fromIndex: number, toIndex: number) => {
    setStoryData(prev => {
      const newScenes = [...prev.scenes];
      const [removed] = newScenes.splice(fromIndex, 1);
      newScenes.splice(toIndex, 0, removed);
      return { ...prev, scenes: newScenes };
    });
  };

  // 배경음악 URL 설정
  const setAudioUrl = (url: string) => {
    setStoryData(prev => ({ ...prev, audioUrl: url }));
  };

  // JSON으로 내보내기
  const exportToJson = () => {
    const jsonString = JSON.stringify(storyData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'storybook-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON에서 가져오기
  const importFromJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setStoryData(parsed);
    } catch (error) {
      console.error('JSON 파싱 실패:', error);
      alert('잘못된 JSON 형식입니다.');
    }
  };

  const value: StoryContextType = {
    storyData,
    setStoryData,
    addScene,
    updateScene,
    deleteScene,
    reorderScenes,
    setAudioUrl,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportToJson,
    importFromJson
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
}

// 커스텀 훅
export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}
