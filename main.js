// 30 a 190
function Game(){
    var self   = this;
    var start  = null;
    var room   = place();
    var cart   = componet(95, 620, 30, 50, "#4f45f3");
    var finish = false;
    var leftBox  = [];
    var rightBox = [];
    var speed    = 5;
    var obt      = [];
    var position = [32, 80, 140];
    room.start(10, 10, 215, 700, "#000");
    cart.updateImage(room.context, document.getElementById("cart"));

    document.body.addEventListener('keydown', function(e){
        switch(e.which){
            case 40:
                console.log('down');
                break;
            case 39:
                console.log('right');
                cart.x += 8;
                break;
            case 38:
                console.log('up');
                break;
            case 37:
                console.log('left');
                cart.x -= 8;
                break;
            case 32:
                console.log('space');
                break;
        }
    });

    function generateRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function drawObt(){
        var count = generateRandom(1, 8);
        var yplus = 0;
        while(count--) {
            obt.push(componet(position[generateRandom(0,2)], ((yplus + 60) * -1), 40, 20, "#fff").update(room.context));
            yplus += 60;
        }
    };

    function drawStreet(){
        var count = 22;
        var yplus = -20;
        while(count--) {
            leftBox.push(componet(10, (yplus + 40), 15, 20, "#fff").update(room.context));
            rightBox.push(componet(190, (yplus + 40), 15, 20, "#fff").update(room.context));
            yplus += 40;
        }
    };

    function update(time){
        if(leftBox.length == 0) drawStreet();
        if(obt.length == 0) drawObt();
        room.clear();
        cart.updateImage(room.context, document.getElementById("cart"));

        for (var i = leftBox.length - 1; i >= 0; i--) {
            leftBox[i].y += speed;
            leftBox[i].update(room.context);
            rightBox[i].y += speed;
            rightBox[i].update(room.context);

            if(leftBox[i].y > room.canvas.height)
                leftBox[i].y = -30 - (speed - 0.5);
            if(rightBox[i].y > room.canvas.height)
                rightBox[i].y = -30 - (speed - 0.5);

            finish = finish || leftBox[i].colision(cart);
            finish = finish || rightBox[i].colision(cart);
        }

        for (var i = obt.length - 1; i >= 0; i--) {
            obt[i].y += speed;
            obt[i].update(room.context);
            if(obt[i].y > room.canvas.height){
                obt[i].x = position[generateRandom(0,2)];
                obt[i].y = -30;

            }
            finish = finish || obt[i].colision(cart);
        }


        if(speed < 15)
            speed += 0.001;
        if(!finish)
            window.requestAnimationFrame(update);
    };

    function place(){
        return {
            "canvas": document.createElement("canvas"),
            "start" : function(x, y, w, h, color){
                this.context = this.canvas.getContext("2d");
                this.canvas.width  = w;
                this.canvas.height = h;
                this.canvas.x      = x;
                this.canvas.y      = y;
                this.canvas.style.background = color;
                document.body.appendChild(this.canvas);
            },
            "clear" : function() {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };
    };

    function componet(x, y, w, h, color){
        return {
            "x" : x, "y" : y, "w" : w, "h" : h, "color" : color,
            "update" : function(ctx){
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.w, this.h);
                return this;
            },
            "updateImage": function(ctx, img){
                ctx.fillStyle = color;
                ctx.drawImage(img, this.x, this.y, this.w, this.h);
                return this;
            },
            "colision": function(el){
                return (   this.x > (el.x - 20)
                        && this.x < (el.x + 20)
                        && (this.y + 20) > el.y
                        && (this.y + 20) < (el.y + 20)
                        );
            }
        }
    };


    self.start = function(){
        window.requestAnimationFrame(update);
    };
};

document.addEventListener("DOMContentLoaded", function(){
    console.log('dd');
    var game = new Game();
    game.start();
});
