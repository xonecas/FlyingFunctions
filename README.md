     ____  _   __  __ _  __  _  ____     ____  __ __  __  _  ____  _____  _  ____  __  _   ____
    | ===|| |__\ \/ /| ||  \| |/ (_,`   | ===||  |  ||  \| |/ (__`|_   _|| |/ () \|  \| | (_ (_`
    |__|  |____||__| |_||_|\__|\____)   |__|   \___/ |_|\__|\____)  |_|  |_|\____/|_|\__|.__)__)


Flying functions is a JS game engine. This is a study project, I'm doing this to learn more about
game development and in specific game development in the browser.

I started with an engine, so that I can use it for future experiments with animating the HTML5 canvas.

Still want to try it out? Ok, just include the `lib/flying-functions.js` in your page.
After it's loaded you can initialize the engine. There are a options you can pass to the constructor
check out the annotted source code in `docs/` for more on this.

```javascript
var ff = new FlyingFunctions({
    width: 640,
    height: 320
});

ff.on('frame', function () {
    // my drawing code
});

// start the game loop
ff.loop();
```

Here is a full example (form the test folder):

```html
<!doctype html>
<html lang="en">
<head>
    <title>Flying Functions Main test</title>
</head>
<body>

    <script src="../lib/flying-functions.js"></script>
    <script>
        console.log(FlyingFunctions);
        console.log(FlyingFunctions.prototype);

        var ff = new FlyingFunctions({
            width: 640,
            height: 320,
            init: function (o) {
                console.log('in init func');
                // this is the ff object
                console.log(typeof this);
                console.log(this instanceof FlyingFunctions);
                console.log(o);
            }
        });

        console.log(ff);

        var particle = {
            x: 10,
            y: 10,
            speed: 5,
            size: 2,
            random: true
        };

        ff.on('frame', function () {
            var c = this.c;

            if (particle.random) {
                particle.x += particle.speed + Math.floor(Math.random() * 220);
                particle.y += particle.speed + Math.floor(Math.random() * 160);
            } else {
                particle.x += particle.speed;
                particle.y += particle.speed;
            }

            if (particle.x >= this.canvas.width || particle.y >= this.canvas.height) {
                particle.x = 10;
                particle.y = 10;
            }

            c.save();
            c.fillStyle = "hsl(190, 100%, 50%)";
            c.beginPath();
            c.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, true);
            c.fill();
            c.restore();
        });

        window.onload = function () {
            ff.loop();
        };
    </script>

</body>
</html>
```
