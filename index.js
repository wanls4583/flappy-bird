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

Global.on = function(dom,type,callback){

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
    var scene = new Scene(canvas);
    scene.addChild(new Background(Global.img));
    scene.addChild(new Ground(Global.img));
    scene.addChild(new GameBegin(Global.img));
    scene.run();
}

//场景类
function Scene(canvas) {
    this.sprites = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stopAni = false;
    this.initEvent();
}

Scene.prototype.initEvent = function(){
    var self = this;
    _bind('touchstart');
    _bind('touchmove');
    _bind('touchend');
    _bind('click');
    _bind('mousedown');
    _bind('mouseup');
    //绑定事件到canvas
    function _bind(eventType){
        this.canvas.addEventListener(eventType,function(event){
            var offsetX = 0;
            var offsetY = 0;
            switch(eventType){
                case 'touchstart':
                    offsetX = event.touches[0].clientX + event.currentTarget.offsetLeft;
                    offsetY = event.touches[0].clientY + event.currentTarget.offsetTop;
                    break;
                case 'touchmove':
                    offsetX = event.changedTouches[0].clientX + event.currentTarget.offsetLeft;
                    offsetY = event.changedTouches[0].clientY + event.currentTarget.offsetTop;
                    break;
                case 'touchend':
                    offsetX = event.changedTouches[0].clientX + event.currentTarget.offsetLeft;
                    offsetY = event.changedTouches[0].clientY + event.currentTarget.offsetTop;
                    break;
                case 'click':
                    offsetX = event.clientX + event.currentTarget.offsetLeft;
                    offsetY = event.clientY + event.currentTarget.offsetTop;
                    break;
                case 'touchstart':
                    offsetX = event.clientX + event.currentTarget.offsetLeft;
                    offsetY = event.clientY + event.currentTarget.offsetTop;
                    break;
            }

            for(var i=self.sprites.length; i>0; i--){
                var sprite = self.sprites[i-1];
                if(_checkIn(sprite,offsetX,offsetY) && sprite.eventListener[eventType]){
                    sprite.trigger(eventType);
                    break;
                }
            }
        });
    }
    //判断是否在子元素类
    function _checkIn(sprite,offsetX,offsetY){
        for(var i=0; i<sprite.desPos.length; i++){
            var x = sprite.desPos[i].x;
            var y = sprite.desPos[i].y;
            var width = sprite.desRect[i].width;
            var height = sprite.desRect[i].height;
            if(x<offsetX && x+width>offsetX && y<offsetY && y+height>offsetY){
                return true;
            }
        }
        return false;
    }
}

Scene.prototype.run = function() {
    var self = this;
    this.stopAni = false;
    for (var i = 0; i < self.sprites.length; i++) {
        self.sprites[i].draw(this.ctx);
    }
    requestAnimationFrame(function() {
        if(!self.stopAni){
            self.run();
        }
    })
}

Scene.prototype.stop = function(){
    this.stopAni = true;
}

Scene.prototype.addChild = function(child) {
    this.sprites.push(child);
    //子元素scene属性指向场景
    child.scene = this;
}

Scene.prototype.removeChild = function(child) {
    this.sprites = this.sprites.filter(function(item) {
        return item != child;
    });
}

Scene.prototype.removeAllChild = function(child) {
    this.sprites = [];
}
//精灵类
function Sprite() {
    this.eventListener = {};
}

