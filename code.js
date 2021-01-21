var nodes, edges, network;
var algorithmType = 1;
var uniqueEdge = 1;
var nodeValues = [];
var edgeValues = [];
const SLEEP_TIME = 3000;

function toJSON(obj) {
    return JSON.stringify(obj, null, 4);
}

function addNode() {
    let nodesFilter = [];
    if (document.getElementById("node-id").value === "") {
        $("#errorMessage").text("Proverite da li ste uneli indetifikaciju cvora");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    if (algorithmType === 3 || algorithmType === 4 || algorithmType === 6) {
        if (document.getElementById("node-value").value === "") {
            $("#errorMessage").text("Proverite da li ste uneli heuristicku vrednost cvora");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
    }
    nodesFilter = nodes.get({
        filter: function(item) {
            return item.id === document.getElementById("node-id").value /*|| item.label == document.getElementById("node-label").value*/ ;
        }
    });
    if (nodesFilter.length > 0) {
        $("#errorMessage").text("Taj cvor vec postoji");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    if (algorithmType === 3 || algorithmType === 4 || algorithmType === 6) {

        if (isNaN(parseFloat(document.getElementById("node-value").value))) {
            $("#errorMessage").text("Heuristicka vrednost cvora mora biti broj");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        nodeValues.push({ id: document.getElementById("node-id").value, value: parseFloat(document.getElementById("node-value").value) });
        if (nodeValues.length === 1) {
            $("#nodes-table thead").append("<tr><th scope=\"col\">Id</th><th scope=\"col\">Heuristic-Value</th></tr>");
        }
        $("#nodes-table tbody").append("<tr id=\"" + nodeValues[nodeValues.length - 1].id + "\"><td>" + nodeValues[nodeValues.length - 1].id + "</td><td>" + nodeValues[nodeValues.length - 1].value + "</td></tr>");
    }
    try {
        nodes.add({
            id: document.getElementById("node-id").value,
            label: document.getElementById("node-id").value, //document.getElementById("node-label").value,
            color: "lightblue"
        });
    } catch (err) {
        alert(err);
    }
}

/*function updateNode() {
    var nodesFilter = [];
    nodesFilter = nodes.get({
        filter: function(item) {
            return item.id == document.getElementById("node-id").value;
        }
    });
    if (nodesFilter.length == 0) {
        alert("Ne postoji taj cvor");
        return;
    }
    nodesFilter = [];
    nodesFilter = nodes.get({
        filter: function(item) {
            return item.id == document.getElementById("node-label").value;
        }
    });
    if (nodesFilter.length > 0) {
        alert("Naziv za taj cvor vec postoji");
        return;
    }

    try {
        nodes.update({
            id: document.getElementById("node-id").value,
            label: document.getElementById("node-label").value
        });
    } catch (err) {
        alert(err);
    }
}*/

function removeNode() {
    let nodesFilter = [];
    if (document.getElementById("node-id").value === "") {
        $("#errorMessage").text("Proverite da li ste uneli indetifikaciju cvora");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    nodesFilter = nodes.get({
        filter: function(item) {
            return item.id === document.getElementById("node-id").value;
        }
    });
    if (nodesFilter.length === 0) {
        $("#errorMessage").text("Taj cvor ne postoji");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    try {
        nodes.remove({
            id: document.getElementById("node-id").value
        });
        let deleteEdges = [];
        deleteEdges = edges.get({
            filter: function(item) {
                return (item.from === document.getElementById("node-id").value || item.to === document.getElementById("node-id").value);
            }
        });
        for (let i = 0; i < deleteEdges.length; i++) {
            edges.remove({ id: deleteEdges[i].id });
        }
        if (algorithmType === 3 || algorithmType === 4 || algorithmType === 6) {
            let filter = [];
            filter = nodeValues.filter((value, index) => value.id !== document.getElementById("node-id").value);
            nodeValues = filter;
            $("#nodes-table tbody #" + document.getElementById("node-id").value).remove();
            if (nodeValues.length === 0) {
                $("#nodes-table thead tr").remove();
            }
            //console.log(nodeValues);
        }
        //console.log(deleteEdges);


    } catch (err) {
        alert(err);
    }
}

function addEdge() {
    var edgesFilter = [];
    if (document.getElementById("edge-from").value === "" || document.getElementById("edge-to").value === "") {
        $("#errorMessage").text("Proverite da li ste uneli sve podatke za granu");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    if (IsNodeThere(document.getElementById("edge-from").value) === false || IsNodeThere(document.getElementById("edge-to").value) === false) {
        $("#errorMessage").text("Proverite da li ste uneli cvorove koji postoje");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    if (document.getElementById("edge-from").value === document.getElementById("edge-to").value) {
        $("#errorMessage").text("Ne moze takva grana");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    if (algorithmType === 5 || algorithmType === 6) {
        if (document.getElementById("edge-value") === "") {
            $("#errorMessage").text("Proverite da li ste uneli heuristicku vrednost grane");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
    }
    edgesFilter = edges.get({
        filter: function(item) {
            return /*item.id == document.getElementById("edge-id").value ||*/ (item.from === document.getElementById("edge-from").value && item.to === document.getElementById("edge-to").value) || (item.from === document.getElementById("edge-to").value && item.to === document.getElementById("edge-from").value);
        }
    });
    if (edgesFilter.length > 0) {
        $("#errorMessage").text("Takva grana vec postoji");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    if (algorithmType === 5 || algorithmType === 6) {
        if (isNaN(parseFloat(document.getElementById("edge-value").value))) {
            $("#errorMessage").text("Heuristicka vrednost grane mora biti broj");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        edgeValues.push({ id: uniqueEdge, from: document.getElementById("edge-from").value, to: document.getElementById("edge-to").value, value: parseFloat(document.getElementById("edge-value").value) });
        if (edgeValues.length === 1) {
            $("#edges-table thead").append("<tr><th scope=\"col\">From</th><th scope=\"col\">To</th><th scope=\"col\">Heuristic-Value</th></tr>");
        }
        $("#edges-table tbody").append("<tr id=\"" + uniqueEdge + "\"><td>" + edgeValues[edgeValues.length - 1].from + "</td><td>" + edgeValues[edgeValues.length - 1].to + "</td><td>" + edgeValues[edgeValues.length - 1].value + "</td></tr>");
    }
    try {
        edges.add({
            id: uniqueEdge++, //ocument.getElementById("edge-id").value,
            from: document.getElementById("edge-from").value,
            to: document.getElementById("edge-to").value,
            color: "blue"
        });
    } catch (err) {
        alert(err);
    }
}

/*function updateEdge() {
    var edgesFilter = [];
    edgesFilter = edges.get({
        filter: function(item) {
            return item.id == document.getElementById("edge-id").value;
        }
    });
    if (edgesFilter.length == 0) {
        alert("Ne postoji ta grana");
        return;
    }
    edgesFilter = [];
    var edgesFilter = edges.get({
        filter: function(item) {
            return (item.from == document.getElementById("edge-from").value && item.to == document.getElementById("edge-to").value) || (item.from == document.getElementById("edge-to").value && item.to == document.getElementById("edge-from").value);
        }
    });
    if (edgesFilter > 0) {
        alert("Vec postoji ta grana");
        return;
    }
    try {
        edges.update({
            id: document.getElementById("edge-id").value,
            from: document.getElementById("edge-from").value,
            to: document.getElementById("edge-to").value
        });
    } catch (err) {
        alert(err);
    }
}*/

function removeEdge() {
    var edgesFilter = [];
    if (document.getElementById("edge-from").value === "" || document.getElementById("edge-to").value === "") {
        $("#errorMessage").text("Proverite da li ste uneli sve podatke za granu");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    edgesFilter = edges.get({
        filter: function(item) {
            return (item.from === document.getElementById("edge-from").value && item.to === document.getElementById("edge-to").value) || (item.from === document.getElementById("edge-to").value && item.to === document.getElementById("edge-from").value) //item.id == document.getElementById("edge-id").value;
        }
    });
    if (edgesFilter.length === 0) {
        $("#errorMessage").text("Proverite da li takva grana postoji");
        $("#errorModal").modal({
            keyboard: false,
            backdrop: 'static'
        });
        return;
    }
    if (algorithmType === 5 || algorithmType === 6) {
        let filter = [];
        filter = edgeValues.filter((value, index) => value.id !== edgesFilter[0].id);
        edgeValues = filter;
        $("#edges-table tbody #" + edgesFilter[0].id).remove();
        if (edgeValues.length === 0) {
            $("#edges-table thead tr").remove();
        }
    }
    try {
        edges.remove({
            id: edgesFilter[0].id
        });
    } catch (err) {
        alert(err);
    }
}



function draw() {
    // create an array with nodes
    nodes = new vis.DataSet();
    /*nodes.on("*", function() {
        document.getElementById("nodes").innerHTML = JSON.stringify(
            nodes.get(),
            null,
            4
        );
    });*/
    nodes.add([{
        id: "S",
        label: "S",
        color: "lightblue"
    }, {
        id: "A",
        label: "A",
        color: "lightblue"
    }, {
        id: "B",
        label: "B",
        color: "lightblue"
    }, {
        id: "C",
        label: "C",
        color: "lightblue"
    }, {
        id: "D",
        label: "D",
        color: "lightblue"
    }, {
        id: "E",
        label: "E",
        color: "lightblue"
    }, {
        id: "F",
        label: "F",
        color: "lightblue"
    }, {
        id: "G",
        label: "G",
        color: "lightblue"
    }]);


    edges = new vis.DataSet();
    /*edges.on("*", function() {
        document.getElementById("edges").innerHTML = JSON.stringify(
            edges.get(),
            null,
            4
        );
    });*/
    edges.add([{
        id: uniqueEdge++, //"1",
        from: "S",
        to: "A",
        color: "blue"
    }, {
        id: uniqueEdge++, //"2",
        from: "S",
        to: "D",
        color: "blue"
    }, {
        id: uniqueEdge++, //"3",
        from: "A",
        to: "B",
        color: "blue"
    }, {
        id: uniqueEdge++, //"4",
        from: "A",
        to: "D",
        color: "blue"
    }, {
        id: uniqueEdge++, //"5",
        from: "D",
        to: "B",
        color: "blue"
    }, {
        id: uniqueEdge++, //"6",
        from: "B",
        to: "C",
        color: "blue"
    }, {
        id: uniqueEdge++, //"7",
        from: "D",
        to: "E",
        color: "blue"
    }, {
        id: uniqueEdge++, //"8",
        from: "E",
        to: "F",
        color: "blue"
    }, {
        id: uniqueEdge++, //"9",
        from: "F",
        to: "G",
        color: "blue"
    }]);

    if (algorithmType === 3 || algorithmType === 4 || algorithmType === 6) {
        nodeValues.push({ id: "S", value: 11.5 });
        nodeValues.push({ id: "A", value: 10.3 });
        nodeValues.push({ id: "B", value: 6.7 });
        nodeValues.push({ id: "C", value: 7.0 });
        nodeValues.push({ id: "D", value: 8.9 });
        nodeValues.push({ id: "E", value: 6.9 });
        nodeValues.push({ id: "F", value: 3.0 });
        nodeValues.push({ id: "G", value: 0 });
        $("#nodes-table thead").append("<tr><th scope=\"col\">Id</th><th scope=\"col\">Heuristic-Value</th></tr>");
        $("#nodes-table tbody").append("<tr id=\"" + nodeValues[0].id + "\"><td>" + nodeValues[0].id + "</td><td>" + nodeValues[0].value + "</td></tr>");
        for (let i = 1; i < nodeValues.length; i++) {
            $("#nodes-table tbody").append("<tr id=\"" + nodeValues[i].id + "\"><td>" + nodeValues[i].id + "</td><td>" + nodeValues[i].value + "</td></tr>");
        }
    }
    if (algorithmType === 5 || algorithmType === 6) {
        edgeValues.push({ id: 1, from: "S", to: "A", value: 3 });
        edgeValues.push({ id: 2, from: "S", to: "D", value: 10 });
        edgeValues.push({ id: 3, from: "A", to: "B", value: 4 });
        edgeValues.push({ id: 4, from: "A", to: "D", value: 5 });
        edgeValues.push({ id: 5, from: "D", to: "B", value: 6 });
        edgeValues.push({ id: 6, from: "B", to: "C", value: 2 });
        edgeValues.push({ id: 7, from: "D", to: "E", value: 2 });
        edgeValues.push({ id: 8, from: "E", to: "F", value: 4 });
        edgeValues.push({ id: 9, from: "F", to: "G", value: 3 });


        $("#edges-table thead").append("<tr><th scope=\"col\">From</th><th scope=\"col\">To</th><th scope=\"col\">Heuristic-Value</th></tr>");
        $("#edges-table tbody").append("<tr id=\"" + edgeValues[0].id + "\"><td>" + edgeValues[0].from + "</td><td>" + edgeValues[0].to + "</td><td>" + edgeValues[0].value + "</td></tr>");
        for (let i = 1; i < edgeValues.length; i++) {
            $("#edges-table tbody").append("<tr id=\"" + edgeValues[i].id + "\"><td>" + edgeValues[i].from + "</td><td>" + edgeValues[i].to + "</td><td>" + edgeValues[i].value + "</td></tr>");
        }
    }
    var container = document.getElementById("mynetwork");
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = { nodes: { physics: false }, edges: { physics: true } };
    network = new vis.Network(container, data, options);
}

window.addEventListener("load", () => {
    //draw();
    //$("#myModal").modal("show");
    $("#myModal").modal({
        keyboard: false,
        backdrop: 'static'
    });

});

function choosingAlgorithm() {
    var chooise = document.getElementById("control-select").value;
    algorithmType = parseInt(chooise);
    if (algorithmType === 1 || algorithmType === 2) {
        document.getElementById("node-block").style.display = "none";
        document.getElementById("edge-block").style.display = "none";
    } else if (algorithmType === 3 || algorithmType === 4) {
        document.getElementById("node-block").style.display = "block";
        document.getElementById("edge-block").style.display = "none";
    } else if (algorithmType === 5) {
        document.getElementById("node-block").style.display = "none";
        document.getElementById("edge-block").style.display = "block";
    } else {
        document.getElementById("node-block").style.display = "block";
        document.getElementById("edge-block").style.display = "block";
    }
    switch (algorithmType) {
        case 1:
            $("#title-algorithm").text("Breadh First Algorithm");
            break;
        case 2:
            $("#title-algorithm").text("Deapth First Algorithm");
            break;
        case 3:
            $("#title-algorithm").text("Hill Climbing Algorithm");

            break;
        case 4:
            $("#title-algorithm").text("First Best Algorithm");

            break;
        case 5:
            $("#title-algorithm").text("Branch And Bound Algorithm");

            break;
        case 6:
            $("#title-algorithm").text("A* Algorithm");
            break;
        default:
            $("#title-algorithm").text("Breadh First Algorithm");

    }
    $("#myModal").modal("hide");
    draw();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function IsNodeThere(id) {
    let nodesFilter = [];
    nodesFilter = nodes.get({
        filter: function(item) {
            return item.id === id;
        }
    });
    if (nodesFilter.length === 0) {
        return false;
    }
    return true;
}

function GetNodeHeuristicValue(nodeId) {
    for (let i = 0; i < nodeValues.length; i++) {
        if (nodeValues[i].id === nodeId) {
            return nodeValues[i].value;
        }
    }
    return null;
}

function GetEdgeHeuristicValue(edgeId) {
    for (let i = 0; i < edgeValues.length; i++) {
        if (edgeValues[i].id === edgeId) {
            return edgeValues[i].value;
        }
    }
    return null;
}


function startAlgorithm() {
    if (algorithmType === 1) {
        startBreadthFirstAlgorithm();
    } else if (algorithmType === 2) {
        startDeapthFirstAlgorithm();
    } else if (algorithmType === 3) {
        startHillClimbingAlgorithm();
    } else if (algorithmType === 4) {
        startFirstBestAlgorithm();
    } else if (algorithmType === 5) {
        startBranchAndBound();
    } else if (algorithmType === 6) {
        startAstar();
    }
}
async function startBreadthFirstAlgorithm() {
    try {
        let start = document.getElementById("start").value;
        let finish = document.getElementById("finish").value;
        if (start === "" || finish === "") {
            $("#errorMessage").text("Proverite da li ste uneli pocetni i krajni cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        if (IsNodeThere(start) === false || IsNodeThere(finish) === false) {
            $("#errorMessage").text("Proverite da li postoje pocetni i krajnji cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        clearGraph();
        disbaleButtons(true);
        nodes.update({ id: start, color: "#FBFF00" });
        nodes.update({ id: finish, color: "#FFD600" });
        let ids = edges.getIds();
        for (let i = 0; i < ids.length; i++) {
            edges.update({ id: ids[i], color: "blue" });
        }
        $("#table-summary thead").empty();
        $("#table-summary tbody").empty();
        $("#table-summary thead").append("<tr><th>Current Path</th><th>Queue</th></tr>");

        let current = { id: start };
        let path = [];
        path.push(current);
        let queue = [];
        queue.push(path);

        while (true) {
            if (queue.length === 0) {
                $("#errorMessage").text("Ne moze se naci put izmedju izabranih cvorova(Graf je sigurno nepovezan)");
                $("#errorModal").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                return;
            }
            let firstPath = queue.shift();

            let textFull = "<tr>";
            let textCurrent = "<td>";
            for (let i = 0; i < firstPath.length - 1; i++) {
                textCurrent += "" + firstPath[i].id + "-->";
            }
            textCurrent += firstPath[firstPath.length - 1].id;
            textCurrent += "</td>";
            textFull += textCurrent;


            console.log("BEGIN");
            for (let i = 0; i < firstPath.length; i++) {
                console.log(firstPath[i].id);
            }
            console.log("END");
            let lastNode = firstPath[firstPath.length - 1];
            if (lastNode.id !== start) {
                ids = edges.getIds();
                for (let i = 0; i < ids.length; i++) {
                    edges.update({ id: ids[i], color: "blue" });
                }
                for (let i = 0; i < firstPath.length - 1; i++) {
                    let X = firstPath[i];
                    let Y = firstPath[i + 1];
                    let items = [];
                    items = edges.get({
                        filter: function(item) {
                            return (item.from === X.id && item.to === Y.id) || (item.from === Y.id && item.to === X.id);
                        }
                    });
                    edges.update({ id: items[0].id, color: "red" });
                }
                await sleep(SLEEP_TIME);
            }
            if (lastNode.id === finish) {
                break;
            }
            let neighborsCandidates = [];
            let edgesFilter = edges.get({
                filter: function(item) {
                    return item.from === lastNode.id || item.to === lastNode.id;
                }
            });
            for (let i = 0; i < edgesFilter.length; i++) {
                if (edgesFilter[i].from === lastNode.id) {
                    neighborsCandidates.push(edgesFilter[i].to);
                } else {
                    neighborsCandidates.push(edgesFilter[i].from);
                }
            }
            let neighbors = [];
            for (let i = 0; i < neighborsCandidates.length; i++) {
                let found = false;
                for (let j = 0; j < firstPath.length - 1; j++) {
                    if (neighborsCandidates[i] === firstPath[j].id) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    neighbors.push(neighborsCandidates[i]);
                }
            }
            for (let i = 0; i < neighbors.length; i++) {
                let newPath = [...firstPath, { id: neighbors[i] }];
                queue.push(newPath);
            }
            let textQueue = "<td>"
            textQueue += "<ul>";
            for (let i = 0; i < queue.length; i++) {
                textQueue += "<li>";
                let pomElement = queue[i];
                for (let j = 0; j < pomElement.length - 1; j++) {
                    textQueue += pomElement[j].id;
                    textQueue += "-->";
                }
                textQueue += pomElement[pomElement.length - 1].id;
                textQueue += "</li>";
            }
            textQueue += "</ul>";
            textQueue += "</td>";
            textFull += textQueue;
            textFull += "</tr>";
            $("#table-summary tbody").append(textFull);

        }
        disbaleButtons(false);
        console.log("FINISHED BreadhFirstAlgorithm");
    } catch (err) {
        console.log(err);
    }
}
async function startDeapthFirstAlgorithm() {
    try {
        let start = document.getElementById("start").value;
        let finish = document.getElementById("finish").value;
        if (start === "" || finish === "") {
            $("#errorMessage").text("Proverite da li ste uneli pocetni i krajni cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        if (IsNodeThere(start) === false || IsNodeThere(finish) === false) {
            $("#errorMessage").text("Proverite da li postoje pocetni i krajnji cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        clearGraph();
        disbaleButtons(true);
        nodes.update({ id: start, color: "#FBFF00" });
        nodes.update({ id: finish, color: "#FFD600" });
        let ids = edges.getIds();
        for (let i = 0; i < ids.length; i++) {
            edges.update({ id: ids[i], color: "blue" });
        }
        $("#table-summary thead").empty();
        $("#table-summary tbody").empty();
        $("#table-summary thead").append("<tr><th>Current Path</th><th>Queue</th></tr>");

        let current = { id: start };
        let path = [];
        path.push(current);
        let queue = [];
        queue.unshift(path);

        while (true) {
            if (queue.length === 0) {
                $("#errorMessage").text("Ne moze se naci put izmedju izabranih cvorova(Graf je sigurno nepovezan)");
                $("#errorModal").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                return;
            }
            let firstPath = queue.shift();

            let textFull = "<tr>";
            let textCurrent = "<td>";
            for (let i = 0; i < firstPath.length - 1; i++) {
                textCurrent += "" + firstPath[i].id + "-->";
            }
            textCurrent += firstPath[firstPath.length - 1].id;
            textCurrent += "</td>";
            textFull += textCurrent;


            console.log("BEGIN");
            for (let i = 0; i < firstPath.length; i++) {
                console.log(firstPath[i].id);
            }
            console.log("END");
            let lastNode = firstPath[firstPath.length - 1];
            if (lastNode.id !== start) {
                ids = edges.getIds();
                for (let i = 0; i < ids.length; i++) {
                    edges.update({ id: ids[i], color: "blue" });
                }
                for (let i = 0; i < firstPath.length - 1; i++) {
                    let X = firstPath[i];
                    let Y = firstPath[i + 1];
                    let items = [];
                    items = edges.get({
                        filter: function(item) {
                            return (item.from === X.id && item.to === Y.id) || (item.from === Y.id && item.to === X.id);
                        }
                    });
                    edges.update({ id: items[0].id, color: "red" });
                }
                await sleep(SLEEP_TIME);
            }
            if (lastNode.id === finish) {
                break;
            }
            let neighborsCandidates = [];
            let edgesFilter = edges.get({
                filter: function(item) {
                    return item.from === lastNode.id || item.to === lastNode.id;
                }
            });
            for (let i = 0; i < edgesFilter.length; i++) {
                if (edgesFilter[i].from === lastNode.id) {
                    neighborsCandidates.push(edgesFilter[i].to);
                } else {
                    neighborsCandidates.push(edgesFilter[i].from);
                }
            }
            let neighbors = [];
            for (let i = 0; i < neighborsCandidates.length; i++) {
                let found = false;
                for (let j = 0; j < firstPath.length - 1; j++) {
                    if (neighborsCandidates[i] === firstPath[j].id) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    neighbors.push(neighborsCandidates[i]);
                }
            }
            for (let i = 0; i < neighbors.length; i++) {
                let newPath = [...firstPath, { id: neighbors[i] }];
                console.log(newPath);
                queue.unshift(newPath);
            }
            let textQueue = "<td>"
            textQueue += "<ul>";
            for (let i = 0; i < queue.length; i++) {
                textQueue += "<li>";
                let pomElement = queue[i];
                for (let j = 0; j < pomElement.length - 1; j++) {
                    textQueue += pomElement[j].id;
                    textQueue += "-->";
                }
                textQueue += pomElement[pomElement.length - 1].id;
                textQueue += "</li>";
            }
            textQueue += "</ul>";
            textQueue += "</td>";
            textFull += textQueue;
            textFull += "</tr>";
            $("#table-summary tbody").append(textFull);

        }
        disbaleButtons(false);
        console.log("FINISHED DeapthFirstAlgorithm");
    } catch (err) {
        console.log(err);
    }


}

async function startHillClimbingAlgorithm() {
    try {
        let start = document.getElementById("start").value;
        let finish = document.getElementById("finish").value;
        if (start === "" || finish === "") {
            $("#errorMessage").text("Proverite da li ste uneli pocetni i krajni cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        if (IsNodeThere(start) === false || IsNodeThere(finish) === false) {
            $("#errorMessage").text("Proverite da li postoje pocetni i krajnji cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        clearGraph();
        disbaleButtons(true);
        nodes.update({ id: start, color: "#FBFF00" });
        nodes.update({ id: finish, color: "#FFD600" });
        let ids = edges.getIds();
        for (let i = 0; i < ids.length; i++) {
            edges.update({ id: ids[i], color: "blue" });
        }
        $("#table-summary thead").empty();
        $("#table-summary tbody").empty();
        $("#table-summary thead").append("<tr><th>Current Path</th><th>Queue</th></tr>");

        let current = { id: start };
        let path = [];
        path.push(current);
        let queue = [];
        queue.push(path);

        while (true) {
            if (queue.length === 0) {
                $("#errorMessage").text("Ne moze se naci put izmedju izabranih cvorova(Graf je sigurno nepovezan)");
                $("#errorModal").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                return;
            }
            let firstPath = queue.shift();

            let textFull = "<tr>";
            let textCurrent = "<td>";
            for (let i = 0; i < firstPath.length - 1; i++) {
                textCurrent += "" + firstPath[i].id + "-->";
            }
            textCurrent += firstPath[firstPath.length - 1].id;
            textCurrent += "</td>";
            textFull += textCurrent;

            console.log("BEGIN");
            for (let i = 0; i < firstPath.length; i++) {
                console.log(firstPath[i].id);
            }
            console.log("END");
            let lastNode = firstPath[firstPath.length - 1];
            if (lastNode.id !== start) {
                ids = edges.getIds();
                for (let i = 0; i < ids.length; i++) {
                    edges.update({ id: ids[i], color: "blue" });
                }
                for (let i = 0; i < firstPath.length - 1; i++) {
                    let X = firstPath[i];
                    let Y = firstPath[i + 1];
                    let items = [];
                    items = edges.get({
                        filter: function(item) {
                            return (item.from === X.id && item.to === Y.id) || (item.from === Y.id && item.to === X.id);
                        }
                    });
                    edges.update({ id: items[0].id, color: "red" });
                }
                await sleep(SLEEP_TIME);
            }
            if (lastNode.id === finish) {
                break;
            }
            let neighborsCandidates = [];
            let edgesFilter = edges.get({
                filter: function(item) {
                    return item.from === lastNode.id || item.to === lastNode.id;
                }
            });
            for (let i = 0; i < edgesFilter.length; i++) {
                if (edgesFilter[i].from === lastNode.id) {
                    neighborsCandidates.push(edgesFilter[i].to);
                } else {
                    neighborsCandidates.push(edgesFilter[i].from);
                }
            }
            let neighbors = [];
            for (let i = 0; i < neighborsCandidates.length; i++) {
                let found = false;
                for (let j = 0; j < firstPath.length - 1; j++) {
                    if (neighborsCandidates[i] === firstPath[j].id) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    neighbors.push({
                        id: neighborsCandidates[i],
                        value: GetNodeHeuristicValue(neighborsCandidates[i])
                    });
                }
            }
            neighbors.sort((a, b) => a.value < b.value ? 1 : a.value > b.value ? -1 : 0);
            for (let i = 0; i < neighbors.length; i++) {
                let newPath = [...firstPath, { id: neighbors[i].id }];
                queue.unshift(newPath);
            }
            let textQueue = "<td>"
            textQueue += "<ul>";
            for (let i = 0; i < queue.length; i++) {
                textQueue += "<li>";
                let pomElement = queue[i];
                for (let j = 0; j < pomElement.length - 1; j++) {
                    textQueue += pomElement[j].id;
                    textQueue += "-->";
                }
                textQueue += pomElement[pomElement.length - 1].id + "  value: " + pomElement[pomElement.length - 1].id + " = " + GetNodeHeuristicValue(pomElement[pomElement.length - 1].id);
                textQueue += "</li>";
            }
            textQueue += "</ul>";
            textQueue += "</td>";
            textFull += textQueue;
            textFull += "</tr>";
            $("#table-summary tbody").append(textFull);

        }
        disbaleButtons(false);
        console.log("FINISHED HillClimbingAlgorithm");
    } catch (err) {
        console.log(err);
    }
}
async function startFirstBestAlgorithm() {
    try {
        let start = document.getElementById("start").value;
        let finish = document.getElementById("finish").value;
        if (start === "" || finish === "") {
            $("#errorMessage").text("Proverite da li ste uneli pocetni i krajni cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        if (IsNodeThere(start) === false || IsNodeThere(finish) === false) {
            $("#errorMessage").text("Proverite da li postoje pocetni i krajnji cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        clearGraph();
        disbaleButtons(true);
        nodes.update({ id: start, color: "#FBFF00" });
        nodes.update({ id: finish, color: "#FFD600" });
        let ids = edges.getIds();
        for (let i = 0; i < ids.length; i++) {
            edges.update({ id: ids[i], color: "blue" });
        }
        $("#table-summary thead").empty();
        $("#table-summary tbody").empty();
        $("#table-summary thead").append("<tr><th>Current Path</th><th>Queue</th></tr>");

        let current = { id: start, value: GetNodeHeuristicValue(start) };
        let path = [];
        path.push(current);
        let queue = [];
        queue.push(path);

        while (true) {
            if (queue.length === 0) {
                $("#errorMessage").text("Ne moze se naci put izmedju izabranih cvorova(Graf je sigurno nepovezan)");
                $("#errorModal").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                return;
            }
            let firstPath = queue.shift();

            let textFull = "<tr>";
            let textCurrent = "<td>";
            for (let i = 0; i < firstPath.length - 1; i++) {
                textCurrent += "" + firstPath[i].id + "-->";
            }
            textCurrent += firstPath[firstPath.length - 1].id;
            textCurrent += "</td>";
            textFull += textCurrent;

            console.log("BEGIN");
            for (let i = 0; i < firstPath.length; i++) {
                console.log(firstPath[i].id);
            }
            console.log("END");
            let lastNode = firstPath[firstPath.length - 1];
            if (lastNode.id !== start) {
                ids = edges.getIds();
                for (let i = 0; i < ids.length; i++) {
                    edges.update({ id: ids[i], color: "blue" });
                }
                for (let i = 0; i < firstPath.length - 1; i++) {
                    let X = firstPath[i];
                    let Y = firstPath[i + 1];
                    let items = [];
                    items = edges.get({
                        filter: function(item) {
                            return (item.from === X.id && item.to === Y.id) || (item.from === Y.id && item.to === X.id);
                        }
                    });
                    edges.update({ id: items[0].id, color: "red" });
                }
                await sleep(SLEEP_TIME);
            }
            if (lastNode.id === finish) {
                break;
            }
            let neighborsCandidates = [];
            let edgesFilter = edges.get({
                filter: function(item) {
                    return item.from === lastNode.id || item.to === lastNode.id;
                }
            });
            for (let i = 0; i < edgesFilter.length; i++) {
                if (edgesFilter[i].from === lastNode.id) {
                    neighborsCandidates.push(edgesFilter[i].to);
                } else {
                    neighborsCandidates.push(edgesFilter[i].from);
                }
            }
            let neighbors = [];
            for (let i = 0; i < neighborsCandidates.length; i++) {
                let found = false;
                for (let j = 0; j < firstPath.length - 1; j++) {
                    if (neighborsCandidates[i] === firstPath[j].id) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    neighbors.push({
                        id: neighborsCandidates[i],
                        value: GetNodeHeuristicValue(neighborsCandidates[i])
                    });
                }
            }
            //neighbors.sort((a, b) => a.value < b.value ? 1 : a.value > b.value ? -1 : 0);
            for (let i = 0; i < neighbors.length; i++) {
                let newPath = [...firstPath, neighbors[i]];
                queue.push(newPath);
            }
            queue.sort((a, b) => a[a.length - 1].value > b[b.length - 1].value ? 1 : a[a.length - 1].value < b[b.length - 1].value ? -1 : 0);

            let textQueue = "<td>"
            textQueue += "<ul>";
            for (let i = 0; i < queue.length; i++) {
                textQueue += "<li>";
                let pomElement = queue[i];
                for (let j = 0; j < pomElement.length - 1; j++) {
                    textQueue += pomElement[j].id;
                    textQueue += "-->";
                }
                textQueue += pomElement[pomElement.length - 1].id + " value: " + pomElement[pomElement.length - 1].id + " = " + pomElement[pomElement.length - 1].value;
                textQueue += "</li>";
            }
            textQueue += "</ul>";
            textQueue += "</td>";
            textFull += textQueue;
            textFull += "</tr>";
            $("#table-summary tbody").append(textFull);
        }
        disbaleButtons(false);
        console.log("FINISHED FirstBestAlgorithm");
    } catch (err) {
        console.log(err);
    }
}
async function startBranchAndBound() {
    try {
        let start = document.getElementById("start").value;
        let finish = document.getElementById("finish").value;
        if (start === "" || finish === "") {
            $("#errorMessage").text("Proverite da li ste uneli pocetni i krajni cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        if (IsNodeThere(start) === false || IsNodeThere(finish) === false) {
            $("#errorMessage").text("Proverite da li postoje pocetni i krajnji cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        clearGraph();
        disbaleButtons(true);
        nodes.update({ id: start, color: "#FBFF00" });
        nodes.update({ id: finish, color: "#FFD600" });
        let ids = edges.getIds();
        for (let i = 0; i < ids.length; i++) {
            edges.update({ id: ids[i], color: "blue" });
        }
        $("#table-summary thead").empty();
        $("#table-summary tbody").empty();
        $("#table-summary thead").append("<tr><th>Current Path</th><th>Queue</th></tr>");

        let current = { id: start };
        let path = [];
        path.push(current);
        let queue = [];
        queue.push({ pathLine: path, costLine: 0 });

        while (true) {
            if (queue.length === 0) {
                $("#errorMessage").text("Ne moze se naci put izmedju izabranih cvorova(Graf je sigurno nepovezan)");
                $("#errorModal").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                return;
            }
            let element = queue.shift();
            let firstPath = element.pathLine;
            let cost = element.costLine;

            let textFull = "<tr>";
            let textCurrent = "<td>";
            for (let i = 0; i < firstPath.length - 1; i++) {
                textCurrent += "" + firstPath[i].id + "-->";
            }
            textCurrent += firstPath[firstPath.length - 1].id;
            textCurrent += "</td>";
            textFull += textCurrent;

            console.log("BEGIN");
            for (let i = 0; i < firstPath.length; i++) {
                console.log(firstPath[i].id);
            }
            console.log("END");
            let lastNode = firstPath[firstPath.length - 1];
            if (lastNode.id !== start) {
                ids = edges.getIds();
                for (let i = 0; i < ids.length; i++) {
                    edges.update({ id: ids[i], color: "blue" });
                }
                for (let i = 0; i < firstPath.length - 1; i++) {
                    let X = firstPath[i];
                    let Y = firstPath[i + 1];
                    let items = [];
                    items = edges.get({
                        filter: function(item) {
                            return (item.from === X.id && item.to === Y.id) || (item.from === Y.id && item.to === X.id);
                        }
                    });
                    edges.update({ id: items[0].id, color: "red" });
                }
                await sleep(SLEEP_TIME);
            }
            if (lastNode.id === finish) {
                break;
            }
            let neighborsCandidates = [];
            let edgesFilter = edges.get({
                filter: function(item) {
                    return item.from === lastNode.id || item.to === lastNode.id;
                }
            });
            for (let i = 0; i < edgesFilter.length; i++) {
                if (edgesFilter[i].from === lastNode.id) {
                    neighborsCandidates.push({ edgeId: edgesFilter[i].id, nodeId: edgesFilter[i].to });
                } else {
                    neighborsCandidates.push({ edgeId: edgesFilter[i].id, nodeId: edgesFilter[i].from });
                }
            }
            let neighbors = [];
            for (let i = 0; i < neighborsCandidates.length; i++) {
                let found = false;
                for (let j = 0; j < firstPath.length - 1; j++) {
                    if (neighborsCandidates[i].nodeId === firstPath[j].id) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    neighbors.push({
                        id: neighborsCandidates[i].nodeId,
                        value: GetEdgeHeuristicValue(neighborsCandidates[i].edgeId)
                    });
                }
            }
            //neighbors.sort((a, b) => a.value < b.value ? 1 : a.value > b.value ? -1 : 0);
            for (let i = 0; i < neighbors.length; i++) {
                let newPath = [...firstPath, { id: neighbors[i].id }];
                queue.push({
                    pathLine: newPath,
                    costLine: (cost + neighbors[i].value)
                });
            }
            queue.sort((a, b) => a.costLine > b.costLine ? 1 : a.costLine < b.costLine ? -1 : 0);

            let textQueue = "<td>"
            textQueue += "<ul>";
            for (let i = 0; i < queue.length; i++) {
                textQueue += "<li>";
                let pomElement = queue[i].pathLine;
                for (let j = 0; j < pomElement.length - 1; j++) {
                    textQueue += pomElement[j].id;
                    textQueue += "-->";
                }
                textQueue += pomElement[pomElement.length - 1].id + " cost: " + queue[i].costLine;
                textQueue += "</li>";
            }
            textQueue += "</ul>";
            textQueue += "</td>";
            textFull += textQueue;
            textFull += "</tr>";
            $("#table-summary tbody").append(textFull);
        }
        disbaleButtons(false);
        console.log("FINISHED BranchAndBoundAlgorithm");
    } catch (err) {
        console.log(err);
    }
}

async function startAstar() {
    try {
        let start = document.getElementById("start").value;
        let finish = document.getElementById("finish").value;
        if (start === "" || finish === "") {
            $("#errorMessage").text("Proverite da li ste uneli pocetni i krajni cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        if (IsNodeThere(start) === false || IsNodeThere(finish) === false) {
            $("#errorMessage").text("Proverite da li postoje pocetni i krajnji cvor");
            $("#errorModal").modal({
                keyboard: false,
                backdrop: 'static'
            });
            return;
        }
        clearGraph();
        disbaleButtons(true);
        nodes.update({ id: start, color: "#FBFF00" });
        nodes.update({ id: finish, color: "#FFD600" });
        let ids = edges.getIds();
        for (let i = 0; i < ids.length; i++) {
            edges.update({ id: ids[i], color: "blue" });
        }
        $("#table-summary thead").empty();
        $("#table-summary tbody").empty();
        $("#table-summary thead").append("<tr><th>Current Path</th><th>Queue</th></tr>");

        let current = { id: start };
        let path = [];
        path.push(current);
        let queue = [];
        queue.push({ pathLine: path, costLine: 0, costLastNode: GetNodeHeuristicValue(start) });

        while (true) {
            if (queue.length === 0) {
                $("#errorMessage").text("Ne moze se naci put izmedju izabranih cvorova(Graf je sigurno nepovezan)");
                $("#errorModal").modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                return;
            }
            let element = queue.shift();
            let firstPath = element.pathLine;
            let cost = element.costLine;

            let textFull = "<tr>";
            let textCurrent = "<td>";
            for (let i = 0; i < firstPath.length - 1; i++) {
                textCurrent += "" + firstPath[i].id + "-->";
            }
            textCurrent += firstPath[firstPath.length - 1].id;
            textCurrent += "</td>";
            textFull += textCurrent;

            console.log("BEGIN");
            for (let i = 0; i < firstPath.length; i++) {
                console.log(firstPath[i].id);
            }
            console.log("END");
            let lastNode = firstPath[firstPath.length - 1];
            if (lastNode.id !== start) {
                ids = edges.getIds();
                for (let i = 0; i < ids.length; i++) {
                    edges.update({ id: ids[i], color: "blue" });
                }
                for (let i = 0; i < firstPath.length - 1; i++) {
                    let X = firstPath[i];
                    let Y = firstPath[i + 1];
                    let items = [];
                    items = edges.get({
                        filter: function(item) {
                            return (item.from === X.id && item.to === Y.id) || (item.from === Y.id && item.to === X.id);
                        }
                    });
                    edges.update({ id: items[0].id, color: "red" });
                }
                await sleep(SLEEP_TIME);
            }
            if (lastNode.id === finish) {
                break;
            }
            let neighborsCandidates = [];
            let edgesFilter = edges.get({
                filter: function(item) {
                    return item.from === lastNode.id || item.to === lastNode.id;
                }
            });
            for (let i = 0; i < edgesFilter.length; i++) {
                if (edgesFilter[i].from === lastNode.id) {
                    neighborsCandidates.push({ edgeId: edgesFilter[i].id, nodeId: edgesFilter[i].to });
                } else {
                    neighborsCandidates.push({ edgeId: edgesFilter[i].id, nodeId: edgesFilter[i].from });
                }
            }
            let neighbors = [];
            for (let i = 0; i < neighborsCandidates.length; i++) {
                let found = false;
                for (let j = 0; j < firstPath.length - 1; j++) {
                    if (neighborsCandidates[i].nodeId === firstPath[j].id) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    neighbors.push({
                        id: neighborsCandidates[i].nodeId,
                        value: GetEdgeHeuristicValue(neighborsCandidates[i].edgeId)
                    });
                }
            }
            //neighbors.sort((a, b) => a.value < b.value ? 1 : a.value > b.value ? -1 : 0);
            for (let i = 0; i < neighbors.length; i++) {
                let newPath = [...firstPath, { id: neighbors[i].id }];
                queue.push({
                    pathLine: newPath,
                    costLine: (cost + neighbors[i].value),
                    costLastNode: GetNodeHeuristicValue(neighbors[i].id)
                });
            }
            queue.sort((a, b) => a.costLine + a.costLastNode > b.costLine + b.costLastNode ? 1 : a.costLine + a.costLastNode < b.costLine + b.costLastNode ? -1 : 0);

            let textQueue = "<td>"
            textQueue += "<ul>";
            for (let i = 0; i < queue.length; i++) {
                textQueue += "<li>";
                let pomElement = queue[i].pathLine;
                for (let j = 0; j < pomElement.length - 1; j++) {
                    textQueue += pomElement[j].id;
                    textQueue += "-->";
                }
                textQueue += pomElement[pomElement.length - 1].id + " cost: " + queue[i].costLine + " value: " + pomElement[pomElement.length - 1].id + " = " + queue[i].costLastNode + "  cost+value = " + (queue[i].costLastNode + queue[i].costLine);
                textQueue += "</li>";
            }
            textQueue += "</ul>";
            textQueue += "</td>";
            textFull += textQueue;
            textFull += "</tr>";
            $("#table-summary tbody").append(textFull);
        }
        disbaleButtons(false);
        console.log("FINISHED A*");
    } catch (err) {
        console.log(err);
    }
}

function disbaleButtons(condition) {

    if (condition === true) {
        document.getElementById("node-add").disabled = true;
        document.getElementById("node-remove").disabled = true;
        document.getElementById("edge-add").disabled = true;
        document.getElementById("edge-remove").disabled = true;
        document.getElementById("start-algorithm").disabled = true;
        document.getElementById("clear").disabled = true;
        document.getElementById("destroy").disabled = true;
    } else {
        document.getElementById("node-add").disabled = false;
        document.getElementById("node-remove").disabled = false;
        document.getElementById("edge-add").disabled = false;
        document.getElementById("edge-remove").disabled = false;
        document.getElementById("start-algorithm").disabled = false;
        document.getElementById("clear").disabled = false;
        document.getElementById("destroy").disabled = false;
    }
}

function clearGraph() {
    let edgesIds = [];
    edgesIds = edges.getIds();
    for (let i = 0; i < edgesIds.length; i++) {
        edges.update({ "id": edgesIds[i], color: "blue", label: " " });
    }

    let nodesIds = [];
    nodesIds = nodes.getIds();
    for (var i = 0; i < nodesIds.length; i++) {
        nodes.update({ "id": nodesIds[i], color: "lightblue" });
    }
    $("#table-summary thead").empty();
    $("#table-summary tbody").empty();

}

function destroyGraph() {
    uniqueEdge = 1;
    edges.clear();
    nodes.clear();
    edgeValues = [];
    nodeValues = [];
    $("#nodes-table thead").empty();
    $("#nodes-table tbody").empty();
    $("#edges-table thead").empty();
    $("#edges-table tbody").empty();

    $("#table-summary thead").empty();
    $("#table-summary tbody").empty();
}