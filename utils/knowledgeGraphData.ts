
import { Grade, Subject, KnowledgePoint } from '../types';

// Helper to generate a random score-ish knowledge point
const kp = (topic: string, subTopic: string, score: number, daysAgo: number = 2): KnowledgePoint => ({
  topic,
  subTopic,
  masteryScore: score,
  lastReviewed: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  decayRate: 0.1,
  status: score < 60 ? 'critical' : score < 85 ? 'review' : 'mastered'
});

// Helper to fill subjects with random data if not explicitly defined
const generateGenericData = (grade: number, subject: string): KnowledgePoint[] => {
  const topics = ['Core Concepts', 'Advanced Application', 'Problem Solving'];
  const nodes = ['Concept A', 'Concept B', 'Concept C', 'Concept D'];
  return nodes.map((n, i) => kp(topics[i % 3], `${n} - ${subject} L${grade}`, 60 + Math.floor(Math.random() * 35), i));
};

const defineGradeData = (gradeData: Partial<Record<Subject, KnowledgePoint[]>>) => gradeData;

export const KNOWLEDGE_GRAPH: Record<Grade, Partial<Record<Subject, KnowledgePoint[]>>> = {
  // === PRIMARY SCHOOL (1-6) ===
  'Grade 1': defineGradeData({
    'Chinese': [kp('Pinyin', 'Initials & Finals', 95), kp('Characters', 'Basic Strokes', 88), kp('Reading', 'Short Sentences', 92)],
    'Math': [kp('Arithmetic', 'Addition (0-20)', 90), kp('Arithmetic', 'Subtraction (0-20)', 85), kp('Geometry', 'Basic Shapes', 95)],
  }),
  'Grade 2': defineGradeData({
    'Chinese': [kp('Characters', 'Radicals', 85), kp('Reading', 'Paragraph Comprehension', 80)],
    'Math': [kp('Arithmetic', 'Multiplication Table', 75), kp('Arithmetic', 'Mixed Operations', 82)],
  }),
  'Grade 3': defineGradeData({
    'Chinese': [kp('Writing', 'Short Diary', 80), kp('Poetry', 'Ancient Poems', 85)],
    'Math': [kp('Arithmetic', 'Division', 70), kp('Geometry', 'Perimeter', 75)],
    'English': [kp('Vocabulary', 'Colors & Animals', 90), kp('Speaking', 'Greetings', 95)],
    'Science': [kp('Nature', 'Plants', 88), kp('Physics', 'Magnets', 85)],
  }),
  'Grade 4': defineGradeData({
    'Math': [kp('Arithmetic', 'Large Numbers', 85), kp('Geometry', 'Angles', 80)],
    'English': [kp('Grammar', 'Present Simple', 75)],
    'Science': [kp('Physics', 'Circuits', 80)],
  }),
  'Grade 5': defineGradeData({
    'Math': [kp('Arithmetic', 'Decimals', 78), kp('Geometry', 'Volume of Cubes', 82)],
    'Chinese': [kp('Reading', 'Classical Stories', 85)],
  }),
  'Grade 6': defineGradeData({
    'Math': [kp('Arithmetic', 'Fractions & Percentages', 70), kp('Algebra', 'Simple Equations', 75)],
    'English': [kp('Grammar', 'Past Tense', 65)],
  }),

  // === JUNIOR HIGH (7-9) ===
  'Grade 7': defineGradeData({
    'Math': [
      kp('Number Theory', 'Rational Numbers', 95),
      kp('Algebra', 'Linear Equations', 75),
      kp('Geometry', 'Intersecting Lines', 85),
    ],
    'English': [kp('Grammar', 'Present Continuous', 85), kp('Reading', 'Main Idea Extraction', 70)],
    'Chinese': [kp('Classical', 'Tang Poems', 92), kp('Modern', 'Narrative Writing', 80)],
    'Biology': [kp('Cell Biology', 'Cell Structure', 78), kp('Botany', 'Photosynthesis', 65)],
    'History': [kp('Ancient China', 'Qin & Han Dynasties', 88)],
    'Geography': [kp('Earth Science', 'Longitude & Latitude', 60)],
    'Politics': [kp('Ethics', 'Respect & Etiquette', 95), kp('Law', 'Basic Rights', 88)],
  }),
  'Grade 8': defineGradeData({
    'Math': [
      kp('Algebra', 'Linear Functions', 65),
      kp('Geometry', 'Pythagorean Theorem', 95),
      kp('Geometry', 'Congruence', 92),
    ],
    'Physics': [
      kp('Mechanics', 'Force and Gravity', 85),
      kp('Optics', 'Reflection of Light', 88),
      kp('Acoustics', 'Sound Production', 95),
    ],
    'English': [kp('Grammar', 'Comparatives', 88), kp('Vocabulary', 'Travel', 90)],
    'Biology': [kp('Genetics', 'Inheritance Basics', 55)],
    'History': [kp('Modern History', 'Opium Wars', 82)],
    'Geography': [kp('China Geography', 'Topography', 85)],
    'Politics': [kp('Law', 'Constitution Basics', 80)],
  }),
  'Grade 9': defineGradeData({
    'Math': [
      kp('Algebra', 'Quadratic Equations', 60),
      kp('Geometry', 'Circles', 55),
      kp('Probability', 'Random Events', 90),
    ],
    'Physics': [
      kp('Electromagnetism', 'Ohm\'s Law', 70),
      kp('Energy', 'Work and Power', 75),
    ],
    'Chemistry': [
      kp('Matter', 'Periodic Table', 85),
      kp('Reactions', 'Oxidation', 75),
      kp('Substances', 'Acids and Bases', 50),
    ],
    'English': [kp('Grammar', 'Passive Voice', 75)],
    'History': [kp('World History', 'Industrial Revolution', 85)],
    'Politics': [kp('Society', 'Social Responsibility', 88)],
  }),

  // === SENIOR HIGH (10-12) ===
  'Grade 10': defineGradeData({
    'Math': [kp('Functions', 'Sets & Functions', 80), kp('Functions', 'Exponential/Logarithmic', 70)],
    'Physics': [kp('Mechanics', 'Kinematics', 75), kp('Mechanics', 'Newton\'s Laws', 82)],
    'Chemistry': [kp('Structure', 'Atomic Structure', 85), kp('Reactions', 'Ionic Reactions', 78)],
    'English': [kp('Reading', 'Academic Articles', 65), kp('Grammar', 'Non-finite Verbs', 60)],
    'Politics': [kp('Economics', 'Market Economy', 85)],
  }),
  'Grade 11': defineGradeData({
    'Math': [kp('Geometry', 'Solid Geometry', 65), kp('Probability', 'Statistics', 80)],
    'Physics': [kp('Electromagnetism', 'Magnetic Fields', 70)],
    'Chemistry': [kp('Organic', 'Hydrocarbons', 72)],
    'Biology': [kp('Genetics', 'DNA Replication', 75)],
    'History': [kp('World History', 'Cold War', 88)],
  }),
  'Grade 12': defineGradeData({
    'Math': [kp('Calculus', 'Derivatives', 60), kp('Review', 'Comprehensive Analysis', 85)],
    'Physics': [kp('Modern Physics', 'Quantum Basics', 65), kp('Review', 'Mechanics Advanced', 80)],
    'Chemistry': [kp('Review', 'Experimental Design', 70)],
    'English': [kp('Writing', 'Advanced Composition', 75)],
    'Chinese': [kp('Writing', 'Argumentative Essays', 82)],
  }),
};
