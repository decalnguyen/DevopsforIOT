import globalStyles from '~/components/GlobalStyles/GlobalStyles.module.scss';
import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import { useMemo, useState } from 'react';
import { Form, FloatingLabel, Stack, Row, Col, Button } from 'react-bootstrap';
import { AnimatePresence, motion } from "framer-motion";
import * as yup from 'yup';
import * as formik from 'formik';
import { CustomButton } from '~/components/CustomButton';

const cx = classNames.bind(styles);
const global = classNames.bind(globalStyles);

function AddModal({ onSubmit, title, setVisible, isVisible}) {
  const [activeValueType, setActiveValueType] = useState('String');
  const getValidateSchema = () => {
    switch (activeValueType) {
      case 'String':
        return yup.string('Must be a string').required();
      case 'Integer':
        return yup.number('Must be a number').integer('Must be an integer').required();
      case 'Double':
        return yup.number('Must be a number').required();
      case 'Boolean':
        return yup.boolean('Must be a boolean').required();
      case 'JSON':
        return yup.object('Muse be an object').json('Must be a JSON value').required();
      default:
        return yup.string().required();
    }
  };

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
    value: getValidateSchema(),
  });

  return (
      <AnimatePresence>
      {isVisible && 
        <motion.div 
          key='backdrop' 
          className={`${global('modal-backdrop')}`} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{duration: .5}}
          >
          
        <motion.div 
          className={`${global('modal')} `} 
          key='modal'
          initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        
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
                      <Button>Cancel</Button>
                    </Stack>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      {/* <div className={`${global('modal-backdrop')} `} style={{ display: `${showAddModal ? 'block' : 'none'}` }}></div> */}
    </motion.div>}
      </AnimatePresence>
  );
}

export default AddModal;
