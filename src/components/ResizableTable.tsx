import { useState, useRef, useCallback, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Phone, Globe, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ColumnContextMenu } from "./ColumnContextMenu"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

interface Column {
  key: string
  label: string
  minWidth: number
  initialWidth: number
  sticky?: boolean
  order: number
}

interface Business {
  id: string
  name: string
  address: string
  type: string
  rating: number
  reviewCount: number
  phone?: string
  website?: string
  status: 'Open' | 'Closed' | 'Unknown'
  city: string
  state: string
  country: string
}

interface ResizableTableProps {
  businesses: Business[]
  onBusinessClick: (business: Business) => void
  loading: boolean
}

const initialColumns: Column[] = [
  { key: 'name', label: 'BUSINESS', minWidth: 150, initialWidth: 200, sticky: true, order: 0 },
  { key: 'address', label: 'ADDRESS', minWidth: 200, initialWidth: 300, order: 1 },
  { key: 'type', label: 'TYPE', minWidth: 120, initialWidth: 150, order: 2 },
  { key: 'rating', label: 'RATING', minWidth: 100, initialWidth: 120, order: 3 },
  { key: 'contact', label: 'CONTACT', minWidth: 100, initialWidth: 120, order: 4 },
  { key: 'status', label: 'STATUS', minWidth: 80, initialWidth: 100, order: 5 },
]

