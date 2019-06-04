( function ( mw, OO, ve ) {
	'use strict';
	mw.veForAll = mw.veForAll || {
		ui: {}
	};

	/**
	 * Inherits from the stand-alone target.
	 *
	 * @class
	 * @extends ve.init.sa.Target
	 */
	mw.veForAll.Targetwide = function ( node, content ) {
		mw.veForAll.Targetwide.parent.call( this, node, content );
	};

	OO.inheritClass( mw.veForAll.Targetwide, mw.veForAll.Target );

	mw.veForAll.Targetwide.static.name = 'veForAllWide';
	
	var toolGroups = mw.config.get('VEForAll');

	mw.veForAll.Targetwide.static.toolbarGroups = toolGroups ? toolGroups.VEForAllToolGroupsWide : [];


	ve.init.mw.targetFactory.register( mw.veForAll.Targetwide );

}( mediaWiki, OO, ve ) );
