"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const CONFIRM_TEXT = "确认删除";

  const handleConfirm = () => {
    if (confirmText === CONFIRM_TEXT) {
      onConfirm();
      onClose();
      setConfirmText("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>确认重置所有数据</DialogTitle>
          <DialogDescription>
            此操作将删除所有分数和管理员权限。此操作无法撤销。 请输入 &quot;
            {CONFIRM_TEXT}&quot; 以确认。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_TEXT}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText !== CONFIRM_TEXT}
          >
            确认重置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
