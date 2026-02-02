import { useState, useEffect } from 'react';

// 화면 방향 타입
export type Orientation = 'portrait' | 'landscape';

// 화면 방향 감지 훅
export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(
    getOrientation()
  );

  // 현재 화면 방향 계산
  function getOrientation(): Orientation {
    // matchMedia를 사용하여 방향 감지
    if (window.matchMedia('(orientation: portrait)').matches) {
      return 'portrait';
    }
    return 'landscape';
  }

  useEffect(() => {
    // 방향 변경 핸들러
    const handleOrientationChange = () => {
      setOrientation(getOrientation());
    };

    // matchMedia 리스너 등록
    const portraitQuery = window.matchMedia('(orientation: portrait)');
    
    // 이벤트 리스너 등록 (호환성을 위해 두 가지 방식 사용)
    if (portraitQuery.addEventListener) {
      portraitQuery.addEventListener('change', handleOrientationChange);
    } else {
      // 구형 브라우저 지원
      portraitQuery.addListener(handleOrientationChange);
    }

    // resize 이벤트도 추가로 감지 (일부 데스크톱에서 필요)
    window.addEventListener('resize', handleOrientationChange);

    // 클린업
    return () => {
      if (portraitQuery.removeEventListener) {
        portraitQuery.removeEventListener('change', handleOrientationChange);
      } else {
        portraitQuery.removeListener(handleOrientationChange);
      }
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
}
