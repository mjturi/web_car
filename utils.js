function lerp(A, B, t){
    return (A + (B-A)*t);
}

function get_intersection(A,B,C,D){
    const t_top = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const u_top = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);

    if (bottom != 0){
        const t = t_top/bottom;
        const u = u_top/bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return { x:lerp(A.x, B.x, t), y:lerp(A.y, B.y, t), offset:t }
    }
    return null;
}

function poly_intersect(A,B){
    for (var i = 0; i < A.length; i++){
        for (var j = 0; j < B.length; j++){
            const touch = get_intersection(A[i], A[(i+1)%A.length], B[j], B[(j+1)%B.length]);
            if (touch) return true;
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}