Sprite.prototype.draw = function(ctx, img) {
    if (this.desPos instanceof Array) {
        for (var i = 0; i < this.srcPos.length; i++) {
            ctx.drawImage(img, this.srcPos[i].x, this.srcPos[i].y, this.srcRect[i].width, this.srcRect[i].height,
                this.desPos[i].x, this.desPos[i].y, this.desRect[i].width, this.desRect[i].height);
        }
    } else {
        ctx.drawImage(img, this.srcPos.x, this.srcPos.y, this.srcRect.width, this.srcRect.height,
            this.desPos.x, this.desPos.y, this.desRect.width, this.desRect.height);
    }
}
//绑定事件
Sprite.prototype.on = function(eventType,callback){
    if(this.eventListener[eventType]){
        this.eventListener[eventType].push(callback);
    }else{
        this.eventListener[eventType] = [callback];
    }
}
//解除事件
Sprite.prototype.off = function(eventType,callback){
    if(!eventType){
        this.eventListener = {};
    }else if(!callback && this.eventListener[eventType]){
        this.eventListener[eventType] = null;
    }else if(this.eventListener[eventType]){
        var index =  this.eventListener[eventType].indexOf(callback);
        if(index>-1){
            this.eventListener[eventType].splice(index,1);
        }
    }
}
//触发事件
Sprite.prototype.trigger = function(eventType){
    for(var i=0; this.eventListener[eventType] && i<this.eventListener[eventType].length; i++){
        this.eventListener[eventType][i].apply(this);
    }
}

