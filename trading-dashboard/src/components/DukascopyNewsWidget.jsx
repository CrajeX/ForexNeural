// import React, { useEffect, useRef, useState } from 'react';
// import { TrendingUp, Globe, Zap, ChevronRight, Activity } from 'lucide-react';

// const DukascopyNewsWidget = () => {
//   const iframeRef = useRef(null);
//   const [selectedCategory, setSelectedCategory] = useState('finance');
//   const [isLoading, setIsLoading] = useState(true);

//   const categories = [
//     { id: 'finance', label: 'Finance', icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
//     { id: 'forex', label: 'Forex', icon: Globe, color: 'from-blue-500 to-cyan-600' },
//     { id: 'stocks', label: 'Stocks', icon: Activity, color: 'from-purple-500 to-violet-600' },
//     { id: 'company_news', label: 'Companies', icon: Zap, color: 'from-orange-500 to-red-600' },
//     { id: 'commodities', label: 'Commodities', icon: TrendingUp, color: 'from-yellow-500 to-amber-600' }
//   ];

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     setIsLoading(true);

//     const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Dukascopy News</title>
//     <style>
       
      
//         .loading-overlay {
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: rgba(15, 23, 42, 0.9);
//             backdrop-filter: blur(8px);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             z-index: 1000;
//             opacity: 1;
//             transition: opacity 0.5s ease;
//         }
//         .loading-overlay.hidden {
//             opacity: 0;
//             pointer-events: none;
//         }
//         .spinner {
//             width: 50px;
//             height: 50px;
//             border: 4px solid rgba(59, 130, 246, 0.3);
//             border-top: 4px solid #3b82f6;
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//         }
//         .loading-text {
//             margin-top: 20px;
//             color: #cbd5e1;
//             font-weight: 500;
//         }
//         .dot-animation {
//             display: inline-block;
//             margin-left: 10px;
//         }
//         .dot {
//             display: inline-block;
//             width: 6px;
//             height: 6px;
//             background: #3b82f6;
//             border-radius: 50%;
//             margin: 0 2px;
//             animation: bounce 1.4s infinite ease-in-out both;
//         }
//         .dot:nth-child(1) { animation-delay: -0.32s; }
//         .dot:nth-child(2) { animation-delay: -0.16s; }
//         @keyframes bounce {
//             0%, 80%, 100% { transform: scale(0); }
//             40% { transform: scale(1); }
//         }
//     </style>
// </head>
// <body>
//     <div id="news-container">
//         <div class="loading-overlay" id="loadingOverlay">
//             <div style="text-align: center;">
//                 <div class="spinner"></div>
//                 <div class="loading-text">
//                     Loading market insights
//                     <div class="dot-animation">
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                         <span class="dot"></span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
    
//     <script type="text/javascript">
//         DukascopyApplet = {
//             "type": "online_news",
//             "params": {
//                 "header": false,
//                 "borders": false,
//                 "defaultLanguage": "en",
//                 "availableLanguages": [
//                     "ar", "bg", "cs", "de", "en", "es", "fa", "fr", 
//                     "he", "hu", "it", "ja", "ms", "pl", "pt", "ro", 
//                     "ru", "sk", "sv", "th", "uk", "zh"
//                 ],
//                 "newsCategories": ["${selectedCategory}"],
//                 "width": "100%",
//                 "height": "1000",
//                 "adv": "popup"
//             }
//         };

//         // Hide loading overlay after script loads
//         setTimeout(() => {
//             const overlay = document.getElementById('loadingOverlay');
//             if (overlay) {
//                 overlay.classList.add('hidden');
//             }
//         }, 2000);
//     </script>
//     <script type="text/javascript" src="https://feed.financialjuice.com/widgets/widgets.js?r=" + r + ""></script>
// </body>
// </html>`;

//     // Write the HTML content to the iframe
//     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//     iframeDoc.open();
//     iframeDoc.write(htmlContent);
//     iframeDoc.close();

//     // Hide loading after iframe loads
//     setTimeout(() => setIsLoading(false), 2500);
//   }, [selectedCategory]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
//               <Activity className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
//                 Market Intelligence Hub
//               </h1>
//               <p className="text-slate-400 text-lg mt-2">Real-time financial news powered by Dukascopy</p>
//             </div>
//           </div>

//           {/* Enhanced Category Pills */}
//           <div className="flex flex-wrap justify-center gap-4 mb-8">
//             {categories.map((category) => {
//               const IconComponent = category.icon;
//               const isActive = selectedCategory === category.id;
              
//               return (
//                 <button
//                   key={category.id}
//                   onClick={() => setSelectedCategory(category.id)}
//                   className={`group relative px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
//                     isActive 
//                       ? `bg-gradient-to-r ${category.color} text-white shadow-xl shadow-${category.color.split('-')[1]}-500/30` 
//                       : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50 hover:border-slate-500/70'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <IconComponent className={`w-5 h-5 transition-all duration-300 ${
//                       isActive ? 'text-white rotate-12' : 'text-slate-400 group-hover:text-slate-300 group-hover:rotate-6'
//                     }`} />
//                     <span className="text-base">{category.label}</span>
//                     {isActive && <ChevronRight className="w-4 h-4 ml-1 animate-pulse" />}
//                   </div>
//                   {isActive && (
//                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
//                   )}
//                   <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </button>
//               );
//             })}
//           </div>
//         </div>
        
//         {/* News Widget Container */}
//         <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50 backdrop-blur-sm">
//           <div className="relative">
//             {/* Top Gradient Overlay */}
//             <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-800/30 to-transparent pointer-events-none z-10" />
            
