import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

monaco.editor.addEditorAction({
    // An unique identifier of the contributed action.
	id: "save-file",

	// A label of the action that will be presented to the user.
	label: "Save as file",

	// An optional array of keybindings for the action.
	keybindings: [
		//monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10,
		// chord
		monaco.KeyMod.chord(
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
			//monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM
		),
	],

	// A precondition for this action.
	precondition: null,

	// A rule to evaluate on top of the precondition in order to dispatch the keybindings.
	keybindingContext: null,

	contextMenuGroupId: "navigation",

	contextMenuOrder: 1.5,

	// donload file
	run: (ed) => {
        let text = ed.getValue();
        let blob = new Blob([text])
        let url = window.URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = ed._page.id;
        //document.body.appendChild(a);
        a.click();
        //window.URL.revokeObjectURL(url);
	},
});