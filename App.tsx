import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ContextVariables, 
  JourneyData, 
  LocationContext, 
  SocialContext, 
  TimeContext, 
  MoodContext,
  ModelProvider
} from './types';
import { generateJourney } from './services/aiService';
import VariablePanel from './components/VariablePanel';
import JourneyTimeline from './components/JourneyTimeline';
import { Wand2, Loader2, Info, WifiOff, X } from 'lucide-react';

const App: React.FC = () => {
  // State for API Keys per provider
  const [apiKeys, setApiKeys] = useState<Record<ModelProvider, string>>({
    [ModelProvider.Gemini]: '',
    [ModelProvider.ChatGPT]: '',
    [ModelProvider.DeepSeek]: '',
  });

  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<ModelProvider>(ModelProvider.Gemini);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Initialize Key check from Environment Variables
  useEffect(() => {
    const envKeys = {
      [ModelProvider.Gemini]: import.meta.env.VITE_GEMINI_API_KEY || '',
      [ModelProvider.ChatGPT]: import.meta.env.VITE_OPENAI_API_KEY || '',
      [ModelProvider.DeepSeek]: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    };
    
    setApiKeys(prev => ({ ...prev, ...envKeys }));
  }, []);

  // Helper to get current key
  const currentKey = apiKeys[selectedModel];

  // Helper to set current key
  const handleKeyChange = (value: string) => {
    setApiKeys(prev => ({ ...prev, [selectedModel]: value }));
  };

  // Default Variables
  const [variables, setVariables] = useState<ContextVariables>({
    location: LocationContext.Bedroom,
    social: SocialContext.Solo,
    time: TimeContext.Evening,
    mood: MoodContext.Relaxing,
  });

  const [backgroundContext, setBackgroundContext] = useState<string>('');
  const [showBackgroundInput, setShowBackgroundInput] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setBackgroundContext(prev => {
        const separator = prev ? '\n\n' : '';
        return `${prev}${separator}--- File: ${file.name} ---\n${content}`;
      });
    };
    reader.readAsText(file);
  };

  const handleGenerate = async (isUpdate: boolean = false) => {
    if (!currentKey) {
        // Attempt to get key if using the Google AI Studio IDX environment (Only for Gemini)
        if (selectedModel === ModelProvider.Gemini && window.aistudio && window.aistudio.openSelectKey) {
            await window.aistudio.openSelectKey();
             if (process.env.API_KEY) {
                handleKeyChange(process.env.API_KEY);
             }
        } else {
             setError(`请提供 ${selectedModel} 的 API 密钥。`);
             setShowKeyInput(true);
             return;
        }
    }

    if (!prompt.trim()) {
      setError("请描述目标用户画像和主要故事线。");
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateJourney(
        prompt, 
        variables, 
        currentKey, 
        selectedModel, 
        undefined, 
        backgroundContext,
        abortController.signal
      );
      
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }
      
      setJourneyData(data);
      setHasGeneratedOnce(true);
    } catch (err: any) {
      if (err.name === 'AbortError' || abortController.signal.aborted) {
        setError("分析已取消。");
      } else {
        setError(err.message || "生成旅程图时发生错误。");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setError("分析已取消。");
    }
  };

  const handleVariableChange = (key: keyof ContextVariables, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  // Auto-update when variables change, but only after initial generation
  // Using a ref to debounce or simply trigger effect
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (hasGeneratedOnce && !isLoading) {
      // Small debounce could be added here, but direct call is okay for this UX
      // We will trigger a re-generation to reflect variable changes
      const timer = setTimeout(() => {
          handleGenerate(true);
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables]);

  // Handler for updating journey data from the timeline component (e.g., editing, adding/deleting stages)
  const handleJourneyUpdate = (newData: JourneyData) => {
    setJourneyData(newData);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Wand2 size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">BeautySexMap <span className="text-gray-400 font-normal text-sm ml-2">成人/情趣用品 UX 旅程生成器</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelProvider)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
            >
              <option value={ModelProvider.Gemini}>Google Gemini</option>
              <option value={ModelProvider.ChatGPT}>ChatGPT (OpenAI)</option>
              <option value={ModelProvider.DeepSeek}>DeepSeek</option>
            </select>

            <button 
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              {showKeyInput ? '收起' : (currentKey ? '更换密钥' : '设置 API 密钥')}
            </button>
          </div>
        </div>
        
        {/* API Key Input */}
        {showKeyInput && (
          <div className="bg-indigo-50 border-b border-indigo-100 p-4">
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
               <span className="text-sm font-medium text-indigo-900 whitespace-nowrap">
                 {selectedModel} API Key:
               </span>
               <input 
                 type="password" 
                 value={currentKey}
                 onChange={(e) => handleKeyChange(e.target.value)}
                 placeholder={`Enter your ${selectedModel} API Key`}
                 className="flex-1 bg-white border border-indigo-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
            </div>
          </div>
        )}
      </header>

      {/* Main Input Section */}
      <div className={`transition-all duration-500 ease-in-out ${hasGeneratedOnce ? 'bg-white border-b border-gray-200 shadow-sm relative z-30' : 'min-h-[60vh] flex flex-col justify-center'}`}>
        <div className="max-w-3xl mx-auto px-4 w-full py-12">
          
          {!hasGeneratedOnce && (
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">用同理心设计。</h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                为私密产品生成详细的用户旅程图。
                通过探索不同的情境和场景，发现潜在的设计机会。
              </p>
            </div>
          )}

          <div className="relative">
            <label htmlFor="prompt" className="sr-only">描述旅程</label>
            <div className="relative group">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：一位忙碌的市场主管为了缓解压力，第一次尝试使用APP控制的跳蛋..."
                className={`w-full bg-white border-2 border-gray-200 rounded-2xl p-6 text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-sm placeholder:text-gray-400 ${hasGeneratedOnce ? 'h-32 text-base' : 'h-48'}`}
                disabled={isLoading}
              />
              
              {/* Background Context Toggle */}
              <div className="absolute bottom-4 left-4">
                 <button
                    onClick={() => setShowBackgroundInput(!showBackgroundInput)}
                    className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                 >
                    {showBackgroundInput ? '收起背景信息' : '+ 添加背景信息 / 参考资料'}
                 </button>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2">
                {isLoading && (
                  <button
                    onClick={handleCancelGeneration}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2 transition-all transform active:scale-95"
                  >
                    <X className="w-5 h-5" />
                    取消
                  </button>
                )}
                <button
                  onClick={() => handleGenerate(false)}
                  disabled={isLoading || !prompt.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-200 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      {hasGeneratedOnce ? '更新中...' : '生成中...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      {hasGeneratedOnce ? '重新生成' : '生成旅程图'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Background Context Input Area */}
            {showBackgroundInput && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">背景信息 / 品牌资料 / 用户访谈</label>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs bg-white border border-gray-300 hover:bg-gray-50 px-2 py-1 rounded text-gray-600"
                        >
                            上传文件 (.txt, .md, .json)
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            accept=".txt,.md,.json"
                            onChange={handleFileChange}
                        />
                    </div>
                    <textarea
                        value={backgroundContext}
                        onChange={(e) => setBackgroundContext(e.target.value)}
                        placeholder="在此粘贴额外的背景信息，或者上传文件..."
                        className="w-full h-32 bg-white border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                    />
                </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <Info className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Fallback Warning */}
            {journeyData?.isFallback && !error && (
              <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-xl flex items-center gap-3 border border-amber-100 animate-in fade-in slide-in-from-top-2">
                <WifiOff className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  网络连接不稳定，已自动切换至<span className="font-bold">离线演示模式</span>。当前展示的数据仅供参考。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {hasGeneratedOnce && (
        <>
          <VariablePanel 
            variables={variables} 
            onChange={handleVariableChange} 
            disabled={isLoading}
          />
          
          <main className="w-full bg-slate-900">
            {isLoading && !journeyData ? (
               <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-300" />
                  <p>正在咨询 UX 研究模型...</p>
               </div>
            ) : journeyData ? (
              <JourneyTimeline data={journeyData} onUpdate={handleJourneyUpdate} />
            ) : null}
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BeautySexMap. 专为专业 UX 研究设计。</p>
          <p className="mt-2 text-xs">AI 生成的内容应由人工研究员进行验证。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;