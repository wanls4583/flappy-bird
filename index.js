//全局对象
function Global() {}

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
    pie0: {
        x: 0,
        y: 750,
        w: 52,
        h: 420
    },
    pie1: {
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

function loadImg(src, callback) {
    var img = new Image();
    img.src = 'img.png';
    img.onload = function() {
        callback(img);
    }
}

loadImg('img.png', function(img) {
    var canvas = document.querySelector('#canvas');
    Global.img = img;
    Global.ctx = canvas.getContext('2d');
    Global.width = parseInt(canvas.getAttribute('width'));
    Global.height = parseInt(canvas.getAttribute('height'));
    init();
});

function init(){
	var scene = new Scene();
	scene.addChild(new Background());
	scene.addChild(new Ground());
	scene.run();
}

//接口类，用于验证接口是否实现了某些方法
var Interface = function(name, methods) {
    this.name = name;
    this.methods = methods
}
Interface.checkImplement = function(obj, inter) {
    for (var i = 0; i < inter.methods.length; i++) {
        var method = inter.methods[i]
        if (!obj[method] || typeof obj[method] != 'function')
            return false;
    }
    return true;
}

//场景类
function Scene() {
    this.sprites = [];
}
Scene.prototype.run = function() {
    var self = this;
    for (var i = 0; i < self.sprites.length; i++) {
        self.sprites[i].draw();
    }
    requestAnimationFrame(function() {
        self.run();
    })
}
Scene.prototype.addChild = function(child) {
    if (!Sprite.check(child)) {
        throw new Error('不是Sprite对象');
    }
    this.sprites.push(child);
}
Scene.prototype.removeChild = function(child) {
    if (!Sprite.check(child)) {
        throw new Error('不是Sprite对象');
    }
    this.sprites = this.sprites.filter(function(item) {
        if (item === child) {
            child.destroy();
        }
        return item != child;
    });
}

//精灵类
function Sprite() {}
//检查是否为sprite对象
Sprite.check = function(obj) {
    var sprite = new Interface('Sprite', ['draw', 'destroy']);
    return Interface.checkImplement(obj, sprite);
}

//背景类
function Background() {
    this.src_x = Global.imgObj.bg.x;
    this.src_y = Global.imgObj.bg.y;
    //第一张背景图的x坐标
    this.x1 = 0;
    //第二张背景图的x坐标
    this.x2 = Global.imgObj.bg.w;
    this.height = Global.imgObj.bg.h;
    this.width = Global.imgObj.bg.w;
    this.step = 2;
}

Background.prototype.draw = function() {
	//依次画出两张背景图，实现卷轴效果
    Global.ctx.drawImage(Global.img, this.src_x, this.src_y, this.width, this.height, this.x1, 0, this.width, this.height);
    Global.ctx.drawImage(Global.img, this.src_x, this.src_y, this.width, this.height, this.x2, 0, this.width, this.height);
    this.x1-=this.step;
    this.x2-=this.step;
    if(this.x1 < -this.width){
    	this.x1 = Global.imgObj.bg.w;
    }
    if(this.x2 < -this.width){
    	this.x2 = Global.imgObj.bg.w;
    }
}

Background.prototype.destroy = function(){}

//草地类
function Ground() {
    this.src_x = Global.imgObj.ground.x;
    this.src_y = Global.imgObj.ground.y;
    //第一张草地图的x坐标
    this.x1 = 0;
    //第二张草地图的x坐标
    this.x2 = Global.imgObj.ground.w;
    this.height = Global.imgObj.ground.h;
    this.width = Global.imgObj.ground.w;
    this.step = 2;
}

Ground.prototype.draw = function() {
	//依次画出两张草地图，实现卷轴效果
    Global.ctx.drawImage(Global.img, this.src_x, this.src_y, this.width, this.height, this.x1, Global.imgObj.bg.h, this.width, this.height);
    Global.ctx.drawImage(Global.img, this.src_x, this.src_y, this.width, this.height, this.x2, Global.imgObj.bg.h, this.width, this.height);
    this.x1-=this.step;
    this.x2-=this.step;
    if(this.x1 < -this.width){
    	this.x1 = Global.imgObj.ground.w;
    }
    if(this.x2 < -this.width){
    	this.x2 = Global.imgObj.ground.w;
    }
}

Ground.prototype.destroy = function(){}

