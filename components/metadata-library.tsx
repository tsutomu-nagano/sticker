"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { MetadataType } from "./metadata-flow-editor"

export interface MetadataItem {
  id: string
  label: string
  type: MetadataType
  tags: string[]
  description: string
}

const defaultLibraryItems: MetadataItem[] = [
  {
    id: "lib-1",
    label: "年齢階級",
    type: "classification",
    tags: ["人口統計", "基本分類"],
    description: "5歳刻みの年齢階級分類",
  },
  {
    id: "lib-2",
    label: "都道府県",
    type: "classification",
    tags: ["地域", "基本分類"],
    description: "47都道府県による地域分類",
  },
  {
    id: "lib-3",
    label: "性別",
    type: "classification",
    tags: ["人口統計", "基本分類"],
    description: "男女別の分類",
  },
  {
    id: "lib-4",
    label: "人口総数",
    type: "aggregation",
    tags: ["人口統計", "集計値"],
    description: "各区分における人口の合計",
  },
  {
    id: "lib-5",
    label: "世帯数",
    type: "aggregation",
    tags: ["世帯統計", "集計値"],
    description: "各区分における世帯数の合計",
  },
  {
    id: "lib-6",
    label: "時系列",
    type: "dimension",
    tags: ["時間", "次元"],
    description: "年次・月次などの時間軸",
  },
  {
    id: "lib-7",
    label: "増加率",
    type: "measure",
    tags: ["計算指標", "比率"],
    description: "前年比・前期比などの増加率",
  },
]

interface MetadataLibraryProps {
  onItemDoubleClick: (item: MetadataItem) => void
  onItemDragStart: (item: MetadataItem) => void
}

export function MetadataLibrary({ onItemDoubleClick, onItemDragStart }: MetadataLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [libraryItems] = useState<MetadataItem[]>(defaultLibraryItems)

  const availableTags = Array.from(new Set(libraryItems.flatMap((item) => item.tags)))

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const typeColors: Record<MetadataType, string> = {
    classification: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    aggregation: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    dimension: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    measure: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  }

  const typeLabels: Record<MetadataType, string> = {
    classification: "分類",
    aggregation: "集計",
    dimension: "次元",
    measure: "指標",
  }

  return (
    <aside className="w-80 border-r border-border bg-sidebar flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground mb-2">メタデータライブラリ</h1>
        <p className="text-sm text-sidebar-foreground/70">項目をダブルクリックまたはドラッグ</p>
      </div>

      <div className="p-6 space-y-4 border-b border-border">
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2 text-sidebar-foreground">
            <Search className="h-4 w-4" />
            検索
          </Label>
          <Input
            id="search"
            placeholder="項目名や説明で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-sidebar-accent"
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sidebar-foreground">
            <Tag className="h-4 w-4" />
            タグフィルター
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`p-3 cursor-pointer hover:bg-accent/50 transition-colors border ${typeColors[item.type]}`}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "copy"
              onItemDragStart(item)
            }}
            onDoubleClick={() => onItemDoubleClick(item)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-sm">{item.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {typeLabels[item.type]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">該当する項目がありません</div>
        )}
      </div>
    </aside>
  )
}
