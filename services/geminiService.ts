
import { GoogleGenAI, Type } from "@google/genai";
import { LogicAnalysisResult, MealPlan, AcademicAnalysis, EmotionalWeather, GrowthData, SportsAdvice, ParentingScript, ChildSystemContext, ArtAnalysis, QualityEducationCategory, QualityEduAnalysis, MusicReport, BoardAnalysis, CodeDebugHint, WeeklyReportData, WeeklyAIInsight } from "../types";

// Initialize Gemini
// Note: In a production app, handle missing API key more gracefully.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-3-flash-preview';
const VISION_MODEL_NAME = 'gemini-2.5-flash-image'; // Use a model capable of image analysis

export const GeminiService = {
  /**
   * Cognitive Layer: Analyzes the student's answer/notes not for correctness, but for logical flow.
   */
  async analyzeLogic(problem: string, studentInput: string, language: string = 'en'): Promise<LogicAnalysisResult> {
    if (!process.env.API_KEY) {
      return {
        score: 0,
        summary: "API Key missing.",
        weakness: "N/A",
        suggestion: "Please configure your API key."
      };
    }

    try {
      const prompt = `
        Role: Senior Academic Logic Coach for SAV Edu.
        Task: Analyze the following student attempt at a problem. 
        Philosophy: Do not focus solely on the final answer correctness. Focus on the *Logical Chain*, *Concept Penetration*, and *Reasoning Structure*.
        
        Problem: "${problem}"
        Student Input: "${studentInput}"
        Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}

        Output JSON format with:
        - logicScore (0-100 integer)
        - analysisSummary (Brief supportive summary of their thinking process)
        - detectedWeakness (One specific logical gap or conceptual misunderstanding)
        - growthSuggestion (A Socratic question to guide them to the next level)
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              logicScore: { type: Type.INTEGER },
              analysisSummary: { type: Type.STRING },
              detectedWeakness: { type: Type.STRING },
              growthSuggestion: { type: Type.STRING },
            }
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        score: data.logicScore || 0,
        summary: data.analysisSummary || "Could not analyze.",
        weakness: data.detectedWeakness || "None detected.",
        suggestion: data.growthSuggestion || "Keep going!"
      };

    } catch (error) {
      console.error("Gemini Logic Analysis Error:", error);
      return {
        score: 0,
        summary: "Analysis failed due to network or key error.",
        weakness: "System error",
        suggestion: "Try again later."
      };
    }
  },

  /**
   * Cognitive Layer: Image Analysis (OCR + Knowledge Graph Mapping)
   */
  async analyzeHomeworkImage(base64Image: string, language: string = 'en'): Promise<AcademicAnalysis> {
    if (!process.env.API_KEY) {
      throw new Error("API Key missing");
    }

    try {
      // Prompt logic mimics the "DeepSeek" process described:
      // 1. OCR -> 2. Knowledge Graph Alignment -> 3. Error Attribution -> 4. Mastery Scoring
      const prompt = `
        Role: SAV Edu Academic Engine.
        Task: Analyze this image of a student's homework/exam.
        Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
        
        Process:
        1. OCR: Extract the text from the image.
        2. Subject Identification: Identify if this is Math, Physics, Chemistry, or English.
        3. Knowledge Graph Alignment: Map the problem to specific hierarchical topics (e.g., Geometry -> Triangles).
        4. Error Attribution: If there is an error, classify it as:
           - "Foundational" (Concept not understood)
           - "Misinterpretation" (Read the question wrong)
           - "Careless" (Calculation error)
           - "None" (Correct)
        5. Mastery: Estimate the mastery score (0-100) for the identified topics based on this performance.

        Output JSON format.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME, // Using 3-flash for text/image reasoning if capable, or fallback to vision model logic
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: prompt }
          ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    subject: { type: Type.STRING, enum: ['Math', 'Physics', 'Chemistry', 'English'] },
                    ocrText: { type: Type.STRING },
                    errorType: { type: Type.STRING, enum: ['Foundational', 'Misinterpretation', 'Careless', 'None'] },
                    errorExplanation: { type: Type.STRING },
                    topics: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                topic: { type: Type.STRING },
                                subTopic: { type: Type.STRING },
                                masteryScore: { type: Type.INTEGER }
                            }
                        }
                    }
                }
            }
        }
      });

      const data = JSON.parse(response.text || '{}');
      
      return {
        subject: data.subject || 'Math',
        ocrText: data.ocrText || 'No text detected',
        errorAttribution: {
          type: data.errorType || 'None',
          explanation: data.errorExplanation || 'Analysis complete.'
        },
        knowledgeMapping: (data.topics || []).map((t: any) => ({
          topic: t.topic,
          subTopic: t.subTopic,
          masteryScore: t.masteryScore,
          lastReviewed: new Date().toISOString(),
          decayRate: 0.1, // Initial decay rate
          status: t.masteryScore < 60 ? 'critical' : t.masteryScore < 85 ? 'review' : 'mastered'
        }))
      };

    } catch (error) {
      console.error("Gemini Image Analysis Error:", error);
      // Return mock data on failure to prevent app crash during demo
      return {
        subject: 'Math',
        ocrText: "Error processing image. Using simulation data.",
        errorAttribution: {
            type: 'Foundational',
            explanation: 'Failed to connect to Neural Core.'
        },
        knowledgeMapping: []
      };
    }
  },

  /**
   * Biological Layer: Generates a meal plan based on activity data.
   */
  async generateMetabolicPlan(studyDurationMinutes: number, sportType: string, language: string = 'en'): Promise<MealPlan> {
    if (!process.env.API_KEY) {
      return {
        calories: 0,
        macros: { protein: 0, carbs: 0, fats: 0 },
        recommendation: "API Key missing."
      };
    }

    try {
      const prompt = `
        Role: Sports Nutritionist for SAV Edu.
        Task: Create a post-session meal recommendation.
        Context: The student studied for ${studyDurationMinutes} minutes (brain glucose consumption) and performed ${sportType} (muscle recovery).
        Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
        
        Output JSON:
        - recommendedCalories (integer)
        - proteinGrams (integer)
        - carbsGrams (integer)
        - fatsGrams (integer)
        - mealSuggestion (A specific, appetizing dish description optimized for brain + body recovery)
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recommendedCalories: { type: Type.INTEGER },
                    proteinGrams: { type: Type.INTEGER },
                    carbsGrams: { type: Type.INTEGER },
                    fatsGrams: { type: Type.INTEGER },
                    mealSuggestion: { type: Type.STRING },
                }
            }
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        calories: data.recommendedCalories || 500,
        macros: {
          protein: data.proteinGrams || 20,
          carbs: data.carbsGrams || 60,
          fats: data.fatsGrams || 15
        },
        recommendation: data.mealSuggestion || "Balanced meal with lean protein and complex carbs."
      };

    } catch (error) {
      console.error("Gemini Nutrition Error:", error);
      return {
        calories: 0,
        macros: { protein: 0, carbs: 0, fats: 0 },
        recommendation: "System error."
      };
    }
  },

  /**
   * Relational Layer: Mediates parent communication.
   */
  async mediateParentCommunication(parentInput: string, language: string = 'en'): Promise<string> {
    if (!process.env.API_KEY) return "Please configure API Key to enable AI Mediation.";

    try {
      const prompt = `
        Role: Family Harmony Mediator (AI Buffer).
        Task: Transform the parent's raw, potentially anxious or frustrated input into a constructive, collaborative message for the child.
        Philosophy: Move from "Control/Scolding" to "Collaboration/Support".
        
        Parent Input: "${parentInput}"
        Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
        
        Output only the transformed message text. Keep it concise, warm, but firm on standards if necessary.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      return response.text || "I couldn't process that message. Maybe try taking a deep breath first?";
    } catch (error) {
      console.error("Gemini Mediation Error:", error);
      return "Service unavailable.";
    }
  },

  /**
   * Relational Layer: Generate Step-by-Step Parenting Scripts
   */
  async generateParentingScripts(scenario: string, emotion: EmotionalWeather, systemContext: ChildSystemContext, language: string = 'en'): Promise<ParentingScript> {
      if (!process.env.API_KEY) {
          return {
              analysis: "System analysis unavailable (API Key missing).",
              step1: "API Key missing.",
              step2: "Cannot generate script.",
              step3: "Please check configuration."
          };
      }

      try {
          const prompt = `
            Role: Expert Child Psychologist & Data Analyst for SAV Edu.
            Task: Generate a 3-step script for a parent AND a brief quantitative analysis of why the child might be acting this way based on system data.
            
            Current Scenario Input: "${scenario}"
            
            Real-time Emotional State:
            - Stress Level: ${emotion.stressIndex}/100
            - Expression: ${emotion.detectedExpression}
            
            System Quantitative Context (Last 7 Days):
            - Academic Trend: ${systemContext.recentExamTrend}
            - Homework Completion: ${systemContext.homeworkCompletionRate}%
            - Avg Sleep: ${systemContext.averageSleepDuration} hours
            - Chronic Stress Level: ${systemContext.recentStressLevel}
            - Physical Activity: ${systemContext.physicalActivityLevel}
            
            Philosophy:
            - Use the system data to explain the root cause (e.g., "Outburst likely due to sleep deprivation (6.5h avg) + falling grades").
            - Step 1: Validation (Connect first).
            - Step 2: Inquiry (Understand blocker).
            - Step 3: Alliance (Collaborative solution).
            
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Output JSON:
            - analysis (A concise 1-sentence data-driven insight explaining the behavior)
            - step1 (string)
            - step2 (string)
            - step3 (string)
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          analysis: { type: Type.STRING },
                          step1: { type: Type.STRING },
                          step2: { type: Type.STRING },
                          step3: { type: Type.STRING },
                      }
                  }
              }
          });

          const data = JSON.parse(response.text || '{}');
          return {
              analysis: data.analysis || "Based on recent data, the child appears to be under high cognitive load.",
              step1: data.step1 || "I see you are upset.",
              step2: data.step2 || "Can you tell me more?",
              step3: data.step3 || "Let's solve this together."
          };

      } catch (error) {
          console.error("Gemini Script Gen Error", error);
          return {
              analysis: "Unable to analyze system data due to connection error.",
              step1: "Service unavailable.",
              step2: "Please try again later.",
              step3: "Check network connection."
          };
      }
  },

  /**
   * Relational Layer: Parenting Advice Generator based on Child's Biometrics
   */
  async generateParentingGuidance(biometrics: EmotionalWeather, language: string = 'en'): Promise<string> {
    if (!process.env.API_KEY) return "Supportive, low-pressure environment recommended.";
    
    try {
      const prompt = `
        Role: Child Psychologist & Data Analyst for SAV Edu.
        Task: Provide a 1-sentence actionable tip for a parent based on the child's real-time biometric state.
        
        Child State:
        - Heart Rate Variability (HRV): ${biometrics.hrv}ms (Lower means higher stress)
        - Facial Expression: ${biometrics.detectedExpression}
        - Outburst Probability: ${biometrics.outburstProbability}%
        Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
        
        Guidance Strategy:
        - If stress is high (>70% outburst risk): Recommend "Silent Support" (e.g., bring food, no talking, hug).
        - If calm: Recommend "Positive Reinforcement".
        - Avoid lecturing.
        
        Output: One concise sentence.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      
      return response.text || "Monitor stress levels.";
    } catch (error) {
       return "Keep environment calm.";
    }
  },

  /**
   * Physical Layer: AI Coach for Growth & Injury Prevention
   */
  async generateSportsCoaching(growth: GrowthData, exercise: string, language: string = 'en'): Promise<SportsAdvice> {
     if (!process.env.API_KEY) {
         return {
             focusArea: "Core Stability",
             preventionWarning: "General safety check",
             customDrill: "Planks 3x30s"
         };
     }

     try {
         const prompt = `
            Role: Youth Sports Physiologist.
            Task: Provide training advice for a teenager preparing for school entrance sports exams.
            
            Child Profile:
            - Height: ${growth.height}cm
            - Recent Growth Rate: ${growth.growthRateCmPerMonth} cm/month (High growth can weaken bone density/coordination)
            - Current Exercise: ${exercise}
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Logic:
            - If growth rate is high (>1cm/month): Warn about knee/joint stress (Osgood-Schlatter risk) and suggest core/stability.
            - If weight is increasing: Suggest cardio intensity management.
            
            Output JSON:
            - focusArea (Short phrase)
            - preventionWarning (1 sentence explaining risk)
            - customDrill (1 specific exercise recommendation)
         `;

         const response = await ai.models.generateContent({
             model: MODEL_NAME,
             contents: prompt,
             config: {
                 responseMimeType: "application/json",
                 responseSchema: {
                     type: Type.OBJECT,
                     properties: {
                         focusArea: { type: Type.STRING },
                         preventionWarning: { type: Type.STRING },
                         customDrill: { type: Type.STRING }
                     }
                 }
             }
         });

         const data = JSON.parse(response.text || '{}');
         return {
             focusArea: data.focusArea || "Balance",
             preventionWarning: data.preventionWarning || "Watch form carefully.",
             customDrill: data.customDrill || "Single leg stands"
         };

     } catch (error) {
         return {
             focusArea: "General Fitness",
             preventionWarning: "Stay hydrated.",
             customDrill: "Warm up properly"
         };
     }
  },

  /**
   * Creative Layer: Art Critique and Analysis
   */
  async analyzeArtPiece(base64Image: string, language: string = 'en'): Promise<ArtAnalysis> {
      if (!process.env.API_KEY) throw new Error("API Key missing");

      try {
          const prompt = `
            Role: Encouraging Art Teacher & Critic.
            Task: Analyze the uploaded child's artwork.
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Provide structured feedback:
            1. Creativity Score (0-100): Originality and ideas.
            2. Technique Score (0-100): Usage of tools, lines, colors relative to age.
            3. Composition Analysis: How elements are arranged.
            4. Color Usage: Feeling and harmony of colors.
            5. Encouragement: A specific, warm compliment to motivate them.
            
            Output JSON format.
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: {
                  parts: [
                      { inlineData: { mimeType: "image/jpeg", data: base64Image } },
                      { text: prompt }
                  ]
              },
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          creativityScore: { type: Type.INTEGER },
                          techniqueScore: { type: Type.INTEGER },
                          compositionAnalysis: { type: Type.STRING },
                          colorUsage: { type: Type.STRING },
                          encouragement: { type: Type.STRING }
                      }
                  }
              }
          });

          const data = JSON.parse(response.text || '{}');
          return {
              creativityScore: data.creativityScore || 85,
              techniqueScore: data.techniqueScore || 80,
              compositionAnalysis: data.compositionAnalysis || "Good balance of elements.",
              colorUsage: data.colorUsage || "Vibrant and expressive.",
              encouragement: data.encouragement || "Great job! Keep creating!"
          };
      } catch (error) {
          console.error("Gemini Art Analysis Error:", error);
          return {
              creativityScore: 0,
              techniqueScore: 0,
              compositionAnalysis: "Error analyzing image.",
              colorUsage: "N/A",
              encouragement: "Keep practicing!"
          };
      }
  },

  /**
   * Quality Education Center: Generic Analysis for 4 Categories
   */
  async analyzeQualityEducationPerformance(category: QualityEducationCategory, contextData: string, language: string = 'en'): Promise<QualityEduAnalysis> {
      if (!process.env.API_KEY) {
          return {
              category,
              score: 0,
              feedback: "API Key missing.",
              metrics: []
          };
      }

      try {
          const prompt = `
            Role: Expert Quality Education Coach (Music, Art, Logic, Language).
            Task: Provide feedback for a child practicing ${category}.
            Context Data: ${contextData} (Simulated sensory input).
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Generate JSON with:
            - score (0-100)
            - feedback (Encouraging, specific advice)
            - metrics (Array of 2-3 specific metrics based on category, e.g. "Pitch", "Brushwork", "Efficiency", "Fluency")
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          score: { type: Type.INTEGER },
                          feedback: { type: Type.STRING },
                          metrics: { 
                              type: Type.ARRAY,
                              items: {
                                  type: Type.OBJECT,
                                  properties: {
                                      label: { type: Type.STRING },
                                      value: { type: Type.STRING },
                                      status: { type: Type.STRING, enum: ['good', 'average', 'poor'] }
                                  }
                              }
                          }
                      }
                  }
              }
          });

          const data = JSON.parse(response.text || '{}');
          return {
              category,
              score: data.score || 80,
              feedback: data.feedback || "Good effort! Keep practicing.",
              metrics: data.metrics || []
          };

      } catch (error) {
          return {
              category,
              score: 0,
              feedback: "Analysis currently unavailable.",
              metrics: []
          };
      }
  },

  /**
   * Creative Layer: Music Practice Analysis (Simulated Stumble)
   */
  async provideMusicCoaching(stumbleContext: string, language: string = 'en'): Promise<string> {
      if (!process.env.API_KEY) return "Pause and repeat slowly.";

      try {
          const prompt = `
            Role: Supportive Piano Teacher.
            Task: The student has stumbled repeatedly. Provide a short, actionable correction.
            Context: ${stumbleContext} (e.g., "Stumbled 3 times in Bar 8").
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Output: One or two sentences max. Example: "Commander, Bar 8 seems tricky. Let's slow down to 60bpm and try just the right hand."
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: prompt,
          });

          return response.text || "Let's pause and try that section again slowly.";
      } catch (error) {
          return "Let's take a deep breath and try again.";
      }
  },

  async generateMusicReport(duration: number, stumbles: number, language: string = 'en'): Promise<MusicReport> {
      if (!process.env.API_KEY) {
          return { pitchStability: 85, rhythmAccuracy: 80, focusScore: 90, summary: "Good practice.", suggestion: "Keep it up." };
      }

      try {
          const prompt = `
            Role: AI Music Examiner.
            Task: Generate a daily practice report.
            Data: Practice Duration ${duration}s, Detected Stumbles ${stumbles}.
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Generate JSON with:
            - pitchStability (0-100)
            - rhythmAccuracy (0-100)
            - focusScore (0-100)
            - summary (1 sentence overview)
            - suggestion (1 specific improvement tip)
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          pitchStability: { type: Type.INTEGER },
                          rhythmAccuracy: { type: Type.INTEGER },
                          focusScore: { type: Type.INTEGER },
                          summary: { type: Type.STRING },
                          suggestion: { type: Type.STRING }
                      }
                  }
              }
          });

          const data = JSON.parse(response.text || '{}');
          return {
              pitchStability: data.pitchStability || 85,
              rhythmAccuracy: data.rhythmAccuracy || 80,
              focusScore: data.focusScore || 90,
              summary: data.summary || "Solid practice session.",
              suggestion: data.suggestion || "Focus on even tempo next time."
          };
      } catch (error) {
          return { pitchStability: 80, rhythmAccuracy: 80, focusScore: 80, summary: "Report unavailable.", suggestion: "Try again." };
      }
  },

  // --- LOGIC MODULE: Go / Chess Analysis ---
  async analyzeGoBoard(boardState: string, language: string = 'en'): Promise<BoardAnalysis> {
      if (!process.env.API_KEY) {
          return {
              winProbability: 50,
              criticalMove: "K10",
              moveExplanation: "Demo Mode: Control the center.",
              suggestedMoves: [{x: 10, y: 10, type: 'good'}]
          };
      }

      try {
          const prompt = `
            Role: Expert Go (Weiqi) Coach.
            Task: Analyze the provided board state (simulated description).
            Context: ${boardState}
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Generate JSON:
            - winProbability (0-100 for current player/Black)
            - criticalMove (Coordinates e.g. "Q16")
            - moveExplanation (Why this move is key)
            - suggestedMoves (Array of {x, y, type: 'good'|'bad'}) - Map standard 19x19 coordinates to 0-18 indices.
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          winProbability: { type: Type.INTEGER },
                          criticalMove: { type: Type.STRING },
                          moveExplanation: { type: Type.STRING },
                          suggestedMoves: {
                              type: Type.ARRAY,
                              items: {
                                  type: Type.OBJECT,
                                  properties: {
                                      x: { type: Type.INTEGER },
                                      y: { type: Type.INTEGER },
                                      type: { type: Type.STRING, enum: ['good', 'bad'] }
                                  }
                              }
                          }
                      }
                  }
              }
          });

          const data = JSON.parse(response.text || '{}');
          return {
              winProbability: data.winProbability || 60,
              criticalMove: data.criticalMove || "Q16",
              moveExplanation: data.moveExplanation || "Taking the corner secures territory.",
              suggestedMoves: data.suggestedMoves || []
          };
      } catch (error) {
          return { winProbability: 50, criticalMove: "N/A", moveExplanation: "Analysis failed.", suggestedMoves: [] };
      }
  },

  // --- LOGIC MODULE: Coding Buddy (Heuristic Debug) ---
  async getCodeDebugHint(code: string, error: string, language: string = 'en'): Promise<CodeDebugHint> {
      if (!process.env.API_KEY) return { hint: "Check your syntax.", concept: "Syntax" };

      try {
          const prompt = `
            Role: Socratic Coding Tutor.
            Task: The student has an error in their code. Do NOT give the answer. Ask a leading question to help them find it.
            Code: "${code}"
            Error: "${error}"
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Generate JSON:
            - hint (The question string)
            - concept (e.g. "Loops", "Indentation")
            - line (The probable line number of the error)
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          hint: { type: Type.STRING },
                          concept: { type: Type.STRING },
                          line: { type: Type.INTEGER }
                      }
                  }
              }
          });

          const data = JSON.parse(response.text || '{}');
          return {
              hint: data.hint || "Have you checked the syntax?",
              concept: data.concept || "General",
              line: data.line
          };
      } catch (error) {
          return { hint: "Try reading the error message again.", concept: "Debug" };
      }
  },

  /**
   * TALENT HUB: Generate Comprehensive Weekly Report
   */
  async generateWeeklyReport(data: WeeklyReportData, childName: string = "Junior", language: string = 'en'): Promise<WeeklyAIInsight> {
      if (!process.env.API_KEY) {
          // Provide realistic simulation data if API key is missing
          if (language === 'zh') {
              return {
                  summary: "本周Junior在音乐和逻辑思维方面表现出色！钢琴练习的节奏稳定性提高了5%，展现出更强的乐感。围棋对弈中，虽然官子阶段仍有失误，但布局思路已见成效。需要注意的是英语单词记忆和书法坐姿，建议加强针对性练习。",
                  suggestions: [
                      "书法练习时，请提醒他关注方舱的坐姿提醒，保护脊柱。",
                      "朗诵时，AI 演说家会引导他尝试放慢语速，让诗歌更有韵味。",
                      "鉴于英语单词是目前的短板，我们可以试试在‘演说家舞台’用游戏的方式大声朗读单词，加深记忆。"
                  ]
              };
          } else {
              return {
                  summary: "Junior showed steady improvement in Music and Logic this week! We noticed his rhythm in piano practice is getting much better (up 5%). His Go strategy in the opening game is stronger, though endgames need work. Attention is needed for English vocabulary retention.",
                  suggestions: [
                      "For calligraphy, please remind him to check the posture alerts to protect his spine.",
                      "During recitation, encourage slowing down the pace to add more emotion.",
                      "Try gamified reading in the 'Orator Stage' to boost English vocabulary retention."
                  ]
              };
          }
      }

      try {
          const prompt = `
            Role: SAV Edu AI Growth Consultant (Warm, Professional, Encouraging).
            Task: Generate a weekly growth report for a child named ${childName}.
            
            Input Data:
            - Music: Piano, ${data.music.sessions} sessions, ${data.music.duration} mins total. Rhythm stability: ${data.music.rhythmScore}% (Improved by ${data.music.rhythmImprovement}%).
            - Art (Calligraphy): ${data.art.pages} pages. Posture alerts: ${data.art.postureAlerts}. Pen accuracy: ${data.art.penAccuracy}%.
            - Logic (Go/Weiqi): ${data.logic.wins} wins, ${data.logic.losses} losses. Analysis: ${data.logic.tacticalAnalysis}.
            - Language (Recitation): Emotion score ${data.language.emotionScore}%. Speed issue: ${data.language.speedIssue ? "Yes, too fast" : "No"}.
            - Academic: Strong in ${data.academic.strongSubject}, Weak in ${data.academic.weakSubject}.
            
            Output Language: ${language === 'zh' ? 'Chinese (Simplified)' : 'English'}
            
            Requirements:
            1. Summary: A warm paragraph highlighting progress (Music & Logic focus) and mentioning areas for improvement gently.
            2. Suggestions: 3 concrete, actionable tips for next week (mix of health, specific skill practice, and gamification).
            
            Output JSON:
            - summary (string)
            - suggestions (string array)
          `;

          const response = await ai.models.generateContent({
              model: MODEL_NAME,
              contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          summary: { type: Type.STRING },
                          suggestions: { 
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                          }
                      }
                  }
              }
          });

          const result = JSON.parse(response.text || '{}');
          return {
              summary: result.summary || "Great progress this week!",
              suggestions: result.suggestions || ["Keep practicing!"]
          };

      } catch (error) {
          return {
              summary: "Unable to generate report at this time.",
              suggestions: []
          };
      }
  }
};
