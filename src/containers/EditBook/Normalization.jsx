import React from 'react';

import { Table, Button, Icon, Input, Form } from 'antd';
import { NormalizationWrapper } from './Normalization.style';

const FormItem = Form.Item;
const EditableContext = React.createContext();
// Edit row select in table
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

// Main table
class Normalization extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '#',
        dataIndex: 'stt',
        key: 'stt',
        width: '5%',
      },
      {
        title: 'Cụm từ',
        dataIndex: 'phrase',
        key: 'phrase',
        width: '35%',
      },
      {
        title: 'Cách đọc',
        dataIndex: 'speak',
        key: 'speak',
        width: '30%',
        editable: true,
      },
      {
        title: '',
        dataIndex: 'choice',
        width: '30%',
        key: 'choice',
        render: () => (
          <div>
            <Icon type="form" theme="outlined" /> &nbsp;
            <Button type="primary">Đánh dấu</Button>
          </div>
        ),
      },
    ];
    this.state = {
      dataSource: [
        {
          key: 1,
          stt: 1,
          phrase: '1990năm',
          speak: 'một nghìn chín trăm chín mươi',
          choice: '',
          description: '1990năm có một thiên tài đã phát minh …',
        },
        {
          stt: 2,
          key: 2,
          phrase: 'nhữngvết',
          speak: '',
          choice: '',
          description: 'nhữngvết còn lại như một điều chứng minh',
        },
        {
          stt: 3,
          key: 3,
          phrase: 'luậnvề',
          speak: '',
          choice: '',
          description: 'các bài luậnvề các vấn đề này , được trình bày ...',
        },
      ],
      count: 3,
    };
  }

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = { body: { row: EditableFormRow, cell: EditableCell } };
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
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          columns={columns}
          expandRowByClick={true}
          dataSource={dataSource}
          expandedRowRender={record => (
            //   <p style={{ margin: 0 }}>{record.description}</p>
            // description :đoạn văn chứa cụm từ cần chuẩn hóa
            <tr className="expand-row">
              <td className="description">{record.description}</td>
              <td className="edit-description">
                <Input />
                <Button type="primary">Lưu</Button>
              </td>
            </tr>
          )}
          onExpand={(expanded, record) => console.log(expanded, record)}
        />
      </NormalizationWrapper>
    );
  }
}

export default Normalization;
