function toDeg(n){
    return n / Math.PI * 180;
}

function phasengang(r,omega, omega_e){
    let res = r * 90;
    for(let o_e of omega_e){
        res -= toDeg(Math.atan(omega / (Math.pow(o_e,2) - omega * omega)))
    }
    return res;
}

function phasendurchschnittsfrequenz(r,omega_e){
    let first = NaN;

    
    for(let omega = Math.pow(10,-1);omega < 100;omega+=0.1){
        let res = phasengang(r,omega,omega_e);
        console.log(omega,res);
        if(res < -180 && Number.isNaN(first)){
            first = omega;
        }
    }
    return first;
}

console.log(phasendurchschnittsfrequenz(-1, [1,5,10,100]));


