import { Pencil, Trash2 } from "lucide-react";
import { IconButton } from "./inputs/IconButton";

export function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-2 justify-end">
      <IconButton
        onClick={onEdit}
        title="Editar"
        className="text-navy hover:text-brand"
      >
        <Pencil size={18} />
      </IconButton>
      <IconButton
        onClick={onDelete}
        title="Excluir"
        className="text-grey hover:text-status-out"
      >
        <Trash2 size={18} />
      </IconButton>
    </div>
  );
}
