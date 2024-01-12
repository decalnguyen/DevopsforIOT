import globalStyles from '~/components/GlobalStyles/GlobalStyles.module.scss';
import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import { useMemo, useState } from 'react';
import { Form, FloatingLabel, Stack, Row, Col, Button } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import * as yup from 'yup';
import * as formik from 'formik';
import { CustomButton } from '~/components/CustomButton';
import CustomModal from '~/components/CustomModal';
import { getValidateSchema } from '~/utils';

const cx = classNames.bind(styles);
const global = classNames.bind(globalStyles);

function AddModal({ onSubmit, title, setVisible, isVisible }) {
  const [activeValueType, setActiveValueType] = useState('String');

  const valueTypes = useMemo(
    () => [
      {
        Symbol: <i className="bi bi-fonts" style={{ fontSize: '1.2rem' }}></i>,
        title: 'String',
        type: 'text',
      },
      {
        Symbol: <i className="bi bi-123"></i>,
        title: 'Integer',
        type: 'number',
      },
      {
        Symbol: <i className="bi bi-123"></i>,
        title: 'Double',
      },
      {
        Symbol: <i className="bi bi-check-square"></i>,
        title: 'Boolean',
      },
      {
        Symbol: <i className="bi bi-filetype-json"></i>,
        title: 'JSON',
      },
    ],
    [],
  );
  const { Formik } = formik;
  const schema = yup.object().shape({
    key: yup.string().required('This field is required'),
    value: getValidateSchema(activeValueType),
  });

  return (
    <CustomModal isVisible={isVisible} style={{ width: '30%', height: '320px' }}>
      <div>
        <Stack direction="horizontal" style={{ padding: '0px 0', backgroundColor: '#004d40' }}>
          <span style={{ color: 'white' }} className={cx('header-title')}>
            Add {title}
          </span>
          <CustomButton.CloseButton
            className="ms-auto"
            style={{ marginRight: '10px', color: 'white', fontSize: '1.4rem' }}
            onClick={() => setVisible(false)}
          />
        </Stack>

        <Formik
          validationSchema={schema}
          onSubmit={onSubmit}
          initialValues={{
            key: null,
            value: null,
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit} style={{ margin: 'auto auto', marginTop: '32px', width: '90%' }}>
              <Form.Group>
                <FloatingLabel label="Key*">
                  <Form.Control
                    name="key"
                    value={values.key}
                    onChange={handleChange}
                    required
                    placeholder=""
                    className={cx('input')}
                    onBlur={handleBlur}
                    isInvalid={touched.key && errors.key}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.key}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Row style={{ marginTop: '32px', paddingBottom: '48px' }}>
                <Col>
                  <Form.Group>
                    <FloatingLabel label="value type">
                      <Form.Select
                        required
                        placeholder="Value type"
                        name="valueType"
                        className={cx('input')}
                        value={activeValueType}
                        onChange={(e) => setActiveValueType(e.target.value)}
                      >
                        {valueTypes.map((valueType, index) => {
                          return (
                            <option key={index} value={valueType.title}>
                              {valueType.Symbol}
                              <span>{valueType.title}</span>
                            </option>
                          );
                        })}
                      </Form.Select>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <FloatingLabel label={`${activeValueType} value`}>
                      <Form.Control
                        placeholder="Value"
                        className={cx('input')}
                        value={values.value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.value && errors.value}
                        name="value"
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">{errors.value}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>

              <Row style={{ paddingBottom: '32px' }}>
                <Stack gap={1} direction="horizontal">
                  <Button type="submit" variant="success" className="ms-auto">
                    Add
                  </Button>
                  <Button onClick={() => setVisible(false)}>Cancel</Button>
                </Stack>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </CustomModal>
  );
}

export default AddModal;
