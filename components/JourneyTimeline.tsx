import React, { useRef, useState, useEffect } from "react";
import { JourneyData, JourneyStage } from "../types";
import html2canvas from "html2canvas";
import { Download, Loader2, Plus, Trash2, Edit2, Check, X, AlertCircle, Star, Zap, MousePointer2, Lightbulb, Smartphone } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  XAxis,
} from "recharts";

interface JourneyTimelineProps {
  data: JourneyData;
  onUpdate?: (newData: JourneyData) => void;
}

// Helper to parse content into list items
const parseContent = (text: string | number): string[] => {
  if (typeof text !== 'string') return [String(text)];
  
  // Split by newlines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Clean up list markers (1., -, etc.) if they exist, but keep the text
  return lines.map(line => {
    return line.replace(/^(\d+\.|-|\*)\s*/, '').trim();
  });
};

// Component to render a single card item
const ItemCard: React.FC<{ text: string; type: string }> = ({ text, type }) => {
  // Parse bold syntax **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  let icon = null;
  let borderClass = "border-l-4 border-slate-300";
  let bgClass = "bg-white";
  let textClass = "text-slate-700";

  if (type === 'painPoints') {
    icon = <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />;
    borderClass = "border-l-4 border-red-400";
    bgClass = "bg-white";
  } else if (type === 'designOpportunities') {
    icon = <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="currentColor" />;
    borderClass = "border-l-4 border-amber-400";
    bgClass = "bg-white";
  } else if (type === 'technicalSupport') {
    icon = <Zap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
    borderClass = "border-l-4 border-blue-400";
    bgClass = "bg-white";
  } else if (type === 'userAction') {
    icon = <MousePointer2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />;
    borderClass = "border-l-4 border-indigo-400";
  } else if (type === 'touchpoints') {
    icon = <Smartphone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />;
    borderClass = "border-l-4 border-slate-400";
  }

  return (
    <div className={`p-3 rounded-r-lg shadow-sm border border-slate-100 ${bgClass} ${borderClass} flex gap-3 text-sm leading-relaxed mb-2 last:mb-0`}>
      {icon}
      <div className={textClass}>
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    </div>
  );
};

// ... (keep getEmojiForScore and CustomizedDot)

const getEmojiForScore = (score: number) => {
  if (score >= 9) return "🤩";
  if (score >= 7) return "🙂";
  if (score >= 5) return "😐";
  if (score >= 3) return "😰";
  return "😭";
};

