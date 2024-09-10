import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface SearchBar {
    onSearchButton: (keywords: string) => void,
}

export const SearchBar = ({ onSearchButton }: SearchBar) => {
    // 关键词筛选
    const [searchInput, setSearchInput] = useState("");
    return (
        <div className="flex w-80 space-x-1">
            <div className="flex w-64">
                <Input className="w-full h-8 text-xs rounded-r-none focus-visible:ring-transparent"
                    placeholder="搜索标题或者描述..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)} />
                <Button className="h-8 rounded-l-none" onClick={() => onSearchButton(searchInput)}>搜索</Button>
            </div>
        </div>
    );
}