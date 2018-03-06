//全局对象
var Global = {};

Global.imgObj = {
    gameOver: {
        x: 170,
        y: 990,
        w: 300,
        h: 90
    },
    readyBtn0: {
        x: 550,
        y: 900,
        w: 160,
        h: 90
    },
    readyBtn1: {
        x: 550,
        y: 1005,
        w: 160,
        h: 90
    },
    readyBtn2: {
        x: 550,
        y: 1110,
        w: 160,
        h: 90
    },
    bg: {
        x: 0,
        y: 0,
        w: 800,
        h: 600
    },
    getReady: {
        x: 170,
        y: 900,
        w: 300,
        h: 90
    },
    click: {
        x: 170,
        y: 1150,
        w: 230,
        h: 150
    },
    score0: {
        x: 900,
        y: 400,
        w: 36,
        h: 54
    },
    score5: {
        x: 900,
        y: 460,
        w: 36,
        h: 54
    },
    bird0: {
        x: 170,
        y: 750,
        w: 34,
        h: 24
    },
    bird1: {
        x: 222,
        y: 750,
        w: 34,
        h: 24
    },
    bird2: {
        x: 275,
        y: 750,
        w: 34,
        h: 24
    },
    pip0: {
        x: 0,
        y: 750,
        w: 52,
        h: 420
    },
    pip1: {
        x: 70,
        y: 750,
        w: 52,
        h: 420
    },
    ground: {
        x: 0,
        y: 600,
        w: 800,
        h: 112
    }
}

Global.inherit = function(_supper, _class) {
    var F = function() {};
    F.prototype = new _supper();
    _class.prototype = new F();
    _class.prototype.constructor = _class;
    //用于调用父类同名方法
    _class.prototype.supper = function(method, context) {
        if (_supper.prototype[method] && typeof _supper.prototype[method] === 'function') {
            _supper.prototype[method].apply(context, [].slice.call(arguments, 2));
        }
    }
}

function loadImg(src, callback) {
    var img = new Image();
    img.src = 'img.png';
    img.onload = function() {
        callback(img);
    }
}

loadImg('img.png', function(img) {
    Global.width = parseInt(canvas.getAttribute('width'));
    Global.height = parseInt(canvas.getAttribute('height'));
    Global.img = img;
    init();
});

function init() {
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');
    var scene = new Scene(ctx);
    scene.addChild(new Background(Global.img));
    scene.addChild(new Ground(Global.img));
    scene.addChild(new Pip(Global.img));
    scene.run();
}

//场景类
function Scene(ctx) {
    this.sprites = [];
    this.ctx = ctx;
}
Scene.prototype.run = function() {
    var self = this;
    for (var i = 0; i < self.sprites.length; i++) {
        self.sprites[i].draw(this.ctx);
    }
    requestAnimationFrame(function() {
        self.run();
    })
}
Scene.prototype.addChild = function(child) {
    this.sprites.push(child);
}
Scene.prototype.removeChild = function(child) {
    this.sprites = this.sprites.filter(function(item) {
        if (item === child) {
            child.destroy();
        }
        return item != child;
    });
}

//精灵类
function Sprite() {}