const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  return (
    <foreignObject x={cx - 12} y={cy - 12} width={24} height={24}>
      <div className="flex items-center justify-center w-full h-full text-lg leading-none select-none">
        {getEmojiForScore(payload.emotion)}
      </div>
    </foreignObject>
  );
};

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ data, onUpdate }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editingCell, setEditingCell] = useState<{ stageIdx: number, key: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleExport = async () => {
    if (!timelineRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(timelineRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: "#0f172a", // Match slate-900
        windowWidth: timelineRef.current.scrollWidth,
        windowHeight: timelineRef.current.scrollHeight,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `BeautySexMap-${data.title.replace(/\s+/g, "-")}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Editing Handlers
  const startEditing = (stageIdx: number, key: string, currentValue: string) => {
    setEditingCell({ stageIdx, key });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingCell || !onUpdate) return;
    
    const newStages = [...data.stages];
    const { stageIdx, key } = editingCell;
    
    // Update the specific field
    (newStages[stageIdx] as any)[key] = editValue;
    
    onUpdate({ ...data, stages: newStages });
    setEditingCell(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // Stage Management Handlers
  const deleteStage = (idx: number) => {
    if (!onUpdate || data.stages.length <= 1) return;
    if (confirm("确定要删除这个阶段吗？")) {
      const newStages = data.stages.filter((_, i) => i !== idx);
      onUpdate({ ...data, stages: newStages });
    }
  };

  const addStage = () => {
    if (!onUpdate) return;
    const newStage: JourneyStage = {
      stageName: "新阶段",
      goal: "请输入目标",
      userAction: "1. 请输入用户行为",
      touchpoints: "接触点",
      thinking: "想法",
      feeling: "情绪",
      painPoints: "1. 痛点一",
      designOpportunities: "1. 机会点一",
      technicalSupport: "1. 技术支撑点一",
      emotionScore: 5
    };
    onUpdate({ ...data, stages: [...data.stages, newStage] });
  };


  // Chart data preparation with validation
  if (!data || !data.stages || !Array.isArray(data.stages)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-2">数据格式错误</p>
          <p className="text-sm text-slate-400">请重新生成旅程图</p>
        </div>
      </div>
    );
  }

  const chartData = data.stages.map((stage) => ({
    name: stage.stageName,
    emotion: stage.emotionScore,
    feeling: stage.feeling,
  }));

  // Define the rows we want to display in the matrix
  const ROW_HEADERS = [
    { key: "goal", label: "目标", editable: true },
    { key: "userAction", label: "行为", editable: true },
    { key: "thinking", label: "想法", editable: false },
    { key: "feeling", label: "情绪与连接", isChart: true },
    { key: "touchpoints", label: "接触点", editable: false },
    { key: "painPoints", label: "痛点", editable: false },
    { key: "designOpportunities", label: "机会点", editable: false },
    { key: "technicalSupport", label: "技术实现支撑点", editable: false },
  ];

  return (
    <div className="flex flex-col bg-slate-900 min-h-screen text-slate-200 font-sans">
      {/* Header / Title Area */}
      <div className="p-8 pb-4 border-b border-slate-700 bg-slate-800 shrink-0 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          MAP: {data.title}
        </h1>
        <div className="flex gap-3">
            {onUpdate && (
                <button
                onClick={addStage}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                <Plus className="w-4 h-4" />
                添加阶段
                </button>
            )}
            <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? "导出中..." : "导出图片"}
            </button>
        </div>
      </div>

      {/* Main Content Area: Unified Grid with Sticky Sidebar */}
      <div className="flex-1 overflow-x-auto overflow-y-auto" ref={timelineRef}>
        <div
          className="grid"
          style={{
            // Column 1: Fixed 240px (Sidebar - reduced width)
            // Columns 2...N: Min 260px, Max 320px (Stages - optimized width)
            gridTemplateColumns: `240px repeat(${data.stages.length}, minmax(260px, 320px))`,
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {/* --- TOP ROW: User Info & Phase Headers --- */}
          
          {/* Top-Left: User Persona */}
          <div className="sticky left-0 z-20 bg-slate-800 border-b border-r border-slate-700 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
            <h3 className="text-amber-500 font-bold text-lg mb-2">用户</h3>
            <div className="text-white font-medium text-lg mb-1">
              {data.personaName}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Phase Headers */}
          {data.stages.map((stage, idx) => (
            <div
              key={`header-${idx}`}
              className="bg-slate-700 border-b border-r border-slate-600 text-white font-bold flex items-center justify-between px-4 py-4 text-sm uppercase tracking-wide group relative"
            >
              <div className="flex flex-col gap-1 w-full">
                <span className="text-slate-400 text-xs">Stage {idx + 1}</span>
                {/* Editable Stage Name */}
                {editingCell?.stageIdx === idx && editingCell?.key === 'stageName' ? (
                    <div className="flex items-center gap-2">
                        <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-600 text-white px-2 py-1 rounded w-full outline-none border border-indigo-500"
                        />
                        <button onClick={saveEdit} className="text-green-400 hover:text-green-300"><Check size={16}/></button>
                        <button onClick={cancelEdit} className="text-red-400 hover:text-red-300"><X size={16}/></button>
                    </div>
                ) : (
                    <div 
                        className="cursor-pointer hover:text-indigo-300 transition-colors flex items-center gap-2"
                        onClick={() => onUpdate && startEditing(idx, 'stageName', stage.stageName)}
                    >
                        <span>{stage.stageName}</span>
                        <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                    </div>
                )}
              </div>
              
              {/* Delete Stage Button */}
              {onUpdate && data.stages.length > 1 && (
                  <button 
                    onClick={() => deleteStage(idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all absolute top-2 right-2"
                    title="删除此阶段"
                  >
                      <Trash2 size={14} />
                  </button>
              )}
            </div>
          ))}

          {/* --- DATA ROWS --- */}
          {ROW_HEADERS.map((row) => {
            // Special Case: Emotion Graph
            if (row.isChart) {
              return (
                <React.Fragment key={row.key}>
                  {/* Sidebar Header (Sticky) */}
                  <div className="sticky left-0 z-20 bg-slate-800 border-b border-r border-slate-700 px-6 py-8 flex items-center font-medium text-slate-300 shadow-[4px_0_24px_rgba(0,0,0,0.2)] h-64">
                    {row.label}
                  </div>
                  
                  {/* Chart Cell (Spans all stage columns) */}
                  <div
                    className="relative border-b border-slate-200 bg-white h-64"
                    style={{ gridColumn: `2 / -1` }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 30, right: 30, left: 30, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorEmotion"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis domain={[0, 12]} hide />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-600 z-50">
                                  <p className="font-bold mb-1 text-base">
                                    {getEmojiForScore(payload[0].value as number)} {payload[0].payload.name}
                                  </p>
                                  <p className="italic text-slate-300">
                                    "{payload[0].payload.feeling}"
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="emotion"
                          stroke="#6366f1"
                          strokeWidth={4}
                          fill="url(#colorEmotion)"
                          fillOpacity={0.15}
                          dot={<CustomizedDot />}
                          activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </React.Fragment>
              );
            }

            // Standard Rows
            return (
              <React.Fragment key={row.key}>
                {/* Sidebar Header (Sticky) */}
                <div className="sticky left-0 z-20 bg-slate-800 border-b border-r border-slate-700 px-6 py-6 flex items-center font-medium text-slate-300 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
                  {row.label}
                </div>

                {/* Data Cells */}
                {data.stages.map((stage, idx) => {
                  const content = (stage as any)[row.key];
                  const isThinking = row.key === "thinking";
                  const isPainPoint = row.key === "painPoints";
                  const isOpportunity = row.key === "designOpportunities";
                  const isTouchpoint = row.key === "touchpoints";
                  const isTechnical = row.key === "technicalSupport";
                  const isUserAction = row.key === "userAction";

                  let cellBg = "bg-white";
                  let textColor = "text-slate-700";

                  if (isThinking) {
                    cellBg = "bg-rose-50";
                    textColor = "text-rose-800 italic font-serif text-lg";
                  } else if (isPainPoint) {
                    cellBg = "bg-red-50";
                  } else if (isOpportunity) {
                    cellBg = "bg-amber-50"; // Changed to amber for opportunities (star)
                  } else if (isTouchpoint) {
                    cellBg = "bg-slate-50";
                  } else if (isTechnical) {
                    cellBg = "bg-blue-50";
                  }

                  const isEditing = editingCell?.stageIdx === idx && editingCell?.key === row.key;

                  return (
                    <div
                      key={`${row.key}-${idx}`}
                      className={`p-4 border-b border-r border-slate-200 text-sm leading-relaxed ${cellBg} ${textColor} group relative align-top`}
                      onClick={() => {
                          if (onUpdate && !isEditing && (row.editable || ['painPoints', 'designOpportunities', 'technicalSupport'].includes(row.key))) {
                              startEditing(idx, row.key, content);
                          }
                      }}
                    >
                      {isEditing ? (
                          <div className="flex flex-col gap-2 h-full z-10 relative" onClick={(e) => e.stopPropagation()}>
                              <textarea
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full h-full min-h-[120px] p-2 border border-indigo-500 rounded bg-white text-slate-900 outline-none resize-none shadow-lg"
                              />
                              <div className="flex justify-end gap-2">
                                  <button onClick={cancelEdit} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 text-gray-700">取消</button>
                                  <button onClick={saveEdit} className="px-2 py-1 text-xs bg-indigo-600 rounded hover:bg-indigo-700 text-white">保存</button>
                              </div>
                          </div>
                      ) : (
                        <>
                            {isThinking ? (
                                <div className="p-2">“{content}”</div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {parseContent(content).map((item, i) => (
                                        <ItemCard key={i} text={item} type={row.key} />
                                    ))}
                                </div>
                            )}
                            
                            {onUpdate && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity">
                                    <Edit2 className="w-3 h-3 text-slate-400" />
                                </div>
                            )}
                        </>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;
