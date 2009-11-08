/**
 * WysiHat.AdvancedToolbar.ButtonSets
 *
 *  A namespace for various sets of Toolbar buttons. These sets should be
 *  compatible with WysiHat.AdvancedToolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.AdvancedToolbar.ButtonSets.Basic);
**/
WysiHat.AdvancedToolbar.ButtonSets = {};

/**
 * WysiHat.AdvancedToolbar.ButtonSets.Basic
 *
 *  A basic set of buttons: bold, underline, and italic. This set is
 *  compatible with WysiHat.AdvancedToolbar, and can be added to the toolbar with:
 *  toolbar.addButtonSet(WysiHat.AdvancedToolbar.ButtonSets.Basic);
**/
WysiHat.AdvancedToolbar.ButtonSets.Basic = $A([
  { label: "Bold" },
  { label: "Underline" },
  { label: "Italic" }
]);
