const { check, body } = require('express-validator');

const validateCreateOrUpdate = [
  check('businessId', 'Company businessId is required').not().isEmpty(),
  check('name', 'Company name is required').not().isEmpty(),
  check('bankInformation.branch', 'Company branch is required').not().isEmpty(),
  check('bankInformation.account', 'Company account is required')
    .not()
    .isEmpty(),
  check('bankInformation.agreement', 'Company agreement is required')
    .not()
    .isEmpty(),
  check('bankInformation.portfolio', 'Company portfolio is required')
    .not()
    .isEmpty(),
  check('bankInformation.variation', 'Company variation is required')
    .not()
    .isEmpty(),
  check('bankInformation.interest', 'Company interest is required')
    .not()
    .isEmpty(),
  check('bankInformation.instruction1', 'Company instruction1 is required')
    .not()
    .isEmpty(),
  check('bankInformation.instruction2', 'Company instruction2 is required')
    .not()
    .isEmpty(),
  check('taxInformation.accumulated.pis', 'Company accumulated pis is required')
    .not()
    .isEmpty(),
  check(
    'taxInformation.accumulated.cofins',
    'Company accumulated cofins is required',
  )
    .not()
    .isEmpty(),
  check(
    'taxInformation.accumulated.irrf',
    'Company accumulated irrf is required',
  )
    .not()
    .isEmpty(),
  check('taxInformation.accumulated.iof', 'Company accumulated iof is required')
    .not()
    .isEmpty(),
  check('taxInformation.tax.pis', 'Company tax pis is required')
    .not()
    .isEmpty(),
  check('taxInformation.tax.cofins', 'Company tax cofins is required')
    .not()
    .isEmpty(),
  check('taxInformation.tax.irrf', 'Company tax irrf is required')
    .not()
    .isEmpty(),
  check('taxInformation.tax.iof', 'Company tax iof is required')
    .not()
    .isEmpty(),
  check(
    'taxInformation.tax.additionalIof',
    'Company tax additionalIof is required',
  )
    .not()
    .isEmpty(),
  check('taxInformation.code.pis', 'Company code pis is required')
    .not()
    .isEmpty()
    .isInt(),
  check('taxInformation.code.cofins', 'Company code cofins is required')
    .not()
    .isEmpty()
    .isInt(),
  check('taxInformation.code.irrf', 'Company code irrf is required')
    .not()
    .isEmpty()
    .isInt(),
  check('taxInformation.code.iof', 'Company code iof is required')
    .not()
    .isEmpty()
    .isInt(),
  check('address.zipCode', 'Company zipCode can only contains numbers')
    .if(body('address.zipCode').exists())
    .isInt(),
];

module.exports = {
  validateCreateOrUpdate,
};
