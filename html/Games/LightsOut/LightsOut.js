function getQuerystring(item){
	//this will get the querysting value of the passed item 
	qs = document.location.search.substring(1);
	reg = eval("\/" + item + "=[0-9]*\/");
	itemKeyVal = qs.match(reg);
	
	if(itemKeyVal){
		arrItem = itemKeyVal[0].split("=");
	}else{
		arrItem = "null=0".split("=");
	}
	
	return parseInt(arrItem[1]);
}

function newGame(){
	loc = document.location.href.replace(/\?.*/, '');
	loc += "?size=" + document.getElementById("size").value;
	loc += "level=" + document.getElementById("level").value;
	loc += "random=" + document.getElementById("random").value;
	
	document.location.href = loc;
}

function update(x,y,size,level){
  //this will update the lights
  var img, imgU, imgD, imgL, imgR, imgLevel, imgLevelU, imgLevelD, imgLevelL, imgLevelR, imgTmp;

  if(document.getElementById("done").value == "false"){
    //get the image associated with passed light
    img = document.getElementById("r"+ x +"c"+ y).src;
    imgLevel = img.substring(img.lastIndexOf("/")+1, img.lastIndexOf("/")+2);

    //swap the image
    imgTmp = swapImage(imgLevel,level);

    //put new image up
    document.getElementById("r"+ x +"c"+ y).src = "images/"+ imgTmp +"_1"+ img.substring(img.lastIndexOf("."), img.length);

    if(x > 1){
      //get the image associated with passed light
      imgU = document.getElementById("r"+ (parseFloat(x)-1) +"c"+ y).src;
      imgLevelU = imgU.substring(imgU.lastIndexOf("/")+1, imgU.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelU,level);

      //put new image up
      document.getElementById("r"+ (parseFloat(x)-1) +"c"+ y).src = "images/"+ imgTmp +"_1"+ imgU.substring(imgU.lastIndexOf("."), imgU.length);
    }

    if(x < size){
      //get the image associated with passed light
      imgD = document.getElementById("r"+ (parseFloat(x)+1) +"c"+ y).src;
      imgLevelD = imgD.substring(imgD.lastIndexOf("/")+1, imgD.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelD,level);

      //put new image up
      document.getElementById("r"+ (parseFloat(x)+1) +"c"+ y).src = "images/"+ imgTmp +"_1"+ imgD.substring(imgD.lastIndexOf("."), imgD.length);
    }

    if(y > 1){
      //get the image associated with passed light
      imgL = document.getElementById("r"+ x +"c"+ (parseFloat(y)-1)).src;
      imgLevelL = imgL.substring(imgL.lastIndexOf("/")+1, imgL.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelL,level);

      //put new image up
      document.getElementById("r"+ x +"c"+ (parseFloat(y)-1)).src = "images/"+ imgTmp +"_1"+ imgL.substring(imgL.lastIndexOf("."), imgL.length);
    }

    if(y < size){
      //get the image associated with passed light
      imgR = document.getElementById("r"+ x +"c"+ (parseFloat(y)+1)).src;
      imgLevelR = imgR.substring(imgR.lastIndexOf("/")+1, imgR.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelR,level);

      //put new image up
      document.getElementById("r"+ x +"c"+ (parseFloat(y)+1)).src = "images/"+ imgTmp +"_1"+ imgR.substring(imgR.lastIndexOf("."), imgR.length);
    }

    checkAll(size,level);
  }
}

function swapImage(img,level){
  //swaps passed image with correct new image
  img -= 1;
  if(img < 0){img = level;}

  return img;
}

