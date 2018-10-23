import Ember from 'ember';
import BsFormElement from 'ember-bootstrap/components/bs-form/element';

const { computed, defineProperty, isPresent } = Ember;

// Workaround: handling nested properties via global `errors` object as they can't directly be watched through `model.errors.my.nested.property`
const isNested = (property = '') => property.includes('.');

export default BsFormElement.extend({
  setupValidations() {
    let property = this.get('property');
    const properties = this.get('errorPointers') ||[]
    if (property && !properties.includes(property)) {
      properties.push(property);
    }

    const propertiesErrors = properties.map(property => isNested(property) ? 'model.errors.[]' : `model.errors.${property}`);

    defineProperty(this, 'errors', computed(...propertiesErrors, () => {
      const errors = [].concat(...properties.map(property => {
          const errors = isNested(property) ? this.get('model.errors').errorsFor(property) : this.get(`model.errors.${property}`);
          const hasErrors = isPresent(errors);
          let errorMessages = [];

          if (hasErrors) {
            errorMessages = errors.map(function(error) {
              return error.message;
            });
          }

          return errorMessages;
      }));

      // this.set('showValidation', hasErrors); // ember-bootrap@1.0.0-alpha.3
      this.set('showOwnValidation', Boolean(errors.length)); // ember-bootrap@1.0.0-rc.2

      return errors.length ? errors.slice(0,1) : null;
    }));

    defineProperty(this, 'validation', computed('errors', () => {
      return isPresent(this.get('errors')) ? 'error' : null;
    }));
  }
});
