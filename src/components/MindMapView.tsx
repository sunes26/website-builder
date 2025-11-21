// src/components/MindMapView.tsx
import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useBuilderStore } from '@/store/builderStore';
import CustomEdge from './CustomEdge';
import { Plus } from 'lucide-react';

const edgeTypes = {
  labeled: CustomEdge,
};

export default function MindMapView() {
  const {
    project,
    addPage,
    addMindMapNode,
    addMindMapEdge,
    updateMindMapNode,
    updateMultipleMindMapNodes,
    updateMindMapEdge,
    setCurrentPage,
    setActiveTab,
  } = useBuilderStore();

  const tempLabelOffsets = useRef<Map<string, { x: number; y: number }>>(new Map());

  const initialNodes: Node[] = project?.mindMap.nodes.map((node) => ({
    id: node.id,
    type: 'default',
    data: {
      label: node.pageName,
      pageId: node.pageId,
    },
    position: node.position,
    draggable: true,
    style: {
      background: node.isMainPage ? '#eff6ff' : '#ffffff',
      border: node.isMainPage ? '2px solid #3b82f6' : '2px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: node.isMainPage ? '600' : '400',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'grab',
    },
  })) || [];

  const initialEdges: Edge[] = (() => {
    if (!project?.mindMap.edges) return [];

    const edgeCountMap = new Map<string, number>();
    const edgeIndexMap = new Map<string, number>();

    project.mindMap.edges.forEach((edge) => {
      const key = `${edge.source}-${edge.target}`;
      edgeCountMap.set(key, (edgeCountMap.get(key) || 0) + 1);
    });

    return project.mindMap.edges.map((edge) => {
      const key = `${edge.source}-${edge.target}`;
      const totalCount = edgeCountMap.get(key) || 1;
      const currentIndex = edgeIndexMap.get(key) || 0;
      edgeIndexMap.set(key, currentIndex + 1);

      let offset = 0;
      if (totalCount > 1) {
        offset = (currentIndex - (totalCount - 1) / 2) * 0.3;
      }

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'labeled',
        data: {
          label: edge.label,
          triggerBlockId: edge.triggerBlockId,
          triggerType: edge.triggerType,
          triggerIndex: edge.triggerIndex,
          offset: offset,
          totalCount: totalCount,
          labelOffset: edge.labelOffset || { x: 0, y: 0 },
        },
        animated: false,
        style: {
          stroke: edge.label ? '#3b82f6' : '#9ca3af',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edge.label ? '#3b82f6' : '#9ca3af',
        },
      };
    });
  })();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const handleLabelDrag = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { edgeId, labelOffset } = customEvent.detail;

      tempLabelOffsets.current.set(edgeId, labelOffset);

      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === edgeId
            ? { ...edge, data: { ...edge.data, labelOffset } }
            : edge
        )
      );
    };

    const handleLabelDragEnd = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { edgeId } = customEvent.detail;

      const labelOffset = tempLabelOffsets.current.get(edgeId);
      if (labelOffset) {
        updateMindMapEdge(edgeId, { labelOffset });
        tempLabelOffsets.current.delete(edgeId);
      }
    };

    window.addEventListener('edge-label-drag', handleLabelDrag);
    window.addEventListener('edge-label-drag-end', handleLabelDragEnd);

    return () => {
      window.removeEventListener('edge-label-drag', handleLabelDrag);
      window.removeEventListener('edge-label-drag-end', handleLabelDragEnd);
    };
  }, [setEdges, updateMindMapEdge]);

  useEffect(() => {
    if (project) {
      const updatedNodes: Node[] = project.mindMap.nodes.map((node) => ({
        id: node.id,
        type: 'default',
        data: {
          label: node.pageName,
          pageId: node.pageId,
        },
        position: node.position,
        draggable: true,
        style: {
          background: node.isMainPage ? '#eff6ff' : '#ffffff',
          border: node.isMainPage ? '2px solid #3b82f6' : '2px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: node.isMainPage ? '600' : '400',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: 'grab',
        },
      }));

      const updatedEdges: Edge[] = (() => {
        const edgeCountMap = new Map<string, number>();
        const edgeIndexMap = new Map<string, number>();

        project.mindMap.edges.forEach((edge) => {
          const key = `${edge.source}-${edge.target}`;
          edgeCountMap.set(key, (edgeCountMap.get(key) || 0) + 1);
        });

        return project.mindMap.edges.map((edge) => {
          const key = `${edge.source}-${edge.target}`;
          const totalCount = edgeCountMap.get(key) || 1;
          const currentIndex = edgeIndexMap.get(key) || 0;
          edgeIndexMap.set(key, currentIndex + 1);

          let offset = 0;
          if (totalCount > 1) {
            offset = (currentIndex - (totalCount - 1) / 2) * 0.3;
          }

          return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: 'labeled',
            data: {
              label: edge.label,
              triggerBlockId: edge.triggerBlockId,
              triggerType: edge.triggerType,
              triggerIndex: edge.triggerIndex,
              offset: offset,
              totalCount: totalCount,
              labelOffset: edge.labelOffset || { x: 0, y: 0 },
            },
            animated: false,
            style: {
              stroke: edge.label ? '#3b82f6' : '#9ca3af',
              strokeWidth: 2
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: edge.label ? '#3b82f6' : '#9ca3af',
            },
          };
        });
      })();

      setNodes(updatedNodes);
      setEdges(updatedEdges);
    }
  }, [project?.mindMap, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);

      if (params.source && params.target) {
        addMindMapEdge({
          source: params.source,
          target: params.target
        });
      }
    },
    [edges, setEdges, addMindMapEdge]
  );

  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      updateMindMapNode(node.id, { position: node.position });
    },
    [updateMindMapNode]
  );

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const pageId = node.data.pageId as string;

      if (pageId) {
        setCurrentPage(pageId);
        setActiveTab('editor');
      }
    },
    [setCurrentPage, setActiveTab]
  );

  const handleAddPage = () => {
    const pageName = prompt('새 페이지 이름을 입력하세요:', '새 페이지');
    if (!pageName) return;

    const pageId = `page-${Date.now()}`;
    const nodeId = `node-${Date.now()}`;

    const newPage = {
      id: pageId,
      name: pageName,
      route: `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
      blocks: [],
    };
    addPage(newPage);

    const nodePosition = {
      x: 250 + Math.random() * 200,
      y: 100 + Math.random() * 300,
    };

    const newNodeData = {
      id: nodeId,
      pageId: pageId,
      pageName: pageName,
      position: nodePosition,
      isMainPage: false,
    };

    addMindMapNode(newNodeData);
  };

  const handleAutoLayout = () => {
    if (!project?.mindMap.nodes.length) return;

    const nodes = project.mindMap.nodes;
    const edges = project.mindMap.edges;

    const mainNode = nodes.find(n => n.isMainPage);
    if (!mainNode) return;

    const childrenMap = new Map<string, string[]>();
    const parentMap = new Map<string, string>();

    edges.forEach(edge => {
      if (!childrenMap.has(edge.source)) {
        childrenMap.set(edge.source, []);
      }
      childrenMap.get(edge.source)!.push(edge.target);
      parentMap.set(edge.target, edge.source);
    });

    const BASE_NODE_WIDTH = 180;
    const HORIZONTAL_SPACING = 180;
    const LEVEL_HEIGHT = 200;
    const START_Y = 100;
    const MIN_NODE_SPACING = 100;
    const CHAR_WIDTH = 10;

    const calculateNodeWidth = (nodeId: string): number => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return BASE_NODE_WIDTH;

      const textLength = node.pageName.length;
      const dynamicWidth = Math.max(
        BASE_NODE_WIDTH,
        textLength * CHAR_WIDTH + 52
      );

      return dynamicWidth;
    };

    const calculateSubtreeWidth = (nodeId: string, memo: Map<string, number>): number => {
      if (memo.has(nodeId)) {
        return memo.get(nodeId)!;
      }

      const children = childrenMap.get(nodeId) || [];
      const nodeWidth = calculateNodeWidth(nodeId);

      if (children.length === 0) {
        memo.set(nodeId, nodeWidth);
        return nodeWidth;
      }

      let totalWidth = 0;
      children.forEach((childId, index) => {
        totalWidth += calculateSubtreeWidth(childId, memo);
        if (index < children.length - 1) {
          totalWidth += HORIZONTAL_SPACING;
        }
      });

      const width = Math.max(nodeWidth, totalWidth);
      memo.set(nodeId, width);
      return width;
    };

    const positionNodes = (
      nodeId: string,
      x: number,
      level: number,
      widthMemo: Map<string, number>,
      positions: Map<string, { x: number; y: number }>
    ) => {
      const y = START_Y + level * LEVEL_HEIGHT;
      positions.set(nodeId, { x, y });

      const children = childrenMap.get(nodeId) || [];
      if (children.length === 0) return;

      const subtreeWidth = widthMemo.get(nodeId) || calculateNodeWidth(nodeId);
      let currentX = x - subtreeWidth / 2;

      children.forEach((childId) => {
        const childWidth = widthMemo.get(childId) || calculateNodeWidth(childId);
        const childCenterX = currentX + childWidth / 2;

        positionNodes(childId, childCenterX, level + 1, widthMemo, positions);

        currentX += childWidth + HORIZONTAL_SPACING;
      });
    };

    const widthMemo = new Map<string, number>();
    calculateSubtreeWidth(mainNode.id, widthMemo);

    const positions = new Map<string, { x: number; y: number }>();
    const rootX = 600;
    positionNodes(mainNode.id, rootX, 0, widthMemo, positions);

    const connectedNodes = new Set(positions.keys());
    const unconnectedNodes = nodes.filter(n => !connectedNodes.has(n.id));

    if (unconnectedNodes.length > 0) {
      const maxLevel = Math.max(...Array.from(positions.values()).map(p => p.y));
      const unconnectedY = maxLevel + LEVEL_HEIGHT;

      const unconnectedWidths = unconnectedNodes.map(n => calculateNodeWidth(n.id));
      const totalUnconnectedWidth = unconnectedWidths.reduce((sum, w) => sum + w, 0) +
        (unconnectedNodes.length - 1) * HORIZONTAL_SPACING;

      let unconnectedX = rootX - totalUnconnectedWidth / 2;

      unconnectedNodes.forEach((node, index) => {
        const nodeWidth = unconnectedWidths[index];
        positions.set(node.id, { x: unconnectedX + nodeWidth / 2, y: unconnectedY });
        unconnectedX += nodeWidth + HORIZONTAL_SPACING;
      });
    }

    const resolveCollisions = (positions: Map<string, { x: number; y: number }>) => {
      const levelGroups = new Map<number, Array<{ id: string; x: number; width: number }>>();

      positions.forEach((pos, nodeId) => {
        if (!levelGroups.has(pos.y)) {
          levelGroups.set(pos.y, []);
        }
        levelGroups.get(pos.y)!.push({
          id: nodeId,
          x: pos.x,
          width: calculateNodeWidth(nodeId)
        });
      });

      levelGroups.forEach((nodesInLevel) => {
        nodesInLevel.sort((a, b) => a.x - b.x);

        for (let i = 0; i < nodesInLevel.length - 1; i++) {
          const current = nodesInLevel[i];
          const next = nodesInLevel[i + 1];

          const currentPos = positions.get(current.id)!;
          const nextPos = positions.get(next.id)!;

          const minDistance = (current.width / 2) + (next.width / 2) + MIN_NODE_SPACING;
          const actualDistance = nextPos.x - currentPos.x;

          if (actualDistance < minDistance) {
            const shift = minDistance - actualDistance;

            for (let j = i + 1; j < nodesInLevel.length; j++) {
              const nodeId = nodesInLevel[j].id;
              const pos = positions.get(nodeId)!;
              positions.set(nodeId, { x: pos.x + shift, y: pos.y });
              nodesInLevel[j].x += shift;
            }
          }
        }
      });
    };

    resolveCollisions(positions);

    const centerLayout = (positions: Map<string, { x: number; y: number }>) => {
      const levelGroups = new Map<number, { min: number; max: number }>();

      positions.forEach((pos) => {
        if (!levelGroups.has(pos.y)) {
          levelGroups.set(pos.y, { min: pos.x, max: pos.x });
        }
        const group = levelGroups.get(pos.y)!;
        group.min = Math.min(group.min, pos.x);
        group.max = Math.max(group.max, pos.x);
      });

      levelGroups.forEach((bounds, y) => {
        const currentCenter = (bounds.min + bounds.max) / 2;
        const offset = rootX - currentCenter;

        positions.forEach((pos, nodeId) => {
          if (pos.y === y) {
            positions.set(nodeId, { x: pos.x + offset, y: pos.y });
          }
        });
      });
    };

    centerLayout(positions);
    resolveCollisions(positions);

    const updates = Array.from(positions.entries()).map(([nodeId, position]) => ({
      nodeId,
      position
    }));

    updateMultipleMindMapNodes(updates);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">사이트 구조 (마인드맵)</h3>
          <p className="text-xs text-gray-500 mt-1">
            노드를 드래그하여 연결하거나, 블록의 버튼 동작을 설정하여 자동으로 연결하세요
            <br />
            <span className="text-blue-600 font-medium">💡 Tip: 노드를 더블클릭하면 해당 페이지 에디터로 이동합니다</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoLayout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-gray-300"
            title="노드를 계층적 트리 구조로 자동 정렬합니다"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            자동 정렬
          </button>

          <button
            onClick={handleAddPage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            새 페이지 추가
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-b text-xs flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">파란색 라벨: 버튼 액션 연결</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-gray-600">회색: 수동 연결</span>
        </div>
      </div>

      <div className="h-[calc(100%-170px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onNodeDoubleClick={onNodeDoubleClick}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          fitView
          attributionPosition="bottom-right"
          defaultEdgeOptions={{
            type: 'labeled',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => node.style?.background as string || '#fff'}
            nodeBorderRadius={8}
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  );
}
