import React from 'react';
import Button from '@material-ui/core/Button';
import './DiagramButtons.css';

const DiagramButton = ({ onInit, onUpdateColor, onAddNode }) => {
  return (
    <div className="centered-container">
      <div className="inline-element">
        <Button color="default" onClick={onInit}>
          初始化
        </Button>
      </div>
      <div className="inline-element">
        <Button color="default" onClick={onUpdateColor}>
          节点颜色
        </Button>
      </div>
      <div className="inline-element" onClick={onAddNode}>
        <Button color="default">当前节点新增子节点</Button>
      </div>
    </div>
  );
};

export default DiagramButton;
