import { assets } from '../assets/3dAssets';

export let settings = {
	mode: 
		'vr'
		// 'ar'
		// 'model'
		// 'threesixty'
		,
	controls: {
		flightmode: true, // gravity activated?
		movement: true // ability to freely move?
	},
	UI: {
		instructions: true
	},
	AR: {
		arMarker: false,
		video: false, //use live webcam feed in vr setup,
		arPattern: '/assets/ar/marker16.pat',
	},
	assets
}