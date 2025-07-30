
import { useState, useRef, useCallback, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Phone, Globe, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Column {
  key: string
  label: string
  minWidth: number
  initialWidth: number
  sticky?: boolean
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

const defaultColumns: Column[] = [
  { key: 'name', label: 'BUSINESS', minWidth: 150, initialWidth: 200, sticky: true },
  { key: 'address', label: 'ADDRESS', minWidth: 200, initialWidth: 300 },
  { key: 'type', label: 'TYPE', minWidth: 120, initialWidth: 150 },
  { key: 'rating', label: 'RATING', minWidth: 100, initialWidth: 120 },
  { key: 'contact', label: 'CONTACT', minWidth: 100, initialWidth: 120 },
  { key: 'status', label: 'STATUS', minWidth: 80, initialWidth: 100 },
]

export function ResizableTable({ businesses, onBusinessClick, loading }: ResizableTableProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    defaultColumns.reduce((acc, col) => ({ ...acc, [col.key]: col.initialWidth }), {})
  )
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [dragLine, setDragLine] = useState<{ show: boolean; x: number }>({ show: false, x: 0 })
  
  const tableRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

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
    const column = defaultColumns.find(col => col.key === resizingColumn)
    const newWidth = Math.max(column?.minWidth || 100, startWidthRef.current + deltaX)
    
    const rect = tableRef.current?.getBoundingClientRect()
    if (rect) {
      setDragLine({ show: true, x: e.clientX - rect.left })
    }
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }))
  }, [isResizing, resizingColumn])

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

  return (
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
            {defaultColumns.map((column) => (
              <TableHead 
                key={column.key}
                className={`${column.sticky ? 'sticky left-0 bg-background z-30 border-r' : ''} relative`}
                style={{ 
                  width: `${columnWidths[column.key]}px`,
                  minWidth: `${columnWidths[column.key]}px`,
                  maxWidth: `${columnWidths[column.key]}px`
                }}
              >
                <div className="flex items-center gap-1 pr-4">
                  {column.label}
                  {column.key === 'name' && <ArrowUpDown className="w-4 h-4" />}
                </div>
                <div
                  className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/20 group"
                  onMouseDown={(e) => handleMouseDown(e, column.key)}
                >
                  <div className="absolute top-1/2 right-0 w-0.5 h-4 bg-border group-hover:bg-blue-500 transform -translate-y-1/2" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow 
              key={business.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onBusinessClick(business)}
            >
              <TableCell 
                className="sticky left-0 bg-background border-r z-10"
                style={{ 
                  width: `${columnWidths.name}px`,
                  minWidth: `${columnWidths.name}px`,
                  maxWidth: `${columnWidths.name}px`
                }}
              >
                <div 
                  className="font-medium text-blue-600 hover:underline truncate"
                  style={{ width: `${columnWidths.name - 24}px` }}
                  title={business.name}
                >
                  {business.name}
                </div>
              </TableCell>
              <TableCell 
                className="text-sm text-muted-foreground"
                style={{ 
                  width: `${columnWidths.address}px`,
                  minWidth: `${columnWidths.address}px`,
                  maxWidth: `${columnWidths.address}px`
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
              <TableCell 
                className="text-sm text-muted-foreground"
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
              <TableCell
                style={{ 
                  width: `${columnWidths.rating}px`,
                  minWidth: `${columnWidths.rating}px`,
                  maxWidth: `${columnWidths.rating}px`
                }}
              >
                {business.rating && business.reviewCount ? formatRating(business.rating, business.reviewCount) : '-'}
              </TableCell>
              <TableCell
                style={{ 
                  width: `${columnWidths.contact}px`,
                  minWidth: `${columnWidths.contact}px`,
                  maxWidth: `${columnWidths.contact}px`
                }}
              >
                <div className="flex items-center gap-2">
                  {business.phone && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  {business.website && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Globe className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell
                style={{ 
                  width: `${columnWidths.status}px`,
                  minWidth: `${columnWidths.status}px`,
                  maxWidth: `${columnWidths.status}px`
                }}
              >
                {getStatusBadge(business.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
