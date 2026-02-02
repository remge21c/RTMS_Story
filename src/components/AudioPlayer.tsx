import { useEffect, useRef, useState } from 'react';
import { useStory } from '../contexts/StoryContext';

// 배경음악 플레이어 컴포넌트
export function AudioPlayer() {
  const { storyData } = useStory();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  // 오디오 URL이 변경되면 로드
  useEffect(() => {
    if (audioRef.current && storyData.audioUrl) {
      audioRef.current.load();
    }
  }, [storyData.audioUrl]);

  // 사용자 인터랙션 후 재생 시도
  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowPlayButton(false);
      } catch (error) {
        console.error('오디오 재생 실패:', error);
      }
    }
  };

  // 재생/일시정지 토글
  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('오디오 재생 실패:', error);
        }
      }
    }
  };

  // 오디오 URL이 없으면 렌더링하지 않음
  if (!storyData.audioUrl) {
    return null;
  }

  return (
    <>
      {/* 숨겨진 오디오 엘리먼트 */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      >
        <source src={storyData.audioUrl} type="audio/mpeg" />
      </audio>

      {/* 첫 재생 버튼 (오버레이) */}
      {showPlayButton && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 cursor-pointer"
          onClick={handlePlay}
        >
          <div className="bg-white rounded-full p-8 shadow-2xl hover:scale-110 transition-transform">
            <svg
              className="w-16 h-16 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="absolute bottom-20 text-white text-lg">
            터치하여 시작하기
          </p>
        </div>
      )}

      {/* 음악 컨트롤 버튼 (우하단) */}
      {!showPlayButton && (
        <button
          onClick={togglePlay}
          className="fixed bottom-4 right-4 z-40 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
          aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
