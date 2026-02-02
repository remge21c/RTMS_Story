import type { Scene } from '../types';
import { useOrientation } from '../hooks/useOrientation';

interface ScenePageProps {
  scene: Scene;
  pageNumber: number;
  totalPages: number;
}

// 개별 장면 페이지 컴포넌트
export function ScenePage({ scene, pageNumber, totalPages }: ScenePageProps) {
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  return (
    <div className="w-full h-full bg-white">
      {isLandscape ? (
        // 수평 모드: 이미지 왼쪽, 텍스트 오른쪽
        <div className="w-full h-full flex gap-[15px] p-6">
          {/* 이미지 영역 - 이미지가 잘리지 않게 contain 사용 */}
          <div className="h-full flex-1 flex items-center justify-center bg-white p-4">
            <img
              key={`landscape-${scene.id}-${scene.imageUrl.slice(-20)}`}
              src={scene.imageUrl}
              alt={`장면 ${pageNumber}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
          
          {/* 텍스트 영역 - 상자 전체가 가운데 정렬 */}
          <div className="h-full flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
            <div className="max-w-2xl px-8 lg:px-12">
              {/* 텍스트 내용 (글자는 왼쪽 정렬) */}
              <p className="story-text text-[30px] text-gray-700 leading-loose whitespace-pre-wrap text-left">
                {scene.text}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // 수직 모드: 이미지 상단, 텍스트 하단
        <div className="w-full h-full flex flex-col gap-[15px] p-4">
          {/* 이미지 영역 - 상단 50% */}
          <div className="flex-1 flex items-center justify-center bg-white p-2">
            <img
              key={`portrait-${scene.id}-${scene.imageUrl.slice(-20)}`}
              src={scene.imageUrl}
              alt={`장면 ${pageNumber}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
            />
          </div>
          
          {/* 텍스트 영역 - 상자 전체가 가운데 정렬 */}
          <div className="flex-1 flex items-center justify-center px-8 sm:px-12 md:px-16 py-4 sm:py-6 overflow-y-auto">
            <div className="max-w-lg px-6 sm:px-8">
              {/* 텍스트 내용 (글자는 왼쪽 정렬) */}
              <p className="story-text text-[30px] text-gray-700 leading-loose whitespace-pre-wrap text-left">
                {scene.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
