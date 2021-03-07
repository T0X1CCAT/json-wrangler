-use node 13 for dev, and node >=14 for building dist

Build and deploy
-yarn dist: create dmg
-copy dist/dmg somewhere and double click. Install into applications
-go into automater and create a new quick action
-In the quick action config add Launch Application as an action and select json-wrangler.app as the application
-save the quick action
-then go into apple system prefs keyboard shortcuts. Click Services in the left section and add a
shortcut. I use shift-option-command-J
-restart computer for shortcut to take effect (might not need this step)

