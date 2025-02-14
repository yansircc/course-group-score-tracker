"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SetupCardProps {
  numGroups: number;
  onNumGroupsChange: (value: number) => void;
  onCreateGroups: () => void;
}

export function SetupCard({
  numGroups,
  onNumGroupsChange,
  onCreateGroups,
}: SetupCardProps) {
  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="mx-auto max-w-md"
    >
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-4">
            <Label htmlFor="numGroups" className="text-lg">
              How many groups do you want to create?
            </Label>
            <Input
              id="numGroups"
              type="number"
              min="1"
              max="10"
              value={numGroups}
              onChange={(e) => onNumGroupsChange(parseInt(e.target.value) || 2)}
              className="text-lg"
            />
          </div>
          <Button onClick={onCreateGroups} className="w-full" size="lg">
            Create Groups
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
