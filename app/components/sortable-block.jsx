"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableBlock({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full flex items-center justify-between p-4 bg-[#F8F6FF] border border-gray-200 rounded-lg shadow-sm text-sm font-medium"
    >
      <span>{label}</span>

      <button
        className="cursor-grab active:cursor-grabbing text-gray-500"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
    </div>
  );
}
