import { useState } from "react";
import type { FileStructure } from "../types";
import "./FileStructureDisplay.css";

interface FileStructureDisplayProps {
  fileStructure: FileStructure;
}

interface FileNodeProps {
  node: FileStructure;
  level: number;
}

const FileNode: React.FC<FileNodeProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Expand first two levels by default

  const hasChildren = node.children && node.children.length > 0;
  const indent = level * 20;

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="file-node">
      <div
        className={`file-item ${node.type} ${hasChildren ? "expandable" : ""}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={toggleExpanded}
      >
        {hasChildren && (
          <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
            ▶
          </span>
        )}
        <span className="file-icon">
          {node.type === "folder" ? "📁" : "📄"}
        </span>
        <span className="file-name">{node.name}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="file-children">
          {node.children!.map((child, index) => (
            <FileNode
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileStructureDisplay: React.FC<FileStructureDisplayProps> = ({
  fileStructure,
}) => {
  return (
    <div className="file-structure">
      <h4>📁 Structure du projet</h4>
      <div className="file-tree">
        <FileNode node={fileStructure} level={0} />
      </div>
    </div>
  );
};

export default FileStructureDisplay;
