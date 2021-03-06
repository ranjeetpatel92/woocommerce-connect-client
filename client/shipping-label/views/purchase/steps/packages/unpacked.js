import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';
import ItemInfo from './item-info';
import FormLegend from 'components/forms/form-legend';

const Unpacked = ( { packageId, unpacked, openItemMove, moveItem } ) => {
	if ( '' !== packageId ) {
		return null;
	}

	const renderItemInfo = ( item, itemIndex ) => {
		return (
			<ItemInfo key={ itemIndex } item={ item } itemIndex={ itemIndex } packageId={ packageId } openItemMove={ openItemMove } moveItem={ moveItem } />
		);
	};

	return (
		<div className="wcc-package">
			<FormLegend className="wcc-package-item__name">{ __( 'Saved for later' ) }</FormLegend>
			{ unpacked.length ? unpacked.map( renderItemInfo ) : <div>{ __( 'There are no items saved for a later delivery' ) }</div> }
		</div>
	);
};

Unpacked.propTypes = {
	packageId: PropTypes.string.isRequired,
	unpacked: PropTypes.array.isRequired,
};

export default Unpacked;