function checkAll(size,level){
  var test, tmp, tmpTest;
  test = true;
  for(ii=1;ii<=size;ii++){
    for(nn=1;nn<=size;nn++){
      //~ tmp = eval("document.lights.r"+ ii +"c"+ nn +".src")
      tmp = document.getElementById("r"+ ii +"c"+ nn).src;
      tmpTest = tmp.substring(tmp.lastIndexOf("/")+1, tmp.lastIndexOf("/")+2);
      if(tmpTest != 0){test=false;}
    }
  }

  if(test){
    for(ii=1;ii<=size;ii++){
      for(nn=1;nn<=size;nn++){
        document.getElementById("r"+ ii +"c"+ nn).src = "images/0_0.png";
      }
    }

    if(confirm("Start new game?")){
      //~ location.reload(true);
			
			if(parseFloat(document.getElementById("size").value) + 1 <= 50){
				document.getElementById("size").value = parseFloat(document.getElementById("size").value) + 1;
			}else{
				document.getElementById("size").value = 3;
				if(parseFloat(document.getElementById("level").value) + 1 <= 7){
					document.getElementById("level").value = parseFloat(document.getElementById("level").value) + 1;
				}else{
					document.getElementById("level").value = 1;
					if(parseFloat(document.getElementById("random").value) + 1 <= 1){
						document.getElementById("random").value = parseFloat(document.getElementById("random").value) + 1;
					}else{
						document.getElementById("random").value = 0;
					}
				}
			}
				
			newGame();
    }else{
      document.getElementById("done").value = "true";
    }
  }
}

function validate(x, des, value, min, max){
  var tmp;
  if(!isFinite(x) || x > max || x < min){
    tmp = prompt(des, value);
    tmp = validate(tmp, des, value, min, max);

    return tmp;

  }else{
    return x;
  }
}

var size, rndCheck, level, rndLevel, disp;

size = getQuerystring("size");
size = size != "" || size >= 3 ? size : 3;
//~ size = 3;
//~ size = parseFloat(prompt("enter the size of grid (1-50)","3"));
size = validate(size, "Please enter a number between 3 and 50 for the grid size", 3, 3, 50);

level = getQuerystring("level");
level = level != "" || level >= 1 ? level : 1;
//~ level = 1;
//~ level = parseFloat(prompt("enter the level of play (1-7)","1"));
level = validate(level, "Please enter a number between 1 and 7 for the level of play", 1, 1, 7);

rndCheck = getQuerystring("random");
rndCheck = rndCheck != "" || rndCheck >= 0 ? rndCheck : 1;
//~ rndCheck = 1;
//~ rndCheck = parseFloat(prompt("Randomize lights (0=no, 1=yes)?","0"));
rndCheck = validate(rndCheck, "Please enter 0 for no or 1 for yes to randomize the lights or not", 0, 0, 1);

//initialize display
disp = '<input id="done" value="false" name="done" type="hidden">';
disp += '<table border="0" cellspacing="0" cellpadding="0" class="nopadding">';

//loop through size and create light grid
for(ii=1;ii<=size;ii++){
  disp += "<tr>"
  for(nn=1;nn<=size;nn++){
    if(parseFloat(rndCheck) == 1){
      rndLevel = Math.floor(Math.random()*(level+1))-1;
      if(rndLevel < 0){
        rndLevel = level;
      }
    }else{
      rndLevel = level;
    }
    //alert(rndLevel);
    disp += '<td class="nopadding"><a onclick="update('+ ii +','+ nn +','+ size +','+ level +');"><img id="r'+ ii +'c'+ nn +'" border="0" src="images/'+ rndLevel +'_1.png" name="r'+ ii +'c'+ nn +'"></a></td>';
  }
  disp += "</tr>";
}

disp += "</table>";

disp += '<div style="margin-right: auto; margin-left: auto;">size (3-50) = <input id="size" value="' + size + '" size="3" type="text"/><br/>';
disp += 'level (1-7) = <input id="level" value="' + level + '" size="3" type="text"/><br/>';
disp += 'random (0-1) = <input id="random" value="' + rndCheck + '" size="3" type="text"/><br/>';
disp += '<input value="New Game" onclick="newGame();" type="button"/></div>';

document.open;
document.write(disp);
document.close;
