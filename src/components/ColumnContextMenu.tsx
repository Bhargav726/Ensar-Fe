
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ArrowUpDown, ArrowUp, ArrowDown, MoveLeft, MoveRight, Snowflake } from "lucide-react"

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
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        
        <ContextMenuItem onClick={() => onSort(columnKey, 'asc')}>
          <ArrowUp className="w-4 h-4 mr-2" />
          Sort ascending
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => onSort(columnKey, 'desc')}>
          <ArrowDown className="w-4 h-4 mr-2" />
          Sort descending
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => onMove(columnKey, 'left')}
          disabled={!canMoveLeft}
        >
          <MoveLeft className="w-4 h-4 mr-2" />
          Move left
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => onMove(columnKey, 'right')}
          disabled={!canMoveRight}
        >
          <MoveRight className="w-4 h-4 mr-2" />
          Move right
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => onFreeze(columnKey)}>
          <Snowflake className="w-4 h-4 mr-2" />
          {isFrozen ? 'Unfreeze column' : 'Freeze column'}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
