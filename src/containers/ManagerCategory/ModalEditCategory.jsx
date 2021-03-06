import React from 'react';
import { Form, Modal, Input, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
const ModalEditCategory = Form.create()(
  class extends React.Component {
    handleCancel = () => {
      const { visible } = this.props;
      this.props.closeModal(!visible);
    };

    handleCreate = () => {
      const { visible } = this.props;
      console.log(visible);
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log('Received values of form: ', values);
      });
      this.props.closeModal(!visible);
    };
    render() {
      const { visible } = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
        <Modal
          visible={visible}
          title="Chỉnh sửa thể loại"
          onCancel={this.handleCancel}
          footer={false}
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
            <FormItem label="Mô tả">
              {getFieldDecorator('description')(<TextArea rows={5} />)}
            </FormItem>
            <Button onClick={this.handleCreate} type="primary">
              Lưu
            </Button>
            &nbsp;
            <Button onClick={this.handleCancel} type="danger">
              Hủy
            </Button>
          </Form>
        </Modal>
      );
    }
  },
);
export default ModalEditCategory;
