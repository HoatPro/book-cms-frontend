import React from 'react';
import { Table, Select } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { EditBookWapper } from './EditBook.style';
const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
}
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset,
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />,
      ),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow),
);

const columns = [
  {
    title: 'Chương',
    dataIndex: 'chapter',
    key: 'chapter',
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'choice',
    key: 'choice',
    render: () => (
      <div>
        <Select
          placeholder="Chỉnh sửa"
          style={{ width: 120 }}
          onChange={handleChange}
        >
          <Option value="synthesis">Tổng hợp </Option>
          <Option value="normalization">Chuẩn hóa</Option>
          <Option value="delete">Xóa</Option>
        </Select>
      </div>
    ),
  },
];
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

class TableBook extends React.Component {
  state = {
    data: [
      {
        key: '1',
        chapter: 'Chương 1',
        content: 'Lời mở đầu',
        choice: '',
      },
      {
        key: '2',
        chapter: 'Chương 2',
        content: 'Nhất niệm vĩnh hằng',
        choice: '',
      },
      {
        key: '3',
        chapter: 'Chương 3',
        content: 'Nhất hoa nhất thế giới',
        choice: '',
      },
    ],
  };

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
  };

  render() {
    return (
      <EditBookWapper>
        <Table
          columns={columns}
          rowSelection={rowSelection}
          dataSource={this.state.data}
          components={this.components}
          onRow={(record, index) => ({ index, moveRow: this.moveRow })}
        />
      </EditBookWapper>
    );
  }
}

const App = DragDropContext(HTML5Backend)(TableBook);

export default App;
