import { useEffect } from 'react';
import { render } from 'react-dom';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Project } from './components/project';
import { Header } from './components/header';

function App() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    if (banner) banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <BrowserRouter>
      <DevseedUiThemeProvider>
        <Header />
        <Routes>
          <Route exact path='/' element={<Project />} />
          <Route exact path='/project/:slug' element={<Project />} />
        </Routes>
      </DevseedUiThemeProvider>
    </BrowserRouter>
  );
}

render(<App />, document.querySelector('#app-container'));
