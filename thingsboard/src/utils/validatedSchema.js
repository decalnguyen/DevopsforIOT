import * as yup from 'yup';

export default function getValidateSchema(valueType) {
  switch (valueType) {
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
}
