/*!
 * VEForAll initialization
 *
 * @author Pierre Boutet, Clement Flipo
 * @copyright Copyright © 2016-2017, Wikifab
 */
( function ( $, mw ) {

	/**
	 * What this file does:
	 * - Loads VisualEditor library
	 * - Watch click on save button, to defer the save request after all visualEditor
	 *   requests are done.
	 */

	var veInstances = [],
		clickCount = [];

	function initVisualEditor() {
		var config = mw.config.get( 'VEForAll' );
		if ( !config.VisualEditorEnable ) {
			return;
		}

		// Init VisualEditor platform
		new ve.init.mw.Platform( ).initialize()
				.fail( function () {
					$( editor ).text( 'Sorry, this browser is not supported.' );
				} )
				.done( function () {
					// Add i18n messages to VE
					ve.init.platform.addMessages( mw.messages.get() );
				} );

		// we catch event on save button, to wait that every VE content is up to date
		// (ie api calls triggered and received)
		catchAndDelayClickEvent( 'wpSave' );
		catchAndDelayClickEvent( 'wpSaveAndContinue' );

		$( document ).trigger( 'VEForAllLoaded' );
	}

	mw.isNoVeWaitingForUpdate = function( ) {
		var everythingUpdated = true;
		for(let veInstance of veInstances){
			everythingUpdated = everythingUpdated && !veInstance.isOnConverting;
		}
		return everythingUpdated;
	}
	function catchAndDelayClickEvent( buttonId ) {
		var waitForUpdatingStoppd

		$( '#' + buttonId ).click( function ( event ) {
			
			if( !$(this).data('passCheck') ){
				//start by stoping current event
				event.preventDefault();
				//let blur of textarea affect
				waitForUpdatingStoppd = setInterval(function(){
					//check if all veditors finished
					if( mw.isNoVeWaitingForUpdate() ){
						clearInterval( waitForUpdatingStoppd );
						$(event.target).data('passCheck', 1)
							.trigger('click');
					}
				},50);
			}
		});
	}

	jQuery.fn.applyVisualEditor = function () {
		var config = mw.config.get( 'VEForAll' );
		if ( !config.VisualEditorEnable ) {
			return;
		}

		// var logo = $('<div class="ve-demo-logo"></div>');
		// var toolbar = $('<div class="ve-demo-toolbar ve-demo-targetToolbar"></div>');
		// var editor = $('<div class="ve-demo-editor"></div>');

		return this.each( function () {
			// $(this).before(logo, editor, toolbar);
			var veEditor = new mw.veForAll.Editor( this, $( this ).val(), function(){
				veInstances.splice( veInstances.indexOf(veEditor), 1 );
			} );
			veInstances.push( veEditor );
		} );
	};

	jQuery.fn.getVEInstances = function () {
		return veInstances;
	};

	// mw.loader.using( 'ext.veforall.main', $.proxy( initVisualEditor ) );
	initVisualEditor();
	$('body').on('VEForAllConvertingStarted', function(){
		//$('#wpSave,#wpSaveAndContinue').attr( 'disabled', 'disabled' );
	});
	$('body').on('VEForAllConvertingFinished', function(){
		// if( mw.isNoVeWaitingForUpdate() ){
		// 	$('#wpSave,#wpSaveAndContinue').removeAttr( 'disabled' );
		// }
	});
}( jQuery, mw ) );

$ = jQuery;
