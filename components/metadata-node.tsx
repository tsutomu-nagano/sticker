"use client"

import { memo, useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import type { MetadataNodeData } from "./metadata-flow-editor"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const typeColors = {
  classification: "bg-chart-1 border-chart-1",
  aggregation: "bg-chart-2 border-chart-2",
  dimension: "bg-chart-3 border-chart-3",
  measure: "bg-chart-4 border-chart-4",
}

const typeLabels = {
  classification: "分類",
  aggregation: "集計",
  dimension: "次元",
  measure: "指標",
}

export const MetadataNode = memo(({ data, id }: NodeProps<MetadataNodeData>) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)

  const handleSave = () => {
    // This will be handled by parent component through context
    setIsEditing(false)
  }

  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-primary" />
      <Card
        className={`min-w-[200px] max-w-[280px] border-2 shadow-lg ${
          typeColors[data.type]
        } bg-card/95 backdrop-blur-sm`}
      >
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">{data.label}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{typeLabels[data.type]}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>メタデータを編集</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="label">名称</Label>
                      <Input
                        id="label"
                        value={editData.label}
                        onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">タイプ</Label>
                      <Select
                        value={editData.type}
                        onValueChange={(value) => setEditData({ ...editData, type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classification">分類</SelectItem>
                          <SelectItem value="aggregation">集計</SelectItem>
                          <SelectItem value="dimension">次元</SelectItem>
                          <SelectItem value="measure">指標</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">説明</Label>
                      <Textarea
                        id="description"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">タグ（カンマ区切り）</Label>
                      <Input
                        id="tags"
                        value={editData.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full">
                      保存
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {data.description && <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
    </>
  )
})

MetadataNode.displayName = "MetadataNode"
