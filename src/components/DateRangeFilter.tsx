// import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import type { DateRange } from "@/types/api";

// interface DateRangeFilterProps {
//   date?: DateRange;
//   onRangeChange: (range: DateRange) => void;
// }

// export function DateRangeFilter({ date, onRangeChange }: DateRangeFilterProps) {
//   // Track active filter
//   const [activeFilter, setActiveFilter] = useState<'7days' | '30days' | 'custom'>('30days');

//   // Get date range helper
//   const getDateRange = (days: number): DateRange => {
//     const today = new Date();
//     today.setHours(23, 59, 59, 999);
    
//     const from = new Date();
//     from.setDate(today.getDate() - days);
//     from.setHours(0, 0, 0, 0);
    
//     return { from, to: today };
//   };

//   // Initialize with last 30 days if no date provided
//   useEffect(() => {
//     if (!date?.from || !date?.to) {
//       onRangeChange(getDateRange(30));
//       setActiveFilter('30days');
//     }
//   }, []);

//   const formatDate = (date: Date | undefined) => {
//     if (!date) return '';
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get current selection or default
//   const currentSelection = date || getDateRange(30);

//   // Helper to check if a date range matches 7 or 30 days
//   const isDateRangeEqual = (range: DateRange, days: number) => {
//     const targetRange = getDateRange(days);
//     return (
//       range.from?.getTime() === targetRange.from.getTime() &&
//       range.to?.getTime() === targetRange.to.getTime()
//     );
//   };

//   // Update active filter when date changes
//   useEffect(() => {
//     if (date) {
//       if (isDateRangeEqual(date, 7)) {
//         setActiveFilter('7days');
//       } else if (isDateRangeEqual(date, 30)) {
//         setActiveFilter('30days');
//       } else {
//         setActiveFilter('custom');
//       }
//     }
//   }, [date]);

//   const getButtonStyle = (filter: '7days' | '30days') => {
//     return activeFilter === filter
//       ? "px-3 py-2 text-sm bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
//       : "px-3 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <div className="flex rounded-md shadow-sm">
//         <Button
//           variant="outline"
//           size="sm"
//           className={getButtonStyle('7days')}
//           onClick={() => {
//             setActiveFilter('7days');
//             onRangeChange(getDateRange(7));
//           }}
//         >
//           Last 7 Days
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           className={getButtonStyle('30days')}
//           onClick={() => {
//             setActiveFilter('30days');
//             onRangeChange(getDateRange(30));
//           }}
//         >
//           Last 30 Days
//         </Button>
//       </div>

//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             size="sm"
//             className={`w-[240px] justify-start text-left font-normal ${
//               activeFilter === 'custom'
//                 ? "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
//                 : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
//             }`}
//           >
//             <span className="mr-2">📅</span>
//             {formatDate(currentSelection.from)} - {formatDate(currentSelection.to)}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="range"
//             selected={{
//               from: currentSelection.from,
//               to: currentSelection.to
//             }}
//             onSelect={(newDate: any) => {
//               if (newDate?.from) {
//                 const from = new Date(newDate.from);
//                 from.setHours(0, 0, 0, 0);
//                 const to = newDate.to ? new Date(newDate.to) : new Date();
//                 to.setHours(23, 59, 59, 999);
//                 setActiveFilter('custom');
//                 onRangeChange({ from, to });
//               }
//             }}
//             numberOfMonths={2}
//             className="rounded-md border dark:bg-gray-800 dark:border-gray-700"
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import type { DateRange } from "@/types/api";

interface DateRangeFilterProps {
  date?: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({ date, onRangeChange }: DateRangeFilterProps) {
  // Track active filter
  const [activeFilter, setActiveFilter] = useState<'yesterday' | '7days' | '30days' | '90days' | 'custom'>('30days');
  
  // Track calendar popover open state
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Track if we're selecting start or end date
  const [selectionPhase, setSelectionPhase] = useState<'start' | 'end'>('start');
  
  // Track temporary selection
  const [tempSelection, setTempSelection] = useState<{ from?: Date, to?: Date }>({});
  
  // Track if select dropdown is open
  const [selectOpen, setSelectOpen] = useState(false);
  
  // Ref for the trigger element
  const triggerRef = useRef(null);

  // Get date range helper
  const getDateRange = (days: number): DateRange => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const from = new Date();
    from.setDate(today.getDate() - days);
    from.setHours(0, 0, 0, 0);
    
    return { from, to: today };
  };
  
