import React from 'react';
import {
  Table,
  Form,
  Dropdown,
  Menu,
  Button,
  Icon,
  Modal,
  Input,
  Select,
  message,
} from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { EditBookWapper } from './EditBook.style';
import ModalNormalization from './ModalNormalization';
import axios from 'axios';
import { consolidateStreamedStyles } from 'styled-components';
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
// import ModalEdit from './ModalEdit';

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
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      visibleNormalization: false,
    };
  }

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
const dataz = [];
const rowSelection = {
  onChange: selectedRows => {
    return dataz.push(selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
  // onSelectAll: selectedRows => {
  //   dataz.push(selectedRows.key);
  // },
};

class TableBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      visibleAddChapter: false,
      editVisible: false, // visible modal Edit
      data: [],
      objChapters: {},
      keyModal: null,
      selectedRow: dataz,
      loading: false,
    };
  }
  handleDeleteTable = () => {
    const { bookId } = this.props;
    const selectedRows = this.state.selectedRow;
    const lastIndex = selectedRows.length - 1;
    axios({
      method: 'DELETE',
      url: `http://localhost:8080/api/v1/books/${bookId}/chapters/`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: selectedRows[lastIndex],
    }).then(res => {
      message.success('Xóa chương thành công!');
      window.location.reload();
    });
  };
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  // rowSelection object indicates the need for row selection

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
  componentWillReceiveProps(nextProps) {
    const { chapters, objChapters } = nextProps;
    const data = chapters.map(chapter => {
      return {
        key: `${chapter.id}`,
        title: `${chapter.title}`,
        content: `${chapter.content}`,
      };
    });
    this.setState({ data, objChapters });
  }

  getColumns = () => {
    const columns = [
      { title: 'Chương', dataIndex: 'title', key: 'title', width: '80%' },
      {
        title: 'Lựa chọn',
        key: 'choice',
        width: '20%',
        render: record => {
          const menu = (
            <Menu>
              <Menu.Item>
                <a>Tổng hợp</a>
              </Menu.Item>
              <Menu.Item>
                <a>Chuẩn hóa</a>
              </Menu.Item>
              <Menu.Item onClick={() => this.handleDelete(record.key)}>
                <a>Xóa</a>
              </Menu.Item>
              <Menu.Item
                onClick={() => this.setNormalizationVisible(record.key)}
              >
                <a>Kiểm tra</a>
              </Menu.Item>
            </Menu>
          );
          return (
            <Dropdown.Button
              style={{ color: '#505659' }}
              onClick={() => this.setEditVisible(record.key)}
              overlay={menu}
            >
              Chỉnh sửa
            </Dropdown.Button>
          );
        },
      },
    ];
    return columns;
  };
  handleDelete = key => {
    const { bookId, objChapters } = this.props;
    const chapterId = objChapters[key].id;
    axios({
      method: 'DELETE',
      url: `http://localhost:8080/api/v1/books/${bookId}/chapters/${chapterId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(res => {
      if (res.status) {
        message.success('Xóa chương thành công!');
        window.location.reload();
      }
    });
  };
  //Thêm chương
  // Thêm chương trong Detail Book
  handleAddChapter = visibleAddChapter => {
    this.setState({
      visibleAddChapter,
    });
  };
  handleCancel = e => {
    this.setState({
      visibleAddChapter: false,
    });
  };
  handleSaveAddChapter = () => {
    const { chapters, bookId } = this.props;
    if (chapters.length > 0) {
      const lastIndex = chapters.length - 1;
      const chapterOrderNo = chapters[lastIndex].orderNo;

      this.props.form.validateFields((err, fieldsValue) => {
        axios({
          method: 'POST',
          url: `http://localhost:8080/api/v1/books/${bookId}/chapters`,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          data: {
            title: fieldsValue['modalTitleAdd'],
            content: fieldsValue['modalContentAdd'],
            orderNo: chapterOrderNo + 1,
          },
        }).then(res => {
          if (res.data.status === 0) {
            message.error('Thêm chương có orderNo đã tồn tại!!');
          } else {
            message.success('Thêm chương thành công !');
            window.location.reload();
          }
        });
      });
      this.setState({
        visibleAddChapter: false,
      });
    } else {
      this.props.form.validateFields((err, fieldsValue) => {
        axios({
          method: 'POST',
          url: `http://localhost:8080/api/v1/books/${bookId}/chapters`,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          data: {
            title: fieldsValue['modalTitleAdd'],
            content: fieldsValue['modalContentAdd'],
            orderNo: 1,
          },
        }).then(res => {
          if (res.data.status === 0) {
            message.error('Thêm chương có orderNo đã tồn tại!!');
          } else {
            message.success('Thêm chương thành công !');
            window.location.reload();
          }
        });
      });
      this.setState({
        visibleAddChapter: false,
      });
    }
  };
  // Hiện modal Edit
  setEditVisible = key => {
    const { objChapters } = this.props;
    this.props.form.setFieldsValue({
      modalTitleEdit: objChapters[key].title,
      modalContentEdit: objChapters[key].content,
    });
    this.setState({ editVisible: true, keyModal: key });
  };
  handleCancel = () => {
    this.setState({ editVisible: false });
  };

  handleSave = e => {
    e.preventDefault();
    const { keyModal } = this.state;
    const { bookId, objChapters } = this.props;
    const chapterId = objChapters[keyModal].id;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      axios({
        method: 'PUT',
        url: `http://localhost:8080/api/v1/books/${bookId}/chapters/${chapterId}`,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        data: {
          title: fieldsValue['modalTitleEdit'],
          content: fieldsValue['modalContentEdit'],
        },
      }).then(res => {
        if (res.status) {
          this.setState({
            editVisible: false,
          });
          message.success('Sửa chương thành công !!');
          window.location.reload();
        }
      });
    });
  };

  //Modal Chuẩn hóa
  setNormalizationVisible = key => {
    const { objChapters } = this.props;
    this.setState({
      dataChapterNormalization: objChapters[key].normalizationValue,
      dataNormalization: objChapters[key],
      visibleNormalization: true,
    });
  };
  closeModal = visible => {
    this.setState({
      visibleNormalization: visible,
    });
  };

  render() {
    const { chapters, getFieldDecorator, form } = this.props;

    return (
      <EditBookWapper>
        {/* Bảng thông tin chapter và lựa chọn hành động cho bảng */}
        <Select
          className="selectact"
          showSearch
          style={{ width: 120 }}
          placeholder="Hành động"
        >
          <Option
            value="addchapter"
            onClick={() => this.handleAddChapter(true)}
          >
            Thêm chương
          </Option>
          <Option value="synthesis">Tổng hợp</Option>
          <Option value="normalization">Chuẩn hóa</Option>
          <Option value="delete" onClick={this.handleDeleteTable}>
            Xóa
          </Option>
        </Select>
        <Table
          bordered
          columns={this.getColumns()}
          rowSelection={rowSelection}
          dataSource={this.state.data}
          loading={this.state.loading}
          // components={this.components}
          // onRow={(record, index) => ({ index, moveRow: this.moveRow })}
        />
        {/* Modal Add  chương */}
        <div className="modal-add-chapter">
          <Modal
            visible={this.state.visibleAddChapter}
            title="Thêm chương"
            okText="Thêm"
            cancelText="Hủy"
            onCancel={this.handleCancel}
            width={900}
            onOk={this.handleSaveAddChapter}
          >
            <Form layout="vertical">
              <FormItem label="Tiêu đề">
                {getFieldDecorator('modalTitleAdd', {
                  rules: [
                    {
                      required: false,
                      message: 'Tên tiêu đề không được để trống!!',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="Nội dung">
                {getFieldDecorator('modalContentAdd')(<TextArea rows={16} />)}
              </FormItem>
            </Form>
          </Modal>
        </div>
        {/* Modal Edit chương */}
        <Modal
          visible={this.state.editVisible}
          onCancel={this.handleCancel}
          title="Sửa chương"
          okText="Lưu"
          cancelText="Hủy"
          width={900}
          footer={null}
        >
          <Form layout="vertical" onSubmit={this.handleSave}>
            <FormItem label="Tiêu đề">
              {getFieldDecorator('modalTitleEdit', {
                rules: [
                  {
                    required: false,
                    message: 'Tên tiêu đề không được để trống!!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Nội dung">
              {getFieldDecorator('modalContentEdit')(<TextArea rows={16} />)}
            </FormItem>
            <FormItem>
              <Button onClick={this.handleCancel}>Hủy</Button>
              &nbsp;
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </FormItem>
          </Form>
        </Modal>
        {/* Modal chuẩn hóa nội dung */}
        <div className="modal-normalization">
          <ModalNormalization
            visible={this.state.visibleNormalization}
            dataChapterNormalization={this.state.dataChapterNormalization}
            dataNormalization={this.state.dataNormalization}
            closeModal={this.closeModal}
          />
        </div>
      </EditBookWapper>
    );
  }
}

const App = DragDropContext(HTML5Backend)(TableBook);

export default App;
