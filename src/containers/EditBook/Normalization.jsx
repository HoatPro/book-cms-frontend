import React from 'react';

import { Table, Button, Input, Form, Checkbox, Icon } from 'antd';
import { NormalizationWrapper } from './Normalization.style';

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
class Normalization extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], label: 'Chưa kiểm tra', dataObj: {} };
    this.columns = [
      {
        title: '#',
        dataIndex: 'stt',
        key: 'stt',
        width: '5%',
      },
      {
        title: 'Cụm từ',
        dataIndex: 'key',
        key: 'key',
        width: '35%',
      },
      {
        title: 'Cách đọc',
        dataIndex: 'expandation',
        key: 'expandation',
        width: '30%',
        editable: true,
      },
      {
        title: 'Kiểm tra',
        dataIndex: 'operation',
        width: '30%',
        render: record => {
          return (
            <Checkbox checked={this.state.checked}>{this.state.label}</Checkbox>
          );
        },
      },
    ];
  }

  // save(key) {
  //   const { dataObj, data } = this.state;
  //   console.log(dataObj[key]);
  //   this.setState({
  //     data: data.map(item => {
  //       if (item.key !== key) return item;
  //       delete dataObj[key].editable;
  //       return {
  //         ...item,
  //         expandation: dataObj[key].expandation,
  //         expandations: item.expandations.map(ex => ({
  //           ...ex,
  //           expandation: dataObj[key].expandation,
  //         })),
  //       };
  //     }),
  //   });
  handleSave = row => {
    console.log(row);
    const { data, dataObj } = this.state;
    // const newData = [...this.state.data];
    // const index = newData.findIndex(item => row.key === item.key);
    // const item = newData[index];
    // console.log(newData[index]);
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    this.setState({
      data: data.map(item => {
        if (item.key !== row.key) return item;
        delete dataObj[key].editable;
        return {
          ...item,
          expandation: dataObj[key].expandation,
          expandations: item.expandations.map(ex => ({
            ...ex,
            expandation: dataObj[key].expandation,
          })),
        };
      }),
    });
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataChapterNormalization) return;
    let normalizationValue = JSON.parse(nextProps.dataChapterNormalization);
    const { words } = normalizationValue;
    const dataObj = {};
    if (words) {
      words.forEach(word => {
        dataObj[word.key] = word;
      });
    }
    // JSON.parse(nextProps.dataChapterNormalization).words.map(
    //   (word, index) => {
    //     return {
    //       key: `${word.key}`,
    //       stt: index + 1,
    //       phrase: `${word.key}`,
    //       speak: `${word.expandation}`,
    //       description: (
    //         <div
    //           dangerouslySetInnerHTML={{
    //             __html: `${word.expandations[0].context}`,
    //           }}
    //         />
    //       ),
    //       expandation: `${word.expandations[0].expandation}`,
    //       statusChapter: `${word.status}`,
    //       checkedList: this.changeStatus(`${word.status}`),
    //     };
    //   },
    // );
    this.setState({ dataObj, data: words });
  }

  changeStatus = string => {
    if (string === 'unchecked') return false;
    else if (string === 'checked') return true;
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log('a');
  };

  render() {
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
        <Table
          rowClassName={() => 'editable-row'}
          components={components}
          bordered
          scroll={{ y: 300 }}
          columns={columns}
          dataSource={this.state.data}
          rowKey={record => record.key}
          expandedRowRender={record => (
            //description :đoạn văn chứa cụm từ cần chuẩn hóa
            <table>
              <tbody>
                {record.expandations.map((expand, index) => (
                  <tr key={index} className="expand-row">
                    <td
                      className="description"
                      dangerouslySetInnerHTML={{
                        __html: `${expand.context}`,
                      }}
                    />
                    <td className="edit-description">
                      <Form layout="vertical" onSubmit={this.handleSubmit}>
                        <Input defaultValue={expand.expandation} />
                        <Button type="primary" htmlType="submit">
                          Lưu
                        </Button>
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          onExpand={(expanded, record) => console.log(expanded, record)}
        />
      </NormalizationWrapper>
    );
  }
}

export default Normalization;
