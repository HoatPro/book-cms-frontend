import React from 'react';
import { Form, Modal, Input, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const ModalAdd = Form.create()(
  class extends React.Component {
    handleCancel = () => {
      const { visible } = this.props;
      this.props.closeModal(!visible);
    };

    handleCreate = () => {
      const { visible } = this.props;

      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
      });
      this.props.closeModal(!visible);
    };
    render() {
      const { visible } = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
        <Modal
          visible={visible}
          title="Thêm tác giả"
          okText="Thêm"
          cancelText="Hủy"
          onCancel={this.handleCancel}
          width={800}
        >
          <Form layout="vertical">
            <FormItem label="Tên">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Tên tac giả không được để trống !',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Năm sinh">
              {getFieldDecorator('birthDate')(<Input />)}
            </FormItem>
            <FormItem label="Mô tả">
              {getFieldDecorator('description')(<TextArea rows={5} />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  },
);
export default ModalAdd;
