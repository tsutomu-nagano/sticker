"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Node } from "reactflow"
import type { MetadataNodeData } from "./metadata-flow-editor"

interface SidebarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  availableTags: string[]
  nodes: Node<MetadataNodeData>[]
}

export function Sidebar({
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  availableTags,
  nodes,
}: SidebarProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const stats = {
    total: nodes.length,
    classification: nodes.filter((n) => n.data.type === "classification").length,
    aggregation: nodes.filter((n) => n.data.type === "aggregation").length,
    dimension: nodes.filter((n) => n.data.type === "dimension").length,
    measure: nodes.filter((n) => n.data.type === "measure").length,
  }

  return (
    <aside className="w-80 border-r border-border bg-sidebar p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-sidebar-foreground mb-2">メタデータ管理</h1>
        <p className="text-sm text-sidebar-foreground/70">統計表の分類・集計事項を可視化</p>
      </div>

      <Card className="p-4 bg-sidebar-accent/50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-sidebar-foreground">総項目数</span>
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-sidebar-foreground/70">分類</span>
              <span className="font-medium text-sidebar-foreground">{stats.classification}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sidebar-foreground/70">集計</span>
              <span className="font-medium text-sidebar-foreground">{stats.aggregation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sidebar-foreground/70">次元</span>
              <span className="font-medium text-sidebar-foreground">{stats.dimension}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sidebar-foreground/70">指標</span>
              <span className="font-medium text-sidebar-foreground">{stats.measure}</span>
            </div>
          </div>
        </div>
      </Card>

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
          {availableTags.length === 0 && <p className="text-xs text-sidebar-foreground/50">タグがありません</p>}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sidebar-foreground">
              <Filter className="h-4 w-4" />
              適用中のフィルター
            </Label>
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              クリア
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} className="gap-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
