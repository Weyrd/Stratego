var level = [],
    matrix_laststate = [],
    tableSelection,
    list_blocs_inverse = [],
    bloc_linked = {},
    levelPath = "",
     list_blocs = {
        "-3": "end",
        "-2": "start2",
        "-1": "start1",
        "0": "ground",
        "1": "wall",
        "2.1": "switch",
        "2.2": "switchDouble",
        "3": "plate",
        "4": "door",
        "4.5": "doorOpen",
        "5": "teleporter",
        "5.1": "arrival",
        "5.5": "teleporterDouble",
        "6": "iceblock",
        "9": "hole",
        "10": "bumper"
    },
    list_blocs_display = {
        "Ground": "0",
        "Wall": "1",
        "Hole": "9",
        "Door": "4",
        "Switch": "2.1",
        "Pressure Plate": "3",
        "Teleporter": "5",
        "Teleporter Arrival": "5.1",
        "Bumper": "10",
        "Double Teleporter": "5.5",
        "Double Switch": "2.2",
        "Opened Door": "4.5",
        "Ice": "6",
        "Spawn Player 1": "-1",
        "Spawn Player 2": "-2",
        "End": "-3"
    }


function responsiveLevel() {
    if ($(window).width() / $(window).height() * 95 / 80 < level[0].length / level.length) {
        cellSize = 95 / level[0].length
        unit = 'vw'
    }
    else {
        cellSize = 80 / level.length
        unit = 'vh'
    }
    // Creating the grid template
    $("#wrapper").css("grid-template", "repeat(" + level.length + ", " + cellSize + unit + ") / repeat(" + level[0].length + ", " + cellSize + unit + ")")
}

function swapDict(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}



function display_level() {
    $("div[class=line]").remove();
    bloc_linked = {}
    $("#wrapper").empty() 

    for (x = 0; x < level.length; x++) {
        for (y = 0; y < level[0].length; y++) {
            
            classWrapper = "class='" + list_blocs[level[x][y]] + " selectable'"

            if (level[x][y] == -1) $("#wrapper").append("<div id='" + x + "-" + y + "' " + classWrapper + ">P1</div>")
            else if (level[x][y] == -2) $("#wrapper").append("<div id='" + x + "-" + y + "' " + classWrapper + ">P2</div>")

            else {
                if (x == 0 || x == level.length - 1 || y == 0 || y == level[0].length - 1) {
                    $("#wrapper").append("<div id='" + x + "-" + y + "'class='" + list_blocs[level[x][y]] + "'></div>")
                }
                else {
                    $("#wrapper").append("<div id='" + x + "-" + y + "' " + classWrapper + "></div>")
                }
            }
            
        }
    }
    

    //CrÃ©ation de la grille en CSS (grid-template)
    $("#wrapper").css("grid-template", "repeat(" + level.length + ", 60px) / repeat(" + level[0].length + ", 60px)")

    responsiveLevel();
}

function display_blocs() {
    table_bloc = ""
    $.each(list_blocs_display, function(key, value) {
        table_bloc += "<div class='blocType'>"
        table_bloc += "<div title='" + key + "' id='" + list_blocs[value] + "'class='" + list_blocs[value] + "'></div>"
        table_bloc += "</div>"
    });
    $("#divBloc").append(table_bloc)
    $("#divBloc").css("background-color", "white");


    $(".blocType").hover(function() {
        if (!$(this).hasClass("disabled")) $(this).toggleClass("hover")
    })
}

//créer une matrice de taille x,y
function create_matrix(x, y) {
    level = Array(x).fill().map(_ => Array(y).fill(0))
    for (var i = 0; i < x; i++) {
        level[i][0] = 1
        level[i][y - 1] = 1
    }
    for (var i = 0; i < y; i++) {
        level[0][i] = 1
        level[x - 1][i] = 1
    }
    
    level[5][3] = 1
    level[5][4] = 1
    level[6][3] = 1
    level[6][4] = 1

    level[5][7] = 1
    level[5][8] = 1
    level[6][7] = 1
    level[6][8] = 1

    matrix_laststate = level;
    display_level()

}

function change_case(event) {
    matrix_laststate = []
    for (var i = 0; i < level.length; i++) {
        row = [...level[i]]
        matrix_laststate.push(row)
    }
    numberNewBloc = list_blocs_inverse[$(event.target).attr('class')],
        applyChanges = true
    for (i = 0; i < selection.getSelection().length; i++) {
        split = selection.getSelection()[i].id.split(/-/g)
        x = parseInt(split[0]) //Selection de x dans "x-y"
        y = parseInt(split[1]) //Selection de y dans "x-y"
        if (selection.getSelection().length > 1) {
            split = selection.getSelection()[1].id.split(/-/g)
            x2 = parseInt(split[0]) //Selection de x dans "x-y"
            y2 = parseInt(split[1]) //Selection de y dans "x-y"
            if (selection.getSelection().length > 2) {
                split = selection.getSelection()[2].id.split(/-/g)
                x3 = parseInt(split[0]) //Selection de x dans "x-y"
                y3 = parseInt(split[1]) //Selection de y dans "x-y"
            }
        }

        if (applyChanges){ level[x][y] = numberNewBloc } 
    }
    if (applyChanges) {
        selection.clearSelection() //On vide la liste
        checkDisabled()
        display_level()
    }
}

function ctrl_z() {
    if (level != matrix_laststate) {
        level = []
        for (var i = 0; i < matrix_laststate.length; i++) {
            row = [...matrix_laststate[i]]
            level.push(row)
        }
        checkDisabled()
        display_level()
    }
}

function checkDisabled() { // go limiter les pion s
   /* if (selection.getSelection().length != 2) {
        $("#switch").parent().addClass("disabled")
        $("#plate").parent().addClass("disabled")
        $("#teleporter").parent().addClass("disabled")
        $("#teleporterDouble").parent().addClass("disabled")
    }
    else {
        $("#switch").parent().removeClass("disabled")
        $("#plate").parent().removeClass("disabled")
        $("#teleporter").parent().removeClass("disabled")
        $("#teleporterDouble").parent().removeClass("disabled")
    }
    if (selection.getSelection().length != 3) {
        $("#switchDouble").parent().addClass("disabled")
    }
    else {
        $("#switchDouble").parent().removeClass("disabled")
    }*/
}

$(document).ready(function() {
        create_matrix(12, 12)
        startEditor()
})



function startEditor() {

    $("body").css("height", "calc(100vh - 6vw)")

    display_level()
    display_blocs()
    responsiveLevel()

    list_blocs_inverse = swapDict(list_blocs)
    classDisponible = []

    $.each(list_blocs, function(key, value) {
        classDisponible.push(value)
    })

    $("body").click(function(event) {
        if ((/(\d-\d)/.test(event.target.id))) {
            max_x = level.length - 1
            max_y = level[0].length - 1
            click_x = event.target.id.match(/[^-]*/)[0]
            click_y = event.target.id.match(/\-(.*)$/)[0].slice(1)
        }
        else if (classDisponible.includes($(event.target).attr('class'))) {
            change_case(event)
        }
    })

    $(window).resize(function() {
        responsiveLevel();
    })

    $("#back").click(function() {
        ctrl_z();
    })



}
