import React from 'react';
import { Form, Modal, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const ModalAdd = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalTitle: '',
        modalContent: '',
      };
    }
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Thêm chương"
          okText="Thêm"
          cancelText="Hủy"
          onCancel={onCancel}
          onOk={onCreate}
          width={900}
        >
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem label="Tiêu đề">
              {getFieldDecorator('modalTitle', {
                rules: [
                  {
                    required: true,
                    message: 'Tên tiêu đề không được để trống !',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Nội dung">
              {getFieldDecorator('modalContent')(<TextArea rows={16} />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  },
);
export default ModalAdd;
