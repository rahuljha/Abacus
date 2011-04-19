

// Spreadsheet code

function Cell() {
    this.val = null;
}
Cell.prototype.value = function(env) {
    return this.val;
};
Cell.prototype.assign = function(val) {
    this.val = val;
};
Cell.prototype.toString = function() {
    return this.value;
}

function Environment(env) {
    this.outer = env;
    this.variables = {};
}
Environment.prototype.lookup = function(name, outer) {
    if (!(name in this.variables)) {
        if (this.outer) {
            cell = this.outer.lookup(name, true);
            if (cell)
                return cell;
        }
        if (!outer)
            this.variables[name] = new Cell();
    }
    return this.variables[name];
};

function ArrayType(init) {
    this.init = init;
}
ArrayType.prototype.value = function(env) {
    this.array = [];
    for (i in this.init) {
        this.array[i] = new Cell();
        this.array[i].assign(this.init[i].value(env));
    }
    return this;
};
ArrayType.prototype.toString = function() {
    r = '';
    for (i in this.array) {
        if (r != '')
            r += ',';
        r += this.array[i].value(new Environment());
    }
    return '[' + r + ']';
};

function ObjectType(init) {
    this.init = init;
}
ObjectType.prototype.value = function(env) {
    this.fields = {};
    for (i in this.init) {
        this.fields[i] = new Cell();
        this.fields[i].assign(this.init[i].value(env));
    }
    return this;
};
ObjectType.prototype.toString = function() {
    a = [];
    for (i in this.fields)
        a.push(i);
    a.sort();
    r = '';
    for (i in a) {
        if (r != '')
            r += ',';
        r += a[i] + ':' + this.fields[a[i]].value(new Environment());
    }
    return '{' + r + '}';
}

function FuncDecl(name, params, body) {
    this.name = name;
    this.params = params;
    this.body = body;
}
FuncDecl.prototype.value = function(env) {
    func = new Func(this.name, this.params, this.body)
    new Variable(this.name).lookup(env).assign(func);
    return func;
};

function Func(name, params, body) {
    this.name = name;
    this.params = params;
    this.body = body;
}
Func.prototype.value = function(env) {
    return this;
};
Func.prototype.toString = function() {
    return 'function ' + this.name;
};

function If(cond, t, f) {
    this.cond = cond;
    this.t = t;
    this.f = f;
}
If.prototype.value = function(env) {
    if (this.cond.value(env))
        return this.t.value(env);
    else
        return this.f.value(env);
};

function NullStatement() {
}
NullStatement.prototype.value = function(env) {
    return null;
};

function While(cond, body) {
    this.cond = cond;
    this.body = body;
}
While.prototype.value = function(env) {
    while(this.cond.value(env))
        val = this.body.value(env);
    return val;
};

function CompoundStatement(first, rest) {
    this.first = first;
    this.rest = rest;
}
CompoundStatement.prototype.value = function(env) {
    this.first.value(env);
    return this.rest.value(env);
};

function ReturnValue(val) {
    this.name = 'ReturnValue';
    this.message = 'ReturnValue';
    this.val = val;
}

function Return(exp) {
    this.exp = exp;
}
Return.prototype.value = function(env) {
    throw new ReturnValue(this.exp.value(env));
};

function And(left, right) {
    this.left = left;
    this.right = right;
}
And.prototype.value = function(env) {
    return this.left.value(env) && this.right.value(env);
};

function Or(left, right) {
    this.left = left;
    this.right = right;
}
Or.prototype.value = function(env) {
    return this.left.value(env) || this.right.value(env);
};

function Equals(left, right) {
    this.left = left;
    this.right = right;
}
Equals.prototype.value = function(env) {
    return this.left.value(env) == this.right.value(env);
};

function NotEquals(left, right) {
    this.left = left;
    this.right = right;
}
NotEquals.prototype.value = function(env) {
    return this.left.value(env) != this.right.value(env);
};

function Less(left, right) {
    this.left = left;
    this.right = right;
}
Less.prototype.value = function(env) {
    return this.left.value(env) < this.right.value(env);
};

function LessEquals(left, right) {
    this.left = left;
    this.right = right;
}
LessEquals.prototype.value = function(env) {
    return this.left.value(env) <= this.right.value(env);
};

function Greater(left, right) {
    this.left = left;
    this.right = right;
}
Greater.prototype.value = function(env) {
    return this.left.value(env) > this.right.value(env);
};

