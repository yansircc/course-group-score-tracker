"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2, Trophy } from "lucide-react";
import { GroupCard } from "@/components/score-tracker/group-card";
import { ScoreChart } from "@/components/score-tracker/score-chart";
import { SetupCard } from "@/components/score-tracker/setup-card";
import { useScoreStore } from "@/store/score-store";
import { useEffect, useState, Suspense } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// Update the groupColors array to include both accent and chart colors
const groupColors = [
  { accent: "bg-blue-500", chart: "rgb(59, 130, 246)" }, // Blue
  { accent: "bg-rose-500", chart: "rgb(244, 63, 94)" }, // Rose
  { accent: "bg-amber-500", chart: "rgb(245, 158, 11)" }, // Amber
  { accent: "bg-emerald-500", chart: "rgb(16, 185, 129)" }, // Emerald
  { accent: "bg-violet-500", chart: "rgb(139, 92, 246)" }, // Violet
  { accent: "bg-cyan-500", chart: "rgb(6, 182, 212)" }, // Cyan
  { accent: "bg-fuchsia-500", chart: "rgb(217, 70, 239)" }, // Fuchsia
  { accent: "bg-lime-500", chart: "rgb(132, 204, 22)" }, // Lime
  { accent: "bg-orange-500", chart: "rgb(249, 115, 22)" }, // Orange
  { accent: "bg-teal-500", chart: "rgb(20, 184, 166)" }, // Teal
] as const;

function HomePage() {
  const { isAdmin, isLoading: isAdminLoading, resetAll } = useAdmin();
  const {
    groups,
    numGroups,
    editMode,
    isLoading,
    setNumGroups,
    setGroups,
    setEditMode,
    updateGroupName,
    updateGroupDescription,
    updateGroupScore,
    setDirectScore,
    loadGroups,
  } = useScoreStore();

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // 在组件加载时获取数据
  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  async function handleAddGroups() {
    const newGroups = Array.from({ length: numGroups }, (_, index) => ({
      id: `group-${index + 1}`,
      name: `Group ${index + 1}`,
      description: "",
      score: 0,
    }));
    await setGroups(newGroups);
  }

  // Find highest score for trophy display
  const highestScore =
    groups.length > 0 ? Math.max(...groups.map((group) => group.score)) : 0;

  // Update chartData to include colors
  const chartData = groups.map((group, index) => {
    const colorIndex = index % groupColors.length;
    const defaultColor = groupColors[0].chart;
    return {
      name: group.name,
      score: group.score,
      fill: groupColors[colorIndex]?.chart ?? defaultColor,
    };
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50 p-6">
      {isLoading || isAdminLoading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto"
        >
          {/* Enhanced Header */}
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">颜sir线下课小组赛</h1>
              <p className="text-muted-foreground">
                Track and compare group performance in real-time
              </p>
            </div>

            {groups.length > 0 && isAdmin && (
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(!editMode)}
                    className="gap-2 border-primary/20 transition-all hover:border-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                    {editMode ? "Done" : "Edit Groups"}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="destructive"
                    onClick={() => setIsResetDialogOpen(true)}
                    className="gap-2"
                  >
                    Reset All Data
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {groups.length === 0 ? (
              <SetupCard
                numGroups={numGroups}
                onNumGroupsChange={setNumGroups}
                onCreateGroups={handleAddGroups}
              />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-8 lg:grid-cols-2"
              >
                <div className="space-y-6">
                  <motion.div
                    className="rounded-xl border border-primary/20 bg-card/50 p-6 backdrop-blur"
                    variants={itemVariants}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-primary">
                        Groups
                      </h2>
                      <motion.div
                        animate={{ rotate: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                    </div>

                    <motion.div className="space-y-4" layout>
                      {groups.map((group) => {
                        const groupIndex = Number(group.id.split("-")[1]) - 1;
                        const colorIndex = groupIndex % groupColors.length;
                        const defaultColor = groupColors[0].accent;

                        return (
                          <GroupCard
                            key={group.id}
                            group={group}
                            editMode={editMode && isAdmin}
                            colorAccent={
                              groupColors[colorIndex]?.accent ?? defaultColor
                            }
                            isHighestScore={
                              group.score === highestScore && group.score > 0
                            }
                            onNameChange={updateGroupName}
                            onDescriptionChange={updateGroupDescription}
                            onScoreChange={updateGroupScore}
                            onDirectScoreInput={setDirectScore}
                            showControls={isAdmin}
                          />
                        );
                      })}
                    </motion.div>
                  </motion.div>
                </div>

                <ScoreChart data={chartData} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={resetAll}
      />
    </main>
  );
}

// Export the wrapped component as default
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
