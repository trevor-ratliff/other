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
    document.getElementById("r"+ x +"c"+ y).src = "images/"+ imgTmp + img.substring(img.lastIndexOf("."), img.length);

    if(x > 1){
      //get the image associated with passed light
      imgU = document.getElementById("r"+ (parseFloat(x)-1) +"c"+ y).src;
      imgLevelU = imgU.substring(imgU.lastIndexOf("/")+1, imgU.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelU,level);

      //put new image up
      document.getElementById("r"+ (parseFloat(x)-1) +"c"+ y).src = "images/"+ imgTmp + imgU.substring(imgU.lastIndexOf("."), imgU.length);
    }

    if(x < size){
      //get the image associated with passed light
      imgD = document.getElementById("r"+ (parseFloat(x)+1) +"c"+ y).src;
      imgLevelD = imgD.substring(imgD.lastIndexOf("/")+1, imgD.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelD,level);

      //put new image up
      document.getElementById("r"+ (parseFloat(x)+1) +"c"+ y).src = "images/"+ imgTmp + imgD.substring(imgD.lastIndexOf("."), imgD.length);
    }

    if(y > 1){
      //get the image associated with passed light
      imgL = document.getElementById("r"+ x +"c"+ (parseFloat(y)-1)).src;
      imgLevelL = imgL.substring(imgL.lastIndexOf("/")+1, imgL.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelL,level);

      //put new image up
      document.getElementById("r"+ x +"c"+ (parseFloat(y)-1)).src = "images/"+ imgTmp + imgL.substring(imgL.lastIndexOf("."), imgL.length);
    }

    if(y < size){
      //get the image associated with passed light
      imgR = document.getElementById("r"+ x +"c"+ (parseFloat(y)+1)).src;
      imgLevelR = imgR.substring(imgR.lastIndexOf("/")+1, imgR.lastIndexOf("/")+2);

      //swap the image
      imgTmp = swapImage(imgLevelR,level);

      //put new image up
      document.getElementById("r"+ x +"c"+ (parseFloat(y)+1)).src = "images/"+ imgTmp + imgR.substring(imgR.lastIndexOf("."), imgR.length);
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
        document.getElementById("r"+ ii +"c"+ nn).src = "images/clear.jpg";
      }
    }

    if(confirm("Start new game?")){
      location.reload(true);
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

size = 3;
//~ size = parseFloat(prompt("enter the size of grid (1-50)","3"));
size = validate(size, "Please enter a number between 1 and 50 for the grid size", 3, 1, 50);

level = 1;
//~ level = parseFloat(prompt("enter the level of play (1-7)","1"));
level = validate(level, "Please enter a number between 1 and 7 for the level of play", 1, 1, 7);

rndCheck = 1;
//~ rndCheck = parseFloat(prompt("Randomize lights (0=no, 1=yes)?","0"));
rndCheck = validate(rndCheck, "Please enter 0 for no or 1 for yes to randomize the lights or not", 0, 0, 1);

//initialize display
disp = '<input type="hidden" id="done" name="done" value="false"><table border="0" align="center" cellpadding="1" cellspacing="0">';

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
    disp += '<td><a onClick="update('+ ii +','+ nn +','+ size +','+ level +');"><img id="r'+ ii +'c'+ nn +'" name="r'+ ii +'c'+ nn +'" src="images/'+ rndLevel +'.jpg" border="0"></a></td>';
  }
  disp += "</tr>";
}

disp += "</table>\n\n<div id=\"controls\"><span>size: <input type=\"text\" id=\"txtSize\" value=\"" + size + "\" /></span>";
disp += '<span>level: <input type="text" id="txtLevel" value=' + level +'" /></span>';
disp += '<span>randize: <input type="checkbox" id="chkRandom" checked="' + rndCheck == 1 ? 'true' : 'false' + '" /></span>';
disp += '<input type="submit" value="Submit"></div>';

document.open;
document.write(disp);
document.close;
