import React, { PropTypes } from 'react';
import { translate as __ } from 'lib/mixins/i18n';
import PackageList from './list';
import PackageInfo from './package-info';
import MoveItemDialog from './move-item';
import AddItemDialog from './add-item';
import Unpacked from './unpacked';
import FormButton from 'components/forms/form-button';
import Notice from 'components/notice';
import { hasNonEmptyLeaves } from 'lib/utils/tree';
import { sprintf } from 'sprintf-js';
import StepContainer from '../../step-container';

const PackagesStep = ( {
	openedPackageId,
	selected,
	all,
	flatRateGroups,
	unpacked,
	storeOptions,
	labelActions,
	errors,
	expanded,
	showItemMoveDialog,
	movedItemIndex,
	targetPackageId,
	showAddItemDialog,
	sourcePackageId } ) => {
	const packageIds = Object.keys( selected );
	const itemsCount = packageIds.reduce( ( result, pId ) => ( result + selected[ pId ].items.length ), 0 );
	const totalWeight = packageIds.reduce( ( result, pId ) => ( result + selected[ pId ].weight ), 0 );
	const isValidWeight = packageIds.reduce( ( result, pId ) => ( result && 0 < selected[ pId ].weight ), true );
	const isValidPackages = 0 < packageIds.length;
	const hasAnyPackagesConfigured = all && Object.keys( all ).length;

	const getContainerState = () => {
		if ( ! isValidPackages ) {
			return {
				isError: true,
				summary: __( 'No packages selected' ),
			};
		}

		if ( ! isValidWeight ) {
			return {
				isError: true,
				summary: __( 'Weight not entered' ),
			};
		}

		let summary = '';

		if ( 1 === packageIds.length && 1 === itemsCount ) {
			summary = sprintf( __( '1 item in 1 package: %f %s total' ), totalWeight, storeOptions.weight_unit );
		} else if ( 1 === packageIds.length ) {
			summary = sprintf( __( '%d items in 1 package: %f %s total' ), itemsCount, totalWeight, storeOptions.weight_unit );
		} else {
			summary = sprintf( __( '%d items in %d packages: %f %s total' ), itemsCount, packageIds.length, totalWeight, storeOptions.weight_unit );
		}

		if ( ! hasAnyPackagesConfigured ) {
			return { isWarning: true, summary };
		}

		return { isSuccess: true, summary };
	};

	const renderWarning = () => {
		if ( ! hasAnyPackagesConfigured ) {
			const packagesMsg = sprintf(
				__( 'There are no packages configured. The items have been packed individually. You can add or enable packages using the <a href="%(url)s">Packaging Manager</a>.' ),
				{
					url: 'admin.php?page=wc-settings&tab=connect&section=packages',
				}
			);

			return <Notice
				className="validation-message"
				status="is-warning"
				showDismiss={ false }>
				<span dangerouslySetInnerHTML={ { __html: packagesMsg } } />
			</Notice>;
		}

		return null;
	};

	const renderContents = () => {
		const elements = [
			<PackageList
				key="packages-list"
				openPackage={ labelActions.openPackage }
				packageId={ openedPackageId }
				selected={ selected }
				all={ all }
				unpacked={ unpacked }
				addPackage={ labelActions.addPackage }/>,
		];

		if ( ! packageIds.length && ! unpacked.length ) {
			elements.push(
				<div key="no-packages" className="wcc-package">{ __( 'There are no packages or items associated with this order' ) }</div>
			);
		} else {
			elements.push(
				<PackageInfo
					key="package-info"
					packageId={ openedPackageId }
					selected={ selected }
					all={ all }
					flatRateGroups={ flatRateGroups }
					unpacked={ unpacked }
					dimensionUnit={ storeOptions.dimension_unit }
					weightUnit={ storeOptions.weight_unit }
					errors={ errors }
					updateWeight={ labelActions.updatePackageWeight }
					openItemMove={ labelActions.openItemMove }
					removeItem={ labelActions.removeItem }
					removePackage={ labelActions.removePackage }
					setPackageType={ labelActions.setPackageType }
					openAddItem={ labelActions.openAddItem } />
			);
			elements.push(
				<Unpacked
					key="unpacked"
					packageId={ openedPackageId }
					unpacked={ unpacked }
					openItemMove={ labelActions.openItemMove }
					moveItem={ labelActions.moveItem } />
			);
		}

		return (
			<div className="wcc-packages-container">
				{ elements }
			</div>
		);
	};

	return (
		<StepContainer
			title={ __( 'Packages' ) }
			{ ...getContainerState() }
			expanded={ expanded }
			toggleStep={ () => labelActions.toggleStep( 'packages' ) } >
			{ renderWarning() }
			{ renderContents() }
			<div className="step__confirmation-container">
				<FormButton
					type="button"
					className="packages__confirmation step__confirmation"
					disabled={ hasNonEmptyLeaves( errors ) || ! packageIds.length }
					onClick={ labelActions.confirmPackages }
					isPrimary >
					{ __( 'Use these packages' ) }
				</FormButton>
			</div>
			<MoveItemDialog
				showItemMoveDialog={ showItemMoveDialog || false }
				movedItemIndex={ isNaN( movedItemIndex ) ? -1 : movedItemIndex }
				openedPackageId={ openedPackageId }
				targetPackageId={ targetPackageId }
				selected={ selected }
				all={ all }
				unpacked={ unpacked }
				closeItemMove={ labelActions.closeItemMove }
				setTargetPackage={ labelActions.setTargetPackage }
				confirmItemMove={ labelActions.confirmItemMove } />
			<AddItemDialog
				showAddItemDialog={ showAddItemDialog || false }
				movedItemIndex={ movedItemIndex }
				sourcePackageId={ sourcePackageId }
				openedPackageId={ openedPackageId }
				selected={ selected }
				all={ all }
				unpacked={ unpacked }
				closeAddItem={ labelActions.closeAddItem }
				setAddedItem={ labelActions.setAddedItem }
				confirmAddItem={ labelActions.confirmAddItem } />
		</StepContainer>
	);
};

PackagesStep.propTypes = {
	openedPackageId: PropTypes.string,
	showItemMoveDialog: PropTypes.bool,
	selected: PropTypes.object.isRequired,
	all: PropTypes.object.isRequired,
	flatRateGroups: PropTypes.object.isRequired,
	labelActions: PropTypes.object.isRequired,
	storeOptions: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	expanded: PropTypes.bool,
	movedItemIndex: PropTypes.number,
	targetPackageId: PropTypes.string,
	showAddItemDialog: PropTypes.bool,
	sourcePackageId: PropTypes.string,
};

export default PackagesStep;
