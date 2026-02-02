import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoryProvider } from './contexts/StoryContext';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';

function App() {
  return (
    <StoryProvider>
      <BrowserRouter>
        <Routes>
          {/* 메인 스토리북 페이지 */}
          <Route path="/" element={<Home />} />
          
          {/* 관리자 페이지 (숨겨진 URL) */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </StoryProvider>
  );
}

export default App;
