import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, Languages, Mic } from 'lucide-react';
import { Slider } from './ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface VideoPlayerProps {
  title: string;
  category: string;
}

interface Subtitle {
  time: number;
  text: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

// Mock subtitle data for different timestamps
const SUBTITLE_TEMPLATES: Record<string, Subtitle[]> = {
  en: [
    { time: 0, text: 'Welcome to this lesson on ' },
    { time: 3, text: 'Today we will explore the fundamentals' },
    { time: 6, text: 'This technique has been used for centuries' },
    { time: 9, text: 'Let\'s start with the basic materials' },
    { time: 12, text: 'Pay close attention to the details' },
    { time: 15, text: 'Practice makes perfect in this craft' },
  ],
  es: [
    { time: 0, text: 'Bienvenido a esta lección sobre ' },
    { time: 3, text: 'Hoy exploraremos los fundamentos' },
    { time: 6, text: 'Esta técnica se ha utilizado durante siglos' },
    { time: 9, text: 'Comencemos con los materiales básicos' },
    { time: 12, text: 'Presta mucha atención a los detalles' },
    { time: 15, text: 'La práctica hace al maestro en este oficio' },
  ],
  fr: [
    { time: 0, text: 'Bienvenue à cette leçon sur ' },
    { time: 3, text: 'Aujourd\'hui nous explorerons les fondamentaux' },
    { time: 6, text: 'Cette technique est utilisée depuis des siècles' },
    { time: 9, text: 'Commençons par les matériaux de base' },
    { time: 12, text: 'Faites attention aux détails' },
    { time: 15, text: 'La pratique rend parfait dans cet artisanat' },
  ],
  de: [
    { time: 0, text: 'Willkommen zu dieser Lektion über ' },
    { time: 3, text: 'Heute werden wir die Grundlagen erkunden' },
    { time: 6, text: 'Diese Technik wird seit Jahrhunderten verwendet' },
    { time: 9, text: 'Beginnen wir mit den grundlegenden Materialien' },
    { time: 12, text: 'Achten Sie genau auf die Details' },
    { time: 15, text: 'Übung macht den Meister in diesem Handwerk' },
  ],
  it: [
    { time: 0, text: 'Benvenuto a questa lezione su ' },
    { time: 3, text: 'Oggi esploreremo i fondamenti' },
    { time: 6, text: 'Questa tecnica è stata usata per secoli' },
    { time: 9, text: 'Iniziamo con i materiali di base' },
    { time: 12, text: 'Presta molta attenzione ai dettagli' },
    { time: 15, text: 'La pratica rende perfetti in questo mestiere' },
  ],
  pt: [
    { time: 0, text: 'Bem-vindo a esta lição sobre ' },
    { time: 3, text: 'Hoje vamos explorar os fundamentos' },
    { time: 6, text: 'Esta técnica tem sido usada há séculos' },
    { time: 9, text: 'Vamos começar com os materiais básicos' },
    { time: 12, text: 'Preste muita atenção aos detalhes' },
    { time: 15, text: 'A prática leva à perfeição neste artesanato' },
  ],
  hi: [
    { time: 0, text: 'इस पाठ में आपका स्वागत है ' },
    { time: 3, text: 'आज हम मूल बातें जानेंगे' },
    { time: 6, text: 'यह तकनीक सदियों से उपयोग की जाती रही है' },
    { time: 9, text: 'आइए बुनियादी सामग्री से शुरू करें' },
    { time: 12, text: 'विवरणों पर पूरा ध्यान दें' },
    { time: 15, text: 'अभ्यास से ही इस शिल्प में महारत हासिल होती है' },
  ],
  zh: [
    { time: 0, text: '欢迎来到本课程 ' },
    { time: 3, text: '今天我们将探索基础知识' },
    { time: 6, text: '这项技术已经使用了几个世纪' },
    { time: 9, text: '让我们从基本材料开始' },
    { time: 12, text: '请密切注意细节' },
    { time: 15, text: '熟能生巧' },
  ],
  ja: [
    { time: 0, text: 'このレッスンへようこそ ' },
    { time: 3, text: '今日は基礎を学びます' },
    { time: 6, text: 'この技術は何世紀も使われてきました' },
    { time: 9, text: '基本的な材料から始めましょう' },
    { time: 12, text: '細部に注意を払ってください' },
    { time: 15, text: '練習が完璧を作ります' },
  ],
  ko: [
    { time: 0, text: '이 수업에 오신 것을 환영합니다 ' },
    { time: 3, text: '오늘 우리는 기초를 배울 것입니다' },
    { time: 6, text: '이 기술은 수세기 동안 사용되어 왔습니다' },
    { time: 9, text: '기본 재료부터 시작합시다' },
    { time: 12, text: '세부 사항에 주의를 기울이십시오' },
    { time: 15, text: '연습이 완벽을 만듭니다' },
  ],
  ar: [
    { time: 0, text: 'مرحبا بك في هذا الدرس عن ' },
    { time: 3, text: 'اليوم سوف نستكشف الأساسيات' },
    { time: 6, text: 'تم استخدام هذه التقنية لعدة قرون' },
    { time: 9, text: 'لنبدأ بالمواد الأساسية' },
    { time: 12, text: 'انتبه جيدا للتفاصيل' },
    { time: 15, text: 'الممارسة تصنع الكمال في هذه الحرفة' },
  ],
  ru: [
    { time: 0, text: 'Добро пожаловать на этот урок о ' },
    { time: 3, text: 'Сегодня мы изучим основы' },
    { time: 6, text: 'Эта техника используется веками' },
    { time: 9, text: 'Начнем с основных материалов' },
    { time: 12, text: 'Обратите внимание на детали' },
    { time: 15, text: 'Практика делает совершенным в этом ремесле' },
  ],
};

export function VideoPlayer({ title, category }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(AVAILABLE_LANGUAGES[0]);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [audioDubbingEnabled, setAudioDubbingEnabled] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [playbackInterval, setPlaybackInterval] = useState<NodeJS.Timeout | null>(null);

  const currentTime = Math.floor((progress / 100) * 930); // 15:30 = 930 seconds
  const duration = 930;

  // Update subtitle based on current time
  useEffect(() => {
    if (subtitlesEnabled && isPlaying) {
      const subtitles = SUBTITLE_TEMPLATES[selectedLanguage.code] || SUBTITLE_TEMPLATES['en'];
      const currentSub = subtitles.find((sub, index) => {
        const nextSub = subtitles[index + 1];
        return currentTime >= sub.time && (!nextSub || currentTime < nextSub.time);
      });
      
      if (currentSub) {
        setCurrentSubtitle(currentSub.text + category);
      }
    } else {
      setCurrentSubtitle('');
    }
  }, [currentTime, subtitlesEnabled, selectedLanguage, isPlaying, category]);

  // Simulate video playback
  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.2; // Slower progress for more subtitle time
        });
      }, 100);
      setPlaybackInterval(interval);
    } else {
      setIsPlaying(false);
      if (playbackInterval) {
        clearInterval(playbackInterval);
      }
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (playbackInterval) {
        clearInterval(playbackInterval);
      }
    };
  }, [playbackInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    // Show notification that language changed
    if (audioDubbingEnabled) {
      // In a real app, this would switch the audio track
      console.log(`Audio dubbing switched to ${language.name}`);
    }
  };

  return (
    <div className="aspect-video overflow-hidden bg-black relative group">
      {/* Fake Video Content */}
      <div className="w-full h-full relative">
        {/* Video Background - Simulated video frames */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/40 to-yellow-900/30">
          {/* Simulated workshop scene with animated elements */}
          <div className="absolute inset-0 opacity-40">
            {/* Artisan's hands working animation simulation */}
            <div 
              className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-amber-600/60 to-orange-700/60 rounded-full blur-2xl"
              style={{
                animation: isPlaying ? 'float 3s ease-in-out infinite' : 'none'
              }}
            />
            <div 
              className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-gradient-to-br from-yellow-600/50 to-amber-700/50 rounded-full blur-3xl"
              style={{
                animation: isPlaying ? 'float 4s ease-in-out infinite 1s' : 'none'
              }}
            />
            {/* Craft materials simulation */}
            <div 
              className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-600/40 to-red-700/40 rounded-full blur-2xl"
              style={{
                animation: isPlaying ? 'float 3.5s ease-in-out infinite 0.5s' : 'none'
              }}
            />
          </div>

          {/* Texture overlay for realistic look */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E")',
          }} />
        </div>

        {/* Play/Pause Overlay */}
        {!isPlaying && progress === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="text-center space-y-6 px-8 z-10">
              <div 
                className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary/30 cursor-pointer hover:bg-primary/30 hover:scale-110 transition-all"
                onClick={handlePlayPause}
              >
                <Play className="h-12 w-12 text-primary ml-2" />
              </div>
              <div className="text-white">
                <h3 className="text-2xl mb-2">{title}</h3>
                <p className="text-sm text-gray-300">Sample Lesson: Introduction to {category}</p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <div className="flex items-center space-x-1 text-xs text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>HD Quality</span>
                  </div>
                  <div className="text-xs text-gray-300">•</div>
                  <div className="text-xs text-gray-300">15:30</div>
                  <div className="text-xs text-gray-300">•</div>
                  <div className="flex items-center space-x-1 text-xs text-gray-300">
                    <Languages className="h-3 w-3" />
                    <span>{AVAILABLE_LANGUAGES.length} Languages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Playing State - Show animated workshop scene */}
        {isPlaying && (
          <>
            {/* Artisan demonstration text overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="text-white/90 text-2xl drop-shadow-lg px-8 py-4 bg-black/20 backdrop-blur-sm rounded-lg">
                  🎨 Artisan Demonstrating {category} Techniques
                </div>
                {audioDubbingEnabled && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-300 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Mic className="h-4 w-4" />
                    <span>AI Audio: {selectedLanguage.name}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Paused state (after playing started) */}
        {!isPlaying && progress > 0 && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition-colors"
            onClick={handlePlayPause}
          >
            <div className="w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary/40 hover:scale-110 transition-transform">
              <Play className="h-12 w-12 text-white ml-2" />
            </div>
          </div>
        )}

        {/* Subtitles Display */}
        {currentSubtitle && subtitlesEnabled && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center px-8 z-20">
            <div className="bg-black/80 px-4 py-2 rounded-lg max-w-3xl">
              <p className="text-white text-center text-lg">
                {currentSubtitle}
              </p>
            </div>
          </div>
        )}

        {/* Language Badge Indicator */}
        {(subtitlesEnabled || audioDubbingEnabled) && (
          <div className="absolute top-4 right-4 z-20">
            <Badge variant="secondary" className="bg-black/70 text-white border-white/20">
              {selectedLanguage.flag} {selectedLanguage.name}
              {audioDubbingEnabled && <Mic className="h-3 w-3 ml-1 inline" />}
            </Badge>
          </div>
        )}
      </div>

      {/* Video Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[progress]}
            onValueChange={(value) => setProgress(value[0])}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    if (value[0] > 0) setIsMuted(false);
                  }}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <span className="text-sm ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language & Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Video Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Language Selection */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Languages className="mr-2 h-4 w-4" />
                    <span>Language ({selectedLanguage.flag} {selectedLanguage.name})</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Select Language
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={selectedLanguage.code === lang.code ? 'bg-accent' : ''}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {selectedLanguage.code === lang.code && (
                          <span className="ml-auto text-xs">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                {/* Subtitles Toggle */}
                <DropdownMenuItem onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}>
                  <Languages className="mr-2 h-4 w-4" />
                  <span>Subtitles</span>
                  <span className="ml-auto text-xs">
                    {subtitlesEnabled ? 'ON' : 'OFF'}
                  </span>
                </DropdownMenuItem>

                {/* Audio Dubbing Toggle */}
                <DropdownMenuItem onClick={() => setAudioDubbingEnabled(!audioDubbingEnabled)}>
                  <Mic className="mr-2 h-4 w-4" />
                  <span>Audio Dubbing</span>
                  <span className="ml-auto text-xs">
                    {audioDubbingEnabled ? 'ON' : 'OFF'}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {audioDubbingEnabled && (
                    <p className="flex items-center space-x-1">
                      <Mic className="h-3 w-3" />
                      <span>AI-generated audio in {selectedLanguage.name}</span>
                    </p>
                  )}
                  {!audioDubbingEnabled && (
                    <p>Enable audio dubbing for translated voice</p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
