import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  TrendingUp, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FrequentQuestion {
  id: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  frequency: number;
  category: string;
}

interface LearnerQueriesSummaryProps {
  classCategory?: string;
}

export function LearnerQueriesSummary({ classCategory = 'woodworking' }: LearnerQueriesSummaryProps) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Generate category-specific questions
  const getQuestionsForCategory = (): FrequentQuestion[] => {
    const questionsMap: Record<string, FrequentQuestion[]> = {
      woodworking: [
        {
          id: 'q1',
          question: 'What type of wood is best for beginners?',
          shortAnswer: 'Pine and basswood are recommended for beginners due to their softness and ease of use.',
          fullAnswer: 'For beginners, pine and basswood are the best choices. Pine is affordable, widely available, and soft enough to carve easily without requiring expensive tools. Basswood is slightly more expensive but offers a fine, consistent grain that\'s perfect for detailed work. Both woods are forgiving of mistakes and allow you to practice techniques without frustration. Avoid hardwoods like oak or maple initially, as they require more advanced skills and sharper tools.',
          frequency: 127,
          category: 'Tools & Materials'
        },
        {
          id: 'q2',
          question: 'Do I need expensive tools to start woodworking?',
          shortAnswer: 'No, you can start with basic affordable tools and gradually upgrade as you progress.',
          fullAnswer: 'Starting with woodworking doesn\'t require a huge investment. A basic starter kit might include a handsaw, chisels (3-4 sizes), a mallet, sandpaper, and wood glue. These can cost $50-100 total. As you develop your skills and identify your favorite projects, you can invest in quality power tools. Many experienced woodworkers still prefer hand tools for certain tasks. Focus on learning proper technique first, then upgrade tools based on your specific needs.',
          frequency: 98,
          category: 'Tools & Materials'
        },
        {
          id: 'q3',
          question: 'How do I prevent wood from splitting?',
          shortAnswer: 'Pre-drill holes, use sharp tools, and work with the grain to prevent splitting.',
          fullAnswer: 'Wood splitting is a common frustration, but it\'s preventable with proper techniques. Always pre-drill pilot holes before inserting screws, especially near board ends. Keep your cutting tools sharp - dull blades tear fibers rather than cutting cleanly. Work with the wood grain rather than against it. When joining pieces, leave adequate space from edges (at least 3x the fastener diameter). For extra protection, you can also clamp pieces to distribute stress evenly and apply wood glue to reinforce joints.',
          frequency: 84,
          category: 'Techniques'
        },
        {
          id: 'q4',
          question: 'What safety equipment is essential?',
          shortAnswer: 'Safety glasses, dust mask, and hearing protection are the bare minimum essentials.',
          fullAnswer: 'Safety should never be compromised. At minimum, always wear safety glasses to protect against flying debris and dust masks to prevent inhaling wood particles (which can be harmful over time). When using power tools, add hearing protection. Work gloves can protect against splinters, but remove them when operating power tools to prevent catching. Keep a first-aid kit nearby, maintain good ventilation in your workspace, and never rush - most accidents happen when you\'re tired or hurrying.',
          frequency: 76,
          category: 'Safety'
        },
        {
          id: 'q5',
          question: 'How long does it take to finish the first project?',
          shortAnswer: 'Most beginners complete their first simple project in 3-5 hours over a few days.',
          fullAnswer: 'Your first project timeline depends on complexity and your pace. A simple cutting board might take 3-4 hours total, spread over a weekend. A small shelf could take 5-8 hours. Don\'t rush - woodworking is as much about the process as the result. Take breaks, double-check measurements, and enjoy learning. Many beginners underestimate drying time for glue and finishes, so plan for projects to span several days even if active working time is just a few hours.',
          frequency: 63,
          category: 'Getting Started'
        }
      ],
      pottery: [
        {
          id: 'q1',
          question: 'What type of clay should I use as a beginner?',
          shortAnswer: 'Earthenware clay is ideal for beginners due to its low firing temperature and forgiving nature.',
          fullAnswer: 'Earthenware clay is the most beginner-friendly option. It fires at lower temperatures (around 1000°C), making it more accessible and forgiving of mistakes. It\'s also less expensive than stoneware or porcelain. Earthenware is easier to work with on the wheel and hand-building. Once you\'re comfortable with basic techniques, you can explore stoneware for more durable pieces or porcelain for delicate work.',
          frequency: 142,
          category: 'Materials'
        },
        {
          id: 'q2',
          question: 'How do I prevent my pottery from cracking during drying?',
          shortAnswer: 'Dry pieces slowly and evenly, cover with plastic, and avoid direct sunlight or heat sources.',
          fullAnswer: 'Cracking during drying is often caused by uneven moisture loss. Cover your pieces loosely with plastic to slow drying, allowing moisture to escape gradually. Dry in a cool, shaded area away from fans, heaters, or direct sunlight. For thicker pieces, dry even slower. If one area dries faster than another, the stress can cause cracks. Turn pieces periodically for even drying. Patience is key - rushing this stage ruins otherwise perfect work.',
          frequency: 118,
          category: 'Techniques'
        },
        {
          id: 'q3',
          question: 'Do I need my own kiln to get started?',
          shortAnswer: 'No, many studios and community centers offer kiln rental services for firing your pieces.',
          fullAnswer: 'Owning a kiln isn\'t necessary when starting out. Most pottery studios, art centers, and ceramics schools offer kiln firing services. You create your pieces at home or in a shared studio space, then pay per firing. This is much more cost-effective initially (kilns cost thousands and need proper electrical setup). As you advance and produce more work, you might consider a kiln investment, but many potters successfully work for years using shared facilities.',
          frequency: 95,
          category: 'Equipment'
        },
        {
          id: 'q4',
          question: 'How long does it take to learn throwing on the wheel?',
          shortAnswer: 'Basic centering and simple shapes typically take 4-6 weeks of regular practice.',
          fullAnswer: 'Learning to throw on the wheel is challenging but rewarding. Most students can center clay and create basic cylinders within 4-6 weeks of regular practice (2-3 sessions per week). However, mastering consistent shapes, even walls, and larger pieces takes months to years. Don\'t get discouraged by initial wobbles and collapses - every potter has been there. Focus on muscle memory through repetition. Many find hand-building a great complement while developing wheel skills.',
          frequency: 87,
          category: 'Getting Started'
        },
        {
          id: 'q5',
          question: 'What\'s the difference between underglazes and glazes?',
          shortAnswer: 'Underglazes are for decoration applied before glazing; glazes provide the final glassy coating.',
          fullAnswer: 'Underglazes are pigments used for detailed decoration and painting on pottery. They\'re applied to bisque-fired clay, then covered with a clear or transparent glaze. They don\'t melt like glazes do, so your designs stay crisp. Glazes, on the other hand, melt during firing to create a glassy, waterproof surface. They come in various finishes (glossy, matte, satin) and can be layered for unique effects. Many potters use underglazes for intricate patterns, then finish with glaze for protection and shine.',
          frequency: 71,
          category: 'Glazing & Finishing'
        }
      ]
    };

    // Return category-specific questions or default to woodworking
    return questionsMap[classCategory.toLowerCase()] || questionsMap.woodworking;
  };

  const questions = getQuestionsForCategory();

  const toggleExpand = (questionId: string) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  const getFrequencyColor = (frequency: number) => {
    if (frequency >= 100) return 'text-orange-600';
    if (frequency >= 80) return 'text-orange-500';
    return 'text-amber-600';
  };

  const getFrequencyBgColor = (frequency: number) => {
    if (frequency >= 100) return 'bg-orange-50 border-orange-200';
    if (frequency >= 80) return 'bg-orange-50/70 border-orange-200/70';
    return 'bg-amber-50 border-amber-200';
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/20 border-t border-b py-6">
      <div className="px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg">Top Learner Questions at a Glance</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            See what most learners are asking — AI summarizes and answers frequent queries so you can learn faster.
          </p>
        </div>

        {/* Questions Grid */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {questions.map((q) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border ${expandedQuestionId === q.id ? 'shadow-md border-primary/30' : 'hover:shadow-sm'} transition-all duration-200`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            <h4 className="text-sm leading-snug">{q.question}</h4>
                          </div>
                          
                          {/* Frequency Badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className={`${getFrequencyBgColor(q.frequency)} ${getFrequencyColor(q.frequency)} border text-xs px-2 py-0.5`}
                            >
                              <Flame className="h-3 w-3 mr-1" />
                              Asked {q.frequency} times
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-secondary/50">
                              {q.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <TrendingUp className={`h-4 w-4 ${getFrequencyColor(q.frequency)}`} />
                        </div>
                      </div>

                      {/* Short Answer */}
                      <div className="bg-accent/50 rounded-lg p-3 border border-border/50">
                        <p className="text-sm text-foreground/90">
                          {q.shortAnswer}
                        </p>
                      </div>

                      {/* Expand Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(q.id)}
                          className="text-xs h-8"
                        >
                          {expandedQuestionId === q.id ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Hide Full Answer
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              View Full Answer
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Full Answer (Expandable) */}
                      <AnimatePresence>
                        {expandedQuestionId === q.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                              <div className="flex items-start gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-primary">AI-Generated Detailed Answer</span>
                              </div>
                              <p className="text-sm text-foreground/80 leading-relaxed">
                                {q.fullAnswer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer Info */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>Questions automatically updated based on learner interactions</span>
        </div>
      </div>
    </div>
  );
}