//             {/* Loading Overlay */}
//             {isLoading && (
//               <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
//                   <p className="text-slate-200 font-semibold text-xl">Loading {categories.find(c => c.id === selectedCategory)?.label} News...</p>
//                   <div className="flex justify-center mt-4 gap-2">
//                     <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
//                     <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
//                     <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <iframe
//               ref={iframeRef}
//               className="w-full border-0 transition-opacity duration-500"
//               style={{ 
//                 height: '100vh', 
//                 width: '100%',
//                 minHeight: '600px',
//                 opacity: isLoading ? 0.3 : 1 
//               }}
//               title="Dukascopy News Widget"
//             />
//           </div>
//         </div>
        
//         {/* Enhanced Footer Stats */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
//                 <Activity className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <div className="text-emerald-400 text-3xl font-bold">24/7</div>
//                 <div className="text-slate-300 text-sm font-medium">Live Coverage</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
//                 <Globe className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <div className="text-blue-400 text-3xl font-bold">21</div>
//                 <div className="text-slate-300 text-sm font-medium">Languages</div>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
//                 <Zap className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <div className="text-purple-400 text-3xl font-bold">5</div>
//                 <div className="text-slate-300 text-sm font-medium">Categories</div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-12 text-center">
//           <p className="text-slate-400 text-sm">
//             News data provided by <span className="font-semibold text-slate-300">Dukascopy Bank SA</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DukascopyNewsWidget;
import React, { useEffect, useState } from 'react';
import { TrendingUp, Globe, Zap, ChevronRight, Activity, BarChart3 } from 'lucide-react';

const  DukascopyNewsWidget = () => {
  const [selectedMode, setSelectedMode] = useState('Dark');
  const [isLoading, setIsLoading] = useState(true);

  const modes = [
    { id: 'Dark', label: 'Dark Theme', icon: Activity, color: 'from-slate-500 to-slate-700' },
    { id: 'Light', label: 'Light Theme', icon: Globe, color: 'from-gray-300 to-gray-500' }
  ];

  const categories = [
    { id: 'news', label: 'Financial News', icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
    { id: 'markets', label: 'Markets', icon: BarChart3, color: 'from-blue-500 to-cyan-600' },
    { id: 'analysis', label: 'Analysis', icon: Activity, color: 'from-purple-500 to-violet-600' },
    { id: 'insights', label: 'Insights', icon: Zap, color: 'from-orange-500 to-red-600' }
  ];

  useEffect(() => {
    // Clear any existing widgets
    const existingContainer = document.getElementById('financialjuice-news-widget-container');
    if (existingContainer) {
      existingContainer.innerHTML = '';
    }

    // Remove existing script if present
    const existingScript = document.getElementById('FJ-Widgets');
    if (existingScript) {
      existingScript.remove();
    }

    setIsLoading(true);

    // Create and load the FinancialJuice script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "FJ-Widgets";
    const r = Math.floor(Math.random() * (9999 - 0 + 1) + 0);
    script.src = "https://feed.financialjuice.com/widgets/widgets.js?r=" + r;
    
    script.onload = function() {
      try {
        const options = {
          container: "financialjuice-news-widget-container",
          mode: selectedMode,
          width: "100%",
          height: "800px",
          backColor: selectedMode === 'Dark' ? "1e222d" : "ffffff",
          fontColor: selectedMode === 'Dark' ? "b2b5be" : "333333",
          widgetType: "NEWS"
        };
        
        if (window.FJWidgets && window.FJWidgets.createWidget) {
          new window.FJWidgets.createWidget(options);
          setTimeout(() => setIsLoading(false), 1500);
        }
      } catch (error) {
        console.error('Error loading FinancialJuice widget:', error);
        setIsLoading(false);
      }
    };

    script.onerror = function() {
      console.error('Failed to load FinancialJuice widget script');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                Financial News Hub
              </h1>
              <p className="text-slate-400 text-lg mt-2">Real-time market news powered by FinancialJuice</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {modes.map((mode) => {
              const IconComponent = mode.icon;
              const isActive = selectedMode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`group relative px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? `bg-gradient-to-r ${mode.color} text-white shadow-xl` 
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 border border-slate-600/50 hover:border-slate-500/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-white rotate-12' : 'text-slate-400 group-hover:text-slate-300 group-hover:rotate-6'
                    }`} />
                    <span className="text-base">{mode.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-1 animate-pulse" />}
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Display Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              
              return (
                <div
                  key={category.id}
                  className={`px-6 py-3 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* News Widget Container */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50 backdrop-blur-sm">
          <div className="relative">
            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-800/30 to-transparent pointer-events-none z-10" />
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-slate-200 font-semibold text-xl">Loading Financial News...</p>
                  <div className="flex justify-center mt-4 gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* FinancialJuice Widget Container */}
            <div 
              id="financialjuice-news-widget-container"
              className={`w-full transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
              style={{ 
                minHeight: '800px',
                borderRadius: '1.5rem'
              }}
            />
          </div>
        </div>
        
        {/* Enhanced Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-emerald-400 text-3xl font-bold">24/7</div>
                <div className="text-slate-300 text-sm font-medium">Live Updates</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-blue-400 text-3xl font-bold">Global</div>
                <div className="text-slate-300 text-sm font-medium">Coverage</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-purple-400 text-3xl font-bold">Real-time</div>
                <div className="text-slate-300 text-sm font-medium">Analysis</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Financial news powered by <span className="font-semibold text-slate-300">FinancialJuice</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DukascopyNewsWidget;