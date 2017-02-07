Para el schedule de PrimeNG:
	Instead of including the Fullcalendar JavaScript from the assets folder, I used NPM to install, and include it in dependencies. I also did this for moment.js

	npm install fullcalendar --save
	npm install moment --save
	
	In package.json under dependencies these were added:
	
	"fullcalendar": "^3.0.1",
	"moment": "^2.15.2",
	
	Then in the angular-cli.json the relevant files need to be added for styles and scripts.
	
	Under styles:
	"../node_modules/fullcalendar/dist/fullcalendar.min.css"
	
	Under Scripts:
	"../node_modules/moment/min/moment.min.js",
	"../node_modules/fullcalendar/dist/fullcalendar.js"