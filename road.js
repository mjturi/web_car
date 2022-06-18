class Road {
    constructor(x, width, num_lanes=5){
        this.x=x;
        this.width=width;
        this.num_lanes=num_lanes;

        this.left=this.x-this.width/2;
        this.right=this.x+this.width/2;

        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;

        const top_lft={x:this.left, y:this.top};
        const top_rght={x:this.right, y:this.top};
        const btm_lft={x:this.left, y:this.bottom};
        const btm_rght={x:this.right, y:this.bottom};

        this.borders=[[top_lft, btm_lft], [top_rght, btm_rght]];
    }

    get_lane_center(lane_index){
        const lane_width = this.width/this.num_lanes;
        return this.left+lane_width/2+Math.min(lane_index, this.num_lanes-1)*lane_width;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for (var i=1; i <= this.num_lanes-1; i++){
            const x = lerp(this.left, this.right, i/this.num_lanes);
            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}