//碰撞检测(矩形检测)
Sprite.prototype.rectCollisioDetect = function() {
    var sprites = this.scene.sprites;
    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        if (sprite != this && sprite.ifColli) {
            var pos1 = this.desPos;
            var rect1 = this.desRect;
            if (!(pos1 instanceof Array)) {
                pos1 = [this.desPos]
            }
            if (!(rect1 instanceof Array)) {
                rect1 = [this.desRect]
            }
            var pos2 = sprite.desPos;
            var rect2 = sprite.desRect;
            if (!(pos2 instanceof Array)) {
                pos2 = [sprite.desPos]
            }
            if (!(rect2 instanceof Array)) {
                rect2 = [sprite.desRect]
            }

            for (var n = 0; n < pos1.length; n++) {
                for (var m = 0; m < pos2.length; m++) {
                    if (_detect(pos1[n].x, pos1[n].y, rect1[n].width, rect1[n].height,
                            pos2[m].x, pos2[m].y, rect2[m].width, rect2[m].height)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;

    function _detect(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 < x2) {
            if (y1 < y2) {
                if (x1 + w1 > x2 && y1 + h1 > y2) {
                    return true;
                }
            } else {
                if (x1 + w1 > x2 && y2 + h2 > y1) {
                    return true;
                }
            }
        } else {
            if (y1 < y2) {
                if (x2 + w2 > x1 && y1 + h1 > y2) {
                    return true;
                }
            } else {
                if (x2 + w2 > x1 && y2 + h2 > y1) {
                    return true;
                }
            }
        }
        return false;
    }
}
//背景类
function Background(img) {
    this.img = img;

    this.srcPos = [{
        x: Global.imgObj.bg.x,
        y: Global.imgObj.bg.y
    }, {
        x: Global.imgObj.bg.x,
        y: Global.imgObj.bg.y
    }]

    this.desPos = [{
        x: 0,
        y: 0
    }, {
        x: Global.imgObj.bg.w,
        y: 0,
    }]

    this.srcRect = this.desRect = this.srcRect = [{
        height: Global.imgObj.bg.h,
        width: Global.imgObj.bg.w
    }, {
        height: Global.imgObj.bg.h,
        width: Global.imgObj.bg.w
    }]

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

    if (this.desPos[0].x < -this.srcRect[0].width) {
        this.desPos[0].x = Global.imgObj.bg.w;
    }

    if (this.desPos[1].x < -this.srcRect[0].width) {
        this.desPos[1].x = Global.imgObj.bg.w;
    }
}
//草地类
function Ground(img) {
    this.img = img;
    //是否进行碰撞检测
    this.ifColli = true;

    this.srcPos = [{
        x: Global.imgObj.ground.x,
        y: Global.imgObj.ground.y
    }, {
        x: Global.imgObj.ground.x,
        y: Global.imgObj.ground.y
    }]

    this.desPos = [{
        x: 0,
        y: Global.imgObj.bg.h
    }, {
        x: Global.imgObj.ground.w,
        y: Global.imgObj.bg.h,
    }]

    this.desRect = this.srcRect = [{
        height: Global.imgObj.ground.h,
        width: Global.imgObj.ground.w
    }, {
        height: Global.imgObj.ground.h,
        width: Global.imgObj.ground.w
    }]

    this.step = 2;
}
//继承精灵类
Global.inherit(Sprite, Ground);
//重写draw方法实现卷轴
Ground.prototype.draw = function(ctx) {
    //调用父类draw方法
    this.supper('draw', this, ctx, this.img);

    this.desPos[0].x -= this.step;
    this.desPos[1].x -= this.step;

    if (this.desPos[0].x < -this.srcRect[0].width) {
        this.desPos[0].x = Global.imgObj.ground.w;
    }

    if (this.desPos[1].x < -this.srcRect[0].width) {
        this.desPos[1].x = Global.imgObj.ground.w;
    }
}
//管道类(向上)
function Pip(img, type) {
    this.img = img;
    //允许碰撞检测
    this.ifColli = true;
    //产生一组管道
    this.createPip(type);
    this.step = 2;
}
//继承精灵类
Global.inherit(Sprite, Pip);

Pip.prototype.draw = function(ctx) {
    //调用父类draw方法
    this.supper('draw', this, ctx, this.img);
    this.desPos[0].x -= this.step;
    this.desPos[1].x -= this.step;
    //超出屏幕后，产生新的一组管道
    if (this.desPos[0].x < -Global.imgObj.pip0.w) {
        this.createPip();
    }
}
//产生一组管道(上和下)
Pip.prototype.createPip = function(type) {
    var upSrcPos = {
        x: Global.imgObj.pip1.x,
        y: (Global.imgObj.pip1.y + Math.random() * (Global.imgObj.pip1.h - 100)) >> 0
    }
    var upRect = {
        width: Global.imgObj.pip1.w,
        height: Global.imgObj.pip1.h - (upSrcPos.y - Global.imgObj.pip1.y)
    }
    var upDesPos = {
        x: Global.width,
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
        x: Global.width,
        y: upRect.height + 100
    }
    if (type) {
        upDesPos.x = (Global.width * 3 / 2 + Global.imgObj.pip0.w / 2) >> 0;
        downDesPos.x = (Global.width * 3 / 2 + Global.imgObj.pip0.w / 2) >> 0;
    }
    this.srcPos = [upSrcPos, downSrcPos];
    this.desRect = this.srcRect = [upRect, downRect];
    this.desPos = [upDesPos, downDesPos];
}
//鸟类
function Bird(img) {
    this.img = img;

    this.live = true;

    this.ifColli = true;

    this.pos = [{
        x: Global.imgObj.bird0.x,
        y: Global.imgObj.bird0.y
    }, {
        x: Global.imgObj.bird1.x,
        y: Global.imgObj.bird1.y
    }, {
        x: Global.imgObj.bird2.x,
        y: Global.imgObj.bird2.y
    }];

    this.type = 0;
    //加速度
    this.a = 0.5;
    //速度
    this.step = 1;

    this.srcPos = this.pos[this.type];

    this.desPos = {
        x: (Global.width / 3) >> 0,
        y: (Global.imgObj.bg.h / 2) >> 0
    };

    this.rect = [{
        height: Global.imgObj.bird0.h,
        width: Global.imgObj.bird0.w
    }, {
        height: Global.imgObj.bird1.h,
        width: Global.imgObj.bird1.w
    }, {
        height: Global.imgObj.bird2.h,
        width: Global.imgObj.bird2.w
    }]

    this.srcRect = this.desRect = this.rect[this.type];
}
//继承精灵类
Global.inherit(Sprite, Bird);

Bird.prototype.draw = function(ctx, img) {
    //调用父类draw方法
    this.supper('draw', this, ctx, this.img);

    this.type = ++this.type % 3;

    this.srcPos = this.pos[this.type];

    this.srcRect = this.desRect = this.rect[this.type];

    this.desPos.y += this.step;

    if(this.desPos.y + this.srcRect.height > Global.imgObj.bg.h){
        this.desPos.y = Global.imgObj.bg.h - this.srcRect.height + 2;
    }else if(this.desPos.y < 0){
        this.desPos.y = 0;
    }

    if (Math.abs(this.step) < 5) {
        this.step += this.a;
    }
    this.collisioDetect();
}
//鸟儿向上飞
Bird.prototype.up = function(){
    this.step = -1;
    this.a = -0.5;
}
//鸟儿向上飞
Bird.prototype.down = function(){
    this.step = 1;
    this.a = 0.5;
}

Bird.prototype.collisioDetect = function() {
    if (this.rectCollisioDetect() && this.live) {
        this.live = false;
        this.scene.stop();
        Global.gameOver = new GameOver(Global.img);
        this.scene.addChild(Global.gameOver);
    }
}
//结束界面类
function GameOver(img){
    this.img = img;

    this.srcPos = [{
        x: Global.imgObj.gameOver.x,
        y: Global.imgObj.gameOver.y
    },{
        x: Global.imgObj.readyBtn0.x,
        y: Global.imgObj.readyBtn0.y
    }]

    this.desPos = [{
        x: (Global.width/2 - Global.imgObj.gameOver.w/2)>>0,
        y: 250
    },{
        x: (Global.width/2 - Global.imgObj.readyBtn0.w/2)>>0,
        y: 400
    }]

    this.desRect = this.srcRect = [{
        width: Global.imgObj.gameOver.w,
        height: Global.imgObj.gameOver.h
    },{
        width: Global.imgObj.readyBtn0.w,
        height: Global.imgObj.readyBtn0.h
    }]

    this.on('touchstart',function(){
        this.restart();
    })
}
//继承精灵类
Global.inherit(Sprite, GameOver);

GameOver.prototype.draw = function(ctx, img) {
    this.supper('draw', this, ctx, this.img);
}

GameOver.prototype.restart = function(){
    Global.pipG0.createPip();
    Global.pipG0.createPip(1);
    Global.bird.desPos.y = (Global.imgObj.bg.h / 2) >> 0;
    Global.bird.live = true;
    this.scene.removeChild(this);
    this.scene.run();
}
//开始界面类
function GameBegin(img){
    this.img = img;

    this.srcPos = [{
        x: Global.imgObj.getReady.x,
        y: Global.imgObj.getReady.y
    },{
        x: Global.imgObj.readyBtn0.x,
        y: Global.imgObj.readyBtn0.y
    }]

    this.desPos = [{
        x: (Global.width/2 - Global.imgObj.getReady.w/2)>>0,
        y: 250
    },{
        x: (Global.width/2 - Global.imgObj.readyBtn0.w/2)>>0,
        y: 400
    }]

    this.desRect = this.srcRect = [{
        width: Global.imgObj.getReady.w,
        height: Global.imgObj.getReady.h
    },{
        width: Global.imgObj.readyBtn0.w,
        height: Global.imgObj.readyBtn0.h
    }]

    this.on('touchstart',function(){
        this.start();
    })
}
//继承精灵类
Global.inherit(Sprite, GameBegin);

GameBegin.prototype.draw = function(ctx, img) {
    this.supper('draw', this, ctx, this.img);
}

GameBegin.prototype.start = function(){
    var scene = this.scene;
    var bird = new Bird(Global.img);
    var pipG0 = new Pip(Global.img);
    var pipG1 = new Pip(Global.img, 1);
    scene.removeChild(this);
    scene.addChild(pipG0);
    scene.addChild(pipG1);
    scene.addChild(bird);
    Global.pipG0 = pipG0;
    Global.pipG1 = pipG1;
    Global.bird = bird;
    var hasKeyUp = true; //防止连续触发键盘事件
    document.onkeydown = function(event){
        if(event.keyCode==38 && hasKeyUp){
            hasKeyUp = false;
            bird.up();
        }
    }
    document.onkeyup = function(event){
        if(event.keyCode==38){
            hasKeyUp = true;
            bird.down();
        }
    }
    setTimeout(function(){
        //鼠标事件
        document.addEventListener('touchstart',function(event){
            bird.up();
        })
        document.addEventListener('touchend',function(event){
            bird.down();
        })
    },50);
    
}
