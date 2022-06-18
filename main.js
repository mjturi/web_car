const car_canvas = document.getElementById("car_canvas");
const net_canvas = document.getElementById("net_canvas");

car_canvas.width = 250;
net_canvas.width = 350;

const car_ctx = car_canvas.getContext("2d");
const net_ctx = net_canvas.getContext("2d");

const road  = new Road(car_canvas.width/2, car_canvas.width*0.9);

const N = 500;

const testers = gen_cars(N, "AI");
// const traffic = gen_cars(N/20, "DUMMY");


var traffic=[
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-100,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-300,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-300,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-400,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-400,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-500,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-500,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-600,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-600,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-700,30,50,"DUMMY",2),
    new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),-700,30,50,"DUMMY",2),
];

var best_car=testers[0];
load();

function new_traffic(){
    const traffic_=[
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-100,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-100,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-200,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-200,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-300,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-300,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-400,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-400,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-500,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-500,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-600,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-600,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-700,30,50,"DUMMY",2),
        new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)),best_car.y-700,30,50,"DUMMY",2),
    ];
    return traffic_;
}

start();
animate();

function save() {
    localStorage.setItem("best_brain", JSON.stringify(best_car.brain));
    console.log("Brain saved");
}

function discard(){
    localStorage.removeItem("best_brain");
}

function load(){
    if (localStorage.getItem("best_brain")){
        for (var i = 0; i < testers.length; i++){
            testers[i].brain = JSON.parse(localStorage.getItem("best_brain"));
            if (i) NeuralNet.mutate(testers[i].brain, 0.2);
        }
        console.log("Brain loaded");
    }
}

function gen_cars(N, type){
    const cars = [];
    for (var i = 0; i < N; i++){
        cars.push(new Car(road.get_lane_center(Math.floor(Math.random() * road.num_lanes)), 100, 30, 50, type));
    }
    return cars;
}


var prev_traffic_distance = 0;
var traffic_skips = 0;

var startTime, endTime;

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  return seconds;
}

function animate(time){
    for (var i = 0; i < traffic.length; i++) traffic[i].update(road.borders, []);
    for (var i = 0; i < testers.length; i++) testers[i].update(road.borders, traffic);

    car_canvas.height=window.innerHeight;
    net_canvas.height=window.innerHeight;

    best_car=testers.find(
        c=>c.y==Math.min(
            ...testers.map(c=>c.y)
    ));

    var furthest_traffic=testers.find(
        c=>c.y==Math.min(
            ...testers.map(c=>c.y)
        ));

    if (prev_traffic_distance == furthest_traffic.x) traffic_skips += 1;
    else { 
        prev_traffic_distance = furthest_traffic.x;
        traffic_skips = 0;
    }
    // console.log(prev_traffic_distance);
    // else if (prev_traffic_distance )

    car_ctx.save();
    car_ctx.translate(0, -best_car.y+car_canvas.height*0.7);

    car_ctx.globalAlpha = 0.2;
    for (var i = 0; i < testers.length; i++)if (testers[i] != best_car) testers[i].draw(car_ctx);
    car_ctx.globalAlpha = 1.0;

    for (var i = 0; i < traffic.length; i++) traffic[i].draw(car_ctx);
    best_car.draw(car_ctx, true);

    road.draw(car_ctx);
    car_ctx.restore();

    net_ctx.lineDashOffset =-time/50;
    Visualizer.drawNetwork(net_ctx, best_car.brain);

    if (traffic_skips >= 300){
        traffic=[];
        traffic=new_traffic();
        traffic_skips = 0;
        prev_traffic_distance = 0;
        console.log("new traffic");
        
        var dif = end();
        console.log(dif);

        if (dif > 60*10){
            save();
            console.log("reboot");
            window.location.reload();
        }
    }

    var retry = true;
    for (var i = 0; i < testers.length; i++){
        if (!testers[i].damaged || testers[i].speed !=0){
            retry = false;
            break;
        }
    }

    if (retry){
        save();
        console.log("reboot");
        window.location.reload();
    }

    requestAnimationFrame(animate);
}