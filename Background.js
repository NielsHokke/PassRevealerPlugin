/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

/*
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
  console.log("Item removed successfully");
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}

/*
Create all the context menu items.
*/
browser.menus.create({
  id: "RevealPass",
  title: browser.i18n.getMessage("menuItemRevealHidePass"),
  contexts: ["editable"]
}, onCreated);


/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
  // Filter on "RevealPass" context menu item
  if(info.menuItemId == "RevealPass") {
      
    // Get target element type attribute
    browser.tabs.executeScript(tab.id, {
      frameId: info.frameId,
      code: `browser.menus.getTargetElement(${info.targetElementId}).getAttribute('type');`
    }).then(result => {

      var new_type = result;

      // Togle between "password" and "shown_password" type attribute
      if(result == "password"){
        new_type = "shown_password";
      }else if(result == "shown_password"){
        new_type = "password";
      }

      // Set new target element type attribute
      browser.tabs.executeScript(tab.id, {
        frameId: info.frameId,
        code: `browser.menus.getTargetElement(${info.targetElementId}).setAttribute('type', '${new_type}');`
      }); 
    });
  }
});