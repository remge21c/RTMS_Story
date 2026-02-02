import { useState, useRef } from 'react';
import { useStory } from '../contexts/StoryContext';
import { Link } from 'react-router-dom';

// 저장 완료 토스트 컴포넌트
function SaveToast({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-300/50 flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-bold">{message}</span>
      </div>
    </div>
  );
}

// 삭제 확인 모달 컴포넌트
function DeleteConfirmModal({
  isOpen,
  sceneNumber,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  sceneNumber: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl mx-4 max-w-sm w-full overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* 모달 헤더 */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">장면 삭제</h3>
              <p className="text-white/70 text-sm">이 작업은 되돌릴 수 없습니다</p>
            </div>
          </div>
        </div>
        
        {/* 모달 바디 */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">🗑️</span>
            </div>
            <p className="text-gray-700">
              <strong className="text-lg">장면 {sceneNumber}</strong>을(를)<br />
              정말 삭제하시겠습니까?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-200"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 관리자 페이지
export function Admin() {
  const {
    storyData,
    addScene,
    updateScene,
    deleteScene,
    reorderScenes,
    setAudioUrl,
    exportToJson,
    importFromJson,
    saveToLocalStorage
  } = useStory();

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newText, setNewText] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; sceneId: number; sceneNumber: number }>({
    isOpen: false,
    sceneId: 0,
    sceneNumber: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // 토스트 표시 함수
  const showSaveToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 수동 저장 함수
  const handleManualSave = () => {
    saveToLocalStorage();
    showSaveToast('모든 변경사항이 저장되었습니다!');
    setHasChanges(false);
  };

  // 변경사항 추적
  const trackChange = () => {
    setHasChanges(true);
  };

  // 이미지 파일을 Base64로 변환
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, sceneId?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (sceneId !== undefined) {
        updateScene(sceneId, { imageUrl: base64 });
        trackChange();
        showSaveToast('이미지가 교체되었습니다!');
      } else {
        setNewImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
    
    // 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
    e.target.value = '';
  };

  // 오디오 파일을 Base64로 변환
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAudioUrl(base64);
      trackChange();
      showSaveToast('배경음악이 업로드되었습니다!');
    };
    reader.readAsDataURL(file);
  };

  // 새 장면 추가
  const handleAddScene = () => {
    if (!newImageUrl || !newText.trim()) {
      alert('이미지와 텍스트를 모두 입력해주세요.');
      return;
    }

    addScene({
      imageUrl: newImageUrl,
      text: newText.trim()
    });

    setNewImageUrl('');
    setNewText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showSaveToast('새 장면이 추가되었습니다!');
  };

  // JSON 파일 가져오기
  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonString = event.target?.result as string;
      importFromJson(jsonString);
      showSaveToast('데이터를 성공적으로 불러왔습니다!');
    };
    reader.readAsText(file);
  };

  // 장면 순서 이동
  const moveScene = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < storyData.scenes.length) {
      reorderScenes(index, newIndex);
      trackChange();
      showSaveToast('장면 순서가 변경되었습니다!');
    }
  };

  // 삭제 확인 모달 열기
  const openDeleteModal = (sceneId: number, sceneNumber: number) => {
    setDeleteModal({ isOpen: true, sceneId, sceneNumber });
  };

  // 삭제 확인
  const handleConfirmDelete = () => {
    deleteScene(deleteModal.sceneId);
    setDeleteModal({ isOpen: false, sceneId: 0, sceneNumber: 0 });
    showSaveToast('장면이 삭제되었습니다!');
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, sceneId: 0, sceneNumber: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* 저장 완료 토스트 */}
      <SaveToast show={showToast} message={toastMessage} />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        sceneNumber={deleteModal.sceneNumber}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* 헤더 */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                스토리북 관리자
              </h1>
              <p className="text-indigo-200 text-sm hidden sm:block">장면과 배경음악을 관리하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 저장 버튼 */}
            <button
              onClick={handleManualSave}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                hasChanges 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-300/50 animate-pulse' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="hidden sm:inline">{hasChanges ? '변경사항 저장' : '저장됨'}</span>
              <span className="sm:hidden">저장</span>
            </button>
            {/* 스토리북 보기 버튼 */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-medium hover:bg-white/30 transition-all border border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">스토리북 보기</span>
              <span className="sm:hidden">보기</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* 배경음악 섹션 */}
        <section className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-xl">🎵</span>
              </div>
              배경음악 설정
            </h2>
          </div>
          <div className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-center">
                <label className="w-full max-w-md">
                  <div className="relative group">
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center justify-center gap-3 py-5 px-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-amber-700 rounded-2xl font-bold hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 transition-all cursor-pointer shadow-sm group-hover:shadow-md">
                      <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <span className="text-lg">새로운 배경음악 업로드</span>
                    </div>
                  </div>
                </label>
              </div>
              {storyData.audioUrl && (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <span className="text-green-700 font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    업로드 완료
                  </span>
                  <audio controls className="w-full sm:flex-1 h-12 rounded-lg shadow-sm">
                    <source src={storyData.audioUrl} type="audio/mpeg" />
                  </audio>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 데이터 관리 섹션 */}
        <section className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-xl">📦</span>
              </div>
              데이터 백업 및 복구
            </h2>
          </div>
          <div className="p-10">
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={exportToJson}
                className="flex-1 max-w-xs inline-flex items-center justify-center gap-3 bg-white border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                JSON 내보내기
              </button>
              <label className="flex-1 max-w-xs relative group cursor-pointer">
                <input
                  ref={jsonInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleJsonImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="inline-flex items-center justify-center gap-3 w-full bg-white border-2 border-violet-500 text-violet-600 px-8 py-4 rounded-2xl font-bold group-hover:bg-violet-50 transition-all shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  JSON 가져오기
                </div>
              </label>
            </div>
            <p className="text-center text-gray-400 mt-6 text-sm">
              * 작업 전 데이터를 백업(내보내기)하는 것을 권장합니다.
            </p>
          </div>
        </section>

        {/* 새 장면 추가 섹션 */}
        <section className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/50">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-xl">➕</span>
              </div>
              새 장면 추가하기
            </h2>
          </div>
          <div className="p-8 lg:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* 이미지 업로드 */}
              <div className="space-y-4">
                <label className="block text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">🖼️</span> 이미지 선택
                </label>
                <div className="relative group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`flex flex-col items-center justify-center gap-4 aspect-video rounded-2xl border-3 border-dashed transition-all ${newImageUrl ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400'}`}>
                    {newImageUrl ? (
                      <img
                        src={newImageUrl}
                        alt="미리보기"
                        className="w-full h-full object-contain rounded-xl p-2"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="font-bold text-gray-500 group-hover:text-blue-600 transition-colors">클릭하여 이미지 업로드</p>
                        <p className="text-sm text-gray-400 mt-1">또는 파일을 여기로 드래그하세요</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 텍스트 입력 */}
              <div className="space-y-4 flex flex-col">
                <label className="block text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">✏️</span> 스토리 내용
                </label>
                <div className="flex-1 relative">
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full h-full min-h-[200px] border-2 border-gray-200 rounded-2xl p-6 text-lg leading-relaxed focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none bg-gray-50 focus:bg-white shadow-inner placeholder-gray-400"
                    placeholder="여기에 이야기 내용을 입력하세요..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
                    {newText.length}자
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 버튼 */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleAddScene}
                className="w-full max-w-lg mx-auto block bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <div className="bg-white/20 rounded-full p-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                장면 목록에 추가하기
              </button>
            </div>
          </div>
        </section>

        {/* 장면 목록 */}
        <section className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-gray-800 px-8 py-6 sticky top-0 z-30">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-xl">📖</span>
              </div>
              등록된 장면 목록
              <span className="ml-auto text-base font-medium bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                총 {storyData.scenes.length}개
              </span>
            </h2>
          </div>
          <div className="p-8 bg-gray-50/50 min-h-[300px]">
            {storyData.scenes.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-5xl opacity-50">📭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">아직 등록된 장면이 없습니다</h3>
                <p className="text-gray-400">위의 '새 장면 추가하기'에서 첫 번째 장면을 만들어보세요!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {storyData.scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* 이미지 영역 */}
                      <div className="lg:w-1/3 flex flex-col gap-3">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-center aspect-video group-hover:bg-blue-50/30 transition-colors">
                          <img
                            key={`img-${scene.id}-${scene.imageUrl.slice(-20)}`}
                            src={scene.imageUrl}
                            alt={`장면 ${index + 1}`}
                            className="w-full h-full object-contain rounded-lg shadow-sm"
                          />
                        </div>
                        <label className="block w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, scene.id)}
                            className="hidden"
                            key={`input-${scene.id}`}
                          />
                          <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all cursor-pointer shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            이미지 교체
                          </div>
                        </label>
                      </div>

                      {/* 텍스트 영역 */}
                      <div className="lg:w-2/3 flex flex-col">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                          <span className="inline-flex items-center gap-3 text-xl font-bold text-gray-800">
                            <span className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md shadow-blue-200">
                              {index + 1}
                            </span>
                            Scene {index + 1}
                          </span>
                          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                            {/* 순서 이동 버튼 */}
                            <button
                              onClick={() => moveScene(index, 'up')}
                              disabled={index === 0}
                              className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all shadow-sm disabled:shadow-none"
                              title="위로 이동"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <div className="w-px h-6 bg-gray-200"></div>
                            <button
                              onClick={() => moveScene(index, 'down')}
                              disabled={index === storyData.scenes.length - 1}
                              className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all shadow-sm disabled:shadow-none"
                              title="아래로 이동"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className="w-px h-6 bg-gray-200"></div>
                            {/* 삭제 버튼 */}
                            <button
                              onClick={() => openDeleteModal(scene.id, index + 1)}
                              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-red-100"
                              title="삭제"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={scene.text}
                          onChange={(e) => {
                            updateScene(scene.id, { text: e.target.value });
                            trackChange();
                          }}
                          placeholder="장면의 내용을 입력하세요..."
                          className="flex-1 w-full border-2 border-gray-200 rounded-xl p-5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none bg-gray-50/50 focus:bg-white text-lg leading-relaxed min-h-[150px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gradient-to-r from-slate-800 to-gray-900 mt-8">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            변경사항은 자동으로 저장됩니다 · 상단의 저장 버튼으로 수동 저장도 가능합니다
          </p>
        </div>
      </footer>
    </div>
  );
}
