"use client"

import type React from "react"

import { useCallback, useState, useEffect, useRef } from "react"
import ReactFlow, {
  type Node,
  type Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  type NodeTypes,
  type ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"
import { MetadataNode } from "./metadata-node"
import { MetadataLibrary, type MetadataItem } from "./metadata-library"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type MetadataType = "classification" | "aggregation" | "dimension" | "measure"

export interface MetadataNodeData {
  label: string
  type: MetadataType
  tags: string[]
  description: string
  createdAt: string
}

const nodeTypes: NodeTypes = {
  metadataNode: MetadataNode,
}

export function MetadataFlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<MetadataNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const draggedItemRef = useRef<MetadataItem | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNodes = localStorage.getItem("metadataFlowNodes")
    const savedEdges = localStorage.getItem("metadataFlowEdges")
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes))
    }
    if (savedEdges) {
      setEdges(JSON.parse(savedEdges))
    }
  }, [setNodes, setEdges])

  // Save data to localStorage whenever nodes or edges change
  useEffect(() => {
    localStorage.setItem("metadataFlowNodes", JSON.stringify(nodes))
  }, [nodes])

  useEffect(() => {
    localStorage.setItem("metadataFlowEdges", JSON.stringify(edges))
  }, [edges])

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges],
  )

  const addNodeFromLibrary = useCallback(
    (item: MetadataItem, position?: { x: number; y: number }) => {
      const newNode: Node<MetadataNodeData> = {
        id: `${Date.now()}-${Math.random()}`,
        type: "metadataNode",
        position: position || { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        data: {
          label: item.label,
          type: item.type,
          tags: item.tags,
          description: item.description,
          createdAt: new Date().toISOString(),
        },
      }
      setNodes((nds) => [...nds, newNode])
    },
    [setNodes],
  )

  const handleItemDoubleClick = useCallback(
    (item: MetadataItem) => {
      addNodeFromLibrary(item)
    },
    [addNodeFromLibrary],
  )

  const handleItemDragStart = useCallback((item: MetadataItem) => {
    draggedItemRef.current = item
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!draggedItemRef.current || !reactFlowInstance) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addNodeFromLibrary(draggedItemRef.current, position)
      draggedItemRef.current = null
    },
    [reactFlowInstance, addNodeFromLibrary],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const updateNode = useCallback(
    (id: string, data: Partial<MetadataNodeData>) => {
      setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node)))
    },
    [setNodes],
  )

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id))
      setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id))
    },
    [setNodes, setEdges],
  )

  const clearAll = useCallback(() => {
    setNodes([])
    setEdges([])
  }, [setNodes, setEdges])

  const stats = {
    total: nodes.length,
    classification: nodes.filter((n) => n.data.type === "classification").length,
    aggregation: nodes.filter((n) => n.data.type === "aggregation").length,
    dimension: nodes.filter((n) => n.data.type === "dimension").length,
    measure: nodes.filter((n) => n.data.type === "measure").length,
  }

  return (
    <div className="flex h-full w-full">
      <MetadataLibrary onItemDoubleClick={handleItemDoubleClick} onItemDragStart={handleItemDragStart} />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border bg-background p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">キャンバス</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">総数: {stats.total}</Badge>
              {stats.classification > 0 && <Badge variant="outline">分類: {stats.classification}</Badge>}
              {stats.aggregation > 0 && <Badge variant="outline">集計: {stats.aggregation}</Badge>}
              {stats.dimension > 0 && <Badge variant="outline">次元: {stats.dimension}</Badge>}
              {stats.measure > 0 && <Badge variant="outline">指標: {stats.measure}</Badge>}
            </div>
          </div>
          <Button onClick={clearAll} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Trash2 className="h-4 w-4" />
            すべてクリア
          </Button>
        </div>
        <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="bg-muted/20" />
            <Controls className="bg-card border border-border" />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}