  // Get yesterday's date range
  const getYesterdayRange = (): DateRange => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);
    
    return { from: yesterday, to: yesterdayEnd };
  };

  // Initialize with last 30 days if no date provided
  useEffect(() => {
    if (!date?.from || !date?.to) {
      onRangeChange(getDateRange(30));
      setActiveFilter('30days');
    }
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get current selection or default
  const currentSelection = date || getDateRange(30);

  // Helper to check if a date range matches a specific predefined range
  const isDateRangeEqual = (range: DateRange, days: number) => {
    const targetRange = getDateRange(days);
    return (
      range.from?.getTime() === targetRange.from.getTime() &&
      range.to?.getTime() === targetRange.to.getTime()
    );
  };
  
  // Helper to check if a date range is yesterday
  const isYesterday = (range: DateRange) => {
    const yesterdayRange = getYesterdayRange();
    return (
      range.from?.getTime() === yesterdayRange.from.getTime() &&
      range.to?.getTime() === yesterdayRange.to.getTime()
    );
  };

  // Update active filter when date changes
  useEffect(() => {
    if (date) {
      if (isYesterday(date)) {
        setActiveFilter('yesterday');
      } else if (isDateRangeEqual(date, 7)) {
        setActiveFilter('7days');
      } else if (isDateRangeEqual(date, 30)) {
        setActiveFilter('30days');
      } else if (isDateRangeEqual(date, 90)) {
        setActiveFilter('90days');
      } else {
        setActiveFilter('custom');
      }
    }
  }, [date]);

  // Handle dropdown selection change
  const handleFilterChange = (value: string) => {
    switch (value) {
      case 'yesterday':
        setActiveFilter('yesterday');
        onRangeChange(getYesterdayRange());
        // Close the calendar if it was open
        setCalendarOpen(false);
        break;
      case '7days':
        setActiveFilter('7days');
        onRangeChange(getDateRange(7));
        // Close the calendar if it was open
        setCalendarOpen(false);
        break;
      case '30days':
        setActiveFilter('30days');
        onRangeChange(getDateRange(30));
        // Close the calendar if it was open
        setCalendarOpen(false);
        break;
      case '90days':
        setActiveFilter('90days');
        onRangeChange(getDateRange(90));
        // Close the calendar if it was open
        setCalendarOpen(false);
        break;
      case 'custom':
        setActiveFilter('custom');
        // Reset selection state
        setSelectionPhase('start');
        setTempSelection({});
        // Open the calendar
        setTimeout(() => {
          setCalendarOpen(true);
        }, 100);
        break;
      default:
        break;
    }
  };

  // Get emoji for each time period
  const getFilterEmoji = () => {
    switch (activeFilter) {
      case 'yesterday':
        return '⏪';
      case '7days':
        return '🗓️';
      case '30days':
        return '📅';
      case '90days':
        return '📆';
      case 'custom':
        return '✨';
      default:
        return '🕒';
    }
  };

  // Format the display text based on the current selection
  const getDisplayText = () => {
    switch (activeFilter) {
      case 'yesterday':
        return 'Yesterday';
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case '90days':
        return 'Last 90 Days';
      case 'custom':
        return `${formatDate(currentSelection.from)} - ${formatDate(currentSelection.to)}`;
      default:
        return 'Select date range';
    }
  };

  // Handle calendar date selection for start date
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      setTempSelection({ from: startDate });
      setSelectionPhase('end');
    }
  };

  // Handle calendar date selection for end date
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date && tempSelection.from) {
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      // If end date is before start date, swap them
      if (endDate < tempSelection.from) {
        const newRange = { from: endDate, to: tempSelection.from };
        onRangeChange(newRange);
      } else {
        const newRange = { from: tempSelection.from, to: endDate };
        onRangeChange(newRange);
      }
      
      // Close calendar after selection is complete
      setTimeout(() => {
        setCalendarOpen(false);
        setSelectionPhase('start');
      }, 300);
    }
  };

  // Handle apply button click
  const handleApplyClick = () => {
    if (tempSelection.from && tempSelection.to) {
      const from = new Date(tempSelection.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(tempSelection.to);
      to.setHours(23, 59, 59, 999);
      
      onRangeChange({ from, to });
      setCalendarOpen(false);
    }
  };

  return (
    <div className="relative flex">
      {/* Date Range Dropdown */}
      <Select 
        value={activeFilter} 
        onValueChange={handleFilterChange}
        open={selectOpen}
        onOpenChange={(open) => {
          setSelectOpen(open);
          // If dropdown is closing and custom is selected, keep calendar open
          if (!open && activeFilter === 'custom') {
            setTimeout(() => {
              setCalendarOpen(true);
            }, 100);
          }
        }}
      >
        <SelectTrigger 
          ref={triggerRef}
          className="w-[320px] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-2 border-indigo-100 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium"
        >
          <div className="flex items-center gap-2 w-full">
            <span className="text-lg">{getFilterEmoji()}</span>
            <SelectValue className="flex-grow truncate">{getDisplayText()}</SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-600 rounded-lg shadow-lg animate-in fade-in-80 zoom-in-95 duration-200 w-[320px]">
          <SelectItem value="yesterday" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">⏪</span> Yesterday
          </SelectItem>
          <SelectItem value="7days" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">🗓️</span> Last 7 Days
          </SelectItem>
          <SelectItem value="30days" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">📅</span> Last 30 Days
          </SelectItem>
          <SelectItem value="90days" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">📆</span> Last 90 Days
          </SelectItem>
          <SelectItem value="custom" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer p-3 my-1 rounded-md flex items-center gap-2 transition-colors duration-200">
            <span className="text-lg mr-2">✨</span> Custom Range
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Separate Popover for Calendar */}
      <Popover 
        open={activeFilter === 'custom' && calendarOpen} 
        onOpenChange={(open) => {
          // Only allow manually closing, not opening
          if (!open) setCalendarOpen(false);
        }}
      >
        <PopoverTrigger asChild>
          <div className="absolute top-0 left-0 w-1 h-1 opacity-0"></div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
          align="start" 
          side="bottom"
          sideOffset={5}
          avoidCollisions={false}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-indigo-500 dark:text-indigo-300 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectionPhase === 'start' 
                    ? "Select start date:" 
                    : "Select end date:"}
                </span>
              </div>
              {selectionPhase === 'end' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectionPhase('start')}
                  className="h-8 text-xs text-indigo-600 dark:text-indigo-400"
                >
                  Back
                </Button>
              )}
            </div>
            
            {/* Show the selected range so far */}
            {tempSelection.from && (
              <div className="text-sm mb-2 bg-indigo-50 dark:bg-gray-700 p-2 rounded">
                <span className="font-medium">Range: </span>
                {formatDate(tempSelection.from)} 
                {tempSelection.to ? ` - ${formatDate(tempSelection.to)}` : ' (selecting end date...)'}
              </div>
            )}
            
            {/* Start Date Calendar */}
            {selectionPhase === 'start' && (
              <Calendar
                mode="single"
                selected={tempSelection.from}
                onSelect={handleStartDateSelect}
                className="w-full bg-white dark:bg-gray-800"
                initialFocus
              />
            )}
            
            {/* End Date Calendar */}
            {selectionPhase === 'end' && (
              <Calendar
                mode="single"
                selected={tempSelection.to}
                onSelect={handleEndDateSelect}
                className="w-full bg-white dark:bg-gray-800"
                initialFocus
                defaultMonth={tempSelection.from}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}