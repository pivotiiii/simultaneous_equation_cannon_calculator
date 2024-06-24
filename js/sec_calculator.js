window.onload = function() {
    document.getElementById("total_cards").addEventListener("input", validate_total_cards);

    document.getElementById("total_cards").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            document.getElementById("calc_button").click();
        };
    });

    document.getElementById("monster_levels").addEventListener("input", validate_monster_levels);

    document.getElementById("monster_levels").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            document.getElementById("calc_button").click();
        };
    });

    document.getElementById("calc_button").addEventListener("click", function() {
        validate_total_cards();
        validate_monster_levels();
        create_table();
    });

    document.getElementById("show_total").addEventListener("click", toggle_relative_totals);

    if (localStorage.getItem("show_relative_totals")) {
        document.getElementById("show_total").checked = true;
    }
}

function validate_total_cards() {
    document.getElementById("total_cards").value = document.getElementById("total_cards").value.replace(/\D/g,'');
    let val = document.getElementById("total_cards").value;
    if (val < 2 || val > 142 || toString(val).length === 0){
        document.getElementById("total_cards").ariaInvalid = true;
        document.getElementById("total_cards_helper").innerHTML = "Must be a number between 2 and 142.";
    } else {
        document.getElementById("total_cards").ariaInvalid = false;
        document.getElementById("total_cards_helper").innerHTML = "Total cards on board and in hand.";
    }
}

function validate_monster_levels() {
    document.getElementById("monster_levels").value = document.getElementById("monster_levels").value.replace(/(?!,)\D/g,'');
    let vals = document.getElementById("monster_levels").value.split(",").filter(Boolean);
    if (vals.length === 0) {
        document.getElementById("monster_levels").ariaInvalid = true;
    }
    for (const val of vals) {
        if (val < 1){
            document.getElementById("monster_levels").ariaInvalid = true;
            document.getElementById("monster_levels_helper").innerHTML = "Level/Rank cannot be smaller than 1.";
            break;
        } else {
            document.getElementById("monster_levels").ariaInvalid = false;
            document.getElementById("monster_levels_helper").innerHTML = "Levels/Ranks of opponents monsters.";
        }
    }
}

function get_all_combinations() {
    const total_cards = document.getElementById("total_cards").value;
    const monsters_on_field = Array.from(new Set(document.getElementById("monster_levels").value.split(",").filter(Boolean)));
    let valid_combinations = new Array();
    let potential_combinations = new Array();
    for (const level of monsters_on_field) {
        let v_combination = get_combination(level, total_cards);
        if (v_combination.xyz != 0) {
            valid_combinations.push(v_combination);
        }
        for (let cards = 2; cards < 143; cards++){
            let p_combination = get_combination(level, cards);
            if (p_combination.xyz != 0 && p_combination.total_cards != total_cards) {
                potential_combinations.push(p_combination);
            }
        }            
    }
    return new Array(valid_combinations, potential_combinations);
}

function get_combination(level, total_cards) {
    const req_xyz = total_cards - level;
    const req_fusion = level - req_xyz;
    if (req_xyz > 0 && req_xyz < 14 && req_fusion > 0 && req_fusion < 13) {
        return {xyz: req_xyz, fusion: req_fusion, target: level, total_cards: total_cards};
    }
    return {xyz: 0, fusion: 0, target: 0, total_cards: 0};
}



function create_table() {
    if (document.getElementById("total_cards").ariaInvalid === "true" || document.getElementById("monster_levels").ariaInvalid === "true") {
        return;
    }
    const table = document.getElementById("table_card");
    const body_v = document.getElementById("body_valid");
    body_v.innerHTML = "";
    const body_p = document.getElementById("body_potential");
    body_p.innerHTML = "";

    const show_relative_totals = document.getElementById("show_total").checked;

    let bodies = new Array(body_v, body_p);
    let combinations = get_all_combinations();

    if (combinations[0].length > 0 || true) {
        let total = document.getElementById("total_cards").value;
        for (let c = 0; c < combinations[1].length; c++) {
            combinations[1][c].total_cards = combinations[1][c].total_cards - total;//combinations[0][0].total_cards;
        }
        combinations[1].sort(function(left, right) {
            let total_order_abs = Math.abs(left.total_cards) - Math.abs(right.total_cards);
            let total_order =  left.total_cards - right.total_cards;
            let xyz_order = left.xyz - right.xyz;
            return total_order_abs || total_order || xyz_order;
        });
        if (show_relative_totals === false) {
            for (let c = 0; c < combinations[1].length; c++) {
                combinations[1][c].total_cards = parseInt(combinations[1][c].total_cards) + parseInt(total);//parseInt(combinations[0][0].total_cards);
            }
        }
    }

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < combinations[i].length; j++) {
            const tr = bodies[i].insertRow();
            const td1 = tr.insertCell();
            if (i === 1 && combinations[i][j].total_cards > 0 && combinations[0].length > 0 && show_relative_totals == true) {
                td1.innerHTML = "+" + combinations[i][j].total_cards.toString();
            } else {
                td1.innerHTML = combinations[i][j].total_cards;
            }
            //td1.innerHTML = td1.innerHTML + " (" + (parseInt(combinations[0][0].total_cards) + parseInt(combinations[i][j].total_cards)).toString() + ")"

            const td2 = tr.insertCell();
            td2.innerHTML = combinations[i][j].xyz;
            const td3 = tr.insertCell();
            td3.innerHTML = combinations[i][j].fusion;
            const td4 = tr.insertCell();
            td4.innerHTML = combinations[i][j].target;
            td1.style.textAlign = "center";
            td2.style.textAlign = "center";
            td3.style.textAlign = "center";
            td4.style.textAlign = "center";
        }
    }

    if (combinations[0].length > 0) {
        body_v.style.removeProperty("display");
        table.style.removeProperty("display");
    }
    if (combinations[1].length > 0) {
        body_p.style.removeProperty("display");
        table.style.removeProperty("display");
    }
    if (combinations[0].length > 0 && combinations[1].length > 0) {
        document.getElementById("sep").style.removeProperty("display");
        table.style.removeProperty("display");
    }
    
}

function toggle_relative_totals() {
    const show_relative_totals = document.getElementById("show_total").checked;
    localStorage.setItem("show_relative_totals", show_relative_totals);
    create_table();
}