
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { ArrowUp, ArrowDown, MoveLeft, MoveRight, Snowflake } from "lucide-react"

interface ColumnContextMenuProps {
  children: React.ReactNode
  columnKey: string
  columnLabel: string
  onSort: (columnKey: string, direction: 'asc' | 'desc') => void
  onMove: (columnKey: string, direction: 'left' | 'right') => void
  onFreeze: (columnKey: string) => void
  canMoveLeft: boolean
  canMoveRight: boolean
  isFrozen: boolean
}

export function ColumnContextMenu({
  children,
  columnKey,
  columnLabel,
  onSort,
  onMove,
  onFreeze,
  canMoveLeft,
  canMoveRight,
  isFrozen
}: ColumnContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={() => onSort(columnKey, 'asc')}>
          <ArrowUp className="w-4 h-4 mr-2" />
          Sort ascending
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onSort(columnKey, 'desc')}>
          <ArrowDown className="w-4 h-4 mr-2" />
          Sort descending
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onMove(columnKey, 'left')}
          disabled={!canMoveLeft}
        >
          <MoveLeft className="w-4 h-4 mr-2" />
          Move left
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onMove(columnKey, 'right')}
          disabled={!canMoveRight}
        >
          <MoveRight className="w-4 h-4 mr-2" />
          Move right
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onFreeze(columnKey)}>
          <Snowflake className="w-4 h-4 mr-2" />
          {isFrozen ? 'Unfreeze column' : 'Freeze column'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
