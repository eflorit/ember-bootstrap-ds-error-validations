import Ember from 'ember';
import BsFormElement from 'ember-bootstrap/components/bs-form/element';

const { computed, defineProperty } = Ember;

export default BsFormElement.extend({
  setupValidations() {
  	let errorProperty = `model.errors.${this.get('property')}`;
    defineProperty(this, 'errors', computed(errorProperty, () => {
    	let errors = this.get(errorProperty);

    	this.set('showValidation', !!errors);
    	if (errors) {
	    	return errors.map(function(error) {
	    		return error.message;
	    	});
    	} else {
    		return null;
    	}
    }));

    defineProperty(this, 'validation', computed('errors', () => {
    	return this.get('errors') ? 'error' : null;
    }));
  }
});
