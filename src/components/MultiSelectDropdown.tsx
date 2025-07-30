
import { useState, useRef, useEffect } from "react"
import { ChevronDown, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  label: string
  options: Option[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Search...",
  className
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOptions = options.filter(option => 
    selectedValues.includes(option.value)
  )

  const toggleOption = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newSelection)
  }

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectionChange(selectedValues.filter(v => v !== value))
  }

  const clearAll = () => {
    onSelectionChange([])
    setSearchTerm("")
  }

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-auto min-h-[40px] justify-start text-left font-normal px-3 py-2",
              selectedValues.length === 0 && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{label}</span>
                {selectedValues.length > 0 && (
                  <>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      {selectedValues.length}
                    </span>
                  </>
                )}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0" 
          align="start"
          side="bottom"
        >
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {selectedOptions.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map(option => (
                    <div
                      key={option.value}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md"
                    >
                      <span>{option.label}</span>
                      <button
                        type="button"
                        onClick={(e) => removeOption(option.value, e)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={clearAll}
                  className="mt-2 p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
          
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No options found
              </div>
            ) : (
              <div className="p-1">
                {filteredOptions.map(option => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 border rounded flex items-center justify-center",
                          isSelected && "bg-primary border-primary"
                        )}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                          )}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
