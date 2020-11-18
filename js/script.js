$(document).ready(function () {
    $("#build_labyr").click(function () {
        build_labyrinthe();
        $("#resoudre_dfs").removeAttr('disabled');
        $("#resoudre_bfs").removeAttr('disabled');
    });
    $("#resoudre_dfs").click(function () {
        if ($("#cell0_0").length) {
            // $(this).attr("disabled", "disabled");
            $("#resoudre_dfs").attr("disabled", "disabled");
            $("#resoudre_bfs").attr("disabled", "disabled");
            resoudre_dfs();
        } else {
            alert("Build the labyrinth first");
        }
    });
    $("#resoudre_bfs").click(function () {
        if ($("#cell0_0").length) {
            $("#resoudre_dfs").attr("disabled", "disabled");
            $("#resoudre_bfs").attr("disabled", "disabled");
            resoudre_bfs();
        } else {
            alert("Build the labyrinth first");
        }
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
    console.log(size, "ex-" + variante);
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
            parent: undefined,
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
            $("#row" + x).append('<td id="cell' + x + "_" + y + '">x:' + x + ', y:' + y + '</td>');
            // $("#row" + x).append('<td id="cell' + x + "_" + y + '"></td>');
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
    let stack = [];
    let chemin=[];
    let id = 0;
    let isFinished = false;
    let last_id = -1;

    let counter = 0;
    do {
        myLabyrinthe[id].active = true;
        myLabyrinthe[id].visited = true;
        stack.push(id);
        change_cell_color(id);
        if (last_id >= 0) {
            change_cell_color(last_id);

        }

        let neighbours = get_neighbours(id);
        //let finish_id = check_arrival(neighbours);

        if (myLabyrinthe[id].arrival) {
            isFinished = true;
            myLabyrinthe[id].parent = last_id;
            console.log("finished true");
            chemin = get_chemin(id);
            console.log("chemin:" + chemin);
        } else {
            let dead_end = false;
            let next_neighbours = get_not_visited(neighbours);
            if (next_neighbours.length > 0) {
                myLabyrinthe[id].parent = last_id;
                last_id = id;
                next_neighbours.forEach(function (id) {
                    stack.push(id);
                })
            } else {
                dead_end = true;
                myLabyrinthe[id].dead_end = true;
                console.log("dead_end");

                stack.pop();
            }
            myLabyrinthe[id].active = false;
            change_cell_color(id);
            id = stack.pop();
        }
        counter += 1;
    } while (isFinished === false);

    console.log("nombre de pas pour résoudre: " + counter);
    color_escape_path(chemin);
}

function get_chemin(finish_id) {
    let id = finish_id;
    let chemin = [];
    do {
        if(!myLabyrinthe[id].dead_end) {
            chemin.push(id);
        }
        id = myLabyrinthe[id].parent;

    } while (id > 0);
    return chemin;
}

function resoudre_bfs() {
    let id = 0;
    let counter = 0;
    /*Debut de la fonction recursive*/
    let arrival = bfs_iterative(id);
    console.log(arrival);
    counter += 1;
    //console.log("nombre de pas pour résoudre: " + counter);

    // color_escape_path(chemin);
}

function bfs_iterative(id, last_id = -1) {
    myLabyrinthe[id].active = true;
    myLabyrinthe[id].visited = true;
    change_cell_color(id);

    if (last_id >= 0) {
        myLabyrinthe[id].parent = last_id;
        change_cell_color(last_id);
    }
    myLabyrinthe[id].active = false;

    if (!myLabyrinthe[id].arrival) {
        let neighbours = get_neighbours(id);
        let next_neighbours = get_not_visited(neighbours);
        if (next_neighbours.length > 0) {
            next_neighbours.forEach(function (id_next_neighbour) {
                let neighbours = bfs_iterative(id_next_neighbour, id);
                return neighbours;
            })
        } else {
            myLabyrinthe[id].dead_end = true;
            console.log("dead_end");
            change_cell_color(id);
            let dead_end = bfs_iterative(last_id, myLabyrinthe[last_id].parent)
            return dead_end;
        }
    } else {
        // console.log("finished true");
        change_cell_color(id);

        return "ceoooo";
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


function get_neighbours(id) {
    let x = myLabyrinthe[id].posX;
    let y = myLabyrinthe[id].posY;
    console.log("x:" + x + "; y:" + y);
    let neighbours = [];
    if (myLabyrinthe[id].mur_gauche === false) {
        //console.log("mur_gauche === false")
        let gauche_id = get_case_id(x, y - 1);
        neighbours.push(gauche_id);
    }
    if (myLabyrinthe[id].mur_haut === false) {
        //console.log("mur_haut === false")
        let haut_id = get_case_id(x - 1, y);
        neighbours.push(haut_id);
    }
    if (myLabyrinthe[id].mur_droit === false) {
        //console.log("mur_droit === false")
        let droit_id = get_case_id(x, y + 1);
        neighbours.push(droit_id);
    }
    if (myLabyrinthe[id].mur_bas === false) {
        //console.log("mur_bas === false")
        let down_id = get_case_id(x + 1, y);
        neighbours.push(down_id);
    }
    return neighbours;
}

function check_arrival(neighbours) {
    //let isFinished = false;
    let finish_id;
    neighbours.forEach(function (id) {
        if (myLabyrinthe[id].arrival) {
            //isFinished = true;
            finish_id = id;
        }
    });
    return finish_id;
}

function get_not_visited(neighbours) {
    let not_visited_neighbours = [];
    neighbours.forEach(function (id) {
        if (!myLabyrinthe[id].visited) {
            not_visited_neighbours.push(id);
        }
    })
    return not_visited_neighbours;
}

function color_escape_path(chemin) {
    for (let i = 1; i < chemin.length; i++) {
        let id = chemin[i];
        let cell = "#cell" + myLabyrinthe[id].posX + "_" + myLabyrinthe[id].posY;
        $(cell).css("background-color", "#5bc0de");
    }
}

function change_cell_color(id) {
    let cell = "#cell" + myLabyrinthe[id].posX + "_" + myLabyrinthe[id].posY;
    if (id !== 0 && !myLabyrinthe[id].arrival) {
        if (myLabyrinthe[id].active) {
            $(cell).css("background-color", "blue");
        } else if (myLabyrinthe[id].dead_end) {
            $(cell).css("background-color", "grey");
        } else if (myLabyrinthe[id].visited) {
            $(cell).css("background-color", "mediumpurple");
        }
    }
}
