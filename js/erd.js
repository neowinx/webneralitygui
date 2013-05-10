var r, model, types = {unicode: "unicode",str: "str","int": "int","float": "float",Decimal: "Decimal",datetime: "datetime",date: "date",buffer: "buffer",bool: "bool",LongUnicode: "LongUnicode",LongStr: "LongStr"}, classes = {PrimaryKey: "PrimaryKey",Required: "Required",Optional: "Optional",Set: "Set"}, relColor = "#254559", selectedColor = "#9ecaed", highlighColor = "#9ecaed", normalColor = "#254559", inheritanceColor = "#ABB1B5", strokeAttrs = {"stroke-linecap": "round",stroke: relColor,fill: "none","stroke-width": 3}, idSequence = 1, states = {normal: 0,entityMouseDown: 1,entityDrag: 2,entityAdded: 3,moveCanvas: 4}, ctx = {$elem: void 0,entity: void 0,x: 0,y: 0,state: states.normal,reset: function() {
        this.state = states.normal;
        this.entity = this.$elem = void 0;
        $svgpad.css("cursor", "default")
    }}, zindex = 1, padTopOffset, $pad, $svgpad, identRe = /^[$A-Z_][0-9A-Z_]*$/i, pyKeywords = "and del for is raise assert elif from lambda return break else global not try class except if or while continue exec import pass yield def finally in print with".split(" "), resized = !1, changed = !1;
