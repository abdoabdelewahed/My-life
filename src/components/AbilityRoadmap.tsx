
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Circle, Lock, Play, X, ClipboardCheck } from 'lucide-react';
import * as Lucide from 'lucide-react';
import { AbilityRoadmap as RoadmapType, RoadmapNode } from '../data/roadmapData';
import { playPop } from '../utils/sounds';

interface AbilityRoadmapProps {
  roadmap: RoadmapType;
  onClose: () => void;
  onViewResult?: (abilityId: string) => void;
  onViewLesson?: (node: RoadmapNode) => void;
  onStartAssessment?: (abilityId: string) => void;
  score?: number;
}

const AbilityRoadmap: React.FC<AbilityRoadmapProps> = ({ roadmap, onClose, onViewResult, onViewLesson, onStartAssessment, score }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const renderIcon = (node: RoadmapNode, className: string, isCompleted: boolean = false) => {
    if (node.id.includes('final') && isCompleted) {
      return <Lucide.RotateCcw className={className} />;
    }
    if (isCompleted && node.iconName !== 'Trophy') {
      return <Lucide.Check className={className} />;
    }
    const IconComponent = (Lucide as any)[node.iconName] || Lucide.Brain;
    return <IconComponent className={className} />;
  };

  const allNodes = score != null ? [
    [{
      id: 'result_node',
      title: `النتيجة: ${score}%`,
      description: 'نتيجة التقييم',
      iconName: 'Trophy',
      status: 'completed',
      progress: '',
      type: 'diamond',
      tasks: []
    } as RoadmapNode],
    ...roadmap.nodes
  ] : roadmap.nodes;

  const handleNodeClick = (node: RoadmapNode) => {
    if (node.status === 'locked') return;
    playPop();

    if (node.id === 'result_node') {
      if (onViewResult) onViewResult(roadmap.abilityId);
      return;
    }

    if (node.id.includes('final')) {
      if (node.status === 'completed' && onViewResult) {
        onViewResult(roadmap.abilityId);
      } else if (onStartAssessment) {
        onStartAssessment(roadmap.abilityId);
      }
      return;
    }

    if (onViewLesson) {
      onViewLesson(node);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[200] bg-[#0a0a0a] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              playPop();
              onClose();
            }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">{roadmap.title}</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-purple-400">مسار القوة</span>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="flex-1 overflow-y-auto p-8 pb-32 relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} 
        />

        <div className="max-w-2xl mx-auto space-y-24 relative">
          {allNodes.map((row, rowIndex) => (
            <div key={rowIndex} className="relative flex justify-center items-center gap-12 md:gap-24">
              {row.map((node) => (
                <div key={node.id} className="flex flex-col items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleNodeClick(node)}
                    className="relative group outline-none"
                  >
                    {/* Active Glow */}
                    {node.status === 'unlocked' && (
                      <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full -z-10 animate-pulse" />
                    )}

                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      {/* Bottom Layer (Shadow) */}
                      <div className={`absolute inset-0 rounded-full ${
                        node.status === 'completed' ? 'bg-green-700' :
                        node.status === 'unlocked' ? 'bg-orange-700' :
                        'bg-[#1a1a1a]'
                      }`} />
                      
                      {/* Top Layer */}
                      <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-transform duration-150 -translate-y-[6px] group-active:-translate-y-[2px] ${
                        node.status === 'completed' ? 'bg-green-500' :
                        node.status === 'unlocked' ? 'bg-orange-500' :
                        'bg-[#2a2a2a]'
                      }`}>
                        {renderIcon(node, `w-7 h-7 md:w-9 md:h-9 ${node.status === 'completed' || node.status === 'unlocked' ? 'text-white' : 'text-gray-500'}`, node.status === 'completed')}
                        
                        {/* Lock Badge */}
                        {node.status === 'locked' && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2a2a2a] border border-white/10 rounded-full flex items-center justify-center shadow-lg">
                            <Lock className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>

                  {/* Node Title */}
                  <span className="text-xs md:text-sm font-bold text-white tracking-tight text-center max-w-[120px] leading-tight mt-2">
                    {node.title}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AbilityRoadmap;
