import { Input } from "@/components/ui/input";

interface SearchBar {
    searchInput: string,
    onSearchInput: (searchInput: string) => void,
}

export const SearchBar = ({ searchInput, onSearchInput }: SearchBar) => {
    return (
        <div className="flex w-80 space-x-1">
            <div className="flex w-64">
                <Input className="w-full h-8 text-xs focus-visible:ring-transparent"
                    placeholder="搜索标题或者描述..."
                    value={searchInput}
                    onChange={(e) => onSearchInput(e.target.value)} />
            </div>
        </div>
    );
}