$(document).ready(function () {
    $("#build_labyr").click(function () {
        build_labyrinthe();
        $("#resoudre_dfs").removeAttr('disabled');
    });
    $("#resoudre_dfs").click(function () {
        $(this).attr("disabled","disabled");
        resoudre_dfs();
    });
    $("#stop_execution").click(function () {

    });

})

let myLabyrinthe = [];
let size;




function build_labyrinthe() {
    size = $('#size').val();
    let case_size_px = $("#case_size_px").val();
    let variante = Math.floor(Math.random() * 3);
    let labyrinthe = labyrAll[size]["ex-" + variante];
    myLabyrinthe = set_my_labyrinthe(labyrinthe);
    console.log(size,"ex-" + variante);
    draw_labyrinthe(size, labyrinthe, case_size_px);
}

function set_my_labyrinthe(initialLabyrinthe) {
    let myLabyrinthe = [];
    for (let i = 0; i < initialLabyrinthe.length; i++) {
        let myCase = {
            posX: initialLabyrinthe[i].posX,
            posY: initialLabyrinthe[i].posY,
            mur_haut: initialLabyrinthe[i].walls[0],
            mur_droit: initialLabyrinthe[i].walls[1],
            mur_bas: initialLabyrinthe[i].walls[2],
            mur_gauche: initialLabyrinthe[i].walls[3],
            active: false,
            visited: false,
            dead_end: false,
            arrival: (i === initialLabyrinthe.length - 1)
        }
        myLabyrinthe.push(myCase);
    }
    return myLabyrinthe;
}

function draw_labyrinthe(size, labyrinthe, case_size_px) {
    let cell_number = 0;
    let lastcell_number = size - 1;
    $("#grille tbody tr").remove();
    for (let x = 0; x < size; x++) {
        $("#grille tbody").append('<tr id="row' + x + '"></tr>');
        for (let y = 0; y < size; y++) {
            $("#row" + x).append('<td id="cell' + x + "_" + y + '">x:'+x+', y:'+y+ '</td>');
            $("#cell" + x + "_" + y).addClass("")
            //changer la couleur des bordures:
            if (labyrinthe[cell_number].walls[0]) {
                $("#cell" + x + "_" + y).css('border-top', 'solid red')
            }
            if (labyrinthe[cell_number].walls[1]) {
                $("#cell" + x + "_" + y).css('border-right', 'solid red')
            }
            if (labyrinthe[cell_number].walls[2]) {
                $("#cell" + x + "_" + y).css('border-bottom', 'solid red')
            }
            if (labyrinthe[cell_number].walls[3]) {
                $("#cell" + x + "_" + y).css('border-left', 'solid red')
            }
            cell_number += 1;
        }
    }
    $("#cell0_0").css("background-color", "#FFA500");
    $("#cell" + lastcell_number + "_" + lastcell_number).css("background-color", "#008000");
    $("#grille tbody tr td").width(case_size_px).height(case_size_px);
}

function resoudre_dfs() {
    if ($("#cell0_0").length) {

        let chemin = [];
        let id = 0;
        let isFinished = false;
        let next_id;
        let last_id = -1;
        do {
            let x = myLabyrinthe[id].posX;
            let y = myLabyrinthe[id].posY;
            console.log("x:"+x+"; y:"+y);

            myLabyrinthe[id].active = true;
            myLabyrinthe[id].visited = true;
            change_cell_color(id);
            //setTimeout(function(){change_cell_color(id)},chemin.length*5000);

            if (last_id >= 0) {
                change_cell_color(last_id);
                //setTimeout(function(){change_cell_color(last_id)},chemin.length*5000);
            }
            if (myLabyrinthe[id].arrival) {
                isFinished = true;
                console.log("finished true")
            } else {
                let down_id, droit_id, haut_id, gauche_id = -1;
                if (myLabyrinthe[id].mur_bas === false) {
                    console.log("mur_bas === false")
                    down_id = get_case_id(x+1, y )
                }
                if (myLabyrinthe[id].mur_droit === false) {
                    console.log("mur_droit === false")
                    droit_id = get_case_id(x , y+1);
                }
                if (myLabyrinthe[id].mur_haut === false) {
                    console.log("mur_haut === false")
                   haut_id = get_case_id(x-1, y );
                }
                if (myLabyrinthe[id].mur_gauche === false) {
                    console.log("mur_gauche === false")
                    gauche_id = get_case_id(x, y-1);
                }
                if (down_id > -1 && myLabyrinthe[down_id].visited === false) {
                    next_id = down_id;
                } else if (droit_id > -1 && myLabyrinthe[droit_id].visited === false) {
                    next_id = droit_id;
                } else if (haut_id > -1 && myLabyrinthe[haut_id].visited === false) {
                    next_id = haut_id;
                } else if (gauche_id > -1 && myLabyrinthe[gauche_id].visited === false) {
                    next_id = gauche_id;
                } else {
                    myLabyrinthe[id].dead_end = true;
                    console.log("dead_end");
                    change_cell_color(id);
                   // setTimeout(function(){change_cell_color(id)},chemin.length*5000);
                    next_id = chemin[chemin.length - 1];
                    chemin.pop();
                }
                if (myLabyrinthe[id].dead_end === false) {
                    chemin.push(id);
                }
                myLabyrinthe[id].active = false;
                last_id = id;
                id = next_id;


            }
        } while (isFinished === false);
        console.log("nombre de pas pour résoudre: "+chemin.length);
        //setTimeout(function (){color_escape_path(chemin)},(chemin.length+3)*5000);
        color_escape_path(chemin);
    } else {
        alert("Build the labyrinth first");
    }
}

function get_case_id(x, y) {
    let id = -1;
    let i = 0;
    do {
        let my_case = myLabyrinthe[i];
        if (my_case.posX === x && my_case.posY === y) {
            id = i;
        }
        i += 1;
    } while (id < 0)
    return id;
}

function color_escape_path(chemin) {
    for(let i=1;i<chemin.length;i++) {
        let id=chemin[i];
        let cell = "#cell" + myLabyrinthe[id].posX + "_" + myLabyrinthe[id].posY;
        $(cell).css("background-color", "#5bc0de");
    }
}

function change_cell_color(id) {
        let cell = "#cell" + myLabyrinthe[id].posX + "_" + myLabyrinthe[id].posY;
        if(id!==0 && !myLabyrinthe[id].arrival) {
            if (myLabyrinthe[id].active) {
                $(cell).css("background-color", "blue");
            } else if (myLabyrinthe[id].dead_end) {
                $(cell).css("background-color", "grey");
            } else if (myLabyrinthe[id].visited) {
                $(cell).css("background-color", "mediumpurple");
            }
        }
}
