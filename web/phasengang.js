function toDeg(n){
    return n / Math.PI * 180;
}


function phasengang(r,omega,omega_nst, omega_pol){
    let res = r * 90;
    for(let o_e of omega_nst){
        res += toDeg(Math.atan(omega / o_e))
    }
    for(let o_e of omega_pol){
        res -= toDeg(Math.atan(omega / o_e));
    }
    return res;
}

function phasendurchschnittsfrequenz(r,omega_e_nst,omega_e_pol){
    let first = NaN;

    
    for(let omega = Math.pow(10,-1);omega < 100;omega+=0.01){
        let res = phasengang(r,omega,omega_e_nst,omega_e_pol);
        //console.log(omega,res);
        if(res < -180 && Number.isNaN(first)){
            first = omega;
        }
    }
    return first;
}


function amplitudengang(k,omega, omega_nst,omega_pol){
    let res = 20 * Math.log10(k);
    let omegapow = Math.pow(omega,2);
    for(let o_e of omega_nst){
       res += 10 * Math.log10(Math.pow(o_e,2) + omegapow);
    }
    for(let o_e of omega_pol){
        res -= 10 * Math.log10(Math.pow(o_e,2) + omegapow);
    }
    return res;
}

function gstar(s){
    return ((s+3)*(s+5)) / ((s+10)*(s+100))
}

function adb(w,r){
    return 20 * Math.log(Math.abs(gstar(0)) * Math.pow(w,r))
}

//console.log(adb(3,-1))

let nst = [2];
let pol = [10];
console.log(phasengang(-1,2,nst,pol))
//console.log(amplitudengang(1,3,nst,pol))

//console.log(phasendurchschnittsfrequenz(-1, [5], [1,10,100]));
