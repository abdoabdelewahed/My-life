import React from 'react';
import { ImprovementPhase } from './ImprovementPhase';

interface RoutinePageProps {
  onActivityComplete?: (xp: number) => void;
}

export default function RoutinePage({ onActivityComplete }: RoutinePageProps) {
  return (
    <div className="pb-24 pt-4 md:pt-8 px-2 md:px-4">
      <div className="max-w-4xl mx-auto">
        <ImprovementPhase onActivityComplete={onActivityComplete} />
      </div>
    </div>
  );
}
