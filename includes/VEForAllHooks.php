<?php

namespace VEForAll;

class VEForAllHooks {

	/**
	 * Implements BeforePageDisplay hook.
	 * See https://www.mediawiki.org/wiki/Manual:Hooks/BeforePageDisplay
	 * Initializes variables to be passed to JavaScript.
	 *
	 * @param OutputPage $output OutputPage object
	 * @param Skin $skin Skin object that will be used to generate the page
	 */
	public static function onBeforePageDisplay( $output, $skin ) {
		$user = $output->getUser();
		$conf = \MediaWiki\MediaWikiServices::getInstance()->getMainConfig();
		$vars = [];
		$vars['VisualEditorEnable'] = $user->getOption( 'visualeditor-enable' );
		$toolGroups = null;//$conf->get('VEForAllTools');
		$toolGroupsWide = null;//$conf->get('VEForAllToolsWide');
		$toolGroups = $toolGroups ? $toolGroups : self::getDefualtTools();
		$toolGroupsWide = $toolGroupsWide ? $toolGroupsWide : self::getDefualtWideTools();
		\Hooks::run( 'VEForAllToolsGroups', [ &$toolGroups ] );
		\Hooks::run( 'VEForAllToolsGroups', [ &$toolGroupsWide, 'wide' ] );
		$vars['VEForAllToolGroups'] = $toolGroups;
		$vars['VEForAllToolGroupsWide'] = $toolGroupsWide;
		$vars['VisualEditorEnable'] = $user->getOption( 'visualeditor-enable' );
		$output->addJSConfigVars( 'VEForAll', $vars );
	}
	public static function getDefualtWideTools( ) {
		$tools = self::getDefualtTools();
		array_unshift($tools[4]['include'],  'media');
		//array_unshift($tools[4]['include'],  'transclusion');
		return $tools;
	}
	public static function getDefualtTools( ) {
		return [
			// History
			// [ 'include' =>  [ 'undo', 'redo' ] ],
			// Format
			[
				'header' =>  wfMessage( 'visualeditor-toolbar-paragraph-format' )->text(),
				'title' =>  wfMessage( 'visualeditor-toolbar-format-tooltip' )->text(),
				'type' =>  'menu',
				'include'=> [ 
					[ 'group' =>  'format' ] ,
				],
				'promote' =>  [ 'paragraph' ],
				'demote' =>  [ 'preformatted', 'blockquote' ],
			],
			// Text style
			[
				'header' =>  wfMessage( 'visualeditor-toolbar-text-style' )->text(),
				'title' =>  wfMessage( 'visualeditor-toolbar-style-tooltip' )->text(),
				'include' =>  [ 'bold', 'italic', 'moreTextStyle' ],
			],
			// Link
			[ 'include' =>  [ 'link' ], ],
			// Structure
			[
				'header' =>  wfMessage( 'visualeditor-toolbar-structure' )->text(),
				'title' =>  wfMessage( 'visualeditor-toolbar-structure' )->text(),
				'type' =>  'list',
				'icon' =>  'listBullet',
				'include'=> [ [ 'group' =>  'structure' ] ],
				'demote' =>  [ 'outdent', 'indent' ]
			],
			// Insert
			[
				'header' =>  wfMessage( 'visualeditor-toolbar-insert' )->text(),
				'title' =>  wfMessage( 'visualeditor-toolbar-insert' )->text(),
				'type' =>  'list',
				'icon' =>  'add',
				'label' =>  '',
				'include' =>  [ 'insertTable', 'specialCharacter', 'warningblock', 'preformatted', 'infoblock', 'ideablock', 'dontblock', 'pinblock' ]
			],
			// Special character toolbar
			// [ 'include' =>  [ 'specialCharacter' ] ]
		];
	}

}
