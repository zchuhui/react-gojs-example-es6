import React from 'react';
import * as go from 'gojs';
import { ToolManager, Diagram } from 'gojs';
import { GojsDiagram, ModelChangeEventType } from 'react-gojs';
import DiagramButtons from './DiagramButtons';
import './MyDiagram.css';
import { getRandomColor } from '../Helpers/ColorHelper';
import SelectionDetails from './SelectionDetails';

class MyDiagram extends React.Component {
  nodeId = 0;

  constructor(props) {
    super(props);

    this.createDiagram = this.createDiagram.bind(this);
    this.modelChangeHandler = this.modelChangeHandler.bind(this);
    this.initModelHandler = this.initModelHandler.bind(this);
    this.updateColorHandler = this.updateColorHandler.bind(this);
    this.nodeSelectionHandler = this.nodeSelectionHandler.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.addNode = this.addNode.bind(this);

    this.state = {
      selectedNodeKeys: [],
      model: {
        nodeDataArray: [{ key: 'Alpha', color: 'lightblue' }],
        linkDataArray: []
      }
    };
  }

  render() {
    return [
      <DiagramButtons
        key="diagramButtons"
        onInit={this.initModelHandler}
        onUpdateColor={this.updateColorHandler}
        onAddNode={this.addNode}
      />,
      <SelectionDetails key="selectionDetails" selectedNodes={this.state.selectedNodeKeys} />,
      <GojsDiagram
        key="gojsDiagram"
        diagramId="myDiagramDiv"
        model={this.state.model}
        createDiagram={this.createDiagram}
        className="myDiagram"
        onModelChange={this.modelChangeHandler}
      />
    ];
  }

  /**
   * 初始化数据
   */
  initModelHandler() {
    this.setState({
      ...this.state,

      model: {
        // 节点
        nodeDataArray: [
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Beta', color: 'orange' },
          { key: 'Gamma', color: 'lightgreen' },
          { key: 'Delta', color: 'pink' },
          { key: 'Omega', color: 'grey' }
        ],
        // 节点关系
        linkDataArray: [
          { from: 'Alpha', to: 'Beta' },
          { from: 'Alpha', to: 'Gamma' },
          { from: 'Beta', to: 'Delta' },
          { from: 'Gamma', to: 'Omega' }
        ]
      }
    });
  }

  /**
   * 更新主题
   */
  updateColorHandler() {
    const updatedNodes = this.state.model.nodeDataArray.map(node => {
      return {
        ...node,
        color: getRandomColor()
      };
    });

    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        nodeDataArray: updatedNodes
      }
    });
  }

  /**
   * 创建图表
   * @param {string}} diagramId
   */
  createDiagram(diagramId) {
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, diagramId, {
      initialContentAlignment: go.Spot.LeftCenter,
      layout: $(go.TreeLayout, {
        angle: 0,
        arrangement: go.TreeLayout.ArrangementVertical,
        treeStyle: go.TreeLayout.StyleLayered
      }),
      isReadOnly: false,
      allowHorizontalScroll: true,
      allowVerticalScroll: true,
      allowZoom: false,
      allowSelect: true,
      autoScale: Diagram.Uniform,
      contentAlignment: go.Spot.LeftCenter
    });

    myDiagram.toolManager.panningTool.isEnabled = false;
    myDiagram.toolManager.mouseWheelBehavior = ToolManager.WheelScroll;

    // 节点主题
    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      {
        selectionChanged: node => this.nodeSelectionHandler(node.key, node.isSelected)
      },
      $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, new go.Binding('fill', 'color')),
      $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
    );

    return myDiagram;
  }

  /**
   * 节点变动
   * @param {*} event
   */
  modelChangeHandler(event) {
    console.log(event.eventType);

    switch (event.eventType) {
      case ModelChangeEventType.Remove:
        // 节点
        if (event.nodeData) {
          this.removeNode(event.nodeData.key);
        }

        // 连接线
        if (event.linkData) {
          this.removeLink(event.linkData);
        }
        break;
      default:
        break;
    }
  }

  /**
   * 新增节点
   */
  addNode() {
    const newNodeId = 'node' + this.nodeId;
    const linksToAdd = this.state.selectedNodeKeys.map(parent => {
      return { from: parent, to: newNodeId };
    });
    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        nodeDataArray: [...this.state.model.nodeDataArray, { key: newNodeId, color: getRandomColor() }],
        linkDataArray:
          linksToAdd.length > 0
            ? [...this.state.model.linkDataArray].concat(linksToAdd)
            : [...this.state.model.linkDataArray]
      }
    });
    this.nodeId += 1;
  }

  /**
   * 删除节点
   * @param {*} nodeKey
   */
  removeNode(nodeKey) {
    const nodeToRemoveIndex = this.state.model.nodeDataArray.findIndex(node => node.key === nodeKey);
    if (nodeToRemoveIndex === -1) {
      return;
    }
    this.setState({
      ...this.state,
      model: {
        ...this.state.model,
        nodeDataArray: [
          ...this.state.model.nodeDataArray.slice(0, nodeToRemoveIndex),
          ...this.state.model.nodeDataArray.slice(nodeToRemoveIndex + 1)
        ]
      }
    });
  }

  /**
   * 删除关系线
   * @param {*}} linKToRemove
   */
  removeLink(linKToRemove) {
    const linkToRemoveIndex = this.state.model.linkDataArray.findIndex(
      link => link.from === linKToRemove.from && link.to === linKToRemove.to
    );
    if (linkToRemoveIndex === -1) {
      return;
    }
    return {
      ...this.state,
      model: {
        ...this.state.model,
        linkDataArray: [
          ...this.state.model.linkDataArray.slice(0, linkToRemoveIndex),
          ...this.state.model.linkDataArray.slice(linkToRemoveIndex + 1)
        ]
      }
    };
  }

  /**
   * 选择节点
   * @param {*} nodeKey       节点
   * @param {*} isSelected    是否选中
   */
  nodeSelectionHandler(nodeKey, isSelected) {
    if (isSelected) {
      this.setState({
        ...this.state,
        selectedNodeKeys: [...this.state.selectedNodeKeys, nodeKey]
      });
    } else {
      const nodeIndexToRemove = this.state.selectedNodeKeys.findIndex(key => key === nodeKey);
      if (nodeIndexToRemove === -1) {
        return;
      }
      this.setState({
        ...this.state,
        selectedNodeKeys: [
          ...this.state.selectedNodeKeys.slice(0, nodeIndexToRemove),
          ...this.state.selectedNodeKeys.slice(nodeIndexToRemove + 1)
        ]
      });
    }
  }
}

export default MyDiagram;
