import React from 'react';
import { 
  MapPin, 
  Users, 
  Clock, 
  Sparkles,
  Home,
  Briefcase,
  User,
  Heart,
  Globe,
  Sun,
  Moon,
  Coffee,
  Zap,
  Smile,
  Flame
} from 'lucide-react';
import { ContextVariables, LocationContext, SocialContext, TimeContext, MoodContext } from '../types';

interface VariablePanelProps {
  variables: ContextVariables;
  onChange: (key: keyof ContextVariables, value: string) => void;
  disabled: boolean;
}

const VariablePanel: React.FC<VariablePanelProps> = ({ variables, onChange, disabled }) => {
  
  const sections = [
    {
      key: 'location' as keyof ContextVariables,
      title: '环境场景',
      icon: <MapPin className="w-4 h-4" />,
      options: [
        { value: LocationContext.Bedroom, label: '卧室', icon: <Home className="w-3 h-3"/> },
        { value: LocationContext.Bathroom, label: '浴室/淋浴', icon: <div className="w-3 h-3 rounded-full border border-current" /> },
        { value: LocationContext.Travel, label: '旅行/酒店', icon: <Briefcase className="w-3 h-3"/> },
        { value: LocationContext.Public, label: '公共/远程', icon: <Globe className="w-3 h-3"/> },
      ]
    },
    {
      key: 'social' as keyof ContextVariables,
      title: '社交情境',
      icon: <Users className="w-4 h-4" />,
      options: [
        { value: SocialContext.Solo, label: '独处自娱', icon: <User className="w-3 h-3"/> },
        { value: SocialContext.Partnered, label: '伴侣互动', icon: <Heart className="w-3 h-3"/> },
        { value: SocialContext.LongDistance, label: '异地远程', icon: <Globe className="w-3 h-3"/> },
      ]
    },
    {
      key: 'time' as keyof ContextVariables,
      title: '时间/节奏',
      icon: <Clock className="w-4 h-4" />,
      options: [
        { value: TimeContext.Morning, label: '早晨匆忙', icon: <Coffee className="w-3 h-3"/> },
        { value: TimeContext.Evening, label: '晚间放松', icon: <Moon className="w-3 h-3"/> },
        { value: TimeContext.Weekend, label: '周末闲暇', icon: <Sun className="w-3 h-3"/> },
        { value: TimeContext.LateNight, label: '深夜', icon: <Sparkles className="w-3 h-3"/> },
      ]
    },
    {
      key: 'mood' as keyof ContextVariables,
      title: '情绪目标',
      icon: <Sparkles className="w-4 h-4" />,
      options: [
        { value: MoodContext.Relaxing, label: '放松治愈', icon: <Smile className="w-3 h-3"/> },
        { value: MoodContext.Adventurous, label: '探索冒险', icon: <Zap className="w-3 h-3"/> },
        { value: MoodContext.Intense, label: '激情强烈', icon: <Flame className="w-3 h-3"/> },
        { value: MoodContext.Playful, label: '趣味调皮', icon: <Smile className="w-3 h-3"/> },
      ]
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 min-w-max">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            场景变量
          </div>

          <div className="flex flex-wrap gap-4 flex-1 w-full lg:justify-end">
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-1.5 min-w-[140px] flex-1 lg:flex-none">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  {section.icon}
                  {section.title}
                </div>
                <div className="relative group">
                  <select
                    disabled={disabled}
                    value={variables[section.key]}
                    onChange={(e) => onChange(section.key, e.target.value)}
                    className="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-8 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {section.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariablePanel;