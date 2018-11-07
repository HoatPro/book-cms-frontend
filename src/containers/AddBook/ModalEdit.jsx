import React, { Component } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const FormItem = Form.Item;
FormItem;
const ModalEdit = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalTitle: '',
        modalContent: '',
      };
    }
    componentWillReceiveProps(nextProps) {
      this.setState({
        modalTitle: nextProps.title,
        modalContent: nextProps.content,
        key: nextProps.key,
      });
      // console.log(nextProps.chapters);
    }

    titleHandler(e) {
      this.setState({ modalTitle: e.target.value });
    }
    contentHandler(e) {
      this.setState({ modalContent: e.target.value });
    }
    handleSubmit = e => {
      e.preventDefault();
    };

    render() {
      const { visible, onCancel, onEdit, chapters } = this.props;

      return (
        <Modal
          visible={visible}
          title="Sửa chương"
          onCancel={onCancel}
          onOk={onEdit}
          footer={null}
          width={900}
        >
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem label="Tiêu đề">
              <Input
                required={true}
                value={this.state.modalTitle}
                onChange={e => this.titleHandler(e)}
              />
            </FormItem>
            <FormItem label="Nội dung">
              <TextArea
                rows={16}
                value={this.state.modalContent}
                onChange={e => this.contentHandler(e)}
              />
            </FormItem>
            <div className="ant-modal-footer">
              <Button type="default" onClick={onCancel}>
                Hủy
              </Button>
              &nbsp;
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Modal>
      );
    }
  },
);
export default ModalEdit;
