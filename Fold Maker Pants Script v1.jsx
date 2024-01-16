
//FoldMaker Pants Product Image Creation Tool
//Version 1.0
//Unauthorized duplication or sharing of this tool is strictly prohibited.


alert("Welcome to the FoldMaker Product Image Creation Tool for Pants.\n\nThis tool will take all of the pants images in a designated folder and crop the left side off automatically. The tool will walk you through the process step by step so just follow the instructions!\n\nThis tool runs only the following image file types:\n.png, .jpg, .jpeg.\n\nAdditionally, you need to run any of your remove-background or trimming processes **before** running this program. Images that aren't perfectly centered will produce unexpected results.");
if (app.documents.length > 0) {//If there is a file left open
    alert("Please close all open documents before running this script.");
}
else {
    var strtRulerUnits = app.preferences.rulerUnits; // store default ruler units
    app.preferences.rulerUnits = Units.PERCENT; // change units to percent

    // Use folder selection dialogs to get the location of the input files
    // and where to save the new output files.
    alert("Please choose the folder location containing the product images you would like to edit.");
    var sourceFolder = Folder.selectDialog("Please choose the folder location with the product images you would like to edit.", Folder.myDocuments);

    alert("Please choose the folder location where you would like to save the edited images. This can be the same place as the source folder if you want!\n\nOnce you have selected the destination folder, the program will start and Photoshop may flash as it opens, works through, and closes every file in the selected folder. This is expected!");
    var destFolder = Folder.selectDialog("Please choose the folder location where you would like to save the edited images.", sourceFolder);

    var files = sourceFolder.getFiles(/.+\.(?:jpe?g|png)$/i);
    var numOfFiles = files.length;

    if(numOfFiles < 1){
        alert("The folder you selected contained no compatible images. Please try again, making sure to select a folder containing .jpeg, .jpg and/or .png files.");
    }
    else {
        // Set PNG Options
        var pngOpts = new ExportOptionsSaveForWeb;
        pngOpts.format = SaveDocumentType.PNG;
        pngOpts.PNG8 = false;
        pngOpts.transparency = true;
        pngOpts.interlaced = false;
        pngOpts.quality = 100;

        //Iterate through the source folder
        for (var i = 0; i < numOfFiles; i++){
            if (files[i] instanceof Folder) { // if file is folder, jump to next item
                continue;
            }
            
            var docRef = app.open(files[i]); //send the current open document into a variable to call later
            var fileNameLength = (this.destFolder + '/' + activeDocument.name.match(/(.*)\.[^\.]+$/)[1] + '.').replace(' ', '%20').length  + 11;
            if(!(fileNameLength >= 198)){
                createPants(docRef);
                    
                activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            }
            else{
                alert('The filename and path for the file \n\"' + activeDocument.name.match(/(.*)\.[^\.]+$/)[1] + '\"\n-is too long to be properly saved. ' +
                'Please try again with a shorter file name and destination path.\n\nI.E. Mens_Brand_1_final_final_final_finalv3.jpg shortened' +
                ' to Mens_Brand_1.jpg OR /desktop/images/project/2023/mens/imageconvert/final/final to /desktop/output. ETC.');
            }
        }
        
        app.preferences.rulerUnits = strtRulerUnits;
        alert('Thanks for using this tool!\n\nAs a reminder, your images were saved here:\n' + decodeURI(destFolder));
    }
}

function createPants(docRef){ //Create Pants Fold file from source image
    docRef.resizeCanvas(docRef.width.value * .5, docRef.height.value, AnchorPosition.MIDDLERIGHT); //Crop the bottom half of the pants out

    var fileName =activeDocument.name.match(/(.*)\.[^\.]+$/)[1];
    var fileExt =activeDocument.name.toLowerCase().match(/[^\.]+$/).toString();
    var suffix = '_PHF';

    var saveFile = new File(this.destFolder + '/' + fileName + suffix + '.' + fileExt ); //create variable containing file name + added suffix
    
    activeDocument.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,this.pngOpts);

    docRef.activeHistoryState = docRef.historyStates[0];
    
    //save the file as png with suffix and declared options
    return;
}
