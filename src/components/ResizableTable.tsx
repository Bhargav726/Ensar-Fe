import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Globe, MapPin, Phone, Plus } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { ColumnContextMenu } from "./ColumnContextMenu"

interface Column {
  key: string
  label: string
  minWidth: number
  initialWidth: number
  sticky?: boolean
  order: number
  isLastColumn?: boolean
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
  totalRecords?: number
  onSelectAll?: (selected: boolean) => void
  selectedRows?: Set<string>
  onRowSelect?: (businessId: string, checked: boolean) => void
  selectAll?: boolean
}

const initialColumns: Column[] = [
  { key: 'checkbox-name', label: 'BUSINESS', minWidth: 250, initialWidth: 300, sticky: true, order: 0 },
  { key: 'address', label: 'ADDRESS', minWidth: 200, initialWidth: 300, order: 1 },
  { key: 'type', label: 'TYPE', minWidth: 120, initialWidth: 150, order: 2 },
  { key: 'rating', label: 'RATING', minWidth: 100, initialWidth: 120, order: 3 },
  { key: 'contact', label: 'CONTACT', minWidth: 100, initialWidth: 120, order: 4 },
  { key: 'status', label: 'STATUS', minWidth: 80, initialWidth: 100, order: 5, isLastColumn: true },
]

