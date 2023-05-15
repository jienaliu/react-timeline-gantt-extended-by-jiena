import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
import ContentEditable from 'libs/components/common/ContentEditable';
import Registry from 'libs/helpers/registry/Registry';

export class VerticalLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="timeLine-main-data-verticalLine" style={{ left: this.props.left }} />;
  }
}

export class TaskRow extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    if (this.props.onUpdateTask) {
      this.props.onUpdateTask(this.props.item, { name: value });
    }
  };

  render() {
    console.log(">>>> row props are: ",this.props);
    return (
      <div
        className="timeLine-side-task-row"
        style={{
          ...Config.values.taskList.task.style,
          top: this.props.top,
          height: this.props.itemheight,
          display:'flex',
          justifyContent:'space-around'
        }}
        onClick={(e) => this.props.onSelectItem(this.props.item)}
      >
        {this.props.nonEditable ? (
          <div tabIndex={this.props.index} style={{ width: '100%' }}>
            {this.props.label}
          </div>
        ) : (
            <ContentEditable value={this.props.label} index={this.props.index} onChange={this.onChange} />
          )}
        <div style={{ width: '200px', textAlign: 'right' }}>
          <Dropdown
            {...this.props}
            style={{textAlign:'right'}}/>
        </div>
      </div>
    );
  }
}
const Dropdown=({dropdownListData, dropdownListDefaultLabel,onHandleDropdownChange, item})=>{
  if(!dropdownListData){
    return null;
  }
  return(
    <select id="simple-select"
            onChange={(e)=> onHandleDropdownChange(e, item)}
            defaultValue={item.assignedTo}>
      {dropdownListDefaultLabel && <option key={-1} value={null}>{dropdownListDefaultLabel}</option>}
      {dropdownListData.map((optionItem)=>{
        return(
        <option key={optionItem.id} value={optionItem.id} selected={optionItem.id === item.assignedTo}>
          {optionItem.label}
        </option>)
    })}
    </select>
  )

}
export default class TaskList extends Component {
  constructor(props) {
    super(props);
  }

  getContainerStyle(rows) {
    let new_height = rows > 0 ? rows * this.props.itemheight : 10;
    return { height: new_height };
  }

  renderTaskRow(data) {
    let result = [];
    const groups = Registry.groupData(data, this.props.startRow, this.props.endRow + 1);
    Object.keys(groups).forEach((key, i) => {
      const group = groups[key];
      group.forEach(item => {
        result.push(
          <TaskRow
            key={i + item.id}
            index={item.name + i}
            item={item}
            label={item.name}
            top={i * this.props.itemheight}
            itemheight={this.props.itemheight}
            isSelected={this.props.selectedItem == item}
            onUpdateTask={this.props.onUpdateTask}
            onSelectItem={this.props.onSelectItem}
            nonEditable={this.props.nonEditable}
            dropdownListData={this.props.dropdownListData}
            onHandleDropdownChange={this.props.onHandleDropdownChange}
            dropdownListDefaultLabel ={this.props.dropdownListDefaultLabel}
          />
        );
      });
    });
    return result;
  }

  doScroll = () => {
    this.props.onScroll(this.refs.taskViewPort.scrollTop);
  };

  render() {
    let data = this.props.data ? this.props.data : [];
    this.containerStyle = this.getContainerStyle(data.length);
    return (
      <div className="timeLine-side">
        <div className="timeLine-side-title" style={Config.values.taskList.title.style}>
          <div>{Config.values.taskList.title.label}</div>
        </div>
        <div ref="taskViewPort" className="timeLine-side-task-viewPort" onScroll={this.doScroll}>
          <div className="timeLine-side-task-container" style={this.containerStyle}>
            {this.renderTaskRow(data)}
          </div>
        </div>
      </div>
    );
  }
}
