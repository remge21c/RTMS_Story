import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, Mousewheel } from 'swiper/modules';
import { useStory } from '../contexts/StoryContext';
import { ScenePage } from './ScenePage';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/pagination';

// 스토리 뷰어 컴포넌트
export function StoryViewer() {
  const { storyData } = useStory();

  // 장면이 없을 때
  if (storyData.scenes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            스토리가 없습니다
          </h2>
          <p className="text-gray-500">
            관리자 페이지에서 장면을 추가해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Pagination, Keyboard, Mousewheel]}
      spaceBetween={0}
      slidesPerView={1}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      keyboard={{
        enabled: true,
      }}
      mousewheel={{
        forceToAxis: true,
      }}
      grabCursor={true}
      className="w-full h-full"
      style={{
        // Pagination 스타일 커스터마이징
        '--swiper-pagination-color': '#f59e0b',
        '--swiper-pagination-bullet-inactive-color': '#d1d5db',
        '--swiper-pagination-bullet-inactive-opacity': '0.5',
        '--swiper-pagination-bullet-size': '10px',
        '--swiper-pagination-bullet-horizontal-gap': '6px',
      } as React.CSSProperties}
    >
      {storyData.scenes.map((scene, index) => (
        <SwiperSlide key={scene.id}>
          <ScenePage
            scene={scene}
            pageNumber={index + 1}
            totalPages={storyData.scenes.length}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
