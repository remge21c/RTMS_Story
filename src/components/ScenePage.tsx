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
          {/* 이미지 영역 - 이미지가 잘리지 않게 contain 사용 */}
          <div className="h-full flex-1 flex items-center justify-center bg-white p-0">
            <img
              key={`landscape-${scene.id}-${scene.imageUrl.slice(-20)}`}
              src={scene.imageUrl}
              alt={`장면 ${pageNumber}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
          
          {/* 텍스트 영역 - 너비 100%, 내부 여백 20px */}
          <div className="h-full flex-1 flex items-center justify-center p-[20px] overflow-y-auto">
            <div className="w-full">
              {/* 텍스트 내용 (글자는 왼쪽 정렬) */}
              <p className="story-text text-[15px] lg:text-[25px] text-gray-700 leading-loose whitespace-pre-wrap text-left">
                {scene.text}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // 수직 모드: 이미지 상단, 텍스트 하단
        <div className="w-full h-full flex flex-col gap-0 p-0">
          {/* 이미지 영역 - 상단 50% */}
          <div className="flex-1 flex items-center justify-center bg-white p-0">
            <img
              key={`portrait-${scene.id}-${scene.imageUrl.slice(-20)}`}
              src={scene.imageUrl}
              alt={`장면 ${pageNumber}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
            />
          </div>
          
          {/* 텍스트 영역 - 너비 100%, 내부 여백 20px */}
          <div className="flex-1 flex items-center justify-center p-[20px] overflow-y-auto">
            <div className="w-full">
              {/* 텍스트 내용 (글자는 왼쪽 정렬) */}
              <p className="story-text text-[15px] lg:text-[25px] text-gray-700 leading-loose whitespace-pre-wrap text-left">
                {scene.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
