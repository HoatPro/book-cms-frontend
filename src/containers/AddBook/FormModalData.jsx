import React from 'react';
import { Form, Modal, Input } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
const FormModalData = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalTitle: '',
        modalContent: '',
      };
    }
    titleHandler = e => {
      this.setState({
        modalTitle: e.target.value,
      });
    };
    contentHandler = e => {
      this.setState({
        modalContent: e.target.value,
      });
    };
    onSave = (modalTitle, modalContent) => {
      console.log(this.state);
    };
    render() {
      const { visible, onCancel, onSave, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          width={900}
          visible={visible}
          title="Thêm chương"
          okText="Lưu"
          cancelText="Hủy"
          onCancel={onCancel}
          onOk={onSave}
        >
          <Form layout="vertical" onSubmit={this.onSave}>
            <FormItem label="Tiêu đề ">
              {getFieldDecorator('modalTitle', {
                rules: [
                  {
                    required: true,
                    message: 'Tên tiêu đề không được để trống !!',
                  },
                ],
              })(<Input onChange={e => this.titleHandler(e)} />)}
            </FormItem>
            <FormItem label="Nội dung">
              {getFieldDecorator('modalContent')(
                <TextArea rows={15} onChange={e => this.contentHandler(e)} />,
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  },
);
export default FormModalData;
