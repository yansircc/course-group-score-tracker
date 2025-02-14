"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    score: number;
  };
  editMode: boolean;
  colorAccent: string;
  isHighestScore: boolean;
  onNameChange: (id: string, name: string) => void;
  onDescriptionChange: (id: string, description: string) => void;
  onScoreChange: (id: string, score: number) => void;
  onDirectScoreInput: (id: string, score: string) => void;
  showControls: boolean;
}

const predefinedScores = [5, 10, 20, 30, 50];

export function GroupCard({
  group,
  editMode,
  colorAccent,
  isHighestScore,
  onNameChange,
  onDescriptionChange,
  onScoreChange,
  onDirectScoreInput,
  showControls,
}: GroupCardProps) {
  return (
    <motion.div layout whileHover={{ scale: 1.02 }} className="overflow-hidden">
      <Card className="relative border-primary/10 bg-card/50 backdrop-blur">
        <div className={`absolute left-0 top-0 h-full w-1 ${colorAccent}`} />

        {isHighestScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-2 rounded-full bg-yellow-500 p-1"
          >
            <Trophy className="h-4 w-4 text-white" />
          </motion.div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Left side: Name and Description */}
            <div className="flex-1 space-y-1.5">
              {editMode ? (
                <Input
                  value={group.name}
                  onChange={(e) => onNameChange(group.id, e.target.value)}
                  className="text-lg font-medium"
                  placeholder="Group name"
                />
              ) : (
                <h3 className="text-lg font-medium">{group.name}</h3>
              )}

              {editMode ? (
                <Input
                  value={group.description}
                  onChange={(e) =>
                    onDescriptionChange(group.id, e.target.value)
                  }
                  placeholder="Add description..."
                  className="text-sm text-muted-foreground"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {group.description || "No description"}
                </p>
              )}
            </div>

            {/* Right side: Score Controls and Display */}
            {showControls && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {predefinedScores.map((score) => (
                    <Button
                      key={score}
                      variant="outline"
                      size="sm"
                      onClick={() => onScoreChange(group.id, score)}
                      className="h-7 min-w-[2.5rem] px-1.5 hover:bg-primary/10 hover:text-foreground"
                    >
                      +{score}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2 border-l border-border pl-2">
                  {editMode ? (
                    <Input
                      type="number"
                      value={group.score}
                      onChange={(e) =>
                        onDirectScoreInput(group.id, e.target.value)
                      }
                      placeholder="Score"
                      className="h-7 w-16 px-1.5 text-center"
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold tabular-nums">
                        {group.score}
                      </span>
                      <span className="text-sm text-muted-foreground">pts</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
