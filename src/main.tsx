import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App.tsx'
import '@/assets/styles/index.css'
// 加载配置
import { loadConfig, getConfig } from '@/config';

loadConfig().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<BrowserRouter basename={getConfig().VITE_APP_PREFIX}>
				<App />
			</BrowserRouter>
		</StrictMode>,
	)
});

