import { createSelector } from 'reselect';
import { translate as __ } from 'lib/mixins/i18n';
import { isValidPhone } from 'lib/utils/phone-format';
import { sprintf } from 'sprintf-js';
import _ from 'lodash';

const getAddressErrors = ( { values, isNormalized, normalized, selectNormalized }, countriesData ) => {
	if ( isNormalized && ! normalized ) {
		// If the address is normalized but the server didn't return a normalized address, then it's
		// invalid and must register as an error
		return {
			address: __( 'This address is not recognized. Please try another.' ),
		};
	}
	const { phone, postcode, state, country } = ( isNormalized && selectNormalized ) ? normalized : values;
	const requiredFields = [ 'name', 'phone', 'address', 'city', 'postcode', 'country' ];
	const errors = {};
	requiredFields.forEach( ( field ) => {
		if ( ! values[ field ] ) {
			errors[ field ] = __( 'This field is required' );
		}
	} );

	if ( countriesData[ country ] ) {
		if ( ! isValidPhone( phone, country ) ) {
			errors.phone = sprintf( __( 'Invalid phone number for %s' ), countriesData[ country ].name );
		}

		switch ( country ) {
			case 'US':
				if ( ! /^\d{5}(?:-\d{4})?$/.test( postcode ) ) {
					errors.postcode = __( 'Invalid ZIP code format' );
				}
				break;
		}

		if ( ! _.isEmpty( countriesData[ country ].states ) && ! state ) {
			errors.state = __( 'This field is required' );
		}
	}

	return errors;
};

const getPackagesErrors = ( values ) => _.mapValues( values, ( pckg ) => {
	const errors = {};
	if ( ! pckg.weight || 'number' !== typeof pckg.weight || 0 > pckg.weight ) {
		errors.weight = __( 'Invalid weight' );
	}
	return errors;
} );

const getRatesErrors = ( values ) => _.mapValues( values, ( ( rate ) => rate ? null : __( 'Please choose a rate' ) ) );

const getPreviewErrors = ( paperSize ) => {
	const errors = {};
	if ( ! paperSize ) {
		errors.paperSize = __( 'This field is required' );
	}
	return errors;
};

export default createSelector(
	( state ) => state.shippingLabel,
	( state, { countriesData } ) => countriesData,
	( shippingLabel, countriesData ) => {
		const { form, paperSize } = shippingLabel;
		if ( _.isEmpty( form ) ) {
			return;
		}
		return {
			origin: getAddressErrors( form.origin, countriesData ),
			destination: getAddressErrors( form.destination, countriesData ),
			packages: getPackagesErrors( form.packages.selected ),
			rates: getRatesErrors( form.rates.values ),
			preview: getPreviewErrors( paperSize ),
		};
	}
);
