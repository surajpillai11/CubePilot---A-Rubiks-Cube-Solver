import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Home } from './pages/Home';
import { CubeInput } from './pages/CubeInput';
import { Solution } from './pages/Solution';
import { Timer } from './pages/Timer';
import { Learn } from './pages/Learn';
import { Statistics } from './pages/Statistics';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/input" element={<CubeInput />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
