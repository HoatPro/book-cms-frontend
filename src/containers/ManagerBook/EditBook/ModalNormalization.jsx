import React from 'react';

import { Table, Input, Form, Checkbox, Button, Modal, message } from 'antd';
import { NormalizationWrapper } from './Normalization.style';
import axios from 'axios';
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = e => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(
                    <Input
                      ref={node => (this.input = node)}
                      onPressEnter={this.save}
                    />,
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}
class ModalNormalization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataObj: {},
    };
    this.columns = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: '10%',
      },
      {
        title: 'Cụm từ',
        dataIndex: 'key',
        key: 'key',
        width: '40%',
      },
      {
        title: 'Cách đọc',
        dataIndex: 'expandation',
        key: 'expandation',
        width: '40%',
        editable: true,
      },
      {
        title: 'Kiểm tra',
        dataIndex: 'checked',
        key: 'checked',
        width: '10%',
        render: record => {
          return <Checkbox checked={record} />;
        },
      },
    ];
  }
  changeStatus = str => {
    if (str == 'unchecked') return false;
    else if (str == 'checked') return true;
  };
  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataChapterNormalization) return;
    let normalizationValue = JSON.parse(nextProps.dataChapterNormalization);
    let { words } = normalizationValue;
    const dataObj = {};
    if (words) {
      words = words.map((word, index) => {
        dataObj[word.key] = word;
        return {
          ...word,
          index: index + 1,
          checked: this.changeStatus(word.status),
        };
      });
    }
    this.setState({
      dataObj,
      data: words,
      dataNormalization: nextProps.dataNormalization,
    });
  }
  handleSave = row => {
    const { data } = this.state;
    this.setState({
      data: data.map(item => {
        if (item.key !== row.key) return item;
        return {
          ...item,
          expandation: row.expandation,
          status: 'checked',
          checked: true,
          expandations: item.expandations.map(ex => ({
            ...ex,
            expandation: row.expandation,
          })),
        };
      }),
    });
  };

  //Bang Expand
  onExpand = record => {
    const dataExpand = record.expandations;

    const dataConvert = dataExpand.map((data, index) => {
      return {
        index: index,
        ...data,
      };
    });
    //Lưu thông tin 1 bảng thông tin chuẩn hóa
    this.handleSaveData = row => {
      const { data } = this.state;
      if (row) {
        this.setState({
          data: data.map(item => {
            if (item.key !== record.key) return item;
            return {
              ...item,
              expandations: item.expandations.map((ex, index) => {
                if (index !== row.index) return ex;
                return {
                  ...ex,
                  expandation: row.expandation,
                };
              }),
            };
          }),
        });
      }
    };
    this.columnsExpand = [
      {
        title: 'Đoạn văn',
        dataIndex: 'context',
        key: 'context',
        render: record => (
          <div
            className="context"
            dangerouslySetInnerHTML={{
              __html: `${record}`,
            }}
          />
        ),
      },
      {
        title: 'Cách đọc',
        dataIndex: 'expandation',
        key: 'expandation',
        width: '50.28%',
        editable: true,
      },
    ];

    const componentsExpand = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columnsExpand = this.columnsExpand.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSaveData,
        }),
      };
    });

    return (
      <Table
        // scroll={{ y: 200 }}
        components={componentsExpand}
        columns={columnsExpand}
        dataSource={dataConvert}
        pagination={false}
        rowKey={record => record.index}
      />
    );
  };
  //Lưu thông tin tất cả bảng chuẩn hóa
  handleSaveAll = () => {
    const { visible } = this.props;
    const dataEdit = this.state.data;
    const { dataNormalization } = this.state;
    const bookId = dataNormalization.bookId;
    const chapterId = dataNormalization.id;
    const normalizationValue = JSON.stringify({ words: dataEdit });
    //API update Normalization
    axios({
      method: 'PUT',
      url: `http://localhost:8080/api/v1/books/${bookId}/chapters/${chapterId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: JSON.stringify({
        normalizationValue,
      }),
    }).then(res => {
      if (res.status) {
        message.success('Lưu thay đổi thành công !');
        window.location.reload();
      }
    });
    this.props.closeModal(!visible);
  };

  handleCancel = () => {
    const { visible } = this.props;
    this.props.closeModal(!visible);
  };

  render() {
    const { visible } = this.props;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <NormalizationWrapper>
        <Modal
          title="Kiểm tra nội dung chuẩn hóa"
          footer={false}
          width={1000}
          visible={visible}
          onCancel={this.handleCancel}
        >
          <Table
            className="table-modaledit"
            rowClassName={() => 'editable-row'}
            components={components}
            bordered
            columns={columns}
            dataSource={this.state.data}
            rowKey={record => record.key}
            expandedRowRender={record => this.onExpand(record)}
          />

          <div className="footer-modaledit" style={{ marginTop: 20 }}>
            <Button onClick={this.handleSaveAll} type="primary">
              Lưu
            </Button>
            &nbsp;
            <Button onClick={this.handleCancel} type="default">
              Hủy
            </Button>
          </div>
        </Modal>
      </NormalizationWrapper>
    );
  }
}

export default ModalNormalization;
