import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryViewer } from '../components/StoryViewer';
import { AudioPlayer } from '../components/AudioPlayer';

// 관리자 비밀번호
const ADMIN_PASSWORD = '2626';

// 메인 스토리북 페이지
export function Home() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // 관리자 버튼 클릭 핸들러
  const handleAdminClick = () => {
    setShowPasswordModal(true);
    setPassword('');
    setError(false);
  };

  // 비밀번호 확인 핸들러
  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false);
      navigate('/admin');
    } else {
      setError(true);
      setPassword('');
    }
  };

  // Enter 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 배경음악 플레이어 */}
      <AudioPlayer />
      
      {/* 스토리 뷰어 */}
      <StoryViewer />

      {/* 관리자 버튼 (왼쪽 하단, 잘 보이지 않게) */}
      <button
        onClick={handleAdminClick}
        className="fixed bottom-4 left-4 z-40 w-8 h-8 rounded-full opacity-10 hover:opacity-30 transition-opacity"
        aria-label="관리자"
      >
        <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
        </svg>
      </button>

      {/* 비밀번호 입력 모달 */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">관리자 접속</h3>
                  <p className="text-white/80 text-base">안전한 사용을 위해 비밀번호를 입력해주세요</p>
                </div>
              </div>
            </div>

            {/* 모달 바디 */}
            <div className="p-8">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`w-6 h-6 ${error ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="비밀번호를 입력하세요"
                  className={`w-full pl-14 pr-4 py-4 border-2 rounded-xl text-lg focus:outline-none transition-all ${
                    error 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white'
                  }`}
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="flex items-center justify-center gap-2 mb-6 text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">비밀번호가 올바르지 않습니다</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-lg"
                >
                  취소
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 text-lg transform hover:-translate-y-0.5"
                >
                  접속하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
