import type { Scene } from '../types';
import { useOrientation } from '../hooks/useOrientation';

interface ScenePageProps {
  scene: Scene;
  pageNumber: number;
  totalPages?: number;
}

// 개별 장면 페이지 컴포넌트
export function ScenePage({ scene, pageNumber }: ScenePageProps) {
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  return (
    <div className="w-full h-full bg-white">
      {isLandscape ? (
        // 수평 모드: 이미지 왼쪽, 텍스트 오른쪽
        <div className="w-full h-full flex gap-0 p-0">
          {/* 이미지 영역 - 화면 꽉 채움 (object-cover) */}
          <div className="h-full flex-1 overflow-hidden">
            <img
              key={`landscape-${scene.id}-${scene.imageUrl.slice(-20)}`}
              src={scene.imageUrl}
              alt={`장면 ${pageNumber}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 텍스트 영역 - 세로 가운데 정렬, 내부 여백 20px */}
          <div className="h-full flex-1 flex items-center overflow-y-auto">
            <div style={{ margin: '20px', width: 'calc(100% - 40px)' }}>
              <p className="story-text text-[17px] lg:text-[25px] text-gray-700 leading-loose whitespace-pre-wrap text-left">
                {scene.text}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // 수직 모드: 이미지 상단, 텍스트 하단
        <div className="w-full h-full flex flex-col gap-0 p-0">
          {/* 이미지 영역 - 화면 꽉 채움 (object-cover) */}
          <div className="flex-1 overflow-hidden">
            <img
              key={`portrait-${scene.id}-${scene.imageUrl.slice(-20)}`}
              src={scene.imageUrl}
              alt={`장면 ${pageNumber}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 텍스트 영역 - 상단 정렬, 내부 여백 20px */}
          <div className="flex-1 flex items-start overflow-y-auto">
            <div style={{ margin: '20px', width: 'calc(100% - 40px)' }}>
              <p className="story-text text-[17px] lg:text-[25px] text-gray-700 leading-loose whitespace-pre-wrap text-left">
                {scene.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
