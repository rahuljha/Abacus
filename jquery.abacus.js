varStruct = function() {
    this.varId = null;
    this.varInit = null;
    this.varCol = null;
    this.varMode = null; //equals either "literal" or "column"
}

Abacus = function() {
    this.varList = {};
    this.outputCell = "";
    this.funCellId = "";
}

Abacus.prototype.update = function() {
    programText = $('#'+this.funCellId).text();

    env = new Environment();
    varNameList = [];
    varValList = [];
    for(var varName in this.varList) {
	varNameList.push(varName);
	varVal = $('#'+this.varList[varName].varId).text().split("=")[1];
	varVal = isNaN(varVal) ? varVal : parseFloat(varVal);
	varValList.push(new Const(varVal));
    }

    try {
	func = new FuncDecl('temp', varNameList, ssParser.parse(programText)).value(new Environment());
	sel = new Select(func, [new FuncArg2(varValList)]);
	$("#"+this.outputCell).text(sel.value(env));
    } catch(err) {
	alert(err);
    }
};
    

Abacus.prototype.makeFun = function() {
    var _this = this;
    $(".jSheetCellHighighted").each(function(index) {
	$(this).addClass("abacusFunctionCell");
	_this.funCellId = $(this).attr("id");

	programText = $(this).text();
	env = new Environment();
//func = ssParser.parse('function f2c(f) { return (f-32)/1.8; }');
	varNameList = [];
	varValList = [];
	for(var varName in _this.varList) {
	    varNameList.push(varName);
	    varVal = _this.varList[varName].varInit;
	    varVal = isNaN(varVal) ? varVal : parseFloat(varVal);
	    varValList.push(new Const(varVal));
	}

	try {
	    func = new FuncDecl('temp', varNameList, ssParser.parse(programText)).value(new Environment());
	    //	args = [new Const(42), new Const(0.1)];
	    sel = new Select(func, [new FuncArg2(varValList)]);
	    //	args[0] = new Const(22);
	    $("#"+_this.outputCell).text(sel.value(env));
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

	var colExpRegex = /\[([A-Z])\]/;

	regexRes = colExpRegex.exec(varInit);

	if(!regexRes) {
	    varListEntry.varInit = varInit;
	    varListEntry.varMode = "literal";
	} else {
	    varListEntry.varCol = regexRes[1];
	    varListEntry.varMode = "column";
	}

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


