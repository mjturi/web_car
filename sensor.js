class Sensor {
    constructor(car){
        this.car=car;
        this.num_rays=5;
        this.ray_length=100;
        this.ray_spread=Math.PI/2;

        this.rays=[];
        this.readings=[];
    }

    update(road_borders, traffic){
        this.#cast_rays();
        this.readings=[];
        for (var i = 0; i < this.rays.length; i++){
            this.readings.push(this.#get_reading(this.rays[i], road_borders, traffic));   
        }
    }

    #get_reading(ray, road_borders, traffic){
        var touches = [];

        for (var i = 0; i < road_borders.length; i++){
            const touch = get_intersection(ray[0], ray[1], road_borders[i][0], road_borders[i][1]);
            if (touch) touches.push(touch);
        }

        for (var i = 0; i < traffic.length; i++){
            for (var j = 0; j < traffic[i].polygon.length; j++){
                const touch = get_intersection(ray[0], ray[1], traffic[i].polygon[j], traffic[i].polygon[(j+1)%traffic[i].polygon.length]);
                if (touch) touches.push(touch);
            }
        }

        if (touches.length == 0) return null;
        else {
            const offsets = touches.map(e=>e.offset);
            const min = Math.min(...offsets); // ... spreads array into vals
            return touches.find(e=>e.offset==min);
        }
    }

    #cast_rays(){
        this.rays=[];
        for(var i = 0; i < this.num_rays; i++){
            const ray_angle = lerp(this.ray_spread/2, -this.ray_spread/2, this.num_rays==1 ? 0.5 : i/(this.num_rays-1))+this.car.angle;

            const start={x:this.car.x, y:this.car.y};
            const end = {x:this.car.x-Math.sin(ray_angle)* this.ray_length, y:this.car.y-Math.cos(ray_angle)* this.ray_length};
            this.rays.push([start, end]);
        }
    }

    draw(ctx){
        for (var i = 0; i < this.num_rays; i++){
            var end = this.rays[i][1];
            if (this.readings[i]) end = this.readings[i];

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);

            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);

            ctx.stroke();
        }
    }
}