function GreaterEquals(left, right) {
    this.left = left;
    this.right = right;
}
GreaterEquals.prototype.value = function(env) {
    return this.left.value(env) >= this.right.value(env);
};

function Plus(left, right) {
    this.left = left;
    this.right = right;
}
Plus.prototype.value = function(env) {
    return this.left.value(env) + this.right.value(env);
};

function Minus(left, right) {
    this.left = left;
    this.right = right;
}
Minus.prototype.value = function(env) {
    return this.left.value(env) - this.right.value(env);
};

function Times(left, right) {
    this.left = left;
    this.right = right;
}
Times.prototype.value = function(env) {
    return this.left.value(env) * this.right.value(env);
};

function Divide(left, right) {
    this.left = left;
    this.right = right;
}
Divide.prototype.value = function(env) {
    return this.left.value(env) / this.right.value(env);
};

function Remainder(left, right) {
    this.left = left;
    this.right = right;
}
Remainder.prototype.value = function(env) {
    return this.left.value(env) % this.right.value(env);
};

function Neg(exp) {
    this.exp = exp;
}
Neg.prototype.value = function(env) {
    return -this.exp.value(env);
};

function Const(val) {
    this.val = val;
}
Const.prototype.value = function(env) {
    return this.val;
};

function StringValue(val) {
    this.val = val;
}
StringValue.prototype.value = function(env) {
    return this.val;
};

function True() {
}
True.prototype.value = function(env) {
    return true;
};

function False() {
}
False.prototype.value = function(env) {
    return false;
};

function Null() {
}
Null.prototype.value = function(env) {
    return null;
};

function Variable(name) {
    this.name = name;
}
Variable.prototype.value = function(env) {
    return env.lookup(this.name).value(env);
};
Variable.prototype.lookup = function(env) {
    return env.lookup(this.name);
};

function Assign(lvalue, exp) {
    this.lvalue = lvalue;
    this.exp = exp;
}
Assign.prototype.value = function(env) {
    val = this.exp.value(env);
    this.lvalue.lookup(env).assign(val);
    return val;
};

function ArrayIndex2(index) {
    this.index = index;
}
ArrayIndex2.prototype.value = function(object, env) {
    return object.array[this.index.value(env)].value(new Environment());
};
ArrayIndex2.prototype.lookup = function(object, env) {
    arr = object;
    ind = this.index.value(env);
    if (!(ind in arr.array))
        arr.array[ind] = new Cell();
    return arr.array[ind];
};

function ObjectField2(field) {
    this.field = field;
}
ObjectField2.prototype.value = function(object, env) {
    return object.fields[this.field].value(new Environment());
};
ObjectField2.prototype.lookup = function(object, env) {
    obj = object;
    if (!(this.field in obj.fields))
        obj.fields[this.field] = new Cell();
    return obj.fields[this.field];
};

function FuncArg2(args) {
    this.args = args;
}
FuncArg2.prototype.value = function(object, env) {
    func = object;
    newenv = new Environment(env);
    for (i in func.params) {
        param = func.params[i];
        val = this.args[i].value(env);
        newenv.lookup(param).assign(val);
    }
    try {
        val = func.body.value(newenv);
    } catch (ex) {
        val = ex.val;
    }
    return val;
};
FuncArg2.prototype.lookup = function(object, env) {
    // error
};

function Select(object, selectors) {
    this.object = object;
    this.selectors = selectors;
}
Select.prototype.value = function(env) {
    obj = this.object.value(env);
    for (s in this.selectors) {
        obj = this.selectors[s].value(obj, env);
    }
    return obj;
};
Select.prototype.lookup = function(env) {
    obj = this.object.value(env);
    for (s in this.selectors) {
        ref = this.selectors[s].lookup(obj, env);
        obj = ref.value(env);
    }
    return ref;
}

// env = new Environment();
// //func = ssParser.parse('function f2c(f) { return (f-32)/1.8; }');
// func = new FuncDecl('f2c', ['f'], ssParser.parse('(f-32)/1.8;')).value(new Environment());
// args = [0, new Const(0.1)];
// sel = new Select(func, [new FuncArg2(args)]);
// for (var fahr = 32; fahr <= 212; fahr += 20) {
//     args[0] = new Const(fahr);
//     print(sel.value(env));
// }

// for (;;) {
//     var exp = readline();
//     var ast = ssParser.parse(exp);
//     var val = function () { return ast.value(env); }();
//     print(val);
// }
