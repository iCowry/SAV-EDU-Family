import { Quadrant } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Mission Control', icon: 'LayoutDashboard' },
  { id: Quadrant.COGNITIVE, label: 'Deep Learning', icon: 'BrainCircuit' },
  { id: Quadrant.PHYSICAL, label: 'Health & Sport', icon: 'Activity' },
  { id: Quadrant.BIOLOGICAL, label: 'Bio-Metabolism', icon: 'Utensils' },
  { id: Quadrant.RELATIONAL, label: 'Harmony Guardian', icon: 'HeartHandshake' },
];

export const MOCK_WEEKLY_DATA = [
  { name: 'Mon', focus: 85, fatigue: 20, harmony: 90 },
  { name: 'Tue', focus: 75, fatigue: 30, harmony: 85 },
  { name: 'Wed', focus: 90, fatigue: 25, harmony: 95 },
  { name: 'Thu', focus: 60, fatigue: 50, harmony: 70 },
  { name: 'Fri', focus: 80, fatigue: 40, harmony: 88 },
  { name: 'Sat', focus: 95, fatigue: 10, harmony: 98 },
  { name: 'Sun', focus: 88, fatigue: 15, harmony: 92 },
];

export const RADAR_DATA = [
  { subject: 'Logic', A: 120, fullMark: 150 },
  { subject: 'Memory', A: 98, fullMark: 150 },
  { subject: 'Creativity', A: 86, fullMark: 150 },
  { subject: 'Focus', A: 99, fullMark: 150 },
  { subject: 'Endurance', A: 85, fullMark: 150 },
  { subject: 'Mood', A: 65, fullMark: 150 },
];
