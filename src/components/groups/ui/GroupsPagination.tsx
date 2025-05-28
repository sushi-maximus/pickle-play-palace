
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GroupsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const GroupsPagination = ({ currentPage, totalPages, onPageChange }: GroupsPaginationProps) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always include first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('ellipsis-start');
    }
    
    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <nav 
      className="mt-6" 
      role="navigation" 
      aria-label="Groups pagination"
    >
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={handlePrevious} 
              onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage === 1}
              aria-label={`Go to previous page, page ${currentPage - 1}`}
              tabIndex={currentPage === 1 ? -1 : 0}
            />
          </PaginationItem>
          
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis aria-label="More pages" />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page as number)}
                  onKeyDown={(e) => handleKeyDown(e, () => onPageChange(page as number))}
                  className="cursor-pointer"
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  tabIndex={0}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={handleNext}
              onKeyDown={(e) => handleKeyDown(e, handleNext)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              aria-disabled={currentPage === totalPages}
              aria-label={`Go to next page, page ${currentPage + 1}`}
              tabIndex={currentPage === totalPages ? -1 : 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </nav>
  );
};