export function ResizableTable({ businesses, onBusinessClick, loading }: ResizableTableProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    initialColumns.reduce((acc, col) => ({ ...acc, [col.key]: col.initialWidth }), {})
  )
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [sortedBusinesses, setSortedBusinesses] = useState<Business[]>(businesses)
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [dragLine, setDragLine] = useState<{ show: boolean; x: number }>({ show: false, x: 0 })
  
  const tableRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  // Update sorted businesses when businesses or sort config changes
  useEffect(() => {
    let sorted = [...businesses]
    
    if (sortConfig) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Business]
        const bValue = b[sortConfig.key as keyof Business]
        
        if (aValue === undefined || bValue === undefined) return 0
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return sortConfig.direction === 'asc' ? comparison : -comparison
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue
          return sortConfig.direction === 'asc' ? comparison : -comparison
        }
        
        return 0
      })
    }
    
    setSortedBusinesses(sorted)
  }, [businesses, sortConfig])

  const handleMouseDown = useCallback((e: React.MouseEvent, columnKey: string) => {
    e.preventDefault()
    setIsResizing(true)
    setResizingColumn(columnKey)
    startXRef.current = e.clientX
    startWidthRef.current = columnWidths[columnKey]
    
    const rect = tableRef.current?.getBoundingClientRect()
    if (rect) {
      setDragLine({ show: true, x: e.clientX - rect.left })
    }
  }, [columnWidths])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizingColumn) return
    
    const deltaX = e.clientX - startXRef.current
    const column = columns.find(col => col.key === resizingColumn)
    const newWidth = Math.max(column?.minWidth || 100, startWidthRef.current + deltaX)
    
    const rect = tableRef.current?.getBoundingClientRect()
    if (rect) {
      setDragLine({ show: true, x: e.clientX - rect.left })
    }
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }))
  }, [isResizing, resizingColumn, columns])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setResizingColumn(null)
    setDragLine({ show: false, x: 0 })
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key: columnKey, direction })
  }

  const handleMove = (columnKey: string, direction: 'left' | 'right') => {
    const currentColumn = columns.find(col => col.key === columnKey)
    if (!currentColumn) return

    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const currentIndex = sortedColumns.findIndex(col => col.key === columnKey)
    
    if (direction === 'left' && currentIndex > 1) { // Don't move past the name column (index 0)
      const targetColumn = sortedColumns[currentIndex - 1]
      setColumns(prev => prev.map(col => {
        if (col.key === columnKey) return { ...col, order: targetColumn.order }
        if (col.key === targetColumn.key) return { ...col, order: currentColumn.order }
        return col
      }))
    } else if (direction === 'right' && currentIndex < sortedColumns.length - 1) {
      const targetColumn = sortedColumns[currentIndex + 1]
      setColumns(prev => prev.map(col => {
        if (col.key === columnKey) return { ...col, order: targetColumn.order }
        if (col.key === targetColumn.key) return { ...col, order: currentColumn.order }
        return col
      }))
    }
  }

  const handleFreeze = (columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, sticky: !col.sticky } : col
    ))
  }

  const formatRating = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span className="font-medium">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground">({reviewCount})</span>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Open': 'bg-green-100 text-green-800',
      'Closed': 'bg-red-100 text-red-800',
      'Unknown': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.Unknown}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)

  return (
    <TooltipProvider>
      <div ref={tableRef} className="relative h-full overflow-auto">
        {dragLine.show && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-30 pointer-events-none"
            style={{ left: `${dragLine.x}px` }}
          />
        )}
        <Table>
          <TableHeader className="sticky top-0 bg-background z-20">
            <TableRow>
              {sortedColumns.map((column, index) => (
                <ColumnContextMenu
                  key={column.key}
                  columnKey={column.key}
                  columnLabel={column.label}
                  onSort={handleSort}
                  onMove={handleMove}
                  onFreeze={handleFreeze}
                  canMoveLeft={index > 1}
                  canMoveRight={index < sortedColumns.length - 1}
                  isFrozen={!!column.sticky}
                >
                  <TableHead 
                    className={`${
                      column.key === 'name' || column.sticky 
                        ? 'sticky left-0 bg-background z-30 border-r' 
                        : ''
                    } relative cursor-pointer select-none`}
                    style={{ 
                      width: `${columnWidths[column.key]}px`,
                      minWidth: `${columnWidths[column.key]}px`,
                      maxWidth: `${columnWidths[column.key]}px`,
                      left: column.key === 'name' ? '0px' : 
                            column.sticky ? `${columnWidths.name}px` : 'auto'
                    }}
                  >
                    <div className="flex items-center gap-1 pr-4">
                      {column.label}
                      {sortConfig?.key === column.key && (
                        <span className="text-xs">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    <div
                      className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/20 group"
                      onMouseDown={(e) => handleMouseDown(e, column.key)}
                    >
                      <div className="absolute top-1/2 right-0 w-0.5 h-4 bg-border group-hover:bg-blue-500 transform -translate-y-1/2" />
                    </div>
                  </TableHead>
                </ColumnContextMenu>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBusinesses.map((business) => (
              <TableRow 
                key={business.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onBusinessClick(business)}
              >
                {sortedColumns.map((column) => {
                  if (column.key === 'name') {
                    return (
                      <TableCell 
                        key={column.key}
                        className="sticky left-0 bg-background border-r z-10"
                        style={{ 
                          width: `${columnWidths.name}px`,
                          minWidth: `${columnWidths.name}px`,
                          maxWidth: `${columnWidths.name}px`
                        }}
                      >
                        <div 
                          className="underline truncate"
                          style={{ width: `${columnWidths.name - 24}px` }}
                          title={business.name}
                        >
                          {business.name}
                        </div>
                      </TableCell>
                    )
                  }

                  if (column.key === 'address') {
                    return (
                      <TableCell 
                        key={column.key}
                        className={`text-sm text-muted-foreground ${column.sticky ? 'sticky bg-background border-r z-10' : ''}`}
                        style={{ 
                          width: `${columnWidths.address}px`,
                          minWidth: `${columnWidths.address}px`,
                          maxWidth: `${columnWidths.address}px`,
                          left: column.sticky ? `${columnWidths.name}px` : 'auto'
                        }}
                      >
                        <div 
                          className="truncate"
                          style={{ width: `${columnWidths.address - 24}px` }}
                          title={business.address}
                        >
                          {business.address}
                        </div>
                      </TableCell>
                    )
                  }

                  if (column.key === 'type') {
                    return (
                      <TableCell 
                        key={column.key}
                        className={`text-sm text-muted-foreground ${column.sticky ? 'sticky bg-background border-r z-10' : ''}`}
                        style={{ 
                          width: `${columnWidths.type}px`,
                          minWidth: `${columnWidths.type}px`,
                          maxWidth: `${columnWidths.type}px`
                        }}
                      >
                        <div 
                          className="truncate"
                          style={{ width: `${columnWidths.type - 24}px` }}
                          title={business.type}
                        >
                          {business.type}
                        </div>
                      </TableCell>
                    )
                  }

                  if (column.key === 'rating') {
                    return (
                      <TableCell
                        key={column.key}
                        className={column.sticky ? 'sticky bg-background border-r z-10' : ''}
                        style={{ 
                          width: `${columnWidths.rating}px`,
                          minWidth: `${columnWidths.rating}px`,
                          maxWidth: `${columnWidths.rating}px`
                        }}
                      >
                        {business.rating && business.reviewCount ? formatRating(business.rating, business.reviewCount) : '-'}
                      </TableCell>
                    )
                  }

                  if (column.key === 'contact') {
                    return (
                      <TableCell
                        key={column.key}
                        className={column.sticky ? 'sticky bg-background border-r z-10' : ''}
                        style={{ 
                          width: `${columnWidths.contact}px`,
                          minWidth: `${columnWidths.contact}px`,
                          maxWidth: `${columnWidths.contact}px`
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {business.phone && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Phone className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-white text-center">
                                <TooltipPrimitive.Arrow className="fill-gray-900" />
                                <p>{business.phone}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {business.website && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Globe className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-white text-center">
                                <TooltipPrimitive.Arrow className="fill-gray-900" />
                                <p>{business.website}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MapPin className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white text-center">
                              <TooltipPrimitive.Arrow className="fill-gray-900" />
                              <p>{business.address}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    )
                  }

                  if (column.key === 'status') {
                    return (
                      <TableCell
                        key={column.key}
                        className={column.sticky ? 'sticky bg-background border-r z-10' : ''}
                        style={{ 
                          width: `${columnWidths.status}px`,
                          minWidth: `${columnWidths.status}px`,
                          maxWidth: `${columnWidths.status}px`
                        }}
                      >
                        {getStatusBadge(business.status)}
                      </TableCell>
                    )
                  }

                  return null
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
