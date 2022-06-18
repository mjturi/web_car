// box2d great lib for this

class Car{
    constructor(x, y, width, height, control_type, max_speed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.control_type=control_type;
        this.use_brain=control_type=="AI";

        if (control_type != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNet([this.sensor.num_rays, 6, 4]);
        }

        this.controls = new Controls(control_type);

        this.speed=0;
        this.accel=0.2;
        this.max_speed=max_speed;
        this.friction=0.05;

        this.angle=0;
        this.damaged=false;
    }

    #move(){
        if (this.controls.forward){
            this.speed+=this.accel;
        }
        if (this.controls.reverse){
            this.speed-=this.accel;
        }

        if (this.speed > this.max_speed) this.speed=this.max_speed;
        if (this.speed < -this.max_speed/2) this.speed=-this.max_speed/2;
        
        if (this.speed > 0) this.speed-=this.friction;
        else if (this.speed < 0) this.speed += this.friction;

        if (Math.abs(this.speed) < this.friction) this.speed=0;

        if (this.speed!=0){
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) this.angle+=(flip*0.05);
            if (this.controls.right) this.angle-=(flip*0.05);
        }


        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    update(road_borders, traffic){
        if (this.damaged) return;
        this.#move();
        this.polygon = this.#create_polygon();
        this.damaged=this.#asses_damage(road_borders, traffic);
        if (this.sensor){
            this.sensor.update(road_borders, traffic);
            const offsets = this.sensor.readings.map(s => s==null ? 0 : 1-s.offset);
            // console.log(offsets);
            const outputs = NeuralNet.feed_forward(offsets, this.brain);
            // console.log(outputs);

            if (this.use_brain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];

            }
        }
    }

    #asses_damage(road_borders, traffic){
        for (var i = 0; i < road_borders.length; i++){
            if (poly_intersect(this.polygon, road_borders[i])) return true;
        }
        for (var i = 0; i < traffic.length; i++){
            if (poly_intersect(this.polygon, traffic[i].polygon)) return true;
        }
        return false;
    }

    #create_polygon(){
        const points = [];
        const radius = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({x:this.x-Math.sin(this.angle-alpha)*radius, y:this.y-Math.cos(this.angle-alpha)*radius});
        points.push({x:this.x-Math.sin(this.angle+alpha)*radius, y:this.y-Math.cos(this.angle+alpha)*radius});
        points.push({x:this.x-Math.sin(Math.PI+this.angle-alpha)*radius, y:this.y-Math.cos(Math.PI+this.angle-alpha)*radius});
        points.push({x:this.x-Math.sin(Math.PI+this.angle+alpha)*radius, y:this.y-Math.cos(Math.PI+this.angle+alpha)*radius});
        return points;
    }

    draw(ctx, do_sensor){
        if (this.damaged) ctx.fillStyle="red";
        else if (this.control_type == "DUMMY") ctx.fillStyle='hsl(' + 360 * Math.random() + ', 50%, 50%)';
        else ctx.fillStyle="black";

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (var i = 0; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if (this.sensor && do_sensor) this.sensor.draw(ctx);
    }
}