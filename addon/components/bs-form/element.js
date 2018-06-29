import Ember from 'ember';
import BsFormElement from 'ember-bootstrap/components/bs-form/element';

const { computed, defineProperty, isPresent } = Ember;

export default BsFormElement.extend({
  setupValidations() {
    const property = this.get('property');

    // Workaround: handling nested properties via global `errors` object as they can't directly be watched through `model.errors.my.nested.property`
    const isNestedProperty = (property || '').indexOf('.') !== -1;
    const propertyErrors = isNestedProperty ? 'model.errors.[]' : `model.errors.${property}`;

    defineProperty(this, 'errors', computed(propertyErrors, () => {
      const errors = isNestedProperty ? this.get('model.errors').errorsFor(property) : this.get(propertyErrors);
      const hasErrors = isPresent(errors);
      let errorMessages = null;

      // this.set('showValidation', hasErrors); // ember-bootrap@1.0.0-alpha.3
      this.set('showOwnValidation', hasErrors); // ember-bootrap@1.0.0-rc.2

      if (hasErrors) {
        errorMessages = errors.map(function(error) {
          return error.message;
        });
      }

      return errorMessages;
    }));

    defineProperty(this, 'validation', computed('errors', () => {
      return isPresent(this.get('errors')) ? 'error' : null;
    }));
  }
});