export function ResizableTable({
  businesses,
  onBusinessClick,
  loading,
  totalRecords = 0,
  onSelectAll,
  selectedRows = new Set(),
  onRowSelect,
  selectAll = false
}: ResizableTableProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    initialColumns.reduce((acc, col) => ({ ...acc, [col.key]: col.initialWidth }), {})
  )
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [sortedBusinesses, setSortedBusinesses] = useState<Business[]>(businesses)
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [dragLine, setDragLine] = useState<{ show: boolean; x: number }>({ show: false, x: 0 })
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const tableRef = useRef<HTMLDivElement>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  // ResizeObserver to track container width changes
  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

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

  // Handle select all checkbox - select all records across all pages
  const handleSelectAll = (checked: boolean) => {
    onSelectAll?.(checked)
  }

  // Handle individual row checkbox
  const handleRowSelect = (businessId: string, checked: boolean) => {
    onRowSelect?.(businessId, checked)
  }

  const handleMouseDown = useCallback((e: React.MouseEvent, columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (column?.isLastColumn) return // Prevent dragging for last column
    
    e.preventDefault()
    setIsResizing(true)
    setResizingColumn(columnKey)
    startXRef.current = e.clientX
    startWidthRef.current = columnWidths[columnKey]

    // Calculate the exact position of the column boundary
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const columnIndex = sortedColumns.findIndex(col => col.key === columnKey)
    const accumulatedWidth = sortedColumns
      .slice(0, columnIndex + 1)
      .reduce((total, col) => total + columnWidths[col.key], 0)
    
    setDragLine({ show: true, x: accumulatedWidth })
  }, [columnWidths, columns])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizingColumn) return

    const deltaX = e.clientX - startXRef.current
    const column = columns.find(col => col.key === resizingColumn)
    const newWidth = Math.max(column?.minWidth || 100, startWidthRef.current + deltaX)

    // Calculate the new position based on the updated column width
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const columnIndex = sortedColumns.findIndex(col => col.key === resizingColumn)
    const accumulatedWidth = sortedColumns
      .slice(0, columnIndex)
      .reduce((total, col) => total + columnWidths[col.key], 0) + newWidth

    setDragLine({ show: true, x: accumulatedWidth })

    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }))
  }, [isResizing, resizingColumn, columns, columnWidths])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setResizingColumn(null)
    setDragLine({ show: false, x: 0 })
  }, [])

  // Calculate all column boundary positions for consistent drag line positioning
  const getColumnBoundaryPosition = useCallback((columnKey: string) => {
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const columnIndex = sortedColumns.findIndex(col => col.key === columnKey)
    return sortedColumns
      .slice(0, columnIndex + 1)
      .reduce((total, col) => total + columnWidths[col.key], 0)
  }, [columns, columnWidths])

  // Calculate the position for the currently resizing column
  const getResizingColumnPosition = useCallback(() => {
    if (!resizingColumn) return 0
    
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const columnIndex = sortedColumns.findIndex(col => col.key === resizingColumn)
    const newWidth = columnWidths[resizingColumn]
    
    return sortedColumns
      .slice(0, columnIndex)
      .reduce((total, col) => total + columnWidths[col.key], 0) + newWidth
  }, [resizingColumn, columns, columnWidths])

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

    if (direction === 'left' && currentIndex > 0) {
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

  const handleAddColumn = () => {
    const newColumnKey = `custom-${Date.now()}`
    const maxOrder = Math.max(...columns.map(col => col.order))
    const newColumn: Column = {
      key: newColumnKey,
      label: 'NEW COLUMN',
      minWidth: 120,
      initialWidth: 150,
      order: maxOrder + 1,
      isLastColumn: false
    }
    
    // Update the previous last column to not be the last column
    const updatedColumns = columns.map(col => 
      col.isLastColumn ? { ...col, isLastColumn: false } : col
    )
    
    // Add the new column and make status the last column again
    const newColumns = [...updatedColumns, newColumn].map(col => 
      col.key === 'status' ? { ...col, isLastColumn: true } : col
    )
    
    setColumns(newColumns)
    setColumnWidths(prev => ({
      ...prev,
      [newColumnKey]: newColumn.initialWidth
    }))
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
  const totalTableWidth = sortedColumns.reduce((total, col) => total + columnWidths[col.key], 0)
  const needsHorizontalScroll = totalTableWidth > containerWidth

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Table Container with External Scrollbar */}
        <div
          ref={tableContainerRef}
          className="flex-1 h-full overflow-y-auto"
          style={{
            overflowX: needsHorizontalScroll ? 'auto' : 'hidden'
          }}
        >
          <div
            ref={tableRef}
            className="relative"
            style={{ minWidth: `${totalTableWidth}px` }}
          >
            {/* Render drag line for the currently resizing column */}
            {dragLine.show && resizingColumn && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-50 pointer-events-none"
                style={{ left: `${getResizingColumnPosition()}px` }}
              />
            )}

            {/* Fixed Header */}
            <div className="sticky top-0 z-40 bg-background border-b flex shrink-0">
              {sortedColumns.map((column, index) => {
                if (column.key === 'checkbox-name') {
                  return (
                    <div
                      key={column.key}
                      className="sticky left-0 z-50 flex items-center bg-background px-4 py-3 border-l border-r shadow-right"
                      style={{
                        width: `${columnWidths[column.key]}px`,
                        minWidth: `${columnWidths[column.key]}px`,
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="font-medium">{column.label}</span>
                      </div>
                    </div>
                  )
                }

                return (
                  <ColumnContextMenu
                    key={column.key}
                    columnKey={column.key}
                    columnLabel={column.label}
                    onSort={handleSort}
                    onMove={handleMove}
                    onFreeze={handleFreeze}
                    canMoveLeft={index > 0}
                    canMoveRight={index < sortedColumns.length - 1}
                    isFrozen={!!column.sticky}
                  >
                    <div
                      className="relative cursor-pointer select-none bg-background px-4 py-3 text-left font-medium"
                      style={{
                        width: `${columnWidths[column.key]}px`,
                        minWidth: `${columnWidths[column.key]}px`,
                      }}
                    >
                      <div className="flex items-center gap-1 pr-2">
                        {column.label}
                        {sortConfig?.key === column.key && (
                          <span className="text-xs">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                      {!column.isLastColumn && (
                        <div
                          className="absolute border-r border-border top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/20 group"
                          onMouseDown={(e) => handleMouseDown(e, column.key)}
                        >
                          {/* <div className="absolute top-1/2 right-0 w-0.5 h-4 bg-border group-hover:bg-blue-500 transform -translate-y-1/2" /> */}
                        </div>
                      )}
                      {column.isLastColumn && (
                        <div
                          className="absolute border-r border-border top-0 right-0 bottom-0 w-1"
                        />
                      )}
                    </div>
                  </ColumnContextMenu>
                )
              })}
              
              {/* Add Column Button */}
              <div className="flex items-center justify-center px-4 py-3 bg-background">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={handleAddColumn}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new column</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Table Body */}
            <div>
              {sortedBusinesses.map((business, rowIndex) => (
                <div
                  key={business.id}
                  className="hover:bg-muted/50 border-b"
                  style={{ height: '56px', display: 'flex', alignItems: 'stretch' }}
                >
                  {sortedColumns.map((column, colIndex) => {
                    if (column.key === 'checkbox-name') {
                      return (
                        <div
                          key={column.key}
                          className="sticky left-0 z-30 flex items-center bg-background px-4 py-3 border-l border-r cursor-pointer shadow-right"
                          style={{
                            width: `${columnWidths[column.key]}px`,
                            minWidth: `${columnWidths[column.key]}px`,
                          }}
                          onClick={() => onBusinessClick(business)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Checkbox
                              checked={selectedRows.has(business.id)}
                              onCheckedChange={(checked) => handleRowSelect(business.id, checked as boolean)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div
                              className="underline truncate flex-1"
                              title={business.name}
                            >
                              {business.name}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    if (column.key === 'address') {
                      return (
                        <div
                          key={column.key}
                          className="flex items-center text-sm text-muted-foreground px-4 py-3 border-r"
                          style={{
                            width: `${columnWidths[column.key]}px`,
                            minWidth: `${columnWidths[column.key]}px`,
                          }}
                        >
                          <div
                            className="truncate"
                            style={{ width: `${columnWidths.address - 24}px` }}
                            title={business.address}
                          >
                            {business.address}
                          </div>
                        </div>
                      )
                    }

                    if (column.key === 'type') {
                      return (
                        <div
                          key={column.key}
                          className="flex items-center text-sm text-muted-foreground px-4 py-3 border-r"
                          style={{
                            width: `${columnWidths[column.key]}px`,
                            minWidth: `${columnWidths[column.key]}px`,
                          }}
                        >
                          <div
                            className="truncate"
                            style={{ width: `${columnWidths.type - 24}px` }}
                            title={business.type}
                          >
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
                              {business.type}
                            </Badge>
                          </div>
                        </div>
                      )
                    }

                    if (column.key === 'rating') {
                      return (
                        <div
                          key={column.key}
                          className="flex items-center px-4 py-3 border-r"
                          style={{
                            width: `${columnWidths[column.key]}px`,
                            minWidth: `${columnWidths[column.key]}px`,
                          }}
                        >
                          {business.rating && business.reviewCount ? formatRating(business.rating, business.reviewCount) : '-'}
                        </div>
                      )
                    }

                    if (column.key === 'contact') {
                      return (
                        <div
                          key={column.key}
                          className="flex items-center px-4 py-3 border-r"
                          style={{
                            width: `${columnWidths[column.key]}px`,
                            minWidth: `${columnWidths[column.key]}px`,
                          }}
                        >
                          <div className="flex items-center gap-0">
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
                        </div>
                      )
                    }

                    if (column.key === 'status') {
                      return (
                        <div
                          key={column.key}
                          className="flex border-r items-center justify-end px-4 py-3"
                          style={{
                            width: `${columnWidths[column.key]}px`,
                            minWidth: `${columnWidths[column.key]}px`,
                          }}
                        >
                          {getStatusBadge(business.status)}
                        </div>
                      )
                    }

                    // Handle custom columns
                    if (column.key.startsWith('custom-')) {
                      return (
                        <div
                          key={column.key}
                          className="flex items-center px-4 py-3 border-r"
                          style={{
                            width: `${columnWidths[column.key]}px`,
                            minWidth: `${columnWidths[column.key]}px`,
                          }}
                        >
                          <div className="text-sm text-muted-foreground">
                            {/* Custom data */}
                            -
                          </div>
                        </div>
                      )
                    }

                    return null
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