function getEndingPath(a, b, c, e, g) {
    return "O" === g ? "L" === e ? ["M", a, b, "l", c, 0] : ["M", a, b, "l", -c, 0] : "L" === e ? ["M", a, b, "l", c, c, "M", a, b, "l", c, -c, "M", a, b, "l", c, 0] : ["M", a, b, "l", -c, -c, "M", a, b, "l", -c, c, "M", a, b, "l", -c, 0]
}
Raphael.fn.drawRelationship = function(a) {
    var b = a.htmlNode, c = a.entityHtmlNode, e = a.rattr.htmlNode, g = a.rattr.entityHtmlNode, f = $pad.scrollTop(), h = $pad.scrollLeft(), j = h + c.offset().left, b = {x: j,rx: j + c.width() + 5,y: b.offset().top + b.height() / 2 - padTopOffset + f,endingType: a.rattr.cls() == classes.Set ? "M" : "O"}, c = h + g.offset().left, e = {x: c,rx: c + g.width() + 5,y: e.offset().top + e.height() / 2 - padTopOffset + f,endingType: a.cls() == classes.Set ? "M" : "O"};
    e.x < b.x && (g = b, b = e, e = g);
    var d, g = b.y, f = e.y;
    10 > e.x - b.rx ? (c = $pad.width() / 3, e.x - h < c || b.x - h < c ? (h = b.x - 10, c = e.x - 10, d = Math.max(Math.abs(h - c) / 2, 80), j = h - d, d = c - d, b.side = "L", e.side = "L") : (h = b.rx + 10, c = e.rx + 10, d = Math.max(Math.abs(h - c) / 2, 80), j = h + d, d = c + d, b.side = "R", e.side = "R")) : (h = b.rx + 10, c = e.x - 10, d = Math.max(Math.abs(h - c) / 2, 40), j = h + d, d = c - d, b.side = "R", e.side = "L");
    b = getEndingPath(h, b.y, 10, b.side, b.endingType);
    e = getEndingPath(c, e.y, 10, e.side, e.endingType);
    b = a.htmlNode === a.rattr.htmlNode ? b.concat(["M", h, g, "C", j, g - 20, d, f + 20, c, f]) : b.concat(["M", h, g, "C", j, g, d, f, c, f], e);
    a.rattr.relPath = a.relPath = b;
    a.relLine ? a.relLine.attr({path: b}) : (a.rattr.relLine = a.relLine = this.path(b).attr(strokeAttrs), a.relLine.click(function() {
        a.markAttrSelected()
    }), a.relLine.mouseover(function() {
        a.markAttrHighlighted(!0)
    }), a.relLine.mouseout(function() {
        a.markAttrHighlighted(!1)
    }));
    this.safari()
};
Raphael.fn.drawInheritance = function(a, b) {
    var c = model.id2entity[a], e = model.id2entity[b], g = c.htmlNode, f = c.htmlNodeLR, h = e.htmlNode, j = $pad.scrollTop(), d = $pad.scrollLeft(), g = g.offset().left + g.width() / 2 + d, f = f.offset().top + f.height() + 1 - padTopOffset + j, l = ["M", g, f, "l", 10, 18, "l", -20, 0, "l", 10, -18, "M", g, f + 18, "l", 0, 10];
    c.triShape ? c.triShape.attr({path: l}) : c.triShape = this.path(l).attr(strokeAttrs).attr({stroke: inheritanceColor});
    c.triShape.path = l;
    f += 28;
    d = h.offset().left + h.width() / 2 + d;
    h = h.offset().top - padTopOffset + j;
    j = Math.max(Math.abs(f - h) / 2, 40);
    g = ["M", g, f, "C", g, f + j, d, h - j, d, h];
    (h = e.inheritsFromLines[c]) ? h.attr({path: g}) : (h = this.path(g).attr(strokeAttrs).attr({stroke: inheritanceColor}), e.inheritsFromLines[c] = h, c.inheritsToLines[e] = h);
    h.path = g;
    this.safari()
};
function Attribute(a, b, c, e, g, f, h, j) {
    var d = this;
    d.name = ko.observable(a);
    d.cls = ko.observable(b);
    d.type = ko.observable(c);
    d.rattrName = e;
    d.strokeColor = relColor;
    d.bgColor = "transparent";
    d.selected = ko.observable(!1);
    d.highlighted = ko.observable(!1);
    d.auto = ko.observable(g);
    d.unique = ko.observable(j);
    d.defaultValue = ko.observable(f);
    d.lazy = ko.observable(h);
    d.clearRelationship = function() {
        d.relLine && (d.relLine.remove(), d.relLine = void 0, d.rattr = void 0, d.relPath = void 0, d.miniRelLine.remove())
    };
    d.markAttrSelected = function() {
        !(model.sidebar.selectedAttr() && d.name() === model.sidebar.selectedAttr().name()) && model.sidebar.unselect() && (d.selected(!0), d.highlighted(!1), d.rattr && (d.rattr.selected(!0), d.rattr.highlighted(!1), d.relLine.attr({stroke: selectedColor})), model.sidebar.setAttrSelected(d))
    };
    d.markAttrHighlighted = function(a) {
        if (ctx.state == states.normal && !d.selected()) {
            var b = normalColor;
            a && (b = highlighColor);
            d.highlighted(a);
            d.rattr && (d.rattr.highlighted(a), d.relLine.attr({stroke: b}))
        }
    };
    d.highlight = function() {
        d.markAttrHighlighted(!0)
    };
    d.normal = function() {
        d.markAttrHighlighted(!1)
    };
    d.moveUp = function() {
        var a = d.entity.attrs(), b = a.indexOf(d);
        0 < b && (d.entity.attrs.splice(b - 1, 2, a[b], a[b - 1]), d.entity.drawRelationships(), changed = !0)
    };
    d.moveDown = function() {
        var a = d.entity.attrs(), b = a.indexOf(d);
        b < a.length - 1 && (d.entity.attrs.splice(b, 2, a[b + 1], a[b]), d.entity.drawRelationships(), changed = !0)
    }
}
function Entity(a, b, c, e, g, f, h, j) {
    var d = this;
    d.id = "e" + idSequence++;
    d.name = ko.observable(a);
    d.oldName = a;
    d.plural = ko.observable(b);
    d.inheritsFromNames = c;
    d.inheritsFromLines = {};
    d.inheritsToLines = {};
    d.attrs = ko.observableArray([]);
    d.selected = ko.observable(!1);
    d.table = ko.observable(e);
    d.columns = ko.observable(3);
    d.comment = ko.observable(g ? g : "");
    d.discrName = ko.observable(f);
    d.discrType = ko.observable(h);
    d.discrValue = ko.observable(j);
    d.addAttr = function(a) {
        a.id = d.id + "-" + idSequence++ + "-attr";
        a.entity = d;
        d.attrs.push(a);
        owner && _.each(a, function(a, b) {
            ko.isObservable(a) && _.contains("name cls type lazy auto defaultValue".split(" "), b) && a.subscribe(function() {
                onModelChange()
            })
        });
        model.id2attr[a.id] = a
    };
    d.removeAttr = function(a, b) {
        !b && a.rattr && (a.rattr.entity.removeAttr(a.rattr, !0), a.clearRelationship());
        d.attrs.remove(a);
        model.sidebar.unselect(!0)
    };
    d.setXY = function(a, b) {
        d.htmlNode.css({left: a,top: b})
    };
    d.drawRelationships = function() {
        _.each(d.attrs(), function(a) {
            a.rattr && r.drawRelationship(a)
        })
    };
    d.drawInheritance = function() {
        _.each(d.inheritsFromLines, function(a, b) {
            r.drawInheritance(b, d)
        });
        _.each(d.inheritsToLines, function(a, b) {
            r.drawInheritance(d, b)
        })
    };
    d.redraw = function() {
        _.each(d.attrs(), function(a) {
            a.rattr && r.drawRelationship(a)
        });
        _.each(d.inheritsFromLines, function(a, b) {
            r.drawInheritance(b, d)
        });
        _.each(d.inheritsToLines, function(a, b) {
            r.drawInheritance(d, b)
        })
    };
    d.markSelected = function() {
        model.sidebar.unselect() && (model.sidebar.setEntitySelected(d), d.selected(!0), d.htmlNode.css("z-index", zindex++))
    };
    d.clickAddAttr = function() {
        if (model.sidebar.unselect()) {
            var a = new Attribute("", "", "");
            d.addAttr(a);
            a.markAttrSelected();
            $("#attr-name-input").focus();
            d.drawInheritance();
            model.miniView.update()
        }
    };
    d.clickAddRel = function() {
        model.sidebar.unselect() && model.newRel.openWindow(d)
    };
    d.toString = function() {
        return d.id
    };
    d.toggleColumns = function() {
        2 == d.columns() ? d.columns(3) : d.columns(2);
        d.redraw();
        model.miniView.update()
    }
}
function NewEntity() {
    var a = this;
    a.singularName = ko.observable("");
    a.oldSingularName = void 0;
    a.singularNameError = ko.observable(void 0);
    a.pluralName = ko.observable("");
    a.pluralNameError = ko.observable(void 0);
    a.tableName = ko.observable("");
    a.tableNameError = ko.observable(void 0);
    a.inherits = ko.observableArray();
    a.buttonDisabled = ko.observable(void 0);
    a.singularName.subscribe(function(b) {
        b = $.trim(b);
        "" == b ? a.singularNameError(void 0) : identRe.test(b) ? model.checkNameExists(a.singularName(), model.entities()) ? a.singularNameError("Name already exists") : a.singularNameError(void 0) : a.singularNameError("Invalid name");
        (a.pluralName() == a.singularName() + "s" || a.pluralName() == a.oldSingularName + "s" || "" == a.pluralName()) && "" != a.singularName() && a.pluralName(b + "s");
        "" == a.singularName() && a.pluralName("");
        a.tableName(b);
        a.oldSingularName = b;
        a.checkButton()
    });
    a.pluralName.subscribe(function(b) {
        b = $.trim(b);
        "" == b ? a.pluralNameError(void 0) : identRe.test(b) ? a.pluralNameError(void 0) : a.pluralNameError("Invalid name");
        a.checkButton()
    });
    a.checkButton = function() {
        a.singularNameError() || a.pluralNameError() || a.tableNameError() ? a.buttonDisabled(!0) : a.buttonDisabled(!1)
    };
    a.clear = function() {
        a.singularName("");
        a.oldSingularName = void 0;
        a.singularNameError(void 0);
        a.pluralName("");
        a.pluralNameError(void 0);
        a.tableName("");
        a.tableNameError(void 0);
        a.inherits("");
        a.buttonDisabled(!0)
    };
    a.openWindow = function() {
        a.clear();
        $("#add-entity-window").modal("show");
        $("#singular-entity-name").focus()
    };
    a.createEntity = function() {
        var b, c;
        c = void 0 == a.inherits() ? [] : [a.inherits()];
        var e = new Entity(a.singularName(), a.pluralName(), c, a.tableName(), "");
        model.addEntity(e);
        _.each(e.inheritsFromNames, function(a) {
            b = model.name2entity[a];
            e.inheritsFromLines[b] = void 0;
            b.inheritsToLines[e] = void 0
        });
        e.inheritsFromNames = void 0;
        return e
    };
    a.onClickAdd = function(b, c) {
        if (!a.buttonDisabled()) {
            $("#add-entity-window").modal("hide");
            var e = a.createEntity(), g = c.pageX, f = c.pageY;
            0 == g && 0 == f ? (g = ctx.x, f = ctx.y) : (ctx.x = c.pageX, ctx.y = c.pageY);
            ctx.state = states.entityAdded;
            ctx.entity = e;
            ctx.$elem = e.htmlNode;
            ctx.$elem.children("caption").css("min-height", ctx.$elem.children("caption").height());
            e.setXY($pad.scrollLeft() + g, $pad.scrollTop() + f - padTopOffset);
            e.drawInheritance();
            e.markSelected()
        }
    }
}
function NewRel() {
    var a = this;
    a.entity1name = ko.observable(void 0);
    a.entity2name = ko.observable(void 0);
    a.attr1name = ko.observable(void 0);
    a.attr2name = ko.observable(void 0);
    a.entity1 = void 0;
    a.entity2 = void 0;
    a.oldEntity2 = void 0;
    a.error1 = ko.observable(void 0);
    a.error2 = ko.observable(void 0);
    a.buttonDisabled = ko.observable(!0);
    a.relArray1 = ["", "many", "exactly one", "zero or one"];
    a.relArray2 = ["", "many", "zero or one"];
    a.relTypes = ko.observableArray(a.relArray1);
    a.cls1 = ko.observable("");
    a.cls2 = ko.observable("");
    a.oldCls1 = void 0;
    a.oldCls2 = void 0;
    a.sameEntity = ko.observable(!1);
    a.symmetrical = ko.observable(!1);
    a.symmetrical.subscribe(function() {
        a.checkButton()
    });
    a.entity2name.subscribe(function(b) {
        b = $.trim(b);
        a.entity2 = void 0 === b ? void 0 : model.name2entity[a.entity2name()];
        a.oldEntity2 = a.entity2;
        a.attr1name("");
        a.attr2name("");
        a.cls1("");
        a.cls2("");
        a.checkButton();
        a.entity1name() === b ? (a.sameEntity(!0), a.relTypes = ko.observableArray(a.relArray2)) : (a.sameEntity(!1), a.relTypes = ko.observableArray(a.relArray1), a.symmetrical(!1))
    });
    a.cls1.subscribe(function(b) {
        if ("" !== b) {
            var c = a.getRelName(a.oldEntity2, a.oldCls1);
            ("" === a.attr1name() || a.attr1name() === c) && a.attr1name(a.getRelName(a.entity2, b));
            a.oldCls1 = b
        }
    });
    a.cls2.subscribe(function(b) {
        if ("" !== b) {
            var c = a.getRelName(a.entity1, a.oldCls2);
            ("" === a.attr2name() || a.attr2name() === c) && a.attr2name(a.getRelName(a.entity1, b));
            a.oldCls2 = b
        }
    });
    a.attr1name.subscribe(function(b) {
        b = $.trim(b);
        "" === b || "" === a.cls1() ? a.error1(void 0) : (model.checkNameExists(b, a.entity1.attrs()) ? a.error1("Name already exists") : identRe.test(b) ? a.error1(void 0) : a.error1("Invalid name"), a.entity1 === a.entity2 && a.attr1name() === a.attr2name() && a.error1("Name already exists"));
        a.checkButton();
        $("#relAttr1").focus()
    });
    a.attr2name.subscribe(function(b) {
        b = $.trim(b);
        "" == b || "" === a.cls2() ? a.error2(void 0) : (model.checkNameExists(b, a.entity2.attrs()) ? a.error2("Name already exists") : identRe.test(b) ? a.error2(void 0) : a.error2("Invalid name"), a.entity1 === a.entity2 && a.attr1name() == a.attr2name() && a.error2("Name already exists"));
        a.checkButton();
        $("#relAttr2").focus()
    });
    a.clear = function() {
        a.entity1 = void 0;
        a.entity2 = void 0;
        a.entity1name(void 0);
        a.entity2name(void 0);
        a.attr1name("");
        a.attr2name("");
        a.cls1("");
        a.cls2("");
        a.error1(void 0);
        a.error2(void 0);
        a.buttonDisabled(!0);
        a.entity2 = void 0;
        a.oldEntity2 = void 0;
        a.oldCls1 = void 0;
        a.oldCls2 = void 0;
        a.sameEntity(!1);
        a.symmetrical(!1)
    };
    a.getRelName = function(a, c) {
        var e;
        e = "many" === c ? classes.Set : "NotSet";
        return getRelName(a.name(), a.plural(), e)
    };
    a.openWindow = function(b) {
        a.clear();
        a.entity1 = b;
        a.entity1name(b.name());
        $("#add-rel-window").modal("show");
        $("#add-rel-entity2").focus()
    };
    a.checkButton = function() {
        a.symmetrical() ? a.error1() || void 0 === a.entity2 || "" === a.attr1name() ? a.buttonDisabled(!0) : a.buttonDisabled(!1) : a.error1() || a.error2() || void 0 === a.entity2 || "" === a.attr1name() || "" === a.attr2name() ? a.buttonDisabled(!0) : a.buttonDisabled(!1)
    };
    a.getCls = function(a) {
        switch (a) {
            case "many":
                return classes.Set;
            case "exactly one":
                return classes.Required;
            case "zero or one":
                return classes.Optional
        }
        return ""
    };
    a.addRel = function() {
        if (!a.buttonDisabled()) {
            if (a.symmetrical()) {
                var b = new Attribute(a.attr1name(), a.getCls(a.cls1()), a.entity1name(), a.attr1name());
                a.entity1.addAttr(b);
                b.rattr = b;
                b.htmlNode = $("#" + b.id);
                b.entityHtmlNode = $("#" + b.entity.id)
            } else {
                b = new Attribute(a.attr1name(), a.getCls(a.cls1()), a.entity2name(), a.attr2name());
                a.entity1.addAttr(b);
                var c = new Attribute(a.attr2name(), a.getCls(a.cls2()), a.entity1name(), a.attr1name());
                a.entity2.addAttr(c);
                b.rattr = c;
                c.rattr = b;
                b.htmlNode = $("#" + b.id);
                b.entityHtmlNode = $("#" + b.entity.id);
                c.htmlNode = $("#" + c.id);
                c.entityHtmlNode = $("#" + c.entity.id)
            }
            changed = !0;
            model.redraw();
            model.miniView.update();
            $("#add-rel-window").modal("hide")
        }
    }
}
function IntroduceEntity() {
    var a = this;
    a.attr1 = ko.observable(void 0);
    a.attr2 = ko.observable(void 0);
    a.entity1 = ko.observable(void 0);
    a.entity2 = ko.observable(void 0);
    a.entity1name = ko.observable(void 0);
    a.entity2name = ko.observable(void 0);
    a.newEntityName = ko.observable(void 0);
    a.buttonDisabled = ko.observable(void 0);
    a.attr1name = ko.observable(void 0);
    a.attr2name = ko.observable(void 0);
    a.attr1error = ko.observable(void 0);
    a.attr2error = ko.observable(void 0);
    a.subscription1 = void 0;
    a.subscription2 = void 0;
    $("#introduce-entity-window").on("hidden", function() {
        a.subscription1.dispose();
        a.subscription2.dispose()
    });
    a.attr1name.subscribe(function(b) {
        "undefined" !== typeof b && (b = $.trim(b), model.checkNameExists(b, a.entity1().attrs()) ? (a.attr1error("Entity has such attribute name already"), a.buttonDisabled(!0)) : identRe.test(b) ? (a.attr1error(void 0), a.buttonDisabled(model.newEntity.buttonDisabled() || a.attr2error())) : model.newEntity.singularName() && ("" === b ? a.attr1error("Cannot be empty") : a.attr1error("Invalid name"), a.buttonDisabled(!0)))
    });
    a.attr2name.subscribe(function(b) {
        "undefined" !== typeof b && (b = $.trim(b), model.checkNameExists(b, a.entity2().attrs()) ? (a.attr2error("Entity has such attribute name already"), a.buttonDisabled(!0)) : identRe.test(b) ? (a.attr2error(void 0), a.buttonDisabled(model.newEntity.buttonDisabled() || a.attr1error())) : model.newEntity.singularName() && ("" === b ? a.attr2error("Cannot be empty") : a.attr2error("Invalid name"), a.buttonDisabled(!0)))
    });
    a.openWindow = function() {
        a.buttonDisabled(!0);
        model.newEntity.clear();
        a.subscription1 = model.newEntity.buttonDisabled.subscribe(function(b) {
            a.buttonDisabled(b)
        });
        a.subscription2 = model.newEntity.pluralName.subscribe(function(b) {
            b ? (b = $.trim(b.toLowerCase()), a.attr1name(b), a.attr2name(b)) : (a.attr1name(""), a.attr2name(""))
        });
        a.attr1(model.sidebar.selectedAttr());
        a.attr2(model.sidebar.selectedAttr().rattr);
        a.entity1(model.sidebar.selectedAttr().entity);
        a.entity2(model.sidebar.selectedAttr().rattr.entity);
        a.entity1name(model.sidebar.selectedAttr().entity.name());
        a.entity2name(model.sidebar.selectedAttr().rattr.entity.name());
        a.attr1name(void 0);
        a.attr2name(void 0);
        a.attr1error(void 0);
        a.attr2error(void 0);
        a.newEntityName("");
        $("#introduce-entity-window").modal("show");
        $("#introduce-entity-name").focus()
    };
    a.onClickAdd = function(b, c) {
        if (!a.buttonDisabled()) {
            $("#introduce-entity-window").modal("hide");
            var e = model.newEntity.pluralName(), e = new Entity(model.newEntity.singularName(), e, [], model.newEntity.tableName(), "");
            model.addEntity(e);
            var g = c.pageX, f = c.pageY;
            0 == g && 0 == f ? (g = ctx.x, f = ctx.y) : (ctx.x = c.pageX, ctx.y = c.pageY);
            ctx.state = states.entityAdded;
            ctx.entity = e;
            ctx.$elem = e.htmlNode;
            ctx.$elem.children("caption").css("min-height", ctx.$elem.children("caption").height());
            e.setXY($pad.scrollLeft() + g, $pad.scrollTop() + f - padTopOffset);
            e.markSelected();
            a.attr1().clearRelationship();
            g = new Attribute(a.entity1name().toLowerCase(), classes.Required, a.entity1name(), a.attr1().name());
            e.addAttr(g);
            f = new Attribute(a.entity2name().toLowerCase(), classes.Required, a.entity2name(), a.attr2().name());
            e.addAttr(f);
            g.rattr = a.attr1();
            a.attr1().rattr = g;
            f.rattr = a.attr2();
            a.attr2().rattr = f;
            a.attr1().name(a.attr1name());
            a.attr2().name(a.attr2name());
            a.attr1().type(e.name());
            a.attr2().type(e.name());
            g.htmlNode = $("#" + g.id);
            g.entityHtmlNode = $("#" + g.entity.id);
            f.htmlNode = $("#" + f.id);
            f.entityHtmlNode = $("#" + f.entity.id);
            e.drawRelationships()
        }
    }
}
function Sidebar() {
    var a = this;
    a.selectedEntity = ko.observable(void 0);
    a.selectedAttr = ko.observable(void 0);
    a.selectedRattr = ko.observable(void 0);
    a.attrNameError = ko.observable(void 0);
    a.attrNameSubscription = void 0;
    a.entityNameSubscription = void 0;
    a.entityNameError = ko.observable(void 0);
    a.entityPluralError = ko.observable(void 0);
    a.entityTableError = ko.observable(void 0);
    a.inheritsFromName = ko.observable(void 0);
    a.inheritsFromList = ko.observableArray([]);
    a.inheritsFromNameSubscription = void 0;
    a.baseClass = ko.observable(!1);
    a.inherits = ko.observable(!1);
    a.discrTypeList = ["int", "str", "unicode"];
    a.discrNameError = ko.observable(void 0);
    a.discrNameSubscription = void 0;
    a.database = ko.observable("SQLite");
    a.dbfilename = ko.observable("database.sqlite");
    a.createdb = ko.observable("True");
    a.host = ko.observable("");
    a.port = ko.observable("");
    a.user = ko.observable("");
    a.password = ko.observable("");
    a.usedb = ko.observable("");
    a.charset = ko.observable("");
    a.dsn = ko.observable("");
    a.createTables = ko.observable("True");
    a.modelName = ko.observable(void 0);
    a.modelDescription = ko.observable("");
    a.setAttrSelected = function(b) {
        a.selectedAttr(b);
        a.attrNameSubscription = b.name.subscribe(function(c) {
            if ("" === c)
                a.attrNameError("Cannot be empty");
            else if (identRe.test(c))
                if (-1 !== _.indexOf(pyKeywords, c))
                    a.attrNameError("Cannot be Python keyword");
                else {
                    var e = !1;
                    _.each(a.selectedAttr().entity.attrs(), function(b) {
                        b !== a.selectedAttr() && b.name() === c && (e = !0)
                    });
                    e ? a.attrNameError("Name already exists") : a.attrNameError(void 0)
                }
            else
                a.attrNameError("Invalid name");
            b.entity && setTimeout(function() {
                b.entity.redraw()
            }, 0)
        });
        a.oldCls = b.cls();
        a.attrClsSubscription = b.cls.subscribe(function(c) {
            if (b.rattr) {
                var e = b.rattr.entity, g = getRelName(e.name(), e.plural(), a.oldCls), e = getRelName(e.name(), e.plural(), c);
                b.name() === g && g !== e && b.name(e)
            }
            b.rattr && setTimeout(function() {
                b.entity.drawRelationships()
            }, 0);
            a.oldCls = c
        })
    };
    a.setEntitySelected = function(b) {
        a.selectedEntity(b);
        b.oldName = b.name();
        a.entityNameSubscription = b.name.subscribe(function(c) {
            if ("" === c)
                a.entityNameError("Cannot be empty");
            else if (identRe.test(c))
                if (-1 !== _.indexOf(pyKeywords, c))
                    a.entityNameError("Cannot be Python keyword");
                else {
                    var e = !1;
                    _.each(model.entities(), function(b) {
                        b !== a.selectedEntity() && b.name() === c && (e = !0)
                    });
                    e ? a.entityNameError("Name already exists") : a.entityNameError(void 0)
                }
            else
                a.entityNameError("Invalid name");
            delete model.name2entity[b.oldName];
            model.name2entity[c] = b;
            _.each(b.attrs(), function(a) {
                if (a.rattr && (a.rattr.type(c), a.rattr.cls() != classes.Set)) {
                    var e = getRelName(b.oldName, b.plural(), a.rattr.cls()), d = getRelName(c, b.plural(), a.rattr.cls());
                    a.rattr.name() == e && e !== d && a.rattr.name(d)
                }
            });
            b.oldName = c;
            model.redraw()
        });
        b.oldPluralName = b.plural();
        a.entityPluralSubscription = b.plural.subscribe(function(c) {
            "" === c ? a.entityPluralError("Cannot be empty") : identRe.test(c) ? -1 !== _.indexOf(pyKeywords, c) ? a.entityNameError("Cannot be Python keyword") : a.entityPluralError(void 0) : a.entityPluralError("Invalid name");
            _.each(b.attrs(), function(a) {
                if (a.rattr && a.rattr.cls() == classes.Set) {
                    var e = getRelName(b.name(), b.oldPluralName, a.rattr.cls()), j = getRelName(b.name(), c, a.rattr.cls());
                    a.rattr.name() == e && e !== j && a.rattr.name(j)
                }
            });
            b.oldPluralName = c
        });
        a.entityTableSubscription = b.table.subscribe(function(b) {
            -1 !== b.indexOf(".") || -1 !== b.indexOf('"') || -1 !== b.indexOf("'") ? a.entityTableError("Invalid name") : a.entityTableError(void 0)
        });
        var c = [];
        _.each(model.entities(), function(a) {
            if (a !== b) {
                var f = function(a, b) {
                    for (e in a.inheritsFromLines) {
                        var c = model.id2entity[e];
                        if (c.name() === b || f(c, b))
                            return !0
                    }
                    return !1
                };
                f(a, b.name()) || c.push(a.name())
            }
        });
        a.inheritsFromList(c);
        if (0 !== _.size(b.inheritsFromLines))
            for (var e in b.inheritsFromLines) {
                a.inheritsFromName(model.id2entity[e].name());
                break
            }
        a.inheritsFromNameSubscription = a.inheritsFromName.subscribe(function(b) {
            var c = a.selectedEntity();
            c && (_.each(c.inheritsFromLines, function(a, b) {
                var e = model.id2entity[b];
                a.miniLine.remove();
                a.remove();
                delete e.inheritsToLines[c];
                0 === _.size(e.inheritsToLines) && e.triShape && (e.triShape.miniShape.remove(), e.triShape.remove(), e.triShape = void 0, e.discrName(void 0), e.discrType(void 0), e.discrValue(void 0))
            }), c.inheritsFromLines = {}, b ? (b = model.name2entity[b], c.inheritsFromLines[b] = void 0, b.inheritsToLines[c] = void 0, b.drawInheritance(), b.discrName() || b.discrName("classtype"), b.discrType() || b.discrType("str"), b.discrValue() || b.discrValue(b.name()), c.discrName(void 0), c.discrType(void 0), c.discrValue(c.name())) : 0 !== _.size(c.inheritsToLines) ? (c.discrName() || c.discrName("classtype"), c.discrType() || c.discrType("str"), c.discrValue() || c.discrValue(c.name())) : c.discrValue(void 0), a.checkInheritance(), model.miniView.update())
        });
        a.discrNameSubscription = b.discrName.subscribe(function(b) {
            "" === b ? a.discrNameError("Cannot be empty") : identRe.test(b) ? -1 !== _.indexOf(pyKeywords, b) ? a.discrNameError("Cannot be Python keyword") : a.discrNameError(void 0) : a.discrNameError("Invalid name")
        });
        a.checkInheritance()
    };
    a.checkInheritance = function() {
        var b = a.selectedEntity();
        0 === _.size(b.inheritsFromLines) ? (a.inherits(!1), 0 !== _.size(b.inheritsToLines) ? a.baseClass(!0) : a.baseClass(!1)) : (a.inherits(!0), a.baseClass(!1))
    };
    a.unselect = function(b) {
        if (a.selectedEntity()) {
            if (!b) {
                if (a.entityNameError())
                    return $("#entity-name-input").focus(), !1;
                if (a.entityPluralError())
                    return $("#entity-plural-input").focus(), !1;
                if (a.entityTableError())
                    return $("#entity-table-input").focus(), !1;
                if (a.discrNameError())
                    return $("#discr-name").focus(), !1
            }
            a.entityNameSubscription.dispose();
            a.entityPluralSubscription.dispose();
            a.entityTableSubscription.dispose();
            a.inheritsFromNameSubscription.dispose();
            a.inheritsFromName(void 0);
            a.selectedEntity().selected(!1);
            a.selectedEntity(void 0);
            a.inherits(!1);
            a.baseClass(!1);
            a.discrNameSubscription.dispose();
            return !0
        }
        var c = a.selectedAttr();
        if (c)
            if ("" === c.name() && void 0 === c.cls() && void 0 === c.type())
                c.entity.attrs.remove(c), a.attrNameSubscription.dispose(), a.selectedAttr(void 0), model.redraw(), model.miniView.update();
            else {
                if (!b) {
                    b = $("#attr-name-input");
                    if (a.attrNameError())
                        return b.focus(), !1;
                    if (!identRe.test(c.name()))
                        return a.attrNameError("Invalid name"), b.focus(), !1
                }
                c.selected(!1);
                if (b = c.rattr)
                    b.selected(!1), c.relLine.attr({stroke: normalColor}), a.selectedRattr(void 0);
                a.attrNameSubscription.dispose();
                a.selectedAttr(void 0);
                a.attrClsSubscription.dispose()
            }
        return !0
    }
}
function MiniView() {
    var a = this;
    a.minx = 0;
    a.maxx = 0;
    a.miny = 0;
    a.maxy = 0;
    a.svg = void 0;
    a.width = 0;
    a.height = 0;
    a.padx = 10;
    a.pady = 10;
    a.r = 0;
    a.init = function() {
        var b = $("#mini-view");
        a.width = b.width();
        a.height = a.width / ($pad.width() / $pad.height());
        b.css("height", a.height);
        a.svg = Raphael("mini-view", a.width, a.height);
        a.width -= 2 * a.padx;
        a.height -= 2 * a.pady;
        b.click(function(b) {
            if (1 === b.which) {
                var c = a.r, e = b.offsetX;
                b = b.offsetY;
                if (!("undefined" === typeof e || "undefined" === typeof b)) {
                    var j = $pad.width(), d = $pad.height(), l = a.negPaddingX * c + a.padx, m = a.negPaddingY * c + a.pady;
                    e > l && e < l + j * c && b > m && b < m + d * c || (e = l - (e - j / 2 * c - a.padx), b = m - (b - d / 2 * c - a.pady), tryMoveCanvas($pad.scrollLeft() - e / c, $pad.scrollTop() - b / c + padTopOffset), a.update())
                }
            }
        })
    };
    var b = function(b, c, f) {
        1 !== f.which ? a.px = void 0 : (a.px = 0, a.py = 0)
    }, c = function(b, c) {
        void 0 !== a.px && (tryMoveCanvas($pad.scrollLeft() + (b - a.px) / a.r, $pad.scrollTop() + (c - a.py) / a.r), a.px = b, a.py = c, a.update())
    };
    a.resize = function() {
        var b = a.width + 2 * a.padx, c = b / ($pad.width() / $pad.height());
        a.height = c - 2 * a.pady;
        a.svg.setSize(b, c);
        $("#mini-view").css("height", c);
        a.update()
    };
    a.update = function() {
        if (0 != model.entities().length) {
            a.minx = Number.MAX_VALUE;
            a.maxx = Number.MIN_VALUE;
            a.miny = Number.MAX_VALUE;
            a.maxy = Number.MIN_VALUE;
            a.minl = Number.MAX_VALUE;
            a.mint = Number.MAX_VALUE;
            var e = $pad.scrollLeft(), g = $pad.scrollTop();
            _.each(model.entities(), function(b) {
                b = b.htmlNode;
                var c = b.offset();
                a.minx = Math.min(a.minx, e + c.left);
                a.maxx = Math.max(a.maxx, e + c.left + b.width());
                a.miny = Math.min(a.miny, g + c.top - padTopOffset);
                a.maxy = Math.max(a.maxy, g + c.top - padTopOffset + b.height());
                a.minl = Math.min(a.minl, c.left);
                a.mint = Math.min(a.mint, c.top - padTopOffset)
            });
            var f = a.paddingX = Math.max(a.minl, 0), h = a.paddingY = Math.max(a.mint, 0), j = a.negPaddingX = Math.max(-a.minl, 0), d = a.negPaddingY = Math.max(-a.mint, 0), l = a.width / Math.max($pad.width() + j, a.maxx - a.minx + f), m = a.height / Math.max($pad.height() + d, a.maxy - a.miny + h), k = Math.min(l, m);
            a.r = k;
            _.each(model.entities(), function(b) {
                var c = b.htmlNode, e = c.offset(), d = (e.left - a.minl + f + 2) * k + a.padx, e = (e.top - a.mint + h - padTopOffset) * k + a.pady;
                b.miniEntity ? b.miniEntity.attr({x: d,y: e,width: c.width() * k,height: c.height() * k}) : b.miniEntity = a.svg.rect(d, e, c.width() * k, c.height() * k, 3).attr({fill: "#FCFCFC"});
                _.each(b.attrs(), function(b) {
                    if (b.relPath) {
                        var c = a.translatePath(b.relPath);
                        b.miniRelLine ? b.miniRelLine.attr({path: c}) : (b.miniRelLine = a.svg.path(c).attr({stroke: "#222","stroke-width": 1}), b.rattr.miniRelLine = b.miniRelLine)
                    }
                });
                b.triShape && (c = a.translatePath(b.triShape.path), b.triShape.miniShape ? b.triShape.miniShape.attr({path: c}) : b.triShape.miniShape = a.svg.path(c).attr({stroke: "#999","stroke-width": 1}), _.each(b.inheritsToLines, function(b) {
                    var c = a.translatePath(b.path);
                    b.miniLine ? b.miniLine.attr({path: c}) : b.miniLine = a.svg.path(c).attr({stroke: "#999","stroke-width": 1})
                }))
            });
            a.viewRect ? a.viewRect.attr({x: j * k + a.padx,y: d * k + a.pady,width: $pad.width() * k,height: $pad.height() * k}) : (a.viewRect = a.svg.rect(j * k + a.padx, d * k + a.pady, $pad.width() * k, $pad.height() * k), a.viewRect.attr({fill: "#BBB",stroke: "#BBB","fill-opacity": 0,"stroke-width": 2,cursor: "onmove"}), a.viewRect.drag(c, b))
        }
    };
    a.translatePath = function(b) {
        var c, f, h = [], j = a.minx, d = a.miny, l = a.r, m = a.padx, k = a.pady, n = a.paddingX, p = a.paddingY;
        _.each(b, function(a) {
            "M" === a || "C" === a ? f = c = 1 : "l" === a ? c = 2 : 1 === c ? 1 === f ? (a = (a - j + n) * l + m, f = 2) : (a = (a - d + p) * l + k, f = 1) : 2 === c && (a *= l);
            h.push(a)
        });
        return h
    }
}
function Model() {
    var a = this;
    a.name2entity = {};
    a.id2entity = {};
    a.id2attr = {};
    a.entities = ko.observableArray([]);
    a.entityNamesList = ko.computed(function() {
        return _.map(a.entities(), function(a) {
            return a.name()
        }).sort()
    });
    a.typesList = _.values(types);
    a.typesList.sort();
    a.fullClassesList = _.values(classes);
    a.sidebar = new Sidebar;
    a.newEntity = new NewEntity;
    a.newRel = new NewRel;
    a.miniView = new MiniView;
    a.introduceEntity = new IntroduceEntity;
    a.trueFalseOptions = ["False", "True"];
    a.databases = ["SQLite", "MySQL", "PostgreSQL", "Oracle"];
    a.addEntity = function(b) {
        a.name2entity[b.name()] = b;
        a.id2entity[b.id] = b;
        a.entities.push(b);
        b.htmlNode = $("#" + b.id);
        b.htmlNodeLR = $("#" + b.id + " .last-row");
        _.each(b.attrs(), function(a) {
            a.htmlNode = $("#" + a.id);
            a.entityHtmlNode = $("#" + a.entity.id)
        });
        owner && _.each(b, function(a, b) {
            ko.isObservable(a) && _.contains("name plural table comment discrName discrType discrValue".split(" "), b) && a.subscribe(function() {
                onModelChange()
            })
        });
        $("#" + b.id + " caption").on("mousedown", function(a) {
            ctx.state == states.normal && (ctx.$elem = $(this.parentNode), ctx.entity = model.id2entity[ctx.$elem.attr("id")], ctx.x = a.pageX, ctx.y = a.pageY, ctx.state = states.entityMouseDown, ctx.$elem.css("z-index", zindex))
        })
    };
    a.removeSelectedEntity = function() {
        var b = a.sidebar.selectedEntity();
        b && (_.each(b.attrs(), function(a) {
            a.rattr && (a.rattr.entity.attrs.remove(a.rattr), a.clearRelationship())
        }), _.each(a.entities(), function(a) {
            var e = a.inheritsFromLines[b];
            e && (e.miniLine.remove(), e.remove(), delete a.inheritsFromLines[b]);
            if (e = a.inheritsToLines[b])
                e.miniLine.remove(), e.remove(), delete a.inheritsToLines[b];
            0 === _.size(a.inheritsToLines) && a.triShape && (a.triShape.miniShape.remove(), a.triShape.remove(), a.triShape = void 0)
        }), b.triShape && (b.triShape.miniShape.remove(), b.triShape.remove(), b.triShape = void 0), b.miniEntity.remove(), a.entities.remove(b), a.sidebar.unselect(), setTimeout(function() {
            a.redraw()
        }, 0), model.sidebar.unselect(!0), changed = !0)
    };
    a.removeSelectedAttr = function() {
        var b = model.sidebar.selectedAttr();
        a.sidebar.unselect();
        b.entity.removeAttr(b);
        a.redraw();
        model.miniView.update()
    };
    a.buildInheritance = function() {
        _.each(a.entities(), function(b) {
            _.each(b.inheritsFromNames, function(c) {
                c = a.name2entity[c];
                void 0 == b.inheritsFromLines[c] && (b.inheritsFromLines[c] = void 0, c.discrName() || c.discrName("classtype"), c.discrType() || c.discrType("str"), c.discrValue() || c.discrValue(c.name()), b.discrValue() || b.discrValue(b.name()));
                void 0 == c.inheritsToLines[b] && (c.inheritsToLines[b] = void 0);
                b.inheritsFromNames = void 0
            })
        })
    };
    a.buildRelationships = function() {
        _.each(model.entities(), function(a) {
            _.each(a.attrs(), function(c) {
                var e = c.type();
                if (!(e in types) && !(void 0 === e || "" === e)) {
                    var g = model.name2entity[e];
                    if (void 0 === g)
                        alert("assert: unknown entity type=" + e);
                    else {
                        var f = void 0;
                        _.each(g.attrs(), function(e) {
                            a.name() === e.type() && !c.rattr && (!e.rattr && c !== e) && (e.rattrName === c.name() && (f = e), void 0 === f && (f = e))
                        });
                        f && (c.rattr = f, f.rattr = c, r.drawRelationship(c))
                    }
                }
            })
        })
    };
    a.drawInheritance = function() {
        _.each(a.entities(), function(a) {
            a.drawInheritance()
        })
    };
    a.drawRelationships = function() {
        _.each(a.entities(), function(a) {
            a.drawRelationships()
        })
    };
    a.redraw = function() {
        _.each(a.entities(), function(a) {
            a.redraw()
        })
    };
    a.checkNameExists = function(a, c) {
        var e;
        for (e = 0; e < c.length; e++)
            if (c[e].name() === a)
                return !0;
        return !1
    };
    a.clear = function() {
        _.each(a.entities(), function(b) {
            b.triShape && b.triShape.remove();
            _.each(b.inheritsToLines, function(c, e) {
                delete a.id2entity[e].inheritsFromLines[b];
                c.remove()
            });
            _.each(b.attrs(), function(a) {
                a.clearRelationship()
            })
        });
        a.entities.removeAll()
    };
    a.loadModel = function() {
        $("#status").html('<h4 class="center">Loading...</h4>').show();
        $.ajax({type: "GET",url: "/user/" + author + "/" + dname + "/read",dataType: "text",contentType: "application/json; charset=utf-8",success: function(b) {
                b = JSON.parse(b);
                b.version ? (_.each(b.entities, function(a) {
                    var b = new Entity(a.name, a.plural, a.inheritsFrom, a.table, a.comment, a.discrName, a.discrType, a.discrValue);
                    _.each(a.attrs, function(a) {
                        b.addAttr(new Attribute(a.name, a.cls, a.type, a.rattr, a.auto, a.defaultValue, a.lazy, a.unique))
                    });
                    model.addEntity(b);
                    b.setXY(a.left, a.top)
                }), a.sidebar.modelName(b.modelName), a.sidebar.database(b.database), a.sidebar.dbfilename(b.dbfilename), a.sidebar.createdb(b.createdb), a.sidebar.host(b.host), a.sidebar.port(b.port), a.sidebar.user(b.user), a.sidebar.password(b.password), a.sidebar.usedb(b.usedb), a.sidebar.charset(b.charset), a.sidebar.dsn(b.dsn), a.sidebar.createTables(b.createTables), a.sidebar.modelDescription(b.description)) : _.each(b, function(a) {
                    var b = new Entity(a.name, a.plural, a.inheritsFrom, a.table, "");
                    _.each(a.attrs, function(a) {
                        b.addAttr(new Attribute(a.name, a.cls, a.type, a.rattr))
                    });
                    model.addEntity(b);
                    b.setXY(a.left + 5E3, a.top + 5E3)
                });
                $pad.scrollLeft(b.scrollLeft ? b.scrollLeft : 5E3);
                $pad.scrollTop(b.scrollTop ? b.scrollTop : 5E3);
                a.sidebar.modelName(name);
                if (0 < _.size(a.entities())) {
                    b = $("#expand-collapse-icon");
                    var c = $("#coll-exp-all-text");
                    _.each(a.entities(), function(a) {
                        a.columns(2)
                    });
                    b.addClass("icon-forward");
                    b.removeClass("icon-backward");
                    c.html("Expand All");
                    a.allCollapsed = !0
                }
                a.buildInheritance();
                a.drawInheritance();
                a.buildRelationships();
                a.miniView.update();
                $("#status").html('<h4 class="center">Ready</h4>').show().fadeOut(2E3);
                changed = !1
            },error: function(a, c) {
                $("#status").html('<h4 class="center">ERROR!</h4>').show().fadeOut(2E3);
                console.log("error: " + c)
            }})
    };
    a.saveModel = function() {
        var b = {version: 2};
        b.modelName = a.sidebar.modelName();
        b.database = a.sidebar.database();
        b.dbfilename = a.sidebar.dbfilename();
        b.createdb = a.sidebar.createdb();
        b.host = a.sidebar.host();
        b.port = a.sidebar.port();
        b.user = a.sidebar.user();
        b.password = a.sidebar.password();
        b.usedb = a.sidebar.usedb();
        b.charset = a.sidebar.charset();
        b.dsn = a.sidebar.dsn();
        b.createTables = a.sidebar.createTables();
        b.description = a.sidebar.modelDescription();
        b.scrollLeft = $pad.scrollLeft();
        b.scrollTop = $pad.scrollTop();
        var c = [];
        _.each(a.entities(), function(e) {
            var g = {};
            g.name = e.name();
            g.plural = e.plural();
            g.inheritsFrom = [];
            _.each(e.inheritsFromLines, function(b, c) {
                g.inheritsFrom.push(a.id2entity[c].name())
            });
            g.table = e.table();
            g.comment = e.comment();
            g.discrName = e.discrName();
            g.discrType = e.discrType();
            g.discrValue = e.discrValue();
            g.attrs = [];
            _.each(e.attrs(), function(a) {
                var b = {};
                b.name = a.name();
                b.cls = a.cls();
                b.type = a.type();
                a.rattr && (b.rattr = a.rattr.name());
                b.auto = a.auto();
                b.unique = a.unique();
                b.defaultValue = a.defaultValue();
                b.lazy = a.lazy();
                g.attrs.push(b)
            });
            g.left = Math.round(b.scrollLeft + e.htmlNode.offset().left);
            g.top = Math.round(b.scrollTop + e.htmlNode.offset().top - padTopOffset);
            c.push(g)
        });
        b.entities = c;
        $("#status").html('<h4 class="center">Saving...</h4>').show();
        $.ajax({type: "POST",url: "/user/" + author + "/" + dname + "/update",dataType: "text",contentType: "application/json; charset=utf-8",data: JSON.stringify(b),success: function() {
                $("#status").html('<h4 class="center">Saved!</h4>').show().fadeOut(2E3);
                changed = !1
            },error: function(a, b) {
                $("#status").html('<h4 class="center">ERROR!</h4>').show().fadeOut(2E3);
                console.log("error: " + b)
            }})
    };
    a.toPythonCodeHTML = function() {
        var b = "", c = {}, e = {}, g;
        _.each(a.entities(), function(d) {
            var f = "class <span class='code-entity-name'>" + d.name() + "</span>";
            if (0 === _.size(d.inheritsFromLines))
                f += "(db.Entity):<br>";
            else
                var h = _.map(d.inheritsFromLines, function(b, c) {
                    return "db." + a.id2entity[c].name()
                }), f = f + ("(" + h.join(", ") + "):<br>");
            0 < d.comment().length && (g = d.comment().match(/.{1,80}(\s+|$)/g), f += ' <span class="text">"""' + g.join("<br> ") + '"""</span><br>');
            d.table() != d.name() && (f += ' _table_ = <span class="text">"' + d.table() + '"</span><br>');
            if (d.discrValue() && d.discrValue() !== d.name())
                var j = function(a) {
                    if (0 === _.size(a.inheritsFromLines))
                        return a.discrType();
                    for (var b in a.inheritsFromLines)
                        return j(model.id2entity[b])
                }, f = f + " _discriminator_ = ", h = j(d), f = "str" === h || "unicode" === h ? f + ('<span class="text">"' + d.discrValue() + '"</span><br>') : f + (d.discrValue() + "<br>");
            if (d.discrName() && ("classtype" !== d.discrName() || "str" !== d.discrType()))
                f += " " + d.discrName() + " = <span class='kind'>Discriminator</span>(" + d.discrType() + ")<br>";
            var n = !1, p = [];
            1 < _.size(_.filter(d.attrs(), function(a) {
                return a.cls() == classes.PrimaryKey
            })) && (n = !0);
            var q = {};
            _.each(d.attrs(), function(a) {
                a = a.type();
                if (!(a in types)) {
                    var b = q[a];
                    q[a] = b ? b + 1 : 1
                }
            });
            _.each(d.attrs(), function(b) {
                f += " " + b.name();
                f += " = ";
                var d = void 0 == b.cls() ? classes.Required : b.cls();
                n && d == classes.PrimaryKey && (d = classes.Required, p.push(b.name()));
                f += "<span class='kind'>" + d + "</span>";
                var g = void 0 === b.type() ? "unicode" : b.type();
                switch (g) {
                    case "date":
                        e[g] = "from datetime import date";
                        break;
                    case "datetime":
                        e[g] = "from datetime import datetime";
                        break;
                    case "Decimal":
                        e[g] = "from decimal import Decimal"
                }
                var h = "";
                void 0 !== q[g] && 1 < q[g] && (h = ', reverse=<span class="text">"' + b.rattr.name() + '"</span>');
                void 0 !== a.name2entity[g] && void 0 === c[g] && (g = '<span class="text">"' + g + '"</span>');
                var j = b.unique() ? ", unique=True" : "", k = b.lazy() ? ", lazy=True" : "", m = "";
                b.defaultValue() && 0 < b.defaultValue().length && (m = ", default=" + b.defaultValue());
                var s = "";
                d === classes.PrimaryKey && b.auto() && (s = ", auto=True");
                f += "(" + g + j + h + k + m + s + ")<br>"
            });
            0 == d.attrs().length && (f += ' <span class="keyword">pass</span><br>');
            n && (f += " PrimaryKey(" + p.join(", ") + ")<br>");
            f += "<br>";
            b += f;
            c[d.name()] = !0
        });
        var f = "";
        _.each(e, function(a) {
            f += a + "<br>"
        });
        var f = f + "from pony.orm import *<br><br>", h;
        switch (model.sidebar.database()) {
            case "SQLite":
                h = 'db = Database(<span class="text">"sqlite"</span>, <span class="text">"' + model.sidebar.dbfilename() + '"</span>';
                var j = "", j = model.sidebar.createdb() ? ", create_db=<strong>True</strong>" : "";
                h += j + ")";
                break;
            case "MySQL":
                h = 'db = Database(<span class="text">"mysql"</span>, host=<span class="text">"' + model.sidebar.host() + '"</span>, ';
                0 < model.sidebar.port().length && (h += "port=" + model.sidebar.port() + ", ");
                h += 'user=<span class="text">"' + model.sidebar.user() + '"</span>, passwd=<span class="text">"' + model.sidebar.password() + '"</span>, db=<span class="text">"' + model.sidebar.usedb() + '"</span>';
                0 < model.sidebar.charset().length && (h += ', charset=<span class="text">"' + model.sidebar.charset() + '"</span>');
                h += ")";
                break;
            case "PostgreSQL":
                h = 'db = Database(<span class="text">"postgres"</span>, host=<span class="text">"' + model.sidebar.host() + '"</span>, ';
                0 < model.sidebar.port().length && (h += "port=" + model.sidebar.port() + ", ");
                h += 'user=<span class="text">"' + model.sidebar.user() + '"</span>, password=<span class="text">"' + model.sidebar.password() + '"</span>, database=<span class="text">"' + model.sidebar.usedb() + '"</span>)';
                break;
            case "Oracle":
                h = 'db = Database(<span class="text">"oracle"</span>, <span class="text">"' + model.sidebar.user() + "/" + model.sidebar.password() + "@" + model.sidebar.dsn() + '"</span>)'
        }
        f += h + "<br><br>";
        b = f + b + "sql_debug(True)<br>db.generate_mapping(";
        h = model.sidebar.createTables() ? "create_tables=<strong>True</strong>)" : "check_tables=<strong>True</strong>)";
        j = model.sidebar.createTables() ? '<span class="text"># db.generate_mapping(check_tables=<strong>True</strong>)</span>' : "";
        return b += h + "<br>" + j + "<br>"
    };
    a.clickSaveModel = function() {
        model.sidebar.unselect() && a.saveModel()
    };
    a.allCollapsed = !1;
    a.clickExpandCollapseAll = function() {
        var b = $("#expand-collapse-icon"), c = $("#coll-exp-all-text");
        a.allCollapsed ? (_.each(a.entities(), function(a) {
            a.columns(3)
        }), b.addClass("icon-backward"), b.removeClass("icon-forward"), c.html("Collapse All"), a.allCollapsed = !1) : (_.each(a.entities(), function(a) {
            a.columns(2)
        }), b.addClass("icon-forward"), b.removeClass("icon-backward"), c.html("Expand All"), a.allCollapsed = !0);
        a.redraw();
        model.miniView.update()
    };
    a.clickAddEntity = function() {
        model.sidebar.unselect() && model.newEntity.openWindow()
    };
    a.clickSelectAllCode = function() {
        var a;
        document.selection ? (a = document.body.createTextRange(), a.moveToElementText(document.getElementById("code-wrapper")), a.select()) : window.getSelection && (a = document.createRange(), a.selectNode(document.getElementById("code-wrapper")), window.getSelection().addRange(a))
    }
}
var tryMoveCanvas = function(a, b) {
    var c = model.miniView.maxx, e = model.miniView.minx, g = model.miniView.maxy, f = model.miniView.miny, h = $pad.width(), j = $pad.height();
    a > c - 20 ? a = c - 20 : a < e - h + 20 && (a = e - h + 20);
    b > g - 20 ? b = g - 20 : b < f - j + 20 && (b = f - j + 20);
    $pad.scrollLeft(a);
    $pad.scrollTop(b)
}, onModelChange = function() {
    changed = !0
}, getRelName = function(a, b, c) {
    a = c === classes.Set ? b : a;
    return void 0 === a ? "" : a.charAt(0).toLowerCase() + a.slice(1).replace(/([A-Z])/g, function(a) {
        return "_" + a.toLowerCase()
    })
};
$().ready(function() {
    $pad = $("#pad");
    padTopOffset = $pad.offset().top;
    var a = $(window).height() - padTopOffset;
    $pad.css("height", a);
    $("#code-wrapper").css("height", a - 40);
    r = Raphael("pad", 1E4, 1E4);
    $("svg").attr("id", "svgpad");
    $svgpad = $("#svgpad");
    model = new Model;
    ko.applyBindings(model);
    model.miniView.init();
    $(window).resize(function() {
        var a = $(window).height() - padTopOffset;
        $pad.css("height", a);
        $("#code-wrapper").css("height", a - 40);
        model.redraw();
        model.miniView.resize();
        resized = !0
    });
    $("#pane1").mousedown(function(a) {
        if (1 === a.which)
            if (ctx.x = a.pageX, ctx.y = a.pageY, ctx.state === states.entityAdded)
                ctx.reset();
            else if ("svgpad" == a.target.id) {
                if (!model.sidebar.unselect())
                    return !1;
                ctx.reset();
                ctx.state = states.moveCanvas;
                $svgpad.css("cursor", "move")
            }
    });
    $(document).mousemove(function(a) {
        var c = $pad.scrollLeft(), e = $pad.scrollTop(), g, f;
        if (ctx.state === states.entityMouseDown || ctx.state === states.entityDrag || ctx.state === states.entityAdded) {
            changed = !0;
            ctx.state = states.entityDrag;
            g = a.pageX - ctx.x;
            f = a.pageY - ctx.y;
            var h = ctx.$elem.offset();
            g = h.left + g;
            f = h.top + f;
            0 > g ? g = 0 : g + ctx.$elem.width() > $pad.width() && (g = $pad.width() - ctx.$elem.width());
            f < padTopOffset && (f = padTopOffset);
            var j = ctx.entity;
            ctx.$elem.offset({left: g,top: f});
            j.selected() || j.markSelected();
            j.redraw();
            h.left + ctx.$elem.width() >= $pad.width() - 20 ? $pad.scrollLeft(c + 5) : 20 >= h.left && 0 < c ? $pad.scrollLeft(c - 5) : h.top + ctx.$elem.height() >= $pad.height() + padTopOffset - 20 ? $pad.scrollTop(e + 5) : h.top <= padTopOffset + 20 && 0 < e && $pad.scrollTop(e - 5);
            model.miniView.update()
        } else
            ctx.state === states.moveCanvas && (g = a.pageX - ctx.x, f = a.pageY - ctx.y, tryMoveCanvas(c - g, e - f), model.miniView.update());
        ctx.x = a.pageX;
        ctx.y = a.pageY
    });
    $(document).mouseup(function() {
        ctx.reset()
    });
    $(".tabs a:last").tab("show");
    a = $('a[data-toggle="tab"]');
    a.on("shown", function(a) {
        var c = $("body");
        "#pane2" == a.target.hash ? (a = model.toPythonCodeHTML(), $("#code-wrapper").html(a), document.onselectstart = function() {
            return !0
        }, document.selection ? document.selection.empty() : window.getSelection().removeAllRanges(), c.css("-moz-user-select", "text")) : (document.onselectstart = function() {
            return !1
        }, c.css("-moz-user-select", "none"), resized && (resized = !1, model.redraw(), model.miniView.resize(), r.safari()))
    });
    a.bind("click", function() {
        if (!model.sidebar.unselect())
            return !1
    });
    window.onerror = function(a, c, e) {
        alert("Please send the following text to team@ponyorm.com:\nerror=" + a + "\nline=" + e + "\nurl=" + c)
    };
    document.onselectstart = function() {
        return !1
    };
    window.onbeforeunload = function() {
        if (owner && changed)
            return "You have unsaved changes"
    }
});