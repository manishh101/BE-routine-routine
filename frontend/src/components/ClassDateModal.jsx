/**
 * Class Date Input Modal - Component for capturing class start and end dates for PDF export
 */

import React, { useState } from 'react';
import { Modal, Form, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

const ClassDateModal = ({ visible, onOk, onCancel, programCode, semester, section }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Format dates for the backend
      const startDate = values.startDate.format('YYYY-MM-DD');
      const endDate = values.endDate.format('YYYY-MM-DD');
      
      // Call the onOk callback with the dates
      await onOk({ startDate, endDate });
      
      form.resetFields();
    } catch (error) {
      console.error('Date validation error:', error);
      message.error('Please select both start and end dates');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Validation rules
  const validateDateRange = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please select a date'));
    }

    const startDate = form.getFieldValue('startDate');
    if (startDate && value && value.isBefore(startDate)) {
      return Promise.reject(new Error('End date must be after start date'));
    }

    return Promise.resolve();
  };

  const validateStartDate = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please select a date'));
    }

    const endDate = form.getFieldValue('endDate');
    if (endDate && value && value.isAfter(endDate)) {
      return Promise.reject(new Error('Start date must be before end date'));
    }

    return Promise.resolve();
  };

  return (
    <Modal
      title={`Class Schedule Dates - ${programCode} Semester ${semester} Section ${section}`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Export PDF"
      cancelText="Cancel"
      width={500}
      destroyOnClose={true}
    >
      <div style={{ marginBottom: '16px', color: '#666' }}>
        Please specify the class start and end dates for this routine. 
        These dates will appear on the PDF schedule.
      </div>
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          startDate: dayjs().startOf('month'),
          endDate: dayjs().endOf('month')
        }}
      >
        <Form.Item
          name="startDate"
          label="Class Start Date"
          rules={[
            { required: true, message: 'Please select class start date' },
            { validator: validateStartDate }
          ]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            placeholder="Select class start date"
            onChange={() => form.validateFields(['endDate'])}
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="Class End Date"
          rules={[
            { required: true, message: 'Please select class end date' },
            { validator: validateDateRange }
          ]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            placeholder="Select class end date"
            onChange={() => form.validateFields(['startDate'])}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClassDateModal;
