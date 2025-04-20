// import * as React from "react";
// import { cn } from "@/lib/utils";

// const Table = React.forwardRef<
//   HTMLTableElement,
//   React.HTMLAttributes<HTMLTableElement>
// >(({ className, ...props }, ref) => (
//   <div className="relative w-full overflow-hidden rounded-lg shadow-lg ">
//     <table
//       ref={ref}
//       className={cn(
//         "w-full text-sm border-collapse bg-white dark:bg-gray-900 ",
//         className
//       )}
//       {...props}
//     />
//   </div>
// ));
// Table.displayName = "Table";

// const TableHeader = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <thead
//     ref={ref}
//     className={cn("bg-gradient-to-r from-blue-500 to-blue-700 text-white  ", className)}
//     {...props}
//   />
// ));
// TableHeader.displayName = "TableHeader";

// const TableBody = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tbody
//     ref={ref}
//     className={cn("divide-y divide-gray-200 ", className)}
//     {...props}
//   />
// ));
// TableBody.displayName = "TableBody";

// const TableFooter = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tfoot
//     ref={ref}
//     className={cn("bg-gray-100 dark:bg-gray-800 font-medium", className)}
//     {...props}
//   />
// ));
// TableFooter.displayName = "TableFooter";

// const TableRow = React.forwardRef<
//   HTMLTableRowElement,
//   React.HTMLAttributes<HTMLTableRowElement>
// >(({ className, ...props }, ref) => (
//   <tr
//     ref={ref}
//     className={cn(
//       "border-b border-gray-200 dark:border-gray-700 transition-all   ",
//       className
//     )}
//     {...props}
//   />
// ));
// TableRow.displayName = "TableRow";

// const TableHead = React.forwardRef<
//   HTMLTableCellElement,
//   React.ThHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <th
//     ref={ref}
//     className={cn(
//       "px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-white dark:text-gray-300 ",
//       className
//     )}
//     {...props}
//   />
// ));
// TableHead.displayName = "TableHead";

// const TableCell = React.forwardRef<
//   HTMLTableCellElement,
//   React.TdHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <td
//     ref={ref}
//     className={cn(
//       "px-6 py-4 text-gray-800 dark:text-gray-200",
//       className
//     )}
//     {...props}
//   />
// ));
// TableCell.displayName = "TableCell";

// const TableCaption = React.forwardRef<
//   HTMLTableCaptionElement,
//   React.HTMLAttributes<HTMLTableCaptionElement>
// >(({ className, ...props }, ref) => (
//   <caption
//     ref={ref}
//     className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
//     {...props}
//   />
// ));
// TableCaption.displayName = "TableCaption";

// export {
//   Table,
//   TableHeader,
//   TableBody,
//   TableFooter,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableCaption,
// };

import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-hidden rounded-lg shadow-lg ">
    <table
      ref={ref}
      className={cn(
        "w-full text-sm border-collapse bg-white dark:bg-gray-900 ",
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gradient-to-r from-teal-500 to-teal-600 text-white", className)}
  
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-200 ", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-gray-100 dark:bg-gray-800 font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-gray-200 dark:border-gray-700 transition-all",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-white dark:text-gray-300",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-6 py-4 text-gray-800 dark:text-gray-200",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};