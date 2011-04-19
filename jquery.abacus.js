
var colExpRegex = /\[([A-Z])\]/;

varStruct = function() {
    this.varId = null;
    this.varInit = null;
    this.varCol = null;
    this.varMode = null; //equals either "literal" or "column"
}

Abacus = function() {
    this.varList = {};
    this.outputCell = "";
    this.outputCellCol = "";
    this.funCellId = "";
}

Abacus.prototype.update = function() {
    programText = $('#'+this.funCellId).text();

    env = new Environment();
    varNameList = [];
    varValList = [];
    for(var varName in this.varList) {
	varNameList.push(varName);
	varValList.push(new Const($('#'+this.varList[varName].varId).text().split("=")[1]));
    }

    func = new FuncDecl('temp', varNameList, ssParser.parse(programText)).value(new Environment());
    sel = new Select(func, [new FuncArg2(varValList)]);
    
    $("#"+this.outputCell).text(sel.value(env));
};
    

Abacus.prototype.makeFun = function() {
    var _this = this;
    $(".jSheetCellHighighted").each(function(index) {
	$(this).addClass("abacusFunctionCell");
	_this.funCellId = $(this).attr("id");

	programText = $(this).text();
	env = new Environment();

//	varNameList = [];
//	varValList = [];

    //check each input variable
    //if any variable is a column name confirm output is a column name
    //push 

	calMode = "literal";
    
	for(var varName in _this.varList) {
    	    if(_this.varList[varName].varMode.toString() == "column") {
    		if(_this.outputCellCol.toString() == "") {
    		    alert("Error: Column referred to for variable "+varName+" but no column found in the output Cell");
		    exit();
    		} else {
		    calMode = "column";
		}
    	    }
	}

	inputVals = new Array();
	outputCells = new Array();

	if(calMode == "literal") {
	    for(var varName in _this.varList) {
			    
		varNameList = new Array();
		varValList = new Array();

		varNameList.push(varName);
		varVal = _this.varList[varName].varInit;
		varVal = isNaN(varVal) ? varVal : parseFloat(varVal);
		varValList.push(new Const(varVal));

		inputVals.push(varValList);
	    }

	outputCells.push(_this.outputCell);

	} else {
	    
	    var rowNo = 0;
	    var endOfRows = false;

	    var tableRegex = /_table(\d+)_/;
	    tableRes = tableRegex.exec(_this.outputCell);
	    tableNo = tableRes[1];

	    while(!endOfRows) {
		
		varNameList = new Array();
		varValList = new Array();
		
		for(var varName in _this.varList) {

		    if(_this.varList[varName].varMode.toString() == "literal") {
			varVal = _this.varList[varName].varInit;
			varVal = isNaN(varVal) ? varVal : parseFloat(varVal);
			varValList.push(new Const(varVal));
		    } else {
			colAlpha = _this.varList[varName].varCol;
			colNo = colAlpha.charCodeAt(0);
			colNo -= 65;
			varCellId = "0_table"+tableNo+"_cell_c"+colNo+"_r"+rowNo;
			varCellVal = $("#"+varCellId).text();
			if(varCellVal == "") {
			    endOfRows = true;
			}

			varNameList.push(varName);
			varValList.push(new Const(varCellVal));
		    }
		}

		if(endOfRows) {
		    break;
		}

		outputColAlpha = _this.outputCellCol;
		outputColNo = outputColAlpha.charCodeAt(0);
		outputColNo -= 65;

		inputVals.push(varValList);
		outputCells.push("0_table"+tableNo+"_cell_c"+outputColNo+"_r"+rowNo);

		rowNo++;
	    }

	}

	alert(inputVals.toSource());
	alert(outputCells.toSource());

	try {
	    func = new FuncDecl('temp', varNameList, ssParser.parse(programText)).value(new Environment());

	    for(var i=0; i< inputVals.length; i++) {

		varVal = inputVals[i];
		varVal = isNaN(varVal) ? varVal : parseFloat(varVal);

		sel = new Select(func, [new FuncArg2(varVal)]);
		$("#"+outputCells[i]).text(sel.value(env));
	    }
	} catch(err) {
	    alert(err);
	}
    });
    
}

Abacus.prototype.remFun = function() {
    $(".jSheetCellHighighted").each(function(index) {
	$(this).removeClass("abacusFunctionCell");
    });
}

Abacus.prototype.makeFunArg = function() {
    var _this = this;
    $(".jSheetCellHighighted").each(function(index) {
	$(this).addClass("abacusFunArgCell");
	varText = $(this).text();
	vals = new Array();
	vals = varText.split("=");
	varName = vals[0];
	varInit = vals[1];

	varListEntry = new varStruct();
	varListEntry.varId = $(this).attr("id");



	regexRes = colExpRegex.exec(varInit);

	if(!regexRes) {
	    varListEntry.varInit = varInit;
	    varListEntry.varMode = "literal";
	} else {
	    varListEntry.varCol = regexRes[1];
	    varListEntry.varMode = "column";
	}

	alert(varListEntry.toSource());
	_this.varList[varName] = varListEntry;

    });
}

Abacus.prototype.remFunArg = function() {
    var _this = this;
    $(".jSheetCellHighighted").each(function(index) {
	$(this).removeClass("abacusFunArgCell");
	varText = $(this).text();
	vals = new Array();
	vals = varText.split("=");
	varName = vals[0];

	delete _this.varList[varName];
    });
}

Abacus.prototype.makeOutputCell = function() {
    var _this = this;
    $(".jSheetCellHighighted").each(function(index) {
	$(this).addClass("abacusOutputCell");
	_this.outputCell = $(this).attr("id");

	regexRes = colExpRegex.exec($(this).text());

	if(regexRes) {
	    _this.outputCellCol = regexRes[1];
	}

	alert(_this.toSource());
    });
}

Abacus.prototype.remOutputCell = function() {
    var _this = this;
    $(".jSheetCellHighighted").each(function(index) {
	$(this).removeClass("abacusOutputCell");
	_this.outputCell = "";
    });
}

abacus = new Abacus();


