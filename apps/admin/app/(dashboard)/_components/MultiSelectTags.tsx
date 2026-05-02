"use client"

import * as React from "react"
import { Check, X, ChevronsUpDown } from "lucide-react"
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@repo/ui/components/atom/command";
import { Popover, PopoverTrigger, PopoverContent, Badge, cn } from "@repo/ui/index";
import { MultiSelectOption } from "@/types/product";

interface MultiSelectTagsProps {
  options: MultiSelectOption[];
  selected?: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
}

export function MultiSelectTags({ 
  options = [], 
  selected = [], 
  onChange,
  placeholder = "タグを選択..."
}: MultiSelectTagsProps) {
  const [open, setOpen] = React.useState(false)
  const isDisabled = options.length === 0;

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          tabIndex={isDisabled ? -1 : 0}
          className={cn(
            "flex h-auto min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
            isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
            !isDisabled && "hover:bg-accent hover:text-accent-foreground"
          )}
          onKeyDown={(e) => {
            if (isDisabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((val) => (
                <Badge key={val} className="font-normal border-orange-200 bg-orange-50 text-orange-900">
                  {options.find(o => o.label === val)?.label || val}
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none focus:ring-1 focus:ring-ring"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(val);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground ml-1">
                {isDisabled ? "選択肢がありません" : placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </div>
      </PopoverTrigger>
      
      {!isDisabled && (
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="検索..." />
            <CommandList>
              <CommandEmpty>見つかりませんでした。</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.label}
                    onSelect={() => {
                      const isSelected = selected.includes(option.label)
                      onChange(
                        isSelected
                          ? selected.filter((v) => v !== option.label)
                          : [...selected, option.label]
                      )
                    }}
                  >
                    <div className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.label) 
                        ? "bg-primary text-primary-foreground" 
                        : "opacity-50 [&_svg]:invisible"
                    )}>
                      <Check className="h-4 w-4" />
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  )
}