Sprite.prototype.draw = function(ctx, img) {
    if (this.srcPos instanceof Array || this.desPos instanceof Array) {
        var srcPos = this.srcPos;
        if (!(this.srcPos instanceof Array)) {
            srcPos = _toArray(this.srcPos, this.desPos.length, 0);
        }

        var desPos = this.desPos;
        if (!(this.desPos instanceof Array)) {
            desPos = _toArray(this.desPos, this.srcPos.length, 0);
        }

        var srcRect = this.srcRect;
        if (!(this.srcRect instanceof Array)) {
            srcRect = _toArray(this.srcRect, srcPos.length, 1);
        }

        var desRect = this.desRect;
        if (typeof desRect === 'undefined') {
            desRect = srcRect;
        } else if (!(this.desRect instanceof Array)) {
            desRect = _toArray(this.desRect, srcPos.length, 1);
        }

        for (var i = 0; i < srcPos.length; i++) {
            ctx.drawImage(img, srcPos[i].x, srcPos[i].y, srcRect[i].width, srcRect[i].height,
                desPos[i].x, desPos[i].y, desRect[i].width, desRect[i].height);
        }
    } else {
        ctx.drawImage(img, this.srcPos.x, this.srcPos.y, this.srcRect.width, this.srcRect.height,
            desPos.x, desPos.y, this.desRect.width, this.desRect.height);
    }
    //对象扩充成数组
    function _toArray(obj, length, type) {
        if (!(obj instanceof Array)) {
            var arr = [];
            for (var i = 0; i < length; i++) {
                if (type == 0) {
                    arr[i] = {
                        x: obj.x,
                        y: obj.y
                    }
                } else {
                    arr[i] = {
                        width: obj.width,
                        height: obj.height
                    }
                }
            }
            return arr;
        } else {
            return obj;
        }
    }
}
//背景类
function Background(img) {
    this.img = img;

    this.srcPos = {
        x: Global.imgObj.bg.x,
        y: Global.imgObj.bg.y
    }

    this.desPos = [{
        x: 0,
        y: 0
    }, {
        x: Global.imgObj.bg.w,
        y: 0,
    }]

    this.srcRect = {
        height: Global.imgObj.bg.h,
        width: Global.imgObj.bg.w
    }

    this.step = 1;
}
//继承精灵类
Global.inherit(Sprite, Background);
//重写draw方法实现卷轴
Background.prototype.draw = function(ctx) {
    //调用父类draw方法
    this.supper('draw', this, ctx, this.img);

    this.desPos[0].x -= this.step;
    this.desPos[1].x -= this.step;

    if (this.desPos[0].x < -this.srcRect.width) {
        this.desPos[0].x = Global.imgObj.bg.w;
    }

    if (this.desPos[1].x < -this.srcRect.width) {
        this.desPos[1].x = Global.imgObj.bg.w;
    }
}
//草地类
function Ground(img) {
    this.img = img;

    this.srcPos = {
        x: Global.imgObj.ground.x,
        y: Global.imgObj.ground.y
    }

    this.desPos = [{
        x: 0,
        y: Global.imgObj.bg.h
    }, {
        x: Global.imgObj.ground.w,
        y: Global.imgObj.bg.h,
    }]

    this.srcRect = {
        height: Global.imgObj.ground.h,
        width: Global.imgObj.ground.w
    }

    this.step = 1;
}
//继承精灵类
Global.inherit(Sprite, Ground);
//重写draw方法实现卷轴
Ground.prototype.draw = function(ctx) {
    //调用父类draw方法
    this.supper('draw', this, ctx, this.img);

    this.desPos[0].x -= this.step;
    this.desPos[1].x -= this.step;

    if (this.desPos[0].x < -this.srcRect.width) {
        this.desPos[0].x = Global.imgObj.ground.w;
    }

    if (this.desPos[1].x < -this.srcRect.width) {
        this.desPos[1].x = Global.imgObj.ground.w;
    }
}
//管道类(向上)
function Pip(img){
    this.img = img;
    //产生一组管道
    this.createPip();
}
//继承精灵类
Global.inherit(Sprite, Pip);

Pip.prototype.draw = function(ctx){
    //调用父类draw方法
    this.supper('draw', this, ctx, this.img);
}
//产生一组管道(上和下)
Pip.prototype.createPip = function(){
    var upSrcPos = {
        x: Global.imgObj.pip1.x,
        y: (Global.imgObj.pip1.y+Math.random()*Global.imgObj.pip1.h)>>0
    }
    var upRect = {
        width: Global.imgObj.pip1.w,
        height: Global.imgObj.pip1.h-(upSrcPos.y-Global.imgObj.pip1.y)
    }
    var upDesPos = {
        x: (Global.width/2 - Global.imgObj.pip1.w/2)>>0,
        y: 0
    }
    var downSrcPos = {
        x: Global.imgObj.pip0.x,
        y: Global.imgObj.pip0.y
    }
    var downRect = {
        width: Global.imgObj.pip0.w,
        height: Global.imgObj.bg.h - upRect.height - 100
    }
    var downDesPos = {
        x: (Global.width/2 - Global.imgObj.pip0.w/2)>>0,
        y: upRect.height + 100
    }
    this.srcPos = [upSrcPos,downSrcPos];
    this.srcRect = [upRect,downRect];
    this.desPos = [upDesPos,downDesPos];
}