$(document).ready(function () {
    $("#build_labyr").click(function () {
        build_labyrinthe()
    })

    function build_labyrinthe() {
        let size = $('#size').val();
        let case_size_px=$("#case_size_px").val();

        //console.log(labyrAll);
        let variante = Math.floor(Math.random() * 3);
       // console.log(variante)
        let labyrinthe=labyrAll[size]["ex-"+variante]
        //console.log(labyrinthe)
        let cell_number=0;
        let lastcell_number=size*size-1;
        $("#grille tbody tr").remove();
        for(let x=0; x<size;x++){
            $("#grille tbody").append('<tr id="row'+x+'"></tr>');
            for (let y=0;y<size;y++){
                $("#row"+x).append('<td id="cell'+cell_number+'"></td>');
                $("#cell"+cell_number).addClass("")
                //changer la couleur des bordures:
                if(labyrinthe[cell_number].walls[0]) {
                    $("#cell"+cell_number).css('border-top','solid red')
                }
                if(labyrinthe[cell_number].walls[1]) {
                    $("#cell"+cell_number).css('border-right','solid red')
                }
                if(labyrinthe[cell_number].walls[2]) {
                    $("#cell"+cell_number).css('border-bottom','solid red')
                }
                if(labyrinthe[cell_number].walls[3]) {
                    $("#cell"+cell_number).css('border-left','solid red')
                }
                cell_number+=1;
            }
        }
        $("#cell0").css("background-color","#FFA500");
        $("#cell"+lastcell_number).css("background-color","#008000");
        $("#grille tbody tr td").width(case_size_px).height(case_size_px);
    }
})

