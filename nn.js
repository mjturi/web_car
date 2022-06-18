class NeuralNet {
    constructor(neuron_counts){
        this.levels = [];
        for (var i = 0; i < neuron_counts.length - 1; i++){
            this.levels.push(new Level(neuron_counts[i], neuron_counts[i+1]));
        }
    }

    static feed_forward(given_inputs, network){
        var outputs = Level.feed_forward(given_inputs, network.levels[0]);
        // console.log(outputs);

        for (var i = 1; i < network.levels.length; i++){
            outputs = Level.feed_forward(outputs, network.levels[i]);
        }
        return outputs;
    }

    static mutate(network, amount=1){
        network.levels.forEach(level => {
            for (var i = 0; i < level.biases.length; i++){
                level.biases[i] = lerp(level.biases[i], Math.random()*2-1, amount);
            }
            for (var i = 0; i < level.weights.length; i++){
                for (var j = 0; j < level.weights[i].length; j++){
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random()*2-1, amount);
                }
            }
        });
    }
}
class Level {
    constructor(num_input, num_output){
        this.inputs = new Array(num_input);
        this.outputs = new Array(num_output);
        this.biases = new Array(num_output);

        this.weights = [];
        for (var i = 0; i < num_input; i++){
            this.weights[i] = new Array(num_output);
        }

        Level.#randomize(this);

    }

    static #randomize(level){
        for (var i = 0; i < level.inputs.length; i++){
            for (var j = 0; j < level.outputs.length; j++){
                level.weights[i][j] = Math.random()*2 - 1;
            }
        }

        for (var i = 0; i < level.biases.length; i++){
            level.biases[i] = Math.random()*2-1;
        }
    }

    static feed_forward(given_inputs, level){
        for (var i = 0; i < level.inputs.length; i++){
            level.inputs[i] = given_inputs[i];
        }
        
        for (var i = 0; i < level.outputs.length; i++){
            var sum = 0;
            for (var j = 0; j < level.inputs.length; j++){
                sum += level.inputs[j]*level.weights[j][i];
            }

            if (sum > level.biases[i]) level.outputs[i] = 1;
            else level.outputs[i] = 0;
        }

        return level.outputs;
    }
}