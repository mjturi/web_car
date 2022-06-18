class Controls {
    constructor(control_type){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;

        switch(control_type){
            case "KEYS":
                this.#add_keyboard_listeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }

    #add_keyboard_listeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
            }
            // console.table(this);
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
            }
            // console.table(this);
        }
    }
}