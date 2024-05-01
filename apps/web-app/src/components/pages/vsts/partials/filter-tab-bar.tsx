import { XCircle } from 'lucide-react';
import React from 'react';
import { Badge } from 'vst-ui';
import { cn } from 'vst-ui/src/lib/utils';

const FilterTabBar: React.FC<{
    selectedCreators: string[];
    setSelectedCreators: (values: string[]) => void;
    selectedTags: string[];
    setSelectedTags: (values: string[]) => void;
}> = ({...props}) => {
    return (
        <>
           <div
          className={cn(
            "max-w-screen sticky top-0 z-10 mb-5 flex items-center gap-2 overflow-x-auto border-l border-border bg-background/90 p-3 backdrop-blur-sm lg:border-b",
          )}
        >
          {!!props.selectedCreators?.length && (
            <>
              <p className="text-xs font-medium leading-none">Creators</p>
              <div className="flex gap-x-2">
                {props.selectedCreators.map((tag) => (
                  <button
                    onClick={() => {
                      props.setSelectedCreators((prev) =>
                        prev.filter((t) => t !== tag),
                      );
                    }}
                    key={tag}
                  >
                    <Badge
                      variant="secondary"
                      className="group flex shrink-0 items-center gap-x-1"
                    >
                      <span>{tag}</span>
                      <XCircle className="hidden h-3 w-3 group-hover:flex" />
                    </Badge>
                  </button>
                ))}
              </div>
            </>
          )}

          {!!props.selectedTags?.length && (
            <>
              <p className="ml-2 text-xs font-medium leading-none">Tags</p>
              <div className="flex gap-x-2">
                {props.selectedTags.map((tag) => (
                  <button
                    onClick={() => {
                      props.setSelectedTags((prev) => prev.filter((t) => t !== tag));
                    }}
                    key={tag}
                  >
                    <Badge
                      variant="secondary"
                      className="group flex shrink-0 items-center gap-x-1"
                    >
                      <span>{tag}</span>
                      <XCircle className="hidden h-3 w-3 group-hover:flex" />
                    </Badge>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        </>
    );
};

export default FilterTabBar;
